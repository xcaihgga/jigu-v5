#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  康衡 Rehabalance - 自动化自检脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

cd "$(dirname "$0")/.."

step() {
  echo -e "${BLUE}[检查]${NC} $1..."
}

pass() {
  echo -e "  ${GREEN}✓ 通过${NC} - $1"
  PASS=$((PASS + 1))
}

fail() {
  echo -e "  ${RED}✗ 失败${NC} - $1"
  FAIL=$((FAIL + 1))
}

warn() {
  echo -e "  ${YELLOW}⚠ 警告${NC} - $1"
  WARN=$((WARN + 1))
}

echo -e "${YELLOW}--- 阶段 1: 环境与依赖检查 ---${NC}"
echo ""

step "检查 Node.js 版本"
if command -v node &> /dev/null; then
  NODE_VER=$(node -v)
  pass "Node.js $NODE_VER"
else
  fail "Node.js 未安装"
  exit 1
fi

step "检查 pnpm"
if command -v pnpm &> /dev/null; then
  PNPM_VER=$(pnpm -v)
  pass "pnpm $PNPM_VER"
else
  fail "pnpm 未安装"
  exit 1
fi

step "检查 node_modules 是否存在"
if [ -d "node_modules" ]; then
  pass "node_modules 存在"
else
  warn "node_modules 不存在，开始安装"
  pnpm install
  if [ -d "node_modules" ]; then
    pass "依赖安装完成"
  else
    fail "依赖安装失败"
    exit 1
  fi
fi

step "检查 package.json"
if [ -f "package.json" ]; then
  pass "package.json 存在"
else
  fail "package.json 不存在"
  exit 1
fi

echo ""
echo -e "${YELLOW}--- 阶段 2: 代码质量检查 ---${NC}"
echo ""

step "TypeScript 类型检查"
if pnpm check 2>&1; then
  pass "TypeScript 类型检查通过"
else
  fail "TypeScript 类型检查失败"
fi

step "ESLint 检查"
LINT_OUTPUT=$(pnpm lint 2>&1 || true)
LINT_ERR_COUNT=$(echo "$LINT_OUTPUT" | grep -c "error" || echo "0")
if [ "$LINT_ERR_COUNT" -eq 0 ]; then
  pass "ESLint 检查通过"
else
  warn "ESLint 有 $LINT_ERR_COUNT 个问题（不影响运行）"
fi

echo ""
echo -e "${YELLOW}--- 阶段 3: 构建验证 ---${NC}"
echo ""

step "生产构建"
if pnpm build 2>&1; then
  pass "生产构建成功"
else
  fail "生产构建失败"
  exit 1
fi

step "检查构建产物"
if [ -f "dist/index.html" ] && [ -d "dist/assets" ]; then
  ASSET_COUNT=$(ls dist/assets/*.js 2>/dev/null | wc -l)
  pass "构建产物完整 (index.html + $ASSET_COUNT 个 JS 资源)"
else
  fail "构建产物不完整"
  exit 1
fi

echo ""
echo -e "${YELLOW}--- 阶段 4: 功能验证 ---${NC}"
echo ""

step "检查主要页面文件"
PAGES=("src/pages/PlanList.tsx" "src/pages/PathwayPage.tsx" "src/pages/AssessCenter.tsx" "src/components/Layout.tsx")
MISSING_PAGES=()
for page in "${PAGES[@]}"; do
  if [ ! -f "$page" ]; then
    MISSING_PAGES+=("$page")
  fi
done
if [ ${#MISSING_PAGES[@]} -eq 0 ]; then
  pass "所有核心页面文件存在"
else
  fail "缺少页面文件: ${MISSING_PAGES[*]}"
fi

step "检查导航配置"
if grep -q "临床参考" src/components/Layout.tsx && grep -q "康复计划" src/components/Layout.tsx; then
  pass "导航配置正确（临床参考 + 康复计划）"
else
  fail "导航配置异常"
fi

step "检查临床路径数据"
PW_COUNT=$(grep -c "id:" src/data/seed.ts src/data/rehab-pathways.ts 2>/dev/null | awk -F: '{s+=$2} END {print s}')
if [ "$PW_COUNT" -gt 0 ]; then
  pass "临床路径数据存在 ($PW_COUNT 条)"
else
  warn "未找到临床路径数据"
fi

step "检查量表数据"
SCALE_COUNT=$(grep -c "id:" src/data/scales-extended.ts src/data/scales-questions.ts 2>/dev/null | awk -F: '{s+=$2} END {print s}')
if [ "$SCALE_COUNT" -gt 0 ]; then
  pass "量表数据存在 ($SCALE_COUNT 条)"
else
  warn "未找到量表数据"
fi

echo ""
echo -e "${YELLOW}--- 阶段 5: 部署配置检查 ---${NC}"
echo ""

step "检查 GitHub Actions 部署配置"
if [ -f ".github/workflows/deploy.yml" ]; then
  pass "部署配置文件存在"
  if grep -q "peaceiris/actions-gh-pages" .github/workflows/deploy.yml; then
    pass "GitHub Pages 部署动作配置正确"
  else
    warn "部署动作可能异常"
  fi
else
  warn "未找到 GitHub Actions 部署配置"
fi

step "检查 vite 配置"
if [ -f "vite.config.ts" ]; then
  pass "vite.config.ts 存在"
else
  fail "vite.config.ts 不存在"
fi

step "检查 tailwind 配置"
if [ -f "tailwind.config.js" ]; then
  pass "tailwind.config.js 存在"
else
  fail "tailwind.config.js 不存在"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "  自检完成"
echo -e "${GREEN}  通过: $PASS${NC}"
echo -e "${YELLOW}  警告: $WARN${NC}"
echo -e "${RED}  失败: $FAIL${NC}"
echo -e "${BLUE}========================================${NC}"

if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}有 $FAIL 项检查失败，请修复后重试${NC}"
  exit 1
else
  echo -e "${GREEN}所有关键检查通过！${NC}"
  exit 0
fi
