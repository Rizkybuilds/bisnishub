"""Validate engineering capabilities, permissions, and role bindings.

This validator checks repository engineering authority configuration.
It does not grant runtime permission, autonomy, approval, or tool access.
"""

import argparse
import json
import re
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[2]

CAPABILITY_REGISTRY = (
    ".agents/capabilities/registry.yaml"
)

ROLE_GRANTS = (
    ".agents/capabilities/role-grants.yaml"
)

ROLE_CATALOG = (
    ".agents/roles/contracts.json"
)

CONDITION_REGISTRY = (
    ".agents/capabilities/conditions.yaml"
)

ROLE_IDS = {
    "planner",
    "engineer",
    "auditor",
    "qa",
    "release-operator",
}

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

DISPOSITIONS = {
    "ACTIVE",
    "PROHIBITED",
}

APPROVAL_MODES = {
    "NONE",
    "WORK_PACKAGE",
    "EXPLICIT_ACTION",
    "RELEASE_GATES_AND_EXPLICIT_ACTION",
    "PROHIBITED",
}

ENVIRONMENTS = {
    "repository-local",
    "local-disposable",
    "github-remote",
    "staging",
    "production",
    "remote-mgbos",
}

PERMISSION_STATES = {
    "GRANTED",
    "CONDITIONAL",
    "DENIED",
    "PROHIBITED",
}

HARD_PROHIBITIONS = {
    "engineering.git.main.push",
    "engineering.database.mgbos.remote.mutate",
    "engineering.supabase.mgbos.root.use",
    "engineering.secret.expose",
    "engineering.customer_data.expose",
}

EXCLUSIVE_CAPABILITY_ROLES = {
    "engineering.plan.write": {
        "planner",
    },

    "engineering.source.write.scoped": {
        "engineer",
    },

    "engineering.review.write": {
        "auditor",
    },

    "engineering.test_artifact.write": {
        "qa",
    },

    "engineering.release_packet.write": {
        "release-operator",
    },

    "engineering.check.local.execute": {
        "engineer",
        "qa",
    },

    "engineering.database.local.reset_disposable": {
        "engineer",
        "qa",
    },

    "engineering.github.feature_branch.push": {
        "engineer",
        "release-operator",
    },

    "engineering.github.pull_request.create": {
        "engineer",
        "release-operator",
    },

    "engineering.github.pull_request.close": {
        "release-operator",
    },

    "engineering.github.branch.delete": {
        "release-operator",
    },

    "engineering.github.pull_request.merge": {
        "release-operator",
    },

    "engineering.release.deploy": {
        "release-operator",
    },
}


class UniqueLoader(yaml.SafeLoader):
    """Fail on duplicate YAML keys."""


def unique_mapping(
    loader,
    node,
    deep=False,
):
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


def require(
    condition,
    message,
):
    if not condition:
        raise ValueError(message)


def string_list(
    value,
    *,
    allow_empty=False,
):
    return (
        isinstance(
            value,
            list,
        )
        and (
            allow_empty
            or bool(value)
        )
        and all(
            isinstance(
                item,
                str,
            )
            and item.strip()
            for item
            in value
        )
    )


def repository_path(
    root,
    relative,
):
    require(
        isinstance(
            relative,
            str,
        )
        and relative.strip(),
        "Expected repository path",
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
        target.exists(),
        (
            "Missing path: "
            f"{relative}"
        ),
    )

    return target


def local_file(
    root,
    relative,
):
    target = repository_path(
        root,
        relative,
    )

    require(
        target.is_file(),
        (
            "Missing file: "
            f"{relative}"
        ),
    )

    return target


def load_yaml(
    root,
    relative,
):
    value = yaml.load(
        local_file(
            root,
            relative,
        ).read_text(
            encoding="utf-8"
        ),
        Loader=UniqueLoader,
    )

    require(
        isinstance(
            value,
            dict,
        ),
        (
            "Invalid YAML mapping: "
            f"{relative}"
        ),
    )

    return value


