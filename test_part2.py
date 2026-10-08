import json
from evidence.github.parser import extract_profile_signals
from evidence.github.originality import evaluate_profile_originality

# Load your cached data
with open("evidence/mock_data/cached_sreya12-code.json", "r") as f:
    raw_data = json.load(f)

# 1. Extract Signals
signals = extract_profile_signals(raw_data)
print("--- Languages Breakdown ---")
print(signals["languages"])

print("\n--- Engineering Signals Summary ---")
print(signals["summary"])

# 2. Evaluate Originality
originality = evaluate_profile_originality(raw_data, signals)
print(f"\n--- Overall Originality Confidence: {originality['overall_originality_confidence']}% ---")
for r in originality["repository_evaluations"][:3]:
    print(f"[{r['repo_name']}] Score: {r['originality_confidence']}% | Positives: {r['positive_signals']} | Cautions: {r['caution_signals']}")