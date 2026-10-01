"""MCP stdio server for the BisnisHub Governed Engineering Gateway."""

from __future__ import annotations

import os
import stat
import sys
from pathlib import Path

from mcp.server import MCPServer


ROOT = (
    Path(__file__)
    .resolve()
    .parents[2]
)

if str(
    ROOT
) not in sys.path:
    sys.path.insert(
        0,
        str(
            ROOT
        ),
    )

from tools.engineering_gateway.gateway import (  # noqa: E402
    EngineeringGateway,
)


SESSION_ENV = (
    "BISNISHUB_ENGINEERING_GATEWAY_SESSION"
)


def trusted_session_path() -> Path:
    value = os.environ.get(
        SESSION_ENV
    )

    if not value:
        raise RuntimeError(
            (
                f"{SESSION_ENV} must point "
                "to a trusted gateway "
                "session JSON file"
            )
        )

    path = (
        Path(
            value
        )
        .expanduser()
        .resolve()
    )

    if path.is_relative_to(
        ROOT.resolve()
    ):
        raise RuntimeError(
            "Trusted gateway session "
            "must not be stored inside the repository"
        )

    if not path.is_file():
        raise RuntimeError(
            (
                "Trusted gateway session "
                f"does not exist: {path}"
            )
        )

    if os.name != "nt":
        mode = stat.S_IMODE(
            path.stat().st_mode
        )

        if mode & 0o077:
            raise RuntimeError(
                (
                    "Trusted gateway session "
                    "must not be readable or "
                    "writable by group/others"
                )
            )

    return path


SESSION_PATH = (
    trusted_session_path()
)

GATEWAY = EngineeringGateway(
    root=ROOT,
    session_path=
        SESSION_PATH,
)

mcp = MCPServer(
    "BisnisHub Engineering Gateway"
)


@mcp.tool()
def list_engineering_profiles() -> list[dict]:
    """List the fixed local engineering profiles available through the governed gateway.

    This tool does not execute a command and does not grant additional authority.
    """

    return (
        GATEWAY.list_profiles()
    )


@mcp.tool()
def preflight_engineering_profile(
    profile_id: str,
) -> dict:
    """Evaluate repository policy for one fixed engineering profile without executing it.

    The result may be ALLOW, DENY, BLOCK, or NEED_APPROVAL.
    """

    return (
        GATEWAY.preflight_profile(
            profile_id
        )
    )


@mcp.tool()
def execute_engineering_profile(
    profile_id: str,
) -> dict:
    """Execute one fixed local engineering profile only after governed preflight returns ALLOW.

    V1 does not expose arbitrary shell, GitHub mutation, deployment, or remote database execution.
    """

    return (
        GATEWAY.execute_profile(
            profile_id
        )
    )


if __name__ == "__main__":
    mcp.run()