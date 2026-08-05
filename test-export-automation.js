/**
 * 迁移报告组件 — CSV 导出自动化测试脚本
 *
 * 使用 Playwright 模拟用户操作：
 *   1. 打开迁移报告页面
 *   2. 验证导出按钮和筛选标签存在
 *   3. 依次点击「全部 / 成功 / 失败 / 警告」筛选标签
 *   4. 在每个筛选状态下点击导出按钮，验证 Toast 提示和 CSV 下载
 *   5. 验证空指针防御（模拟数据源缺失场景）
 *
 * 运行方式：
 *   npx playwright test test-export-automation.js   （Playwright 模式）
 *   node test-export-automation.js                   （HTTP 验证回退模式）
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:8090';
const PAGE_PATH = '/migration-report-view.html';

// 尝试加载 Playwright；不可用时回退到 HTTP 验证
let playwrightAvailable = false;
let test, expect;
try {
  ({ test, expect } = require('@playwright/test'));
  playwrightAvailable = true;
} catch (e) {
  // @playwright/test 未安装，后续走 HTTP 回退
}

if (playwrightAvailable) {

// ═══════════════════════════════════════════════════
//  Playwright 模式：完整端到端自动化测试
// ═══════════════════════════════════════════════════

test.describe('迁移报告 CSV 导出自动化测试', () => {

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test('1. 页面加载并验证核心元素存在', async ({ page }) => {
    await page.goto(BASE_URL + PAGE_PATH);

    const exportBtn = page.locator('#exportBtn');
    await expect(exportBtn).toBeVisible();
    await expect(exportBtn).toContainText('导出 CSV');

    const filterBar = page.locator('#filterBar');
    await expect(filterBar).toBeVisible();

    for (const filter of ['all', 'success', 'error', 'warning']) {
      const tab = page.locator(`.filter-tab[data-filter="${filter}"]`);
      await expect(tab).toBeVisible();
    }

    const exportInfo = page.locator('#exportInfo');
    await expect(exportInfo).toBeVisible();
  });

  test('2.「全部」筛选状态下导出 CSV', async ({ page }) => {
    await page.goto(BASE_URL + PAGE_PATH);
    await page.waitForSelector('#exportBtn');

    const allTab = page.locator('.filter-tab[data-filter="all"]');
    await expect(allTab).toHaveClass(/active/);

    const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
    await page.locator('#exportBtn').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/migration-report-\d{8}_\d{4}\.csv/);

    const toast = page.locator('#exportToast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/成功导出/);

    await page.waitForTimeout(3000);
    await expect(toast).not.toBeVisible();
  });

  test('3. 切换到「成功」筛选并导出', async ({ page }) => {
    await page.goto(BASE_URL + PAGE_PATH);
    await page.waitForSelector('#exportBtn');

    await page.locator('.filter-tab[data-filter="success"]').click();
    await expect(page.locator('.filter-tab[data-filter="success"]')).toHaveClass(/active/);

    const exportInfo = page.locator('#exportInfo');
    await expect(exportInfo).toContainText('成功');
    await expect(exportInfo).toContainText('量表');
    await expect(exportInfo).toContainText('协议');

    const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
    await page.locator('#exportBtn').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.csv$/);

    const toast = page.locator('#exportToast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/成功导出/);
  });

  test('4. 切换到「失败」筛选 — 无数据可导出场景', async ({ page }) => {
    await page.goto(BASE_URL + PAGE_PATH);
    await page.waitForSelector('#exportBtn');

    await page.locator('.filter-tab[data-filter="error"]').click();
    await expect(page.locator('.filter-tab[data-filter="error"]')).toHaveClass(/active/);

    const exportInfo = page.locator('#exportInfo');
    await expect(exportInfo).toContainText('失败');
    await expect(exportInfo).toContainText('0');

    await page.locator('#exportBtn').click();

    const toast = page.locator('#exportToast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/没有可导出/);
  });

  test('5. 切换到「警告」筛选并导出', async ({ page }) => {
    await page.goto(BASE_URL + PAGE_PATH);
    await page.waitForSelector('#exportBtn');

    await page.locator('.filter-tab[data-filter="warning"]').click();
    await expect(page.locator('.filter-tab[data-filter="warning"]')).toHaveClass(/active/);

    const warningNotice = page.locator('#warningNotice');
    await expect(warningNotice).toBeVisible();
    await expect(warningNotice).toContainText(/警告/);

    const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
    await page.locator('#exportBtn').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.csv$/);

    const toast = page.locator('#exportToast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/成功导出 1 条/);
  });

  test('6. CSV 文件内容验证', async ({ page }) => {
    await page.goto(BASE_URL + PAGE_PATH);
    await page.waitForSelector('#exportBtn');

    const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
    await page.locator('#exportBtn').click();
    const download = await downloadPromise;

    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const csvContent = Buffer.concat(chunks).toString('utf-8');

    expect(csvContent.startsWith('\uFEFF')).toBe(true);
    expect(csvContent).toContain('分类');
    expect(csvContent).toContain('ID');
    expect(csvContent).toContain('名称');
    expect(csvContent).toContain('状态');
    expect(csvContent).toContain('详细信息');
    expect(csvContent).toContain('# 导出时间:');
    expect(csvContent).toContain('# 筛选条件:');
    expect(csvContent).toContain('# 数据来源:');
    expect(csvContent).toContain('量表');
    expect(csvContent).toContain('协议');
    expect(csvContent).toContain('计算抽检');
  });

  test('7. 快速切换多个筛选标签后导出', async ({ page }) => {
    await page.goto(BASE_URL + PAGE_PATH);
    await page.waitForSelector('#exportBtn');

    await page.locator('.filter-tab[data-filter="success"]').click();
    await page.locator('.filter-tab[data-filter="error"]').click();
    await page.locator('.filter-tab[data-filter="warning"]').click();
    await page.locator('.filter-tab[data-filter="all"]').click();
    await page.waitForTimeout(300);

    await expect(page.locator('.filter-tab[data-filter="all"]')).toHaveClass(/active/);

    const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
    await page.locator('#exportBtn').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.csv$/);

    const toast = page.locator('#exportToast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/成功导出/);
  });

  test('8. 空指针防御 — 数据源缺失时不崩溃', async ({ page }) => {
    await page.addInitScript(() => {
      window.__testDataMissing = true;
    });

    await page.goto(BASE_URL + PAGE_PATH);
    await page.waitForSelector('#exportBtn');

    await page.evaluate(() => {
      window.reportData = null;
    });

    await page.locator('#exportBtn').click();

    const toast = page.locator('#exportToast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(/数据源未加载/);

    const title = page.locator('h1, .report-title');
    await expect(title.first()).toBeVisible();
  });

  test('9. 筛选标签计数验证', async ({ page }) => {
    await page.goto(BASE_URL + PAGE_PATH);
    await page.waitForSelector('#filterBar');

    const countAll = await page.locator('#countAll').textContent();
    const countSuccess = await page.locator('#countSuccess').textContent();
    const countError = await page.locator('#countError').textContent();
    const countWarning = await page.locator('#countWarning').textContent();

    expect(parseInt(countAll)).toBeGreaterThan(0);
    expect(parseInt(countSuccess)).toBeGreaterThan(0);
    expect(parseInt(countError)).toBeGreaterThanOrEqual(0);
    expect(parseInt(countWarning)).toBeGreaterThanOrEqual(0);

    const total = parseInt(countAll);
    const sum = parseInt(countSuccess) + parseInt(countError) + parseInt(countWarning);
    expect(total).toBeGreaterThanOrEqual(sum);
  });
});

} else if (require.main === module) {

// ═══════════════════════════════════════════════════
//  HTTP 回退模式：无 Playwright 时的基础 DOM 验证
// ═══════════════════════════════════════════════════

  console.log('⚠️  @playwright/test 未安装，执行基础 HTTP 验证...\n');

  const http = require('http');
  const url = BASE_URL + PAGE_PATH;

  http.get(url, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      const checks = [
        { name: '页面返回 200', pass: res.statusCode === 200 },
        { name: '包含导出按钮 DOM', pass: body.includes('id="exportBtn"') },
        { name: '包含筛选栏 DOM', pass: body.includes('id="filterBar"') },
        { name: '包含导出信息 DOM', pass: body.includes('id="exportInfo"') },
        { name: '包含 exportToCSV 函数', pass: body.includes('function exportToCSV') },
        { name: '包含 showToast 函数', pass: body.includes('function showToast') },
        { name: '包含 safeGet 防御函数', pass: body.includes('function safeGet') },
        { name: '事件绑定含空指针检查', pass: body.includes("if (exportBtn)") },
        { name: '事件绑定含 filterBar 空指针检查', pass: body.includes("if (filterBar)") },
        { name: '导出函数含数据源检查', pass: body.includes('数据源未加载') },
        { name: 'CSV 含 BOM 头', pass: body.includes('\\uFEFF') },
        { name: 'CSV 含表头', pass: body.includes("'分类'") && body.includes("'详细信息'") },
      ];

      let passed = 0;
      checks.forEach(c => {
        const icon = c.pass ? '✅' : '❌';
        console.log(`${icon} ${c.name}`);
        if (c.pass) passed++;
      });

      console.log(`\n结果：${passed}/${checks.length} 项通过`);
      process.exit(passed === checks.length ? 0 : 1);
    });
  }).on('error', (err) => {
    console.error('❌ 无法连接到服务器:', err.message);
    console.error('   请确认前端服务已启动：python3 -m http.server 8090');
    process.exit(1);
  });
}
