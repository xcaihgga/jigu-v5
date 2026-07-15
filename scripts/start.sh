#!/bin/bash
set -e

echo "🔧 康衡 Rehabalance 启动脚本"
echo "=============================="

# Step 1: Check and install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules 缺失，正在安装..."
    pnpm install
else
    echo "📦 node_modules 已存在"
fi

# Step 2: TypeScript check
echo "🔍 正在进行类型检查..."
npx tsc --noEmit
echo "✅ 类型检查通过"

# Step 3: Build
echo "🔨 正在构建生产版本..."
npx vite build
echo "✅ 构建成功"

# Step 4: Start preview server
echo "🚀 启动预览服务器..."
npx vite preview --port 4173 --host
