#!/bin/bash
set -e

echo "🔧 康衡 Rehabalance 启动脚本"
echo "=============================="

# Step 1: 检查并安装依赖（每次会话重启后 node_modules 可能丢失）
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules 缺失，正在安装..."
    pnpm install
else
    echo "✅ node_modules 已存在"
fi

# Step 2: 杀掉占用 4173 端口的旧进程
if command -v lsof &> /dev/null; then
    OLD_PID=$(lsof -ti:4173 2>/dev/null || true)
    if [ -n "$OLD_PID" ]; then
        echo "🧹 清理旧进程 (PID: $OLD_PID)..."
        kill -9 $OLD_PID 2>/dev/null || true
        sleep 1
    fi
fi

# Step 3: TypeScript 类型检查
echo "🔍 正在进行类型检查..."
npx tsc --noEmit
echo "✅ 类型检查通过"

# Step 4: 构建生产版本
echo "🔨 正在构建生产版本..."
npx vite build
echo "✅ 构建成功"

# Step 5: 启动预览服务器（绑定所有网卡）
echo "🚀 启动预览服务器..."
exec npx vite preview --port 4173 --host 0.0.0.0
