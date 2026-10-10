"""Create exact location-field corrections backed by game map and string IDs."""
from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MAPS = ROOT / "docs" / "reference" / "map-localization-20261010.json"
UNTRANSLATED = ROOT / "docs" / "translation" / "untranslated.json"
OVERRIDES = ROOT / "docs" / "translation" / "overrides.json"


def main() -> None:
    maps = json.loads(MAPS.read_text(encoding="utf-8"))
    rows = json.loads(UNTRANSLATED.read_text(encoding="utf-8"))
    overrides = json.loads(OVERRIDES.read_text(encoding="utf-8"))
    by_name = defaultdict(list)
    for record in maps:
        if record["status"] == "game-string-paired":
            by_name[record["en"]].append(record)
    existing = {(row["file"], row["jsonPointer"]) for row in overrides}
    added = 0
    for row in rows:
        if row["category"] != "location" or (row["file"], row["jsonPointer"]) in existing:
            continue
        candidates = by_name.get(row["en"], [])
        if len({candidate["zhTW"] for candidate in candidates}) != 1:
            continue
        selected = min(candidates, key=lambda candidate: candidate["mapId"])
        overrides.append({
            "status": "approved",
            "file": row["file"],
            "jsonPointer": row["jsonPointer"],
            "en": row["en"],
            "zhTW": selected["zhTW"],
            "evidenceUrl": f"game-client://map/{selected['mapId']}/string/{selected['nameId']}",
            "note": "GWCA 地圖表 name_id 與本機 Gw.dat/Gw.snapshot 同 ID 英繁字串直接配對。",
        })
        existing.add((row["file"], row["jsonPointer"]))
        added += 1
    OVERRIDES.write_text(json.dumps(overrides, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {added} exact location overrides")


if __name__ == "__main__":
    main()
