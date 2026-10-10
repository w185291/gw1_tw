"""Apply evidence-backed exact JSON-name corrections and append a reversible log."""
from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OVERRIDES = ROOT / "docs" / "translation" / "overrides.json"
LOG = ROOT / "docs" / "translation" / "change-log.jsonl"


def get_pointer(document: object, pointer: str) -> object:
    current = document
    for token in pointer.lstrip("/").split("/"):
        token = token.replace("~1", "/").replace("~0", "~")
        current = current[int(token)] if isinstance(current, list) else current[token]
    return current


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Write approved changes; default is dry run")
    args = parser.parse_args()
    changes = json.loads(OVERRIDES.read_text(encoding="utf-8"))
    if not isinstance(changes, list):
        raise SystemExit("overrides.json must be a list")
    pending: dict[Path, object] = {}
    logs: list[dict] = []
    for change in changes:
        if change.get("status") != "approved":
            continue
        for field in ("file", "jsonPointer", "en", "zhTW", "evidenceUrl"):
            if not isinstance(change.get(field), str) or not change[field].strip():
                raise SystemExit(f"Approved override missing {field}: {change}")
        path = (ROOT / change["file"]).resolve()
        if not path.is_relative_to((ROOT / "src" / "data").resolve()) or path.suffix != ".json":
            raise SystemExit(f"Outside structured data: {path}")
        if path not in pending:
            pending[path] = json.loads(path.read_text(encoding="utf-8-sig"))
        target = get_pointer(pending[path], change["jsonPointer"])
        if not isinstance(target, dict) or target.get("en") != change["en"]:
            raise SystemExit(f"English identity changed at {change['file']}{change['jsonPointer']}")
        old = target.get("zhTW")
        if old == change["zhTW"]:
            continue
        if not isinstance(old, str):
            raise SystemExit(f"No zhTW field at {change['file']}{change['jsonPointer']}")
        target["zhTW"] = change["zhTW"]
        if "translationVerified" in target:
            target["translationVerified"] = True
        logs.append({
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "file": change["file"],
            "jsonPointer": change["jsonPointer"],
            "en": change["en"],
            "oldZhTW": old,
            "newZhTW": change["zhTW"],
            "evidenceUrl": change["evidenceUrl"],
            "note": change.get("note", ""),
        })
    for change in logs:
        print(f"{change['file']}{change['jsonPointer']}: {change['oldZhTW']} -> {change['newZhTW']}")
    if args.apply and logs:
        for path, data in pending.items():
            path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        with LOG.open("a", encoding="utf-8") as handle:
            for change in logs:
                handle.write(json.dumps(change, ensure_ascii=False) + "\n")
    print(f"{len(logs)} change(s); {'applied' if args.apply else 'dry run'}")


if __name__ == "__main__":
    main()
