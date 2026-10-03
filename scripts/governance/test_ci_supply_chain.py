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

    def test_reusable_workflow_job_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        fixture = (
            "\n  supply-chain-bypass:\n"
            "    uses: attacker/example/.github/workflows/build.yml@main\n"
        )
        modified = content + fixture
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "Reusable workflow",
        ):
            supply_chain.validate(self.temp_root)

    def test_local_action_reference_rejected(self) -> None:
        action_dir = self.temp_root / ".github/actions/supply-chain-bypass"
        action_dir.mkdir(parents=True, exist_ok=True)
        action_file = action_dir / "action.yml"
        action_file.write_text(
            "name: Supply Chain Bypass\n"
            "description: Test fixture\n"
            "runs:\n"
            "  using: composite\n"
            "  steps:\n"
            "    - uses: attacker/example@main\n",
            encoding="utf-8",
        )

        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        target_str = "    steps:\n"
        replacement_str = (
            "    steps:\n"
            "      - uses: ./.github/actions/supply-chain-bypass\n"
        )
        if target_str not in content:
            target_str = "    steps:\r\n"
            replacement_str = (
                "    steps:\r\n"
                "      - uses: ./.github/actions/supply-chain-bypass\r\n"
            )
        modified = content.replace(target_str, replacement_str, 1)
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "Local action",
        ):
            supply_chain.validate(self.temp_root)

    def test_checkout_unauthorized_inputs_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        unauthorized_inputs = (
            "repository",
            "ref",
            "token",
            "ssh-key",
            "github-server-url",
            "submodules",
        )
        for input_key in unauthorized_inputs:
            with self.subTest(input_key=input_key):
                modified = content.replace(
                    "persist-credentials: false\n",
                    f"persist-credentials: false\n          {input_key}: invalid_val\n",
                    1,
                )
                if modified == content:
                    modified = content.replace(
                        "persist-credentials: false\r\n",
                        f"persist-credentials: false\r\n          {input_key}: invalid_val\r\n",
                        1,
                    )
                target.write_text(modified, encoding="utf-8")
                with self.assertRaisesRegex(
                    ValueError,
                    "Unapproved action input",
                ):
                    supply_chain.validate(self.temp_root)
                target.write_text(content, encoding="utf-8")

    def test_setup_node_mirror_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        target_str = "node-version-file: systems/mgbos/.node-version\n"
        replacement_str = (
            "node-version-file: systems/mgbos/.node-version\n"
            "          mirror: https://attacker.example\n"
        )
        if target_str not in content:
            target_str = "node-version-file: systems/mgbos/.node-version\r\n"
            replacement_str = (
                "node-version-file: systems/mgbos/.node-version\r\n"
                "          mirror: https://attacker.example\r\n"
            )
        modified = content.replace(target_str, replacement_str, 1)
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "Unapproved action input",
        ):
            supply_chain.validate(self.temp_root)

    def test_self_hosted_runner_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        modified = content.replace(
            "runs-on: ubuntu-24.04",
            "runs-on: self-hosted",
            1,
        )
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "runner baseline",
        ):
            supply_chain.validate(self.temp_root)

    def test_job_container_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        target_str = "  agent-governance:\n"
        replacement_str = (
            "  agent-governance:\n"
            "    container:\n"
            "      image: attacker/example:latest\n"
        )
        if target_str not in content:
            target_str = "  agent-governance:\r\n"
            replacement_str = (
                "  agent-governance:\r\n"
                "    container:\r\n"
                "      image: attacker/example:latest\r\n"
            )
        modified = content.replace(target_str, replacement_str, 1)
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "job container not permitted",
        ):
            supply_chain.validate(self.temp_root)

    def test_service_container_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        target_str = "  agent-governance:\n"
        replacement_str = (
            "  agent-governance:\n"
            "    services:\n"
            "      attacker:\n"
            "        image: attacker/example:latest\n"
        )
        if target_str not in content:
            target_str = "  agent-governance:\r\n"
            replacement_str = (
                "  agent-governance:\r\n"
                "    services:\r\n"
                "      attacker:\r\n"
                "        image: attacker/example:latest\r\n"
            )
        modified = content.replace(target_str, replacement_str, 1)
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "service container not permitted",
        ):
            supply_chain.validate(self.temp_root)

    def test_secret_context_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        target_str = "    steps:\n"
        replacement_str = (
            "    steps:\n"
            "      - run: echo 'test'\n"
            "        env:\n"
            "          TOKEN: ${{ secrets.PAT }}\n"
        )
        if target_str not in content:
            target_str = "    steps:\r\n"
            replacement_str = (
                "    steps:\r\n"
                "      - run: echo 'test'\r\n"
                "        env:\r\n"
                "          TOKEN: ${{ secrets.PAT }}\r\n"
            )
        modified = content.replace(target_str, replacement_str, 1)
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "secret context",
        ):
            supply_chain.validate(self.temp_root)

    def test_job_environment_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        target_str = "  agent-governance:\n"
        replacement_str = (
            "  agent-governance:\n"
            "    environment: production\n"
        )
        if target_str not in content:
            target_str = "  agent-governance:\r\n"
            replacement_str = (
                "  agent-governance:\r\n"
                "    environment: production\r\n"
            )
        modified = content.replace(target_str, replacement_str, 1)
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "job environment not permitted",
        ):
            supply_chain.validate(self.temp_root)

    def test_secret_index_syntax_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        target_str = "    steps:\n"
        replacement_str = (
            "    steps:\n"
            "      - run: echo 'test'\n"
            "        env:\n"
            "          TOKEN: ${{ secrets['PAT'] }}\n"
        )
        if target_str not in content:
            target_str = "    steps:\r\n"
            replacement_str = (
                "    steps:\r\n"
                "      - run: echo 'test'\r\n"
                "        env:\r\n"
                "          TOKEN: ${{ secrets['PAT'] }}\r\n"
            )
        modified = content.replace(target_str, replacement_str, 1)
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "secret context",
        ):
            supply_chain.validate(self.temp_root)

    def test_bare_secrets_object_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        target_str = "    steps:\n"
        replacement_str = (
            "    steps:\n"
            "      - run: echo 'test'\n"
            "        env:\n"
            "          ALL_SECRETS: ${{ toJSON(secrets) }}\n"
        )
        if target_str not in content:
            target_str = "    steps:\r\n"
            replacement_str = (
                "    steps:\r\n"
                "      - run: echo 'test'\r\n"
                "        env:\r\n"
                "          ALL_SECRETS: ${{ toJSON(secrets) }}\r\n"
            )
        modified = content.replace(target_str, replacement_str, 1)
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "secret context",
        ):
            supply_chain.validate(self.temp_root)

    def test_action_step_env_rejected(self) -> None:
        target = self.temp_root / ".github/workflows/agent-governance.yml"
        content = target.read_text(encoding="utf-8")
        target_str = "        with:\n          persist-credentials: false\n"
        replacement_str = (
            "        env:\n"
            "          HTTPS_PROXY: http://proxy.local:8080\n"
            "        with:\n"
            "          persist-credentials: false\n"
        )
        if target_str not in content:
            target_str = "        with:\r\n          persist-credentials: false\r\n"
            replacement_str = (
                "        env:\r\n"
                "          HTTPS_PROXY: http://proxy.local:8080\r\n"
                "        with:\r\n"
                "          persist-credentials: false\r\n"
            )
        modified = content.replace(target_str, replacement_str, 1)
        self.assertNotEqual(content, modified)
        target.write_text(modified, encoding="utf-8")

        with self.assertRaisesRegex(
            ValueError,
            "Action step environment",
        ):
            supply_chain.validate(self.temp_root)


if __name__ == "__main__":
    unittest.main()
