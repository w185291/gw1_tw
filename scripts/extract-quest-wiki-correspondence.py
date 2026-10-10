"""Join Wiki's Quest-ID index to exact English/Traditional Chinese DAT text pairs.

This is candidate research, not proof of an in-game quest_id -> string_id link.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import urllib.request
from collections import defaultdict
from datetime import date
from pathlib import Path

INDEX_PAGES = ('0..499', '500..999', '1000..1499')
BASE = 'https://wiki.guildwars.com/wiki/Guild_Wars_Wiki:Game_integration/Quests/'


def wiki_rows():
    for page in INDEX_PAGES:
        url = BASE + page
        request = urllib.request.Request(url, headers={'User-Agent': 'GW1GuideResearch/1.0 (local quest name audit)'})
        with urllib.request.urlopen(request, timeout=30) as response:
            document = response.read().decode('utf-8')
        for item in re.findall(r'<li\b[^>]*>(.*?)</li>', document, flags=re.I | re.S):
            match = re.search(r'>Quest\s+(\d+)</a>', item, flags=re.I)
            if not match:
                continue
            anchors = re.findall(r'<a\b([^>]*)>(.*?)</a>', item, flags=re.I | re.S)
            if len(anchors) < 2:
                continue
            target_attributes, target_label = anchors[1]
            target_url = re.search(r'href="([^"]+)"', target_attributes)
            if not target_url or not target_url.group(1).startswith('/wiki/'):
                continue
            title = html.unescape(re.sub(r'<[^>]+>', '', target_label)).strip()
            yield {'questId': int(match.group(1)), 'wikiNameEn': title,
                   'wikiUrl': 'https://wiki.guildwars.com' + html.unescape(target_url.group(1)),
                   'indexUrl': url}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('text_pairs', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    pairs = json.loads(args.text_pairs.read_text(encoding='utf-8'))
    by_name = defaultdict(list)
    for text_id, pair in pairs.items():
        if pair.get('en') and pair.get('zhTW'):
            by_name[pair['en']].append({'textId': int(text_id), 'zhTW': pair['zhTW']})
    candidates = []
    for row in wiki_rows():
        matches = by_name[row['wikiNameEn']]
        distinct = sorted({match['zhTW'] for match in matches})
        candidates.append({**row, 'datMatches': matches,
                           'candidateZhTW': distinct[0] if len(distinct) == 1 else None,
                           'status': 'unique-exact-name-match' if len(distinct) == 1 else 'ambiguous' if distinct else 'no-exact-name-match'})
    candidates.sort(key=lambda row: row['questId'])
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps({'checkedAt': date.today().isoformat(),
                                       'method': 'Wiki Quest-ID index + exact English text match in local Gw.dat pairs; no runtime identity verified',
                                       'records': candidates}, ensure_ascii=False, indent=2), encoding='utf-8')
    counts = {kind: sum(row['status'] == kind for row in candidates)
              for kind in ('unique-exact-name-match', 'ambiguous', 'no-exact-name-match')}
    print(json.dumps({'wikiQuestIds': len(candidates), **counts}, ensure_ascii=False))


if __name__ == '__main__':
    main()
