"""Tests for CI workflow supply-chain governance policies."""

from __future__ import annotations

import importlib.util
from pathlib import Path
import shutil
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
MODULE_PATH = ROOT / "scripts/governance/validate_ci_supply_chain.py"

spec = importlib.util.spec_from_file_location(
    "validate_ci_supply_chain",
    MODULE_PATH,
)
if spec is None or spec.loader is None:
    raise RuntimeError(f"Unable to load {MODULE_PATH}")
supply_chain = importlib.util.module_from_spec(spec)
spec.loader.exec_module(supply_chain)


class TestCISupplyChain(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_root = Path(self.temp_dir.name)
        workflows_src = ROOT / ".github" / "workflows"
        workflows_dest = self.temp_root / ".github" / "workflows"
        workflows_dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(workflows_src, workflows_dest)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_baseline_passes(self) -> None:
        result = supply_chain.validate(self.temp_root)
        self.assertEqual(
            result,
            {
                "workflows": 5,
                "external_action_uses": 17,
                "checkout_steps": 7,
                "allowed_action_repositories": 5,
            },
        )

    def test_mutable_tag_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        modified = content.replace(
            "actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6",
            "actions/checkout@v6",
            1,
        )
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "full 40-character commit SHA",
        ):
            supply_chain.validate(self.temp_root)

    def test_short_sha_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        modified = content.replace(
            "actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6",
            "actions/checkout@d23441a",
            1,
        )
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "full 40-character commit SHA",
        ):
            supply_chain.validate(self.temp_root)

    def test_unapproved_action_repository_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        modified = content.replace(
            "actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # v6",
            "attacker/example@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            1,
        )
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "Unapproved external action repository",
        ):
            supply_chain.validate(self.temp_root)

    def test_checkout_persisted_credentials_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        modified = content.replace(
            "persist-credentials: false",
            "persist-credentials: true",
            1,
        )
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "checkout credential persistence",
        ):
            supply_chain.validate(self.temp_root)

    def test_workflow_write_permission_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        modified = content.replace(
            "contents: read",
            "contents: write",
            1,
        )
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "top-level 'permissions: contents: read'",
        ):
            supply_chain.validate(self.temp_root)

    def test_job_level_permission_override_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        target_str = "  agent-governance:\n"
        replacement_str = "  agent-governance:\n    permissions:\n      contents: write\n"
        if target_str not in content:
            target_str = "  agent-governance:\r\n"
            replacement_str = "  agent-governance:\r\n    permissions:\r\n      contents: write\r\n"
        modified = content.replace(target_str, replacement_str, 1)
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "job-level permission override",
        ):
            supply_chain.validate(self.temp_root)


if __name__ == "__main__":
    unittest.main()
