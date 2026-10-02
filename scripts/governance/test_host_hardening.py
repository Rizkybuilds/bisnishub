"""Mutation tests for CP-006C host hardening."""

from __future__ import annotations

import importlib.util
import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import yaml


ROOT = (
    Path(__file__)
    .resolve()
    .parents[2]
)


def load_module(
    name: str,
    path: Path,
):
    spec = (
        importlib.util
        .spec_from_file_location(
            name,
            path,
        )
    )

    if (
        spec is None
        or spec.loader
        is None
    ):
        raise RuntimeError(
            (
                "Unable to load "
                f"{path}"
            )
        )

    module = (
        importlib.util
        .module_from_spec(
            spec
        )
    )

    spec.loader.exec_module(
        module
    )

    return module


launcher = load_module(
    "engineering_gateway_launcher",
    ROOT
    / "tools/engineering_gateway/"
    "launch.py",
)

validator = load_module(
    "host_hardening_validator",
    ROOT
    / "scripts/governance/"
    "validate_host_hardening.py",
)


class HostHardeningTests(
    unittest.TestCase
):
    def test_secret_environment_not_forwarded(
        self,
    ) -> None:
        policy = yaml.safe_load(
            (
                ROOT
                / ".agents/gateway/"
                "host-policy.yaml"
            )
            .read_text(
                encoding="utf-8"
            )
        )

        with tempfile.TemporaryDirectory() as directory:
            session_path = (
                Path(
                    directory
                )
                / "session.json"
            )

            with patch.dict(
                os.environ,
                {
                    "PATH":
                        os.environ.get(
                            "PATH",
                            "",
                        ),

                    "HOME":
                        str(
                            Path.home()
                        ),

                    "OPENAI_API_KEY":
                        "must-not-leak",

                    "GITHUB_TOKEN":
                        "must-not-leak",

                    "DATABASE_URL":
                        "must-not-leak",
                },
                clear=True,
            ):
                env = (
                    launcher
                    .safe_provider_environment(
                        policy,
                        session_path,
                    )
                )

        self.assertIn(
            "PATH",
            env,
        )

        self.assertNotIn(
            "OPENAI_API_KEY",
            env,
        )

        self.assertNotIn(
            "GITHUB_TOKEN",
            env,
        )

        self.assertNotIn(
            "DATABASE_URL",
            env,
        )

        self.assertEqual(
            env[
                launcher.SESSION_ENV
            ],
            str(
                session_path
            ),
        )

    def test_antigravity_permission_bypass_rejected(
        self,
    ) -> None:
        with self.assertRaisesRegex(
            ValueError,
            "dangerously-skip-permissions",
        ):
            launcher.build_provider_command(
                "antigravity",
                [
                    (
                        "--dangerously-"
                        "skip-permissions"
                    )
                ],
            )

    def test_codex_danger_full_access_rejected(
        self,
    ) -> None:
        with self.assertRaisesRegex(
            ValueError,
            "danger-full-access",
        ):
            launcher.build_provider_command(
                "codex",
                [
                    "--sandbox",
                    "danger-full-access",
                ],
            )

    def test_codex_full_auto_rejected(
        self,
    ) -> None:
        with self.assertRaisesRegex(
            ValueError,
            "full-auto",
        ):
            launcher.build_provider_command(
                "codex",
                [
                    "--full-auto"
                ],
            )

    def test_engineer_on_main_is_rejected(
        self,
    ) -> None:
        policy = yaml.safe_load(
            (
                ROOT
                / ".agents/gateway/"
                "host-policy.yaml"
            )
            .read_text(
                encoding="utf-8"
            )
        )

        state = {
            "path":
                str(
                    ROOT
                ),

            "branch":
                "main",

            "head":
                "a" * 40,

            "dirty":
                False,

            "dirty_fingerprint":
                (
                    "sha256:"
                    + "0" * 64
                ),
        }

        with self.assertRaisesRegex(
            ValueError,
            "non-main",
        ):
            launcher.check_workspace_policy(
                "engineer",
                state,
                policy,
            )

    def test_engineer_dirty_start_is_rejected(
        self,
    ) -> None:
        policy = yaml.safe_load(
            (
                ROOT
                / ".agents/gateway/"
                "host-policy.yaml"
            )
            .read_text(
                encoding="utf-8"
            )
        )

        state = {
            "path":
                str(
                    ROOT
                ),

            "branch":
                "feat/test",

            "head":
                "a" * 40,

            "dirty":
                True,

            "dirty_fingerprint":
                (
                    "sha256:"
                    + "1" * 64
                ),
        }

        with self.assertRaisesRegex(
            ValueError,
            "clean worktree",
        ):
            launcher.check_workspace_policy(
                "engineer",
                state,
                policy,
            )

    def test_kill_switch_blocks_launch(
        self,
    ) -> None:
        policy = yaml.safe_load(
            (
                ROOT
                / ".agents/gateway/"
                "host-policy.yaml"
            )
            .read_text(
                encoding="utf-8"
            )
        )

        with tempfile.TemporaryDirectory() as directory:
            home = Path(
                directory
            )

            path = (
                launcher
                .kill_switch_path(
                    home,
                    policy,
                )
            )

            path.parent.mkdir(
                parents=True,
                exist_ok=True,
            )

            path.write_text(
                json.dumps(
                    {
                        "schema_version":
                            1,

                        "state":
                            "DISABLED",

                        "reason":
                            "incident",
                    }
                ),
                encoding="utf-8",
            )

            with self.assertRaisesRegex(
                ValueError,
                "kill switch",
            ):
                launcher.enforce_kill_switch(
                    home,
                    policy,
                )

    def test_workspace_lock_is_exclusive(
        self,
    ) -> None:
        policy = yaml.safe_load(
            (
                ROOT
                / ".agents/gateway/"
                "host-policy.yaml"
            )
            .read_text(
                encoding="utf-8"
            )
        )

        with tempfile.TemporaryDirectory() as directory:
            home = Path(
                directory
            )

            first = (
                launcher
                .acquire_workspace_lock(
                    home,
                    ROOT,
                    "EGS-one",
                    "engineer",
                    policy,
                )
            )

            try:
                with self.assertRaisesRegex(
                    ValueError,
                    "active/stale",
                ):
                    launcher.acquire_workspace_lock(
                        home,
                        ROOT,
                        "EGS-two",
                        "qa",
                        policy,
                    )

            finally:
                launcher.release_workspace_lock(
                    first
                )

    def test_host_policy_baseline_valid(
        self,
    ) -> None:
        result = (
            validator.validate(
                ROOT
            )
        )

        self.assertEqual(
            result[
                "privileged_runner"
            ],
            "DISABLED",
        )

        self.assertFalse(
            result[
                "remote_mutation"
            ]
        )

        self.assertFalse(
            result[
                "production_execution"
            ]
        )


    def test_content_change_with_same_status_shape_changes_fingerprint(
        self,
    ) -> None:
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            subprocess.run(
                ["git", "-C", str(repo), "init"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=True,
            )
            subprocess.run(
                ["git", "-C", str(repo), "config", "user.email", "test@example.com"],
                check=True,
            )
            subprocess.run(
                ["git", "-C", str(repo), "config", "user.name", "Test User"],
                check=True,
            )
            tracked_file = repo / "tracked.txt"
            tracked_file.write_text("initial content\n", encoding="utf-8")
            subprocess.run(
                ["git", "-C", str(repo), "add", "tracked.txt"],
                check=True,
            )
            subprocess.run(
                ["git", "-C", str(repo), "commit", "-m", "init"],
                check=True,
            )

            tracked_file.write_text("content B\n", encoding="utf-8")
            state_b = launcher.workspace_state(repo)
            status_b = subprocess.run(
                ["git", "-C", str(repo), "status", "--porcelain=v1"],
                stdout=subprocess.PIPE,
                text=True,
                check=True,
            ).stdout.strip()
            fp_b = state_b["dirty_fingerprint"]

            tracked_file.write_text("content C\n", encoding="utf-8")
            state_c = launcher.workspace_state(repo)
            status_c = subprocess.run(
                ["git", "-C", str(repo), "status", "--porcelain=v1"],
                stdout=subprocess.PIPE,
                text=True,
                check=True,
            ).stdout.strip()
            fp_c = state_c["dirty_fingerprint"]

            self.assertEqual(status_b, status_c)
            self.assertEqual(status_b, "M tracked.txt")
            self.assertNotEqual(fp_b, fp_c)


if __name__ == "__main__":
    unittest.main()
