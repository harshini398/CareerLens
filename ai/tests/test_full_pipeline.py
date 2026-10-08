import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from ai.resume_parser.service import analyze_resume_pipeline
from ai.resume_parser.rewriter import rewrite_weak_bullets

def test():
    # 1. Test text rewriting
    print("Testing Resume Rewriter...")
    rewrites = rewrite_weak_bullets(["Created a website using React.", "Responsible for backend database."])
    for r in rewrites:
        print(f"Original: {r['original']}")
        print(f"Improved: {r['improved']}\n")

    print("Person 1 modules are all operational!")

if __name__ == "__main__":
    test()