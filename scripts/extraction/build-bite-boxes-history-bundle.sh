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
# Preserve the older PR #117 Little Treat development history before the
# canonical app was relocated to systems/. Pin the reviewed historical head.
# The canonical source is still copied from the verified main export below.
legacy_head="fc493bfbfd641ab1e435cbbe0bda756f7279c4c4"
if ! git -C "$source_root" cat-file -e "$legacy_head^{commit}" 2>/dev/null; then
  git -C "$source_root" fetch --no-tags origin "$legacy_head"
fi
root_commit="$(git -C "$source_root" subtree split --prefix=apps/little-treat-kitchen "$legacy_head")"
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
# All legacy paths must be represented by the canonical manifest. Overlay the
# current source so historical PR contents cannot roll back fixes in main.
node - "$stage" "$export_dir" <<'NODE'
const fs=require('node:fs'),path=require('node:path');
const [stage,exportDir]=process.argv.slice(2);
const app=path.join(stage,'apps/little-treat-kitchen');
const m=JSON.parse(fs.readFileSync(path.join(exportDir,'export-manifest.json'),'utf8'));
const expected=new Set(m.files.map(f=>f.path.replace('apps/little-treat-kitchen/','')));
const actual=[];
const walk=(d,p='')=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const rel=path.posix.join(p,e.name);
 if(e.isDirectory())walk(path.join(d,e.name),rel);
 else if(e.isFile())actual.push(rel);
 else throw Error('Non-regular file in legacy subtree: '+rel);
}};
walk(app);
for(const name of actual)if(!expected.has(name))throw Error('Unexpected legacy-only path: '+name);
for(const entry of m.files){
 const rel=entry.path.replace('apps/little-treat-kitchen/','');
 const dest=path.join(app,rel);
 fs.mkdirSync(path.dirname(dest),{recursive:true});
 fs.copyFileSync(path.join(exportDir,entry.path),dest);
}
console.log('Reconciled '+actual.length+' legacy PR files to '+m.files.length+' canonical main files');
NODE
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
echo "History-bearing bundle verified (legacy PR #117 source path and canonical main snapshot)."
echo "No remote repository or production environment modified."
