"""Validate the BisnisHub governed engineering gateway configuration."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import yaml
from jsonschema import (
    Draft202012Validator,
)


ROOT = (
    Path(__file__)
    .resolve()
    .parents[2]
)

PROFILES = (
    ".agents/gateway/profiles.yaml"
)

CAPABILITIES = (
    ".agents/capabilities/registry.yaml"
)

SESSION_SCHEMA = (
    ".agents/gateway/"
    "session.schema.json"
)

REQUEST_SCHEMA = (
    ".agents/capabilities/"
    "preflight-request.schema.json"
)

DECISION_SCHEMA = (
    ".agents/capabilities/"
    "preflight-decision.schema.json"
)

RECEIPT_SCHEMA = (
    ".agents/gateway/"
    "execution-receipt.schema.json"
)

GATEWAY_CORE = (
    "tools/engineering_gateway/"
    "gateway.py"
)

GATEWAY_SERVER = (
    "tools/engineering_gateway/"
    "server.py"
)

GATEWAY_REQUIREMENTS = (
    "tools/engineering_gateway/"
    "requirements.txt"
)

EXPECTED_PROFILES = {
    "governance.validate": {
        "cwd":
            ".",

        "argv": [
            "python",
            (
                "scripts/governance/"
                "validate-agent-governance.py"
            ),
        ],
    },

    "governance.tests": {
        "cwd":
            ".",

        "argv": [
            "python",
            "-m",
            "unittest",
            "discover",
            "-s",
            "scripts/governance",
            "-p",
            "test_*.py",
        ],
    },

    "mgbos.pr-scope-tests": {
        "cwd":
            ".",

        "argv": [
            "node",
            "--test",
            (
                "scripts/governance/"
                "pr-scope.test.mjs"
            ),
        ],
    },

    "mgbos.migration-immutability-tests": {
        "cwd":
            ".",

        "argv": [
            "node",
            "--test",
            (
                "scripts/governance/"
                "migration-immutability."
                "test.mjs"
            ),
        ],
    },

    "mgbos.check": {
        "cwd":
            "systems/mgbos",

        "argv": [
            "pnpm",
            "check",
        ],
    },
}


def require(
    condition: bool,
    message: str,
) -> None:
    if not condition:
        raise ValueError(
            message
        )


def local_file(
    root: Path,
    relative: str,
) -> Path:
    target = (
        root
        / relative
    ).resolve()

    require(
        target.is_relative_to(
            root.resolve()
        ),
        (
            "Path escapes repository: "
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


def local_dir(
    root: Path,
    relative: str,
) -> Path:
    target = (
        root
        / relative
    ).resolve()

    require(
        target.is_relative_to(
            root.resolve()
        ),
        (
            "Path escapes repository: "
            f"{relative}"
        ),
    )

    require(
        target.is_dir(),
        (
            "Missing directory: "
            f"{relative}"
        ),
    )

    return target


def load_yaml(
    root: Path,
    relative: str,
) -> dict[str, Any]:
    value = yaml.safe_load(
        local_file(
            root,
            relative,
        ).read_text(
            encoding="utf-8"
        )
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
    root: Path,
    relative: str,
) -> dict[str, Any]:
    value = json.loads(
        local_file(
            root,
            relative,
        ).read_text(
            encoding="utf-8"
        )
    )

    require(
        isinstance(
            value,
            dict,
        ),
        (
            "Invalid JSON object: "
            f"{relative}"
        ),
    )

    return value


def capability_index(
    catalog: dict[str, Any],
) -> dict[
    str,
    dict[str, Any],
]:
    result: dict[
        str,
        dict[str, Any],
    ] = {}

    for entry in catalog.get(
        "capabilities",
        [],
    ):
        require(
            isinstance(
                entry,
                dict,
            ),
            "Invalid capability entry",
        )

        capability_id = (
            entry.get(
                "id"
            )
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

        result[
            capability_id
        ] = entry

    return result


def validate(
    root: Path = ROOT,
) -> dict[str, Any]:
    root = Path(
        root
    ).resolve()

    profile_catalog = (
        load_yaml(
            root,
            PROFILES,
        )
    )

    capability_catalog = (
        load_yaml(
            root,
            CAPABILITIES,
        )
    )

    capabilities = (
        capability_index(
            capability_catalog
        )
    )

    require(
        profile_catalog.get(
            "schema_version"
        )
        == 1,
        (
            "Invalid gateway profile "
            "schema version"
        ),
    )

    principles = (
        profile_catalog.get(
            "principles"
        )
    )

    require(
        isinstance(
            principles,
            dict,
        ),
        "Missing gateway principles",
    )

    require(
        principles.get(
            "raw_shell_exposed"
        )
        is False,
        (
            "Gateway must not expose "
            "raw shell"
        ),
    )

    require(
        principles.get(
            "arbitrary_argv_allowed"
        )
        is False,
        (
            "Gateway must not allow "
            "arbitrary argv"
        ),
    )

    require(
        principles.get(
            "remote_mutation_profiles_enabled"
        )
        is False,
        (
            "Remote mutation profiles "
            "must remain disabled in v1"
        ),
    )

    require(
        principles.get(
            "production_profiles_enabled"
        )
        is False,
        (
            "Production profiles must "
            "remain disabled in v1"
        ),
    )

    require(
        principles.get(
            "fixed_profiles_only"
        )
        is True,
        (
            "Gateway v1 must remain "
            "fixed-profile only"
        ),
    )

    execution = (
        profile_catalog.get(
            "execution"
        )
    )

    require(
        isinstance(
            execution,
            dict,
        ),
        (
            "Missing gateway "
            "execution config"
        ),
    )

    require(
        execution.get(
            "shell"
        )
        is False,
        (
            "Gateway execution must "
            "keep shell=false"
        ),
    )

    require(
        execution.get(
            "output_root"
        )
        == ".agent-gateway-runs",
        (
            "Unexpected gateway "
            "output root"
        ),
    )

    profiles = (
        profile_catalog.get(
            "profiles"
        )
    )

    require(
        isinstance(
            profiles,
            list,
        )
        and profiles,
        "Gateway profiles missing",
    )

    by_id: dict[
        str,
        dict[str, Any],
    ] = {}

    for profile in profiles:
        require(
            isinstance(
                profile,
                dict,
            ),
            (
                "Invalid gateway "
                "profile"
            ),
        )

        profile_id = (
            profile.get(
                "id"
            )
        )

        require(
            isinstance(
                profile_id,
                str,
            ),
            (
                "Gateway profile "
                "missing id"
            ),
        )

        require(
            profile_id
            not in by_id,
            (
                "Duplicate gateway "
                f"profile: {profile_id}"
            ),
        )

        by_id[
            profile_id
        ] = profile

        require(
            profile.get(
                "version"
            )
            == "1.0",
            (
                "Unexpected profile "
                f"version: {profile_id}"
            ),
        )

        require(
            profile.get(
                "capability"
            )
            == (
                "engineering."
                "check.local.execute"
            ),
            (
                "V1 profile uses "
                "unsupported capability: "
                f"{profile_id}"
            ),
        )

        require(
            profile.get(
                "environment"
            )
            == "repository-local",
            (
                "V1 profile uses "
                "unsupported environment: "
                f"{profile_id}"
            ),
        )

        require(
            profile.get(
                "non_destructive"
            )
            is True,
            (
                "V1 gateway profile "
                "must be non-destructive: "
                f"{profile_id}"
            ),
        )

        cwd = profile.get(
            "cwd"
        )

        require(
            isinstance(
                cwd,
                str,
            ),
            (
                "Profile cwd missing: "
                f"{profile_id}"
            ),
        )

        local_dir(
            root,
            cwd,
        )

        argv = profile.get(
            "argv"
        )

        require(
            isinstance(
                argv,
                list,
            )
            and argv
            and all(
                isinstance(
                    item,
                    str,
                )
                and item
                for item
                in argv
            ),
            (
                "Invalid argv: "
                f"{profile_id}"
            ),
        )

        require(
            (
                "--dangerously-skip-permissions"
                not in argv
            ),
            (
                "Dangerous permission "
                "bypass in profile: "
                f"{profile_id}"
            ),
        )

        require(
            (
                "--prod"
                not in argv
            )
            and (
                "--production"
                not in argv
            ),
            (
                "Production flag in "
                "gateway profile: "
                f"{profile_id}"
            ),
        )

        timeout = profile.get(
            "timeout_seconds"
        )

        require(
            isinstance(
                timeout,
                int,
            )
            and 1
            <= timeout
            <= 1800,
            (
                "Invalid timeout: "
                f"{profile_id}"
            ),
        )

        conditions = (
            profile.get(
                "conditions_by_role"
            )
        )

        require(
            isinstance(
                conditions,
                dict,
            ),
            (
                "Missing role conditions: "
                f"{profile_id}"
            ),
        )

        require(
            set(
                conditions
            )
            == {
                "engineer",
                "qa",
            },
            (
                "V1 profile must define "
                "engineer and qa "
                "conditions only: "
                f"{profile_id}"
            ),
        )

    require(
        set(
            by_id
        )
        == set(
            EXPECTED_PROFILES
        ),
        (
            "Gateway v1 profile set "
            "drifted from approved "
            "fixed profiles"
        ),
    )

    for (
        profile_id,
        expected,
    ) in (
        EXPECTED_PROFILES.items()
    ):
        profile = by_id[
            profile_id
        ]

        require(
            profile[
                "cwd"
            ]
            == expected[
                "cwd"
            ],
            (
                "Gateway cwd drift: "
                f"{profile_id}"
            ),
        )

        require(
            profile[
                "argv"
            ]
            == expected[
                "argv"
            ],
            (
                "Gateway command drift: "
                f"{profile_id}"
            ),
        )

    capability = capabilities.get(
        (
            "engineering."
            "check.local.execute"
        )
    )

    require(
        capability
        is not None,
        (
            "Missing engineering."
            "check.local.execute "
            "capability"
        ),
    )

    require(
        capability.get(
            "disposition"
        )
        == "ACTIVE",
        (
            "Gateway check capability "
            "must be ACTIVE"
        ),
    )

    require(
        "repository-local"
        in capability.get(
            "supported_environments",
            [],
        ),
        (
            "Gateway check capability "
            "must support "
            "repository-local"
        ),
    )

    for schema_path in (
        SESSION_SCHEMA,
        REQUEST_SCHEMA,
        DECISION_SCHEMA,
        RECEIPT_SCHEMA,
    ):
        schema = load_json(
            root,
            schema_path,
        )

        Draft202012Validator.check_schema(
            schema
        )

    local_file(
        root,
        GATEWAY_CORE,
    )

    local_file(
        root,
        GATEWAY_SERVER,
    )

    requirements = (
        local_file(
            root,
            GATEWAY_REQUIREMENTS,
        )
        .read_text(
            encoding="utf-8"
        )
        .splitlines()
    )

    require(
        "mcp==2.2.0"
        in requirements,
        (
            "Gateway must pin MCP "
            "Python SDK 2.2.0"
        ),
    )

    require(
        "PyYAML==6.0.3"
        in requirements,
        (
            "Gateway must pin "
            "PyYAML 6.0.3"
        ),
    )

    require(
        "jsonschema==4.26.0"
        in requirements,
        (
            "Gateway must pin "
            "jsonschema 4.26.0"
        ),
    )

    return {
        "profiles":
            len(
                by_id
            ),

        "remote_mutation_profiles":
            0,

        "production_profiles":
            0,

        "raw_shell_exposed":
            False,
    }


def main() -> None:
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
        (
            "PASS "
            "(engineering gateway "
            "structural validation only): "
            + json.dumps(
                result
            )
        )
    )


if __name__ == "__main__":
    main()