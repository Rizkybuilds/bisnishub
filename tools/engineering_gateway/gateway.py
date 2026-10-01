"""BisnisHub governed engineering gateway core.

The gateway exposes only pre-registered execution profiles. It performs a
policy preflight before dispatch, executes without a shell, captures evidence,
and returns an execution receipt. V1 intentionally supports only local check
profiles; remote GitHub, deployment, and remote database mutation are not
implemented here.
"""

from __future__ import annotations

import datetime as dt
import hashlib
import importlib.util
import json
import os
import subprocess
import uuid
from pathlib import Path
from typing import Any

import yaml
from jsonschema import (
    Draft202012Validator,
    FormatChecker,
)


DEFAULT_ROOT = (
    Path(__file__)
    .resolve()
    .parents[2]
)

DEFAULT_PROFILES = (
    ".agents/gateway/profiles.yaml"
)

DEFAULT_SESSION_SCHEMA = (
    ".agents/gateway/"
    "session.schema.json"
)

DEFAULT_REQUEST_SCHEMA = (
    ".agents/capabilities/"
    "preflight-request.schema.json"
)

DEFAULT_DECISION_SCHEMA = (
    ".agents/capabilities/"
    "preflight-decision.schema.json"
)

DEFAULT_RECEIPT_SCHEMA = (
    ".agents/gateway/"
    "execution-receipt.schema.json"
)

DEFAULT_OUTPUT_ROOT = (
    ".agent-gateway-runs"
)

SAFE_ENVIRONMENT_KEYS = {
    "PATH",
    "HOME",
    "USERPROFILE",
    "SYSTEMROOT",
    "COMSPEC",
    "TEMP",
    "TMP",
    "TMPDIR",
    "LANG",
    "LC_ALL",
    "TERM",
    "PNPM_HOME",
}


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


def parse_timestamp(
    value: str,
) -> dt.datetime:
    require(
        isinstance(
            value,
            str,
        )
        and value.strip(),
        "Missing timestamp",
    )

    parsed = (
        dt.datetime
        .fromisoformat(
            value.replace(
                "Z",
                "+00:00",
            )
        )
    )

    require(
        parsed.tzinfo
        is not None,
        (
            "Timestamp lacks "
            f"timezone: {value}"
        ),
    )

    return (
        parsed.astimezone(
            dt.timezone.utc
        )
    )


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


def validate_json(
    schema: dict[str, Any],
    value: dict[str, Any],
    label: str,
) -> None:
    validator = (
        Draft202012Validator(
            schema,
            format_checker=
                FormatChecker(),
        )
    )

    errors = sorted(
        validator.iter_errors(
            value
        ),
        key=lambda error:
            tuple(
                str(
                    part
                )
                for part
                in error.absolute_path
            ),
    )

    if errors:
        error = errors[
            0
        ]

        path = (
            ".".join(
                str(
                    part
                )
                for part
                in error.absolute_path
            )
            or "$"
        )

        raise ValueError(
            (
                f"{label} schema "
                "validation failed "
                f"at {path}: "
                f"{error.message}"
            )
        )


def load_resolver(
    root: Path,
):
    resolver_path = (
        root
        / "scripts/governance/"
        "resolve_engineering_permission.py"
    )

    require(
        resolver_path.is_file(),
        (
            "Missing permission "
            f"resolver: {resolver_path}"
        ),
    )

    spec = (
        importlib.util
        .spec_from_file_location(
            (
                "bisnishub_"
                "engineering_permission_"
                "resolver"
            ),
            resolver_path,
        )
    )

    require(
        spec is not None
        and spec.loader
        is not None,
        (
            "Unable to load "
            "permission resolver"
        ),
    )

    module = (
        importlib.util
        .module_from_spec(
            spec
        )
    )

    spec.loader.exec_module(
        module
    )

    require(
        hasattr(
            module,
            "resolve",
        ),
        (
            "Permission resolver "
            "lacks resolve()"
        ),
    )

    return module


