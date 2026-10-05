"""Validate engineering-agent governance structure.

This validator checks repository-controlled governance structure only.
It does not execute an AI runtime and does not prove production readiness.
"""

import argparse
import json
import re
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[2]

STRICT_SKILLS = (
    "mgbos-change-planner",
    "mgbos-business-integrity-auditor",
    "mgbos-pr-reviewer",
    "ai-automation-engine",
    "ai-copilot-builder",
    "web-sec-perf",
)

LEGACY_METADATA = {
    "ai-automation-engine",
    "ai-copilot-builder",
    "web-sec-perf",
}

EXPECTED_ROLE_IDS = {
    "planner",
    "engineer",
    "auditor",
    "qa",
    "release-operator",
}

ROLE_ORDER = (
    "planner",
    "engineer",
    "auditor",
    "qa",
    "release-operator",
)

RISK_LEVELS = (
    "R0",
    "R1",
    "R2",
    "R3",
    "R4",
    "R5",
)

ASSURANCE_LEVELS = (
    "NONE",
    "PROPORTIONAL",
    "REQUIRED",
    "INDEPENDENT_REQUIRED",
)

EXPERTISE_MATURITY = {
    "ACTIVE",
    "PROVISIONAL",
    "DEFERRED",
}

EXPERTISE_GROUPS = {
    "core",
    "founder-control",
    "automation",
    "ai",
    "platform",
}

EXPECTED_EXPERTISE_IDS = {
    f"EXP-{index:03d}"
    for index in range(1, 22)
}

EVAL_CATEGORIES = {
    "routing",
    "database",
    "finance",
    "permissions",
    "ai",
    "release",
}

ROUTING_RESULTS = {
    "COMPLETED",
    "PARTIAL",
    "BLOCKED",
    "NEEDS_PLANNER",
    "NEEDS_AUDITOR",
    "NEEDS_QA",
    "NEEDS_OWNER_DECISION",
    "NEEDS_ENVIRONMENT_EVIDENCE",
    "FAILED",
}

AGENT_SYSTEM_DOCS = (
    "README",
    "workflow",
    "roles",
    "permission-matrix",
    "risk-classification",
    "evidence-model",
    "release-gates",
    "implementation-report",
)


class UniqueLoader(yaml.SafeLoader):
    """YAML loader that fails on duplicate mapping keys."""


def unique_mapping(loader, node, deep=False):
    result = {}

    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)

        if key in result:
            raise ValueError(f"Duplicate YAML key: {key}")

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


def string_list(value, *, allow_empty=False):
    return (
        isinstance(value, list)
        and (allow_empty or bool(value))
        and all(
            isinstance(item, str)
            and item.strip()
            for item in value
        )
    )


def repository_path(root, value):
    require(
        isinstance(value, str)
        and value.strip(),
        "Expected a nonempty repository path",
    )

    target = (root / value).resolve()

    require(
        target.is_relative_to(root.resolve()),
        f"Reference escapes repository: {value}",
    )

    require(
        target.exists(),
        f"Missing path: {value}",
    )

    return target


def local_file(root, value):
    target = repository_path(
        root,
        value,
    )

    require(
        target.is_file(),
        f"Missing file: {value}",
    )

    return target


def local_dir(root, value):
    target = repository_path(
        root,
        value,
    )

    require(
        target.is_dir(),
        f"Missing directory: {value}",
    )

    return target


def load_json(root, path):
    return json.loads(
        local_file(
            root,
            path,
        ).read_text(
            encoding="utf-8"
        ),
        object_pairs_hook=unique_json,
    )


def load_yaml(root, path):
    data = yaml.load(
        local_file(
            root,
            path,
        ).read_text(
            encoding="utf-8"
        ),
        Loader=UniqueLoader,
    )

    require(
        isinstance(data, dict),
        f"Invalid YAML mapping: {path}",
    )

    return data


def check_markdown(root, path):
    text = path.read_text(
        encoding="utf-8"
    )

    require(
        bool(text.strip()),
        f"Empty instruction/document: {path}",
    )

    require(
        not re.search(
            r"(?m)^(<<<<<<< |=======\s*$|>>>>>>> )",
            text,
        ),
        f"Conflict marker: {path}",
    )

    require(
        not re.search(
            r"\[TODO:[^\n]*\]",
            text,
        ),
        f"Unfinished scaffold: {path}",
    )

    # Ignore fenced examples when validating local Markdown links.
    prose = re.sub(
        r"(?ms)^\s*(`{3,}|~{3,}).*?^\s*\1\s*$",
        "",
        text,
    )

    for match in re.finditer(
        r'\[[^\]\n]+\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)',
        prose,
    ):
        destination = (
            match.group(1)
            .strip("<>")
            .split("#", 1)[0]
        )

        if (
            not destination
            or re.match(
                r"^[a-zA-Z][a-zA-Z0-9+.-]*:",
                destination,
            )
        ):
            continue

        target = (
            path.parent
            / destination
        ).resolve()

        require(
            target.is_relative_to(
                root.resolve()
            ),
            (
                f"Link escapes repository "
                f"in {path}: {destination}"
            ),
        )

        require(
            target.exists(),
            (
                f"Broken link in {path}: "
                f"{destination}"
            ),
        )


