"""Mutation tests exercise failure modes, not matching policy prose."""
import importlib.util
import json
import shutil
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("governance", Path(__file__).with_name("validate-agent-governance.py"))
governance = importlib.util.module_from_spec(spec)
spec.loader.exec_module(governance)


class GovernanceValidationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="mgbos-governance-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        # Copy only text source fixtures and their references; never follow the legacy Supabase link.
        for relative in (".agents", "mgbos/docs", "mgbos/packages", ".github/workflows"):
            source = governance.ROOT / relative
            for path in source.rglob("*"):
                if path.is_file() and path.suffix in {".md", ".json", ".ts", ".yml"} and "node_modules" not in path.parts:
                    dest = self.root / path.relative_to(governance.ROOT)
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(path, dest)
        for relative in ("AGENTS.md", "mgbos/AGENTS.md", "mgbos/README.md"):
            shutil.copyfile(governance.ROOT / relative, self.root / relative)

    def edit_json(self, relative, update):
        path = self.root / relative
        data = json.loads(path.read_text(encoding="utf-8"))
        update(data)
        path.write_text(json.dumps(data), encoding="utf-8")

    def test_valid_baseline(self):
        result = governance.validate(self.root)
        self.assertEqual(result["roles"], 5)
        self.assertEqual(len(result["warnings"]), 3)

    def test_capability_escalation_rejected(self):
        self.edit_json(".agents/roles/contracts.json", lambda d: d["roles"][2]["capabilities"].append("deploy-production"))
        with self.assertRaisesRegex(ValueError, "capabilities"):
            governance.validate(self.root)

    def test_missing_role_rejected(self):
        self.edit_json(".agents/roles/contracts.json", lambda d: d["roles"].pop())
        with self.assertRaisesRegex(ValueError, "roles"):
            governance.validate(self.root)

    def test_duplicate_eval_rejected(self):
        self.edit_json(".agents/evals/baseline.json", lambda d: d["cases"].append(d["cases"][0]))
        with self.assertRaisesRegex(ValueError, "eval id"):
            governance.validate(self.root)

    def test_missing_category_rejected(self):
        self.edit_json(".agents/evals/baseline.json", lambda d: d.update(cases=[c for c in d["cases"] if c["category"] != "finance"]))
        with self.assertRaisesRegex(ValueError, "per category"):
            governance.validate(self.root)

    def test_missing_rubric_rejected(self):
        self.edit_json(".agents/evals/baseline.json", lambda d: d["cases"][0].update(forbidden=[]))
        with self.assertRaisesRegex(ValueError, "forbidden"):
            governance.validate(self.root)

    def test_source_escape_rejected(self):
        self.edit_json(".agents/evals/baseline.json", lambda d: d["cases"][0].update(sources=["../outside.md"]))
        with self.assertRaisesRegex(ValueError, "escapes"):
            governance.validate(self.root)

    def test_broken_link_rejected(self):
        path = self.root / ".agents/roles/planner.md"
        path.write_text(path.read_text(encoding="utf-8") + "\n[missing](absent.md)\n", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "Broken link"):
            governance.validate(self.root)

    def test_empty_role_contract_rejected(self):
        (self.root / ".agents/roles/qa.md").write_text("\n", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "Empty instruction"):
            governance.validate(self.root)

    def test_empty_description_rejected(self):
        path = self.root / ".agents/skills/mgbos-change-planner/SKILL.md"
        path.write_text("---\nname: mgbos-change-planner\ndescription: ''\n---\n# Planner\n", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "description"):
            governance.validate(self.root)

    def test_duplicate_frontmatter_rejected(self):
        path = self.root / ".agents/skills/mgbos-change-planner/SKILL.md"
        path.write_text("---\nname: mgbos-change-planner\nname: hidden\ndescription: Plan\n---\n# Planner\n", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "Duplicate YAML"):
            governance.validate(self.root)

    def test_privileged_workflow_rejected(self):
        path = self.root / ".github/workflows/agent-governance.yml"
        path.write_text(path.read_text(encoding="utf-8").replace("contents: read", "contents: write"), encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "read-only"):
            governance.validate(self.root)

    def test_workflow_failure_bypass_rejected(self):
        path = self.root / ".github/workflows/agent-governance.yml"
        path.write_text(path.read_text(encoding="utf-8").replace("timeout-minutes: 10", "timeout-minutes: 10\n    continue-on-error: true"), encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "ignore failure"):
            governance.validate(self.root)


if __name__ == "__main__":
    unittest.main()
