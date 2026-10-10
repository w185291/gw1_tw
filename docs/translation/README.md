# 繁中名稱盤點與修正

執行 `python scripts/audit-site-translations.py`，更新 `untranslated.json` 與 `untranslated.csv`。清單列出資料檔中 `en`／`zhTW` 成對、但繁中欄仍沒有中文字的項目，包含檔案和 JSON 指標。同一英文名稱可能出現在不同角色、地圖或任務；分類僅供查找，不能當成身分證明。純攻略散文中的英文詞尚未涵蓋。若系統沒有將 Python 加入 PATH，可用 Codex 隨附的 Python 執行檔。

確認遊戲繁中、可信賴的繁中 Wiki 或台灣社群來源後，在 `overrides.json` 加入具體位置，例如：

```json
{
  "status": "approved",
  "file": "src/data/skills/example.json",
  "jsonPointer": "/name",
  "en": "Example",
  "zhTW": "經查證的繁中名稱",
  "evidenceUrl": "https://來源頁面",
  "note": "遊戲字串 ID 或查證說明"
}
```

先跑 `python scripts/apply-translation-overrides.py` 預覽，再加 `--apply` 正式寫入。套用時須同時匹配檔案、JSON 位置及英文原名；修改會附來源逐筆追加到 `change-log.jsonl`。發現譯名有誤時，可新增修正項目再套用，記錄會保留舊值與新值。未核實的論壇候選譯名不得標成 `approved`。

本機遊戲地名索引由 `scripts/build-map-localization-index.py` 根據 GWCA 地圖 JSONL 與 `.dat` 雙語字串生成；`scripts/propose-map-name-overrides.py` 只對結構化的地點欄位、唯一英繁對應建立候選修正，仍可用前述預覽與記錄機制檢查。不要對 NPC 欄位做同名批量替換。
