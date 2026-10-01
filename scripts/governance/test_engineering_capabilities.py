"""Mutation tests for Engineering Capability & Permission governance."""

import importlib.util
import json
import shutil
import tempfile
import unittest
from pathlib import Path

import yaml


spec = importlib.util.spec_from_file_location(
    "engineering_capabilities",
    Path(__file__).with_name(
        "validate_engineering_capabilities.py"
    ),
)

capabilities = (
    importlib.util.module_from_spec(
        spec
    )
)

spec.loader.exec_module(
    capabilities
)


class EngineeringCapabilityTests(
    unittest.TestCase
):
    def setUp(self):
        self.temp = (
            tempfile.TemporaryDirectory(
                prefix=
                    "engineering-capability-test-"
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
                capabilities.ROOT
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
        result = capabilities.validate(
            self.root
        )

        self.assertEqual(
            result[
                "capabilities"
            ],
            19,
        )

        self.assertEqual(
            result[
                "prohibited_capabilities"
            ],
            5,
        )

        self.assertEqual(
            result[
                "roles"
            ],
            5,
        )

    def test_legacy_role_capability_rejected(
        self
    ):
        def mutate(data):
            data[
                "roles"
            ][0][
                "capabilities"
            ][0] = "read-repository"

        self.edit_json(
            ".agents/roles/contracts.json",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "non-canonical capability",
        ):
            capabilities.validate(
                self.root
            )

    def test_unknown_canonical_capability_rejected(
        self
    ):
        def mutate(data):
            data[
                "roles"
            ][0][
                "capabilities"
            ].append(
                "engineering.magic.execute"
            )

        self.edit_json(
            ".agents/roles/contracts.json",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "unknown capability",
        ):
            capabilities.validate(
                self.root
            )

    def test_role_catalog_grant_drift_rejected(
        self
    ):
        def mutate(data):
            data[
                "roles"
            ][0][
                "capabilities"
            ].remove(
                "engineering.plan.write"
            )

        self.edit_json(
            ".agents/roles/contracts.json",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "must match GRANTED",
        ):
            capabilities.validate(
                self.root
            )

    def test_global_prohibition_cannot_be_granted(
        self
    ):
        def mutate(data):
            data[
                "roles"
            ][
                "engineer"
            ][
                "granted"
            ][
                "engineering.git.main.push"
            ] = {
                "scope": "main"
            }

        self.edit_yaml(
            ".agents/capabilities/role-grants.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Global prohibition cannot be granted",
        ):
            capabilities.validate(
                self.root
            )

    def test_merge_cannot_leak_to_planner(
        self
    ):
        def mutate(data):
            data[
                "roles"
            ][
                "planner"
            ][
                "conditional"
            ][
                "engineering.github.pull_request.merge"
            ] = {
                "requires": [
                    "explicit-action-authorization"
                ]
            }

        self.edit_yaml(
            ".agents/capabilities/role-grants.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Capability leaked",
        ):
            capabilities.validate(
                self.root
            )

    def test_source_write_cannot_leak_to_auditor(
        self
    ):
        def mutate(data):
            auditor = data[
                "roles"
            ][
                "auditor"
            ]
            auditor[
                "granted"
            ][
                "engineering.source.write.scoped"
            ] = {
                "scope": "reviewed-files",
                "requires": [
                    "accepted-work-package"
                ]
            }
            if (
                "engineering.source.write.scoped"
                in auditor.get(
                    "explicit_denials",
                    [],
                )
            ):
                auditor[
                    "explicit_denials"
                ].remove(
                    "engineering.source.write.scoped"
                )

        self.edit_yaml(
            ".agents/capabilities/role-grants.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Capability leaked",
        ):
            capabilities.validate(
                self.root
            )

    def test_explicit_action_capability_cannot_be_unconditional(
        self
    ):
        def mutate(data):
            role = data[
                "roles"
            ][
                "release-operator"
            ]

            value = role[
                "conditional"
            ].pop(
                "engineering.github.pull_request.close"
            )

            role[
                "granted"
            ][
                "engineering.github.pull_request.close"
            ] = value

        self.edit_yaml(
            ".agents/capabilities/role-grants.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "must remain conditional",
        ):
            capabilities.validate(
                self.root
            )

    def test_conditional_capability_requires_conditions(
        self
    ):
        def mutate(data):
            data[
                "roles"
            ][
                "engineer"
            ][
                "conditional"
            ][
                "engineering.github.pull_request.create"
            ][
                "requires"
            ] = []

        self.edit_yaml(
            ".agents/capabilities/role-grants.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "requires explicit conditions",
        ):
            capabilities.validate(
                self.root
            )

    def test_prohibited_capability_cannot_be_activated(
        self
    ):
        def mutate(data):
            for entry in data[
                "capabilities"
            ]:
                if (
                    entry[
                        "id"
                    ]
                    == "engineering.git.main.push"
                ):
                    entry[
                        "disposition"
                    ] = "ACTIVE"

                    entry[
                        "approval_mode"
                    ] = "EXPLICIT_ACTION"

                    entry[
                        "autonomy_ceiling"
                    ] = "L3"

        self.edit_yaml(
            ".agents/capabilities/registry.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Hard prohibition",
        ):
            capabilities.validate(
                self.root
            )

    def test_r5_active_capability_cannot_receive_l4_ceiling(
        self
    ):
        def mutate(data):
            for entry in data[
                "capabilities"
            ]:
                if (
                    entry[
                        "id"
                    ]
                    == (
                        "engineering.database."
                        "mgbos.remote.mutate"
                    )
                ):
                    entry[
                        "disposition"
                    ] = "ACTIVE"

                    entry[
                        "approval_mode"
                    ] = "EXPLICIT_ACTION"

                    entry[
                        "autonomy_ceiling"
                    ] = "L4"

        self.edit_yaml(
            ".agents/capabilities/registry.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "cannot exceed L3|Hard prohibition",
        ):
            capabilities.validate(
                self.root
            )

    def test_tool_access_cannot_grant_permission(
        self
    ):
        def mutate(data):
            data[
                "principles"
            ][
                "tool_access_grants_permission"
            ] = True

        self.edit_yaml(
            ".agents/capabilities/registry.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "must remain false",
        ):
            capabilities.validate(
                self.root
            )

    def test_alias_must_be_one_to_one(
        self
    ):
        def mutate(data):
            data[
                "legacy_aliases"
            ][
                "write-plan"
            ] = (
                "engineering.repository.read"
            )

        self.edit_yaml(
            ".agents/capabilities/registry.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "one-to-one",
        ):
            capabilities.validate(
                self.root
            )

    def test_unknown_environment_rejected(
        self
    ):
        def mutate(data):
            data[
                "capabilities"
            ][0][
                "supported_environments"
            ].append(
                "moon-production"
            )

        self.edit_yaml(
            ".agents/capabilities/registry.yaml",
            mutate,
        )

        with self.assertRaisesRegex(
            ValueError,
            "Unknown environment",
        ):
            capabilities.validate(
                self.root
            )


if __name__ == "__main__":
    unittest.main()