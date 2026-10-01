"""Mutation tests for engineering execution contracts."""

import copy
import importlib.util
import json
import shutil
import tempfile
import unittest
from pathlib import Path


spec = importlib.util.spec_from_file_location(
    "engineering_contracts",
    Path(__file__).with_name(
        "validate_engineering_contracts.py"
    ),
)

contracts = importlib.util.module_from_spec(
    spec
)

spec.loader.exec_module(
    contracts
)


class EngineeringContractTests(
    unittest.TestCase
):
    def setUp(self):
        self.temp = (
            tempfile.TemporaryDirectory(
                prefix="engineering-contract-test-"
            )
        )

        self.addCleanup(
            self.temp.cleanup
        )

        self.root = Path(
            self.temp.name
        )

        source_agents = (
            contracts.ROOT
            / ".agents"
        )

        destination_agents = (
            self.root
            / ".agents"
        )

        shutil.copytree(
            source_agents,
            destination_agents,
        )

    def load_fixture(self):
        return json.loads(
            (
                self.root
                / contracts.FIXTURE
            ).read_text(
                encoding="utf-8"
            )
        )

    def save_fixture(
        self,
        value,
    ):
        (
            self.root
            / contracts.FIXTURE
        ).write_text(
            json.dumps(
                value,
                indent=2,
            ),
            encoding="utf-8",
        )

    def mutate_fixture(
        self,
        mutator,
    ):
        fixture = self.load_fixture()

        mutator(
            fixture
        )

        self.save_fixture(
            fixture
        )

    def test_valid_baseline(self):
        result = contracts.validate(
            self.root
        )

        self.assertEqual(
            result[
                "schemas"
            ],
            6,
        )

        self.assertEqual(
            result[
                "fixture_artifacts"
            ],
            6,
        )

    def test_release_readiness_does_not_grant_authority(
        self
    ):
        fixture = self.load_fixture()

        packet = fixture[
            "release_packet"
        ]

        self.assertEqual(
            packet[
                "recommendation"
            ],
            "READY_FOR_AUTHORIZED_RELEASE",
        )

        self.assertEqual(
            packet[
                "execution_authority"
            ],
            "NOT_GRANTED",
        )

        contracts.validate(
            self.root
        )

    def test_r5_self_review_cannot_be_satisfied(
        self
    ):
        self.mutate_fixture(
            lambda fixture: fixture[
                "assurance_report"
            ].update(
                independence="SELF_REVIEW"
            )
        )

        with self.assertRaisesRegex(
            ValueError,
            "must be independent",
        ):
            contracts.validate(
                self.root
            )

    def test_blocked_case_cannot_be_overall_pass(
        self
    ):
        def mutate(fixture):
            fixture[
                "verification_matrix"
            ][
                "cases"
            ][0][
                "result"
            ] = "BLOCKED"

        self.mutate_fixture(
            mutate
        )

        with self.assertRaisesRegex(
            ValueError,
            "Verification PASS",
        ):
            contracts.validate(
                self.root
            )

    def test_not_run_case_cannot_be_overall_pass(
        self
    ):
        def mutate(fixture):
            fixture[
                "verification_matrix"
            ][
                "cases"
            ][0][
                "result"
            ] = "NOT_RUN"

        self.mutate_fixture(
            mutate
        )

        with self.assertRaisesRegex(
            ValueError,
            "Verification PASS",
        ):
            contracts.validate(
                self.root
            )

    def test_work_package_lineage_mismatch_rejected(
        self
    ):
        self.mutate_fixture(
            lambda fixture: fixture[
                "work_package"
            ].update(
                implementation_contract_id=(
                    "IC-wrong"
                )
            )
        )

        with self.assertRaisesRegex(
            ValueError,
            "lineage mismatch",
        ):
            contracts.validate(
                self.root
            )

    def test_assurance_revision_mismatch_rejected(
        self
    ):
        def mutate(fixture):
            fixture[
                "assurance_report"
            ][
                "reviewed_revision"
            ][
                "sha"
            ] = (
                "bbbbbbbbbbbbbbbbbbbbbbbb"
                "bbbbbbbbbbbbbbbb"
            )

        self.mutate_fixture(
            mutate
        )

        with self.assertRaisesRegex(
            ValueError,
            "Assurance revision",
        ):
            contracts.validate(
                self.root
            )

    def test_financial_route_risk_cannot_be_downgraded(
        self
    ):
        def mutate(fixture):
            fixture[
                "implementation_contract"
            ][
                "risk"
            ][
                "effective_level"
            ] = "R4"

            fixture[
                "work_package"
            ][
                "risk"
            ] = "R4"

            fixture[
                "assurance_report"
            ][
                "risk"
            ] = "R4"

            fixture[
                "release_packet"
            ][
                "risk"
            ] = "R4"

        self.mutate_fixture(
            mutate
        )

        with self.assertRaisesRegex(
            ValueError,
            "below routing floor",
        ):
            contracts.validate(
                self.root
            )

    def test_unknown_required_expertise_rejected(
        self
    ):
        def mutate(fixture):
            fixture[
                "implementation_contract"
            ][
                "routing"
            ][
                "required_expertise"
            ].append(
                "EXP-999"
            )

        self.mutate_fixture(
            mutate
        )

        with self.assertRaisesRegex(
            ValueError,
            "Unknown expertise",
        ):
            contracts.validate(
                self.root
            )

    def test_work_package_writer_role_rejected(
        self
    ):
        def mutate(fixture):
            fixture[
                "work_package"
            ][
                "writer"
            ][
                "role"
            ] = "planner"

        self.mutate_fixture(
            mutate
        )

        with self.assertRaisesRegex(
            ValueError,
            "schema validation failed",
        ):
            contracts.validate(
                self.root
            )

    def test_ready_release_with_blocked_gate_rejected(
        self
    ):
        def mutate(fixture):
            fixture[
                "release_packet"
            ][
                "gate_matrix"
            ][0][
                "status"
            ] = "BLOCKED"

        self.mutate_fixture(
            mutate
        )

        with self.assertRaisesRegex(
            ValueError,
            "required gates PASS",
        ):
            contracts.validate(
                self.root
            )

    def test_ready_release_without_recovery_rejected(
        self
    ):
        def mutate(fixture):
            fixture[
                "release_packet"
            ][
                "recovery"
            ][
                "verified"
            ] = False

        self.mutate_fixture(
            mutate
        )

        with self.assertRaisesRegex(
            ValueError,
            "recovery evidence",
        ):
            contracts.validate(
                self.root
            )

    def test_release_revision_mismatch_rejected(
        self
    ):
        def mutate(fixture):
            fixture[
                "release_packet"
            ][
                "candidate_revision"
            ] = (
                "cccccccccccccccccccccccc"
                "cccccccccccccccc"
            )

        self.mutate_fixture(
            mutate
        )

        with self.assertRaisesRegex(
            ValueError,
            "Release candidate revision",
        ):
            contracts.validate(
                self.root
            )

    def test_unknown_acceptance_reference_rejected(
        self
    ):
        def mutate(fixture):
            fixture[
                "work_package"
            ][
                "acceptance_criteria"
            ].append(
                "AC-999"
            )

        self.mutate_fixture(
            mutate
        )

        with self.assertRaisesRegex(
            ValueError,
            "unknown acceptance criterion",
        ):
            contracts.validate(
                self.root
            )

    def test_unknown_selected_skill_rejected(
        self
    ):
        def mutate(fixture):
            fixture[
                "work_package"
            ][
                "selected_skills"
            ] = [
                "does-not-exist"
            ]

        self.mutate_fixture(
            mutate
        )

        with self.assertRaisesRegex(
            ValueError,
            "Missing file",
        ):
            contracts.validate(
                self.root
            )

    def test_schema_cannot_enable_unknown_properties(
        self
    ):
        path = (
            self.root
            / ".agents/contracts/"
            "work-package.schema.json"
        )

        schema = json.loads(
            path.read_text(
                encoding="utf-8"
            )
        )

        schema[
            "additionalProperties"
        ] = True

        path.write_text(
            json.dumps(
                schema,
                indent=2,
            ),
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "additionalProperties=false",
        ):
            contracts.validate(
                self.root
            )

    def test_duplicate_json_key_rejected(
        self
    ):
        path = (
            self.root
            / contracts.FIXTURE
        )

        text = path.read_text(
            encoding="utf-8"
        )

        text = text.replace(
            '"implementation_contract": {',
            (
                '"implementation_contract": {\n'
                '    "schema_version": 1,'
            ),
            1,
        )

        path.write_text(
            text,
            encoding="utf-8",
        )

        with self.assertRaisesRegex(
            ValueError,
            "Duplicate JSON key",
        ):
            contracts.validate(
                self.root
            )


if __name__ == "__main__":
    unittest.main()