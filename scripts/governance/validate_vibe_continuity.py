"""Validate Vibe Engineering continuity checkpoint.

This validator checks repository-controlled continuity checkpoint structure.
The checkpoint records the last verified engineering snapshot across sessions.
It does not execute an AI runtime and does not prove live repository HEAD.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
from typing import Any

import yaml


ROOT = Path(__file__).resolve().parents[2]

SHA_RE = re.compile(r"^[0-9a-f]{40}$")

FORBIDDEN_LIVE_KEYS = {
    "current_main",
    "live_main",
    "live_head",
    "current_pr_head",
}

EXPECTED_TOP_LEVEL = {
    "schema_version",
    "kind",
    "status",
    "repository",
    "capture",
    "program",
    "security_posture",
    "deferred_layers",
    "recovery",
    "next_allowed_action",
}

ALLOWED_MILESTONE_RESULTS = {
    "VE_POST_MERGE.VERIFIED",
    "VE_POST_MERGE.BLOCKED",
}

ALLOWED_PRIVILEGED_RUNNER = {
    "DISABLED",
    "ENABLED",
}

MINIMUM_READ_FIRST = {
    "AGENTS.md",
    ".agents/continuity/checkpoint.yaml",
    "docs/engineering/vibe-engineering/session-protocol.md",
}


class UniqueLoader(yaml.SafeLoader):
    """YAML loader that fails on duplicate mapping keys."""


def unique_mapping(loader, node, deep=False):
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if key in result:
            raise ValueError(f"Duplicate YAML key: {key}")
        result[key] = loader.construct_object(value_node, deep=deep)
    return result


UniqueLoader.add_constructor(
    yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG,
    unique_mapping,
)


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def check_forbidden_keys(data: Any, path: str = "") -> None:
    """Recursively reject keys that imply live repository state."""
    if isinstance(data, dict):
        for key, val in data.items():
            if isinstance(key, str) and key in FORBIDDEN_LIVE_KEYS:
                raise ValueError(
                    f"Forbidden live-state key '{key}' found at {path or 'root'}: "
                    "continuity checkpoint stores observed snapshot state, not live repository state"
                )
            subpath = f"{path}.{key}" if path else str(key)
            check_forbidden_keys(val, subpath)
    elif isinstance(data, list):
        for idx, item in enumerate(data):
            check_forbidden_keys(item, f"{path}[{idx}]")


def validate(root: Path = ROOT) -> dict[str, Any]:
    checkpoint_file = root / ".agents" / "continuity" / "checkpoint.yaml"
    require(
        checkpoint_file.exists(),
        f"Missing continuity checkpoint file: {checkpoint_file}",
    )
    require(
        checkpoint_file.is_file(),
        f"Continuity checkpoint must be a file: {checkpoint_file}",
    )

    content = checkpoint_file.read_text(encoding="utf-8")
    data = yaml.load(content, Loader=UniqueLoader)

    require(isinstance(data, dict), "Continuity checkpoint root must be a mapping")

    # Reject forbidden live-state keys recursively
    check_forbidden_keys(data)

    # Required top level fields
    top_keys = set(data.keys())
    missing_top = EXPECTED_TOP_LEVEL - top_keys
    require(not missing_top, f"Missing required top-level fields: {sorted(missing_top)}")
    unexpected_top = top_keys - EXPECTED_TOP_LEVEL
    require(not unexpected_top, f"Unexpected top-level fields: {sorted(unexpected_top)}")

    require(
        data.get("schema_version") == 1 and type(data.get("schema_version")) is int,
        f"schema_version must be integer 1, got {data.get('schema_version')}",
    )
    require(
        data.get("kind") == "VIBE_CONTINUITY_CHECKPOINT",
        f"kind must be VIBE_CONTINUITY_CHECKPOINT, got {data.get('kind')}",
    )
    require(
        data.get("status") == "ACTIVE",
        f"status must be ACTIVE, got {data.get('status')}",
    )

    # Repository
    repository = data["repository"]
    require(isinstance(repository, dict), "repository must be a mapping")
    require(
        repository.get("full_name") == "Rizkybuilds/bisnishub",
        f"repository.full_name must be Rizkybuilds/bisnishub, got {repository.get('full_name')}",
    )
    require(
        repository.get("canonical_branch") == "main",
        f"repository.canonical_branch must be main, got {repository.get('canonical_branch')}",
    )

    # Capture
    capture = data["capture"]
    require(isinstance(capture, dict), "capture must be a mapping")
    observed_main = capture.get("observed_main")
    require(
        isinstance(observed_main, str) and bool(SHA_RE.match(observed_main)),
        f"capture.observed_main must be lowercase 40-character hex SHA, got {observed_main}",
    )
    observed_on = str(capture.get("observed_on", "")).strip()
    require(bool(observed_on), "capture.observed_on must be nonempty")
    semantics = capture.get("semantics")
    require(
        isinstance(semantics, str) and bool(semantics.strip()),
        "capture.semantics must be a nonempty string",
    )

    # Program
    program = data["program"]
    require(isinstance(program, dict), "program must be a mapping")
    current_stream = program.get("current_stream")
    require(
        isinstance(current_stream, str) and bool(current_stream.strip()),
        "program.current_stream must be a nonempty string",
    )

    completed_milestones = program.get("completed_milestones")
    require(
        isinstance(completed_milestones, list) and len(completed_milestones) > 0,
        "program.completed_milestones must be a nonempty list",
    )

    milestone_labels: list[str] = []
    milestone_prs: list[int] = []

    for idx, milestone in enumerate(completed_milestones):
        require(
            isinstance(milestone, dict),
            f"Milestone at index {idx} must be a mapping",
        )
        label = milestone.get("label")
        require(
            isinstance(label, str) and bool(label.strip()),
            f"Milestone at index {idx} has invalid label: {label}",
        )
        milestone_labels.append(label)

        pr = milestone.get("pr")
        require(
            isinstance(pr, int) and not isinstance(pr, bool) and pr > 0,
            f"Milestone '{label}' pr must be a positive integer, got {pr}",
        )
        milestone_prs.append(pr)

        sha = milestone.get("integration_sha")
        require(
            isinstance(sha, str) and bool(SHA_RE.match(sha)),
            f"Milestone '{label}' integration_sha must be lowercase 40-character hex SHA, got {sha}",
        )

        result = milestone.get("result")
        require(
            result in ALLOWED_MILESTONE_RESULTS,
            f"Milestone '{label}' result must be one of {sorted(ALLOWED_MILESTONE_RESULTS)}, got {result}",
        )

    require(
        len(milestone_labels) == len(set(milestone_labels)),
        f"Duplicate milestone label found: {[x for x in milestone_labels if milestone_labels.count(x) > 1]}",
    )
    require(
        len(milestone_prs) == len(set(milestone_prs)),
        f"Duplicate milestone PR found: {[x for x in milestone_prs if milestone_prs.count(x) > 1]}",
    )

    latest_known = program.get("latest_known_main_change")
    require(isinstance(latest_known, dict), "program.latest_known_main_change must be a mapping")
    latest_pr = latest_known.get("pr")
    require(
        isinstance(latest_pr, int) and not isinstance(latest_pr, bool) and latest_pr > 0,
        f"latest_known_main_change.pr must be a positive integer, got {latest_pr}",
    )
    latest_sha = latest_known.get("sha")
    require(
        isinstance(latest_sha, str) and bool(SHA_RE.match(latest_sha)),
        f"latest_known_main_change.sha must be lowercase 40-character hex SHA, got {latest_sha}",
    )
    latest_summary = latest_known.get("summary")
    require(
        isinstance(latest_summary, str) and bool(latest_summary.strip()),
        "latest_known_main_change.summary must be a nonempty string",
    )

    next_expected = program.get("next_expected_work")
    require(isinstance(next_expected, dict), "program.next_expected_work must be a mapping")
    next_label = next_expected.get("label")
    require(
        isinstance(next_label, str) and bool(next_label.strip()),
        "next_expected_work.label must be a nonempty string",
    )
    next_objective = next_expected.get("objective")
    require(
        isinstance(next_objective, str) and bool(next_objective.strip()),
        "next_expected_work.objective must be a nonempty string",
    )

    # Security Posture
    security_posture = data["security_posture"]
    require(isinstance(security_posture, dict), "security_posture must be a mapping")
    remote_mutation = security_posture.get("remote_mutation_enabled")
    require(
        isinstance(remote_mutation, bool),
        f"security_posture.remote_mutation_enabled must be a boolean, got {remote_mutation}",
    )
    production_exec = security_posture.get("production_execution_enabled")
    require(
        isinstance(production_exec, bool),
        f"security_posture.production_execution_enabled must be a boolean, got {production_exec}",
    )
    priv_runner = security_posture.get("privileged_runner")
    require(
        priv_runner in ALLOWED_PRIVILEGED_RUNNER,
        f"security_posture.privileged_runner must be one of {sorted(ALLOWED_PRIVILEGED_RUNNER)}, got {priv_runner}",
    )

    # Deferred Layers
    deferred_layers = data["deferred_layers"]
    require(isinstance(deferred_layers, list), "deferred_layers must be a list")
    for idx, layer in enumerate(deferred_layers):
        require(isinstance(layer, dict), f"deferred_layers[{idx}] must be a mapping")
        layer_id = layer.get("id")
        require(
            isinstance(layer_id, str) and bool(layer_id.strip()),
            f"deferred_layers[{idx}].id must be a nonempty string",
        )
        layer_summary = layer.get("summary")
        require(
            isinstance(layer_summary, str) and bool(layer_summary.strip()),
            f"deferred_layers[{idx}].summary must be a nonempty string",
        )

    # Recovery
    recovery = data["recovery"]
    require(isinstance(recovery, dict), "recovery must be a mapping")
    read_first = recovery.get("read_first")
    require(
        isinstance(read_first, list) and len(read_first) > 0,
        "recovery.read_first must be a nonempty list",
    )

    read_first_set = set()
    for item in read_first:
        require(
            isinstance(item, str) and bool(item.strip()),
            f"recovery.read_first items must be nonempty strings, got {item}",
        )
        # must be repository-relative and not escape root
        require(
            not Path(item).is_absolute(),
            f"recovery.read_first path must be repository-relative: {item}",
        )
        target = (root / item).resolve()
        require(
            target.is_relative_to(root.resolve()),
            f"recovery.read_first path escapes repository root: {item}",
        )
        require(
            target.exists(),
            f"recovery.read_first path does not exist: {item}",
        )
        read_first_set.add(item)

    missing_minimum = MINIMUM_READ_FIRST - read_first_set
    require(
        not missing_minimum,
        f"recovery.read_first must include minimum paths: {sorted(missing_minimum)}",
    )

    verify_on_restore = recovery.get("verify_on_restore")
    require(
        isinstance(verify_on_restore, list) and len(verify_on_restore) > 0,
        "recovery.verify_on_restore must be a nonempty list",
    )
    for item in verify_on_restore:
        require(
            isinstance(item, str) and bool(item.strip()),
            f"recovery.verify_on_restore items must be nonempty strings, got {item}",
        )

    # Next Allowed Action
    next_action = data["next_allowed_action"]
    require(isinstance(next_action, dict), "next_allowed_action must be a mapping")
    session_type = next_action.get("session_type")
    require(
        isinstance(session_type, str) and bool(session_type.strip()),
        "next_allowed_action.session_type must be a nonempty string",
    )
    target_system = next_action.get("target_system")
    require(
        isinstance(target_system, str) and bool(target_system.strip()),
        "next_allowed_action.target_system must be a nonempty string",
    )
    action = next_action.get("action")
    require(
        isinstance(action, str) and bool(action.strip()),
        "next_allowed_action.action must be a nonempty string",
    )

    return {
        "milestones": len(completed_milestones),
        "read_first_paths": len(read_first),
        "deferred_layers": len(deferred_layers),
        "snapshot_semantics": True,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Validate Vibe Engineering continuity checkpoint."
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=ROOT,
        help="Repository root path",
    )
    args = parser.parse_args()

    result = validate(args.root)
    print(f"PASS (vibe continuity checkpoint validation only):\n{json.dumps(result, indent=2)}")


if __name__ == "__main__":
    main()
