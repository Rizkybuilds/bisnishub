"""Mutation tests for Engineering Principal & Autonomy governance (CP-005D)."""

import importlib.util
import shutil
import tempfile
import unittest
from pathlib import Path

import yaml


spec = importlib.util.spec_from_file_location(
    "validate_engineering_autonomy",
    Path(__file__).with_name(
        "validate_engineering_autonomy.py"
    ),
)

autonomy_validator = (
    importlib.util.module_from_spec(
        spec
    )
)

spec.loader.exec_module(
    autonomy_validator
)


class EngineeringAutonomyTests(
    unittest.TestCase
):
    def setUp(self):
        self.temp = (
            tempfile.TemporaryDirectory(
                prefix=
                    "engineering-autonomy-test-"
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
        ):
            source = (
                autonomy_validator.ROOT
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

    def validate(self):
        return autonomy_validator.validate(
            self.root
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

    def find_grant(
        self,
        grant_id,
        data,
    ):
        for grant in data[
            "grants"
        ]:
            if (
                grant[
                    "id"
                ]
                == grant_id
            ):
                return grant

        raise KeyError(
            f"Grant not found: {grant_id}"
        )

    def find_principal(
        self,
        principal_id,
        data,
    ):
        for principal in data[
            "principals"
        ]:
            if (
                principal[
                    "id"
                ]
                == principal_id
            ):
                return principal

        raise KeyError(
            f"Principal not found: {principal_id}"
        )

    def test_baseline_passes_validation(
        self
    ):
        result = self.validate()

        self.assertGreaterEqual(
            result[
                "principals"
            ],
            2,
        )

        self.assertGreaterEqual(
            result[
                "grants"
            ],
            14,
        )

    def test_initial_baseline_cannot_create_l3(
        self
    ):
        def mutate(data):
            grant = self.find_grant(
                "EAG-primary-source-write",
                data,
            )

            grant[
                "level"
            ] = "L3"

        self.edit_yaml(
            autonomy_validator.GRANTS_PATH,
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "INITIAL_GOVERNANCE_BASELINE.*L3",
        ):
            self.validate()

    def test_provider_name_cannot_be_principal_identity(
        self
    ):
        def mutate(data):
            principal = self.find_principal(
                "engineering.runtime.primary",
                data,
            )

            principal[
                "id"
            ] = "engineering.runtime.codex"

        self.edit_yaml(
            autonomy_validator.PRINCIPALS_PATH,
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "provider.*identity",
        ):
            self.validate()

    def test_adapter_binding_invalid(
        self
    ):
        def mutate(data):
            principal = self.find_principal(
                "engineering.runtime.primary",
                data,
            )

            principal[
                "runtime_binding"
            ][
                "adapter_id"
            ] = "unregistered-provider"

        self.edit_yaml(
            autonomy_validator.PRINCIPALS_PATH,
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "invalid adapter_id",
        ):
            self.validate()

    def test_allowed_role_invalid(
        self
    ):
        def mutate(data):
            principal = self.find_principal(
                "engineering.runtime.primary",
                data,
            )

            principal[
                "allowed_roles"
            ].append(
                "superadmin"
            )

        self.edit_yaml(
            autonomy_validator.PRINCIPALS_PATH,
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "unknown allowed role",
        ):
            self.validate()

    def test_prohibited_capability_in_ceiling_rejected(
        self
    ):
        def mutate(data):
            principal = self.find_principal(
                "engineering.runtime.primary",
                data,
            )

            principal[
                "capability_ceiling"
            ].append(
                "engineering.git.main.push"
            )

        self.edit_yaml(
            autonomy_validator.PRINCIPALS_PATH,
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "disposition ACTIVE",
        ):
            self.validate()

    def test_independent_assurance_claimed_rejected(
        self
    ):
        def mutate(data):
            principal = self.find_principal(
                "engineering.runtime.primary",
                data,
            )

            principal[
                "independent_assurance_eligible"
            ] = True

        self.edit_yaml(
            autonomy_validator.PRINCIPALS_PATH,
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "cannot claim independent assurance",
        ):
            self.validate()

    def test_grant_capability_outside_ceiling_rejected(
        self
    ):
        def mutate(data):
            grant = self.find_grant(
                "EAG-primary-source-write",
                data,
            )

            # engineering.database.local.reset_disposable is in ceiling,
            # but let's remove it from ceiling and point grant to it
            grant[
                "capability_id"
            ] = "engineering.github.pull_request.create"

        self.edit_yaml(
            autonomy_validator.GRANTS_PATH,
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "not inside principal ceiling",
        ):
            self.validate()

    def test_grant_level_below_minimum_rejected(
        self
    ):
        def mutate(data):
            grant = self.find_grant(
                "EAG-primary-source-write",
                data,
            )

            grant[
                "level"
            ] = "L1"

        self.edit_yaml(
            autonomy_validator.GRANTS_PATH,
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "below capability minimum",
        ):
            self.validate()

    def test_l3_requires_promotion_case_ref(
        self
    ):
        def mutate(data):
            grant = self.find_grant(
                "EAG-primary-source-write",
                data,
            )

            grant[
                "level"
            ] = "L3"

            grant[
                "basis"
            ] = "PROMOTION_DECISION"

            grant[
                "owner_decision_ref"
            ] = "DEC-001"

            grant[
                "promotion_case_ref"
            ] = None

        self.edit_yaml(
            autonomy_validator.GRANTS_PATH,
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "requires non-empty promotion_case_ref",
        ):
            self.validate()

    def test_overlapping_grants_rejected(
        self
    ):
        def mutate(data):
            duplicate = dict(
                data[
                    "grants"
                ][0]
            )

            duplicate[
                "id"
            ] = "EAG-duplicate-test"

            data[
                "grants"
            ].append(
                duplicate
            )

        self.edit_yaml(
            autonomy_validator.GRANTS_PATH,
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Overlapping current autonomy grants",
        ):
            self.validate()

    def test_remote_capability_cannot_have_initial_grant(
        self
    ):
        def mutate(data):
            # Point primary runtime grant to a remote capability
            grant = self.find_grant(
                "EAG-primary-local-check",
                data,
            )

            grant[
                "capability_id"
            ] = "engineering.github.pull_request.create"

            # add to ceiling as well to isolate the remote capability check
            def mutate_principal(pdata):
                p = self.find_principal(
                    "engineering.runtime.primary",
                    pdata,
                )
                p["capability_ceiling"].append(
                    "engineering.github.pull_request.create"
                )

            self.edit_yaml(
                autonomy_validator.PRINCIPALS_PATH,
                mutate_principal,
            )

        self.edit_yaml(
            autonomy_validator.GRANTS_PATH,
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Remote capability cannot have initial baseline grant",
        ):
            self.validate()


if __name__ == "__main__":
    unittest.main()
