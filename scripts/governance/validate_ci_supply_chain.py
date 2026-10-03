"""Deterministic validator for CI workflow supply-chain governance policies."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[2]

ALLOWED_EXTERNAL_ACTIONS = {
    "actions/checkout",
    "actions/setup-node",
    "actions/setup-python",
    "actions/upload-artifact",
    "pnpm/action-setup",
}

ALLOWED_ACTION_INPUTS = {
    "actions/checkout": {
        "persist-credentials",
        "fetch-depth",
    },
    "actions/setup-node": {
        "node-version",
        "node-version-file",
        "cache",
        "cache-dependency-path",
    },
    "actions/setup-python": {
        "python-version",
    },
    "actions/upload-artifact": {
        "name",
        "path",
    },
    "pnpm/action-setup": {
        "version",
    },
}

FULL_SHA_REGEX = re.compile(r"^[0-9a-f]{40}$")
ACTION_REPO_REGEX = re.compile(r"^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$")


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


def validate(root: Path = ROOT) -> dict[str, Any]:
    if isinstance(root, str):
        root = Path(root)

    workflows_dir = root / ".github" / "workflows"
    if not workflows_dir.is_dir():
        raise ValueError(f"Workflows directory not found: {workflows_dir}")

    workflow_files = sorted(
        p
        for p in workflows_dir.iterdir()
        if p.is_file() and p.suffix in (".yml", ".yaml")
    )
    if not workflow_files:
        raise ValueError(f"No workflow files found in {workflows_dir}")

    total_action_uses = 0
    total_checkout_steps = 0

    for workflow_path in workflow_files:
        rel_path = workflow_path.relative_to(root).as_posix()
        raw_content = workflow_path.read_text(encoding="utf-8")
        if "secrets." in raw_content:
            raise ValueError(
                f"Workflow {rel_path} contains forbidden secret context "
                "reference ('secrets.'); secret context is not permitted "
                "by the CI supply-chain baseline"
            )
        data = yaml.load(raw_content, Loader=UniqueLoader)

        if not isinstance(data, dict):
            raise ValueError(f"Workflow {rel_path} root must be a YAML mapping")

        # Workflow permissions check
        perms = data.get("permissions")
        if perms != {"contents": "read"}:
            raise ValueError(
                f"Workflow {rel_path} must have top-level "
                f"'permissions: contents: read', got {perms!r}"
            )

        jobs = data.get("jobs")
        if not isinstance(jobs, dict) or not jobs:
            raise ValueError(f"Workflow {rel_path} must define a 'jobs' mapping")

        for job_id, job in jobs.items():
            if not isinstance(job, dict):
                raise ValueError(f"Job '{job_id}' in {rel_path} must be a mapping")

            if "uses" in job:
                raise ValueError(
                    f"Reusable workflow job '{job_id}' in {rel_path} "
                    "is not permitted by the current CI supply-chain baseline"
                )

            if "permissions" in job:
                raise ValueError(
                    f"Job '{job_id}' in {rel_path} defines permissions "
                    f"({job['permissions']!r}); job-level permission override "
                    f"is not permitted"
                )

            runs_on = job.get("runs-on")
            if runs_on != "ubuntu-24.04":
                raise ValueError(
                    f"Job '{job_id}' in {rel_path} must have 'runs-on: ubuntu-24.04', "
                    f"got {runs_on!r}; unapproved runner baseline"
                )

            if "container" in job:
                raise ValueError(
                    f"Job '{job_id}' in {rel_path} defines 'container'; "
                    "job container not permitted by the CI supply-chain baseline"
                )

            if "services" in job:
                raise ValueError(
                    f"Job '{job_id}' in {rel_path} defines 'services'; "
                    "service container not permitted by the CI supply-chain baseline"
                )

            if "environment" in job:
                raise ValueError(
                    f"Job '{job_id}' in {rel_path} defines 'environment'; "
                    "job environment not permitted by the CI supply-chain baseline"
                )

            steps = job.get("steps")
            if steps is not None:
                if not isinstance(steps, list):
                    raise ValueError(
                        f"Job '{job_id}' in {rel_path} 'steps' must be a list"
                    )

                for step_idx, step in enumerate(steps):
                    if not isinstance(step, dict):
                        raise ValueError(
                            f"Step {step_idx} in job '{job_id}' of {rel_path} "
                            f"must be a mapping"
                        )

                    if "uses" in step:
                        uses = step["uses"]
                        if not isinstance(uses, str):
                            raise ValueError(
                                f"Step {step_idx} in job '{job_id}' of {rel_path} "
                                f"'uses' must be a string"
                            )

                        if uses.startswith("./"):
                            raise ValueError(
                                f"Local action reference '{uses}' in {rel_path} "
                                "is not permitted by the current CI supply-chain baseline"
                            )

                        if uses.startswith("docker://"):
                            raise ValueError(
                                f"Unsupported action source '{uses}' in "
                                f"{rel_path}: docker actions are not permitted"
                            )

                        if "@" not in uses:
                            raise ValueError(
                                f"External action '{uses}' in {rel_path} "
                                f"requires a full 40-character commit SHA"
                            )

                        parts = uses.split("@")
                        if len(parts) != 2:
                            raise ValueError(
                                f"Malformed external action reference "
                                f"'{uses}' in {rel_path}"
                            )

                        repo, ref = parts
                        if not ACTION_REPO_REGEX.match(repo):
                            raise ValueError(
                                f"Malformed external action repository "
                                f"'{repo}' in {rel_path}"
                            )

                        if repo not in ALLOWED_EXTERNAL_ACTIONS:
                            raise ValueError(
                                f"Unapproved external action repository "
                                f"'{repo}' in {rel_path}"
                            )

                        if not FULL_SHA_REGEX.match(ref):
                            raise ValueError(
                                f"External action '{uses}' in {rel_path} "
                                f"requires a full 40-character commit SHA "
                                f"(got '{ref}')"
                            )

                        total_action_uses += 1

                        with_block = step.get("with")
                        if with_block is not None:
                            if not isinstance(with_block, dict):
                                raise ValueError(
                                    f"Step {step_idx} in job '{job_id}' of {rel_path} "
                                    "'with' must be a mapping"
                                )
                            allowed_inputs = ALLOWED_ACTION_INPUTS.get(repo, set())
                            for input_key in with_block.keys():
                                if input_key not in allowed_inputs:
                                    raise ValueError(
                                        f"Unapproved action input '{input_key}' "
                                        f"for '{repo}' in job '{job_id}' of {rel_path}"
                                    )

                        if repo == "actions/checkout":
                            total_checkout_steps += 1
                            if not isinstance(with_block, dict):
                                raise ValueError(
                                    f"Checkout step in job '{job_id}' of "
                                    f"{rel_path} missing 'with' block; "
                                    f"must configure checkout credential "
                                    f"persistence to false ('persist-credentials: false')"
                                )

                            persist = with_block.get("persist-credentials")
                            if persist is not False:
                                raise ValueError(
                                    f"Checkout step in job '{job_id}' of "
                                    f"{rel_path} must configure checkout "
                                    f"credential persistence to false "
                                    f"('persist-credentials: false', got {persist!r})"
                                )

                            if "fetch-depth" in with_block and with_block["fetch-depth"] != 0:
                                raise ValueError(
                                    f"Checkout step in job '{job_id}' of "
                                    f"{rel_path} must specify 'fetch-depth: 0', "
                                    f"got {with_block['fetch-depth']!r}"
                                )

    return {
        "workflows": len(workflow_files),
        "external_action_uses": total_action_uses,
        "checkout_steps": total_checkout_steps,
        "allowed_action_repositories": len(ALLOWED_EXTERNAL_ACTIONS),
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Validate CI workflow supply-chain governance policies."
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=ROOT,
        help="Repository root directory",
    )
    args = parser.parse_args()

    try:
        result = validate(args.root)
    except (
        ValueError,
        OSError,
        TypeError,
        KeyError,
        json.JSONDecodeError,
        yaml.YAMLError,
    ) as error:
        parser.exit(1, f"FAIL: {error}\n")

    print(
        "PASS (CI supply-chain validation only):\n"
        + json.dumps(result, indent=2)
    )


if __name__ == "__main__":
    main()
