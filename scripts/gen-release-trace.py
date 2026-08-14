#!/usr/bin/env python3
"""自动生成 RELEASENOTES.md「五、推送追溯」章节，替代手工填 SHA。

用法：
  python3 scripts/gen-release-trace.py                 # 打印追溯章节到 stdout
  python3 scripts/gen-release-trace.py --range=v5.0.0..HEAD   # 指定提交范围（默认 HEAD~6..HEAD）
  python3 scripts/gen-release-trace.py --write         # 更新 RELEASENOTES.md 的 <!-- TRACE-START/END --> 标记区间

说明：SHA、变更文件数、关键文件字节数全部从 git / 文件系统实时读取，
不再需要像 v5.0.1 那样为补 SHA 单独提交两个 docs commit。
"""
import datetime
import os
import re
import subprocess
import sys

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY_FILES = ['src/utils.js', 'src/scales-ui.js', 'index.html', 'RELEASENOTES.md']


def git_opt(*args):
    r = subprocess.run(['git', '-C', base_dir, *args], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else ''


def render(rng):
    # 提交链（倒序：最新在前），含变更文件数。
    # git log --shortstat 输出为 FORMAT\n\nSTAT\n\nFORMAT\n\nSTAT... 交替结构，
    # 按 '\n\n' 拆分后偶数索引是 FORMAT、奇数索引是 STAT。
    raw = git_opt('log', rng, '--shortstat', '--format=%H%x1f%an%x1f%ad%x1f%s', '--date=short')
    commits = []
    chunks = [c for c in raw.split('\n\n') if c.strip()]
    for i in range(0, len(chunks), 2):
        fields = chunks[i].split('\x1f')
        if len(fields) < 4:
            continue
        full, author, date, subject = fields[0], fields[1], fields[2], fields[3]
        changed = 0
        if i + 1 < len(chunks):
            m = re.match(r'^\s*(\d+) files? changed', chunks[i + 1].strip())
            if m:
                changed = int(m.group(1))
        commits.append({'full': full, 'short': full[:10], 'author': author,
                        'date': date, 'subject': subject, 'changed': changed})

    sizes = []
    for f in KEY_FILES:
        p = os.path.join(base_dir, f)
        sizes.append((f, os.path.getsize(p) if os.path.exists(p) else None))

    now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d')
    out = []
    out.append('<!-- TRACE-START -->')
    out.append('### 远端推送链（按时间倒序 · 脚本自动生成，勿手工填 SHA）')
    out.append('')
    out.append('| 顺序 | Commit SHA | 说明 | 变更大小 |')
    out.append('|---|---|---|---|')
    for i, c in enumerate(commits, 1):
        subj = c['subject'].replace('|', '\\|')
        out.append('| %s | `%s` | %s（%s · %s）| %d files changed |'
                   % (i, c['full'], subj, c['author'], c['date'], c['changed']))
    out.append('')
    out.append('### 关键文件字节数（本地工作区）')
    out.append('')
    out.append('```')
    for f, sz in sizes:
        out.append('  %-22s %s' % (f, sz if sz is not None else '缺失'))
    out.append('```')
    out.append('')
    head = git_opt('rev-parse', 'HEAD').strip()
    out.append('### Push 状态回显（自动生成于 %s）' % now)
    out.append('> 由脚本读取 `git rev-parse HEAD` 与关键文件字节数生成；HEAD = `%s`' % head)
    out.append('<!-- TRACE-END -->')
    return '\n'.join(out) + '\n'


def main():
    argv = sys.argv[1:]
    rng = 'HEAD~6..HEAD'
    write = False
    for a in argv:
        if a == '--write':
            write = True
        elif a.startswith('--range='):
            rng = a.split('=', 1)[1]
        elif a in ('-h', '--help'):
            print(__doc__)
            sys.exit(0)
    if not rng or '..' not in rng:
        print('提交范围无效：%s' % rng, file=sys.stderr)
        sys.exit(1)

    text = render(rng)
    if not write:
        print(text)
        return

    path = os.path.join(base_dir, 'RELEASENOTES.md')
    with open(path, encoding='utf-8') as f:
        content = f.read()
    if '<!-- TRACE-START -->' not in content or '<!-- TRACE-END -->' not in content:
        print('RELEASENOTES.md 中未找到 <!-- TRACE-START / TRACE-END --> 标记，无法自动更新', file=sys.stderr)
        sys.exit(1)
    new_content = re.sub(r'<!-- TRACE-START -->[\s\S]*?<!-- TRACE-END -->',
                         text.strip(), content)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('✅ 已更新 %s 的推送追溯章节（%d 条提交）' % (path, len(text.count('| `')) ))


if __name__ == '__main__':
    main()
