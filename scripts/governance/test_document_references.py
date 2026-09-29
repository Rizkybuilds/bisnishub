import tempfile
import unittest
from pathlib import Path
from check_document_references import check_document


class DocumentReferencesTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.doc = self.root / "docs" / "spec.md"
        self.doc.parent.mkdir()
        (self.root / "owner.md").touch()

    def check(self, header):
        self.doc.write_text(f"---\n{header}\n---\n# Specification\n", encoding="utf-8")
        return check_document(self.root, self.doc)

    def test_valid_relative_path_and_canonical_id(self):
        self.assertEqual(self.check("depends_on: [../owner.md]\nsupersedes: system.old-spec"), [])

    def test_missing_peer_rejected(self):
        self.assertTrue(self.check("depends_on: [owner.md]"))

    def test_wrong_extension_rejected(self):
        (self.doc.parent / "statemachinesmd").touch()
        self.assertTrue(self.check("depends_on: [statemachines.md]"))

    def test_escape_rejected(self):
        self.assertTrue(self.check("depends_on: [../../outside.md]"))

    def test_invalid_metadata_rejected(self):
        self.assertTrue(self.check("depends_on: [123]"))
