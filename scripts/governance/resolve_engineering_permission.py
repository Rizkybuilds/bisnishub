"""Resolve deterministic engineering permission preflight.

The resolver evaluates repository engineering policy before tool execution.
ALLOW means policy preflight passed. It does not mean the action succeeded.
"""

import argparse
import hashlib
import json
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[2]

CAPABILITIES = (
    ".agents/capabilities/registry.yaml"
)

GRANTS = (
    ".agents/capabilities/role-grants.yaml"
)

CONDITIONS = (
    ".agents/capabilities/conditions.yaml"
)

RISK_LEVELS = (
    "R0",
    "R1",
    "R2",
    "R3",
    "R4",
    "R5",
)

AUTONOMY_LEVELS = (
    "L0",
    "L1",
    "L2",
    "L3",
    "L4",
)


def require(condition, message):
    if not condition:
        raise ValueError(message)


def load_yaml(path):
    value = yaml.safe_load(
        path.read_text(
            encoding="utf-8"
        )
    )

    require(
        isinstance(value, dict),
        f"Invalid YAML: {path}",
    )

    return value


def load_json(path):
    value = json.loads(
        path.read_text(
            encoding="utf-8"
        )
    )

    require(
        isinstance(value, dict),
        f"Invalid JSON: {path}",
    )

    return value


def risk_index(value):
    return RISK_LEVELS.index(
        value
    )


def autonomy_index(value):
    return AUTONOMY_LEVELS.index(
        value
    )


