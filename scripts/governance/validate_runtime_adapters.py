"""Validate engineering runtime adapters and their behavioral-eval bindings.

This validator checks repository structure and adapter safety invariants.
It does not execute Codex, Antigravity, or any other AI runtime.
"""

import argparse
import json
import re
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[2]

REGISTRY_PATH = ".agents/adapters/registry.yaml"
BASELINE_PATH = ".agents/evals/baseline.json"

EXPECTED_PROVIDERS = {
    "codex",
    "antigravity",
}

EXPECTED_RUNTIME_CASES = {
    "runtime-payment-r5-routing",
    "runtime-ui-r1-proportionality",
    "runtime-scope-expansion-stop",
    "runtime-fake-independent-review",
    "runtime-stale-revision-evidence",
    "runtime-overlapping-writers",
}

ANTIGRAVITY_RULE_TRIGGERS = {
    "always_on",
    "model_decision",
    "glob",
    "manual",
}

ANTIGRAVITY_RULE_FRONTMATTER_KEYS = {
    "trigger",
    "description",
    "globs",
    "glob",
}


class UniqueLoader(yaml.SafeLoader):
    """Fail instead of silently accepting duplicate YAML keys."""


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


def repository_path(root, relative):
    require(
        isinstance(relative, str)
        and relative.strip(),
        "Expected a nonempty repository path",
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


def local_file(root, relative):
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


def local_dir(root, relative):
    target = repository_path(
        root,
        relative,
    )

    require(
        target.is_dir(),
        (
            "Missing directory: "
            f"{relative}"
        ),
    )

    return target


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


def read_markdown(root, relative):
    text = local_file(
        root,
        relative,
    ).read_text(
        encoding="utf-8"
    )

    require(
        text.strip(),
        (
            "Empty runtime adapter file: "
            f"{relative}"
        ),
    )

    require(
        not re.search(
            r"(?m)^(<<<<<<< |=======\s*$|>>>>>>> )",
            text,
        ),
        (
            "Conflict marker in runtime adapter: "
            f"{relative}"
        ),
    )

    require(
        not re.search(
            r"\[TODO:[^\n]*\]",
            text,
        ),
        (
            "Unfinished runtime adapter: "
            f"{relative}"
        ),
    )

    return text


def parse_rule_frontmatter(
    path,
    text,
):
    match = re.match(
        r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)",
        text,
        re.S,
    )

    require(
        match is not None,
        (
            "Antigravity rule must contain "
            "YAML frontmatter: "
            f"{path}"
        ),
    )

    data = yaml.load(
        match.group(1),
        Loader=UniqueLoader,
    )

    require(
        isinstance(
            data,
            dict,
        ),
        (
            "Invalid Antigravity "
            "rule frontmatter: "
            f"{path}"
        ),
    )

    unknown_keys = (
        set(data)
        - ANTIGRAVITY_RULE_FRONTMATTER_KEYS
    )

    require(
        not unknown_keys,
        (
            "Unsupported Antigravity "
            "rule frontmatter keys in "
            f"{path}: "
            f"{sorted(unknown_keys)}"
        ),
    )

    trigger = data.get(
        "trigger"
    )

    require(
        trigger
        in ANTIGRAVITY_RULE_TRIGGERS,
        (
            "Invalid Antigravity rule "
            f"trigger in {path}: "
            f"{trigger!r}"
        ),
    )

    description = data.get(
        "description"
    )

    if description is not None:
        require(
            isinstance(
                description,
                str,
            )
            and description.strip(),
            (
                "Antigravity rule description "
                "must be a nonempty string: "
                f"{path}"
            ),
        )

    if trigger == "model_decision":
        require(
            isinstance(
                description,
                str,
            )
            and description.strip(),
            (
                "Antigravity model_decision "
                "rule requires description: "
                f"{path}"
            ),
        )

    glob_value = data.get(
        "globs"
    )
    singular_glob = data.get(
        "glob"
    )

    if trigger == "glob":
        require(
            bool(
                isinstance(
                    glob_value,
                    str,
                )
                and glob_value.strip()
            )
            ^ bool(
                isinstance(
                    singular_glob,
                    str,
                )
                and singular_glob.strip()
            ),
            (
                "Antigravity glob rule requires "
                "exactly one nonempty globs/glob "
                f"value: {path}"
            ),
        )

    else:
        require(
            glob_value is None
            and singular_glob is None,
            (
                "Antigravity non-glob rule "
                "must not declare globs/glob: "
                f"{path}"
            ),
        )

    return data


