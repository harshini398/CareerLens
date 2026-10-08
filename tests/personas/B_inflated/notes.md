# Persona B: Resume-Inflated Candidate

## Purpose
The primary demo persona for CareerLens. Demonstrates how the platform exposes keyword stuffing, lack of GitHub evidence for claimed skills, and cross-source profile contradictions.

## Planted Traps & Contradictions
1. **Resume vs. GitHub Evidence:**
   - Claims Docker, Kubernetes, AWS, React, TensorFlow, Kafka, Redis.
   - GitHub has 0 Dockerfiles, 0 React repos, 0 Terraform files.
2. **Resume vs. LinkedIn Contradiction:**
   - Resume claims an **8-month** internship with enterprise architecture responsibilities.
   - LinkedIn states it was only **3 months** doing basic script maintenance.
   - Resume claims **4 certifications**; LinkedIn lists only **1**.
3. **Resume vs. LeetCode Contradiction:**
   - Resume claims **500+ LeetCode problems**.
   - LeetCode profile shows only **38 solved**.

## Expected System Output
- **Job Readiness Score Range:** 25 - 45 / 100
- **Trust Index:** LOW (< 45%)
- **Unsupported Skills (❌):** Docker, Kubernetes, AWS, React, TensorFlow, Terraform, Redis, Kafka
- **Contradiction Flags (🚨):**
  - Flag 1: Internship duration mismatch (8 months on resume vs 3 months on LinkedIn).
  - Flag 2: Certification count inflation (4 claimed vs 1 verified).
  - Flag 3: LeetCode count discrepancy (500+ claimed vs 38 actual).
- **Interview Bot Action:** Automatically generates deep evidence-gap questions challenging the candidate on Docker and Kubernetes architecture.