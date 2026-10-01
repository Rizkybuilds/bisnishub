"""MCP stdio server for the BisnisHub Governed Engineering Gateway.

The MCP server itself MUST remain able to initialize even when no trusted
engineering session is currently bound.

Authorization is evaluated lazily when a tool is called.

This separation is intentional:

    MCP availability
    !=
    engineering authority

A normal Codex/Antigravity session may therefore initialize the server without
receiving engineering execution authority. Governed tools fail closed until a
trusted launcher session is present and valid.
"""

from __future__ import annotations

import os
import stat
import sys
from pathlib import Path

from mcp.server import MCPServer
from mcp.server.mcpserver.exceptions import ToolError


ROOT = (
    Path(__file__)
    .resolve()
    .parents[2]
)

if str(ROOT) not in sys.path:
    sys.path.insert(
        0,
        str(ROOT),
    )


from tools.engineering_gateway.gateway import (  # noqa: E402
    EngineeringGateway,
)


SESSION_ENV = (
    "BISNISHUB_ENGINEERING_GATEWAY_SESSION"
)


def trusted_session_path() -> Path:
    """Resolve and validate the trusted launcher session.

    This function is deliberately called only from tool execution paths.

    Missing session state must never prevent the MCP server itself from
    starting and completing its protocol handshake.
    """

    value = os.environ.get(
        SESSION_ENV
    )

    if not value:
        raise ToolError(
            (
                "BisnisHub Engineering Gateway is available but no trusted "
                "engineering session is bound. Start a governed runtime with "
                "tools/engineering_gateway/launch.py before using governed "
                "engineering execution tools."
            )
        )

    path = (
        Path(value)
        .expanduser()
        .resolve()
    )

    if path.is_relative_to(
        ROOT.resolve()
    ):
        raise ToolError(
            (
                "Trusted gateway session is invalid: session state "
                "must not be stored inside the repository."
            )
        )

    if not path.is_file():
        raise ToolError(
            (
                "Trusted gateway session is unavailable or expired: "
                f"{path}"
            )
        )

    if os.name != "nt":
        mode = stat.S_IMODE(
            path.stat().st_mode
        )

        if mode & 0o077:
            raise ToolError(
                (
                    "Trusted gateway session permissions are unsafe. "
                    "The file must not be readable or writable by "
                    "group or other users."
                )
            )

    return path


def gateway_for_tool() -> EngineeringGateway:
    """Construct the governed gateway for the current trusted session.

    Gateway construction is intentionally lazy.

    Never construct EngineeringGateway at module import time because doing so
    would turn absence of runtime authority into failure of the MCP transport.
    """

    session_path = (
        trusted_session_path()
    )

    try:
        return EngineeringGateway(
            root=ROOT,
            session_path=session_path,
        )

    except ToolError:
        raise

    except (
        ValueError,
        OSError,
        KeyError,
        TypeError,
    ) as error:
        raise ToolError(
            (
                "Trusted BisnisHub engineering session could not be "
                f"activated: {error}"
            )
        ) from error


# ---------------------------------------------------------------------------
# MCP transport
# ---------------------------------------------------------------------------
#
# IMPORTANT:
#
# Constructing this object must not require a trusted engineering session.
# This allows Codex/Antigravity to complete MCP initialization even when the
# runtime was not launched through the governed launcher.
#
# Authority is resolved only inside the tools below.
# ---------------------------------------------------------------------------

mcp = MCPServer(
    "BisnisHub Engineering Gateway"
)


@mcp.tool()
def list_engineering_profiles() -> list[dict]:
    """List fixed engineering execution profiles for the trusted session.

    A trusted governed session is required because available profiles are part
    of the active engineering authority context.
    """

    gateway = (
        gateway_for_tool()
    )

    return (
        gateway.list_profiles()
    )


@mcp.tool()
def preflight_engineering_profile(
    profile_id: str,
) -> dict:
    """Evaluate repository policy for one fixed engineering profile.

    This does not execute the profile.

    The returned decision may be:

    ALLOW
    DENY
    BLOCK
    NEED_APPROVAL
    """

    gateway = (
        gateway_for_tool()
    )

    return (
        gateway.preflight_profile(
            profile_id
        )
    )


@mcp.tool()
def execute_engineering_profile(
    profile_id: str,
) -> dict:
    """Execute a fixed engineering profile after governed preflight.

    V1 exposes no arbitrary shell, GitHub mutation, production deployment,
    or remote database execution through this gateway.
    """

    gateway = (
        gateway_for_tool()
    )

    return (
        gateway.execute_profile(
            profile_id
        )
    )


if __name__ == "__main__":
    # No trusted session is resolved here.
    #
    # Starting the MCP transport and obtaining engineering authority are
    # separate lifecycle events.
    mcp.run()