"""Mutation tests exercise governance failure modes, not matching policy prose."""

import copy
import importlib.util
import json
import shutil
import tempfile
import unittest
from pathlib import Path

import yaml


spec = importlib.util.spec_from_file_location(
    "governance",
    Path(__file__).with_name(
        "validate-agent-governance.py"
    ),
)

governance = importlib.util.module_from_spec(
    spec
)

spec.loader.exec_module(
    governance
)


class GovernanceValidationTests(
    unittest.TestCase
):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(
            prefix="mgbos-governance-test-"
        )

        self.addCleanup(
            self.temp.cleanup
        )

        self.root = Path(
            self.temp.name
        )

        # Copy only textual fixtures and referenced governance sources.
        # Never follow retired/runtime links or external infrastructure.
        for relative in (
            ".agents",
            "docs",
            "systems/mgbos/docs",
            "systems/mgbos/packages",
            "systems/jarvis/docs",
            "bisnis/teestock",
            ".github/workflows",
        ):
            source = (
                governance.ROOT
                / relative
            )

            for path in source.rglob("*"):
                if (
                    path.is_file()
                    and path.suffix
                    in {
                        ".md",
                        ".json",
                        ".ts",
                        ".yml",
                        ".yaml",
                    }
                    and "node_modules"
                    not in path.parts
                ):
                    dest = (
                        self.root
                        / path.relative_to(
                            governance.ROOT
                        )
                    )

                    dest.parent.mkdir(
                        parents=True,
                        exist_ok=True,
                    )

                    shutil.copyfile(
                        path,
                        dest,
                    )

        for relative in (
            "README.md",
            "AGENTS.md",
            "systems/mgbos/AGENTS.md",
            "systems/mgbos/README.md",
        ):
            source = (
                governance.ROOT
                / relative
            )

            dest = (
                self.root
                / relative
            )

            dest.parent.mkdir(
                parents=True,
                exist_ok=True,
            )

            shutil.copyfile(
                source,
                dest,
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
                data
            ),
            encoding="utf-8",
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

    # --------------------------------------------------------
    # Healthy baseline
    # --------------------------------------------------------

    def test_valid_baseline(self):
        result = governance.validate(
            self.root
        )

        self.assertEqual(
            result["roles"],
            5,
        )

        self.assertEqual(
            result["expertise"],
            21,
        )

        self.assertEqual(
            result["task_types"],
            12,
        )

        self.assertEqual(
            result["concerns"],
            13,
        )

        self.assertEqual(
            len(
                result[
                    "warnings"
                ]
            ),
            3,
        )

    # --------------------------------------------------------
    # Existing role / permission protections
    # --------------------------------------------------------

    def test_capability_escalation_rejected(
        self
    ):
        self.edit_json(
            ".agents/roles/contracts.json",
            lambda data: data[
                "roles"
            ][2][
                "capabilities"
            ].append(
                "deploy-production"
            ),
        )

        with self.assertRaisesRegex(
            ValueError,
            "capability",
        ):
            governance.validate(
                self.root
            )

    def test_missing_role_rejected(
        self
    ):
        self.edit_json(
            ".agents/roles/contracts.json",
            lambda data: data[
                "roles"
            ].pop(),
        )

        with self.assertRaisesRegex(
            ValueError,
            "roles",
        ):
            governance.validate(
                self.root
            )

    # --------------------------------------------------------
    # Expertise registry protections
    # --------------------------------------------------------

    def test_duplicate_expertise_id_rejected(
        self
    ):
        def mutate(data):
            data[
                "expertise"
            ].append(
                copy.deepcopy(
                    data[
                        "expertise"
                    ][0]
                )
            )

        self.edit_yaml(
            ".agents/expertise/registry.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Duplicate expertise id",
        ):
            governance.validate(
                self.root
            )

    def test_unknown_expertise_role_rejected(
        self
    ):
        def mutate(data):
            data[
                "expertise"
            ][0][
                "primary_roles"
            ].append(
                "super-admin-agent"
            )

        self.edit_yaml(
            ".agents/expertise/registry.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Unknown roles",
        ):
            governance.validate(
                self.root
            )

    def test_missing_expertise_source_rejected(
        self
    ):
        def mutate(data):
            data[
                "expertise"
            ][0][
                "canonical_sources"
            ] = [
                "docs/does-not-exist.md"
            ]

        self.edit_yaml(
            ".agents/expertise/registry.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Missing path",
        ):
            governance.validate(
                self.root
            )

    def test_required_provisional_expertise_rejected(
        self
    ):
        def mutate(data):
            data[
                "task_types"
            ][
                "backend-command-change"
            ][
                "required_expertise"
            ].append(
                "EXP-014"
            )

        self.edit_yaml(
            ".agents/routing/task-types.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "must be ACTIVE",
        ):
            governance.validate(
                self.root
            )

    # --------------------------------------------------------
    # Routing registry protections
    # --------------------------------------------------------

    def test_unknown_routing_role_rejected(
        self
    ):
        def mutate(data):
            data[
                "task_types"
            ][
                "frontend-ui-change"
            ][
                "required_roles"
            ].append(
                "super-admin-agent"
            )

        self.edit_yaml(
            ".agents/routing/task-types.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Unknown roles",
        ):
            governance.validate(
                self.root
            )

    def test_unknown_routing_skill_rejected(
        self
    ):
        def mutate(data):
            data[
                "task_types"
            ][
                "frontend-ui-change"
            ][
                "skill_candidates"
            ].append(
                "does-not-exist"
            )

        self.edit_yaml(
            ".agents/routing/task-types.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Missing path",
        ):
            governance.validate(
                self.root
            )

    def test_invalid_risk_rejected(
        self
    ):
        def mutate(data):
            data[
                "concerns"
            ][
                "financial-truth"
            ][
                "risk_floor"
            ] = "R9"

        self.edit_yaml(
            ".agents/routing/task-types.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Invalid risk floor",
        ):
            governance.validate(
                self.root
            )

    def test_financial_risk_floor_rejected(
        self
    ):
        def mutate(data):
            data[
                "concerns"
            ][
                "financial-truth"
            ][
                "risk_floor"
            ] = "R4"

        self.edit_yaml(
            ".agents/routing/task-types.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Financial-truth",
        ):
            governance.validate(
                self.root
            )

    def test_r5_assurance_weakening_rejected(
        self
    ):
        def mutate(data):
            data[
                "concerns"
            ][
                "financial-truth"
            ][
                "assurance"
            ][
                "audit"
            ] = "REQUIRED"

        self.edit_yaml(
            ".agents/routing/task-types.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "independent assurance",
        ):
            governance.validate(
                self.root
            )

    def test_authorization_expertise_removal_rejected(
        self
    ):
        def mutate(data):
            data[
                "concerns"
            ][
                "authorization"
            ][
                "required_expertise"
            ].remove(
                "EXP-007"
            )

        self.edit_yaml(
            ".agents/routing/task-types.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Authorization routing",
        ):
            governance.validate(
                self.root
            )

    def test_governance_auditor_removal_rejected(
        self
    ):
        def mutate(data):
            data[
                "task_types"
            ][
                "governance-change"
            ][
                "required_roles"
            ].remove(
                "auditor"
            )

        self.edit_yaml(
            ".agents/routing/task-types.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Governance-change routing",
        ):
            governance.validate(
                self.root
            )

    def test_production_floor_weakening_rejected(
        self
    ):
        def mutate(data):
            data[
                "environments"
            ][
                "production"
            ][
                "mutation_risk_floor"
            ] = "R3"

        self.edit_yaml(
            ".agents/routing/task-types.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Production mutation floor",
        ):
            governance.validate(
                self.root
            )

    def test_route_example_composition_drift_rejected(
        self
    ):
        def mutate(data):
            data[
                "example_routes"
            ][
                "cross-org-read-model"
            ][
                "expected"
            ][
                "roles"
            ].remove(
                "planner"
            )

        self.edit_yaml(
            ".agents/routing/task-types.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Example roles mismatch",
        ):
            governance.validate(
                self.root
            )

    def test_unknown_example_concern_rejected(
        self
    ):
        def mutate(data):
            data[
                "example_routes"
            ][
                "payment-command-change"
            ][
                "concerns"
            ].append(
                "magical-risk"
            )

        self.edit_yaml(
            ".agents/routing/task-types.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Unknown example concerns",
        ):
            governance.validate(
                self.root
            )

    def test_duplicate_routing_yaml_key_rejected(
        self
    ):
        path = (
            self.root
            / ".agents/routing/task-types.yaml"
        )

        text = path.read_text(
            encoding="utf-8"
        )

        text = text.replace(
            "schema_version: 1",
            (
                "schema_version: 1\n"
                "schema_version: 1"
            ),
            1,
        )

        path.write_text(
            text,
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "Duplicate YAML",
        ):
            governance.validate(
                self.root
            )

    # --------------------------------------------------------
    # Existing eval protections
    # --------------------------------------------------------

    def test_duplicate_eval_rejected(
        self
    ):
        self.edit_json(
            ".agents/evals/baseline.json",
            lambda data: data[
                "cases"
            ].append(
                data[
                    "cases"
                ][0]
            ),
        )

        with self.assertRaisesRegex(
            ValueError,
            "eval id",
        ):
            governance.validate(
                self.root
            )

    def test_missing_category_rejected(
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
                    "category"
                ]
                != "finance"
            ]

        self.edit_json(
            ".agents/evals/baseline.json",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "per category",
        ):
            governance.validate(
                self.root
            )

    def test_missing_rubric_rejected(
        self
    ):
        self.edit_json(
            ".agents/evals/baseline.json",
            lambda data: data[
                "cases"
            ][0].update(
                forbidden=[]
            ),
        )

        with self.assertRaisesRegex(
            ValueError,
            "forbidden",
        ):
            governance.validate(
                self.root
            )

    def test_source_escape_rejected(
        self
    ):
        self.edit_json(
            ".agents/evals/baseline.json",
            lambda data: data[
                "cases"
            ][0].update(
                sources=[
                    "../outside.md"
                ]
            ),
        )

        with self.assertRaisesRegex(
            ValueError,
            "escapes",
        ):
            governance.validate(
                self.root
            )

    # --------------------------------------------------------
    # Markdown / Skill protections
    # --------------------------------------------------------

    def test_broken_link_rejected(
        self
    ):
        path = (
            self.root
            / ".agents/roles/planner.md"
        )

        path.write_text(
            (
                path.read_text(
                    encoding="utf-8"
                )
                + "\n"
                + "[missing](absent.md)\n"
            ),
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "Broken link",
        ):
            governance.validate(
                self.root
            )

    def test_empty_role_contract_rejected(
        self
    ):
        (
            self.root
            / ".agents/roles/qa.md"
        ).write_text(
            "\n",
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "Empty instruction",
        ):
            governance.validate(
                self.root
            )

    def test_empty_description_rejected(
        self
    ):
        path = (
            self.root
            / ".agents/skills/"
            "mgbos-change-planner/"
            "SKILL.md"
        )

        path.write_text(
            (
                "---\n"
                "name: mgbos-change-planner\n"
                "description: ''\n"
                "---\n"
                "# Planner\n"
            ),
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "description",
        ):
            governance.validate(
                self.root
            )

    def test_duplicate_frontmatter_rejected(
        self
    ):
        path = (
            self.root
            / ".agents/skills/"
            "mgbos-change-planner/"
            "SKILL.md"
        )

        path.write_text(
            (
                "---\n"
                "name: mgbos-change-planner\n"
                "name: hidden\n"
                "description: Plan\n"
                "---\n"
                "# Planner\n"
            ),
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "Duplicate YAML",
        ):
            governance.validate(
                self.root
            )

    # --------------------------------------------------------
    # Hosted workflow protections
    # --------------------------------------------------------

    def test_privileged_workflow_rejected(
        self
    ):
        path = (
            self.root
            / ".github/workflows/"
            "agent-governance.yml"
        )

        path.write_text(
            path.read_text(
                encoding="utf-8"
            ).replace(
                "contents: read",
                "contents: write",
            ),
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "read-only",
        ):
            governance.validate(
                self.root
            )

    def test_workflow_failure_bypass_rejected(
        self
    ):
        path = (
            self.root
            / ".github/workflows/"
            "agent-governance.yml"
        )

        path.write_text(
            path.read_text(
                encoding="utf-8"
            ).replace(
                "timeout-minutes: 10",
                (
                    "timeout-minutes: 10\n"
                    "    continue-on-error: true"
                ),
                1,
            ),
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "ignore failure",
        ):
            governance.validate(
                self.root
            )

    def test_contract_validator_ci_step_required(
        self
    ):
        path = (
            self.root
            / ".github/workflows/"
            "agent-governance.yml"
        )

        content = path.read_text(
            encoding="utf-8"
        )

        modified = content.replace(
            (
                "      - run: python "
                "scripts/governance/"
                "validate_engineering_contracts.py\n"
            ),
            "",
            1,
        )
        if modified == content:
            modified = content.replace(
                (
                    "- run: python "
                    "scripts/governance/"
                    "validate_engineering_contracts.py\n"
                ),
                "",
                1,
            )
        if modified == content:
            modified = content.replace(
                (
                    "python scripts/governance/"
                    "validate_engineering_contracts.py"
                ),
                "python scripts/governance/validate-agent-governance.py",
                1,
            )

        path.write_text(
            modified,
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "missing required validators",
        ):
            governance.validate(
                self.root
            )

    def test_runtime_adapter_validator_ci_step_required(
        self
    ):
        path = (
            self.root
            / ".github/workflows/"
            "agent-governance.yml"
        )

        content = path.read_text(
            encoding="utf-8"
        )

        modified = content.replace(
            (
                "      - run: python "
                "scripts/governance/"
                "validate_runtime_adapters.py\n"
            ),
            "",
            1,
        )
        if modified == content:
            modified = content.replace(
                (
                    "- run: python "
                    "scripts/governance/"
                    "validate_runtime_adapters.py\n"
                ),
                "",
                1,
            )
        if modified == content:
            modified = content.replace(
                (
                    "python scripts/governance/"
                    "validate_runtime_adapters.py"
                ),
                "python scripts/governance/validate-agent-governance.py",
                1,
            )

        path.write_text(
            modified,
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "missing required validators",
        ):
            governance.validate(
                self.root
            )


if __name__ == "__main__":
    unittest.main()