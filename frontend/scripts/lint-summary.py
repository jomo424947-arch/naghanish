"""Print a compact summary of the ESLint JSON report."""

import collections
import json
import sys

path = sys.argv[1] if len(sys.argv) > 1 else "eslint-report.json"
with open(path, encoding="utf-8") as fh:
    report = json.load(fh)

rules = collections.Counter()
print("--- messages ---")
for entry in report:
    rel = entry["filePath"].split("frontend")[-1]
    for msg in entry["messages"]:
        rules[msg.get("ruleId")] += 1
        level = "error" if msg["severity"] == 2 else "warn"
        print(f"[{level}] {rel}:{msg['line']}  {msg.get('ruleId')}  {msg['message']}")

print("\nTOTAL", sum(rules.values()))
for rule, count in rules.most_common():
    print(count, rule)
