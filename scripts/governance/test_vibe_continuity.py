"""Tests for Vibe Engineering continuity checkpoint governance validator."""

from __future__ import annotations

import importlib.util
from pathlib import Path
import shutil
import tempfile
import unittest

import yaml


ROOT = Path(__file__).resolve().parents[2]
MODULE_PATH = ROOT / "scripts/governance/validate_vibe_continuity.py"

spec = importlib.util.spec_from_file_location(
    "validate_vibe_continuity",
    MODULE_PATH,
)
if spec is None or spec.loader is None:
    raise RuntimeError(f"Unable to load {MODULE_PATH}")
continuity = importlib.util.module_from_spec(spec)
spec.loader.exec_module(continuity)


class TestVibeContinuity(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_root = Path(self.temp_dir.name)

        # Set up minimal repository fixture
        checkpoint_src = ROOT / ".agents/continuity/checkpoint.yaml"
        checkpoint_dest = self.temp_root / ".agents/continuity/checkpoint.yaml"
        checkpoint_dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(checkpoint_src, checkpoint_dest)

        # Copy the read_first files
        for rel_path in (
            "AGENTS.md",
            "docs/engineering/vibe-engineering/README.md",
            "docs/engineering/vibe-engineering/session-protocol.md",
            "docs/governance/canonical-source-map.md",
        ):
            src = ROOT / rel_path
            dest = self.temp_root / rel_path
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dest)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def _reset_checkpoint(self) -> None:
        checkpoint_src = ROOT / ".agents/continuity/checkpoint.yaml"
        checkpoint_dest = self.temp_root / ".agents/continuity/checkpoint.yaml"
        shutil.copy2(checkpoint_src, checkpoint_dest)

    def _load_checkpoint(self) -> dict:
        checkpoint_file = self.temp_root / ".agents/continuity/checkpoint.yaml"
        return yaml.safe_load(checkpoint_file.read_text(encoding="utf-8"))

    def _save_checkpoint(self, data: dict) -> None:
        checkpoint_file = self.temp_root / ".agents/continuity/checkpoint.yaml"
        checkpoint_file.write_text(yaml.safe_dump(data, sort_keys=False), encoding="utf-8")

    def test_baseline_checkpoint_passes(self) -> None:
        """Test 1: Baseline checkpoint passes."""
        checkpoint = self._load_checkpoint()
        result = continuity.validate(self.temp_root)

        self.assertEqual(
            result["milestones"],
            len(checkpoint["program"]["completed_milestones"]),
        )

        self.assertEqual(
            result["read_first_paths"],
            len(checkpoint["recovery"]["read_first"]),
        )

        self.assertEqual(
            result["deferred_layers"],
            len(checkpoint["deferred_layers"]),
        )

        self.assertTrue(result["snapshot_semantics"])

    def test_missing_required_top_level_field_fails(self) -> None:
        """Test 2: Missing required top-level field fails."""
        data = self._load_checkpoint()
        del data["program"]
        self._save_checkpoint(data)

        with self.assertRaisesRegex(ValueError, "Missing required top-level fields"):
            continuity.validate(self.temp_root)

    def test_malformed_capture_observed_main_fails(self) -> None:
        """Test 3: Malformed capture.observed_main fails."""
        data = self._load_checkpoint()
        data["capture"]["observed_main"] = "not-a-valid-sha"
        self._save_checkpoint(data)

        with self.assertRaisesRegex(
            ValueError, "capture.observed_main must be lowercase 40-character hex SHA"
        ):
            continuity.validate(self.temp_root)

    def test_malformed_milestone_integration_sha_fails(self) -> None:
        """Test 4: Malformed milestone integration SHA fails."""
        data = self._load_checkpoint()
        data["program"]["completed_milestones"][0]["integration_sha"] = "BAD_SHA_12345"
        self._save_checkpoint(data)

        with self.assertRaisesRegex(
            ValueError, "integration_sha must be lowercase 40-character hex SHA"
        ):
            continuity.validate(self.temp_root)

    def test_duplicate_milestone_label_fails(self) -> None:
        """Test 5: Duplicate milestone label fails."""
        data = self._load_checkpoint()
        dup_label = data["program"]["completed_milestones"][0]["label"]
        data["program"]["completed_milestones"][1]["label"] = dup_label
        self._save_checkpoint(data)

        with self.assertRaisesRegex(ValueError, "Duplicate milestone label found"):
            continuity.validate(self.temp_root)

    def test_forbidden_live_state_key_fails(self) -> None:
        """Test 6: Forbidden live-state key such as: current_main: ... fails."""
        data = self._load_checkpoint()
        data["current_main"] = "f767fd141513d4c8761ab0fc05be34736fa0f5ab"
        self._save_checkpoint(data)

        with self.assertRaisesRegex(
            ValueError,
            "continuity checkpoint stores observed snapshot state, not live repository state",
        ):
            continuity.validate(self.temp_root)

        # Also test nested forbidden key
        self._reset_checkpoint()
        data = self._load_checkpoint()
        data["program"]["live_head"] = "f767fd141513d4c8761ab0fc05be34736fa0f5ab"
        self._save_checkpoint(data)

        with self.assertRaisesRegex(
            ValueError,
            "continuity checkpoint stores observed snapshot state, not live repository state",
        ):
            continuity.validate(self.temp_root)

    def test_missing_recovery_read_first_path_fails(self) -> None:
        """Test 7: Missing/nonexistent recovery.read_first path fails."""
        # Remove an existing referenced file
        agents_file = self.temp_root / "AGENTS.md"
        agents_file.unlink()

        with self.assertRaisesRegex(
            ValueError, "recovery.read_first path does not exist"
        ):
            continuity.validate(self.temp_root)

    def test_invalid_result_or_security_posture_fails(self) -> None:
        """Test 8: Invalid VE_POST_MERGE.* result or invalid security-posture type fails."""
        # Test invalid milestone result
        data = self._load_checkpoint()
        data["program"]["completed_milestones"][0]["result"] = "VE_POST_MERGE.COMPLETED"
        self._save_checkpoint(data)

        with self.assertRaisesRegex(ValueError, "result must be one of"):
            continuity.validate(self.temp_root)

        # Reset and test invalid security posture privileged runner
        self._reset_checkpoint()
        data = self._load_checkpoint()
        data["security_posture"]["privileged_runner"] = "ENABLED_UNKNOWN"
        self._save_checkpoint(data)

        with self.assertRaisesRegex(
            ValueError, "security_posture.privileged_runner must be one of"
        ):
            continuity.validate(self.temp_root)

        # Reset and test invalid security posture boolean
        self._reset_checkpoint()
        data = self._load_checkpoint()
        data["security_posture"]["remote_mutation_enabled"] = "false"  # string instead of boolean
        self._save_checkpoint(data)

        with self.assertRaisesRegex(
            ValueError, "security_posture.remote_mutation_enabled must be a boolean"
        ):
            continuity.validate(self.temp_root)


if __name__ == "__main__":
    unittest.main()
