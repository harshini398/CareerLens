import os
import csv
import sys

print("Checking file...", flush=True)

DATA_DIR = os.path.dirname(__file__)
candidates = [os.path.join(DATA_DIR, "job_postings.csv"), os.path.join(DATA_DIR, "postings.csv")]
csv_path = next((p for p in candidates if os.path.exists(p)), None)

if not csv_path:
    print(f"ERROR: No CSV found in '{DATA_DIR}'!", flush=True)
    print("Files present:", os.listdir(DATA_DIR), flush=True)
    sys.exit(1)

size_mb = os.path.getsize(csv_path) / (1024 * 1024)
print(f"Found file: {os.path.basename(csv_path)} ({size_mb:.1f} MB)", flush=True)
print("Reading header and sample rows...\n", flush=True)

with open(csv_path, mode="r", encoding="utf-8", errors="ignore") as f:
    reader = csv.reader(f)
    header = next(reader)
    print("=" * 60)
    print("COLUMNS:")
    print(header)
    print("=" * 60)

    # Find title and description indices
    title_idx = next((i for i, h in enumerate(header) if "title" in h.lower()), None)
    desc_idx = next((i for i, h in enumerate(header) if "desc" in h.lower()), None)
    
    print(f"\nTitle Column Index      : {title_idx} ({header[title_idx] if title_idx is not None else 'None'})")
    print(f"Description Column Index: {desc_idx} ({header[desc_idx] if desc_idx is not None else 'None'})")

    print("\nSAMPLE JOBS (first 3 rows):")
    for row_num in range(1, 4):
        try:
            row = next(reader)
            job_title = row[title_idx] if title_idx is not None and len(row) > title_idx else "N/A"
            job_desc = row[desc_idx][:150] if desc_idx is not None and len(row) > desc_idx else "N/A"
            print(f"\n[Job {row_num}] {job_title}")
            print(f"Preview : \"{job_desc}...\"")
        except StopIteration:
            break

print("\n" + "=" * 60)
print("INSPECTION COMPLETE!")
print("=" * 60)
