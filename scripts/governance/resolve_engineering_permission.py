"""Resolve deterministic engineering permission preflight.

The resolver evaluates repository engineering policy before tool execution.
ALLOW means policy preflight passed. It does not mean the action succeeded.
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
from pathlib import Path
from typing import Any

import yaml


ROOT = Path(__file__).resolve().parents[2]

CAPABILITIES = ".agents/capabilities/registry.yaml"
GRANTS = ".agents/capabilities/role-grants.yaml"
CONDITIONS = ".agents/capabilities/conditions.yaml"
PRINCIPALS = ".agents/principals/registry.yaml"
AUTONOMY_GRANTS = ".agents/autonomy/grants.yaml"

RISK_LEVELS = ("R0", "R1", "R2", "R3", "R4", "R5")
AUTONOMY_LEVELS = ("L0", "L1", "L2", "L3", "L4")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def load_yaml(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    require(isinstance(value, dict), f"Invalid YAML mapping: {path}")
    return value


def load_json(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    require(isinstance(value, dict), f"Invalid JSON object: {path}")
    return value


def risk_index(value: str) -> int:
    require(value in RISK_LEVELS, f"Unknown risk level: {value}")
    return RISK_LEVELS.index(value)


def autonomy_index(value: str) -> int:
    require(
        value in AUTONOMY_LEVELS,
        f"Unknown autonomy level: {value}",
    )

    return AUTONOMY_LEVELS.index(value)


def parse_timestamp(value: str) -> dt.datetime:
    require(
        isinstance(value, str)
        and value.strip(),
        "Missing timestamp",
    )

    normalized = value.replace(
        "Z",
        "+00:00",
    )

    parsed = dt.datetime.fromisoformat(
        normalized
    )

    require(
        parsed.tzinfo is not None,
        (
            "Timestamp must include timezone: "
            f"{value}"
        ),
    )

    return parsed.astimezone(
        dt.timezone.utc
    )


def canonical_material_parameters(
    values: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    seen: set[str] = set()
    output: list[dict[str, Any]] = []

    for item in values:
        require(
            isinstance(item, dict),
            "Invalid material parameter",
        )

        name = item.get(
            "name"
        )

        require(
            isinstance(name, str)
            and name.strip(),
            "Invalid material parameter name",
        )

        require(
            name not in seen,
            (
                "Duplicate material "
                f"parameter: {name}"
            ),
        )

        require(
            "value" in item,
            (
                "Material parameter "
                f"has no value: {name}"
            ),
        )

        seen.add(
            name
        )

        output.append(
            {
                "name":
                    name,
                "value":
                    item[
                        "value"
                    ],
            }
        )

    return sorted(
        output,
        key=lambda item:
            item[
                "name"
            ],
    )


def action_fingerprint(
    request: dict[str, Any],
    principal_id: str,
    effective_risk: str,
) -> str:
    action = request[
        "action"
    ]

    payload = {
        "principal_id":
            principal_id,

        "role":
            request[
                "role"
            ],

        "capability":
            request[
                "capability"
            ],

        "environment":
            request[
                "environment"
            ],

        "target":
            action[
                "target"
            ],

        "resource_scope":
            sorted(
                set(
                    action[
                        "resource_scope"
                    ]
                )
            ),

        "material_parameters":
            canonical_material_parameters(
                action[
                    "material_parameters"
                ]
            ),

        "effective_risk":
            effective_risk,
    }

    encoded = json.dumps(
        payload,
        sort_keys=True,
        separators=(
            ",",
            ":",
        ),
        ensure_ascii=False,
    ).encode(
        "utf-8"
    )

    return (
        "sha256:"
        + hashlib.sha256(
            encoded
        ).hexdigest()
    )


def index_capabilities(
    catalog: dict[str, Any],
) -> dict[str, dict[str, Any]]:
    entries = catalog.get(
        "capabilities"
    )

    require(
        isinstance(
            entries,
            list,
        ),
        (
            "Capability registry has "
            "no capabilities list"
        ),
    )

    result: dict[
        str,
        dict[str, Any],
    ] = {}

    for item in entries:
        require(
            isinstance(
                item,
                dict,
            ),
            "Invalid capability entry",
        )

        capability_id = item.get(
            "id"
        )

        require(
            isinstance(
                capability_id,
                str,
            ),
            (
                "Capability entry "
                "missing id"
            ),
        )

        require(
            capability_id
            not in result,
            (
                "Duplicate capability: "
                f"{capability_id}"
            ),
        )

        result[
            capability_id
        ] = item

    return result


def index_principals(
    catalog: dict[str, Any],
) -> dict[str, dict[str, Any]]:
    entries = catalog.get(
        "principals"
    )

    require(
        isinstance(
            entries,
            list,
        ),
        (
            "Principal registry "
            "has no principals list"
        ),
    )

    result: dict[
        str,
        dict[str, Any],
    ] = {}

    for item in entries:
        require(
            isinstance(
                item,
                dict,
            ),
            "Invalid principal entry",
        )

        principal_id = item.get(
            "id"
        )

        require(
            isinstance(
                principal_id,
                str,
            ),
            "Principal entry missing id",
        )

        require(
            principal_id
            not in result,
            (
                "Duplicate principal: "
                f"{principal_id}"
            ),
        )

        result[
            principal_id
        ] = item

    return result


def scope_matches(
    scope: dict[str, Any],
    resources: list[str],
) -> bool:
    mode = scope.get(
        "mode"
    )

    values = scope.get(
        "values",
        [],
    )

    require(
        isinstance(
            values,
            list,
        ),
        (
            "Invalid autonomy "
            "resource scope values"
        ),
    )

    if mode == "ANY":
        return True

    if mode == "EXACT":
        allowed = set(
            values
        )

        return all(
            resource in allowed
            for resource
            in resources
        )

    if mode == "PREFIX":
        def covered(
            resource: str,
        ) -> bool:
            normalized_resource = (
                resource
                .replace(
                    "\\",
                    "/",
                )
                .rstrip(
                    "/"
                )
            )

            for value in values:
                require(
                    isinstance(
                        value,
                        str,
                    ),
                    (
                        "Invalid PREFIX "
                        "scope value"
                    ),
                )

                prefix = (
                    value
                    .replace(
                        "\\",
                        "/",
                    )
                    .rstrip(
                        "/"
                    )
                )

                if (
                    normalized_resource
                    == prefix
                    or normalized_resource
                    .startswith(
                        prefix
                        + "/"
                    )
                ):
                    return True

            return False

        return all(
            covered(
                resource
            )
            for resource
            in resources
        )

    raise ValueError(
        (
            "Unknown scope mode: "
            f"{mode}"
        )
    )


def resolve_principal(
    attestation: dict[str, Any],
    principals: dict[
        str,
        dict[str, Any],
    ],
) -> tuple[
    dict[str, Any] | None,
    str,
    str,
]:
    require(
        isinstance(
            attestation,
            dict,
        ),
        "Missing principal attestation",
    )

    principal_id = attestation.get(
        "principal_id"
    )

    if (
        attestation.get(
            "verified"
        )
        is not True
    ):
        return (
            None,
            "BLOCK",
            "PRINCIPAL_UNVERIFIED",
        )

    principal = principals.get(
        principal_id
    )

    if principal is None:
        return (
            None,
            "DENY",
            "UNKNOWN_PRINCIPAL",
        )

    state = principal.get(
        "state"
    )

    if state != "ACTIVE":
        return (
            None,
            "DENY",
            (
                "PRINCIPAL_"
                + (
                    state
                    or "INVALID"
                )
            ),
        )

    expected_adapter = (
        principal
        .get(
            "runtime_binding",
            {},
        )
        .get(
            "adapter_id"
        )
    )

    if (
        attestation.get(
            "adapter_id"
        )
        != expected_adapter
    ):
        return (
            None,
            "DENY",
            "PRINCIPAL_BINDING_MISMATCH",
        )

    require(
        isinstance(
            attestation.get(
                "session_id"
            ),
            str,
        )
        and attestation[
            "session_id"
        ].strip(),
        (
            "Principal attestation "
            "missing session_id"
        ),
    )

    require(
        isinstance(
            attestation.get(
                "evidence_ref"
            ),
            str,
        )
        and attestation[
            "evidence_ref"
        ].strip(),
        (
            "Principal attestation "
            "missing evidence_ref"
        ),
    )

    return (
        principal,
        "ALLOW",
        "PRINCIPAL_VERIFIED",
    )


def resolve_autonomy_grant(
    request: dict[str, Any],
    principal: dict[str, Any],
    capability: dict[str, Any],
    grants: dict[str, Any],
) -> tuple[
    dict[str, Any] | None,
    str,
    str,
]:
    entries = grants.get(
        "grants"
    )

    require(
        isinstance(
            entries,
            list,
        ),
        (
            "Autonomy registry "
            "has no grants list"
        ),
    )

    resources = request[
        "action"
    ][
        "resource_scope"
    ]

    environment = request[
        "environment"
    ]

    evaluated_at = parse_timestamp(
        request[
            "evaluated_at"
        ]
    )

    matching: list[
        dict[str, Any]
    ] = []

    for grant in entries:
        require(
            isinstance(
                grant,
                dict,
            ),
            (
                "Invalid autonomy "
                "grant entry"
            ),
        )

        if (
            grant.get(
                "principal_id"
            )
            != principal[
                "id"
            ]
        ):
            continue

        if (
            grant.get(
                "capability_id"
            )
            != capability[
                "id"
            ]
        ):
            continue

        if (
            grant.get(
                "environment"
            )
            != environment
        ):
            continue

        if not scope_matches(
            grant.get(
                "resource_scope",
                {},
            ),
            resources,
        ):
            continue

        matching.append(
            grant
        )

    if not matching:
        return (
            None,
            "DENY",
            "AUTONOMY_GRANT_NOT_FOUND",
        )

    active: list[
        dict[str, Any]
    ] = []

    suspended = False

    for grant in matching:
        state = grant.get(
            "state"
        )

        if state == "SUSPENDED":
            suspended = True
            continue

        if state in {
            "REVOKED",
            "EXPIRED",
        }:
            continue

        require(
            state == "ACTIVE",
            (
                "Unknown autonomy "
                f"grant state: {state}"
            ),
        )

        effective_from = (
            parse_timestamp(
                grant[
                    "effective_from"
                ]
            )
        )

        if (
            evaluated_at
            < effective_from
        ):
            continue

        expires_at = grant.get(
            "expires_at"
        )

        if (
            expires_at
            is not None
            and evaluated_at
            >= parse_timestamp(
                expires_at
            )
        ):
            continue

        active.append(
            grant
        )

    if len(
        active
    ) > 1:
        return (
            None,
            "BLOCK",
            "AMBIGUOUS_AUTONOMY_GRANT",
        )

    if len(
        active
    ) == 1:
        return (
            active[0],
            "ALLOW",
            "AUTONOMY_GRANT_ACTIVE",
        )

    if suspended:
        return (
            None,
            "BLOCK",
            "AUTONOMY_GRANT_SUSPENDED",
        )

    return (
        None,
        "DENY",
        "AUTONOMY_GRANT_NOT_ACTIVE",
    )


def approval_resolution(
    approval: dict[
        str,
        Any,
    ]
    | None,
    fingerprint: str,
) -> tuple[
    bool,
    str,
    str,
]:
    if approval is None:
        return (
            False,
            "NEED_APPROVAL",
            "APPROVAL_REQUIRED",
        )

    status = approval.get(
        "status"
    )

    if status == "REJECTED":
        return (
            False,
            "DENY",
            "APPROVAL_REJECTED",
        )

    if status in {
        "AWAITING_APPROVAL",
        "EDIT_REQUESTED",
        "DEFERRED",
    }:
        return (
            False,
            "NEED_APPROVAL",
            "APPROVAL_NOT_GRANTED",
        )

    if status == "EXPIRED":
        return (
            False,
            "NEED_APPROVAL",
            "APPROVAL_EXPIRED",
        )

    if status == "INVALIDATED":
        return (
            False,
            "NEED_APPROVAL",
            "APPROVAL_INVALIDATED",
        )

    require(
        status == "APPROVED",
        (
            "Unsupported approval "
            f"status: {status}"
        ),
    )

    if (
        approval.get(
            "approver_eligible"
        )
        is not True
    ):
        return (
            False,
            "DENY",
            "APPROVER_INELIGIBLE",
        )

    if (
        approval.get(
            "not_expired"
        )
        is not True
    ):
        return (
            False,
            "NEED_APPROVAL",
            "APPROVAL_EXPIRED",
        )

    if (
        approval.get(
            "unused"
        )
        is not True
    ):
        return (
            False,
            "NEED_APPROVAL",
            "APPROVAL_ALREADY_CONSUMED",
        )

    if (
        approval.get(
            "action_fingerprint"
        )
        != fingerprint
    ):
        return (
            False,
            "NEED_APPROVAL",
            "APPROVAL_FINGERPRINT_MISMATCH",
        )

    if not approval.get(
        "decision_id"
    ):
        return (
            False,
            "NEED_APPROVAL",
            "APPROVAL_EVIDENCE_INCOMPLETE",
        )

    if (
        approval.get(
            "type"
        )
        == "POLICY"
    ):
        return (
            False,
            "NEED_APPROVAL",
            "ACTION_APPROVAL_REQUIRED",
        )

    return (
        True,
        "ALLOW",
        "APPROVAL_VALID",
    )


def base_decision(
    request: dict[str, Any],
    principal: dict[str, Any],
    attestation: dict[str, Any],
    capability: dict[str, Any],
    *,
    role_grant_state: str,
    effective_risk: str | None,
    risk_adjusted: bool,
    fingerprint: str,
    required_conditions: list[str],
    autonomy_grant:
        dict[str, Any]
        | None,
) -> dict[str, Any]:
    return {
        "schema_version":
            1,

        "decision":
            "BLOCK",

        "reason_code":
            "UNRESOLVED",

        "principal_id":
            principal[
                "id"
            ],

        "principal_attestation_ref":
            attestation[
                "evidence_ref"
            ],

        "role":
            request[
                "role"
            ],

        "capability":
            request[
                "capability"
            ],

        "role_grant_state":
            role_grant_state,

        "environment":
            request[
                "environment"
            ],

        "declared_risk":
            request[
                "declared_risk"
            ],

        "effective_risk":
            effective_risk,

        "risk_adjusted":
            risk_adjusted,

        "minimum_autonomy":
            capability.get(
                "minimum_autonomy"
            ),

        "autonomy_ceiling":
            capability.get(
                "autonomy_ceiling"
            ),

        "current_autonomy":
            (
                autonomy_grant.get(
                    "level"
                )
                if autonomy_grant
                else None
            ),

        "autonomy_grant_id":
            (
                autonomy_grant.get(
                    "id"
                )
                if autonomy_grant
                else None
            ),

        "autonomy_basis":
            (
                autonomy_grant.get(
                    "basis"
                )
                if autonomy_grant
                else None
            ),

        "action_fingerprint":
            fingerprint,

        "required_conditions":
            list(
                required_conditions
            ),

        "missing_conditions":
            [],

        "approval_required":
            False,

        "post_execution_verification_required":
            bool(
                capability.get(
                    "verification_required",
                    False,
                )
            ),

        "tool_execution_allowed":
            False,

        "details":
            [],
    }


def finish(
    decision: dict[str, Any],
    outcome: str,
    reason: str,
    *details: str,
) -> dict[str, Any]:
    result = dict(
        decision
    )

    result[
        "decision"
    ] = outcome

    result[
        "reason_code"
    ] = reason

    result[
        "tool_execution_allowed"
    ] = (
        outcome
        == "ALLOW"
    )

    result[
        "details"
    ] = [
        detail
        for detail
        in details
        if detail
    ]

    return result


def resolve(
    request: dict[str, Any],
    attestation: dict[str, Any],
    *,
    root: Path = ROOT,
) -> dict[str, Any]:
    root = Path(
        root
    ).resolve()

    capability_catalog = (
        load_yaml(
            root
            / CAPABILITIES
        )
    )

    grant_catalog = (
        load_yaml(
            root
            / GRANTS
        )
    )

    condition_catalog = (
        load_yaml(
            root
            / CONDITIONS
        )
    )

    principal_catalog = (
        load_yaml(
            root
            / PRINCIPALS
        )
    )

    autonomy_catalog = (
        load_yaml(
            root
            / AUTONOMY_GRANTS
        )
    )

    capabilities = (
        index_capabilities(
            capability_catalog
        )
    )

    principals = (
        index_principals(
            principal_catalog
        )
    )

    (
        principal,
        principal_outcome,
        principal_reason,
    ) = resolve_principal(
        attestation,
        principals,
    )

    if principal is None:
        return {
            "schema_version":
                1,

            "decision":
                principal_outcome,

            "reason_code":
                principal_reason,

            "principal_id":
                attestation.get(
                    "principal_id",
                    "UNKNOWN",
                ),

            "principal_attestation_ref":
                attestation.get(
                    "evidence_ref",
                    "UNKNOWN",
                ),

            "role":
                request.get(
                    "role",
                    "UNKNOWN",
                ),

            "capability":
                request.get(
                    "capability",
                    "UNKNOWN",
                ),

            "role_grant_state":
                "DENIED",

            "environment":
                request.get(
                    "environment",
                    "UNKNOWN",
                ),

            "declared_risk":
                request.get(
                    "declared_risk",
                    "UNKNOWN",
                ),

            "effective_risk":
                None,

            "risk_adjusted":
                False,

            "minimum_autonomy":
                None,

            "autonomy_ceiling":
                None,

            "current_autonomy":
                None,

            "autonomy_grant_id":
                None,

            "autonomy_basis":
                None,

            "action_fingerprint":
                (
                    "sha256:"
                    + "0" * 64
                ),

            "required_conditions":
                [],

            "missing_conditions":
                [],

            "approval_required":
                False,

            "post_execution_verification_required":
                False,

            "tool_execution_allowed":
                False,

            "details":
                [],
        }

    role = request[
        "role"
    ]

    capability_id = request[
        "capability"
    ]

    if (
        role
        not in principal.get(
            "allowed_roles",
            [],
        )
    ):
        dummy_capability = {
            "id":
                capability_id,
            "minimum_autonomy":
                None,
            "autonomy_ceiling":
                None,
            "verification_required":
                False,
        }

        fingerprint = (
            action_fingerprint(
                request,
                principal[
                    "id"
                ],
                "R0",
            )
        )

        decision = (
            base_decision(
                request,
                principal,
                attestation,
                dummy_capability,
                role_grant_state=
                    "DENIED",
                effective_risk=
                    None,
                risk_adjusted=
                    False,
                fingerprint=
                    fingerprint,
                required_conditions=[],
                autonomy_grant=None,
            )
        )

        return finish(
            decision,
            "DENY",
            "ROLE_NOT_ALLOWED_FOR_PRINCIPAL",
        )

    capability = capabilities.get(
        capability_id
    )

    if capability is None:
        dummy_capability = {
            "id":
                capability_id,
            "minimum_autonomy":
                None,
            "autonomy_ceiling":
                None,
            "verification_required":
                False,
        }

        fingerprint = (
            action_fingerprint(
                request,
                principal[
                    "id"
                ],
                "R0",
            )
        )

        decision = (
            base_decision(
                request,
                principal,
                attestation,
                dummy_capability,
                role_grant_state=
                    "DENIED",
                effective_risk=
                    None,
                risk_adjusted=
                    False,
                fingerprint=
                    fingerprint,
                required_conditions=[],
                autonomy_grant=None,
            )
        )

        return finish(
            decision,
            "DENY",
            "UNKNOWN_CAPABILITY",
        )

    global_prohibitions = set(
        grant_catalog.get(
            "global_prohibitions",
            [],
        )
    )

    if (
        capability.get(
            "disposition"
        )
        == "PROHIBITED"
        or capability_id
        in global_prohibitions
    ):
        fingerprint = (
            action_fingerprint(
                request,
                principal[
                    "id"
                ],
                capability[
                    "baseline_risk"
                ],
            )
        )

        decision = (
            base_decision(
                request,
                principal,
                attestation,
                capability,
                role_grant_state=
                    "PROHIBITED",
                effective_risk=
                    capability[
                        "baseline_risk"
                    ],
                risk_adjusted=
                    False,
                fingerprint=
                    fingerprint,
                required_conditions=[],
                autonomy_grant=None,
            )
        )

        return finish(
            decision,
            "DENY",
            "CAPABILITY_PROHIBITED",
        )

    if (
        capability_id
        not in principal.get(
            "capability_ceiling",
            [],
        )
    ):
        fingerprint = (
            action_fingerprint(
                request,
                principal[
                    "id"
                ],
                capability[
                    "baseline_risk"
                ],
            )
        )

        decision = (
            base_decision(
                request,
                principal,
                attestation,
                capability,
                role_grant_state=
                    "DENIED",
                effective_risk=
                    capability[
                        "baseline_risk"
                    ],
                risk_adjusted=
                    False,
                fingerprint=
                    fingerprint,
                required_conditions=[],
                autonomy_grant=None,
            )
        )

        return finish(
            decision,
            "DENY",
            "PRINCIPAL_CAPABILITY_CEILING",
        )

    require(
        role
        in grant_catalog.get(
            "roles",
            {},
        ),
        (
            "Unknown role: "
            f"{role}"
        ),
    )

    role_policy = (
        grant_catalog[
            "roles"
        ][
            role
        ]
    )

    explicit_denials = set(
        role_policy.get(
            "explicit_denials",
            [],
        )
    )

    if (
        capability_id
        in explicit_denials
    ):
        role_grant_state = (
            "DENIED"
        )

    elif (
        capability_id
        in explicit_denials
    ):
        role_grant_state = (
            "DENIED"
        )

    elif (
        capability_id
        in role_policy.get(
            "granted",
            {},
        )
    ):
        role_grant_state = (
            "GRANTED"
        )

    elif (
        capability_id
        in role_policy.get(
            "conditional",
            {},
        )
    ):
        role_grant_state = (
            "CONDITIONAL"
        )

    else:
        role_grant_state = (
            "DENIED"
        )

    declared_risk = request[
        "declared_risk"
    ]

    environment = request[
        "environment"
    ]

    if (
        declared_risk
        == "UNKNOWN"
    ):
        effective_risk = (
            capability[
                "baseline_risk"
            ]
        )

        risk_adjusted = True

    else:
        floors = [
            capability[
                "baseline_risk"
            ],
            declared_risk,
        ]

        environment_floor = (
            capability
            .get(
                "environment_risk_floor",
                {},
            )
            .get(
                environment
            )
        )

        if environment_floor:
            floors.append(
                environment_floor
            )

        effective_risk = max(
            floors,
            key=risk_index,
        )

        risk_adjusted = (
            effective_risk
            != declared_risk
        )

    fingerprint = (
        action_fingerprint(
            request,
            principal[
                "id"
            ],
            effective_risk,
        )
    )

    grant_entry: dict[
        str,
        Any,
    ] = {}

    if (
        role_grant_state
        == "GRANTED"
    ):
        grant_entry = (
            role_policy[
                "granted"
            ][
                capability_id
            ]
        )

    elif (
        role_grant_state
        == "CONDITIONAL"
    ):
        grant_entry = (
            role_policy[
                "conditional"
            ][
                capability_id
            ]
        )

    required_conditions = (
        list(
            grant_entry.get(
                "requires",
                [],
            )
        )
        if grant_entry
        else []
    )

    decision = (
        base_decision(
            request,
            principal,
            attestation,
            capability,
            role_grant_state=
                role_grant_state,
            effective_risk=
                effective_risk,
            risk_adjusted=
                risk_adjusted,
            fingerprint=
                fingerprint,
            required_conditions=
                required_conditions,
            autonomy_grant=None,
        )
    )

    if (
        role_grant_state
        == "PROHIBITED"
    ):
        return finish(
            decision,
            "DENY",
            "CAPABILITY_PROHIBITED",
        )

    if (
        role_grant_state
        == "DENIED"
    ):
        return finish(
            decision,
            "DENY",
            "ROLE_CAPABILITY_NOT_GRANTED",
        )

    if (
        declared_risk
        == "UNKNOWN"
    ):
        return finish(
            decision,
            "BLOCK",
            "RISK_UNRESOLVED",
            (
                "Capability baseline risk "
                "is known but contextual "
                "effective risk is unresolved."
            ),
        )

    if (
        environment
        == "UNKNOWN"
    ):
        return finish(
            decision,
            "BLOCK",
            "ENVIRONMENT_UNVERIFIED",
        )

    if (
        environment
        not in capability.get(
            "supported_environments",
            [],
        )
    ):
        return finish(
            decision,
            "DENY",
            "ENVIRONMENT_NOT_SUPPORTED",
        )

    (
        autonomy_grant,
        autonomy_outcome,
        autonomy_reason,
    ) = resolve_autonomy_grant(
        request,
        principal,
        capability,
        autonomy_catalog,
    )

    if autonomy_grant is None:
        return finish(
            decision,
            autonomy_outcome,
            autonomy_reason,
        )

    decision = (
        base_decision(
            request,
            principal,
            attestation,
            capability,
            role_grant_state=
                role_grant_state,
            effective_risk=
                effective_risk,
            risk_adjusted=
                risk_adjusted,
            fingerprint=
                fingerprint,
            required_conditions=
                required_conditions,
            autonomy_grant=
                autonomy_grant,
        )
    )

    if (
        risk_index(
            effective_risk
        )
        > risk_index(
            autonomy_grant[
                "risk_ceiling"
            ]
        )
    ):
        return finish(
            decision,
            "DENY",
            "AUTONOMY_RISK_SCOPE_EXCEEDED",
        )

    current_autonomy = (
        autonomy_grant[
            "level"
        ]
    )

    minimum = capability.get(
        "minimum_autonomy"
    )

    ceiling = capability.get(
        "autonomy_ceiling"
    )

    require(
        minimum
        in AUTONOMY_LEVELS,
        (
            "Capability has invalid "
            "minimum autonomy: "
            f"{capability_id}"
        ),
    )

    require(
        ceiling
        in AUTONOMY_LEVELS,
        (
            "Capability has invalid "
            "autonomy ceiling: "
            f"{capability_id}"
        ),
    )

    if (
        autonomy_index(
            current_autonomy
        )
        < autonomy_index(
            minimum
        )
    ):
        return finish(
            decision,
            "DENY",
            "AUTONOMY_INSUFFICIENT",
        )

    if (
        autonomy_index(
            current_autonomy
        )
        > autonomy_index(
            ceiling
        )
    ):
        return finish(
            decision,
            "BLOCK",
            "AUTONOMY_EXCEEDS_CAPABILITY_CEILING",
        )

    condition_defs = (
        condition_catalog.get(
            "conditions"
        )
    )

    require(
        isinstance(
            condition_defs,
            dict,
        ),
        (
            "Condition registry "
            "has no conditions mapping"
        ),
    )

    supplied: dict[
        str,
        dict[str, Any],
    ] = {}

    for item in request.get(
        "conditions",
        [],
    ):
        condition_id = item[
            "id"
        ]

        require(
            condition_id
            not in supplied,
            (
                "Duplicate supplied "
                f"condition: {condition_id}"
            ),
        )

        require(
            condition_id
            in condition_defs,
            (
                "Unknown supplied "
                f"condition: {condition_id}"
            ),
        )

        require(
            condition_defs[
                condition_id
            ][
                "source"
            ]
            != "APPROVAL",
            (
                "Approval-derived condition "
                "cannot be supplied directly: "
                f"{condition_id}"
            ),
        )

        supplied[
            condition_id
        ] = item

    missing: list[str] = []

    for condition_id in (
        required_conditions
    ):
        require(
            condition_id
            in condition_defs,
            (
                "Grant references unknown "
                f"condition: {condition_id}"
            ),
        )

        definition = (
            condition_defs[
                condition_id
            ]
        )

        if (
            definition[
                "source"
            ]
            == "APPROVAL"
        ):
            decision[
                "approval_required"
            ] = True

            (
                approved,
                outcome,
                reason,
            ) = approval_resolution(
                request.get(
                    "approval"
                ),
                fingerprint,
            )

            if not approved:
                decision[
                    "missing_conditions"
                ] = [
                    condition_id
                ]

                return finish(
                    decision,
                    outcome,
                    reason,
                )

            continue

        item = supplied.get(
            condition_id
        )

        if item is None:
            missing.append(
                condition_id
            )

            continue

        state = item[
            "state"
        ]

        if (
            state
            == "SATISFIED"
        ):
            if not item.get(
                "evidence_ref"
            ):
                return finish(
                    decision,
                    "BLOCK",
                    "CONDITION_EVIDENCE_MISSING",
                    condition_id,
                )

            continue

        if (
            state
            == "UNSATISFIED"
        ):
            return finish(
                decision,
                definition[
                    "on_unsatisfied"
                ],
                "CONDITION_UNSATISFIED",
                condition_id,
            )

        require(
            state
            == "UNKNOWN",
            (
                "Unknown condition state: "
                f"{state}"
            ),
        )

        return finish(
            decision,
            definition[
                "on_unknown"
            ],
            "CONDITION_UNKNOWN",
            condition_id,
        )

    if missing:
        decision[
            "missing_conditions"
        ] = missing

        return finish(
            decision,
            "BLOCK",
            "REQUIRED_CONDITION_MISSING",
            *missing,
        )

    host = request[
        "host"
    ]

    if (
        host[
            "permission_state"
        ]
        == "DENY"
    ):
        return finish(
            decision,
            "DENY",
            "HOST_PERMISSION_DENIED",
        )

    if (
        host[
            "permission_state"
        ]
        == "UNKNOWN"
    ):
        return finish(
            decision,
            "BLOCK",
            "HOST_PERMISSION_UNKNOWN",
        )

    require(
        host[
            "permission_state"
        ]
        == "ALLOW",
        (
            "Unknown host "
            "permission state"
        ),
    )

    if (
        host[
            "tool_available"
        ]
        is not True
    ):
        return finish(
            decision,
            "BLOCK",
            "TOOL_UNAVAILABLE",
        )

    return finish(
        decision,
        "ALLOW",
        "PREFLIGHT_SATISFIED",
    )


def main() -> None:
    parser = argparse.ArgumentParser(
        description=__doc__
    )

    parser.add_argument(
        "--request",
        required=True,
        type=Path,
    )

    parser.add_argument(
        "--attestation",
        required=True,
        type=Path,
    )

    parser.add_argument(
        "--root",
        type=Path,
        default=ROOT,
    )

    args = parser.parse_args()

    try:
        decision = resolve(
            load_json(
                args.request
            ),
            load_json(
                args.attestation
            ),
            root=args.root,
        )

    except (
        ValueError,
        OSError,
        TypeError,
        KeyError,
        json.JSONDecodeError,
        yaml.YAMLError,
    ) as error:
        parser.exit(
            1,
            f"FAIL: {error}\n",
        )

    print(
        json.dumps(
            decision,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()