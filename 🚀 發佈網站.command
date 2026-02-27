#!/bin/bash
REPO="/Users/Ivan/Documents/test/研究方法/00新教案/code/research-navigator"

echo "📦 加入所有修改的檔案..."
git -C "$REPO" add .

echo "✨ 建立版本紀錄..."
TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
git -C "$REPO" commit -m "更新: $TIMESTAMP"

echo "🚀 推送到 GitHub（Vercel 將自動更新網站）..."
git -C "$REPO" push

echo ""
echo "✅ 完成！Vercel 大約 1 分鐘後自動更新網站。"
read -p "按 Enter 關閉..."