def load_json(
    root,
    relative,
):
    return json.loads(
        local_file(
            root,
            relative,
        ).read_text(
            encoding="utf-8"
        ),
        object_pairs_hook=
            unique_json,
    )


def capability_id(
    value,
):
    return (
        isinstance(
            value,
            str,
        )
        and re.fullmatch(
            (
                r"engineering"
                r"(?:\.[a-z0-9_]+)+"
            ),
            value,
        )
        is not None
    )


def risk_index(
    value,
):
    return RISK_LEVELS.index(
        value
    )


def autonomy_index(
    value,
):
    return AUTONOMY_LEVELS.index(
        value
    )


def validate_capabilities(
    root,
):
    catalog = load_yaml(
        root,
        CAPABILITY_REGISTRY,
    )

    require(
        catalog.get(
            "schema_version"
        )
        == 1,
        (
            "Invalid capability "
            "registry schema version"
        ),
    )

    metadata = catalog.get(
        "registry"
    )

    require(
        isinstance(
            metadata,
            dict,
        ),
        (
            "Missing capability "
            "registry metadata"
        ),
    )

    require(
        metadata.get(
            "namespace"
        )
        == "engineering",
        (
            "Engineering capability "
            "namespace must remain engineering"
        ),
    )

    for field in (
        "guide",
        "permission_registry",
        "risk_policy",
        "autonomy_policy",
        "approval_policy",
        "human_permission_policy",
    ):
        local_file(
            root,
            metadata.get(
                field
            ),
        )

    principles = catalog.get(
        "principles"
    )

    require(
        isinstance(
            principles,
            dict,
        ),
        (
            "Missing capability principles"
        ),
    )

    expected_false = (
        "tool_access_grants_permission",
        "skill_grants_permission",
        "expertise_grants_permission",
        "role_name_grants_unregistered_capability",
        "capability_grants_autonomy",
        "capability_grants_approval",
    )

    for field in expected_false:
        require(
            principles.get(
                field
            )
            is False,
            (
                "Capability authority "
                f"principle must remain false: "
                f"{field}"
            ),
        )

    require(
        principles.get(
            "default_permission"
        )
        == "DENIED",
        (
            "Capability registry must "
            "remain default-deny"
        ),
    )

    require(
        principles.get(
            "highest_applicable_risk_wins"
        )
        is True,
        (
            "Highest applicable risk "
            "must continue to win"
        ),
    )

    require(
        principles.get(
            "unknown_consequential_environment_fails_closed"
        )
        is True,
        (
            "Unknown consequential "
            "environment must fail closed"
        ),
    )

    require(
        set(
            catalog.get(
                "allowed_dispositions",
                [],
            )
        )
        == DISPOSITIONS,
        (
            "Invalid capability "
            "dispositions"
        ),
    )

    require(
        set(
            catalog.get(
                "allowed_approval_modes",
                [],
            )
        )
        == APPROVAL_MODES,
        (
            "Invalid approval mode registry"
        ),
    )

    require(
        set(
            catalog.get(
                "allowed_environments",
                [],
            )
        )
        == ENVIRONMENTS,
        (
            "Invalid environment registry"
        ),
    )

    entries = catalog.get(
        "capabilities"
    )

    require(
        isinstance(
            entries,
            list,
        )
        and entries,
        "Missing capabilities",
    )

    by_id = {}

    for entry in entries:
        require(
            isinstance(
                entry,
                dict,
            ),
            "Invalid capability entry",
        )

        cid = entry.get(
            "id"
        )

        require(
            capability_id(
                cid
            ),
            (
                "Invalid engineering "
                f"capability id: {cid}"
            ),
        )

        require(
            cid not in by_id,
            (
                "Duplicate capability: "
                f"{cid}"
            ),
        )

        require(
            isinstance(
                entry.get(
                    "version"
                ),
                int,
            )
            and entry[
                "version"
            ] >= 1,
            (
                "Invalid capability "
                f"version: {cid}"
            ),
        )

        disposition = entry.get(
            "disposition"
        )

        require(
            disposition
            in DISPOSITIONS,
            (
                "Invalid disposition: "
                f"{cid}"
            ),
        )

        if cid in HARD_PROHIBITIONS:
            require(
                disposition == "PROHIBITED",
                (
                    "Hard prohibition "
                    f"must remain PROHIBITED: {cid}"
                ),
            )

        require(
            isinstance(
                entry.get(
                    "description"
                ),
                str,
            )
            and entry[
                "description"
            ].strip(),
            (
                "Missing description: "
                f"{cid}"
            ),
        )

        require(
            isinstance(
                entry.get(
                    "mutation"
                ),
                bool,
            ),
            (
                "Invalid mutation flag: "
                f"{cid}"
            ),
        )

        risk = entry.get(
            "baseline_risk"
        )

        require(
            risk
            in RISK_LEVELS,
            (
                "Invalid baseline risk: "
                f"{cid}"
            ),
        )

        ceiling = entry.get(
            "autonomy_ceiling"
        )

        require(
            (
                ceiling
                in AUTONOMY_LEVELS
            )
            or (
                ceiling is None
            ),
            (
                "Invalid autonomy ceiling: "
                f"{cid}"
            ),
        )

        environments = entry.get(
            "supported_environments"
        )

        require(
            string_list(
                environments
            ),
            (
                "Missing supported "
                f"environments: {cid}"
            ),
        )

        require(
            len(
                environments
            )
            == len(
                set(
                    environments
                )
            ),
            (
                "Duplicate environments: "
                f"{cid}"
            ),
        )

        require(
            set(
                environments
            )
            <= ENVIRONMENTS,
            (
                "Unknown environment in "
                f"{cid}"
            ),
        )

        approval = entry.get(
            "approval_mode"
        )

        require(
            approval
            in APPROVAL_MODES,
            (
                "Invalid approval mode: "
                f"{cid}"
            ),
        )

        require(
            isinstance(
                entry.get(
                    "verification_required"
                ),
                bool,
            ),
            (
                "Invalid verification flag: "
                f"{cid}"
            ),
        )

        if disposition == "PROHIBITED":
            require(
                approval
                == "PROHIBITED",
                (
                    "Prohibited capability "
                    "must use PROHIBITED "
                    f"approval mode: {cid}"
                ),
            )

            require(
                ceiling is None,
                (
                    "Prohibited capability "
                    "must not have an autonomy "
                    f"ceiling: {cid}"
                ),
            )

            require(
                entry.get(
                    "minimum_autonomy"
                )
                is None,
                (
                    "Prohibited capability cannot "
                    f"have minimum autonomy: {cid}"
                ),
            )

        else:
            require(
                approval
                != "PROHIBITED",
                (
                    "Active capability "
                    "cannot use PROHIBITED "
                    f"approval mode: {cid}"
                ),
            )

            require(
                ceiling
                is not None,
                (
                    "Active capability "
                    "requires autonomy ceiling: "
                    f"{cid}"
                ),
            )

            # Engineering profile v1 deliberately
            # prevents active R4/R5 capabilities
            # from silently receiving an L4 ceiling.
            if risk in {
                "R4",
                "R5",
            }:
                require(
                    autonomy_index(
                        ceiling
                    )
                    <= autonomy_index(
                        "L3"
                    ),
                    (
                        "R4/R5 engineering "
                        "capability cannot exceed "
                        f"L3 in profile v1: {cid}"
                    ),
                )

            minimum = entry.get(
                "minimum_autonomy"
            )

            require(
                minimum in AUTONOMY_LEVELS,
                (
                    "Active capability requires "
                    f"minimum autonomy: {cid}"
                ),
            )

            require(
                autonomy_index(
                    minimum
                )
                <= autonomy_index(
                    ceiling
                ),
                (
                    "Minimum autonomy exceeds "
                    f"ceiling: {cid}"
                ),
            )

        if (
            approval
            == "RELEASE_GATES_AND_EXPLICIT_ACTION"
        ):
            require(
                risk_index(
                    risk
                )
                >= risk_index(
                    "R3"
                ),
                (
                    "Release-gated capability "
                    "must be at least R3: "
                    f"{cid}"
                ),
            )

        for field in (
            "boundaries",
            "preconditions",
            "risk_escalation",
        ):
            if field in entry:
                require(
                    string_list(
                        entry[
                            field
                        ]
                    ),
                    (
                        f"Invalid {field}: "
                        f"{cid}"
                    ),
                )

        floors = entry.get(
            "environment_risk_floor"
        )

        if floors is not None:
            require(
                isinstance(
                    floors,
                    dict,
                )
                and floors,
                (
                    "Invalid environment "
                    f"risk floor: {cid}"
                ),
            )

            for (
                environment,
                floor,
            ) in floors.items():
                require(
                    environment
                    in environments,
                    (
                        "Environment risk floor "
                        "references unsupported "
                        f"environment in {cid}"
                    ),
                )

                require(
                    floor
                    in RISK_LEVELS,
                    (
                        "Invalid environment "
                        f"risk floor in {cid}"
                    ),
                )

                require(
                    risk_index(
                        floor
                    )
                    >= risk_index(
                        risk
                    ),
                    (
                        "Environment risk floor "
                        "cannot lower baseline "
                        f"risk in {cid}"
                    ),
                )

        by_id[
            cid
        ] = entry

    require(
        HARD_PROHIBITIONS
        <= set(
            by_id
        ),
        (
            "Missing hard-prohibited "
            "engineering capabilities"
        ),
    )

    for cid in HARD_PROHIBITIONS:
        require(
            by_id[
                cid
            ][
                "disposition"
            ]
            == "PROHIBITED",
            (
                "Hard prohibition "
                f"must remain PROHIBITED: "
                f"{cid}"
            ),
        )

    aliases = catalog.get(
        "legacy_aliases"
    )

    require(
        isinstance(
            aliases,
            dict,
        )
        and aliases,
        (
            "Missing legacy aliases "
            "during capability migration"
        ),
    )

    require(
        len(
            set(
                aliases.values()
            )
        )
        == len(
            aliases
        ),
        (
            "Legacy aliases must remain "
            "one-to-one"
        ),
    )

    for (
        legacy,
        canonical,
    ) in aliases.items():
        require(
            isinstance(
                legacy,
                str,
            )
            and re.fullmatch(
                r"[a-z0-9]+(?:-[a-z0-9]+)*",
                legacy,
            ),
            (
                "Invalid legacy alias: "
                f"{legacy}"
            ),
        )

        require(
            canonical
            in by_id,
            (
                "Legacy alias references "
                "unknown capability: "
                f"{legacy}"
            ),
        )

        require(
            by_id[
                canonical
            ][
                "disposition"
            ]
            == "ACTIVE",
            (
                "Legacy alias cannot point "
                "to prohibited capability: "
                f"{legacy}"
            ),
        )

    return (
        catalog,
        by_id,
        aliases,
    )


