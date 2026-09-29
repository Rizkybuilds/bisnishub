"""Offline relocation regression: never import a live provider or real memory."""
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


class AssistantPathsTest(unittest.TestCase):
    def test_paths_are_independent_of_launch_directory(self):
        for launch_at_tool in (False, True):
            with self.subTest(launch_at_tool=launch_at_tool), tempfile.TemporaryDirectory() as temp:
                root = Path(temp)
                tool = root / "tools" / "assistant"
                (tool / "prompts").mkdir(parents=True)
                (tool / "memory").mkdir()
                for name in ("agent.py", "main.py"):
                    shutil.copyfile(Path(__file__).with_name(name), tool / name)
                (tool / "prompts/mentor_persona.md").write_text("fixture persona", encoding="utf-8")
                (tool / "memory/business_profile.json").write_text('{"fixture": true}', encoding="utf-8")
                code = f'''
import sys, types, pathlib, runpy
root = pathlib.Path({str(root)!r})
tool = root / 'tools/assistant'
sys.path.insert(0, str(tool))
provider = types.ModuleType('anthropic')
provider.Anthropic = lambda: object()
sys.modules['anthropic'] = provider
env = types.ModuleType('dotenv')
loaded = []
env.load_dotenv = lambda path: loaded.append(path)
sys.modules['dotenv'] = env
import agent
assert loaded == [root / '.env']
assert agent.NOTES_SESSION_DIR == root / 'catatan/sesi'
a = agent.MentorAgent()
assert a.persona == 'fixture persona'
assert a.business_profile == {{'fixture': True}}
a.history = [{{'role':'user','content':'synthetic fixture'}}]
a.save_session()
assert (tool / 'memory/history.json').is_file()
assert list((root / 'catatan/sesi').glob('*.md'))
assert not (tool / 'catatan').exists()
runpy.run_path(str(tool / 'main.py'), run_name='offline_import')
'''
                result = subprocess.run([sys.executable, "-c", code], cwd=tool if launch_at_tool else root, capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
