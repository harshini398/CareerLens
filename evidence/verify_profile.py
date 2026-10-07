import json
import os
from evidence.github.parser import extract_profile_signals
from evidence.github.originality import evaluate_profile_originality
from evidence.verification.scoring import analyze_all_skills_evidence
from evidence.verification.matcher import verify_all_claims

def run_evidence_pipeline(github_username: str, claims_file: str = "evidence/mock_data/sample_candidate.json") -> dict:
    """
    Complete end-to-end evidence verification pipeline.
    Produces the exact deliverable required by Person 3 (Scoring) and Person 4 (Backend).
    """
    # 1. Load cached or fetch raw GitHub data
    cache_path = f"evidence/mock_data/cached_{github_username}.json"
    if os.path.exists(cache_path):
        with open(cache_path, "r", encoding="utf-8") as f:
            raw_github = json.load(f)
    else:
        from evidence.github.collector import collect_github_profile
        raw_github = collect_github_profile(github_username)

    # 2. Load candidate claims from resume
    with open(claims_file, "r", encoding="utf-8") as f:
        candidate_data = json.load(f)
    claims = candidate_data.get("claims", [])

    # 3. Extract Engineering Signals
    signals = extract_profile_signals(raw_github)

    # 4. Evaluate Originality Confidence
    originality = evaluate_profile_originality(raw_github, signals)

    # 5. Calculate Skill Evidence Scores
    skills_evidence = analyze_all_skills_evidence(raw_github)

    # 6. Verify Claims against Evidence
    claims_verification = verify_all_claims(claims, skills_evidence, raw_github)

    # 7. Assemble Final Master JSON Deliverable
    master_result = {
        "candidate": candidate_data.get("candidate", {}),
        "summary": {
            "repositories_analyzed": len(raw_github.get("repositories", [])),
            "originality_confidence": originality["overall_originality_confidence"],
            "languages_distribution": signals["languages"],
            "engineering_summary": signals["summary"]
        },
        "skills_evidence": skills_evidence,
        "claims_verification": claims_verification
    }

    # Save output for Person 3 & Person 4
    output_path = f"evidence/mock_data/evidence_output_{github_username}.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(master_result, f, indent=2)

    return master_result

if __name__ == "__main__":
    result = run_evidence_pipeline("sreya12-code")
    
    print("\n" + "=" * 65)
    print("        CAREERLENS — CLAIM-EVIDENCE VERIFICATION MATRIX        ")
    print("=" * 65)
    print(f"{'CLAIMED SKILL':<15} | {'LEVEL':<12} | {'EVIDENCE':<10} | {'STATUS'}")
    print("-" * 65)
    for c in result["claims_verification"]:
        status_icon = "✅ VERIFIED" if c['status'] == "VERIFIED" else ("🟡 PARTIAL" if c['status'] == "PARTIAL" else "❌ UNSUPPORTED")
        print(f"{c['skill']:<15} | {c['claimed_level']:<12} | {c['evidence_score']:<10} | {status_icon}")
    
    print("-" * 65)
    print(f"Originality Confidence: {result['summary']['originality_confidence']}%")
    print(f"Deliverable exported to: evidence/mock_data/evidence_output_sreya12-code.json\n")