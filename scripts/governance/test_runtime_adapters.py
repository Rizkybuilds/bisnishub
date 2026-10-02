"""Mutation tests for engineering runtime adapters."""

import importlib.util
import json
import re
import shutil
import tempfile
import unittest
from pathlib import Path

import yaml


spec = importlib.util.spec_from_file_location(
    "runtime_adapters",
    Path(__file__).with_name(
        "validate_runtime_adapters.py"
    ),
)

runtime_adapters = (
    importlib.util.module_from_spec(
        spec
    )
)

spec.loader.exec_module(
    runtime_adapters
)


class RuntimeAdapterValidationTests(
    unittest.TestCase
):
    def setUp(self):
        self.temp = (
            tempfile.TemporaryDirectory(
                prefix="runtime-adapter-test-"
            )
        )

        self.addCleanup(
            self.temp.cleanup
        )

        self.root = Path(
            self.temp.name
        )

        for relative in (
            ".agents",
            "docs",
            "systems/mgbos/docs",
        ):
            source = (
                runtime_adapters.ROOT
                / relative
            )

            destination = (
                self.root
                / relative
            )

            shutil.copytree(
                source,
                destination,
            )

        for relative in (
            "AGENTS.md",
            "systems/mgbos/AGENTS.md",
        ):
            source = (
                runtime_adapters.ROOT
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

    def edit_yaml(
        self,
        relative,
        update,
    ):
        path = (
            self.root
            / relative
        )

        data = yaml.safe_load(
            path.read_text(
                encoding="utf-8"
            )
        )

        update(
            data
        )

        path.write_text(
            yaml.safe_dump(
                data,
                sort_keys=False,
                allow_unicode=True,
            ),
            encoding="utf-8",
        )

    def edit_json(
        self,
        relative,
        update,
    ):
        path = (
            self.root
            / relative
        )

        data = json.loads(
            path.read_text(
                encoding="utf-8"
            )
        )

        update(
            data
        )

        path.write_text(
            json.dumps(
                data,
                indent=2,
            ),
            encoding="utf-8",
        )

    def test_valid_baseline(
        self
    ):
        result = (
            runtime_adapters.validate(
                self.root
            )
        )

        self.assertEqual(
            result[
                "providers"
            ],
            2,
        )

        self.assertEqual(
            result[
                "adapter_files"
            ],
            2,
        )

        self.assertEqual(
            result[
                "runtime_eval_cases"
            ],
            6,
        )

    def test_provider_policy_authority_rejected(
        self
    ):
        self.edit_yaml(
            ".agents/adapters/registry.yaml",
            lambda data: data[
                "shared"
            ].update(
                provider_policy_authority=True
            ),
        )

        with self.assertRaisesRegex(
            ValueError,
            "provider_policy_authority",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_direct_runtime_rpc_assumption_rejected(
        self
    ):
        self.edit_yaml(
            ".agents/adapters/registry.yaml",
            lambda data: data[
                "shared"
            ].update(
                direct_runtime_rpc_assumed=True
            ),
        )

        with self.assertRaisesRegex(
            ValueError,
            "direct_runtime_rpc_assumed",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_runtime_switch_independence_rejected(
        self
    ):
        self.edit_yaml(
            ".agents/adapters/registry.yaml",
            lambda data: data[
                "cross_runtime"
            ].update(
                runtime_switch_implies_independence=True
            ),
        )

        with self.assertRaisesRegex(
            ValueError,
            "must not imply independent",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_shared_mutable_worktree_rejected(
        self
    ):
        self.edit_yaml(
            ".agents/adapters/registry.yaml",
            lambda data: data[
                "cross_runtime"
            ].update(
                shared_mutable_worktree_allowed=True
            ),
        )

        with self.assertRaisesRegex(
            ValueError,
            "must not share mutable",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_missing_antigravity_rule_rejected(
        self
    ):
        (
            self.root
            / ".agents/rules/"
            "engineering-control-plane.md"
        ).unlink()

        with self.assertRaisesRegex(
            ValueError,
            "must contain at least one",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_rule_requires_frontmatter(
        self
    ):
        path = (
            self.root
            / ".agents/rules/"
            "engineering-control-plane.md"
        )

        text = path.read_text(
            encoding="utf-8"
        )

        if text.startswith("---\n"):
            _, _, remainder = (
                text.split(
                    "---",
                    2,
                )
            )

            path.write_text(
                remainder.lstrip(
                    "\n"
                ),
                encoding="utf-8",
            )

        with self.assertRaisesRegex(
            ValueError,
            "rule must contain YAML frontmatter",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_rule_invalid_trigger_rejected(
        self
    ):
        path = (
            self.root
            / ".agents/rules/"
            "engineering-control-plane.md"
        )

        path.write_text(
            path.read_text(
                encoding="utf-8"
            ).replace(
                "trigger: always_on",
                "trigger: alwaysOn",
                1,
            ),
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "Invalid Antigravity rule trigger",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_model_decision_rule_requires_description(
        self
    ):
        path = (
            self.root
            / ".agents/rules/"
            "engineering-control-plane.md"
        )

        text = path.read_text(
            encoding="utf-8"
        )

        text = text.replace(
            "trigger: always_on",
            "trigger: model_decision",
            1,
        )

        text = re.sub(
            r"(?m)^description:.*\n",
            "",
            text,
            count=1,
        )

        path.write_text(
            text,
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "model_decision rule requires description",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_glob_rule_requires_exactly_one_glob_field(
        self
    ):
        path = (
            self.root
            / ".agents/rules/"
            "engineering-control-plane.md"
        )

        path.write_text(
            path.read_text(
                encoding="utf-8"
            ).replace(
                "trigger: always_on",
                "trigger: glob",
                1,
            ),
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "glob rule requires exactly one",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_rule_unknown_frontmatter_key_rejected(
        self
    ):
        path = (
            self.root
            / ".agents/rules/"
            "engineering-control-plane.md"
        )

        path.write_text(
            path.read_text(
                encoding="utf-8"
            ).replace(
                "trigger: always_on\n",
                (
                    "trigger: always_on\n"
                    "unexpected: true\n"
                ),
                1,
            ),
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "Unsupported Antigravity rule frontmatter keys",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_control_plane_rule_must_remain_always_on(
        self
    ):
        path = (
            self.root
            / ".agents/rules/"
            "engineering-control-plane.md"
        )

        path.write_text(
            path.read_text(
                encoding="utf-8"
            ).replace(
                "trigger: always_on",
                "trigger: manual",
                1,
            ),
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "rule must remain always_on",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_workflow_requires_frontmatter(
        self
    ):
        path = (
            self.root
            / ".agents/workflows/"
            "mgbos.change.md"
        )

        text = path.read_text(
            encoding="utf-8"
        )

        if text.startswith("---\n"):
            _, _, remainder = (
                text.split(
                    "---",
                    2,
                )
            )

            path.write_text(
                remainder.lstrip(
                    "\n"
                ),
                encoding="utf-8",
            )

        with self.assertRaisesRegex(
            ValueError,
            "workflow must contain YAML frontmatter",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_missing_safety_marker_rejected(
        self
    ):
        rule_path = (
            self.root
            / ".agents/rules/"
            "engineering-control-plane.md"
        )

        workflow_path = (
            self.root
            / ".agents/workflows/"
            "mgbos.change.md"
        )

        for path in (
            rule_path,
            workflow_path,
        ):
            path.write_text(
                path.read_text(
                    encoding="utf-8"
                ).replace(
                    "SELF_REVIEW",
                    "SEQUENTIAL_REVIEW",
                ),
                encoding="utf-8",
            )

        with self.assertRaisesRegex(
            ValueError,
            "safety marker",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_provider_adapter_cannot_claim_canonical_authority(
        self
    ):
        path = (
            self.root
            / ".agents/rules/"
            "engineering-control-plane.md"
        )

        path.write_text(
            (
                path.read_text(
                    encoding="utf-8"
                )
                + "\ncanonical_id: bad.provider.policy\n"
            ),
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "must not declare canonical authority",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_missing_runtime_eval_rejected(
        self
    ):
        def mutate(data):
            data[
                "cases"
            ] = [
                case
                for case
                in data[
                    "cases"
                ]
                if case[
                    "id"
                ]
                != "runtime-payment-r5-routing"
            ]

        self.edit_json(
            ".agents/evals/baseline.json",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Missing required runtime",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_unknown_runtime_target_rejected(
        self
    ):
        def mutate(data):
            for case in data[
                "cases"
            ]:
                if (
                    case[
                        "id"
                    ]
                    == "runtime-ui-r1-proportionality"
                ):
                    case[
                        "runtime_targets"
                    ].append(
                        "imaginary-runtime"
                    )

        self.edit_json(
            ".agents/evals/baseline.json",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "unknown runtime target",
        ):
            runtime_adapters.validate(
                self.root
            )

    def test_overlapping_writer_eval_must_cover_antigravity(
        self
    ):
        def mutate(data):
            for case in data[
                "cases"
            ]:
                if (
                    case[
                        "id"
                    ]
                    == "runtime-overlapping-writers"
                ):
                    case[
                        "runtime_targets"
                    ] = [
                        "codex"
                    ]

        self.edit_json(
            ".agents/evals/baseline.json",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "must cover Antigravity",
        ):
            runtime_adapters.validate(
                self.root
            )


if __name__ == "__main__":
    unittest.main()