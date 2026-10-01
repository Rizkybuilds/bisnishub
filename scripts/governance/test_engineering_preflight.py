"""Tests for deterministic engineering action preflight."""

import importlib.util
import unittest
from pathlib import Path
from unittest.mock import patch


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
        "role": "engineer",
        "capability":
            "engineering.source.write.scoped",
        "environment":
            "repository-local",
        "declared_risk": "R5",
        "evaluated_at":
            "2026-10-01T00:00:00Z",
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


def source_attestation():
    return {
        "schema_version": 1,
        "principal_id":
            "engineering.runtime.primary",
        "adapter_id": "codex",
        "verified": True,
        "issued_at":
            "2026-10-01T00:00:00Z",
        "session_id": "fixture-session",
        "evidence_ref": "fixture-grant",
    }


class EngineeringPreflightTests(
    unittest.TestCase
):
    def test_scoped_engineer_write_allowed(
        self
    ):
        result = resolver.resolve(
            source_request(),
            source_attestation(),
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
            request,
            source_attestation(),
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

        result = resolver.resolve(
            request,
            source_attestation(),
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
            request,
            source_attestation(),
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
            request,
            source_attestation(),
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
            request,
            source_attestation(),
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

        with patch.object(
            resolver,
            "resolve_autonomy_grant",
            return_value=(
                {
                    "id": "fixture-grant",
                    "level": "L1",
                    "risk_ceiling": "R5",
                    "basis": "INITIAL_GOVERNANCE_BASELINE",
                },
                "ALLOW",
                "AUTONOMY_GRANT_ACTIVE",
            ),
        ):
            result = resolver.resolve(
                request,
                source_attestation(),
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

        with patch.object(
            resolver,
            "resolve_autonomy_grant",
            return_value=(
                None,
                "BLOCK",
                "AUTONOMY_GRANT_SUSPENDED",
            ),
        ):
            result = resolver.resolve(
                request,
                source_attestation(),
            )

        self.assertEqual(
            result[
                "reason_code"
            ],
            "AUTONOMY_GRANT_SUSPENDED",
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
            request,
            source_attestation(),
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
            request,
            source_attestation(),
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
            request,
            source_attestation(),
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
                request,
                source_attestation(),
            )

    def test_unverified_principal_denied(
        self
    ):
        attestation = source_attestation()

        attestation[
            "verified"
        ] = False

        result = resolver.resolve(
            source_request(),
            attestation,
        )

        self.assertEqual(
            result[
                "decision"
            ],
            "BLOCK",
        )

        self.assertEqual(
            result[
                "reason_code"
            ],
            "PRINCIPAL_UNVERIFIED",
        )

    def test_principal_binding_mismatch_denied(
        self
    ):
        attestation = source_attestation()

        attestation[
            "adapter_id"
        ] = "wrong-adapter"

        result = resolver.resolve(
            source_request(),
            attestation,
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
            "PRINCIPAL_BINDING_MISMATCH",
        )

    def test_ambiguous_autonomy_grant_blocks(
        self
    ):
        request = source_request()

        with patch.object(
            resolver,
            "resolve_autonomy_grant",
            return_value=(
                None,
                "BLOCK",
                "AMBIGUOUS_AUTONOMY_GRANT",
            ),
        ):
            result = resolver.resolve(
                request,
                source_attestation(),
            )

        self.assertEqual(
            result[
                "decision"
            ],
            "BLOCK",
        )

        self.assertEqual(
            result[
                "reason_code"
            ],
            "AMBIGUOUS_AUTONOMY_GRANT",
        )


if __name__ == "__main__":
    unittest.main()