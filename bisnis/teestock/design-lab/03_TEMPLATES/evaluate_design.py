"""
TEEStock CRAFT — Automated TDQS Evaluator & Hard Gate Checker
Tool pendukung untuk menilai kelayakan komersial artwork apparel.
"""

import sys
import argparse
from datetime import datetime

WEIGHTS = {
    "concept_originality": 0.20,
    "visual_impact": 0.20,
    "typography_composition": 0.15,
    "brand_consistency": 0.15,
    "wearability_appeal": 0.15,
    "production_readiness": 0.15,
}

def calculate_tdqs(scores):
    """
    scores: dict dengan key nama kriteria dan value skor 1.0 - 5.0
    Mengembalikan: float skor total (0 - 100)
    """
    total = 0.0
    for key, weight in WEIGHTS.items():
        score = scores.get(key, 0.0)
        # Normalisasi: skor 1-5 dikali bobot dikali 20
        total += score * weight * 20.0
    return round(total, 2)

def evaluate_artwork(design_id, design_name, scores, hard_gates):
    """
    hard_gates: dict dengan key: commercial_rights (bool), neon_transparency (bool), canvas_300ppi (bool)
    """
    tdqs = calculate_tdqs(scores)
    
    # Periksa hard gates
    failed_gates = [gate for gate, passed in hard_gates.items() if not passed]
    
    if failed_gates:
        status = "REJECTED_HARD_GATE_FAILURE"
        decision = f"BLOCKED: Gagal pada Hard Gate: {', '.join(failed_gates)}. Dilarang diproduksi!"
    elif tdqs >= 85.0:
        status = "APPROVED"
        decision = "APPROVED FOR PRODUCTION: Karya memenuhi standar estetika dan teknis cetak."
    elif tdqs >= 70.0:
        status = "NEEDS_REFINEMENT"
        decision = "NEEDS REFINEMENT: Lakukan controlled iteration pada komponen yang bernilai < 4.0."
    else:
        status = "REVISE_OR_REJECT"
        decision = "REJECT / REVISE CONCEPT: Konsep atau eksekusi di bawah standar minimum studio."
        
    report = f"""
================================================================================
TEEStock CRAFT EVALUATION REPORT
================================================================================
Design ID    : {design_id}
Design Name  : {design_name}
Timestamp    : {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
--------------------------------------------------------------------------------
1. TEEStock DESIGN QUALITY SCORE (TDQS): {tdqs} / 100
   - Concept & Originality (20%)       : {scores.get('concept_originality')}/5 -> {scores.get('concept_originality',0)*4:.1f} pts
   - Visual Impact (20%)               : {scores.get('visual_impact')}/5 -> {scores.get('visual_impact',0)*4:.1f} pts
   - Typography & Composition (15%)    : {scores.get('typography_composition')}/5 -> {scores.get('typography_composition',0)*3:.1f} pts
   - Brand & Collection Consistency (15%): {scores.get('brand_consistency')}/5 -> {scores.get('brand_consistency',0)*3:.1f} pts
   - Wearability & Market Appeal (15%) : {scores.get('wearability_appeal')}/5 -> {scores.get('wearability_appeal',0)*3:.1f} pts
   - Production Readiness (15%)        : {scores.get('production_readiness')}/5 -> {scores.get('production_readiness',0)*3:.1f} pts
--------------------------------------------------------------------------------
2. HARD PRODUCTION GATES:
   - Commercial Rights Clearance       : {'PASS [OK]' if hard_gates.get('commercial_rights') else 'FAIL [BLOCKING]'}
   - DTF Neon Transparency (Zero Halo) : {'PASS [OK]' if hard_gates.get('neon_transparency') else 'FAIL [BLOCKING]'}
   - Canvas 300 PPI Physical Sizing    : {'PASS [OK]' if hard_gates.get('canvas_300ppi') else 'FAIL [BLOCKING]'}
--------------------------------------------------------------------------------
FINAL STATUS : {status}
DECISION     : {decision}
================================================================================
"""
    return tdqs, status, report

if __name__ == "__main__":
    # Contoh simulasi evaluasi TS-OR-HC001 (Stupidity)
    sample_scores = {
        "concept_originality": 4.5,
        "visual_impact": 4.5,
        "typography_composition": 4.2,
        "brand_consistency": 4.8,
        "wearability_appeal": 4.0,
        "production_readiness": 4.8
    }
    sample_gates = {
        "commercial_rights": True,
        "neon_transparency": True,
        "canvas_300ppi": True
    }
    tdqs, status, report = evaluate_artwork("TS-OR-HC001", "Stupidity", sample_scores, sample_gates)
    print(report)
