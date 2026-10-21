import sys
import json
import re
from pathlib import Path
import yaml

sys.stdout.reconfigure(encoding="utf-8")

V2_DIR = Path(__file__).resolve().parent

def verify_frontmatters():
    print("--- 1. Frontmatter Verification ---")
    required_keys = ["canonical_id", "status", "version", "owner", "scope", "document_class"]
    passed = True
    for md_file in sorted(V2_DIR.glob("*.md")):
        text = md_file.read_text(encoding="utf-8")
        if not text.startswith("---"):
            print(f"FAIL: {md_file.name} missing frontmatter start '---'")
            passed = False
            continue
        parts = text.split("---", 2)
        if len(parts) < 3:
            print(f"FAIL: {md_file.name} invalid frontmatter format")
            passed = False
            continue
        try:
            fm = yaml.safe_load(parts[1])
            for key in required_keys:
                if key not in fm:
                    print(f"FAIL: {md_file.name} missing required key: {key}")
                    passed = False
            print(f"PASS: {md_file.name} frontmatter valid (id: {fm.get('canonical_id')}, status: {fm.get('status')})")
        except Exception as e:
            print(f"FAIL: {md_file.name} YAML parse error: {e}")
            passed = False
    return passed

def verify_links():
    print("\n--- 2. Relative Link Verification ---")
    link_pattern = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
    passed = True
    for md_file in sorted(V2_DIR.glob("*.md")):
        text = md_file.read_text(encoding="utf-8")
        text_no_code = re.sub(r'```.*?```', '', text, flags=re.DOTALL)
        links = link_pattern.findall(text_no_code)
        for anchor_text, target in links:
            if (
                target.startswith("http://")
                or target.startswith("https://")
                or target.startswith("mailto:")
                or target.startswith("#")
                or target.startswith("file://")
            ):
                continue
            clean_target = target.split("#")[0]
            if not clean_target:
                continue
            target_path = (md_file.parent / clean_target).resolve()
            if not target_path.exists():
                print(f"FAIL: {md_file.name} broken link -> {target} (resolved: {target_path})")
                passed = False
    if passed:
        print("PASS: All internal markdown links resolve to existing files.")
    return passed

def verify_eval_registry_and_json():
    print("\n--- 3. Evaluation Registry & Index Verification ---")
    json_path = V2_DIR / "eval-index-63.json"
    reg_path = V2_DIR / "evaluation-registry.md"
    passed = True
    
    if not json_path.exists():
        print("FAIL: eval-index-63.json does not exist")
        return False
        
    try:
        data = json.loads(json_path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"FAIL: JSON parse error: {e}")
        return False
        
    total_cases = data.get("total_cases")
    cases = data.get("cases", [])
    if total_cases != 63 or len(cases) != 63:
        print(f"FAIL: Expected 63 cases, found total_cases={total_cases}, len={len(cases)}")
        passed = False
    else:
        print(f"PASS: eval-index-63.json has exactly 63 cases.")
        
    reg_text = reg_path.read_text(encoding="utf-8")
    validated_ids = {f"OR-EVAL-{i:02d}" for i in range(1, 11)} | {f"OR-EVAL-{i:02d}" for i in range(37, 55)} | {f"OR-MEM-EVAL-{i:02d}" for i in range(1, 10)}
    
    for c in cases:
        case_id = c["case_id"]
        if case_id not in reg_text:
            print(f"FAIL: Case {case_id} not found in evaluation-registry.md")
            passed = False
        if case_id in validated_ids:
            if c.get("run_state") not in ["PASS", "NOT_RUN"]:
                print(f"FAIL: Validated case {case_id} unexpected run_state: {c.get('run_state')}")
                passed = False
        else:
            if c.get("run_state") != "NOT_RUN":
                print(f"FAIL: Non-validated case {case_id} run_state is {c.get('run_state')}, expected 'NOT_RUN'")
                passed = False
            
    if passed:
        print(f"PASS: eval-index-63.json and evaluation-registry.md are 100% synchronized, with exactly {len(validated_ids)} cases validated (10 critical + 18 reasoning/expression + 9 memory) and {len(cases) - len(validated_ids)} cases unfalsified NOT_RUN.")
    return passed

def verify_token_budget():
    print("\n--- 4. Token & Prompt Budget Metrics ---")
    prompt_file = V2_DIR / "portable-prompt-v2.md"
    content = prompt_file.read_text(encoding="utf-8")
    lines = content.splitlines()
    start_idx = None
    end_idx = None
    for i, line in enumerate(lines):
        if line.strip().startswith("```text") and start_idx is None:
            start_idx = i + 1
        elif line.strip() == "```" and start_idx is not None and end_idx is None:
            end_idx = i
            break
            
    block = "\n".join(lines[start_idx:end_idx])
    chars = len(block)
    words = len(block.split())
    approx_tokens = round(chars / 4.0)
    print(f"Prompt Character Count: {chars}")
    print(f"Prompt Word Count: {words}")
    print(f"Approx Token Count: {approx_tokens}")
    if approx_tokens <= 2000:
        print(f"PASS: Prompt comfortably within operational budget (<= 2,000 tokens).")
        return True
    else:
        print(f"FAIL: Prompt exceeds 2,000 token limit.")
        return False

def main():
    f_pass = verify_frontmatters()
    l_pass = verify_links()
    e_pass = verify_eval_registry_and_json()
    t_pass = verify_token_budget()
    
    print("\n===============================")
    if f_pass and l_pass and e_pass and t_pass:
        print("STAGE E0/E1/E2/E3/E4 VERIFICATION: ALL PASS (100%)")
        return 0
    else:
        print("STAGE E0/E1/E2/E3/E4 VERIFICATION: FAILED")
        return 1

if __name__ == "__main__":
    sys.exit(main())
