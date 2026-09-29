import json
import tempfile
import unittest
from pathlib import Path
from check_repository_layout import check


class RepositoryLayoutTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.scripts = {name: "pnpm --dir systems/mgbos check" for name in ("dev:mgbos", "build:mgbos", "install:mgbos", "check:mgbos")}
        self.write_manifest()
        for name in ("systems/mgbos/AGENTS.md", "systems/mgbos/pnpm-lock.yaml", "systems/mgbos/supabase/config.toml", "systems/jarvis/docs/charter.md", "tools/assistant/agent.py"):
            p = self.root / name
            p.parent.mkdir(parents=True, exist_ok=True)
            p.touch()

    def write_manifest(self):
        (self.root / "package.json").write_text(json.dumps({"scripts": self.scripts}), encoding="utf-8")

    def test_owned_runtime_and_business_tools_pass(self):
        self.assertEqual(check(self.root, ["systems/mgbos/apps/mgbos/package.json", "tools/assistant/main.py", "bisnis/teestock/tools/planning.html", "archive/teestock-v1/a.sql"]), [])

    def test_retired_locations_and_business_runtime_fail(self):
        for name in ("mgbos/a.ts", "apps/admin/package.json", "packages/shared/a.js", "memory/history.json", "main.py", "bisnis/teestock/web/a.ts", "bisnis/teestock/schema.sql"):
            with self.subTest(name=name):
                self.assertTrue(check(self.root, [name]))

    def test_archive_runtime_alias_fails(self):
        self.scripts["dev:legacy"] = "npm --prefix archive/teestock-v1/apps/storefront run dev"
        self.write_manifest()
        self.assertTrue(check(self.root, []))

    def test_missing_workspace_and_wrong_router_fail(self):
        (self.root / "systems/mgbos/pnpm-lock.yaml").unlink()
        self.scripts["dev:mgbos"] = "pnpm --dir mgbos dev"
        self.write_manifest()
        self.assertGreaterEqual(len(check(self.root, [])), 2)