def validate_grant_entry(
    role_id,
    capability,
    entry,
    *,
    conditional,
    capabilities,
):
    require(
        capability
        in capabilities,
        (
            "Role grant references "
            "unknown capability: "
            f"{role_id} -> {capability}"
        ),
    )

    definition = capabilities[
        capability
    ]

    require(
        definition[
            "disposition"
        ]
        == "ACTIVE",
        (
            "Role cannot receive "
            "prohibited capability: "
            f"{role_id} -> {capability}"
        ),
    )

    require(
        isinstance(
            entry,
            dict,
        ),
        (
            "Invalid role grant entry: "
            f"{role_id} -> {capability}"
        ),
    )

    if "scope" in entry:
        require(
            isinstance(
                entry[
                    "scope"
                ],
                str,
            )
            and entry[
                "scope"
            ].strip(),
            (
                "Invalid grant scope: "
                f"{role_id} -> {capability}"
            ),
        )

    requirements = entry.get(
        "requires",
        [],
    )

    require(
        string_list(
            requirements,
            allow_empty=True,
        ),
        (
            "Invalid grant requirements: "
            f"{role_id} -> {capability}"
        ),
    )

    if conditional:
        require(
            bool(
                requirements
            ),
            (
                "Conditional grant requires "
                "explicit conditions: "
                f"{role_id} -> {capability}"
            ),
        )

    approval = definition[
        "approval_mode"
    ]

    if approval in {
        "EXPLICIT_ACTION",
        "RELEASE_GATES_AND_EXPLICIT_ACTION",
    }:
        require(
            conditional,
            (
                "Explicit-action capability "
                "must remain conditional: "
                f"{role_id} -> {capability}"
            ),
        )

    if approval == "WORK_PACKAGE":
        require(
            bool(
                requirements
            ),
            (
                "Work-Package capability "
                "requires machine-visible "
                f"conditions: {role_id} -> "
                f"{capability}"
            ),
        )


