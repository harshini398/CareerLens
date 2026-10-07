import json
from evidence.verification.scoring import analyze_all_skills_evidence

with open("evidence/mock_data/cached_sreya12-code.json", "r") as f:
    raw_data = json.load(f)

skills_evidence = analyze_all_skills_evidence(raw_data)

print(f"{'SKILL':<15} | {'SCORE':<8} | {'LEVEL':<12} | {'REPOS'}")
print("-" * 55)
for skill, data in sorted(skills_evidence.items(), key=lambda x: x[1]['evidence_score'], reverse=True):
    print(f"{skill:<15} | {data['evidence_score']:<8} | {data['level']:<12} | {', '.join(data['repos'])}")
