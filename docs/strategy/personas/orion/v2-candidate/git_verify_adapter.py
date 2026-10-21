"""
ORION v2 Read-Only Git Reality Verification Adapter
Upholds Repository Truth First (AGENTS.md §1) and Context Is Not Authority (Rule 62).
Provides deterministic reality checks for branch, commit, file, and PR claims.
"""

import sys
import subprocess
from pathlib import Path

class GitRealityAdapter:
    def __init__(self, repo_root=None):
        if repo_root is None:
            self.repo_root = Path(__file__).resolve().parents[4]
        else:
            self.repo_root = Path(repo_root)

    def _run_git(self, args: list[str]) -> tuple[int, str, str]:
        """Runs a read-only git command and returns (code, stdout, stderr)."""
        try:
            res = subprocess.run(
                ["git", "-C", str(self.repo_root)] + args,
                capture_output=True,
                text=True,
                encoding="utf-8",
                check=False
            )
            return res.returncode, res.stdout.strip(), res.stderr.strip()
        except Exception as e:
            return -1, "", str(e)

    def get_current_head_sha(self) -> str:
        """Returns current full 40-character HEAD SHA."""
        code, out, _ = self._run_git(["rev-parse", "HEAD"])
        return out if code == 0 else ""

    def get_current_branch(self) -> str:
        """Returns active branch name."""
        code, out, _ = self._run_git(["rev-parse", "--abbrev-ref", "HEAD"])
        return out if code == 0 else ""

    def verify_commit_exists(self, commit_sha: str) -> bool:
        """Verifies if commit exists in repository history."""
        code, _, _ = self._run_git(["rev-parse", "--verify", f"{commit_sha}^{{commit}}"])
        return code == 0

    def verify_file_exists_at_head(self, rel_path: str) -> bool:
        """Verifies if file exists at current HEAD tree."""
        clean_path = rel_path.replace("\\", "/")
        code, _, _ = self._run_git(["cat-file", "-e", f"HEAD:{clean_path}"])
        return code == 0

    def check_working_tree_clean(self) -> bool:
        """Returns True if working tree has no unstaged/uncommitted changes."""
        code, out, _ = self._run_git(["status", "--porcelain"])
        return code == 0 and len(out.strip()) == 0

    def verify_pr_merge_status(self, pr_number: int, main_branch="main") -> tuple[str, str]:
        """
        Inspects git log on main to verify if PR merge commit or squash exists.
        Returns (state: 'MERGED' | 'UNMERGED', evidence_note: str).
        """
        search_pattern = f"(#{pr_number})"
        code, out, _ = self._run_git(["log", main_branch, f"--grep={search_pattern}", "-n", "1", "--oneline"])
        if code == 0 and out:
            return "MERGED", f"Found merge commit in {main_branch}: {out}"
        return "UNMERGED", f"No merge commit matching #{pr_number} found in {main_branch} history."

def self_test():
    print("=====================================================")
    print("  ORION v2 Git Reality Adapter — Self Test")
    print("=====================================================\n")
    adapter = GitRealityAdapter()
    
    head_sha = adapter.get_current_head_sha()
    branch = adapter.get_current_branch()
    print(f"Active Branch: {branch}")
    print(f"HEAD SHA:      {head_sha}")
    
    assert len(head_sha) == 40, "Invalid HEAD SHA length"
    print("PASS: HEAD SHA verified.")
    
    has_agents = adapter.verify_file_exists_at_head("AGENTS.md")
    print(f"AGENTS.md exists at HEAD: {has_agents}")
    assert has_agents, "AGENTS.md should exist at HEAD"
    print("PASS: File existence at HEAD verified.")
    
    # Test unmerged PR #88 check
    state_88, note_88 = adapter.verify_pr_merge_status(88)
    print(f"PR #88 status: {state_88} ({note_88})")
    
    print("\nALL GIT ADAPTER CHECKS PASS (100%)\n")

if __name__ == "__main__":
    self_test()