def validate_antigravity_rules(
    root,
    relative_directory,
):
    directory = local_dir(
        root,
        relative_directory,
    )

    rule_files = sorted(
        path
        for path in directory.glob(
            "*.md"
        )
        if path.is_file()
    )

    require(
        bool(
            rule_files
        ),
        (
            "Antigravity rule directory "
            "must contain at least one "
            "top-level .md rule"
        ),
    )

    metadata = {}

    for target in rule_files:
        relative = (
            target.relative_to(
                root
            ).as_posix()
        )

        text = read_markdown(
            root,
            relative,
        )

        metadata[
            relative
        ] = (
            parse_rule_frontmatter(
                relative,
                text,
            )
        )

    return metadata


def parse_workflow_frontmatter(text):
    match = re.match(
        r"\A---\n(.*?)\n---(?:\n|$)",
        text,
        re.S,
    )

    require(
        match is not None,
        (
            "Antigravity workflow must "
            "contain YAML frontmatter"
        ),
    )

    data = yaml.load(
        match.group(1),
        Loader=UniqueLoader,
    )

    require(
        isinstance(data, dict),
        (
            "Invalid Antigravity "
            "workflow frontmatter"
        ),
    )

    require(
        set(data)
        == {
            "description",
        },
        (
            "Antigravity workflow frontmatter "
            "must contain only description"
        ),
    )

    require(
        isinstance(
            data.get(
                "description"
            ),
            str,
        )
        and data[
            "description"
        ].strip(),
        (
            "Antigravity workflow requires "
            "a nonempty description"
        ),
    )


def validate_no_adapter_canonical_claim(
    path,
    text,
):
    forbidden = (
        r"(?m)^canonical_id\s*:",
        r"(?m)^authoritative_for\s*:",
    )

    for pattern in forbidden:
        require(
            not re.search(
                pattern,
                text,
            ),
            (
                "Provider adapter must not "
                "declare canonical authority: "
                f"{path}"
            ),
        )


def validate_provider_files(
    root,
    provider_id,
    provider,
):
    adapter_files = provider.get(
        "adapter_files"
    )

    require(
        string_list(
            adapter_files,
            allow_empty=True,
        ),
        (
            "Invalid adapter_files for "
            f"{provider_id}"
        ),
    )

    require(
        len(adapter_files)
        == len(
            set(adapter_files)
        ),
        (
            "Duplicate adapter files for "
            f"{provider_id}"
        ),
    )

    texts = {}

    for path in adapter_files:
        text = read_markdown(
            root,
            path,
        )

        validate_no_adapter_canonical_claim(
            path,
            text,
        )

        texts[
            path
        ] = text

    return texts


