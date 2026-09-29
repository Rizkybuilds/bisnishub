"""Check declared local dependencies of committed canonical documentation."""
import re
import subprocess
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
PREFIXES = ("docs/governance/", "docs/architecture/", "systems/mgbos/docs/architecture/", "systems/jarvis/docs/")


def check_document(root, path):
    text = path.read_text(encoding="utf-8")
    match = re.match(r"\A---\n(.*?)\n---(?:\n|$)", text, re.S)
    if not match:
        return []
    data = yaml.safe_load(match.group(1)) or {}
    errors = []
    for field in ("depends_on", "supersedes", "implementation_basis"):
        values = data.get(field) or []
        if isinstance(values, str):
            values = [values]
        if not isinstance(values, list) or any(not isinstance(value, str) for value in values):
            errors.append(f"{path.relative_to(root)}: invalid {field}")
            continue
        for value in values:
            # Canonical IDs are semantic references; this check only owns paths.
            if "/" not in value and not value.endswith(".md"):
                continue
            target = (path.parent / value).resolve()
            if not target.is_relative_to(root.resolve()) or not target.exists():
                errors.append(f"{path.relative_to(root)}: unresolved {field}: {value}")
    return errors


if __name__ == "__main__":
    names = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).decode("utf-8").split("\0")
    errors = []
    count = 0
    for name in names:
        if name.startswith(PREFIXES) and name.endswith(".md"):
            errors.extend(check_document(ROOT, ROOT / name))
            count += 1
    for error in errors:
        print(error)
    if errors:
        raise SystemExit(1)
    print(f"PASS: declared local references in {count} committed documents")