def parse_skill_frontmatter(
    path,
    expected_name,
    *,
    strict_metadata,
):
    text = path.read_text(
        encoding="utf-8"
    )

    match = re.match(
        r"\A---\n(.*?)\n---(?:\n|$)",
        text,
        re.S,
    )

    require(
        match is not None,
        (
            "Missing YAML frontmatter: "
            f"{expected_name}"
        ),
    )

    data = yaml.load(
        match.group(1),
        Loader=UniqueLoader,
    )

    require(
        isinstance(data, dict),
        (
            "Invalid frontmatter: "
            f"{expected_name}"
        ),
    )

    if strict_metadata:
        allowed = {
            "name",
            "description",
            "license",
            "allowed-tools",
            "metadata",
        }

        if expected_name in LEGACY_METADATA:
            allowed.add(
                "argument-hint"
            )

        require(
            not set(data) - allowed,
            (
                "Unsupported metadata for "
                f"{expected_name}: "
                f"{set(data) - allowed}"
            ),
        )

    require(
        data.get("name")
        == expected_name
        and len(expected_name) <= 64,
        (
            "Skill name/folder mismatch: "
            f"{expected_name}"
        ),
    )

    description = data.get(
        "description"
    )

    require(
        isinstance(
            description,
            str,
        )
        and 0
        < len(
            description.strip()
        )
        <= 1024,
        (
            "Empty/invalid description: "
            f"{expected_name}"
        ),
    )

    require(
        "<" not in description
        and ">" not in description,
        (
            "Angle brackets in description: "
            f"{expected_name}"
        ),
    )

    require(
        bool(
            text[
                match.end():
            ].strip()
        ),
        (
            "Empty skill body: "
            f"{expected_name}"
        ),
    )

    if "argument-hint" in data:
        require(
            isinstance(
                data["argument-hint"],
                str,
            ),
            (
                "Invalid argument-hint: "
                f"{expected_name}"
            ),
        )

    return data


def validate_skill_reference(
    root,
    skill_id,
    markdown,
    validated_skills,
):
    require(
        isinstance(
            skill_id,
            str,
        )
        and re.fullmatch(
            r"[a-z0-9]+(?:-[a-z0-9]+)*",
            skill_id,
        ),
        (
            "Invalid skill id: "
            f"{skill_id}"
        ),
    )

    path = local_file(
        root,
        (
            ".agents/skills/"
            f"{skill_id}/SKILL.md"
        ),
    )

    if skill_id not in validated_skills:
        parse_skill_frontmatter(
            path,
            skill_id,
            strict_metadata=(
                skill_id
                in STRICT_SKILLS
            ),
        )

        validated_skills.add(
            skill_id
        )

    markdown.add(path)

    markdown.update(
        path.parent.glob(
            "references/*.md"
        )
    )

    return path


def validate_role_list(
    value,
    known_roles,
    label,
    *,
    allow_empty=True,
):
    require(
        string_list(
            value,
            allow_empty=allow_empty,
        ),
        (
            "Invalid role list: "
            f"{label}"
        ),
    )

    require(
        len(value)
        == len(set(value)),
        (
            "Duplicate roles: "
            f"{label}"
        ),
    )

    unknown = (
        set(value)
        - known_roles
    )

    require(
        not unknown,
        (
            "Unknown roles in "
            f"{label}: "
            f"{sorted(unknown)}"
        ),
    )


def validate_expertise_list(
    value,
    expertise_by_id,
    label,
    *,
    allow_empty=True,
    require_active=False,
):
    require(
        string_list(
            value,
            allow_empty=allow_empty,
        ),
        (
            "Invalid expertise list: "
            f"{label}"
        ),
    )

    require(
        len(value)
        == len(set(value)),
        (
            "Duplicate expertise references: "
            f"{label}"
        ),
    )

    unknown = (
        set(value)
        - set(expertise_by_id)
    )

    require(
        not unknown,
        (
            "Unknown expertise in "
            f"{label}: "
            f"{sorted(unknown)}"
        ),
    )

    if require_active:
        inactive = [
            expertise_id
            for expertise_id
            in value
            if expertise_by_id[
                expertise_id
            ]["maturity"]
            != "ACTIVE"
        ]

        require(
            not inactive,
            (
                "Required expertise must "
                f"be ACTIVE in {label}: "
                f"{inactive}"
            ),
        )


def validate_assurance(
    value,
    label,
):
    require(
        isinstance(
            value,
            dict,
        ),
        (
            "Invalid assurance mapping: "
            f"{label}"
        ),
    )

    require(
        set(value)
        == {
            "audit",
            "qa",
            "independent_review",
        },
        (
            "Assurance fields must be "
            "audit/qa/independent_review: "
            f"{label}"
        ),
    )

    for key, level in value.items():
        require(
            level
            in ASSURANCE_LEVELS,
            (
                "Invalid assurance level "
                f"in {label}.{key}: "
                f"{level}"
            ),
        )


def validate_risk_floor(
    value,
    label,
    *,
    allow_null=True,
):
    if (
        value is None
        and allow_null
    ):
        return

    require(
        value in RISK_LEVELS,
        (
            "Invalid risk floor in "
            f"{label}: {value}"
        ),
    )


def risk_index(level):
    return RISK_LEVELS.index(
        level
    )


def ordered_roles(values):
    selected = set(values)

    return [
        role
        for role
        in ROLE_ORDER
        if role in selected
    ]


def ordered_expertise(values):
    return sorted(
        set(values),
        key=lambda item: int(
            item.split("-")[1]
        ),
    )


def resolve_example_route(
    routing,
    example,
):
    task = routing[
        "task_types"
    ][
        example[
            "primary_task_type"
        ]
    ]

    concern_entries = [
        routing["concerns"][name]
        for name
        in example.get(
            "concerns",
            [],
        )
    ]

    risks = [
        task.get(
            "risk_floor"
        )
    ]

    risks.extend(
        entry.get(
            "risk_floor"
        )
        for entry
        in concern_entries
    )

    concrete_risks = [
        risk
        for risk
        in risks
        if risk is not None
    ]

    effective_risk = (
        max(
            concrete_risks,
            key=risk_index,
        )
        if concrete_risks
        else "R0"
    )

    roles = list(
        task.get(
            "required_roles",
            [],
        )
    )

    expertise = list(
        task.get(
            "required_expertise",
            [],
        )
    )

    for concern in concern_entries:
        roles.extend(
            concern.get(
                "required_roles",
                [],
            )
        )

        expertise.extend(
            concern.get(
                "required_expertise",
                [],
            )
        )

    return {
        "effective_risk":
            effective_risk,

        "roles":
            ordered_roles(
                roles
            ),

        "required_expertise":
            ordered_expertise(
                expertise
            ),
    }


