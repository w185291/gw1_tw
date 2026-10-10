"""Inventory untranslated structured names without guessing their Chinese equivalents."""
from __future__ import annotations

import csv
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src" / "data"
OUT = ROOT / "docs" / "translation"
HAN = re.compile(r"[\u3400-\u9fff]")


def category(path: Path, pointer: str) -> str:
    parts = path.relative_to(DATA).parts
    if "/locations/" in pointer or pointer.endswith("/location") or pointer.endswith("/outpost"):
        return "location"
    if parts[0] == "skills":
        if "/acquisition/quests/" in pointer:
            return "quest"
        if "/acquisition/" in pointer:
            return "npc"
        if pointer == "/name":
            return "skill"
        return "skill-metadata"
    if parts[0] == "heroes":
        return "hero" if pointer == "/name" else "hero-metadata"
    if "missions" in parts:
        if pointer == "/name":
            return "mission"
        if "/bosses/" in pointer:
            return "npc"
        if "/primaryQuest" in pointer:
            return "quest" if pointer.endswith("/name") else "quest-metadata"
        return "mission-metadata"
    if "quest" in path.name.lower() or "quest" in pointer.lower():
        return "quest"
    if "trainer" in path.name.lower():
        return "trainer-metadata"
    return "other"


def visit(node: object, path: Path, pointer: str, rows: list[dict]) -> None:
    if isinstance(node, dict):
        en, zh = node.get("en"), node.get("zhTW")
        if isinstance(en, str) and isinstance(zh, str) and en.strip() and not HAN.search(zh):
            rows.append({
                "category": category(path, pointer),
                "en": en,
                "currentZhTW": zh,
                "file": path.relative_to(ROOT).as_posix(),
                "jsonPointer": pointer or "/",
            })
        for key, value in node.items():
            escaped = str(key).replace("~", "~0").replace("/", "~1")
            visit(value, path, pointer + "/" + escaped, rows)
    elif isinstance(node, list):
        for index, value in enumerate(node):
            visit(value, path, pointer + "/" + str(index), rows)


def main() -> None:
    rows: list[dict] = []
    files = 0
    for path in sorted(DATA.rglob("*.json")):
        try:
            content = json.loads(path.read_text(encoding="utf-8-sig"))
        except (UnicodeError, json.JSONDecodeError) as exc:
            raise SystemExit(f"Cannot inspect {path}: {exc}") from exc
        files += 1
        visit(content, path, "", rows)
    rows.sort(key=lambda row: (row["category"], row["en"].casefold(), row["file"], row["jsonPointer"]))
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "untranslated.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with (OUT / "untranslated.csv").open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["category", "en", "currentZhTW", "file", "jsonPointer"])
        writer.writeheader()
        writer.writerows(rows)
    counts = Counter(row["category"] for row in rows)
    print(f"Inspected {files} JSON files; {len(rows)} untranslated occurrences; {len(set((r['category'], r['en']) for r in rows))} distinct terms")
    for key, count in sorted(counts.items()):
        print(f"  {key}: {count}")


if __name__ == "__main__":
    main()
