"""Validate engineering principal identity and autonomy grant registries (CP-005D).

This validator enforces repository-wide governance rules for principal stability,
runtime provider decoupling, autonomy grant boundaries, and lifecycle states.
It does not grant runtime permission, autonomy, or tool access.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
from pathlib import Path
from typing import Any

import yaml


ROOT = Path(__file__).resolve().parents[2]

PRINCIPALS_PATH = ".agents/principals/registry.yaml"
GRANTS_PATH = ".agents/autonomy/grants.yaml"
CAPABILITIES_PATH = ".agents/capabilities/registry.yaml"
ADAPTERS_PATH = ".agents/adapters/registry.yaml"
ROLES_PATH = ".agents/roles/contracts.json"

ROLE_IDS = {
    "planner",
    "engineer",
    "auditor",
    "qa",
    "release-operator",
}

AUTONOMY_LEVELS = (
    "L0",
    "L1",
    "L2",
    "L3",
    "L4",
)

RISK_LEVELS = (
    "R0",
    "R1",
    "R2",
    "R3",
    "R4",
    "R5",
)

REMOTE_CAPABILITIES = {
    "engineering.git.main.push",
    "engineering.github.feature_branch.push",
    "engineering.github.pull_request.create",
    "engineering.github.pull_request.close",
    "engineering.github.branch.delete",
    "engineering.github.pull_request.merge",
    "engineering.release.deploy",
    "engineering.database.mgbos.remote.mutate",
}

WELL_KNOWN_PROVIDER_MODEL_TOKENS = {
    "openai",
    "google",
    "anthropic",
    "meta",
    "mistral",
    "deepseek",
    "codex",
    "antigravity",
    "claude",
    "gemini",
    "gpt",
    "chatgpt",
    "llama",
}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def load_yaml(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    require(isinstance(value, dict), f"Invalid YAML: {path}")
    return value


def load_json(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    require(isinstance(value, dict), f"Invalid JSON: {path}")
    return value


def autonomy_index(value: str) -> int:
    require(value in AUTONOMY_LEVELS, f"Unknown autonomy level: {value}")
    return AUTONOMY_LEVELS.index(value)


def risk_index(value: str) -> int:
    require(value in RISK_LEVELS, f"Unknown risk level: {value}")
    return RISK_LEVELS.index(value)


def parse_timestamp(value: str) -> dt.datetime:
    require(isinstance(value, str) and value.strip(), "Missing timestamp")
    normalized = value.replace("Z", "+00:00")
    parsed = dt.datetime.fromisoformat(normalized)
    require(parsed.tzinfo is not None, f"Timestamp must include timezone: {value}")
    return parsed.astimezone(dt.timezone.utc)


def validate(root: Path = ROOT) -> dict[str, Any]:
    root = Path(root).resolve()

    principals_file = root / PRINCIPALS_PATH
    grants_file = root / GRANTS_PATH
    capabilities_file = root / CAPABILITIES_PATH
    adapters_file = root / ADAPTERS_PATH
    roles_file = root / ROLES_PATH

    for file_path in (
        principals_file,
        grants_file,
        capabilities_file,
        adapters_file,
        roles_file,
    ):
        require(file_path.is_file(), f"Missing required governance file: {file_path}")

    principals_doc = load_yaml(principals_file)
    grants_doc = load_yaml(grants_file)
    capabilities_doc = load_yaml(capabilities_file)
    adapters_doc = load_yaml(adapters_file)
    roles_doc = load_json(roles_file)

    # 1. Collect disallowed provider/model identity tokens
    disallowed_tokens = set(WELL_KNOWN_PROVIDER_MODEL_TOKENS)
    providers_map = adapters_doc.get("providers", {})
    require(isinstance(providers_map, dict), "Invalid adapters providers section")
    for adapter_key, adapter_entry in providers_map.items():
        disallowed_tokens.add(adapter_key.lower())
        if isinstance(adapter_entry, dict) and "provider" in adapter_entry:
            disallowed_tokens.add(str(adapter_entry["provider"]).lower())

    # 2. Roles
    role_ids = {r["id"] for r in roles_doc.get("roles", []) if isinstance(r, dict) and "id" in r}
    require(role_ids == ROLE_IDS, f"Unexpected role IDs in roles catalog: {role_ids}")

    # 3. Capabilities
    capabilities_list = capabilities_doc.get("capabilities", [])
    require(isinstance(capabilities_list, list), "Capabilities list missing")
    capabilities = {}
    for cap in capabilities_list:
        require(isinstance(cap, dict), "Invalid capability entry")
        cid = cap.get("id")
        require(isinstance(cid, str), "Capability missing id")
        capabilities[cid] = cap

    # 4. Principals validation
    principals_list = principals_doc.get("principals", [])
    require(isinstance(principals_list, list) and principals_list, "Principals list missing or empty")

    indexed_principals = {}
    for principal in principals_list:
        require(isinstance(principal, dict), "Invalid principal entry")
        pid = principal.get("id")
        require(isinstance(pid, str) and pid.strip(), "Principal missing id")
        require(pid not in indexed_principals, f"Duplicate principal ID: {pid}")

        # Invariant 1: principal ID stable/semantic
        require(
            re.fullmatch(r"^engineering\.[a-z0-9_.-]+$", pid),
            f"Principal ID must be stable semantic identifier starting with engineering.: {pid}",
        )

        # Invariant 2: provider/model tidak muncul dalam principal ID
        id_tokens = set(re.split(r"[._-]+", pid.lower()))
        forbidden_matches = id_tokens.intersection(disallowed_tokens)
        require(
            not forbidden_matches,
            f"Principal ID '{pid}' contains provider/adapter token(s) {forbidden_matches}: provider cannot be principal identity",
        )

        # Invariant 3: adapter binding valid
        binding = principal.get("runtime_binding")
        require(isinstance(binding, dict), f"Principal '{pid}' missing runtime_binding")
        adapter_id = binding.get("adapter_id")
        require(adapter_id in providers_map, f"Principal '{pid}' has invalid adapter_id: {adapter_id}")

        # Invariant 4: allowed role valid
        allowed_roles = principal.get("allowed_roles")
        require(isinstance(allowed_roles, list) and allowed_roles, f"Principal '{pid}' has invalid allowed_roles")
        for role in allowed_roles:
            require(role in ROLE_IDS, f"Principal '{pid}' has unknown allowed role: {role}")

        # Invariant 5: principal ceiling hanya capability registered + ACTIVE
        ceiling = principal.get("capability_ceiling")
        require(isinstance(ceiling, list), f"Principal '{pid}' has invalid capability_ceiling")
        for cid in ceiling:
            require(cid in capabilities, f"Principal '{pid}' ceiling references unknown capability: {cid}")
            cap = capabilities[cid]
            require(
                cap.get("disposition") == "ACTIVE",
                f"Principal '{pid}' ceiling capability '{cid}' must have disposition ACTIVE, found {cap.get('disposition')}",
            )

        # Invariant 6: initial principals cannot claim independent assurance
        require(
            principal.get("independent_assurance_eligible") is False,
            f"Initial principal '{pid}' cannot claim independent assurance (must be independent_assurance_eligible: false)",
        )

        indexed_principals[pid] = principal

    # 5. Autonomy grants validation
    grants_list = grants_doc.get("grants", [])
    require(isinstance(grants_list, list) and grants_list, "Grants list missing or empty")

    indexed_grants = {}
    active_tuples = set()

    for grant in grants_list:
        require(isinstance(grant, dict), "Invalid grant entry")
        gid = grant.get("id")
        require(isinstance(gid, str) and gid.strip(), "Grant missing id")
        require(gid not in indexed_grants, f"Duplicate grant ID: {gid}")

        # Invariant 7: grant principal exists
        pid = grant.get("principal_id")
        require(pid in indexed_principals, f"Grant '{gid}' references unknown principal: {pid}")
        principal = indexed_principals[pid]

        # Invariant 8: grant capability exists
        cid = grant.get("capability_id")
        require(cid in capabilities, f"Grant '{gid}' references unknown capability: {cid}")
        capability = capabilities[cid]

        # Invariant 9: grant capability inside principal ceiling
        require(
            cid in principal["capability_ceiling"],
            f"Grant '{gid}' capability '{cid}' is not inside principal ceiling of '{pid}'",
        )

        level = grant.get("level")
        require(level in AUTONOMY_LEVELS, f"Grant '{gid}' has invalid level: {level}")

        env = grant.get("environment")
        require(isinstance(env, str) and env.strip(), f"Grant '{gid}' missing environment")

        basis = grant.get("basis")
        require(
            basis in {"INITIAL_GOVERNANCE_BASELINE", "PROMOTION_DECISION"},
            f"Grant '{gid}' has unknown basis: {basis}",
        )

        # Invariant 19: remote capabilities currently have no initial grant
        if basis == "INITIAL_GOVERNANCE_BASELINE":
            require(
                cid not in REMOTE_CAPABILITIES,
                f"Remote capability cannot have initial baseline grant: {cid} in {gid}",
            )
            require(
                env == "repository-local",
                f"Initial baseline grant must be repository-local environment: {gid} has {env}",
            )

        # Invariant 13: INITIAL_GOVERNANCE_BASELINE cannot create L3/L4
        if basis == "INITIAL_GOVERNANCE_BASELINE":
            require(
                level not in {"L3", "L4"},
                f"INITIAL_GOVERNANCE_BASELINE cannot create L3/L4 autonomy: {gid} has level {level}",
            )

        # Invariant 14: PROMOTION_DECISION required for L3/L4
        if level in {"L3", "L4"}:
            require(
                basis == "PROMOTION_DECISION",
                f"L3/L4 autonomy requires PROMOTION_DECISION: {gid} has basis {basis}",
            )

            # Invariant 15: L3/L4 require owner decision ref
            owner_ref = grant.get("owner_decision_ref")
            require(
                isinstance(owner_ref, str) and owner_ref.strip(),
                f"L3/L4 grant '{gid}' requires non-empty owner_decision_ref",
            )

            # Invariant 16: L3/L4 require promotion case ref
            case_ref = grant.get("promotion_case_ref")
            require(
                isinstance(case_ref, str) and case_ref.strip(),
                f"L3/L4 grant '{gid}' requires non-empty promotion_case_ref",
            )

        # Invariant 10: grant level >= capability minimum
        cap_min = capability.get("minimum_autonomy")
        if cap_min:
            require(
                autonomy_index(level) >= autonomy_index(cap_min),
                f"Grant '{gid}' level '{level}' is below capability minimum '{cap_min}'",
            )

        # Invariant 11: grant level <= capability ceiling
        cap_ceiling = capability.get("autonomy_ceiling")
        if cap_ceiling:
            require(
                autonomy_index(level) <= autonomy_index(cap_ceiling),
                f"Grant '{gid}' level '{level}' exceeds capability ceiling '{cap_ceiling}'",
            )

        # Invariant 12: risk ceiling >= capability baseline
        risk_ceiling = grant.get("risk_ceiling")
        require(risk_ceiling in RISK_LEVELS, f"Grant '{gid}' has invalid risk_ceiling: {risk_ceiling}")
        cap_baseline_risk = capability.get("baseline_risk")
        if cap_baseline_risk:
            require(
                risk_index(risk_ceiling) >= risk_index(cap_baseline_risk),
                f"Grant '{gid}' risk ceiling '{risk_ceiling}' is below capability baseline risk '{cap_baseline_risk}'",
            )

        # Invariant 17: revoked/expired grant does not become active authority
        state = grant.get("state")
        require(
            state in {"ACTIVE", "SUSPENDED", "REVOKED", "EXPIRED"},
            f"Grant '{gid}' has invalid state: {state}",
        )
        effective_from = parse_timestamp(grant.get("effective_from"))
        expires_at_val = grant.get("expires_at")
        if expires_at_val is not None:
            expires_at = parse_timestamp(expires_at_val)
            require(
                expires_at >= effective_from,
                f"Grant '{gid}' expires_at {expires_at_val} cannot precede effective_from {grant.get('effective_from')}",
            )

        # Invariant 18: no overlapping current grants for same principal+capability+environment
        env = grant.get("environment")
        require(isinstance(env, str) and env.strip(), f"Grant '{gid}' missing environment")
        if state in {"ACTIVE", "SUSPENDED"}:
            grant_key = (pid, cid, env)
            require(
                grant_key not in active_tuples,
                f"Overlapping current autonomy grants for {grant_key}: multiple active/suspended grants found ({gid})",
            )
            active_tuples.add(grant_key)

        # Invariant 19: remote capabilities currently have no initial grant
        if basis == "INITIAL_GOVERNANCE_BASELINE":
            require(
                cid not in REMOTE_CAPABILITIES,
                f"Remote capability cannot have initial baseline grant: {cid} in {gid}",
            )
            require(
                env == "repository-local",
                f"Initial baseline grant must be repository-local environment: {gid} has {env}",
            )

        # Resource scope
        scope = grant.get("resource_scope")
        require(isinstance(scope, dict), f"Grant '{gid}' missing resource_scope")
        mode = scope.get("mode")
        require(mode in {"ANY", "EXACT", "PREFIX"}, f"Grant '{gid}' invalid scope mode: {mode}")

        indexed_grants[gid] = grant

    return {
        "principals": len(indexed_principals),
        "grants": len(indexed_grants),
        "active_grants": len(active_tuples),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
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
        "PASS (engineering autonomy structural/policy validation only): "
        f"{json.dumps(result)}"
    )


if __name__ == "__main__":
    main()