def validate(root=ROOT):
    root = Path(
        root
    ).resolve()

    registry = load_yaml(
        root,
        REGISTRY_PATH,
    )

    require(
        registry.get(
            "schema_version"
        )
        == 1,
        (
            "Invalid runtime adapter "
            "schema version"
        ),
    )

    metadata = registry.get(
        "registry"
    )

    require(
        isinstance(
            metadata,
            dict,
        ),
        (
            "Missing runtime adapter "
            "registry metadata"
        ),
    )

    for field in (
        "semantic_policy",
        "control_plane",
        "role_registry",
        "expertise_registry",
        "routing_registry",
        "contract_registry",
        "eval_baseline",
    ):
        local_file(
            root,
            metadata.get(
                field
            ),
        )

    shared = registry.get(
        "shared"
    )

    require(
        isinstance(
            shared,
            dict,
        ),
        "Missing runtime adapter shared policy",
    )

    local_dir(
        root,
        shared.get(
            "skill_source"
        ),
    )

    for field in (
        "provider_policy_authority",
        "direct_runtime_rpc_assumed",
        "independence_inferred_from_runtime_switch",
    ):
        require(
            shared.get(
                field
            )
            is False,
            (
                "Unsafe runtime adapter "
                f"shared setting: {field}"
            ),
        )

    require(
        shared.get(
            "one_writer_required"
        )
        is True,
        (
            "Runtime adapters must preserve "
            "One Writer Rule"
        ),
    )

    require(
        shared.get(
            "artifact_handoff_required_for_material_cross_runtime_work"
        )
        is True,
        (
            "Material cross-runtime work "
            "must use artifact handoff"
        ),
    )

    providers = registry.get(
        "providers"
    )

    require(
        isinstance(
            providers,
            dict,
        ),
        "Missing runtime adapter providers",
    )

    require(
        set(
            providers
        )
        == EXPECTED_PROVIDERS,
        (
            "Runtime Adapter v1 must register "
            "exactly Codex and Antigravity"
        ),
    )

    # --------------------------------------------------------
    # Codex
    # --------------------------------------------------------

    codex = providers[
        "codex"
    ]

    require(
        codex.get(
            "status"
        )
        == "ACTIVE",
        "Codex adapter must be ACTIVE",
    )

    require(
        codex.get(
            "provider"
        )
        == "OpenAI",
        "Invalid Codex provider",
    )

    require(
        codex.get(
            "native_mode"
        )
        == "hierarchical-agents-and-skills",
        "Invalid Codex native mode",
    )

    codex_sources = codex.get(
        "instruction_sources"
    )

    require(
        string_list(
            codex_sources
        ),
        "Invalid Codex instruction sources",
    )

    require(
        {
            "AGENTS.md",
            "systems/mgbos/AGENTS.md",
        }
        <= set(
            codex_sources
        ),
        (
            "Codex must preserve root and "
            "MGBOS AGENTS hierarchy"
        ),
    )

    codex_text = ""

    for source in codex_sources:
        codex_text += (
            "\n"
            + read_markdown(
                root,
                source,
            )
        )

    require(
        codex.get(
            "adapter_files"
        )
        == [],
        (
            "Codex v1 must not introduce "
            "a duplicate provider policy file"
        ),
    )

    require(
        codex.get(
            "shared_skill_source"
        )
        == shared[
            "skill_source"
        ],
        (
            "Codex must use shared "
            "project Skills"
        ),
    )

    for reference in codex.get(
        "required_references",
        [],
    ):
        local_file(
            root,
            reference,
        )

        require(
            reference in codex_text,
            (
                "Codex instruction hierarchy "
                "does not reference required "
                f"control-plane source: {reference}"
            ),
        )

    require(
        codex.get(
            "runtime_eval_required"
        )
        is True,
        (
            "Codex runtime evaluation "
            "must remain required"
        ),
    )

    # --------------------------------------------------------
    # Antigravity
    # --------------------------------------------------------

    antigravity = providers[
        "antigravity"
    ]

    require(
        antigravity.get(
            "status"
        )
        == "ACTIVE",
        (
            "Antigravity adapter "
            "must be ACTIVE"
        ),
    )

    require(
        antigravity.get(
            "provider"
        )
        == "Google",
        (
            "Invalid Antigravity provider"
        ),
    )

    require(
        antigravity.get(
            "native_mode"
        )
        == "workspace-rules-skills-workflows",
        (
            "Invalid Antigravity "
            "native mode"
        ),
    )

    surfaces = antigravity.get(
        "native_surfaces"
    )

    require(
        isinstance(
            surfaces,
            dict,
        )
        and set(
            surfaces
        )
        == {
            "rules",
            "skills",
            "workflows",
        },
        (
            "Invalid Antigravity "
            "native surfaces"
        ),
    )

    for path in surfaces.values():
        local_dir(
            root,
            path,
        )

    require(
        antigravity.get(
            "shared_skill_source"
        )
        == shared[
            "skill_source"
        ]
        == surfaces[
            "skills"
        ],
        (
            "Antigravity must use shared "
            "project Skills"
        ),
    )

    rule_metadata = (
        validate_antigravity_rules(
            root,
            surfaces[
                "rules"
            ],
        )
    )

    control_plane_rule = (
        ".agents/rules/"
        "engineering-control-plane.md"
    )

    require(
        control_plane_rule
        in rule_metadata,
        (
            "Antigravity control-plane "
            "rule is not discoverable"
        ),
    )

    require(
        rule_metadata[
            control_plane_rule
        ].get(
            "trigger"
        )
        == "always_on",
        (
            "Antigravity control-plane "
            "rule must remain always_on"
        ),
    )

    adapter_texts = (
        validate_provider_files(
            root,
            "antigravity",
            antigravity,
        )
    )

    expected_files = {
        ".agents/rules/engineering-control-plane.md",
        ".agents/workflows/mgbos.change.md",
    }

    require(
        set(
            adapter_texts
        )
        == expected_files,
        (
            "Antigravity v1 must contain "
            "exactly the approved rule and "
            "MGBOS workflow adapter"
        ),
    )

    workflow_path = (
        ".agents/workflows/"
        "mgbos.change.md"
    )

    parse_workflow_frontmatter(
        adapter_texts[
            workflow_path
        ]
    )

    commands = antigravity.get(
        "workflow_commands"
    )

    require(
        commands
        == {
            "/mgbos.change":
                workflow_path
        },
        (
            "Invalid Antigravity "
            "workflow command mapping"
        ),
    )

    combined_adapter_text = (
        "\n".join(
            adapter_texts.values()
        )
    )

    for reference in antigravity.get(
        "required_references",
        [],
    ):
        local_file(
            root,
            reference,
        )

        require(
            reference
            in combined_adapter_text,
            (
                "Antigravity adapter missing "
                "canonical reference: "
                f"{reference}"
            ),
        )

    for marker in antigravity.get(
        "required_markers",
        [],
    ):
        require(
            marker
            in combined_adapter_text,
            (
                "Antigravity adapter missing "
                f"safety marker: {marker}"
            ),
        )

    require(
        antigravity.get(
            "runtime_eval_required"
        )
        is True,
        (
            "Antigravity runtime evaluation "
            "must remain required"
        ),
    )

    # --------------------------------------------------------
    # Cross-runtime policy
    # --------------------------------------------------------

    cross_runtime = registry.get(
        "cross_runtime"
    )

    require(
        isinstance(
            cross_runtime,
            dict,
        ),
        (
            "Missing cross-runtime policy"
        ),
    )

    require(
        cross_runtime.get(
            "handoff_mode"
        )
        == "canonical-artifacts",
        (
            "Cross-runtime handoff must use "
            "canonical artifacts"
        ),
    )

    require(
        cross_runtime.get(
            "direct_provider_rpc_required"
        )
        is False,
        (
            "Cross-runtime design must not "
            "assume provider RPC"
        ),
    )

    require(
        cross_runtime.get(
            "runtime_switch_implies_independence"
        )
        is False,
        (
            "Runtime switching must not "
            "imply independent assurance"
        ),
    )

    require(
        cross_runtime.get(
            "shared_mutable_worktree_allowed"
        )
        is False,
        (
            "Cross-runtime adapters must not "
            "share mutable worktrees"
        ),
    )

    # --------------------------------------------------------
    # Runtime behavioral baseline
    # --------------------------------------------------------

    behavioral = registry.get(
        "behavioral_evaluation"
    )

    require(
        isinstance(
            behavioral,
            dict,
        ),
        (
            "Missing adapter behavioral "
            "evaluation policy"
        ),
    )

    baseline_path = behavioral.get(
        "baseline"
    )

    require(
        baseline_path
        == BASELINE_PATH,
        (
            "Runtime adapters must use "
            "canonical eval baseline"
        ),
    )

    baseline = load_json(
        root,
        baseline_path,
    )

    require(
        baseline.get(
            "schemaVersion"
        )
        == 1,
        "Invalid behavioral baseline",
    )

    cases = baseline.get(
        "cases"
    )

    require(
        isinstance(
            cases,
            list,
        ),
        "Behavioral cases must be a list",
    )

    by_id = {}

    for case in cases:
        require(
            isinstance(
                case,
                dict,
            ),
            "Invalid behavioral case",
        )

        case_id = case.get(
            "id"
        )

        require(
            isinstance(
                case_id,
                str,
            ),
            "Missing behavioral case ID",
        )

        require(
            case_id
            not in by_id,
            (
                "Duplicate behavioral case ID: "
                f"{case_id}"
            ),
        )

        by_id[
            case_id
        ] = case

    declared_required = set(
        behavioral.get(
            "required_adapter_cases",
            [],
        )
    )

    require(
        declared_required
        == EXPECTED_RUNTIME_CASES,
        (
            "Runtime Adapter v1 requires "
            "the six canonical runtime cases"
        ),
    )

    require(
        EXPECTED_RUNTIME_CASES
        <= set(
            by_id
        ),
        (
            "Missing required runtime "
            "behavioral eval cases"
        ),
    )

    for case_id in EXPECTED_RUNTIME_CASES:
        case = by_id[
            case_id
        ]

        require(
            case.get(
                "adapter_case"
            )
            is True,
            (
                "Runtime eval must set "
                f"adapter_case=true: {case_id}"
            ),
        )

        targets = case.get(
            "runtime_targets"
        )

        require(
            string_list(
                targets
            ),
            (
                "Runtime eval missing "
                f"runtime_targets: {case_id}"
            ),
        )

        unknown_targets = (
            set(targets)
            - EXPECTED_PROVIDERS
        )

        require(
            not unknown_targets,
            (
                "Runtime eval contains "
                "unknown runtime target in "
                f"{case_id}: "
                f"{sorted(unknown_targets)}"
            ),
        )

        require(
            string_list(
                case.get(
                    "criteria"
                )
            ),
            (
                "Runtime eval missing "
                f"criteria: {case_id}"
            ),
        )

        require(
            string_list(
                case.get(
                    "forbidden"
                )
            ),
            (
                "Runtime eval missing "
                f"forbidden behavior: {case_id}"
            ),
        )

    require(
        "antigravity"
        in by_id[
            "runtime-overlapping-writers"
        ][
            "runtime_targets"
        ],
        (
            "Overlapping-writer eval must "
            "cover Antigravity"
        ),
    )

    return {
        "providers":
            len(
                providers
            ),

        "adapter_files":
            len(
                adapter_texts
            ),

        "runtime_eval_cases":
            len(
                EXPECTED_RUNTIME_CASES
            ),

        "direct_runtime_rpc_assumed":
            False,

        "provider_policy_authority":
            False,
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
        "(runtime adapter structural "
        "validation only): "
        f"{json.dumps(result)}"
    )