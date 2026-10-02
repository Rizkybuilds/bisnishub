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

    def test_self_asserted_approved_cannot_authorize(
        self,
    ) -> None:
        request = {
            "schema_version": 1,
            "role": "engineer",
            "capability": (
                "engineering.github.feature_branch.push"
            ),
            "environment": "github-remote",
            "declared_risk": "R3",
            "evaluated_at": (
                "2026-10-01T00:00:00Z"
            ),
            "action": {
                "target": (
                    "refs/heads/feature-x"
                ),
                "resource_scope": [
                    "refs/heads/feature-x"
                ],
                "material_parameters": [
                    {
                        "name": "branch",
                        "value": "feature-x",
                    }
                ],
            },
            "conditions": [
                {
                    "id": (
                        "authorized-feature-branch"
                    ),
                    "state": "SATISFIED",
                    "evidence_ref": "WP-fixture",
                },
                {
                    "id": "main-not-targeted",
                    "state": "SATISFIED",
                    "evidence_ref": "WP-fixture",
                },
            ],
            "approval": None,
            "host": {
                "tool_available": True,
                "permission_state": "ALLOW",
            },
        }

        attestation = source_attestation()
        fingerprint = resolver.action_fingerprint(
            request,
            attestation["principal_id"],
            "R3",
        )

        request["approval"] = {
            "status": "APPROVED",
            "type": "ACTION",
            "request_id": "req-1",
            "decision_id": "dec-1",
            "approver": "founder",
            "approver_eligible": True,
            "action_fingerprint": fingerprint,
            "not_expired": True,
            "unused": True,
        }

        synthetic_grant = {
            "id": "fixture-push-grant",
            "level": "L3",
            "risk_ceiling": "R3",
            "basis": "PROMOTION_DECISION",
        }

        synthetic_principal = {
            "id": "engineering.runtime.primary",
            "state": "ACTIVE",
            "allowed_roles": ["engineer"],
            "capability_ceiling": [
                "engineering.github.feature_branch.push"
            ],
            "runtime_binding": {
                "adapter_id": "codex"
            },
        }

        with (
            patch.object(
                resolver,
                "resolve_principal",
                return_value=(
                    synthetic_principal,
                    "ALLOW",
                    "PRINCIPAL_ACTIVE",
                ),
            ),
            patch.object(
                resolver,
                "resolve_autonomy_grant",
                return_value=(
                    synthetic_grant,
                    "ALLOW",
                    "AUTONOMY_GRANT_ACTIVE",
                ),
            ),
        ):
            result = resolver.resolve(
                request,
                attestation,
            )

        self.assertEqual(
            result["decision"],
            "NEED_APPROVAL",
        )
        self.assertEqual(
            result["reason_code"],
            "APPROVAL_EVIDENCE_UNVERIFIED",
        )
        self.assertTrue(
            result["approval_required"]
        )
        self.assertFalse(
            result["tool_execution_allowed"]
        )

    def test_rejected_approval_remains_denial(
        self,
    ) -> None:
        request = {
            "schema_version": 1,
            "role": "engineer",
            "capability": (
                "engineering.github.feature_branch.push"
            ),
            "environment": "github-remote",
            "declared_risk": "R3",
            "evaluated_at": (
                "2026-10-01T00:00:00Z"
            ),
            "action": {
                "target": (
                    "refs/heads/feature-x"
                ),
                "resource_scope": [
                    "refs/heads/feature-x"
                ],
                "material_parameters": [
                    {
                        "name": "branch",
                        "value": "feature-x",
                    }
                ],
            },
            "conditions": [
                {
                    "id": (
                        "authorized-feature-branch"
                    ),
                    "state": "SATISFIED",
                    "evidence_ref": "WP-fixture",
                },
                {
                    "id": "main-not-targeted",
                    "state": "SATISFIED",
                    "evidence_ref": "WP-fixture",
                },
            ],
            "approval": {
                "status": "REJECTED",
                "type": "ACTION",
                "request_id": "req-1",
                "decision_id": "dec-1",
                "approver": "founder",
                "approver_eligible": True,
                "action_fingerprint": (
                    "sha256:" + "0" * 64
                ),
                "not_expired": True,
                "unused": True,
            },
            "host": {
                "tool_available": True,
                "permission_state": "ALLOW",
            },
        }

        attestation = source_attestation()

        synthetic_grant = {
            "id": "fixture-push-grant",
            "level": "L3",
            "risk_ceiling": "R3",
            "basis": "PROMOTION_DECISION",
        }

        synthetic_principal = {
            "id": "engineering.runtime.primary",
            "state": "ACTIVE",
            "allowed_roles": ["engineer"],
            "capability_ceiling": [
                "engineering.github.feature_branch.push"
            ],
            "runtime_binding": {
                "adapter_id": "codex"
            },
        }

        with (
            patch.object(
                resolver,
                "resolve_principal",
                return_value=(
                    synthetic_principal,
                    "ALLOW",
                    "PRINCIPAL_ACTIVE",
                ),
            ),
            patch.object(
                resolver,
                "resolve_autonomy_grant",
                return_value=(
                    synthetic_grant,
                    "ALLOW",
                    "AUTONOMY_GRANT_ACTIVE",
                ),
            ),
        ):
            result = resolver.resolve(
                request,
                attestation,
            )

        self.assertEqual(
            result["decision"],
            "DENY",
        )
        self.assertEqual(
            result["reason_code"],
            "APPROVAL_REJECTED",
        )
        self.assertFalse(
            result["tool_execution_allowed"]
        )


if __name__ == "__main__":
    unittest.main()