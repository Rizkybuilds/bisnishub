"""Mutation tests for Codex and Antigravity provider enforcement wiring."""

from __future__ import annotations

import importlib.util
import json
import shutil
import tempfile
import unittest
from pathlib import Path


ROOT = (
    Path(__file__)
    .resolve()
    .parents[2]
)

VALIDATOR_PATH = (
    ROOT
    / "scripts/governance/"
    "validate_provider_enforcement.py"
)

LAUNCHER_PATH = (
    ROOT
    / "tools/engineering_gateway/"
    "launch.py"
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


validator = load_module(
    "provider_enforcement",
    VALIDATOR_PATH,
)

launcher = load_module(
    "engineering_gateway_launcher",
    LAUNCHER_PATH,
)


class ProviderEnforcementTests(
    unittest.TestCase
):
    def setUp(
        self,
    ) -> None:
        self.temp = (
            tempfile
            .TemporaryDirectory(
                prefix=
                    "provider-enforcement-test-"
            )
        )

        self.addCleanup(
            self.temp.cleanup
        )

        self.root = Path(
            self.temp.name
        )

        files = (
            ".codex/config.toml",
            ".agents/mcp_config.json",
            (
                "tools/engineering_gateway/"
                "launch.py"
            ),
            (
                "tools/engineering_gateway/"
                "server.py"
            ),
        )

        for relative in files:
            source = (
                ROOT
                / relative
            )

            destination = (
                self.root
                / relative
            )

            destination.parent.mkdir(
                parents=True,
                exist_ok=True,
            )

            shutil.copyfile(
                source,
                destination,
            )

    def test_valid_baseline(
        self,
    ) -> None:
        result = validator.validate(
            self.root
        )

        self.assertTrue(
            result[
                "codex_gateway"
            ]
        )

        self.assertFalse(
            result[
                "codex_gateway_required"
            ]
        )

        self.assertTrue(
            result[
                "lazy_trusted_session"
            ]
        )

        self.assertTrue(
            result[
                "antigravity_gateway"
            ]
        )

    def test_codex_gateway_must_not_be_startup_fatal(
        self,
    ) -> None:
        path = (
            self.root
            / ".codex/config.toml"
        )

        value = path.read_text(
            encoding="utf-8"
        )

        value = value.replace(
            "required = false",
            "required = true",
        )

        path.write_text(
            value,
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            (
                "must not be a fatal "
                "thread-start dependency"
            ),
        ):
            validator.validate(
                self.root
            )

    def test_codex_danger_full_access_rejected(
        self,
    ) -> None:
        path = (
            self.root
            / ".codex/config.toml"
        )

        value = path.read_text(
            encoding="utf-8"
        )

        value = value.replace(
            (
                'sandbox_mode = '
                '"workspace-write"'
            ),
            (
                'sandbox_mode = '
                '"danger-full-access"'
            ),
        )

        path.write_text(
            value,
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "workspace-write",
        ):
            validator.validate(
                self.root
            )

    def test_codex_network_enable_rejected(
        self,
    ) -> None:
        path = (
            self.root
            / ".codex/config.toml"
        )

        value = path.read_text(
            encoding="utf-8"
        )

        value = value.replace(
            "network_access = false",
            "network_access = true",
        )

        path.write_text(
            value,
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "network access",
        ):
            validator.validate(
                self.root
            )

    def test_codex_extra_mcp_server_rejected(
        self,
    ) -> None:
        path = (
            self.root
            / ".codex/config.toml"
        )

        with path.open(
            "a",
            encoding="utf-8",
        ) as handle:
            handle.write(
                (
                    "\n[mcp_servers.github]\n"
                    'command = "github-mcp"\n'
                )
            )

        with self.assertRaisesRegex(
            ValueError,
            "only the BisnisHub",
        ):
            validator.validate(
                self.root
            )

    def test_antigravity_extra_mcp_rejected(
        self,
    ) -> None:
        path = (
            self.root
            / ".agents/mcp_config.json"
        )

        value = json.loads(
            path.read_text(
                encoding="utf-8"
            )
        )

        value[
            "mcpServers"
        ][
            "github"
        ] = {
            "command":
                "github-mcp",
        }

        path.write_text(
            json.dumps(
                value,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "only the governed gateway",
        ):
            validator.validate(
                self.root
            )

    def test_antigravity_dangerous_flag_rejected(
        self,
    ) -> None:
        with self.assertRaisesRegex(
            ValueError,
            (
                "dangerously-skip-"
                "permissions"
            ),
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

    def test_antigravity_sandbox_is_added(
        self,
    ) -> None:
        command = (
            launcher
            .build_provider_command(
                "antigravity",
                [],
            )
        )

        self.assertEqual(
            command[
                0
            ],
            "agy",
        )

        self.assertIn(
            "--sandbox",
            command,
        )

    def test_codex_dangerous_sandbox_override_rejected(
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

    def test_codex_never_approval_override_rejected(
        self,
    ) -> None:
        with self.assertRaisesRegex(
            ValueError,
            "approval_policy",
        ):
            launcher.build_provider_command(
                "codex",
                [
                    "-c",
                    "approval_policy=never",
                ],
            )


if __name__ == "__main__":
    unittest.main()