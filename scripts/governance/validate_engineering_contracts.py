"""Validate engineering contract schemas and their cross-artifact semantics.

This validates control-plane structure and synthetic fixtures.
It does not prove runtime behavior, production readiness, or factual claims
inside future execution artifacts.
"""

import argparse
import json
import re
from pathlib import Path

import yaml
from jsonschema import Draft202012Validator, FormatChecker


ROOT = Path(__file__).resolve().parents[2]

RISK_LEVELS = (
    "R0",
    "R1",
    "R2",
    "R3",
    "R4",
    "R5",
)

SCHEMAS = {
    "implementation_contract": (
        ".agents/contracts/implementation-contract.schema.json",
        "IMPLEMENTATION_CONTRACT",
        "planner",
    ),
    "work_package": (
        ".agents/contracts/work-package.schema.json",
        "WORK_PACKAGE",
        "engineer",
    ),
    "engineering_report": (
        ".agents/contracts/engineering-report.schema.json",
        "ENGINEERING_REPORT",
        "engineer",
    ),
    "assurance_report": (
        ".agents/contracts/assurance-report.schema.json",
        "ASSURANCE_REPORT",
        "auditor",
    ),
    "verification_matrix": (
        ".agents/contracts/verification-matrix.schema.json",
        "VERIFICATION_MATRIX",
        "qa",
    ),
    "release_packet": (
        ".agents/contracts/release-packet.schema.json",
        "RELEASE_PACKET",
        "release-operator",
    ),
}

FIXTURE = (
    ".agents/contracts/fixtures/"
    "r5-financial-chain.json"
)


class UniqueLoader(yaml.SafeLoader):
    """Fail on duplicate YAML mapping keys."""


def unique_mapping(loader, node, deep=False):
    result = {}

    for key_node, value_node in node.value:
        key = loader.construct_object(
            key_node,
            deep=deep,
        )

        if key in result:
            raise ValueError(
                f"Duplicate YAML key: {key}"
            )

        result[key] = loader.construct_object(
            value_node,
            deep=deep,
        )

    return result


UniqueLoader.add_constructor(
    yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG,
    unique_mapping,
)


def unique_json(pairs):
    result = {}

    for key, value in pairs:
        if key in result:
            raise ValueError(
                f"Duplicate JSON key: {key}"
            )

        result[key] = value

    return result


def require(condition, message):
    if not condition:
        raise ValueError(message)


def local_file(root, relative):
    require(
        isinstance(relative, str)
        and relative.strip(),
        "Expected nonempty repository path",
    )

    target = (
        root
        / relative
    ).resolve()

    require(
        target.is_relative_to(
            root.resolve()
        ),
        (
            "Reference escapes repository: "
            f"{relative}"
        ),
    )

    require(
        target.is_file(),
        (
            "Missing file: "
            f"{relative}"
        ),
    )

    return target


def load_json(root, relative):
    return json.loads(
        local_file(
            root,
            relative,
        ).read_text(
            encoding="utf-8"
        ),
        object_pairs_hook=unique_json,
    )


def load_yaml(root, relative):
    data = yaml.load(
        local_file(
            root,
            relative,
        ).read_text(
            encoding="utf-8"
        ),
        Loader=UniqueLoader,
    )

    require(
        isinstance(data, dict),
        (
            "Invalid YAML mapping: "
            f"{relative}"
        ),
    )

    return data


def check_strict_objects(
    node,
    label,
    path="$",
):
    if isinstance(node, dict):
        node_type = node.get(
            "type"
        )

        if node_type == "object":
            require(
                node.get(
                    "additionalProperties"
                )
                is False,
                (
                    "Contract object must set "
                    "additionalProperties=false: "
                    f"{label}:{path}"
                ),
            )

        for key, value in node.items():
            check_strict_objects(
                value,
                label,
                f"{path}.{key}",
            )

    elif isinstance(node, list):
        for index, value in enumerate(
            node
        ):
            check_strict_objects(
                value,
                label,
                f"{path}[{index}]",
            )


