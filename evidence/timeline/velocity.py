from datetime import datetime, timezone
from collections import defaultdict
from evidence.skill_mapping.taxonomy import detect_skills_in_repo

class SkillTimelineEngine:
    """Generates chronological skill adoption milestones and learning velocity score."""

    def build_skill_timeline(self, raw_github: dict) -> dict:
        repos = raw_github.get("repositories", [])
        skill_milestones = defaultdict(list)

        for r in repos:
            created_str = r.get("created_at")
            if not created_str:
                continue
            
            dt = datetime.fromisoformat(created_str.replace("Z", "+00:00"))
            year_month = dt.strftime("%b %Y")
            skills = detect_skills_in_repo(r)

            for s in skills:
                skill_milestones[s].append({
                    "repo": r["name"],
                    "date": year_month,
                    "timestamp": dt.timestamp()
                })

        timeline = []
        for skill, records in skill_milestones.items():
            records.sort(key=lambda x: x["timestamp"])
            first_seen = records[0]["date"]
            latest_seen = records[-1]["date"]
            timeline.append({
                "skill": skill,
                "first_practiced": first_seen,
                "latest_practiced": latest_seen,
                "total_projects": len(records),
                "is_current": (datetime.now(timezone.utc).timestamp() - records[-1]["timestamp"]) < (180 * 86400)
            })

        # Sort timeline chronologically by first practiced
        timeline.sort(key=lambda x: x["first_practiced"])

        # Compute Learning Velocity (0-100)
        # Measures skill acquisition diversity and ongoing practice
        unique_skills = len(timeline)
        active_now = sum(1 for t in timeline if t["is_current"])
        velocity_score = min(100, int((unique_skills * 12) + (active_now * 15) + 20))

        return {
            "learning_velocity_score": velocity_score,
            "velocity_tier": "High" if velocity_score >= 75 else ("Moderate" if velocity_score >= 50 else "Steady"),
            "skill_timeline": timeline
        }