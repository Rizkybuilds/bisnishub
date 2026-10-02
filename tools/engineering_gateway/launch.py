"""Launch a governed BisnisHub engineering runtime session.

The launcher creates an ephemeral trusted session outside the repository,
binds one engineering principal to one active role, enforces host-policy
preconditions, and launches Codex or Antigravity with a narrow environment.

This is a local host trust boundary. It is not cryptographic workload identity.
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import shutil
import subprocess
import sys
import uuid
from pathlib import Path
from typing import Any

import yaml

try:
    from tools.engineering_gateway.workspace import (
        workspace_dirty_fingerprint,
        workspace_state,
    )
except ModuleNotFoundError:
    from workspace import (  # type: ignore
        workspace_dirty_fingerprint,
        workspace_state,
    )


ROLE_IDS = {
    "planner",
    "engineer",
    "auditor",
    "qa",
    "release-operator",
}

RISK_LEVELS = {
    "R0",
    "R1",
    "R2",
    "R3",
    "R4",
    "R5",
    "UNKNOWN",
}

PROVIDERS = {
    "codex": {
        "principal_id":
            "engineering.runtime.primary",

        "adapter_id":
            "codex",

        "executable":
            "codex",
    },

    "antigravity": {
        "principal_id":
            "engineering.runtime.orchestrator",

        "adapter_id":
            "antigravity",

        "executable":
            "agy",
    },
}

SESSION_ENV = (
    "BISNISHUB_ENGINEERING_GATEWAY_SESSION"
)

STATE_HOME_ENV = (
    "BISNISHUB_STATE_HOME"
)


def require(
    condition: bool,
    message: str,
) -> None:
    if not condition:
        raise ValueError(
            message
        )


def utc_now() -> dt.datetime:
    return (
        dt.datetime.now(
            dt.timezone.utc
        )
        .replace(
            microsecond=0
        )
    )


def iso8601(
    value: dt.datetime,
) -> str:
    return (
        value
        .astimezone(
            dt.timezone.utc
        )
        .isoformat()
        .replace(
            "+00:00",
            "Z",
        )
    )


def load_yaml(
    path: Path,
) -> dict[str, Any]:
    value = yaml.safe_load(
        path.read_text(
            encoding="utf-8"
        )
    )

    require(
        isinstance(
            value,
            dict,
        ),
        (
            "Expected YAML mapping: "
            f"{path}"
        ),
    )

    return value


def load_json(
    path: Path,
) -> dict[str, Any]:
    value = json.loads(
        path.read_text(
            encoding="utf-8"
        )
    )

    require(
        isinstance(
            value,
            dict,
        ),
        (
            "Expected JSON object: "
            f"{path}"
        ),
    )

    return value


def run_git(
    root: Path,
    *args: str,
) -> str:
    result = subprocess.run(
        [
            "git",
            "-C",
            str(
                root
            ),
            *args,
        ],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )

    require(
        result.returncode
        == 0,
        (
            "Git command failed: "
            + " ".join(
                [
                    "git",
                    "-C",
                    str(
                        root
                    ),
                    *args,
                ]
            )
            + "\n"
            + result.stderr.strip()
        ),
    )

    return (
        result.stdout
        .strip()
    )


def repository_root(
    start: Path,
) -> Path:
    result = subprocess.run(
        [
            "git",
            "-C",
            str(
                start
            ),
            "rev-parse",
            "--show-toplevel",
        ],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )

    require(
        result.returncode
        == 0,
        (
            "Not inside a Git "
            f"repository: {start}"
        ),
    )

    return (
        Path(
            result.stdout.strip()
        )
        .resolve()
    )


def state_home() -> Path:
    configured = os.environ.get(
        STATE_HOME_ENV
    )

    if configured:
        return (
            Path(
                configured
            )
            .expanduser()
            .resolve()
        )

    return (
        Path.home()
        / ".bisnishub"
    ).resolve()


def secure_directory(
    path: Path,
) -> None:
    path.mkdir(
        parents=True,
        exist_ok=True,
    )

    if os.name != "nt":
        os.chmod(
            path,
            0o700,
        )


def write_private_json(
    path: Path,
    value: dict[str, Any],
) -> None:
    temporary = (
        path.with_suffix(
            path.suffix
            + ".tmp"
        )
    )

    temporary.write_text(
        json.dumps(
            value,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    if os.name != "nt":
        os.chmod(
            temporary,
            0o600,
        )

    os.replace(
        temporary,
        path,
    )

    if os.name != "nt":
        os.chmod(
            path,
            0o600,
        )


def principal_index(
    registry: dict[str, Any],
) -> dict[
    str,
    dict[str, Any],
]:
    entries = registry.get(
        "principals"
    )

    require(
        isinstance(
            entries,
            list,
        ),
        (
            "Principal registry has "
            "no principals list"
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
            (
                "Invalid principal "
                "entry"
            ),
        )

        principal_id = item.get(
            "id"
        )

        require(
            isinstance(
                principal_id,
                str,
            )
            and principal_id,
            (
                "Principal missing id"
            ),
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


def resolve_principal(
    provider: str,
    role: str,
    registry: dict[str, Any],
) -> tuple[
    dict[str, Any],
    dict[str, Any],
]:
    provider_definition = (
        PROVIDERS[
            provider
        ]
    )

    principals = (
        principal_index(
            registry
        )
    )

    principal_id = (
        provider_definition[
            "principal_id"
        ]
    )

    principal = principals.get(
        principal_id
    )

    require(
        principal
        is not None,
        (
            "Provider principal "
            "not registered: "
            f"{principal_id}"
        ),
    )

    require(
        principal.get(
            "state"
        )
        == "ACTIVE",
        (
            "Principal not ACTIVE: "
            f"{principal_id}"
        ),
    )

    binding = principal.get(
        "runtime_binding"
    )

    require(
        isinstance(
            binding,
            dict,
        ),
        (
            "Principal runtime "
            "binding missing: "
            f"{principal_id}"
        ),
    )

    require(
        binding.get(
            "adapter_id"
        )
        == provider_definition[
            "adapter_id"
        ],
        (
            "Provider/principal "
            "adapter binding mismatch"
        ),
    )

    require(
        role
        in set(
            principal.get(
                "allowed_roles",
                [],
            )
        ),
        (
            "Role not allowed: "
            f"{role}"
        ),
    )

    return (
        provider_definition,
        principal,
    )


def check_workspace_policy(
    role: str,
    state: dict[str, Any],
    policy: dict[str, Any],
) -> None:
    workspace_policy = (
        policy[
            "workspace"
        ]
    )

    role_policy = (
        workspace_policy[
            "roles"
        ][
            role
        ]
    )

    main_branches = set(
        workspace_policy.get(
            "main_branches",
            [
                "main"
            ],
        )
    )

    if role_policy.get(
        "require_clean_start",
        False,
    ):
        require(
            not state[
                "dirty"
            ],
            (
                f"{role} requires "
                "a clean worktree "
                "at session start"
            ),
        )

    if role_policy.get(
        "require_non_main_branch",
        False,
    ):
        require(
            (
                state[
                    "branch"
                ]
                not in main_branches
            )
            and (
                state[
                    "branch"
                ]
                != "HEAD"
            ),
            (
                f"{role} requires "
                "a named non-main "
                "branch/worktree"
            ),
        )


def kill_switch_path(
    home: Path,
    policy: dict[str, Any],
) -> Path:
    relative = (
        policy[
            "kill_switch"
        ][
            "relative_path"
        ]
    )

    return (
        home
        / relative
    ).resolve()


def enforce_kill_switch(
    home: Path,
    policy: dict[str, Any],
) -> None:
    path = kill_switch_path(
        home,
        policy,
    )

    if not path.exists():
        return

    value = load_json(
        path
    )

    state = value.get(
        "state"
    )

    require(
        state != "DISABLED",
        (
            "Engineering AI execution "
            "kill switch is DISABLED"
            + (
                ": "
                + str(
                    value.get(
                        "reason"
                    )
                )
                if value.get(
                    "reason"
                )
                else ""
            )
        ),
    )

    require(
        state == "ENABLED",
        (
            "Unknown kill-switch "
            f"state: {state}"
        ),
    )


def lock_path(
    home: Path,
    root: Path,
    policy: dict[str, Any],
) -> Path:
    digest = (
        hashlib.sha256(
            str(
                root
            ).encode(
                "utf-8"
            )
        )
        .hexdigest()[
            :24
        ]
    )

    relative = (
        policy[
            "workspace"
        ][
            "lock_directory"
        ]
    )

    directory = (
        home
        / relative
    ).resolve()

    secure_directory(
        directory
    )

    return (
        directory
        / f"{digest}.lock.json"
    )


def acquire_workspace_lock(
    home: Path,
    root: Path,
    session_id: str,
    role: str,
    policy: dict[str, Any],
) -> Path:
    path = lock_path(
        home,
        root,
        policy,
    )

    payload = {
        "schema_version":
            1,

        "session_id":
            session_id,

        "workspace":
            str(
                root
            ),

        "role":
            role,

        "pid":
            os.getpid(),

        "created_at":
            iso8601(
                utc_now()
            ),
    }

    flags = (
        os.O_WRONLY
        | os.O_CREAT
        | os.O_EXCL
    )

    try:
        descriptor = os.open(
            path,
            flags,
            0o600,
        )

    except FileExistsError as error:
        raise ValueError(
            (
                "Workspace already has "
                "an active/stale governed-"
                "session lock: "
                f"{path}"
            )
        ) from error

    try:
        with os.fdopen(
            descriptor,
            "w",
            encoding="utf-8",
        ) as handle:
            json.dump(
                payload,
                handle,
                indent=2,
            )

            handle.write(
                "\n"
            )

    except Exception:
        path.unlink(
            missing_ok=True
        )

        raise

    return path


def release_workspace_lock(
    path: Path | None,
) -> None:
    if path is not None:
        path.unlink(
            missing_ok=True
        )


def safe_provider_environment(
    policy: dict[str, Any],
    session_path: Path,
) -> dict[str, str]:
    allowed = (
        policy[
            "provider_environment"
        ][
            "allow"
        ]
    )

    require(
        isinstance(
            allowed,
            list,
        ),
        (
            "Host policy provider "
            "env allowlist must be list"
        ),
    )

    env: dict[
        str,
        str,
    ] = {}

    for key in allowed:
        value = os.environ.get(
            key
        )

        if value is not None:
            env[
                key
            ] = value

    env[
        SESSION_ENV
    ] = str(
        session_path
    )

    return env


def load_approval(
    path: Path | None,
) -> dict[str, Any] | None:
    if path is None:
        return None

    raise ValueError(
        "Trusted approval evidence "
        "verification is not implemented; "
        "--approval-file cannot "
        "authorize governed execution."
    )


def validate_extra_args(
    provider: str,
    values: list[str],
) -> None:
    lowered = [
        value.lower()
        for value
        in values
    ]

    joined = " ".join(
        lowered
    )

    if provider == "antigravity":
        require(
            (
                "--dangerously-skip-permissions"
                not in lowered
            ),
            (
                "Governed Antigravity "
                "sessions cannot use "
                "--dangerously-skip-permissions"
            ),
        )

    if provider == "codex":
        forbidden = (
            (
                "--dangerously-bypass-"
                "approvals-and-sandbox"
            ),
            "danger-full-access",
            "--full-auto",
            "--ask-for-approval=never",
            "--ask-for-approval never",
        )

        for fragment in forbidden:
            require(
                fragment
                not in joined,
                (
                    "Unsafe Codex "
                    "override rejected: "
                    f"{fragment}"
                ),
            )

        require(
            not (
                "approval_policy"
                in joined
                and "never"
                in joined
            ),
            (
                "Unsafe Codex "
                "approval_policy=never "
                "override rejected"
            ),
        )

        require(
            not (
                "approvals_reviewer"
                in joined
                and "auto_review"
                in joined
            ),
            (
                "Unsafe Codex "
                "auto-review override "
                "rejected"
            ),
        )


def build_provider_command(
    provider: str,
    extra_args: list[str],
) -> list[str]:
    values = list(
        extra_args
    )

    if (
        values
        and values[
            0
        ]
        == "--"
    ):
        values = values[
            1:
        ]

    validate_extra_args(
        provider,
        values,
    )

    executable = (
        PROVIDERS[
            provider
        ][
            "executable"
        ]
    )

    if (
        provider
        == "antigravity"
        and "--sandbox"
        not in values
    ):
        values = [
            "--sandbox",
            *values,
        ]

    return [
        executable,
        *values,
    ]


def build_session(
    *,
    provider: str,
    role: str,
    risk: str,
    work_package_ref:
        str
        | None,
    acceptance_ref:
        str
        | None,
    approval:
        dict[str, Any]
        | None,
    session_id: str,
    principal_registry:
        dict[str, Any],
    workspace:
        dict[str, Any],
    host_policy:
        dict[str, Any],
) -> dict[str, Any]:
    (
        provider_definition,
        principal,
    ) = resolve_principal(
        provider,
        role,
        principal_registry,
    )

    require(
        risk
        in RISK_LEVELS,
        (
            "Invalid risk: "
            f"{risk}"
        ),
    )

    if role == "engineer":
        require(
            bool(
                work_package_ref
            ),
            (
                "Engineer sessions "
                "require "
                "--work-package-ref"
            ),
        )

    if role == "qa":
        require(
            bool(
                acceptance_ref
            ),
            (
                "QA sessions require "
                "--acceptance-ref"
            ),
        )

    started = utc_now()

    ttl_seconds = int(
        host_policy[
            "session"
        ][
            "ttl_seconds"
        ]
    )

    expires = (
        started
        + dt.timedelta(
            seconds=
                ttl_seconds
        )
    )

    return {
        "schema_version":
            1,

        "host_profile":
            "development-workstation",

        "principal_attestation": {
            "schema_version":
                1,

            "principal_id":
                principal[
                    "id"
                ],

            "adapter_id":
                provider_definition[
                    "adapter_id"
                ],

            "verified":
                True,

            "issued_at":
                iso8601(
                    started
                ),

            "session_id":
                session_id,

            "evidence_ref":
                (
                    "trusted-launcher://"
                    + session_id
                ),
        },

        "role":
            role,

        "declared_risk":
            risk,

        "created_at":
            iso8601(
                started
            ),

        "expires_at":
            iso8601(
                expires
            ),

        "workspace":
            workspace,

        "work_package_ref":
            work_package_ref,

        "acceptance_ref":
            acceptance_ref,

        "approval":
            approval,

        "host": {
            "tool_available":
                True,

            "permission_state":
                "ALLOW",
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__,
    )

    parser.add_argument(
        "provider",
        choices=sorted(
            PROVIDERS
        ),
    )

    parser.add_argument(
        "--role",
        required=True,
        choices=sorted(
            ROLE_IDS
        ),
    )

    parser.add_argument(
        "--risk",
        required=True,
        choices=sorted(
            RISK_LEVELS
        ),
    )

    parser.add_argument(
        "--work-package-ref",
    )

    parser.add_argument(
        "--acceptance-ref",
    )

    parser.add_argument(
        "--approval-file",
        type=Path,
    )

    parser.add_argument(
        "--keep-session",
        action="store_true",
    )

    parser.add_argument(
        "provider_args",
        nargs=argparse.REMAINDER,
    )

    args = parser.parse_args()

    root = repository_root(
        Path.cwd()
    )

    principal_registry = load_yaml(
        root
        / ".agents/principals/"
        "registry.yaml"
    )

    host_policy = load_yaml(
        root
        / ".agents/gateway/"
        "host-policy.yaml"
    )

    require(
        host_policy[
            "profiles"
        ][
            "development-workstation"
        ][
            "state"
        ]
        == "ACTIVE",
        (
            "Development workstation "
            "host profile is not ACTIVE"
        ),
    )

    require(
        host_policy[
            "profiles"
        ][
            "privileged-runner"
        ][
            "state"
        ]
        == "DISABLED",
        (
            "Privileged runner must "
            "remain DISABLED in CP-006C"
        ),
    )

    current_workspace = (
        workspace_state(
            root
        )
    )

    check_workspace_policy(
        args.role,
        current_workspace,
        host_policy,
    )

    home = state_home()

    secure_directory(
        home
        / "engineering-gateway"
    )

    enforce_kill_switch(
        home,
        host_policy,
    )

    (
        provider_definition,
        _,
    ) = resolve_principal(
        args.provider,
        args.role,
        principal_registry,
    )

    executable_path = shutil.which(
        provider_definition[
            "executable"
        ]
    )

    require(
        executable_path
        is not None,
        (
            "Provider executable "
            "not found: "
            f"{provider_definition['executable']}"
        ),
    )

    command = (
        build_provider_command(
            args.provider,
            args.provider_args,
        )
    )

    approval = (
        load_approval(
            args.approval_file
        )
    )

    session_id = (
        "EGS-"
        + uuid.uuid4().hex
    )

    sessions_directory = (
        home
        / "engineering-gateway"
        / "sessions"
    )

    secure_directory(
        sessions_directory
    )

    session_path = (
        sessions_directory
        / f"{session_id}.json"
    )

    require(
        not (
            session_path
            .resolve()
            .is_relative_to(
                root.resolve()
            )
        ),
        (
            "Trusted gateway session "
            "must not live inside "
            "repository"
        ),
    )

    session = build_session(
        provider=
            args.provider,

        role=
            args.role,

        risk=
            args.risk,

        work_package_ref=
            args.work_package_ref,

        acceptance_ref=
            args.acceptance_ref,

        approval=
            approval,

        session_id=
            session_id,

        principal_registry=
            principal_registry,

        workspace=
            current_workspace,

        host_policy=
            host_policy,
    )

    write_private_json(
        session_path,
        session,
    )

    workspace_lock: (
        Path
        | None
    ) = None

    if (
        host_policy[
            "workspace"
        ].get(
            "one_active_session_per_workspace",
            True,
        )
    ):
        workspace_lock = (
            acquire_workspace_lock(
                home,
                root,
                session_id,
                args.role,
                host_policy,
            )
        )

    env = safe_provider_environment(
        host_policy,
        session_path,
    )

    print(
        json.dumps(
            {
                "session_id":
                    session_id,

                "provider":
                    args.provider,

                "principal":
                    session[
                        "principal_attestation"
                    ][
                        "principal_id"
                    ],

                "role":
                    args.role,

                "risk":
                    args.risk,

                "workspace":
                    current_workspace,

                "expires_at":
                    session[
                        "expires_at"
                    ],

                "command":
                    command,

                "session_path":
                    str(
                        session_path
                    ),
            },
            indent=2,
        ),
        flush=True,
    )

    try:
        result = subprocess.run(
            command,
            cwd=root,
            env=env,
            check=False,
        )

        return int(
            result.returncode
        )

    finally:
        release_workspace_lock(
            workspace_lock
        )

        if not args.keep_session:
            try:
                session_path.unlink(
                    missing_ok=True
                )

            except OSError as error:
                print(
                    (
                        "WARNING: failed "
                        "to remove gateway "
                        "session: "
                        f"{error}"
                    ),
                    file=sys.stderr,
                )


if __name__ == "__main__":
    try:
        raise SystemExit(
            main()
        )

    except (
        ValueError,
        OSError,
        RuntimeError,
        KeyError,
        TypeError,
    ) as error:
        print(
            f"ERROR: {error}",
            file=sys.stderr,
        )

        raise SystemExit(
            2
        )