def validation_error_path(error):
    parts = [
        str(part)
        for part
        in error.absolute_path
    ]

    return (
        ".".join(parts)
        if parts
        else "$"
    )


def validate_instance(
    schema,
    instance,
    label,
):
    validator = Draft202012Validator(
        schema,
        format_checker=FormatChecker(),
    )

    errors = sorted(
        validator.iter_errors(
            instance
        ),
        key=lambda error: "/".join(
            str(part)
            for part
            in error.absolute_path
        ),
    )

    if errors:
        error = errors[0]

        raise ValueError(
            (
                f"{label} schema validation failed "
                f"at {validation_error_path(error)}: "
                f"{error.message}"
            )
        )


def revision_identity(value):
    require(
        isinstance(value, dict),
        "Invalid revision identity",
    )

    if value.get(
        "dirty"
    ) is False:
        return (
            "clean",
            value.get(
                "sha"
            ),
        )

    if value.get(
        "dirty"
    ) is True:
        return (
            "dirty",
            value.get(
                "base_sha"
            ),
            value.get(
                "diff_fingerprint"
            ),
        )

    raise ValueError(
        "Invalid revision dirty state"
    )


def risk_index(level):
    require(
        level in RISK_LEVELS,
        (
            "Unknown risk level: "
            f"{level}"
        ),
    )

    return RISK_LEVELS.index(
        level
    )


def load_roles(root):
    catalog = load_json(
        root,
        ".agents/roles/contracts.json",
    )

    roles = catalog.get(
        "roles"
    )

    require(
        isinstance(roles, list),
        "Invalid role registry",
    )

    ids = {
        entry.get("id")
        for entry
        in roles
        if isinstance(
            entry,
            dict,
        )
    }

    require(
        None not in ids
        and ids,
        "Invalid role IDs",
    )

    return ids


def load_expertise(root):
    catalog = load_yaml(
        root,
        ".agents/expertise/registry.yaml",
    )

    entries = catalog.get(
        "expertise"
    )

    require(
        isinstance(entries, list),
        "Invalid expertise registry",
    )

    result = {}

    for entry in entries:
        require(
            isinstance(entry, dict),
            "Invalid expertise entry",
        )

        expertise_id = entry.get(
            "id"
        )

        require(
            isinstance(
                expertise_id,
                str,
            ),
            "Invalid expertise ID",
        )

        require(
            expertise_id not in result,
            (
                "Duplicate expertise ID: "
                f"{expertise_id}"
            ),
        )

        result[
            expertise_id
        ] = entry

    return result


def load_routing(root):
    return load_yaml(
        root,
        ".agents/routing/task-types.yaml",
    )


def validate_required_expertise(
    expertise_ids,
    expertise_registry,
    label,
):
    for expertise_id in expertise_ids:
        require(
            expertise_id
            in expertise_registry,
            (
                "Unknown expertise in "
                f"{label}: "
                f"{expertise_id}"
            ),
        )

        require(
            expertise_registry[
                expertise_id
            ].get(
                "maturity"
            )
            == "ACTIVE",
            (
                "Required expertise is not "
                "ACTIVE in "
                f"{label}: "
                f"{expertise_id}"
            ),
        )