def minimal_environment() -> dict[
    str,
    str,
]:
    env: dict[
        str,
        str,
    ] = {}

    for key in (
        SAFE_ENVIRONMENT_KEYS
    ):
        value = os.environ.get(
            key
        )

        if value is not None:
            env[
                key
            ] = value

    env[
        "NO_COLOR"
    ] = "1"

    return env


def normalize_repo_relative(
    root: Path,
    relative: str,
) -> Path:
    require(
        isinstance(
            relative,
            str,
        )
        and relative.strip(),
        (
            "Missing relative path"
        ),
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
            "Path escapes repository: "
            f"{relative}"
        ),
    )

    return target


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


def workspace_dirty_fingerprint(
    root: Path,
) -> str:
    status = run_git(
        root,
        "status",
        "--porcelain=v1",
        "--untracked-files=all",
    )

    return (
        "sha256:"
        + hashlib.sha256(
            status.encode(
                "utf-8"
            )
        ).hexdigest()
    )


def current_workspace_state(
    root: Path,
) -> dict[str, Any]:
    head = run_git(
        root,
        "rev-parse",
        "HEAD",
    )

    branch = run_git(
        root,
        "rev-parse",
        "--abbrev-ref",
        "HEAD",
    )

    status = run_git(
        root,
        "status",
        "--porcelain=v1",
        "--untracked-files=all",
    )

    return {
        "head":
            head,

        "branch":
            branch,

        "dirty":
            bool(
                status.strip()
            ),

        "dirty_fingerprint":
            workspace_dirty_fingerprint(
                root
            ),
    }