def validate_grants(
    root,
    capabilities,
):
    grants = load_yaml(
        root,
        ROLE_GRANTS,
    )

    require(
        grants.get(
            "schema_version"
        )
        == 1,
        (
            "Invalid role grant "
            "schema version"
        ),
    )

    metadata = grants.get(
        "registry"
    )

    require(
        isinstance(
            metadata,
            dict,
        ),
        "Missing role grant metadata",
    )

    require(
        metadata.get(
            "condition_registry"
        )
        == CONDITION_REGISTRY,
        (
            "Role grant metadata must "
            "reference canonical condition registry: "
            f"{CONDITION_REGISTRY}"
        ),
    )

    for field in (
        "capability_registry",
        "role_registry",
        "condition_registry",
        "semantic_policy",
    ):
        local_file(
            root,
            metadata.get(
                field
            ),
        )

    conditions_catalog = load_yaml(
        root,
        CONDITION_REGISTRY,
    )

    condition_ids = set(
        conditions_catalog[
            "conditions"
        ]
    )

    for role_id, role in grants[
        "roles"
    ].items():
        for group in (
            "granted",
            "conditional",
        ):
            for capability, entry in role.get(
                group,
                {},
            ).items():
                unknown = (
                    set(
                        entry.get(
                            "requires",
                            [],
                        )
                    )
                    - condition_ids
                )

                require(
                    not unknown,
                    (
                        "Role grant references "
                        f"unknown condition: {role_id} -> {capability} -> {sorted(unknown)}"
                    ),
                )

    defaults = grants.get(
        "defaults"
    )

    require(
        defaults
        == {
            "unlisted_capability":
                "DENIED",
            "unlisted_role":
                "DENIED",
        },
        (
            "Engineering role grants "
            "must remain default-deny"
        ),
    )

    require(
        set(
            grants.get(
                "permission_states",
                [],
            )
        )
        == PERMISSION_STATES,
        (
            "Invalid permission-state "
            "registry"
        ),
    )

    global_prohibitions = grants.get(
        "global_prohibitions"
    )

    require(
        string_list(
            global_prohibitions
        ),
        (
            "Missing global prohibitions"
        ),
    )

    require(
        len(
            global_prohibitions
        )
        == len(
            set(
                global_prohibitions
            )
        ),
        (
            "Duplicate global prohibition"
        ),
    )

    require(
        HARD_PROHIBITIONS
        <= set(
            global_prohibitions
        ),
        (
            "Hard prohibitions missing "
            "from role grant registry"
        ),
    )

    for capability in global_prohibitions:
        require(
            capability
            in capabilities,
            (
                "Unknown global prohibition: "
                f"{capability}"
            ),
        )

        require(
            capabilities[
                capability
            ][
                "disposition"
            ]
            == "PROHIBITED",
            (
                "Global prohibition "
                "must reference PROHIBITED "
                f"capability: {capability}"
            ),
        )

    roles = grants.get(
        "roles"
    )

    require(
        isinstance(
            roles,
            dict,
        )
        and set(
            roles
        )
        == ROLE_IDS,
        (
            "Role grant registry must "
            "contain exactly canonical "
            "engineering roles"
        ),
    )

    actual_role_access = {
        capability: set()
        for capability
        in capabilities
    }

    for (
        role_id,
        role,
    ) in roles.items():
        require(
            isinstance(
                role,
                dict,
            ),
            (
                "Invalid role grant: "
                f"{role_id}"
            ),
        )

        granted = role.get(
            "granted",
            {},
        )

        conditional = role.get(
            "conditional",
            {},
        )

        denied = role.get(
            "explicit_denials",
            [],
        )

        require(
            isinstance(
                granted,
                dict,
            ),
            (
                "Invalid granted mapping: "
                f"{role_id}"
            ),
        )

        require(
            isinstance(
                conditional,
                dict,
            ),
            (
                "Invalid conditional mapping: "
                f"{role_id}"
            ),
        )

        require(
            string_list(
                denied,
                allow_empty=True,
            ),
            (
                "Invalid explicit denials: "
                f"{role_id}"
            ),
        )

        require(
            not (
                set(
                    granted
                )
                & set(
                    conditional
                )
            ),
            (
                "Capability cannot be both "
                "granted and conditional: "
                f"{role_id}"
            ),
        )

        require(
            not (
                (
                    set(
                        granted
                    )
                    | set(
                        conditional
                    )
                )
                & set(
                    denied
                )
            ),
            (
                "Capability cannot be both "
                "allowed and explicitly "
                f"denied: {role_id}"
            ),
        )

        for (
            capability,
            entry,
        ) in granted.items():
            require(
                capability
                not in global_prohibitions,
                (
                    "Global prohibition "
                    "cannot be granted: "
                    f"{role_id} -> "
                    f"{capability}"
                ),
            )

            validate_grant_entry(
                role_id,
                capability,
                entry,
                conditional=False,
                capabilities=
                    capabilities,
            )

            actual_role_access[
                capability
            ].add(
                role_id
            )

        for (
            capability,
            entry,
        ) in conditional.items():
            require(
                capability
                not in global_prohibitions,
                (
                    "Global prohibition "
                    "cannot be conditional: "
                    f"{role_id} -> "
                    f"{capability}"
                ),
            )

            validate_grant_entry(
                role_id,
                capability,
                entry,
                conditional=True,
                capabilities=
                    capabilities,
            )

            actual_role_access[
                capability
            ].add(
                role_id
            )

        for capability in denied:
            require(
                capability
                in capabilities,
                (
                    "Explicit denial "
                    "references unknown "
                    f"capability: {role_id} -> "
                    f"{capability}"
                ),
            )

    # Machine-enforced role-separation anchors.
    for (
        capability,
        allowed_roles,
    ) in EXCLUSIVE_CAPABILITY_ROLES.items():
        require(
            capability
            in capabilities,
            (
                "Missing role-separation "
                f"anchor capability: "
                f"{capability}"
            ),
        )

        unexpected = (
            actual_role_access[
                capability
            ]
            - allowed_roles
        )

        require(
            not unexpected,
            (
                "Capability leaked to "
                "unauthorized role(s): "
                f"{capability} -> "
                f"{sorted(unexpected)}"
            ),
        )

    return grants


