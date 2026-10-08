import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.scoring.dataset_role_engine import get_role_benchmark

print("=" * 60)
print("EXTRACTING SKILL DEMAND FROM POSTINGS.CSV...")
print("=" * 60)

for role in ["Backend Developer", "Frontend Developer", "Data Engineer"]:
    data = get_role_benchmark(role)
    print(f"\nROLE: {role.upper()}")
    print(f"Jobs Analyzed from Dataset: {data['jobs_analyzed']}")
    print("-" * 45)
    for skill, pct in data["market_demand"].items():
        bar = "█" * (pct // 5)
        print(f"  {skill:<15} : {bar:<20} {pct}%")

print("\n" + "=" * 60)
print("DONE! Cache saved to data/market_benchmarks.json")
print("=" * 60)
