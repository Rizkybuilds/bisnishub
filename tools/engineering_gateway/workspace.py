"""Shared revision-bound workspace snapshot and content-sensitive fingerprinting."""

from __future__ import annotations

import hashlib
import os
import subprocess
from pathlib import Path
from typing import Any

FINGERPRINT_VERSION = "bisnishub-workspace-fingerprint-v2"
CHUNK_SIZE = 65536


def _require(
    condition: bool,
    message: str,
) -> None:
    if not condition:
        raise ValueError(message)


def _run_git(
    root: Path,
    *args: str,
) -> bytes:
    result = subprocess.run(
        [
            "git",
            "-C",
            str(root),
            *args,
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    _require(
        result.returncode == 0,
        (
            "Git command failed: "
            + " ".join(["git", "-C", str(root), *args])
            + "\n"
            + result.stderr.decode("utf-8", errors="replace").strip()
        ),
    )
    return result.stdout


def _run_git_text(
    root: Path,
    *args: str,
) -> str:
    return _run_git(root, *args).decode("utf-8", errors="replace").strip()


def workspace_state(
    root: Path,
) -> dict[str, Any]:
    resolved_root = Path(root).resolve()
    _require(
        resolved_root.is_dir(),
        f"Workspace root does not exist: {root}",
    )

    pre_branch = _run_git_text(
        resolved_root,
        "rev-parse",
        "--abbrev-ref",
        "HEAD",
    )
    pre_head = _run_git_text(
        resolved_root,
        "rev-parse",
        "HEAD",
    )

    status_bytes = _run_git(
        resolved_root,
        "status",
        "--porcelain=v1",
        "-z",
        "--untracked-files=all",
    )
    diff_bytes = _run_git(
        resolved_root,
        "diff",
        "--binary",
        "--full-index",
        "--no-ext-diff",
        "--no-textconv",
        "HEAD",
        "--",
    )
    untracked_bytes = _run_git(
        resolved_root,
        "ls-files",
        "--others",
        "--exclude-standard",
        "-z",
    )

    hasher = hashlib.sha256()
    hasher.update(
        f"{FINGERPRINT_VERSION}\n".encode("utf-8")
    )
    hasher.update(b"status:\n")
    hasher.update(status_bytes)
    hasher.update(b"\ndiff:\n")
    hasher.update(diff_bytes)
    hasher.update(b"\nuntracked:\n")

    raw_entries = [
        item.decode("utf-8", errors="replace")
        for item in untracked_bytes.split(b"\0")
        if item
    ]
    raw_entries.sort()

    for rel_path in raw_entries:
        full_path = resolved_root / rel_path
        if os.path.islink(full_path):
            target = os.readlink(full_path)
            hasher.update(
                f"symlink:{rel_path}:{target}\n".encode("utf-8")
            )
        elif full_path.is_file():
            hasher.update(
                f"file:{rel_path}:".encode("utf-8")
            )
            file_hasher = hashlib.sha256()
            try:
                with full_path.open("rb") as handle:
                    while chunk := handle.read(CHUNK_SIZE):
                        file_hasher.update(chunk)
            except OSError as error:
                raise ValueError(
                    f"Failed to hash untracked file {rel_path}: {error}"
                ) from error
            hasher.update(
                file_hasher.hexdigest().encode("utf-8")
                + b"\n"
            )
        else:
            hasher.update(
                f"special:{rel_path}\n".encode("utf-8")
            )

    post_branch = _run_git_text(
        resolved_root,
        "rev-parse",
        "--abbrev-ref",
        "HEAD",
    )
    post_head = _run_git_text(
        resolved_root,
        "rev-parse",
        "HEAD",
    )

    _require(
        pre_branch == post_branch and pre_head == post_head,
        (
            "Workspace revision changed during snapshot capture: "
            f"branch ({pre_branch} -> {post_branch}), "
            f"head ({pre_head} -> {post_head})"
        ),
    )

    dirty = bool(status_bytes.strip(b"\0"))
    digest = hasher.hexdigest()
    dirty_fingerprint = f"sha256:{digest}"

    return {
        "path": str(resolved_root),
        "branch": pre_branch,
        "head": pre_head,
        "dirty": dirty,
        "dirty_fingerprint": dirty_fingerprint,
    }


def workspace_dirty_fingerprint(
    root: Path,
) -> str:
    return workspace_state(root)["dirty_fingerprint"]
