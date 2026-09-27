"""Validate project governance structure, not model behavior or production readiness."""
import argparse
import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
SKILLS = (
    "mgbos-change-planner", "mgbos-business-integrity-auditor", "mgbos-pr-reviewer",
    "ai-automation-engine", "ai-copilot-builder", "web-sec-perf",
)
LEGACY_METADATA = {"ai-automation-engine", "ai-copilot-builder", "web-sec-perf"}
CAPABILITIES = {
    "planner": {"read-repository", "write-plan"},
    "engineer": {"read-repository", "write-scoped-files", "run-local-checks"},
    "auditor": {"read-repository", "write-review"},
    "qa": {"read-repository", "write-test-artifacts", "run-local-checks"},
    "release-operator": {"read-repository", "write-release-plan"},
}
CATEGORIES = {"routing", "database", "finance", "permissions", "ai", "release"}
DOCS = ("README", "workflow", "roles", "permission-matrix", "risk-classification",
        "evidence-model", "release-gates", "implementation-report")


class UniqueLoader(yaml.SafeLoader):
    """Fail on duplicate mapping keys instead of silently accepting last value."""


def unique_mapping(loader, node, deep=False):
    result = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if key in result:
            raise ValueError(f"Duplicate YAML key: {key}")
        result[key] = loader.construct_object(value_node, deep=deep)
    return result


UniqueLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, unique_mapping)


def unique_json(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"Duplicate JSON key: {key}")
        result[key] = value
    return result


def require(condition, message):
    if not condition:
        raise ValueError(message)


def strings(value):
    return isinstance(value, list) and bool(value) and all(isinstance(x, str) and x.strip() for x in value)


def local_file(root, value):
    require(isinstance(value, str) and value.strip(), "Expected a nonempty repository path")
    target = (root / value).resolve()
    require(target.is_relative_to(root.resolve()), f"Reference escapes repository: {value}")
    require(target.is_file(), f"Missing file: {value}")
    return target


def load_json(root, path):
    return json.loads(local_file(root, path).read_text(encoding="utf-8"), object_pairs_hook=unique_json)


def check_markdown(root, path):
    text = path.read_text(encoding="utf-8")
    require(bool(text.strip()), f"Empty instruction/document: {path}")
    require(not re.search(r"(?m)^(<<<<<<< |=======\s*$|>>>>>>> )", text), f"Conflict marker: {path}")
    require(not re.search(r"\[TODO:[^\n]*\]", text), f"Unfinished scaffold: {path}")
    # Ignore example code. Internal anchors are intentionally not a heading-slug validator.
    prose = re.sub(r"(?ms)^\s*(`{3,}|~{3,}).*?^\s*\1\s*$", "", text)
    for match in re.finditer(r"\[[^\]\n]+\]\((<[^>]+>|[^\s)]+)(?:\s+\"[^\"]*\")?\)", prose):
        destination = match.group(1).strip("<>").split("#", 1)[0]
        if not destination or re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", destination):
            continue
        target = (path.parent / destination).resolve()
        require(target.is_relative_to(root.resolve()), f"Link escapes repository in {path}: {destination}")
        require(target.exists(), f"Broken link in {path}: {destination}")


