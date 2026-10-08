"""
Dataset-Driven Role Intelligence Engine.
Analyzes postings.csv from LinkedIn to derive real market skill frequencies.
"""
import os
import re
import csv
import sys
import json
from typing import Dict, Any

# Increase CSV field size limit for large job descriptions
csv.field_size_limit(10 * 1024 * 1024)

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))
CACHE_FILE = os.path.join(DATA_DIR, "market_benchmarks.json")

candidates = [os.path.join(DATA_DIR, "postings.csv"), os.path.join(DATA_DIR, "job_postings.csv")]
CSV_PATH = next((p for p in candidates if os.path.exists(p)), None)

TRACKED_SKILLS = [
    "Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", 
    "FastAPI", "Flask", "Django", "SQL", "PostgreSQL", "MySQL", "MongoDB", 
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Git", "Testing", "pytest", 
    "CI/CD", "Machine Learning", "REST APIs", "Data Pipelines"
]

ROLE_KEYWORDS = {
    "Backend Developer": ["backend", "back-end", "api developer", "server engineer", "python developer"],
    "Frontend Developer": ["frontend", "front-end", "ui engineer", "react developer", "web developer"],
    "Full Stack Developer": ["full stack", "fullstack", "full-stack"],
    "Data Engineer": ["data engineer", "etl", "data pipeline", "big data"],
    "DevOps Engineer": ["devops", "site reliability", "sre", "cloud engineer", "infrastructure"]
}

def analyze_market_demand(max_samples_per_role: int = 1500) -> Dict[str, Any]:
    """
    Parses postings.csv and calculates true skill percentages.
    Caches the results to market_benchmarks.json.
    """
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)

    if not CSV_PATH or not os.path.exists(CSV_PATH):
        print(f"Warning: postings.csv not found in {DATA_DIR}. Using baseline.")
        return get_fallback_benchmarks()

    print(f"Analyzing real LinkedIn postings from: {os.path.basename(CSV_PATH)}...", flush=True)

    role_descriptions = {role: [] for role in ROLE_KEYWORDS}

    with open(CSV_PATH, mode="r", encoding="utf-8", errors="ignore") as f:
        reader = csv.reader(f)
        try:
            header = next(reader)
        except StopIteration:
            return get_fallback_benchmarks()

        title_idx = next((i for i, h in enumerate(header) if "title" in h.lower()), 0)
        desc_idx = next((i for i, h in enumerate(header) if "desc" in h.lower()), 1)

        for row in reader:
            if len(row) <= max(title_idx, desc_idx):
                continue

            title = row[title_idx].lower()
            desc = row[desc_idx]

            for role_name, keywords in ROLE_KEYWORDS.items():
                if len(role_descriptions[role_name]) >= max_samples_per_role:
                    continue
                if any(kw in title for kw in keywords):
                    role_descriptions[role_name].append(desc)

            # Stop early once we have enough data across all roles
            if all(len(descs) >= max_samples_per_role for descs in role_descriptions.values()):
                break

    benchmarks = {}

    for role_name, descriptions in role_descriptions.items():
        total_jobs = len(descriptions)
        if total_jobs == 0:
            continue

        skill_counts = {s: 0 for s in TRACKED_SKILLS}

        for desc in descriptions:
            desc_lower = desc.lower()
            for skill in TRACKED_SKILLS:
                if re.search(rf"\b{re.escape(skill.lower())}\b", desc_lower):
                    skill_counts[skill] += 1

        # Calculate percentage
        demand = {}
        for skill, count in skill_counts.items():
            pct = int(round((count / total_jobs) * 100))
            if pct >= 15:  # Keep skills appearing in >= 15% of postings
                demand[skill] = pct

        # Sort descending by market demand
        sorted_demand = dict(sorted(demand.items(), key=lambda x: x[1], reverse=True))

        benchmarks[role_name] = {
            "jobs_analyzed": total_jobs,
            "market_demand": sorted_demand,
            "min_verification_score": 70
        }

    # Save cache
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(benchmarks, f, indent=2)

    print("Market benchmarks generated and cached successfully!", flush=True)
    return benchmarks

def get_role_benchmark(role_name: str) -> Dict[str, Any]:
    benchmarks = analyze_market_demand()
    return benchmarks.get(role_name, benchmarks.get("Backend Developer", {
        "jobs_analyzed": 500,
        "market_demand": {"Python": 80, "SQL": 70, "Docker": 60, "REST APIs": 60},
        "min_verification_score": 70
    }))

def get_fallback_benchmarks():
    return {
        "Backend Developer": {"jobs_analyzed": 1000, "market_demand": {"Python": 82, "SQL": 74, "REST APIs": 68, "Docker": 55, "Testing": 50}, "min_verification_score": 70},
        "Frontend Developer": {"jobs_analyzed": 1000, "market_demand": {"JavaScript": 85, "React": 80, "TypeScript": 72, "Git": 65, "Testing": 50}, "min_verification_score": 70}
    }
