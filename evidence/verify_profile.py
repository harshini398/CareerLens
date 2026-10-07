import json
import os
from evidence.github.parser import extract_profile_signals
from evidence.github.originality import evaluate_profile_originality
from evidence.verification.scoring import analyze_all_skills_evidence
from evidence.verification.matcher import verify_all_claims
from evidence.coding.leetcode import LeetCodeCollector
from evidence.design.portfolio_verifier import DesignPortfolioVerifier
from evidence.verification.contradictions import CrossSourceContradictionDetector
from evidence.timeline.velocity import SkillTimelineEngine

def run_evidence_pipeline(github_username: str, claims_file: str = "evidence/mock_data/sample_candidate.json") -> dict:
    """
    Complete end-to-end evidence verification pipeline.
    Combines GitHub, LeetCode, Design portfolios, Contradiction checks, and Skill Timelines.
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

    # 7. Competitive Programming (LeetCode) Ingestion
    leetcode_data = LeetCodeCollector().get_user_stats(github_username)

    # 8. Design Portfolio (Figma / Behance) Ingestion
    design_data = DesignPortfolioVerifier().evaluate_portfolio_url("https://www.figma.com/@portfolio")

    # 9. Cross-Source Contradiction Detection
    contradictions = CrossSourceContradictionDetector().detect_contradictions(
        claims, raw_github, skills_evidence
    )

    # 10. Chronological Skill Timeline & Learning Velocity
    timeline_data = SkillTimelineEngine().build_skill_timeline(raw_github)

    # 11. Assemble Master JSON Deliverable
    master_result = {
        "candidate": candidate_data.get("candidate", {}),
        "summary": {
            "repositories_analyzed": len(raw_github.get("repositories", [])),
            "originality_confidence": originality["overall_originality_confidence"],
            "languages_distribution": signals["languages"],
            "engineering_summary": signals["summary"]
        },
        "skills_evidence": skills_evidence,
        "claims_verification": claims_verification,
        "leetcode_evidence": leetcode_data,
        "design_portfolio": design_data,
        "contradictions": contradictions,
        "timeline_analysis": timeline_data
    }

    # Save output for Person 3 & Person 4
    output_path = f"evidence/mock_data/evidence_output_{github_username}.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(master_result, f, indent=2)

    return master_result

if __name__ == "__main__":
    result = run_evidence_pipeline("sreya12-code")
    
    print("\n" + "=" * 68)
    print("        CAREERLENS — CLAIM-EVIDENCE VERIFICATION MATRIX        ")
    print("=" * 68)
    print(f"{'CLAIMED SKILL':<15} | {'LEVEL':<12} | {'EVIDENCE':<10} | {'STATUS'}")
    print("-" * 68)
    for c in result["claims_verification"]:
        status_icon = "[VERIFIED]" if c['status'] == "VERIFIED" else ("[PARTIAL]" if c['status'] == "PARTIAL" else "[UNSUPPORTED]")
        print(f"{c['skill']:<15} | {c['claimed_level']:<12} | {c['evidence_score']:<10} | {status_icon}")
    
    print("-" * 68)
    print(f"Originality Confidence : {result['summary']['originality_confidence']}%")
    print(f"Learning Velocity Score: {result['timeline_analysis']['learning_velocity_score']}% ({result['timeline_analysis']['velocity_tier']})")
    
    leetcode = result["leetcode_evidence"]
    if leetcode.get("verified"):
        print(f"LeetCode Verified      : {leetcode['total_solved']} problems solved (Score: {leetcode['evidence_score']}/100)")
    
    design = result["design_portfolio"]
    if design.get("verified"):
        print(f"Design Portfolio ({design['source']}): Score {design['evidence_score']}/100")
        
    print(f"\nContradictions Flagged : {len(result['contradictions'])}")
    for item in result["contradictions"]:
        print(f" [!] [{item['severity']}] {item['skill']}: {item['observation']}")

    print(f"\nDeliverable exported to: evidence/mock_data/evidence_output_sreya12-code.json\n")