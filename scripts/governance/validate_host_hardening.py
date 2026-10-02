"""Validate CP-006C host hardening policy and launcher invariants."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import yaml


ROOT = (
    Path(__file__)
    .resolve()
    .parents[2]
)

HOST_POLICY = (
    ".agents/gateway/"
    "host-policy.yaml"
)

SESSION_SCHEMA = (
    ".agents/gateway/"
    "session.schema.json"
)

WORKSPACE = (
    "tools/engineering_gateway/"
    "workspace.py"
)

LAUNCHER = (
    "tools/engineering_gateway/"
    "launch.py"
)

GATEWAY = (
    "tools/engineering_gateway/"
    "gateway.py"
)

SECRET_NAMES = {
    "OPENAI_API_KEY",
    "OPENAI_ADMIN_KEY",
    "CODEX_API_KEY",
    "GITHUB_TOKEN",
    "GH_TOKEN",
    "DATABASE_URL",
    "DIRECT_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_ACCESS_TOKEN",
    "VERCEL_TOKEN",
    "GOOGLE_APPLICATION_CREDENTIALS",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
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


def validate(
    root:
        Path = ROOT,
) -> dict[str, Any]:
    root = Path(
        root
    ).resolve()

    policy = load_yaml(
        root,
        HOST_POLICY,
    )

    schema = load_json(
        root,
        SESSION_SCHEMA,
    )

    require(
        policy.get(
            "schema_version"
        )
        == 1,
        (
            "Invalid host-policy "
            "schema version"
        ),
    )

    profiles = policy.get(
        "profiles"
    )

    require(
        isinstance(
            profiles,
            dict,
        ),
        (
            "Missing host profiles"
        ),
    )

    require(
        profiles.get(
            "development-workstation",
            {},
        ).get(
            "state"
        )
        == "ACTIVE",
        (
            "development-workstation "
            "must remain ACTIVE"
        ),
    )

    require(
        profiles.get(
            "privileged-runner",
            {},
        ).get(
            "state"
        )
        == "DISABLED",
        (
            "privileged-runner must "
            "remain DISABLED in CP-006C"
        ),
    )

    for (
        profile_name,
        profile,
    ) in profiles.items():
        require(
            profile.get(
                "remote_mutation_enabled"
            )
            is False,
            (
                "Remote mutation must "
                "remain disabled: "
                f"{profile_name}"
            ),
        )

        require(
            profile.get(
                "production_execution_enabled"
            )
            is False,
            (
                "Production execution "
                "must remain disabled: "
                f"{profile_name}"
            ),
        )

    session = policy.get(
        "session"
    )

    require(
        isinstance(
            session,
            dict,
        ),
        (
            "Missing session "
            "hardening policy"
        ),
    )

    ttl = session.get(
        "ttl_seconds"
    )

    require(
        isinstance(
            ttl,
            int,
        )
        and 60
        <= ttl
        <= 43200,
        (
            "Session TTL must be "
            "between 60 seconds "
            "and 12 hours"
        ),
    )

    require(
        session.get(
            "require_outside_repository"
        )
        is True,
        (
            "Trusted sessions must "
            "remain outside repository"
        ),
    )

    require(
        session.get(
            "remove_on_exit"
        )
        is True,
        (
            "Trusted sessions must "
            "be removed on normal exit"
        ),
    )

    workspace = policy.get(
        "workspace"
    )

    require(
        isinstance(
            workspace,
            dict,
        ),
        (
            "Missing workspace policy"
        ),
    )

    require(
        workspace.get(
            "one_active_session_per_workspace"
        )
        is True,
        (
            "One active governed "
            "session per workspace "
            "must remain enforced"
        ),
    )

    roles = workspace.get(
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
        == {
            "planner",
            "engineer",
            "auditor",
            "qa",
            "release-operator",
        },
        (
            "Host policy must contain "
            "exactly canonical "
            "engineering roles"
        ),
    )

    require(
        roles[
            "engineer"
        ].get(
            "require_clean_start"
        )
        is True
        and roles[
            "engineer"
        ].get(
            "require_non_main_branch"
        )
        is True,
        (
            "Engineer must start "
            "clean on a named "
            "non-main branch"
        ),
    )

    require(
        roles[
            "release-operator"
        ].get(
            "require_clean_start"
        )
        is True
        and roles[
            "release-operator"
        ].get(
            "require_non_main_branch"
        )
        is True,
        (
            "Release Operator must "
            "start clean on a named "
            "non-main branch"
        ),
    )

    provider_environment = (
        policy.get(
            "provider_environment"
        )
    )

    require(
        isinstance(
            provider_environment,
            dict,
        ),
        (
            "Missing provider "
            "env policy"
        ),
    )

    require(
        provider_environment.get(
            "strategy"
        )
        == "ALLOWLIST",
        (
            "Provider environment "
            "must use ALLOWLIST strategy"
        ),
    )

    allowed = set(
        provider_environment.get(
            "allow",
            [],
        )
    )

    leaked = (
        allowed
        & SECRET_NAMES
    )

    require(
        not leaked,
        (
            "Raw secret-bearing "
            "environment variables "
            "leaked into provider "
            "allowlist: "
            f"{sorted(leaked)}"
        ),
    )

    kill_switch = policy.get(
        "kill_switch"
    )

    require(
        isinstance(
            kill_switch,
            dict,
        ),
        (
            "Missing kill-switch policy"
        ),
    )

    require(
        set(
            kill_switch.get(
                "allowed_states",
                [],
            )
        )
        == {
            "ENABLED",
            "DISABLED",
        },
        (
            "Kill-switch states drifted"
        ),
    )

    require(
        kill_switch.get(
            "absent_means"
        )
        == "ENABLED",
        (
            "Unexpected kill-switch "
            "default"
        ),
    )

    required = set(
        schema.get(
            "required",
            [],
        )
    )

    require(
        {
            "host_profile",
            "created_at",
            "expires_at",
            "workspace",
        }
        <= required,
        (
            "Gateway session schema "
            "lacks CP-006C fields"
        ),
    )

    workspace_text = (
        local_file(
            root,
            WORKSPACE,
        )
        .read_text(
            encoding="utf-8"
        )
    )

    require(
        "bisnishub-workspace-fingerprint-v2"
        in workspace_text,
        (
            "Workspace helper must declare "
            "versioned fingerprint algorithm "
            "bisnishub-workspace-fingerprint-v2"
        ),
    )

    for marker in (
        "os.fsdecode",
        "os.fsencode",
        "split(b\"\\0\")",
        "Unsupported untracked filesystem entry",
    ):
        require(
            marker in workspace_text,
            (
                "Workspace helper missing "
                f"hardening marker: {marker}"
            ),
        )

    launcher_text = (
        local_file(
            root,
            LAUNCHER,
        )
        .read_text(
            encoding="utf-8"
        )
    )

    gateway_text = (
        local_file(
            root,
            GATEWAY,
        )
        .read_text(
            encoding="utf-8"
        )
    )

    require(
        "workspace_state" in launcher_text
        and (
            "tools.engineering_gateway.workspace"
            in launcher_text
            or "from workspace import"
            in launcher_text
        ),
        (
            "Launcher must use shared "
            "workspace helper"
        ),
    )

    require(
        "workspace_state" in gateway_text
        and (
            "tools.engineering_gateway.workspace"
            in gateway_text
            or "from workspace import"
            in gateway_text
        ),
        (
            "Gateway must use shared "
            "workspace helper"
        ),
    )

    for marker in (
        "acquire_workspace_lock",
        "enforce_kill_switch",
        "safe_provider_environment",
        "require_non_main_branch",
        "expires_at",
    ):
        require(
            marker
            in launcher_text,
            (
                "Launcher hardening "
                "marker missing: "
                f"{marker}"
            ),
        )

    for marker in (
        "_assert_session_fresh",
        "_assert_session_binding",
        "workspace_dirty_fingerprint",
    ):
        require(
            marker
            in gateway_text,
            (
                "Gateway hardening "
                "marker missing: "
                f"{marker}"
            ),
        )

    return {
        "host_profile":
            "development-workstation",

        "session_ttl_seconds":
            ttl,

        "one_active_session_per_workspace":
            True,

        "privileged_runner":
            "DISABLED",

        "remote_mutation":
            False,

        "production_execution":
            False,

        "provider_secret_env_forwarding":
            False,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description=__doc__,
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
            "(CP-006C host-hardening "
            "structural validation only): "
            + json.dumps(
                result
            )
        )
    )


if __name__ == "__main__":
    main()