def validate(root=ROOT):
    root = Path(root).resolve()
    markdown = set()
    warnings = []
    for name in SKILLS:
        path = local_file(root, f".agents/skills/{name}/SKILL.md")
        text = path.read_text(encoding="utf-8")
        match = re.match(r"\A---\n(.*?)\n---(?:\n|$)", text, re.S)
        require(match is not None, f"Missing YAML frontmatter: {name}")
        data = yaml.load(match.group(1), Loader=UniqueLoader)
        require(isinstance(data, dict), f"Invalid frontmatter: {name}")
        allowed = {"name", "description", "license", "allowed-tools", "metadata"}
        if name in LEGACY_METADATA:
            allowed.add("argument-hint")
        require(not set(data) - allowed, f"Unsupported metadata for {name}: {set(data) - allowed}")
        require(data.get("name") == name and len(name) <= 64, f"Skill name/folder mismatch: {name}")
        description = data.get("description")
        require(isinstance(description, str) and 0 < len(description.strip()) <= 1024,
                f"Empty/invalid description: {name}")
        require("<" not in description and ">" not in description, f"Angle brackets in description: {name}")
        require(bool(text[match.end():].strip()), f"Empty skill body: {name}")
        if "argument-hint" in data:
            require(isinstance(data["argument-hint"], str), f"Invalid argument-hint: {name}")
            warnings.append(f"{name}: retained legacy argument-hint; bundled Skill Creator allowlist differs.")
        markdown.add(path)
        markdown.update(path.parent.glob("references/*.md"))

    catalog = load_json(root, ".agents/roles/contracts.json")
    require(catalog.get("schemaVersion") == 1 and catalog.get("workspace") == "mgbos/", "Invalid role catalog version/workspace")
    markdown.add(local_file(root, catalog.get("policy")))
    roles = catalog.get("roles")
    require(isinstance(roles, list), "Roles must be a list")
    ids = [role.get("id") for role in roles if isinstance(role, dict)]
    require(len(ids) == len(roles) == len(CAPABILITIES) and set(ids) == set(CAPABILITIES), "Missing, duplicate or unknown roles")
    for role in roles:
        rid = role["id"]
        require(isinstance(role.get("name"), str) and role["name"].strip(), f"Role name missing: {rid}")
        require(role.get("contract") == f".agents/roles/{rid}.md", f"Role contract mismatch: {rid}")
        markdown.add(local_file(root, role["contract"]))
        capabilities = role.get("capabilities")
        require(strings(capabilities) and len(capabilities) == len(set(capabilities)) and set(capabilities) == CAPABILITIES[rid], f"Invalid capabilities: {rid}")
        handoff = role.get("handoffTo")
        require(strings(handoff) and len(handoff) == len(set(handoff)) and set(handoff) <= set(ids) - {rid}, f"Invalid handoff: {rid}")
        require(isinstance(role.get("skills"), list), f"Invalid skills: {rid}")
        for skill in role["skills"]:
            require(isinstance(skill, str) and re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", skill), f"Invalid skill id: {rid}")
            local_file(root, f".agents/skills/{skill}/SKILL.md")

    baseline = load_json(root, ".agents/evals/baseline.json")
    require(baseline.get("schemaVersion") == 1 and isinstance(baseline.get("cases"), list), "Invalid eval schema")
    seen = set()
    coverage = {category: 0 for category in CATEGORIES}
    for case in baseline["cases"]:
        require(isinstance(case, dict), "Invalid eval case")
        cid = case.get("id")
        require(isinstance(cid, str) and re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", cid) and cid not in seen, f"Duplicate/invalid eval id: {cid}")
        seen.add(cid)
        require(case.get("category") in CATEGORIES, f"Invalid eval category: {cid}")
        coverage[case["category"]] += 1
        require(case.get("role") in CAPABILITIES, f"Invalid eval role: {cid}")
        for field in ("prompt", "context"):
            require(isinstance(case.get(field), str) and case[field].strip(), f"Missing {field}: {cid}")
        for field in ("criteria", "forbidden", "sources"):
            require(strings(case.get(field)), f"Missing {field}: {cid}")
        for source in case["sources"]:
            local_file(root, source)
    require(all(count >= 2 for count in coverage.values()), f"Need at least two cases per category: {coverage}")

    for name in DOCS:
        markdown.add(local_file(root, f"mgbos/docs/engineering/agent-system/{name}.md"))
    for path in ("AGENTS.md", "mgbos/AGENTS.md", ".agents/evals/README.md"):
        markdown.add(local_file(root, path))
    for path in markdown:
        check_markdown(root, path)

    workflow_path = local_file(root, ".github/workflows/agent-governance.yml")
    workflow = yaml.load(workflow_path.read_text(encoding="utf-8"), Loader=UniqueLoader)
    require(workflow.get("permissions") == {"contents": "read"}, "Governance workflow must use read-only contents permission")
    # YAML 1.1 reads the unquoted GitHub key 'on' as True.
    events = workflow.get("on", workflow.get(True))
    require(isinstance(events, dict) and set(events) == {"pull_request", "push", "workflow_dispatch"}, "Unexpected governance workflow events")
    require(set(workflow.get("jobs", {})) == {"agent-governance", "migration-immutability"}, "Missing governance jobs")
    require("secrets." not in workflow_path.read_text(encoding="utf-8"), "Governance jobs must not depend on secrets")
    for job in workflow["jobs"].values():
        require("permissions" not in job, "Job-level permission override is not permitted")
        require(not job.get("continue-on-error", False), "Governance job cannot ignore failure")
        for step in job.get("steps", []):
            require(not step.get("continue-on-error", False), "Governance step cannot ignore failure")
    return {"skills": len(SKILLS), "roles": len(roles), "cases": len(seen), "markdown": len(markdown), "warnings": warnings}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    args = parser.parse_args()
    try:
        result = validate(args.root)
    except (ValueError, OSError, TypeError, KeyError, yaml.YAMLError) as error:
        parser.exit(1, f"FAIL: {error}\n")
    for warning in result.pop("warnings"):
        print(f"COMPATIBILITY: {warning}")
    print(f"PASS (structural validation only): {json.dumps(result)}")
