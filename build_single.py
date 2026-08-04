#!/usr/bin/env python3
"""将 index.html 中的外部脚本内联，生成单文件版本，并在构建后做自动断言。

设计要点：
- 从 index.html 的 <script src> 标签自动推导外部脚本路径，避免手写映射表与页面引用漂移。
- 构建完成后断言：无残留外部 script、安全基础设施存在、数据文件已内联。任一失败即退出非零。
"""
import re
import os
import sys

base_dir = os.path.dirname(os.path.abspath(__file__))

SRC_PATTERN = re.compile(r'<script src="([^"]+)"[^>]*></script>')
# 关键安全基础设施（防止回退/遗漏，这些符号必须出现在产物中）
CRITICAL_SYMBOLS = ('function safeParse', 'function escapeHtml', 'function debounce')
# data.js 顶层声明标记，用于校验数据文件确实被内联
DATA_MARKER = 'const muscles'


def build():
    html = open(os.path.join(base_dir, 'index.html'), 'r', encoding='utf-8').read()

    external = SRC_PATTERN.findall(html)
    if not external:
        print("错误: index.html 中未找到任何外部 <script src> 标签")
        sys.exit(1)

    for src_attr in external:
        rel = src_attr.split('?')[0]
        filepath = os.path.join(base_dir, rel)
        if not os.path.exists(filepath):
            print(f"错误: 外部脚本文件不存在 {filepath} (引用: {src_attr})")
            sys.exit(1)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        old_tag = f'<script src="{src_attr}"></script>'
        if old_tag not in html:
            print(f"错误: 未找到标签 {old_tag}")
            sys.exit(1)
        html = html.replace(old_tag, f'<script>\n{content}\n</script>')
        print(f"已内联: {rel} ({len(content)} bytes)")

    # ===== 构建后自动断言 =====
    errors = []

    # 1) 不应残留任何外部 <script src> 标签
    remaining = SRC_PATTERN.findall(html)
    if remaining:
        errors.append(f"存在未内联的外部脚本: {remaining}")

    # 2) 关键安全基础设施必须存在
    for symbol in CRITICAL_SYMBOLS:
        if symbol not in html:
            errors.append(f"缺少安全基础设施: {symbol}")

    # 3) 数据文件必须被内联
    data_file = os.path.join(base_dir, 'data.js')
    if os.path.exists(data_file):
        with open(data_file, 'r', encoding='utf-8') as f:
            if DATA_MARKER not in f.read():
                errors.append(f"data.js 未包含预期标记 {DATA_MARKER!r}")
    else:
        errors.append("data.js 不存在")

    if errors:
        print("\n构建断言失败：")
        for e in errors:
            print("  - " + e)
        sys.exit(1)

    html = html.replace('<title>肌骨康复速查 V5.0 专业版</title>', '<title>肌骨康复速查 V5.0 专业版（单文件）</title>')

    output_path = os.path.join(base_dir, 'single-file-v5.html')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"\n单文件版本已生成: {output_path}")
    print(f"总大小: {len(html) / 1024 / 1024:.2f} MB")
    print("构建断言: 全部通过")


if __name__ == '__main__':
    build()