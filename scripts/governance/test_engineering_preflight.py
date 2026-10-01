"""Tests for deterministic engineering action preflight."""

import importlib.util
import copy
import unittest
from pathlib import Path


spec = importlib.util.spec_from_file_location(
    "resolver",
    Path(__file__).with_name(
        "resolve_engineering_permission.py"
    ),
)

resolver = (
    importlib.util.module_from_spec(
        spec
    )
)

spec.loader.exec_module(
    resolver
)


def source_request():
    return {
        "schema_version": 1,
        "principal": "fixture-engineer",
        "role": "engineer",
        "capability":
            "engineering.source.write.scoped",
        "environment":
            "repository-local",
        "declared_risk": "R5",

        "autonomy": {
            "level": "L2",
            "verified": True,
            "scope_match": True,
            "environment_match": True,
            "evidence_ref": "fixture-grant",
        },

        "action": {
            "target":
                "systems/mgbos/test.ts",
            "resource_scope": [
                "systems/mgbos/test.ts"
            ],
            "material_parameters": [
                {
                    "name":
                        "work_package_id",
                    "value":
                        "WP-fixture",
                }
            ],
        },

        "conditions": [
            {
                "id":
                    "accepted-work-package",
                "state":
                    "SATISFIED",
                "evidence_ref":
                    "WP-fixture",
            },
            {
                "id":
                    "authorized-worktree",
                "state":
                    "SATISFIED",
                "evidence_ref":
                    "fixture-worktree",
            },
            {
                "id":
                    "allowed-path-match",
                "state":
                    "SATISFIED",
                "evidence_ref":
                    "WP-fixture.scope",
            },
        ],

        "approval": None,

        "host": {
            "tool_available": True,
            "permission_state":
                "ALLOW",
        },
    }


class EngineeringPreflightTests(
    unittest.TestCase
):
    def test_scoped_engineer_write_allowed(
        self
    ):
        result = resolver.resolve(
            source_request()
        )

        self.assertEqual(
            result[
                "decision"
            ],
            "ALLOW",
        )

    def test_auditor_source_write_denied(
        self
    ):
        request = source_request()

        request[
            "role"
        ] = "auditor"

        result = resolver.resolve(
            request
        )

        self.assertEqual(
            result[
                "decision"
            ],
            "DENY",
        )

        self.assertEqual(
            result[
                "reason_code"
            ],
            "ROLE_CAPABILITY_NOT_GRANTED",
        )

    def test_main_push_prohibited(
        self
    ):
        request = source_request()

        request[
            "capability"
        ] = (
            "engineering.git.main.push"
        )

        request[
            "environment"
        ] = "github-remote"

        request[
            "autonomy"
        ][
            "level"
        ] = "L3"

        result = resolver.resolve(
            request
        )

        self.assertEqual(
            result[
                "decision"
            ],
            "DENY",
        )

        self.assertEqual(
            result[
                "reason_code"
            ],
            "CAPABILITY_PROHIBITED",
        )

    def test_missing_work_package_blocks(
        self
    ):
        request = source_request()

        request[
            "conditions"
        ] = [
            item
            for item
            in request[
                "conditions"
            ]
            if item[
                "id"
            ]
            != "accepted-work-package"
        ]

        result = resolver.resolve(
            request
        )

        self.assertEqual(
            result[
                "decision"
            ],
            "BLOCK",
        )

    def test_scope_mismatch_denied(
        self
    ):
        request = source_request()

        for item in request[
            "conditions"
        ]:
            if (
                item[
                    "id"
                ]
                == "allowed-path-match"
            ):
                item[
                    "state"
                ] = "UNSATISFIED"

        result = resolver.resolve(
            request
        )

        self.assertEqual(
            result[
                "decision"
            ],
            "DENY",
        )

    def test_unknown_environment_blocks(
        self
    ):
        request = source_request()

        request[
            "environment"
        ] = "UNKNOWN"

        result = resolver.resolve(
            request
        )

        self.assertEqual(
            result[
                "reason_code"
            ],
            "ENVIRONMENT_UNVERIFIED",
        )

    def test_insufficient_autonomy_denied(
        self
    ):
        request = source_request()

        request[
            "autonomy"
        ][
            "level"
        ] = "L1"

        result = resolver.resolve(
            request
        )

        self.assertEqual(
            result[
                "reason_code"
            ],
            "AUTONOMY_INSUFFICIENT",
        )

    def test_unverified_autonomy_blocks(
        self
    ):
        request = source_request()

        request[
            "autonomy"
        ][
            "verified"
        ] = False

        result = resolver.resolve(
            request
        )

        self.assertEqual(
            result[
                "reason_code"
            ],
            "AUTONOMY_UNVERIFIED",
        )

    def test_host_denial_wins(
        self
    ):
        request = source_request()

        request[
            "host"
        ][
            "permission_state"
        ] = "DENY"

        result = resolver.resolve(
            request
        )

        self.assertEqual(
            result[
                "reason_code"
            ],
            "HOST_PERMISSION_DENIED",
        )

    def test_risk_cannot_be_downgraded(
        self
    ):
        request = source_request()

        request[
            "declared_risk"
        ] = "R0"

        result = resolver.resolve(
            request
        )

        self.assertEqual(
            result[
                "effective_risk"
            ],
            "R2",
        )

        self.assertTrue(
            result[
                "risk_adjusted"
            ],
        )

    def test_unknown_risk_blocks(
        self
    ):
        request = source_request()

        request[
            "declared_risk"
        ] = "UNKNOWN"

        result = resolver.resolve(
            request
        )

        self.assertEqual(
            result[
                "reason_code"
            ],
            "RISK_UNRESOLVED",
        )

    def test_approval_condition_cannot_be_spoofed(
        self
    ):
        request = source_request()

        request[
            "conditions"
        ].append(
            {
                "id":
                    "explicit-action-authorization",
                "state":
                    "SATISFIED",
                "evidence_ref":
                    "trust-me",
            }
        )

        with self.assertRaisesRegex(
            ValueError,
            "cannot be supplied directly",
        ):
            resolver.resolve(
                request
            )


if __name__ == "__main__":
    unittest.main()