def required_route_components(
    routing,
    implementation_contract,
):
    route = implementation_contract[
        "routing"
    ]

    profile = route[
        "profile"
    ]

    require(
        profile
        in routing.get(
            "profiles",
            {},
        ),
        (
            "Unknown routing profile: "
            f"{profile}"
        ),
    )

    task_id = route[
        "primary_task_type"
    ]

    tasks = routing.get(
        "task_types",
        {},
    )

    require(
        task_id in tasks,
        (
            "Unknown task type: "
            f"{task_id}"
        ),
    )

    task = tasks[
        task_id
    ]

    concern_ids = route.get(
        "concerns",
        [],
    )

    concerns = routing.get(
        "concerns",
        {},
    )

    required_roles = set(
        task.get(
            "required_roles",
            [],
        )
    )

    required_expertise = set(
        task.get(
            "required_expertise",
            [],
        )
    )

    floors = []

    if task.get(
        "risk_floor"
    ):
        floors.append(
            task[
                "risk_floor"
            ]
        )

    for concern_id in concern_ids:
        require(
            concern_id
            in concerns,
            (
                "Unknown routing concern: "
                f"{concern_id}"
            ),
        )

        concern = concerns[
            concern_id
        ]

        required_roles.update(
            concern.get(
                "required_roles",
                [],
            )
        )

        required_expertise.update(
            concern.get(
                "required_expertise",
                [],
            )
        )

        if concern.get(
            "risk_floor"
        ):
            floors.append(
                concern[
                    "risk_floor"
                ]
            )

    risk_floor = (
        max(
            floors,
            key=risk_index,
        )
        if floors
        else "R0"
    )

    return {
        "roles":
            required_roles,

        "expertise":
            required_expertise,

        "risk_floor":
            risk_floor,
    }


def verify_matrix_semantics(
    matrix,
    acceptance_ids,
):
    cases = matrix[
        "cases"
    ]

    referenced = set()

    for case in cases:
        for acceptance_id in case[
            "acceptance_criterion_ids"
        ]:
            require(
                acceptance_id
                in acceptance_ids,
                (
                    "Verification references "
                    "unknown acceptance criterion: "
                    f"{acceptance_id}"
                ),
            )

            referenced.add(
                acceptance_id
            )

    require(
        acceptance_ids
        <= referenced,
        (
            "Verification matrix does not "
            "cover every acceptance criterion"
        ),
    )

    results = [
        case[
            "result"
        ]
        for case
        in cases
    ]

    overall = matrix[
        "overall_status"
    ]

    if overall == "PASS":
        require(
            all(
                result == "PASS"
                for result
                in results
            )
            and not matrix[
                "unverified_gates"
            ],
            (
                "Verification PASS cannot "
                "contain FAIL/BLOCKED/NOT_RUN "
                "or unverified gates"
            ),
        )

    elif overall == "FAIL":
        require(
            "FAIL" in results,
            (
                "Verification FAIL requires "
                "a failed case"
            ),
        )

    elif overall == "BLOCKED":
        require(
            "BLOCKED" in results,
            (
                "Verification BLOCKED requires "
                "a blocked case"
            ),
        )

    elif overall == "NOT_RUN":
        require(
            all(
                result == "NOT_RUN"
                for result
                in results
            ),
            (
                "Verification NOT_RUN requires "
                "all cases to be NOT_RUN"
            ),
        )

    elif overall == "PARTIAL":
        require(
            not all(
                result == "PASS"
                for result
                in results
            ),
            (
                "Verification PARTIAL cannot "
                "represent an all-PASS matrix"
            ),
        )


def validate_release_readiness(
    packet,
    assurance,
    verification,
):
    if (
        packet[
            "recommendation"
        ]
        != "READY_FOR_AUTHORIZED_RELEASE"
    ):
        return

    require(
        packet[
            "target"
        ][
            "identity_verified"
        ]
        is True,
        (
            "Ready release requires "
            "verified target identity"
        ),
    )

    require(
        not packet[
            "blockers"
        ],
        (
            "Ready release cannot "
            "contain blockers"
        ),
    )

    for gate in packet[
        "gate_matrix"
    ]:
        if gate[
            "required"
        ]:
            require(
                gate[
                    "status"
                ]
                == "PASS",
                (
                    "Ready release requires "
                    "all required gates PASS"
                ),
            )

    recovery = packet[
        "recovery"
    ]

    if recovery[
        "required"
    ]:
        require(
            recovery[
                "verified"
            ]
            is True,
            (
                "Ready release requires "
                "verified recovery evidence"
            ),
        )

    require(
        assurance[
            "assurance_status"
        ]
        == "SATISFIED",
        (
            "Ready release requires "
            "satisfied assurance"
        ),
    )

    require(
        verification[
            "overall_status"
        ]
        == "PASS",
        (
            "Ready release requires "
            "passing verification"
        ),
    )

    # Deliberately DO NOT require
    # execution_authority == EXPLICITLY_GRANTED.
    #
    # Readiness and authority are separate concepts.