def validate_role_catalog(
    root,
    capabilities,
    aliases,
    grants,
):
    catalog = load_json(
        root,
        ROLE_CATALOG,
    )

    require(
        catalog.get(
            "schemaVersion"
        )
        == 1,
        (
            "Invalid role catalog "
            "schema version"
        ),
    )

    require(
        catalog.get(
            "workspace"
        )
        == "systems/mgbos/",
        (
            "Invalid role catalog workspace"
        ),
    )

    require(
        catalog.get(
            "policy"
        )
        == (
            "systems/mgbos/docs/"
            "engineering/agent-system/"
            "permission-matrix.md"
        ),
        (
            "Role catalog permission "
            "policy mismatch"
        ),
    )

    require(
        catalog.get(
            "capabilityRegistry"
        )
        == CAPABILITY_REGISTRY,
        (
            "Role catalog must reference "
            "canonical capability registry"
        ),
    )

    require(
        catalog.get(
            "roleGrantRegistry"
        )
        == ROLE_GRANTS,
        (
            "Role catalog must reference "
            "canonical role-grant registry"
        ),
    )

    role_entries = catalog.get(
        "roles"
    )

    require(
        isinstance(
            role_entries,
            list,
        ),
        "Role catalog roles must be list",
    )

    by_id = {}

    for role in role_entries:
        require(
            isinstance(
                role,
                dict,
            ),
            "Invalid role entry",
        )

        role_id = role.get(
            "id"
        )

        require(
            role_id
            in ROLE_IDS,
            (
                "Unknown role: "
                f"{role_id}"
            ),
        )

        require(
            role_id
            not in by_id,
            (
                "Duplicate role: "
                f"{role_id}"
            ),
        )

        role_capabilities = role.get(
            "capabilities"
        )

        require(
            string_list(
                role_capabilities
            ),
            (
                "Invalid role capabilities: "
                f"{role_id}"
            ),
        )

        require(
            len(
                role_capabilities
            )
            == len(
                set(
                    role_capabilities
                )
            ),
            (
                "Duplicate role capability: "
                f"{role_id}"
            ),
        )

        for capability in role_capabilities:
            require(
                capability_id(
                    capability
                ),
                (
                    "Role catalog still "
                    "contains non-canonical "
                    f"capability: {role_id} -> "
                    f"{capability}"
                ),
            )

            require(
                capability
                in capabilities,
                (
                    "Role catalog references "
                    "unknown capability: "
                    f"{role_id} -> "
                    f"{capability}"
                ),
            )

            require(
                capability
                not in aliases,
                (
                    "Legacy capability alias "
                    "must not appear in role "
                    f"catalog: {capability}"
                ),
            )

        expected = set(
            grants[
                "roles"
            ][
                role_id
            ].get(
                "granted",
                {},
            )
        )

        require(
            set(
                role_capabilities
            )
            == expected,
            (
                "Role catalog baseline "
                "capabilities must match "
                "GRANTED capability set: "
                f"{role_id}"
            ),
        )

        by_id[
            role_id
        ] = role

    require(
        set(
            by_id
        )
        == ROLE_IDS,
        (
            "Missing canonical role "
            "from role catalog"
        ),
    )

    return catalog


def validate(
    root=ROOT,
):
    root = Path(
        root
    ).resolve()

    (
        capability_catalog,
        capabilities,
        aliases,
    ) = validate_capabilities(
        root
    )

    grants = validate_grants(
        root,
        capabilities,
    )

    role_catalog = (
        validate_role_catalog(
            root,
            capabilities,
            aliases,
            grants,
        )
    )

    return {
        "capabilities":
            len(
                capabilities
            ),

        "active_capabilities":
            sum(
                1
                for capability
                in capabilities.values()
                if capability[
                    "disposition"
                ]
                == "ACTIVE"
            ),

        "prohibited_capabilities":
            sum(
                1
                for capability
                in capabilities.values()
                if capability[
                    "disposition"
                ]
                == "PROHIBITED"
            ),

        "roles":
            len(
                role_catalog[
                    "roles"
                ]
            ),

        "legacy_aliases":
            len(
                aliases
            ),

        "global_prohibitions":
            len(
                grants[
                    "global_prohibitions"
                ]
            ),
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
        "(engineering capability "
        "structural/policy validation only): "
        f"{json.dumps(result)}"
    )