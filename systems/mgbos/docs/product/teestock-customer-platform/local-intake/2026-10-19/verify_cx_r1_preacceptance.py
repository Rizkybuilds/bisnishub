from pathlib import Path
from zipfile import ZipFile
from hashlib import sha256
import csv, re, json, yaml
base=Path('/mnt/data/teestock-cx-r1')
archive=Path('/mnt/data/teestock-cx-remediation-r1-candidate.zip')
docs=sorted(base.glob('cx-*.md'))
results={'archive':str(archive),'archive_sha256':sha256(archive.read_bytes()).hexdigest(),'archive_corruption':None,'archive_matches_local':True,'manifest_matches_local':True,'document_count':len(docs),'version_mismatch':[],'trace_rows':0,'parent_valid':False,'all_child_ids_declared':True,'all_acceptance_ids_declared':True,'bad_trace_rows':[],'parent_coverage':[],'document_versions':{},'review_scope':'STRUCTURAL_ONLY_NOT_SEMANTIC_ACCEPTANCE'}
with ZipFile(archive) as f:
 results['archive_corruption']=f.testzip()
 for name in f.namelist():
  if not (base/Path(name).name).exists() or (base/Path(name).name).read_bytes()!=f.read(name):results['archive_matches_local']=False
for line in (base/'SHA256SUMS.txt').read_text().splitlines():
 m=re.match(r'([0-9a-f]{64})\s{2}(.+)',line)
 if not m or not (base/m.group(2)).exists() or sha256((base/m.group(2)).read_bytes()).hexdigest()!=m.group(1):results['manifest_matches_local']=False
for p in docs:
 s=p.read_text()
 meta=yaml.safe_load(s.split('---',2)[1]);v=str(meta.get('version'))
 title=re.search(r'^# .*?v(\d+\.\d+\.\d+)\s*$',s,re.M)
 results['document_versions'][p.name]={'metadata':v,'title':title.group(1) if title else None,'status':meta.get('status')}
 if title and title.group(1)!=v:results['version_mismatch'].append(p.name)
# semantic reviewer must inspect content and intent; this script verifies native definitions only
native={}
for p in docs:
 s=p.read_text()
 before=s.split('## Appendix — R1 Exact-ID Traceability')[0].split('## 26. R1 Exact-ID Traceability')[0]
 for ln in before.splitlines():
  m=re.match(r'^\| `((?:CX[1-9])-(?:FR|AC|QR|BP)-\d{3})` \|',ln)
  if m and int(m.group(1)[2])==int(p.name[3:5]): native[m.group(1)]=p.name
 # special possible CX2-BP headings
 for m in re.finditer(r'^(?:#{1,4}) .*(CX2-BP-\d{2})',before,re.M):native[m.group(1)]=p.name
with (base/'CX-PKG-TRACE-R1.csv').open() as f:rows=list(csv.DictReader(f))
results['trace_rows']=len(rows)
master_declared={k for k,v in native.items() if k.startswith('CX1-FR-')}
master_claimed={r['master_id'] for r in rows}
results['parent_valid']=(len(master_claimed)==46 and len(master_declared)==46 and master_claimed==master_declared)
results['parent_coverage']=sorted(master_declared-master_claimed)
for r in rows:
 bad=[]
 for id in r['declared_child_ids'].split(';'):
  if id not in native: bad.append('child_missing:'+id)
 for id in r['acceptance_id'].split(';'):
  if id not in native:bad.append('acceptance_missing:'+id)
 if bad:results['bad_trace_rows'].append({'id':r['master_id'],'issues':bad})
results['all_child_ids_declared']=not any('child_missing' in j for r in results['bad_trace_rows'] for j in r['issues'])
results['all_acceptance_ids_declared']=not any('acceptance_missing' in j for r in results['bad_trace_rows'] for j in r['issues'])
results['native_declaration_count']=len(native)
Path('/mnt/data/CX-R1-PREAUDIT-EVIDENCE.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({k:v for k,v in results.items() if k!='document_versions'},indent=2))
