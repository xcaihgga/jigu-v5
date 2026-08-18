# 修复发布说明：scales-ui.js 属性注入 XSS 漏洞（3 处）

**发布日期**：2026-08-18
**影响版本**：jigu-v5 所有未包含本修复的历史版本
**风险等级**：中高（Stored XSS，二次打开评估记录时触发）
**建议动作**：立即合入本修复并重新构建部署 dist/ 到 GitHub Pages

---

## 一、本次修复做了什么

### 1. 修复 3 处属性级 XSS 注入点

文件：[scales-ui.js](file:///workspace/src/scales-ui.js)

| 序号 | 位置 | 行号 | 漏洞类型 | 严重度 |
|------|------|------|----------|--------|
| ① | VAS/NRS 数字评分量表 number 输入框 `value="..."` 拼接 | L247 | 存储型 XSS | 中 |
| ② | PSFS（患者特异性功能量表）活动名称自由文本 `value="..."` 拼接 | L261 | 存储型 XSS | **高** |
| ③ | customQuestions 数字题 `placeholder="..."` + `value="..."` 拼接 | L280 | 存储型 XSS | 中 |

**修复方式**：以上 3 处用户可控数据（`val` / `activity` / `q.placeholder`）均改为调用语义专用的 `escapeAttr()` 函数。

### 2. 新增语义专用工具函数 escapeAttr()

文件：[utils.js](file:///workspace/src/utils.js#L157-L165)

```javascript
function escapeAttr(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

设计原则：
- 与 `escapeHtml()` 输出**完全一致**，保证数据可双向还原
- 单独命名为 `escapeAttr`，便于代码审查时快速识别「此处是属性上下文拼接」的审计点
- 空输入（null / undefined）安全兜底为空字符串，不抛异常

### 3. 新增 escapeAttr 单元测试（15 条）

文件：[core-logic.test.js](file:///workspace/src/core-logic.test.js#L226-L272)

覆盖维度：
1. **基础类型** — null / undefined / 空串 / 数字 / 纯文本
2. **双引号突破** — `value="..."` 被 `"` 闭合 → 注入 `autofocus onfocus=alert(1)`
3. **单引号突破** — `value='...'` 被 `'` 闭合 → 注入 `onmouseover`
4. **组合攻击** — 闭合属性 + `<img onerror>` + 再次拼回属性
5. **与 escapeHtml 等价性** — 6 组样本两种 API 输出必须完全相同
6. **双向还原** — 转义后经 HTML 属性解码必须**精确还原原始值**（不丢失字符，验证不会引入乱码）

---

## 二、触发路径 & 攻击场景（构造复现）

### 高危 #2：PSFS 活动名称自由文本

**前置条件**：已登录应用（本机浏览器 localStorage 中保存过患者信息和评估历史）

### 攻击步骤

1. 选择 **PSFS 患者特异性功能量表**（`type=number, customQuestions=true`）
2. 在「活动 1」名称栏输入 payload：
   ```
   test" autofocus onfocus="alert(document.cookie)
   ```
   （注意：末尾**不要闭合**第二个双引号，利用浏览器对未闭合属性的容错解析）
3. 点「查看结果」→「保存记录」
4. 数据通过 `saveAssessment()` → `safeSetJSON('assessmentHistory', [...])` **持久化**到 localStorage

### 二次触发（真 XSS）

5. 切到「评分历史」标签 → 点击刚才保存的那条记录 → `viewHistoryDetail()`
6. 代码执行 `showScaleQuestion(0)` 时，读到之前保存的 answers：
   ```javascript
   '<input ... value="' + activity + '" ...>'
   ```
   activity 被插入后实际的 DOM 变成：
   ```html
   <input type="text" value="test" autofocus onfocus="alert(document.cookie)" ...>
   ```
7. `autofocus` 使页面打开瞬间自动获得焦点 → **`onfocus` 自动执行**
8. 可读取 `localStorage` 中的：
   - `patients`（全部患者个人信息：姓名/性别/年龄/电话/诊断/主诉）
   - `assessmentHistory`（全部评估历史：评分、答题详情）
   - 任何其他本地存储的敏感数据

**变种**：同样的 payload 可以用在 VAS/NRS 数字评分（#1）和自定义题（#3）的回显位置，差别只是触发时机不是 `autofocus`，而是需要用户点一下输入框才会触发。

---

## 三、验证结果

### 单元测试
```
node src/core-logic.test.js
═══════════════════════════════════════════════════════════════
  ✅ 通过: 124   （原有 109 条 + 新增 escapeAttr 15 条）
  ❌ 失败: 0
```

### evidence-field 测试
```
node src/evidence-field.test.js
  通过: 37 | 失败: 0
```

### 生产构建
```
python3 build_single.py
  ✅ 核心页面: 196.0 KB (首屏加载)
  ✅ scales-ui.js: 45.4 KB (+ 0.1 KB 修复增量)
  ✅ utils.js:     30.6 KB (+ 0.8 KB escapeAttr 新增)
  ✅ exit_code:    0
  📁 输出目录:     /workspace/dist
```

---

## 四、变更清单

```
commit 51da90b   (本地: trae/agent-r0Vo2a)
Author: xcaihgga <xcaihgga@users.noreply.github.com>
Date:   2026-08-18

  fix(security): 修复 scales-ui 3 处属性注入 XSS，并新增 escapeAttr 函数 + 15 条单元测试

 src/core-logic.test.js | 60 ++++++++++++++++++++++++++++++++++++++++++
 src/scales-ui.js       |  6 ++---
 src/utils.js           | 15 +++++++++++++
 3 files changed, 78 insertions(+), 3 deletions(-)
```

---

## 五、需要关注 / 后续跟进

1. **GitHub 推送待确认**：本地 commit（SHA `51da90b`）已完成。由于推送时 GitHub App 授权被跳过，当前仅存在于本地分支 `trae/agent-r0Vo2a`。请允许授权后执行：
   ```bash
   git push origin HEAD:fix/xss-escape-attr-20260818
   ```
   或合并到默认分支后再推送。

2. **全量属性拼接审计**：目前只修复了 `scales-ui.js`。建议下一个迭代对 `index.html`、`dashboard.js`、`protocols-tools-guidelines.js` 中所有 `... value="' + x + '" ...` 模式做一次 grep 级地毯式扫描（可复用本次新加入的 `escapeAttr` 语义函数）。

3. **DOM 属性赋值替代方案**：长期可考虑不再使用 innerHTML 拼属性字符串，改用 `document.createElement + setAttribute()` 的 DOM API 构造方式，彻底消除属性注入面。

---

## 六、回滚方案

若部署后出现问题（极少可能），回滚只需：

```bash
git revert 51da90b
```

本修复只做「加强转义」，不修改任何业务逻辑与数据结构，不引入向后不兼容变更。转义后数据在浏览器属性解码时**100% 还原原值**（见 core-logic.test.js 最后一条断言），不会出现中文乱码、数据损坏或历史评估记录显示异常。