def canonical_material_parameters(
    values,
):
    seen = set()
    output = []

    for item in values:
        name = item[
            "name"
        ]

        require(
            name not in seen,
            (
                "Duplicate material "
                f"parameter: {name}"
            ),
        )

        seen.add(name)

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
    request,
    effective_risk,
):
    action = request[
        "action"
    ]

    payload = {
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


def index_capabilities(catalog):
    result = {}

    for entry in catalog[
        "capabilities"
    ]:
        result[
            entry[
                "id"
            ]
        ] = entry

    return result


def base_decision(
    request,
    capability,
    *,
    role_grant_state,
    effective_risk,
    risk_adjusted,
    fingerprint,
    required_conditions,
):
    return {
        "schema_version": 1,

        "decision":
            "BLOCK",

        "reason_code":
            "UNRESOLVED",

        "principal":
            request[
                "principal"
            ][
                "principal_id"
            ]
            if isinstance(
                request[
                    "principal"
                ],
                dict,
            )
            else request[
                "principal"
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
            request[
                "autonomy"
            ][
                "level"
            ],

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
            capability[
                "verification_required"
            ],

        "tool_execution_allowed":
            False,

        "details": [],
    }


def finish(
    decision,
    outcome,
    reason,
    *details,
):
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
        outcome == "ALLOW"
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


def approval_resolution(
    request,
    fingerprint,
):
    approval = request.get(
        "approval"
    )

    if approval is None:
        return (
            False,
            "NEED_APPROVAL",
            "APPROVAL_REQUIRED",
        )

    status = approval[
        "status"
    ]

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

    if not approval[
        "approver_eligible"
    ]:
        return (
            False,
            "DENY",
            "APPROVER_INELIGIBLE",
        )

    if not approval[
        "not_expired"
    ]:
        return (
            False,
            "NEED_APPROVAL",
            "APPROVAL_EXPIRED",
        )

    if not approval[
        "unused"
    ]:
        return (
            False,
            "NEED_APPROVAL",
            "APPROVAL_ALREADY_CONSUMED",
        )

    if approval.get(
        "action_fingerprint"
    ) != fingerprint:
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

    # V1 consequential engineering capabilities
    # use action-bound approval. Policy approval belongs
    # to a future standing-policy grant implementation.
    if approval[
        "type"
    ] == "POLICY":
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


def resolve(
    request,
    *,
    root=ROOT,
):
    root = Path(
        root
    )

    capability_catalog = load_yaml(
        root
        / CAPABILITIES
    )

    grant_catalog = load_yaml(
        root
        / GRANTS
    )

    condition_catalog = load_yaml(
        root
        / CONDITIONS
    )

    capabilities = (
        index_capabilities(
            capability_catalog
        )
    )

    role = request[
        "role"
    ]

    capability_id = request[
        "capability"
    ]

    require(
        role
        in grant_catalog[
            "roles"
        ],
        (
            "Unknown role: "
            f"{role}"
        ),
    )

    if capability_id not in capabilities:
        # Unknown capabilities never fall through.
        dummy = {
            "minimum_autonomy":
                None,
            "autonomy_ceiling":
                None,
            "verification_required":
                False,
        }

        fingerprint = (
            "sha256:"
            + hashlib.sha256(
                capability_id.encode(
                    "utf-8"
                )
            ).hexdigest()
        )

        decision = (
            base_decision(
                request,
                dummy,
                role_grant_state=
                    "DENIED",
                effective_risk=
                    None,
                risk_adjusted=
                    False,
                fingerprint=
                    fingerprint,
                required_conditions=[],
            )
        )

        return finish(
            decision,
            "DENY",
            "UNKNOWN_CAPABILITY",
        )

    capability = capabilities[
        capability_id
    ]

    # Resolve baseline grant first.
    role_policy = grant_catalog[
        "roles"
    ][
        role
    ]

    global_prohibitions = set(
        grant_catalog[
            "global_prohibitions"
        ]
    )

    explicit_denials = set(
        role_policy.get(
            "explicit_denials",
            [],
        )
    )

    if (
        capability[
            "disposition"
        ]
        == "PROHIBITED"
        or capability_id
        in global_prohibitions
    ):
        role_grant_state = (
            "PROHIBITED"
        )

    elif capability_id in explicit_denials:
        role_grant_state = (
            "DENIED"
        )

    elif capability_id in role_policy.get(
        "granted",
        {},
    ):
        role_grant_state = (
            "GRANTED"
        )

    elif capability_id in role_policy.get(
        "conditional",
        {},
    ):
        role_grant_state = (
            "CONDITIONAL"
        )

    else:
        role_grant_state = (
            "DENIED"
        )

    environment = request[
        "environment"
    ]

    declared_risk = request[
        "declared_risk"
    ]

    # UNKNOWN risk cannot be safely normalized downward.
    if declared_risk == "UNKNOWN":
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
            capability.get(
                "environment_risk_floor",
                {},
            ).get(
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
            effective_risk,
        )
    )

    grant_entry = {}

    if role_grant_state == "GRANTED":
        grant_entry = (
            role_policy[
                "granted"
            ][
                capability_id
            ]
        )

    elif role_grant_state == "CONDITIONAL":
        grant_entry = (
            role_policy[
                "conditional"
            ][
                capability_id
            ]
        )

    required_conditions = (
        grant_entry.get(
            "requires",
            [],
        )
        if grant_entry
        else []
    )

    decision = base_decision(
        request,
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
    )

    if role_grant_state == "PROHIBITED":
        return finish(
            decision,
            "DENY",
            "CAPABILITY_PROHIBITED",
        )

    if role_grant_state == "DENIED":
        return finish(
            decision,
            "DENY",
            "ROLE_CAPABILITY_NOT_GRANTED",
        )

    if declared_risk == "UNKNOWN":
        return finish(
            decision,
            "BLOCK",
            "RISK_UNRESOLVED",
            (
                "Capability baseline risk "
                "was identified, but material "
                "context remains unresolved."
            ),
        )

    if environment == "UNKNOWN":
        return finish(
            decision,
            "BLOCK",
            "ENVIRONMENT_UNVERIFIED",
        )

    if environment not in capability[
        "supported_environments"
    ]:
        return finish(
            decision,
            "DENY",
            "ENVIRONMENT_NOT_SUPPORTED",
        )

    # --------------------------------------------------------
    # Principal attestation
    # --------------------------------------------------------

    principal = request[
        "principal"
    ]

    if isinstance(
        principal,
        dict,
    ):
        if not principal.get(
            "verified"
        ):
            return finish(
                decision,
                "DENY",
                "PRINCIPAL_UNVERIFIED",
            )

    # --------------------------------------------------------
    # Autonomy
    # --------------------------------------------------------

    autonomy = request[
        "autonomy"
    ]

    if not autonomy[
        "verified"
    ]:
        return finish(
            decision,
            "BLOCK",
            "AUTONOMY_UNVERIFIED",
        )

    if not autonomy[
        "scope_match"
    ]:
        return finish(
            decision,
            "DENY",
            "AUTONOMY_SCOPE_MISMATCH",
        )

    if not autonomy[
        "environment_match"
    ]:
        return finish(
            decision,
            "DENY",
            "AUTONOMY_ENVIRONMENT_MISMATCH",
        )

    current = autonomy[
        "level"
    ]

    minimum = capability.get(
        "minimum_autonomy"
    )

    ceiling = capability.get(
        "autonomy_ceiling"
    )

    if (
        minimum is not None
        and autonomy_index(
            current
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
        ceiling is not None
        and autonomy_index(
            current
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

    # --------------------------------------------------------
    # Conditions
    # --------------------------------------------------------

    condition_defs = (
        condition_catalog[
            "conditions"
        ]
    )

    supplied = {}

    for item in request[
        "conditions"
    ]:
        condition_id = item[
            "id"
        ]

        require(
            condition_id
            not in supplied,
            (
                "Duplicate supplied condition: "
                f"{condition_id}"
            ),
        )

        require(
            condition_id
            in condition_defs,
            (
                "Unknown supplied condition: "
                f"{condition_id}"
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

    missing = []

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

        definition = condition_defs[
            condition_id
        ]

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
                request,
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

        if state == "SATISFIED":
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

        if state == "UNSATISFIED":
            outcome = definition[
                "on_unsatisfied"
            ]

            return finish(
                decision,
                outcome,
                "CONDITION_UNSATISFIED",
                condition_id,
            )

        outcome = definition[
            "on_unknown"
        ]

        return finish(
            decision,
            outcome,
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

    # --------------------------------------------------------
    # Host/runtime execution boundary
    # --------------------------------------------------------

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

    if not host[
        "tool_available"
    ]:
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


def main():
    parser = argparse.ArgumentParser(
        description=__doc__
    )

    parser.add_argument(
        "--request",
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
        request = load_json(
            args.request
        )

        decision = resolve(
            request,
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