def validate_chain(
    root,
    chain,
    schemas,
    roles,
    expertise,
    routing,
):
    expected_keys = set(
        SCHEMAS
    )

    require(
        set(chain)
        == expected_keys,
        (
            "Contract fixture must contain "
            "exactly the six canonical artifacts"
        ),
    )

    for key in expected_keys:
        validate_instance(
            schemas[key],
            chain[key],
            key,
        )

    ic = chain[
        "implementation_contract"
    ]

    wp = chain[
        "work_package"
    ]

    er = chain[
        "engineering_report"
    ]

    ar = chain[
        "assurance_report"
    ]

    vm = chain[
        "verification_matrix"
    ]

    rp = chain[
        "release_packet"
    ]

    # --------------------------------------------------------
    # Producer roles
    # --------------------------------------------------------

    producer_roles = {
        ic[
            "created_by"
        ][
            "role"
        ],
        wp[
            "writer"
        ][
            "role"
        ],
        er[
            "executor"
        ][
            "role"
        ],
        ar[
            "reviewer"
        ][
            "role"
        ],
        vm[
            "verifier"
        ][
            "role"
        ],
        rp[
            "prepared_by"
        ][
            "role"
        ],
    }

    require(
        producer_roles <= roles,
        "Contract uses unknown producer role",
    )

    # --------------------------------------------------------
    # Routing and risk
    # --------------------------------------------------------

    resolved = (
        required_route_components(
            routing,
            ic,
        )
    )

    declared_roles = set(
        ic[
            "routing"
        ][
            "roles"
        ]
    )

    require(
        resolved[
            "roles"
        ]
        <= declared_roles,
        (
            "Implementation Contract "
            "under-routes required roles"
        ),
    )

    declared_expertise = set(
        ic[
            "routing"
        ][
            "required_expertise"
        ]
    )

    require(
        resolved[
            "expertise"
        ]
        <= declared_expertise,
        (
            "Implementation Contract "
            "under-routes required expertise"
        ),
    )

    validate_required_expertise(
        declared_expertise,
        expertise,
        "Implementation Contract",
    )

    validate_required_expertise(
        wp[
            "required_expertise"
        ],
        expertise,
        "Work Package",
    )

    effective_risk = ic[
        "risk"
    ][
        "effective_level"
    ]

    require(
        risk_index(
            effective_risk
        )
        >= risk_index(
            resolved[
                "risk_floor"
            ]
        ),
        (
            "Implementation Contract risk "
            "is below routing floor"
        ),
    )

    require(
        wp[
            "risk"
        ]
        == effective_risk
        and ar[
            "risk"
        ]
        == effective_risk
        and rp[
            "risk"
        ]
        == effective_risk,
        (
            "Risk drift across "
            "engineering artifacts"
        ),
    )

    # --------------------------------------------------------
    # Lineage
    # --------------------------------------------------------

    require(
        wp[
            "implementation_contract_id"
        ]
        == ic[
            "artifact_id"
        ],
        (
            "Work Package lineage mismatch"
        ),
    )

    require(
        er[
            "work_package_id"
        ]
        == wp[
            "artifact_id"
        ],
        (
            "Engineering Report lineage mismatch"
        ),
    )

    require(
        ar[
            "engineering_report_id"
        ]
        == er[
            "artifact_id"
        ],
        (
            "Assurance Report lineage mismatch"
        ),
    )

    require(
        vm[
            "implementation_contract_id"
        ]
        == ic[
            "artifact_id"
        ],
        (
            "Verification Matrix lineage mismatch"
        ),
    )

    require(
        wp[
            "artifact_id"
        ]
        in ic[
            "work_package_ids"
        ],
        (
            "Implementation Contract does not "
            "reference the Work Package"
        ),
    )

    require(
        wp[
            "base_revision"
        ]
        == ic[
            "base_revision"
        ][
            "sha"
        ]
        == er[
            "base_revision"
        ],
        (
            "Base revision drift across "
            "planning and implementation"
        ),
    )

    # --------------------------------------------------------
    # Acceptance/check lineage
    # --------------------------------------------------------

    acceptance_ids = {
        item[
            "id"
        ]
        for item
        in ic[
            "acceptance_criteria"
        ]
    }

    check_ids = {
        item[
            "id"
        ]
        for item
        in ic[
            "planned_checks"
        ]
    }

    require(
        set(
            wp[
                "acceptance_criteria"
            ]
        )
        <= acceptance_ids,
        (
            "Work Package references unknown "
            "acceptance criterion"
        ),
    )

    require(
        set(
            wp[
                "required_checks"
            ]
        )
        <= check_ids,
        (
            "Work Package references unknown "
            "planned check"
        ),
    )

    # --------------------------------------------------------
    # Skill existence
    # --------------------------------------------------------

    for skill_id in wp.get(
        "selected_skills",
        [],
    ):
        require(
            re.fullmatch(
                r"[a-z0-9]+(?:-[a-z0-9]+)*",
                skill_id,
            ),
            (
                "Invalid selected Skill ID: "
                f"{skill_id}"
            ),
        )

        local_file(
            root,
            (
                ".agents/skills/"
                f"{skill_id}/SKILL.md"
            ),
        )

    # --------------------------------------------------------
    # Revision binding
    # --------------------------------------------------------

    implementation_revision = (
        revision_identity(
            er[
                "head"
            ]
        )
    )

    require(
        revision_identity(
            ar[
                "reviewed_revision"
            ]
        )
        == implementation_revision,
        (
            "Assurance revision does not "
            "match Engineering Report"
        ),
    )

    require(
        revision_identity(
            vm[
                "verified_revision"
            ]
        )
        == implementation_revision,
        (
            "Verification revision does not "
            "match Engineering Report"
        ),
    )

    # --------------------------------------------------------
    # R5 assurance
    # --------------------------------------------------------

    if (
        effective_risk == "R5"
        and ar[
            "assurance_status"
        ]
        == "SATISFIED"
    ):
        require(
            ar[
                "independence"
            ]
            == "INDEPENDENT",
            (
                "R5 satisfied assurance "
                "must be independent"
            ),
        )

    open_blockers = [
        finding
        for finding
        in ar[
            "findings"
        ]
        if (
            finding[
                "status"
            ]
            == "OPEN"
            and finding[
                "severity"
            ]
            in {
                "HIGH",
                "CRITICAL",
            }
        )
    ]

    require(
        not (
            open_blockers
            and ar[
                "assurance_status"
            ]
            == "SATISFIED"
        ),
        (
            "Satisfied assurance cannot "
            "contain OPEN HIGH/CRITICAL findings"
        ),
    )

    # --------------------------------------------------------
    # Verification truthfulness
    # --------------------------------------------------------

    verify_matrix_semantics(
        vm,
        acceptance_ids,
    )

    # --------------------------------------------------------
    # Release lineage
    # --------------------------------------------------------

    require(
        implementation_revision[
            0
        ]
        == "clean",
        (
            "Release Packet requires a "
            "clean committed candidate revision"
        ),
    )

    candidate_sha = (
        implementation_revision[
            1
        ]
    )

    require(
        rp[
            "candidate_revision"
        ]
        == candidate_sha,
        (
            "Release candidate revision "
            "does not match implementation"
        ),
    )

    refs = rp.get(
        "artifact_references"
    )

    require(
        isinstance(refs, dict),
        (
            "Release Packet requires "
            "artifact references"
        ),
    )

    require(
        refs.get(
            "implementation_contract_id"
        )
        == ic[
            "artifact_id"
        ],
        (
            "Release Packet Implementation "
            "Contract reference mismatch"
        ),
    )

    require(
        er[
            "artifact_id"
        ]
        in refs.get(
            "engineering_report_ids",
            [],
        ),
        (
            "Release Packet missing "
            "Engineering Report reference"
        ),
    )

    require(
        ar[
            "artifact_id"
        ]
        in refs.get(
            "assurance_report_ids",
            [],
        ),
        (
            "Release Packet missing "
            "Assurance Report reference"
        ),
    )

    require(
        vm[
            "artifact_id"
        ]
        in refs.get(
            "verification_matrix_ids",
            [],
        ),
        (
            "Release Packet missing "
            "Verification Matrix reference"
        ),
    )

    validate_release_readiness(
        rp,
        ar,
        vm,
    )