def validate(root=ROOT):
    root = Path(
        root
    ).resolve()

    markdown = set()
    warnings = []
    validated_skills = set()

    # ------------------------------------------------------------
    # Existing core Skill contracts
    # ------------------------------------------------------------

    for name in STRICT_SKILLS:
        path = (
            validate_skill_reference(
                root,
                name,
                markdown,
                validated_skills,
            )
        )

        data = (
            parse_skill_frontmatter(
                path,
                name,
                strict_metadata=True,
            )
        )

        if "argument-hint" in data:
            warnings.append(
                (
                    f"{name}: retained legacy "
                    "argument-hint; bundled Skill "
                    "Creator allowlist differs."
                )
            )

    # ------------------------------------------------------------
    # Role registry
    # ------------------------------------------------------------

    catalog = load_json(
        root,
        ".agents/roles/contracts.json",
    )

    require(
        catalog.get(
            "schemaVersion"
        )
        == 1
        and catalog.get(
            "workspace"
        )
        == "systems/mgbos/",
        (
            "Invalid role catalog "
            "version/workspace"
        ),
    )

    markdown.add(
        local_file(
            root,
            catalog.get(
                "policy"
            ),
        )
    )

    roles = catalog.get(
        "roles"
    )

    require(
        isinstance(
            roles,
            list,
        ),
        "Roles must be a list",
    )

    role_ids = [
        role.get(
            "id"
        )
        for role
        in roles
        if isinstance(
            role,
            dict,
        )
    ]

    require(
        len(role_ids)
        == len(roles)
        == len(EXPECTED_ROLE_IDS)
        and set(role_ids)
        == EXPECTED_ROLE_IDS,
        (
            "Missing, duplicate "
            "or unknown roles"
        ),
    )

    known_roles = set(
        role_ids
    )

    for role in roles:
        rid = role[
            "id"
        ]

        require(
            isinstance(
                role.get("name"),
                str,
            )
            and role[
                "name"
            ].strip(),
            (
                "Role name missing: "
                f"{rid}"
            ),
        )

        require(
            role.get(
                "contract"
            )
            == (
                ".agents/roles/"
                f"{rid}.md"
            ),
            (
                "Role contract mismatch: "
                f"{rid}"
            ),
        )

        markdown.add(
            local_file(
                root,
                role["contract"],
            )
        )

        capabilities = role.get(
            "capabilities"
        )

        require(
            string_list(
                capabilities
            )
            and len(
                capabilities
            )
            == len(
                set(
                    capabilities
                )
            ),
            (
                "Invalid capabilities: "
                f"{rid}"
            ),
        )

        for capability in capabilities:
            require(
                re.fullmatch(
                    (
                        r"engineering"
                        r"(?:\.[a-z0-9_]+)+"
                    ),
                    capability,
                )
                is not None,
                (
                    "Role catalog must use "
                    "canonical engineering "
                    f"capability IDs: "
                    f"{rid} -> {capability}"
                ),
            )

        handoff = role.get(
            "handoffTo"
        )

        require(
            string_list(
                handoff
            )
            and len(
                handoff
            )
            == len(
                set(handoff)
            )
            and set(
                handoff
            )
            <= known_roles
            - {rid},
            (
                "Invalid handoff: "
                f"{rid}"
            ),
        )

        require(
            isinstance(
                role.get(
                    "skills"
                ),
                list,
            ),
            (
                "Invalid skills: "
                f"{rid}"
            ),
        )

        for skill in role[
            "skills"
        ]:
            validate_skill_reference(
                root,
                skill,
                markdown,
                validated_skills,
            )

    # ------------------------------------------------------------
    # Expertise registry
    # ------------------------------------------------------------

    expertise_catalog = (
        load_yaml(
            root,
            ".agents/expertise/registry.yaml",
        )
    )

    require(
        expertise_catalog.get(
            "schema_version"
        )
        == 1,
        (
            "Invalid expertise "
            "schema version"
        ),
    )

    expertise_registry = (
        expertise_catalog.get(
            "registry"
        )
    )

    require(
        isinstance(
            expertise_registry,
            dict,
        ),
        (
            "Missing expertise "
            "registry metadata"
        ),
    )

    for field in (
        "semantic_policy",
        "guide",
        "role_registry",
        "risk_policy",
    ):
        local_file(
            root,
            expertise_registry.get(
                field
            ),
        )

    require(
        set(
            expertise_catalog.get(
                "allowed_maturity",
                [],
            )
        )
        == EXPERTISE_MATURITY,
        (
            "Invalid expertise "
            "maturity catalog"
        ),
    )

    require(
        set(
            expertise_catalog.get(
                "allowed_groups",
                [],
            )
        )
        == EXPERTISE_GROUPS,
        (
            "Invalid expertise "
            "group catalog"
        ),
    )

    principles = (
        expertise_catalog.get(
            "principles"
        )
    )

    require(
        isinstance(
            principles,
            dict,
        ),
        (
            "Missing expertise "
            "principles"
        ),
    )

    require(
        principles.get(
            "selection_mode"
        )
        == "on-demand",
        (
            "Expertise must use "
            "on-demand selection"
        ),
    )

    for field in (
        "prefer_minimum_sufficient_set",
        "provider_neutral",
    ):
        require(
            principles.get(
                field
            )
            is True,
            (
                "Expertise principle "
                f"must be true: {field}"
            ),
        )

    for field in (
        "expertise_grants_role",
        "expertise_grants_permission",
        "expertise_grants_tool_access",
        "expertise_grants_approval",
        "expertise_grants_autonomy",
    ):
        require(
            principles.get(
                field
            )
            is False,
            (
                "Expertise authority "
                f"principle must be false: {field}"
            ),
        )

    expertise_entries = (
        expertise_catalog.get(
            "expertise"
        )
    )

    require(
        isinstance(
            expertise_entries,
            list,
        ),
        (
            "Expertise must be "
            "a list"
        ),
    )

    expertise_by_id = {}
    slugs = set()

    for entry in expertise_entries:
        require(
            isinstance(
                entry,
                dict,
            ),
            (
                "Invalid expertise "
                "entry"
            ),
        )

        expertise_id = entry.get(
            "id"
        )

        require(
            isinstance(
                expertise_id,
                str,
            )
            and re.fullmatch(
                r"EXP-\d{3}",
                expertise_id,
            ),
            (
                "Invalid expertise id: "
                f"{expertise_id}"
            ),
        )

        require(
            expertise_id
            not in expertise_by_id,
            (
                "Duplicate expertise id: "
                f"{expertise_id}"
            ),
        )

        slug = entry.get(
            "slug"
        )

        require(
            isinstance(
                slug,
                str,
            )
            and re.fullmatch(
                (
                    r"[a-z0-9]+"
                    r"(?:-[a-z0-9]+)*"
                ),
                slug,
            ),
            (
                "Invalid expertise slug: "
                f"{expertise_id}"
            ),
        )

        require(
            slug not in slugs,
            (
                "Duplicate expertise slug: "
                f"{slug}"
            ),
        )

        slugs.add(
            slug
        )

        require(
            isinstance(
                entry.get(
                    "name"
                ),
                str,
            )
            and entry[
                "name"
            ].strip(),
            (
                "Missing expertise name: "
                f"{expertise_id}"
            ),
        )

        require(
            entry.get(
                "maturity"
            )
            in EXPERTISE_MATURITY,
            (
                "Invalid expertise maturity: "
                f"{expertise_id}"
            ),
        )

        require(
            entry.get(
                "group"
            )
            in EXPERTISE_GROUPS,
            (
                "Invalid expertise group: "
                f"{expertise_id}"
            ),
        )

        require(
            isinstance(
                entry.get(
                    "mission"
                ),
                str,
            )
            and entry[
                "mission"
            ].strip(),
            (
                "Missing expertise mission: "
                f"{expertise_id}"
            ),
        )

        validate_role_list(
            entry.get(
                "primary_roles"
            ),
            known_roles,
            (
                f"{expertise_id}"
                ".primary_roles"
            ),
            allow_empty=False,
        )

        validate_role_list(
            entry.get(
                "secondary_roles"
            ),
            known_roles,
            (
                f"{expertise_id}"
                ".secondary_roles"
            ),
            allow_empty=True,
        )

        require(
            not (
                set(
                    entry[
                        "primary_roles"
                    ]
                )
                & set(
                    entry[
                        "secondary_roles"
                    ]
                )
            ),
            (
                "Primary/secondary role "
                f"overlap: {expertise_id}"
            ),
        )

        require(
            string_list(
                entry.get(
                    "activation_signals"
                )
            ),
            (
                "Missing activation signals: "
                f"{expertise_id}"
            ),
        )

        sources = entry.get(
            "canonical_sources"
        )

        require(
            string_list(
                sources
            ),
            (
                "Missing canonical sources: "
                f"{expertise_id}"
            ),
        )

        for source in sources:
            local_file(
                root,
                source,
            )

        require(
            string_list(
                entry.get(
                    "non_responsibilities"
                )
            ),
            (
                "Missing non-responsibilities: "
                f"{expertise_id}"
            ),
        )

        expertise_by_id[
            expertise_id
        ] = entry

    require(
        set(
            expertise_by_id
        )
        == EXPECTED_EXPERTISE_IDS,
        (
            "Expertise v1 must register "
            "exactly EXP-001 through EXP-021"
        ),
    )

    # ------------------------------------------------------------
    # Routing registry
    # ------------------------------------------------------------

    routing = load_yaml(
        root,
        ".agents/routing/task-types.yaml",
    )

    require(
        routing.get(
            "schema_version"
        )
        == 1,
        (
            "Invalid routing "
            "schema version"
        ),
    )

    routing_registry = (
        routing.get(
            "registry"
        )
    )

    require(
        isinstance(
            routing_registry,
            dict,
        ),
        (
            "Missing routing "
            "registry metadata"
        ),
    )

    for field in (
        "semantic_policy",
        "guide",
        "role_registry",
        "expertise_registry",
        "risk_policy",
        "evidence_policy",
    ):
        local_file(
            root,
            routing_registry.get(
                field
            ),
        )

    require(
        tuple(
            routing.get(
                "risk_order",
                [],
            )
        )
        == RISK_LEVELS,
        (
            "Invalid routing "
            "risk order"
        ),
    )

    require(
        tuple(
            routing.get(
                "assurance_levels",
                [],
            )
        )
        == ASSURANCE_LEVELS,
        (
            "Invalid routing "
            "assurance levels"
        ),
    )

    require(
        tuple(
            routing.get(
                "role_order",
                [],
            )
        )
        == ROLE_ORDER,
        (
            "Invalid routing "
            "role order"
        ),
    )

    composition = (
        routing.get(
            "composition"
        )
    )

    require(
        isinstance(
            composition,
            dict,
        ),
        (
            "Missing routing "
            "composition"
        ),
    )

    require(
        composition.get(
            "allow_multiple_concerns"
        )
        is True,
        (
            "Routing must allow "
            "multiple concerns"
        ),
    )

    require(
        composition.get(
            "effective_risk",
            {},
        ).get(
            "strategy"
        )
        == "highest-applicable-wins",
        (
            "Invalid effective-risk "
            "composition"
        ),
    )

    require(
        composition.get(
            "roles",
            {},
        ).get(
            "strategy"
        )
        == "union-in-role-order",
        (
            "Invalid role composition"
        ),
    )

    require(
        composition.get(
            "expertise",
            {},
        ).get(
            "strategy"
        )
        == "union",
        (
            "Invalid expertise composition"
        ),
    )

    require(
        composition.get(
            "expertise",
            {},
        ).get(
            "automatic_maturity"
        )
        == ["ACTIVE"],
        (
            "Automatic routing may "
            "only require ACTIVE expertise"
        ),
    )

    require(
        composition.get(
            "assurance",
            {},
        ).get(
            "strategy"
        )
        == "strictest-wins",
        (
            "Invalid assurance composition"
        ),
    )

    require(
        composition.get(
            "skills",
            {},
        ).get(
            "strategy"
        )
        == "select-minimum-relevant"
        and composition.get(
            "skills",
            {},
        ).get(
            "candidates_are_mandatory"
        )
        is False,
        (
            "Invalid skill composition"
        ),
    )

    # ------------------------------------------------------------
    # Routing profiles
    # ------------------------------------------------------------

    profiles = routing.get(
        "profiles"
    )

    require(
        isinstance(
            profiles,
            dict,
        )
        and profiles,
        (
            "Missing routing profiles"
        ),
    )

    for (
        profile_id,
        profile,
    ) in profiles.items():
        require(
            re.fullmatch(
                (
                    r"[a-z0-9]+"
                    r"(?:-[a-z0-9]+)*"
                ),
                profile_id,
            ),
            (
                "Invalid profile id: "
                f"{profile_id}"
            ),
        )

        require(
            isinstance(
                profile,
                dict,
            ),
            (
                "Invalid routing profile: "
                f"{profile_id}"
            ),
        )

        require(
            profile.get(
                "status"
            )
            == "ACTIVE",
            (
                "Inactive routing profile: "
                f"{profile_id}"
            ),
        )

        local_dir(
            root,
            profile.get(
                "workspace"
            ),
        )

        for field in (
            "instructions",
            "role_registry",
            "risk_profile",
            "workflow",
            "release_gates",
        ):
            local_file(
                root,
                profile.get(
                    field
                ),
            )

    # ------------------------------------------------------------
    # Environments
    # ------------------------------------------------------------

    environments = routing.get(
        "environments"
    )

    require(
        isinstance(
            environments,
            dict,
        )
        and environments,
        (
            "Missing routing environments"
        ),
    )

    for (
        environment_id,
        environment,
    ) in environments.items():
        require(
            re.fullmatch(
                (
                    r"[a-z0-9]+"
                    r"(?:-[a-z0-9]+)*"
                ),
                environment_id,
            ),
            (
                "Invalid environment id: "
                f"{environment_id}"
            ),
        )

        require(
            isinstance(
                environment,
                dict,
            ),
            (
                "Invalid environment: "
                f"{environment_id}"
            ),
        )

        validate_risk_floor(
            environment.get(
                "mutation_risk_floor"
            ),
            (
                "environment."
                f"{environment_id}"
            ),
            allow_null=True,
        )

        if "applies_when" in environment:
            require(
                string_list(
                    environment[
                        "applies_when"
                    ]
                ),
                (
                    "Invalid applies_when: "
                    f"{environment_id}"
                ),
            )

        require(
            string_list(
                environment.get(
                    "notes"
                )
            ),
            (
                "Missing environment notes: "
                f"{environment_id}"
            ),
        )

    require(
        environments.get(
            "production",
            {},
        ).get(
            "mutation_risk_floor"
        )
        == "R4",
        (
            "Production mutation floor "
            "must remain R4"
        ),
    )

    # ------------------------------------------------------------
    # Task types and concerns
    # ------------------------------------------------------------

    task_types = routing.get(
        "task_types"
    )

    require(
        isinstance(
            task_types,
            dict,
        )
        and task_types,
        (
            "Missing task types"
        ),
    )

    concerns = routing.get(
        "concerns"
    )

    require(
        isinstance(
            concerns,
            dict,
        )
        and concerns,
        (
            "Missing routing concerns"
        ),
    )

    routing_skill_ids = set()

    def validate_routing_entry(
        kind,
        entry_id,
        entry,
    ):
        require(
            re.fullmatch(
                (
                    r"[a-z0-9]+"
                    r"(?:-[a-z0-9]+)*"
                ),
                entry_id,
            ),
            (
                f"Invalid {kind} id: "
                f"{entry_id}"
            ),
        )

        require(
            isinstance(
                entry,
                dict,
            ),
            (
                f"Invalid {kind}: "
                f"{entry_id}"
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
                f"Missing {kind} "
                f"description: {entry_id}"
            ),
        )

        validate_risk_floor(
            entry.get(
                "risk_floor"
            ),
            (
                f"{kind}."
                f"{entry_id}"
            ),
            allow_null=True,
        )

        validate_role_list(
            entry.get(
                "required_roles",
                [],
            ),
            known_roles,
            (
                f"{kind}."
                f"{entry_id}."
                "required_roles"
            ),
            allow_empty=True,
        )

        conditional = entry.get(
            "conditional_roles",
            {},
        )

        require(
            isinstance(
                conditional,
                dict,
            ),
            (
                "Invalid conditional roles: "
                f"{entry_id}"
            ),
        )

        for (
            role_id,
            condition,
        ) in conditional.items():
            require(
                role_id
                in known_roles,
                (
                    "Unknown conditional role "
                    f"in {entry_id}: "
                    f"{role_id}"
                ),
            )

            require(
                isinstance(
                    condition,
                    dict,
                ),
                (
                    "Invalid conditional "
                    "role rule: "
                    f"{entry_id}.{role_id}"
                ),
            )

            require(
                string_list(
                    condition.get(
                        "when"
                    )
                ),
                (
                    "Missing conditional role "
                    "conditions: "
                    f"{entry_id}.{role_id}"
                ),
            )

        validate_expertise_list(
            entry.get(
                "required_expertise",
                [],
            ),
            expertise_by_id,
            (
                f"{kind}."
                f"{entry_id}."
                "required_expertise"
            ),
            allow_empty=True,
            require_active=True,
        )

        validate_expertise_list(
            entry.get(
                "optional_expertise",
                [],
            ),
            expertise_by_id,
            (
                f"{kind}."
                f"{entry_id}."
                "optional_expertise"
            ),
            allow_empty=True,
            require_active=False,
        )

        candidates = entry.get(
            "skill_candidates",
            [],
        )

        require(
            string_list(
                candidates,
                allow_empty=True,
            ),
            (
                "Invalid skill candidates: "
                f"{kind}.{entry_id}"
            ),
        )

        require(
            len(candidates)
            == len(
                set(candidates)
            ),
            (
                "Duplicate skill candidates: "
                f"{kind}.{entry_id}"
            ),
        )

        for skill in candidates:
            validate_skill_reference(
                root,
                skill,
                markdown,
                validated_skills,
            )

            routing_skill_ids.add(
                skill
            )

        validate_assurance(
            entry.get(
                "assurance"
            ),
            (
                f"{kind}."
                f"{entry_id}"
            ),
        )

        for field in (
            "checks",
            "required_checks",
            "escalation",
            "stop_conditions",
            "notes",
        ):
            if field in entry:
                require(
                    string_list(
                        entry[field]
                    ),
                    (
                        f"Invalid {field}: "
                        f"{kind}.{entry_id}"
                    ),
                )

    for (
        task_id,
        task,
    ) in task_types.items():
        validate_routing_entry(
            "task",
            task_id,
            task,
        )

    for (
        concern_id,
        concern,
    ) in concerns.items():
        validate_routing_entry(
            "concern",
            concern_id,
            concern,
        )

    # ------------------------------------------------------------
    # Hard safety invariants
    # ------------------------------------------------------------

    for (
        concern_id,
        concern,
    ) in concerns.items():
        floor = concern.get(
            "risk_floor"
        )

        required_roles = set(
            concern.get(
                "required_roles",
                [],
            )
        )

        required_expertise = set(
            concern.get(
                "required_expertise",
                [],
            )
        )

        assurance = concern[
            "assurance"
        ]

        if floor == "R5":
            require(
                {
                    "auditor",
                    "qa",
                }
                <= required_roles,
                (
                    "R5 concern must require "
                    "auditor and qa: "
                    f"{concern_id}"
                ),
            )

            require(
                "EXP-011"
                in required_expertise,
                (
                    "R5 concern must require "
                    "independent assurance expertise: "
                    f"{concern_id}"
                ),
            )

            require(
                assurance[
                    "audit"
                ]
                == "INDEPENDENT_REQUIRED"
                and assurance[
                    "qa"
                ]
                == "REQUIRED"
                and assurance[
                    "independent_review"
                ]
                == "INDEPENDENT_REQUIRED",
                (
                    "R5 concern requires "
                    "independent assurance: "
                    f"{concern_id}"
                ),
            )

        if floor == "R4":
            require(
                {
                    "auditor",
                    "qa",
                }
                <= required_roles,
                (
                    "R4 concern must require "
                    "auditor and qa: "
                    f"{concern_id}"
                ),
            )

            require(
                assurance[
                    "audit"
                ]
                in {
                    "REQUIRED",
                    "INDEPENDENT_REQUIRED",
                }
                and assurance[
                    "qa"
                ]
                == "REQUIRED",
                (
                    "R4 concern requires "
                    "audit and QA: "
                    f"{concern_id}"
                ),
            )

    # Financial truth cannot be downgraded.
    financial = concerns.get(
        "financial-truth"
    )

    require(
        financial is not None
        and financial.get(
            "risk_floor"
        )
        == "R5"
        and {
            "EXP-005",
            "EXP-006",
            "EXP-011",
        }
        <= set(
            financial.get(
                "required_expertise",
                [],
            )
        ),
        (
            "Financial-truth routing "
            "invariant is missing"
        ),
    )

    # Authorization remains high assurance.
    authorization = concerns.get(
        "authorization"
    )

    require(
        authorization is not None
        and authorization.get(
            "risk_floor"
        )
        == "R4"
        and {
            "EXP-005",
            "EXP-007",
            "EXP-011",
        }
        <= set(
            authorization.get(
                "required_expertise",
                [],
            )
        ),
        (
            "Authorization routing "
            "invariant is missing"
        ),
    )

    # Migration expertise cannot disappear.
    migration = concerns.get(
        "migration"
    )

    require(
        migration is not None
        and migration.get(
            "risk_floor"
        )
        == "R2"
        and "EXP-004"
        in migration.get(
            "required_expertise",
            [],
        ),
        (
            "Migration routing "
            "invariant is missing"
        ),
    )

    # AI authoritative mutations retain governance coverage.
    ai_mutation = concerns.get(
        "ai-authoritative-mutation"
    )

    require(
        ai_mutation is not None
        and {
            "EXP-005",
            "EXP-007",
            "EXP-018",
            "EXP-020",
        }
        <= set(
            ai_mutation.get(
                "required_expertise",
                [],
            )
        ),
        (
            "AI authoritative-mutation "
            "routing invariant is missing"
        ),
    )

    # Control-plane governance cannot silently become engineer-only.
    governance_task = task_types.get(
        "governance-change"
    )

    require(
        governance_task is not None
        and {
            "planner",
            "engineer",
            "auditor",
            "qa",
        }
        <= set(
            governance_task.get(
                "required_roles",
                [],
            )
        )
        and {
            "EXP-001",
            "EXP-020",
        }
        <= set(
            governance_task.get(
                "required_expertise",
                [],
            )
        ),
        (
            "Governance-change routing "
            "invariant is missing"
        ),
    )

    release_task = task_types.get(
        "release-operation"
    )

    require(
        release_task is not None
        and "release-operator"
        in release_task.get(
            "required_roles",
            [],
        )
        and "EXP-021"
        in release_task.get(
            "required_expertise",
            [],
        ),
        (
            "Release-operation routing "
            "invariant is missing"
        ),
    )

    # ------------------------------------------------------------
    # Routing failures
    # ------------------------------------------------------------

    failures = routing.get(
        "routing_failures"
    )

    require(
        isinstance(
            failures,
            dict,
        )
        and failures,
        (
            "Missing routing "
            "failure policy"
        ),
    )

    for (
        failure_id,
        failure,
    ) in failures.items():
        require(
            re.fullmatch(
                (
                    r"[a-z0-9]+"
                    r"(?:-[a-z0-9]+)*"
                ),
                failure_id,
            ),
            (
                "Invalid routing failure id: "
                f"{failure_id}"
            ),
        )

        require(
            isinstance(
                failure,
                dict,
            ),
            (
                "Invalid routing failure: "
                f"{failure_id}"
            ),
        )

        require(
            failure.get(
                "result"
            )
            in ROUTING_RESULTS,
            (
                "Invalid routing failure result: "
                f"{failure_id}"
            ),
        )

        if "notes" in failure:
            require(
                string_list(
                    failure[
                        "notes"
                    ]
                ),
                (
                    "Invalid routing failure notes: "
                    f"{failure_id}"
                ),
            )

    # ------------------------------------------------------------
    # Executable routing examples
    # ------------------------------------------------------------

    examples = routing.get(
        "example_routes"
    )

    require(
        isinstance(
            examples,
            dict,
        )
        and examples,
        (
            "Missing example routes"
        ),
    )

    for (
        example_id,
        example,
    ) in examples.items():
        require(
            re.fullmatch(
                (
                    r"[a-z0-9]+"
                    r"(?:-[a-z0-9]+)*"
                ),
                example_id,
            ),
            (
                "Invalid example route id: "
                f"{example_id}"
            ),
        )

        require(
            isinstance(
                example,
                dict,
            ),
            (
                "Invalid example route: "
                f"{example_id}"
            ),
        )

        require(
            example.get(
                "profile"
            )
            in profiles,
            (
                "Unknown example profile: "
                f"{example_id}"
            ),
        )

        task_id = example.get(
            "primary_task_type"
        )

        require(
            task_id
            in task_types,
            (
                "Unknown example task type: "
                f"{example_id}"
            ),
        )

        example_concerns = (
            example.get(
                "concerns",
                [],
            )
        )

        require(
            string_list(
                example_concerns,
                allow_empty=True,
            ),
            (
                "Invalid example concerns: "
                f"{example_id}"
            ),
        )

        unknown_concerns = (
            set(
                example_concerns
            )
            - set(
                concerns
            )
        )

        require(
            not unknown_concerns,
            (
                "Unknown example concerns "
                f"in {example_id}: "
                f"{sorted(unknown_concerns)}"
            ),
        )

        expected = example.get(
            "expected"
        )

        require(
            isinstance(
                expected,
                dict,
            ),
            (
                "Missing expected route: "
                f"{example_id}"
            ),
        )

        validate_risk_floor(
            expected.get(
                "effective_risk"
            ),
            (
                "example."
                f"{example_id}"
            ),
            allow_null=False,
        )

        validate_role_list(
            expected.get(
                "roles"
            ),
            known_roles,
            (
                "example."
                f"{example_id}.roles"
            ),
            allow_empty=False,
        )

        validate_expertise_list(
            expected.get(
                "required_expertise"
            ),
            expertise_by_id,
            (
                "example."
                f"{example_id}."
                "required_expertise"
            ),
            allow_empty=True,
            require_active=True,
        )

        resolved = (
            resolve_example_route(
                routing,
                example,
            )
        )

        require(
            expected[
                "effective_risk"
            ]
            == resolved[
                "effective_risk"
            ],
            (
                "Example risk mismatch "
                f"{example_id}: "
                f"expected "
                f"{expected['effective_risk']}, "
                f"resolved "
                f"{resolved['effective_risk']}"
            ),
        )

        require(
            expected[
                "roles"
            ]
            == resolved[
                "roles"
            ],
            (
                "Example roles mismatch "
                f"{example_id}: "
                f"expected "
                f"{expected['roles']}, "
                f"resolved "
                f"{resolved['roles']}"
            ),
        )

        require(
            expected[
                "required_expertise"
            ]
            == resolved[
                "required_expertise"
            ],
            (
                "Example expertise mismatch "
                f"{example_id}: "
                f"expected "
                f"{expected['required_expertise']}, "
                f"resolved "
                f"{resolved['required_expertise']}"
            ),
        )

    # ------------------------------------------------------------
    # Existing behavioral eval baseline
    # ------------------------------------------------------------

    baseline = load_json(
        root,
        ".agents/evals/baseline.json",
    )

    require(
        baseline.get(
            "schemaVersion"
        )
        == 1
        and isinstance(
            baseline.get(
                "cases"
            ),
            list,
        ),
        (
            "Invalid eval schema"
        ),
    )

    seen = set()

    coverage = {
        category: 0
        for category
        in EVAL_CATEGORIES
    }

    for case in baseline[
        "cases"
    ]:
        require(
            isinstance(
                case,
                dict,
            ),
            (
                "Invalid eval case"
            ),
        )

        cid = case.get(
            "id"
        )

        require(
            isinstance(
                cid,
                str,
            )
            and re.fullmatch(
                (
                    r"[a-z0-9]+"
                    r"(?:-[a-z0-9]+)*"
                ),
                cid,
            )
            and cid
            not in seen,
            (
                "Duplicate/invalid eval id: "
                f"{cid}"
            ),
        )

        seen.add(
            cid
        )

        require(
            case.get(
                "category"
            )
            in EVAL_CATEGORIES,
            (
                "Invalid eval category: "
                f"{cid}"
            ),
        )

        coverage[
            case[
                "category"
            ]
        ] += 1

        require(
            case.get(
                "role"
            )
            in EXPECTED_ROLE_IDS,
            (
                "Invalid eval role: "
                f"{cid}"
            ),
        )

        for field in (
            "prompt",
            "context",
        ):
            require(
                isinstance(
                    case.get(
                        field
                    ),
                    str,
                )
                and case[
                    field
                ].strip(),
                (
                    f"Missing {field}: "
                    f"{cid}"
                ),
            )

        for field in (
            "criteria",
            "forbidden",
            "sources",
        ):
            require(
                string_list(
                    case.get(
                        field
                    )
                ),
                (
                    f"Missing {field}: "
                    f"{cid}"
                ),
            )

        for source in case[
            "sources"
        ]:
            local_file(
                root,
                source,
            )

    require(
        all(
            count >= 2
            for count
            in coverage.values()
        ),
        (
            "Need at least two cases "
            f"per category: {coverage}"
        ),
    )

    # ------------------------------------------------------------
    # Canonical documentation checks
    # ------------------------------------------------------------

    for name in AGENT_SYSTEM_DOCS:
        markdown.add(
            local_file(
                root,
                (
                    "systems/mgbos/docs/"
                    "engineering/agent-system/"
                    f"{name}.md"
                ),
            )
        )

    for path in (
        "AGENTS.md",
        "systems/mgbos/AGENTS.md",
        ".agents/evals/README.md",
        ".agents/expertise/README.md",
        ".agents/routing/README.md",
        ".agents/contracts/README.md",
        ".agents/rules/engineering-control-plane.md",
        ".agents/skills/mgbos-change/SKILL.md",
        "docs/engineering/engineering-ai-control-plane.md",
        "docs/engineering/runtime-adapter-architecture.md",
    ):
        markdown.add(
            local_file(
                root,
                path,
            )
        )

    for path in markdown:
        check_markdown(
            root,
            path,
        )

    # ------------------------------------------------------------
    # Existing hosted governance workflow
    # ------------------------------------------------------------

    workflow_path = local_file(
        root,
        ".github/workflows/agent-governance.yml",
    )

    workflow = yaml.load(
        workflow_path.read_text(
            encoding="utf-8"
        ),
        Loader=UniqueLoader,
    )

    require(
        workflow.get(
            "permissions"
        )
        == {
            "contents": "read"
        },
        (
            "Governance workflow must use "
            "read-only contents permission"
        ),
    )

    # YAML 1.1 parses unquoted GitHub key `on` as True.
    events = workflow.get(
        "on",
        workflow.get(
            True
        ),
    )

    require(
        isinstance(
            events,
            dict,
        )
        and set(
            events
        )
        == {
            "pull_request",
            "push",
            "workflow_dispatch",
        },
        (
            "Unexpected governance "
            "workflow events"
        ),
    )

    require(
        set(
            workflow.get(
                "jobs",
                {},
            )
        )
        == {
            "agent-governance",
            "migration-immutability",
        },
        (
            "Missing governance jobs"
        ),
    )

    require(
        "secrets."
        not in workflow_path.read_text(
            encoding="utf-8"
        ),
        (
            "Governance jobs must "
            "not depend on secrets"
        ),
    )

    for job in workflow[
        "jobs"
    ].values():
        require(
            "permissions"
            not in job,
            (
                "Job-level permission override "
                "is not permitted"
            ),
        )

        require(
            not job.get(
                "continue-on-error",
                False,
            ),
            (
                "Governance job cannot "
                "ignore failure"
            ),
        )

        for step in job.get(
            "steps",
            [],
        ):
            require(
                not step.get(
                    "continue-on-error",
                    False,
                ),
                (
                    "Governance step cannot "
                    "ignore failure"
                ),
            )

    agent_governance_steps = (
        workflow[
            "jobs"
        ][
            "agent-governance"
        ].get(
            "steps",
            [],
        )
    )

    run_commands = {
        step.get(
            "run"
        )
        for step
        in agent_governance_steps
        if (
            isinstance(
                step,
                dict,
            )
            and isinstance(
                step.get(
                    "run"
                ),
                str,
            )
        )
    }

    required_governance_commands = {
        (
            "python scripts/governance/"
            "validate-agent-governance.py"
        ),
        (
            "python scripts/governance/"
            "validate_engineering_capabilities.py"
        ),
        (
            "python scripts/governance/"
            "validate_engineering_contracts.py"
        ),
        (
            "python scripts/governance/"
            "validate_runtime_adapters.py"
        ),
        (
            "python scripts/governance/"
            "validate_ci_supply_chain.py"
        ),
        (
            "python scripts/governance/"
            "validate_vibe_continuity.py"
        ),
    }

    missing_governance_commands = (
        required_governance_commands
        - run_commands
    )

    require(
        not missing_governance_commands,
        (
            "Agent Governance CI is missing "
            "required validators: "
            f"{sorted(missing_governance_commands)}"
        ),
    )

    return {
        "skills":
            len(
                STRICT_SKILLS
            ),

        "roles":
            len(
                roles
            ),

        "expertise":
            len(
                expertise_by_id
            ),

        "task_types":
            len(
                task_types
            ),

        "concerns":
            len(
                concerns
            ),

        "cases":
            len(
                seen
            ),

        "markdown":
            len(
                markdown
            ),

        "routing_skills":
            len(
                routing_skill_ids
            ),

        "warnings":
            warnings,
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
        yaml.YAMLError,
    ) as error:
        parser.exit(
            1,
            f"FAIL: {error}\n",
        )

    for warning in result.pop(
        "warnings"
    ):
        print(
            f"COMPATIBILITY: {warning}"
        )

    print(
        "PASS (structural validation only): "
        f"{json.dumps(result)}"
    )