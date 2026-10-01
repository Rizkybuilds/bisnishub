"""Validate Codex and Antigravity governed gateway wiring."""

from __future__ import annotations

import argparse
import json
import tomllib
from pathlib import Path
from typing import Any


ROOT = (
    Path(__file__)
    .resolve()
    .parents[2]
)

CODEX_CONFIG = (
    ".codex/config.toml"
)

ANTIGRAVITY_CONFIG = (
    ".agents/mcp_config.json"
)

LAUNCHER = (
    "tools/engineering_gateway/launch.py"
)

SERVER = (
    "tools/engineering_gateway/server.py"
)

SESSION_VARIABLE = (
    "BISNISHUB_ENGINEERING_GATEWAY_SESSION"
)

GATEWAY_TOOLS = {
    "list_engineering_profiles",
    "preflight_engineering_profile",
    "execute_engineering_profile",
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


def load_toml(
    root: Path,
    relative: str,
) -> dict[str, Any]:
    with local_file(
        root,
        relative,
    ).open(
        "rb"
    ) as handle:
        value = tomllib.load(
            handle
        )

    require(
        isinstance(
            value,
            dict,
        ),
        (
            "Invalid TOML document: "
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
            "Invalid JSON document: "
            f"{relative}"
        ),
    )

    return value


def validate_codex(
    root: Path,
) -> None:
    config = load_toml(
        root,
        CODEX_CONFIG,
    )

    require(
        config.get(
            "approval_policy"
        )
        == "on-request",
        (
            "Codex project approval policy "
            "must remain on-request"
        ),
    )

    require(
        config.get(
            "approvals_reviewer"
        )
        == "user",
        (
            "Codex project approvals "
            "must remain user-reviewed"
        ),
    )

    require(
        config.get(
            "sandbox_mode"
        )
        == "workspace-write",
        (
            "Codex project sandbox "
            "must remain workspace-write"
        ),
    )

    sandbox = config.get(
        "sandbox_workspace_write"
    )

    require(
        isinstance(
            sandbox,
            dict,
        ),
        (
            "Codex workspace-write "
            "sandbox config missing"
        ),
    )

    require(
        sandbox.get(
            "network_access"
        )
        is False,
        (
            "Codex project shell network "
            "access must remain disabled"
        ),
    )

    servers = config.get(
        "mcp_servers"
    )

    require(
        isinstance(
            servers,
            dict,
        ),
        (
            "Codex MCP server "
            "configuration missing"
        ),
    )

    require(
        set(
            servers
        )
        == {
            "bisnishubEngineeringGateway"
        },
        (
            "Codex project MCP surface "
            "must contain only the "
            "BisnisHub Engineering Gateway"
        ),
    )

    gateway = servers[
        "bisnishubEngineeringGateway"
    ]

    require(
        gateway.get(
            "command"
        )
        == "python",
        (
            "Unexpected Codex gateway "
            "MCP executable"
        ),
    )

    require(
        gateway.get(
            "args"
        )
        == [
            (
                "tools/engineering_gateway/"
                "server.py"
            )
        ],
        (
            "Unexpected Codex gateway "
            "MCP arguments"
        ),
    )

    require(
        gateway.get(
            "enabled"
        )
        is True,
        (
            "Codex gateway MCP "
            "must remain enabled"
        ),
    )

    require(
        gateway.get(
            "required"
        )
        is True,
        (
            "Codex gateway MCP "
            "must remain required"
        ),
    )

    require(
        set(
            gateway.get(
                "env_vars",
                [],
            )
        )
        == {
            SESSION_VARIABLE
        },
        (
            "Codex gateway must receive "
            "only the trusted-session "
            "environment variable"
        ),
    )

    require(
        set(
            gateway.get(
                "enabled_tools",
                [],
            )
        )
        == GATEWAY_TOOLS,
        (
            "Codex gateway MCP tool "
            "allowlist drifted"
        ),
    )

    require(
        gateway.get(
            "default_tools_approval_mode"
        )
        == "prompt",
        (
            "Codex gateway MCP tool "
            "approval must remain prompt"
        ),
    )


def validate_antigravity(
    root: Path,
) -> None:
    config = load_json(
        root,
        ANTIGRAVITY_CONFIG,
    )

    require(
        set(
            config
        )
        == {
            "mcpServers"
        },
        (
            "Antigravity project MCP "
            "config contains unexpected "
            "top-level fields"
        ),
    )

    servers = config[
        "mcpServers"
    ]

    require(
        isinstance(
            servers,
            dict,
        ),
        (
            "Antigravity mcpServers "
            "must be an object"
        ),
    )

    require(
        set(
            servers
        )
        == {
            (
                "bisnishub-"
                "engineering-gateway"
            )
        },
        (
            "Antigravity project MCP "
            "surface must contain only "
            "the governed gateway"
        ),
    )

    gateway = servers[
        "bisnishub-engineering-gateway"
    ]

    require(
        gateway.get(
            "command"
        )
        == "python",
        (
            "Unexpected Antigravity "
            "gateway executable"
        ),
    )

    require(
        gateway.get(
            "args"
        )
        == [
            (
                "tools/engineering_gateway/"
                "server.py"
            )
        ],
        (
            "Unexpected Antigravity "
            "gateway arguments"
        ),
    )

    environment = gateway.get(
        "env",
        {},
    )

    require(
        environment
        == {},
        (
            "Antigravity gateway project "
            "config must not embed "
            "credentials or session state"
        ),
    )


def validate(
    root: Path = ROOT,
) -> dict[str, Any]:
    root = Path(
        root
    ).resolve()

    validate_codex(
        root
    )

    validate_antigravity(
        root
    )

    launcher = local_file(
        root,
        LAUNCHER,
    )

    server = local_file(
        root,
        SERVER,
    )

    launcher_text = launcher.read_text(
        encoding="utf-8"
    )

    server_text = server.read_text(
        encoding="utf-8"
    )

    require(
        "--dangerously-skip-permissions"
        in launcher_text,
        (
            "Trusted launcher no longer "
            "guards Antigravity permission "
            "bypass"
        ),
    )

    require(
        "--sandbox"
        in launcher_text,
        (
            "Trusted launcher no longer "
            "enforces Antigravity sandbox"
        ),
    )

    require(
        "danger-full-access"
        in launcher_text,
        (
            "Trusted launcher no longer "
            "guards Codex full-access "
            "override"
        ),
    )

    require(
        SESSION_VARIABLE
        in server_text,
        (
            "Gateway server no longer "
            "requires trusted session state"
        ),
    )

    require(
        (
            "must not be stored inside "
            "the repository"
        )
        in server_text,
        (
            "Gateway server no longer "
            "rejects repository-local "
            "trusted session state"
        ),
    )

    return {
        "codex_gateway":
            True,

        "antigravity_gateway":
            True,

        "gateway_tools":
            sorted(
                GATEWAY_TOOLS
            ),

        "codex_network_access":
            False,

        "antigravity_sandbox_launcher":
            True,
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
        tomllib.TOMLDecodeError,
    ) as error:
        parser.exit(
            1,
            f"FAIL: {error}\n",
        )

    print(
        (
            "PASS "
            "(provider enforcement "
            "structural validation only): "
            + json.dumps(
                result
            )
        )
    )


if __name__ == "__main__":
    main()