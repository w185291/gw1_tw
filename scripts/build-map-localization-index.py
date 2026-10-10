"""Join live GWCA AreaInfo IDs with offline game-client localized text IDs."""
from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HAN = re.compile(r"[\u3400-\u9fff]")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--capture", type=Path, required=True, help="GWCA AreaInfo JSONL from the current game client")
    parser.add_argument("--texts", type=Path, required=True, help="Gw.dat/Gw.snapshot localized text-pairs.json")
    args = parser.parse_args()
    texts = json.loads(args.texts.read_text(encoding="utf-8"))
    capture = [json.loads(line) for line in args.capture.read_text(encoding="utf-8").splitlines() if line.strip()]
    rows = []
    for record in capture:
        if "mapId" not in record:
            continue
        pair = texts.get(str(record["nameId"]), {})
        en = pair.get("en", "")
        zh = pair.get("zhTW", "")
        rows.append({
            **record,
            "en": en,
            "zhTW": zh,
            "status": "game-string-paired" if en and HAN.search(zh) else "missing-or-english-only",
            "provenance": "GWCA AreaInfo.name_id + local Gw.dat/Gw.snapshot text record",
        })
    rows.sort(key=lambda row: row["mapId"])
    out = ROOT / "docs" / "reference"
    out.mkdir(parents=True, exist_ok=True)
    (out / "map-localization-20261010.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with (out / "map-localization-20261010.csv").open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["mapId", "campaign", "continent", "region", "type", "nameId", "en", "zhTW", "status"])
        writer.writeheader()
        writer.writerows({key: row[key] for key in writer.fieldnames} for row in rows)
    print(f"{len(rows)} map records; {sum(bool(row['en']) for row in rows)} English names; {sum(row['status'] == 'game-string-paired' for row in rows)} Chinese names")


if __name__ == "__main__":
    main()
