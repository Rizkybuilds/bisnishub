"""Repository boundaries; inspect tracked paths, never traverse legacy junctions."""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OLD_ROOTS = ("mgbos/", "apps/", "packages/", "prompts/", "memory/", "scratch/")
OLD_FILES = {"agent.py", "main.py", "requirements.txt"}
RUNTIME_SUFFIXES = {".js", ".jsx", ".ts", ".tsx", ".mjs", ".py", ".sql"}


def check(root, files):
    errors = []
    for name in files:
        if name.startswith(OLD_ROOTS) or name in OLD_FILES:
            errors.append(f"Retired root location: {name}")
        if name.startswith("bisnis/") and (Path(name).suffix in RUNTIME_SUFFIXES or Path(name).name in {"package.json", "pnpm-lock.yaml"}):
            errors.append(f"Runtime belongs in systems/tools/archive, not business knowledge: {name}")
    manifest = json.loads((root / "package.json").read_text(encoding="utf-8"))
    for name, command in manifest.get("scripts", {}).items():
        if re.search(r"archive[/\\]|apps/bisnishub-web|--dir mgbos(?:\s|$)", command):
            errors.append(f"Root command consumes retired runtime: {name}")
    for name in ("dev:mgbos", "build:mgbos", "install:mgbos", "check:mgbos"):
        if "--dir systems/mgbos " not in manifest.get("scripts", {}).get(name, ""):
            errors.append(f"Missing official workspace router: {name}")
    for name in ("systems/mgbos/AGENTS.md", "systems/mgbos/pnpm-lock.yaml", "systems/mgbos/supabase/config.toml", "systems/jarvis/docs/charter.md", "tools/assistant/agent.py"):
        if not (root / name).is_file():
            errors.append(f"Missing owned entry point: {name}")
    return errors


if __name__ == "__main__":
    files = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).decode("utf-8").split("\0")
    errors = check(ROOT, [name for name in files if name])
    for error in errors:
        print(error)
    if errors:
        raise SystemExit(1)
    print("PASS: repository locations and active root commands")
