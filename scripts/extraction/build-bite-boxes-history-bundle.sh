#!/usr/bin/env bash
# Produce a history-bearing Git bundle of the canonical Little Treat subtree.
# No pushing, database access, secrets, or production deployment.
set -euo pipefail
if [[ "$#" -ne 2 ]]; then
  echo "Usage: bash scripts/extraction/build-bite-boxes-history-bundle.sh /export/dir /output/bundle" >&2
  exit 2
fi
source_root="$(git rev-parse --show-toplevel)"
export_dir="$(realpath "$1")"
bundle_file="$(realpath -m "$2")"
if [[ ! -f "$export_dir/export-manifest.json" ]]; then
  echo "Run prepare-bite-boxes.mjs first" >&2
  exit 2
fi
if ! git -C "$source_root" diff --quiet HEAD -- systems/little-treat-kitchen; then
  echo "Refusing to bundle uncommitted app changes" >&2
  exit 1
fi
stage="$(mktemp -d)"
validate="$(mktemp -d)"
branch="bite-boxes-import"
cleanup() {
  git -C "$source_root" worktree remove --force "$stage" >/dev/null 2>&1 || true
  git -C "$source_root" branch -D "$branch" >/dev/null 2>&1 || true
  rm -rf "$validate"
}
trap cleanup EXIT
# Git subtree retains the history of this particular path; earlier historical
# paths are not included. The original BisnisHub repo and history remain intact.
root_commit="$(git -C "$source_root" subtree split --prefix=systems/little-treat-kitchen HEAD)"
if [[ -z "$root_commit" ]]; then
  echo "Git subtree did not find Little Treat history" >&2
  exit 1
fi
git -C "$source_root" worktree add --detach "$stage" "$root_commit" >/dev/null
git -C "$stage" switch -c "$branch" >/dev/null
mkdir -p "$stage/apps/little-treat-kitchen"
while IFS= read -r -d '' relative; do
  mkdir -p "$stage/apps/little-treat-kitchen/$(dirname "$relative")"
  git -C "$stage" mv -- "$relative" "apps/little-treat-kitchen/$relative"
done < <(git -C "$stage" ls-files -z)
node - "$stage" "$export_dir" <<'NODE'
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const [stage,exportDir]=process.argv.slice(2);
const m=JSON.parse(fs.readFileSync(path.join(exportDir,'export-manifest.json'),'utf8'));
if(m.fileCount!==m.files.length||m.files.length<35)throw Error('Unexpected manifest count');
for(const entry of m.files){
  if(!entry.path.startsWith('apps/little-treat-kitchen/'))throw Error('Unexpected path');
  const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(stage,entry.path))).digest('hex');
  if(hash!==entry.sha256)throw Error('Mismatch: '+entry.path);
}
console.log('Verified '+m.files.length+' source SHA-256 records');
NODE
for file in README.md AGENTS.md package.json .gitignore export-manifest.json; do
  cp "$export_dir/$file" "$stage/$file"
done
for dir in .github docs static-preview; do
  cp -R "$export_dir/$dir" "$stage/$dir"
done
git -C "$stage" add -A
git -C "$stage" -c user.name="BisnisHub migration automation" \
  -c user.email="bisnishub-migration@users.noreply.github.com" \
  commit -m "chore: prepare Bite Boxes from Little Treat history" >/dev/null
mkdir -p "$(dirname "$bundle_file")"
git -C "$stage" bundle create "$bundle_file" "refs/heads/$branch"
git -C "$stage" bundle verify "$bundle_file" >/dev/null 2>&1
git clone --quiet --branch "$branch" "$bundle_file" "$validate/clone"
cd "$validate/clone"
node --test apps/little-treat-kitchen/*.test.cjs
echo "History-bearing bundle verified (from systems/little-treat-kitchen/)."
echo "No remote repository or production environment modified."
