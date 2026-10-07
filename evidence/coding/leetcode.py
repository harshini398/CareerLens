import requests

class LeetCodeCollector:
    GRAPHQL_URL = "https://leetcode.com/graphql"

    @staticmethod
    def clean_handle(input_str: str) -> str:
        clean = input_str.strip().rstrip("/")
        if "leetcode.com/" in clean:
            clean = clean.split("leetcode.com/")[-1].replace("u/", "")
        return clean.replace("@", "")

    def get_user_stats(self, username_or_url: str) -> dict:
        username = self.clean_handle(username_or_url)
        query = """
        query getUserProfile($username: String!) {
            matchedUser(username: $username) {
                username
                profile {
                    ranking
                    reputation
                }
                submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
        }
        """
        try:
            res = requests.post(
                self.GRAPHQL_URL,
                json={"query": query, "variables": {"username": username}},
                headers={"Content-Type": "application/json", "User-Agent": "CareerLens/1.0"},
                timeout=6
            )
            if res.status_code == 200 and "data" in res.json():
                data = res.json()["data"]["matchedUser"]
                if not data:
                    return self._fallback(username, found=False)
                
                stats = data["submitStatsGlobal"]["acSubmissionNum"]
                total = next((s["count"] for s in stats if s["difficulty"] == "All"), 0)
                easy = next((s["count"] for s in stats if s["difficulty"] == "Easy"), 0)
                medium = next((s["count"] for s in stats if s["difficulty"] == "Medium"), 0)
                hard = next((s["count"] for s in stats if s["difficulty"] == "Hard"), 0)

                # Score 0-100 based on problem difficulty distribution
                evidence_score = min(100, int((easy * 0.2) + (medium * 0.6) + (hard * 1.5)))

                return {
                    "platform": "LeetCode",
                    "handle": username,
                    "verified": True,
                    "ranking": data["profile"].get("ranking", 0),
                    "total_solved": total,
                    "breakdown": {"easy": easy, "medium": medium, "hard": hard},
                    "evidence_score": max(20, evidence_score),
                    "skills_verified": ["Data Structures", "Algorithms", "Problem Solving"]
                }
        except Exception:
            pass
        return self._fallback(username, found=False)

    def _fallback(self, username: str, found: bool = True) -> dict:
        """Deterministic fallback for offline testing or demo profiles."""
        return {
            "platform": "LeetCode",
            "handle": username,
            "verified": found,
            "ranking": 45120 if found else 0,
            "total_solved": 142 if found else 0,
            "breakdown": {"easy": 65, "medium": 62, "hard": 15} if found else {},
            "evidence_score": 78 if found else 0,
            "skills_verified": ["Data Structures", "Algorithms"] if found else []
        }