class EngineeringGateway:
    def __init__(
        self,
        *,
        root:
            Path = DEFAULT_ROOT,
        session_path: Path,
        profiles_path:
            Path
            | None = None,
        output_root:
            Path
            | None = None,
    ) -> None:
        self.root = Path(
            root
        ).resolve()

        self.session_path = (
            Path(
                session_path
            )
            .resolve()
        )

        self.profiles_path = (
            Path(
                profiles_path
            ).resolve()
            if profiles_path
            is not None
            else self.root
            / DEFAULT_PROFILES
        )

        self.output_root = (
            Path(
                output_root
            ).resolve()
            if output_root
            is not None
            else self.root
            / DEFAULT_OUTPUT_ROOT
        )

        self.request_schema = (
            load_json(
                self.root
                / DEFAULT_REQUEST_SCHEMA
            )
        )

        self.decision_schema = (
            load_json(
                self.root
                / DEFAULT_DECISION_SCHEMA
            )
        )

        self.session_schema = (
            load_json(
                self.root
                / DEFAULT_SESSION_SCHEMA
            )
        )

        self.receipt_schema = (
            load_json(
                self.root
                / DEFAULT_RECEIPT_SCHEMA
            )
        )

        self.session = load_json(
            self.session_path
        )

        validate_json(
            self.session_schema,
            self.session,
            "gateway session",
        )

        self._assert_session_binding()
        self._assert_session_fresh()

        self.profile_catalog = (
            load_yaml(
                self.profiles_path
            )
        )

        self.profiles = (
            self._index_profiles(
                self.profile_catalog
            )
        )

        self.resolver = (
            load_resolver(
                self.root
            )
        )

    @staticmethod
    def _index_profiles(
        catalog:
            dict[str, Any],
    ) -> dict[
        str,
        dict[str, Any],
    ]:
        require(
            catalog.get(
                "schema_version"
            )
            == 1,
            (
                "Invalid gateway "
                "profile schema version"
            ),
        )

        profiles = catalog.get(
            "profiles"
        )

        require(
            isinstance(
                profiles,
                list,
            )
            and profiles,
            (
                "Gateway profiles "
                "are missing"
            ),
        )

        result: dict[
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
                )
                and profile_id.strip(),
                (
                    "Gateway profile "
                    "missing id"
                ),
            )

            require(
                profile_id
                not in result,
                (
                    "Duplicate profile: "
                    f"{profile_id}"
                ),
            )

            result[
                profile_id
            ] = profile

        return result

    def _assert_session_binding(
        self,
    ) -> None:
        require(
            self.session.get(
                "host_profile"
            )
            == "development-workstation",
            (
                "Unsupported gateway "
                "host profile"
            ),
        )

        workspace = (
            self.session.get(
                "workspace"
            )
        )

        require(
            isinstance(
                workspace,
                dict,
            ),
            (
                "Gateway session "
                "missing workspace"
            ),
        )

        session_root = (
            Path(
                workspace[
                    "path"
                ]
            )
            .resolve()
        )

        require(
            session_root
            == self.root,
            (
                "Gateway session workspace "
                "does not match server "
                "repository root"
            ),
        )

    def _assert_session_fresh(
        self,
    ) -> None:
        expires_at = (
            parse_timestamp(
                self.session[
                    "expires_at"
                ]
            )
        )

        require(
            utc_now()
            < expires_at,
            (
                "Gateway session expired "
                f"at {iso8601(expires_at)}"
            ),
        )

    def list_profiles(
        self,
    ) -> list[
        dict[str, Any]
    ]:
        self._assert_session_fresh()

        output: list[
            dict[str, Any]
        ] = []

        for profile_id in sorted(
            self.profiles
        ):
            profile = (
                self.profiles[
                    profile_id
                ]
            )

            output.append(
                {
                    "id":
                        profile_id,

                    "description":
                        profile[
                            "description"
                        ],

                    "capability":
                        profile[
                            "capability"
                        ],

                    "environment":
                        profile[
                            "environment"
                        ],

                    "cwd":
                        profile[
                            "cwd"
                        ],

                    "argv":
                        list(
                            profile[
                                "argv"
                            ]
                        ),

                    "timeout_seconds":
                        profile[
                            "timeout_seconds"
                        ],
                }
            )

        return output

    def _condition(
        self,
        condition_id: str,
        profile:
            dict[str, Any],
    ) -> dict[str, Any]:
        if (
            condition_id
            == "non-destructive-local-check"
        ):
            if (
                profile.get(
                    "non_destructive"
                )
                is True
            ):
                return {
                    "id":
                        condition_id,

                    "state":
                        "SATISFIED",

                    "evidence_ref":
                        (
                            "gateway-profile:"
                            f"{profile['id']}:"
                            "non-destructive"
                        ),
                }

            return {
                "id":
                    condition_id,

                "state":
                    "UNKNOWN",

                "evidence_ref":
                    None,
            }

        if (
            condition_id
            == "relevant-to-work-package"
        ):
            reference = (
                self.session.get(
                    "work_package_ref"
                )
            )

            return {
                "id":
                    condition_id,

                "state":
                    (
                        "SATISFIED"
                        if reference
                        else "UNKNOWN"
                    ),

                "evidence_ref":
                    reference,
            }

        if (
            condition_id
            == "relevant-to-acceptance-criteria"
        ):
            reference = (
                self.session.get(
                    "acceptance_ref"
                )
            )

            return {
                "id":
                    condition_id,

                "state":
                    (
                        "SATISFIED"
                        if reference
                        else "UNKNOWN"
                    ),

                "evidence_ref":
                    reference,
            }

        return {
            "id":
                condition_id,

            "state":
                "UNKNOWN",

            "evidence_ref":
                None,
        }

    def _required_conditions_for_profile(
        self,
        profile:
            dict[str, Any],
    ) -> list[str]:
        role = (
            self.session[
                "role"
            ]
        )

        configured = (
            profile.get(
                "conditions_by_role",
                {},
            )
        )

        conditions = (
            configured.get(
                role,
                [],
            )
        )

        require(
            isinstance(
                conditions,
                list,
            ),
            (
                "Invalid profile conditions "
                f"for role {role}"
            ),
        )

        return list(
            conditions
        )

    def build_preflight_request(
        self,
        profile_id: str,
    ) -> dict[str, Any]:
        self._assert_session_fresh()

        profile = self.profiles.get(
            profile_id
        )

        require(
            profile
            is not None,
            (
                "Unknown gateway profile: "
                f"{profile_id}"
            ),
        )

        required_conditions = (
            self
            ._required_conditions_for_profile(
                profile
            )
        )

        conditions = [
            self._condition(
                condition_id,
                profile,
            )
            for condition_id
            in required_conditions
        ]

        workspace = (
            self.session[
                "workspace"
            ]
        )

        request = {
            "schema_version":
                1,

            "role":
                self.session[
                    "role"
                ],

            "capability":
                profile[
                    "capability"
                ],

            "environment":
                profile[
                    "environment"
                ],

            "declared_risk":
                self.session[
                    "declared_risk"
                ],

            "evaluated_at":
                iso8601(
                    utc_now()
                ),

            "action": {
                "target":
                    profile[
                        "id"
                    ],

                "resource_scope":
                    list(
                        profile[
                            "resource_scope"
                        ]
                    ),

                "material_parameters": [
                    {
                        "name":
                            "profile_id",
                        "value":
                            profile[
                                "id"
                            ],
                    },
                    {
                        "name":
                            "profile_version",
                        "value":
                            profile[
                                "version"
                            ],
                    },
                    {
                        "name":
                            "workspace_head",
                        "value":
                            workspace[
                                "head"
                            ],
                    },
                    {
                        "name":
                            (
                                "workspace_"
                                "dirty_fingerprint"
                            ),
                        "value":
                            workspace[
                                "dirty_fingerprint"
                            ],
                    },
                ],
            },

            "conditions":
                conditions,

            "approval":
                self.session.get(
                    "approval"
                ),

            "host":
                dict(
                    self.session[
                        "host"
                    ]
                ),
        }

        validate_json(
            self.request_schema,
            request,
            "preflight request",
        )

        return request

    def preflight_profile(
        self,
        profile_id: str,
    ) -> dict[str, Any]:
        self._assert_session_fresh()

        request = (
            self.build_preflight_request(
                profile_id
            )
        )

        decision = (
            self.resolver.resolve(
                request,
                self.session[
                    "principal_attestation"
                ],
                root=self.root,
            )
        )

        validate_json(
            self.decision_schema,
            decision,
            "preflight decision",
        )

        return decision

    @staticmethod
    def _write_text(
        path: Path,
        value: str,
    ) -> None:
        path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        path.write_text(
            value,
            encoding="utf-8",
        )

    @staticmethod
    def _write_json(
        path: Path,
        value:
            dict[str, Any],
    ) -> None:
        path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        path.write_text(
            json.dumps(
                value,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )

    def _receipt_base(
        self,
        execution_id: str,
        profile:
            dict[str, Any],
        decision:
            dict[str, Any],
        started_at: str,
    ) -> dict[str, Any]:
        return {
            "schema_version":
                1,

            "execution_id":
                execution_id,

            "session_id":
                self.session[
                    "principal_attestation"
                ][
                    "session_id"
                ],

            "principal_id":
                decision[
                    "principal_id"
                ],

            "role":
                decision[
                    "role"
                ],

            "profile_id":
                profile[
                    "id"
                ],

            "capability":
                decision[
                    "capability"
                ],

            "environment":
                decision[
                    "environment"
                ],

            "action_fingerprint":
                decision[
                    "action_fingerprint"
                ],

            "preflight_decision":
                decision[
                    "decision"
                ],

            "preflight_reason":
                decision[
                    "reason_code"
                ],

            "command":
                list(
                    profile[
                        "argv"
                    ]
                ),

            "cwd":
                profile[
                    "cwd"
                ],

            "started_at":
                started_at,

            "finished_at":
                started_at,

            "execution_status":
                "NOT_EXECUTED",

            "exit_code":
                None,

            "verification_status":
                "NOT_RUN",

            "stdout_ref":
                None,

            "stderr_ref":
                None,

            "preflight_ref":
                None,
        }

    def execute_profile(
        self,
        profile_id: str,
    ) -> dict[str, Any]:
        self._assert_session_fresh()

        profile = self.profiles.get(
            profile_id
        )

        require(
            profile
            is not None,
            (
                "Unknown gateway profile: "
                f"{profile_id}"
            ),
        )

        started_at = (
            iso8601(
                utc_now()
            )
        )

        execution_id = (
            f"EGX-{profile_id}-"
            f"{uuid.uuid4().hex[:12]}"
        )

        artifact_dir = (
            self.output_root
            / execution_id
        )

        artifact_dir.mkdir(
            parents=True,
            exist_ok=False,
        )

        decision = (
            self.preflight_profile(
                profile_id
            )
        )

        preflight_path = (
            artifact_dir
            / "preflight.json"
        )

        self._write_json(
            preflight_path,
            decision,
        )

        receipt = (
            self._receipt_base(
                execution_id,
                profile,
                decision,
                started_at,
            )
        )

        receipt[
            "preflight_ref"
        ] = (
            str(
                preflight_path
                .relative_to(
                    self.root
                )
            )
            if preflight_path
            .is_relative_to(
                self.root
            )
            else str(
                preflight_path
            )
        )

        if (
            decision[
                "decision"
            ]
            != "ALLOW"
            or decision[
                "tool_execution_allowed"
            ]
            is not True
        ):
            receipt[
                "finished_at"
            ] = iso8601(
                utc_now()
            )

            validate_json(
                self.receipt_schema,
                receipt,
                "execution receipt",
            )

            self._write_json(
                artifact_dir
                / "receipt.json",
                receipt,
            )

            return receipt

        cwd = (
            normalize_repo_relative(
                self.root,
                profile[
                    "cwd"
                ],
            )
        )

        require(
            cwd.is_dir(),
            (
                "Profile cwd "
                "does not exist: "
                f"{profile['cwd']}"
            ),
        )

        timeout = int(
            profile[
                "timeout_seconds"
            ]
        )

        env = (
            minimal_environment()
        )

        stdout_path = (
            artifact_dir
            / "stdout.txt"
        )

        stderr_path = (
            artifact_dir
            / "stderr.txt"
        )

        try:
            result = subprocess.run(
                list(
                    profile[
                        "argv"
                    ]
                ),
                cwd=cwd,
                env=env,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=timeout,
                shell=False,
                check=False,
            )

            stdout = (
                result.stdout
                or ""
            )

            stderr = (
                result.stderr
                or ""
            )

            exit_code = (
                result.returncode
            )

            execution_status = (
                "SUCCEEDED"
                if exit_code
                == 0
                else "FAILED"
            )

            verification_status = (
                "PASS"
                if exit_code
                == 0
                else "FAIL"
            )

        except subprocess.TimeoutExpired as error:
            stdout = (
                error.stdout
                or ""
            )

            stderr = (
                error.stderr
                or ""
            )

            if isinstance(
                stdout,
                bytes,
            ):
                stdout = (
                    stdout.decode(
                        "utf-8",
                        errors="replace",
                    )
                )

            if isinstance(
                stderr,
                bytes,
            ):
                stderr = (
                    stderr.decode(
                        "utf-8",
                        errors="replace",
                    )
                )

            exit_code = None

            execution_status = (
                "TIMED_OUT"
            )

            verification_status = (
                "BLOCKED"
            )

        max_bytes = int(
            self.profile_catalog
            .get(
                "evidence",
                {},
            )
            .get(
                "max_text_bytes",
                1_000_000,
            )
        )

        stdout = stdout[
            :max_bytes
        ]

        stderr = stderr[
            :max_bytes
        ]

        self._write_text(
            stdout_path,
            stdout,
        )

        self._write_text(
            stderr_path,
            stderr,
        )

        receipt.update(
            {
                "finished_at":
                    iso8601(
                        utc_now()
                    ),

                "execution_status":
                    execution_status,

                "exit_code":
                    exit_code,

                "verification_status":
                    verification_status,

                "stdout_ref":
                    (
                        str(
                            stdout_path
                            .relative_to(
                                self.root
                            )
                        )
                        if stdout_path
                        .is_relative_to(
                            self.root
                        )
                        else str(
                            stdout_path
                        )
                    ),

                "stderr_ref":
                    (
                        str(
                            stderr_path
                            .relative_to(
                                self.root
                            )
                        )
                        if stderr_path
                        .is_relative_to(
                            self.root
                        )
                        else str(
                            stderr_path
                        )
                    ),
            }
        )

        validate_json(
            self.receipt_schema,
            receipt,
            "execution receipt",
        )

        self._write_json(
            artifact_dir
            / "receipt.json",
            receipt,
        )

        return receipt