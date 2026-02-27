#!/bin/bash

# 🚀 Research Navigator 一鍵同步腳本
# 執行方式：在終端機輸入 bash deploy.sh 或 ./deploy.sh

cd "$(dirname "$0")"

echo "📦 加入所有修改的檔案..."
git add .

echo "✨ 建立版本紀錄..."
# 用當下時間當作更新說明
TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
git commit -m "更新: $TIMESTAMP"

echo "🚀 推送到 GitHub（Vercel 將自動更新網站）..."
git push

echo ""
echo "✅ 完成！Vercel 大約 1 分鐘後自動更新網站。"