def validate(root=ROOT):
    root = Path(
        root
    ).resolve()

    roles = load_roles(
        root
    )

    expertise = load_expertise(
        root
    )

    routing = load_routing(
        root
    )

    schemas = {}

    for (
        key,
        (
            path,
            artifact_type,
            producer_role,
        ),
    ) in SCHEMAS.items():
        schema = load_json(
            root,
            path,
        )

        Draft202012Validator.check_schema(
            schema
        )

        require(
            schema.get(
                "$schema"
            )
            == (
                "https://json-schema.org/"
                "draft/2020-12/schema"
            ),
            (
                "Contract schema must use "
                "JSON Schema 2020-12: "
                f"{path}"
            ),
        )

        require(
            schema.get(
                "properties",
                {},
            ).get(
                "artifact_type",
                {},
            ).get(
                "const"
            )
            == artifact_type,
            (
                "Artifact type mismatch in "
                f"{path}"
            ),
        )

        require(
            producer_role
            in roles,
            (
                "Contract producer role "
                f"is not registered: "
                f"{producer_role}"
            ),
        )

        check_strict_objects(
            schema,
            path,
        )

        schemas[
            key
        ] = schema

    # Risk enums must remain the repository canonical R0-R5 set.
    risk_enums = (
        schemas[
            "implementation_contract"
        ][
            "$defs"
        ][
            "risk"
        ][
            "properties"
        ][
            "effective_level"
        ][
            "enum"
        ],

        schemas[
            "work_package"
        ][
            "properties"
        ][
            "risk"
        ][
            "enum"
        ],

        schemas[
            "assurance_report"
        ][
            "properties"
        ][
            "risk"
        ][
            "enum"
        ],

        schemas[
            "release_packet"
        ][
            "properties"
        ][
            "risk"
        ][
            "enum"
        ],
    )

    for values in risk_enums:
        require(
            tuple(values)
            == RISK_LEVELS,
            (
                "Contract risk enum "
                "must remain R0-R5"
            ),
        )

    fixture = load_json(
        root,
        FIXTURE,
    )

    validate_chain(
        root,
        fixture,
        schemas,
        roles,
        expertise,
        routing,
    )

    return {
        "schemas":
            len(schemas),

        "fixture_chains":
            1,

        "fixture_artifacts":
            len(fixture),

        "semantic_validation":
            "PASS",
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__
    )

    parser.add_argument(
        "--root",
        type=Path,
        default=ROOT,
    )

    args = parser.parse_args()

    try:
        result = validate(
            args.root
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
        "PASS "
        "(contract structural + synthetic "
        "semantic validation only): "
        f"{json.dumps(result)}"
    )