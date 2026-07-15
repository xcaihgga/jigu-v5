#!/bin/bash
set -e

echo "🚀 康衡 Rehabalance 部署脚本"
echo "=============================="

# Step 1: 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules 缺失，正在安装..."
    pnpm install
fi

# Step 2: 类型检查
echo "🔍 类型检查..."
npx tsc --noEmit

# Step 3: 使用正确的 BASE_PATH 构建（GitHub Pages 仓库名为 jigu-v5）
echo "🔨 构建（BASE_PATH=/jigu-v5/）..."
BASE_PATH=/jigu-v5/ npx vite build

# Step 3.5: 添加 .nojekyll 防止 GitHub Pages 忽略 _开头的文件
touch dist/.nojekyll

# Step 4: 部署到 gh-pages 分支
echo "📤 部署到 GitHub Pages..."
git config user.email "dev@rehabalance.cn"
git config user.name "Rehabalance Dev"
npx gh-pages -d dist -m "Deploy: $(date '+%Y-%m-%d %H:%M') 自动部署"

echo ""
echo "✅ 部署完成！"
echo "🔗 https://xcaihgga.github.io/jigu-v5/"
echo "⏱️ GitHub Pages 可能需要 1-2 分钟生效"
