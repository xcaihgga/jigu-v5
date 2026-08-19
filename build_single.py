#!/usr/bin/env python3
"""构建脚本：支持单文件模式和分离部署模式

使用方式：
  python3 build_single.py              # 默认：分离部署模式（懒加载）
  python3 build_single.py --single      # 单文件模式（所有代码内联）
  python3 build_single.py --deploy     # 分离部署模式（输出到 dist 目录）
"""
import re
import os
import sys
import shutil

base_dir = os.path.dirname(os.path.abspath(__file__))

# 配置：需要内联的数据文件（用于单文件模式）
DATA_SCRIPTS = {
    'data/data.js': 'data.js',
    'src/scales.js': 'scales.js',
    'src/scales-extra.js': 'scales-extra.js',
    'src/scales-pro.js': 'scales-pro.js',
    'src/clinical-tools.js': 'clinical-tools.js',
    'src/knowledge-base.js': 'knowledge-base.js',
    'src/rehab-protocols.js': 'rehab-protocols.js',
    'src/protocols-pro.js': 'protocols-pro.js',
    'src/pain-protocols.js': 'pain-protocols.js',
}

# 用于匹配的 script src 模式
SRC_PATTERN = re.compile(r'<script src="([^"]+)"[^>]*></script>')


def build_single():
    """单文件模式：将所有脚本内联到 HTML"""
    print("=" * 50)
    print("构建模式：单文件（全内联）")
    print("=" * 50)
    
    # 读取原始 index.html（不包含懒加载的 loader 引用版本）
    with open(os.path.join(base_dir, 'index.html'), 'r', encoding='utf-8') as f:
        html = f.read()

    # 先内联 data-loader.js
    loader_path = os.path.join(base_dir, 'src/data-loader.js')
    loader_pattern = r'<script\s+src="src/data-loader\.js"[^>]*></script>'
    loader_match = re.search(loader_pattern, html)
    if loader_match and os.path.exists(loader_path):
        with open(loader_path, 'r', encoding='utf-8') as f:
            loader_content = f.read()
        html = html.replace(loader_match.group(0), f'<script>\n{loader_content}\n</script>')
        print(f"  已内联: src/data-loader.js ({len(loader_content)} bytes)")
    else:
        print("  警告: 未找到 data-loader.js 引用")

    # 需要内联的数据文件列表（原始 src 属性 -> 实际文件路径）
    data_scripts = [
        ('data/data.js?v=4.0', 'data.js'),
        ('src/scales.js?v=4.0', 'src/scales.js'),
        ('src/scales-extra.js?v=4.0', 'src/scales-extra.js'),
        ('src/scales-pro.js?v=4.0', 'src/scales-pro.js'),
        ('src/clinical-tools.js?v=4.0', 'src/clinical-tools.js'),
        ('src/knowledge-base.js?v=4.0', 'src/knowledge-base.js'),
        ('src/rehab-protocols.js?v=4.0', 'src/rehab-protocols.js'),
        ('src/protocols-pro.js?v=4.0', 'src/protocols-pro.js'),
        ('src/pain-protocols.js?v=4.0', 'src/pain-protocols.js'),
    ]

    # 注意：由于现在 index.html 已经不直接引用这些数据脚本，
    # 我们需要特殊处理——在 </body> 标签前注入内联的数据
    # 这样单文件模式下数据仍然可用
    
    # 收集所有数据内容
    data_contents = []
    for src_attr, filepath in data_scripts:
        full_path = os.path.join(base_dir, filepath)
        if os.path.exists(full_path):
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            data_contents.append(f'\n{content}')
            print(f"  已读取: {filepath} ({len(content)} bytes)")
        else:
            print(f"  警告: 文件不存在 {full_path}")

    # 构建内联数据脚本
    inline_data_script = f'<script>{"".join(data_contents)}\n</script>'

    # 在 init() 调用前注入内联数据
    # 使用字符串查找替换，避免正则问题
    target = '</body>'
    insert_pos = html.rfind('</body>')
    if insert_pos > 0:
        html = html[:insert_pos] + inline_data_script + '\n' + html[insert_pos:]
    else:
        html += '\n' + inline_data_script

    # 修改标题
    html = html.replace('<title>肌骨康复速查 V5.0 专业版</title>', 
                        '<title>肌骨康复速查 V5.0 专业版（单文件）</title>')

    # 输出
    output_path = os.path.join(base_dir, 'single-file-v5.html')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

    size_mb = len(html) / 1024 / 1024
    print(f"\n单文件版本已生成: {output_path}")
    print(f"总大小: {size_mb:.2f} MB")
    print("✅ 单文件构建完成")


def build_deploy():
    """分离部署模式：核心 HTML + 独立数据文件"""
    print("=" * 50)
    print("构建模式：分离部署（懒加载）")
    print("=" * 50)
    
    deploy_dir = os.path.join(base_dir, 'dist')
    
    # 清理并创建输出目录
    if os.path.exists(deploy_dir):
        shutil.rmtree(deploy_dir)
    os.makedirs(deploy_dir)
    os.makedirs(os.path.join(deploy_dir, 'src'))

    # 1. 处理 index.html（核心页面）
    with open(os.path.join(base_dir, 'index.html'), 'r', encoding='utf-8') as f:
        html = f.read()

    # 移除数据脚本引用（这些将作为独立文件部署）
    data_script_patterns = [
        r'<script\s+src="(?:data/)?data\.js[^"]*"[^>]*></script>',
        r'<script\s+src="src/scales\.js[^"]*"[^>]*></script>',
        r'<script\s+src="src/scales-extra\.js[^"]*"[^>]*></script>',
        r'<script\s+src="src/scales-pro\.js[^"]*"[^>]*></script>',
        r'<script\s+src="src/clinical-tools[^"]*"[^>]*></script>',
        r'<script\s+src="src/knowledge-base[^"]*"[^>]*></script>',
        r'<script\s+src="src/rehab-protocols[^"]*"[^>]*></script>',
        r'<script\s+src="src/protocols-pro\.js[^"]*"[^>]*></script>',
        r'<script\s+src="src/pain-protocols[^"]*"[^>]*></script>',
    ]

    for pattern in data_script_patterns:
        html = re.sub(pattern, '', html)

    # 移除 data-loader.js（核心页面不需要，它会动态加载数据）
    # 保留 data-loader.js 引用，因为它负责加载数据
    
    # 修改标题
    html = html.replace('<title>肌骨康复速查 V5.0 专业版</title>', 
                        '<title>肌骨康复速查 V5.0 专业版</title>')

    # 写入核心 index.html
    output_html = os.path.join(deploy_dir, 'index.html')
    with open(output_html, 'w', encoding='utf-8') as f:
        f.write(html)
    
    html_size = os.path.getsize(output_html)
    print(f"\n  ✅ 核心页面已生成: {output_html}")
    print(f"     大小: {html_size / 1024:.1f} KB (首屏加载)")

    # 2. 复制数据文件 + 核心模块脚本（index.html 直接引用的全部 src）
    data_files = [
        ('data.js', 'data.js'),
        ('src/app-config.js', 'src/app-config.js'),
        # 拆分模块（被 index.html 直接 <script src> 引用，必须部署）
        ('src/logger.js', 'src/logger.js'),
        ('src/utils.js', 'src/utils.js'),
        ('src/realtime-bar.js', 'src/realtime-bar.js'),
        ('src/router.js', 'src/router.js'),
        ('src/muscle-disease.js', 'src/muscle-disease.js'),
        ('src/scales-ui.js', 'src/scales-ui.js'),
        ('src/protocols-tools-guidelines.js', 'src/protocols-tools-guidelines.js'),
        ('src/dashboard.js', 'src/dashboard.js'),
        ('src/migration-report.js', 'src/migration-report.js'),
        # 数据文件（由 data-loader.js 异步加载）
        ('src/scales.js', 'src/scales.js'),
        ('src/scales-extra.js', 'src/scales-extra.js'),
        ('src/scales-pro.js', 'src/scales-pro.js'),
        ('src/clinical-tools.js', 'src/clinical-tools.js'),
        ('src/knowledge-base.js', 'src/knowledge-base.js'),
        ('src/rehab-protocols.js', 'src/rehab-protocols.js'),
        ('src/protocols-pro.js', 'src/protocols-pro.js'),
        ('src/pain-protocols.js', 'src/pain-protocols.js'),
    ]

    total_data_size = 0
    for src, dst in data_files:
        src_path = os.path.join(base_dir, src)
        dst_path = os.path.join(deploy_dir, dst)
        
        if os.path.exists(src_path):
            os.makedirs(os.path.dirname(dst_path), exist_ok=True)
            shutil.copy2(src_path, dst_path)
            size = os.path.getsize(dst_path)
            total_data_size += size
            print(f"  ✅ 数据文件已复制: {dst} ({size / 1024:.1f} KB)")
        else:
            print(f"  ⚠️  文件不存在: {src}")

    # 3. 复制 data-loader.js
    loader_src = os.path.join(base_dir, 'src/data-loader.js')
    if os.path.exists(loader_src):
        shutil.copy2(loader_src, os.path.join(deploy_dir, 'src/data-loader.js'))
        print(f"  ✅ 加载器已复制: src/data-loader.js")

    # 3.5 复制 assets 目录（解剖插图，被 muscle-disease.js 的 illustrationHtml 引用）
    assets_src = os.path.join(base_dir, 'assets')
    assets_dst = os.path.join(deploy_dir, 'assets')
    if os.path.exists(assets_src):
        shutil.copytree(assets_src, assets_dst)
        asset_count = sum(len(files) for _, _, files in os.walk(assets_dst))
        print(f"  ✅ 静态资源已复制: assets/ ({asset_count} 个文件)")
    else:
        print(f"  ⚠️  assets 目录不存在: {assets_src}")

    # 4. 创建 .nojekyll（GitHub Pages 需要）
    with open(os.path.join(deploy_dir, '.nojekyll'), 'w') as f:
        pass

    # 5. 创建说明文件
    readme = f"""# 肌骨康复速查 V5.0 - 分离部署版

## 部署说明

此目录包含分离部署版本，核心页面和数据文件分离，实现懒加载。

### 加载策略
- 核心页面(index.html)：仅 ~{html_size // 1024} KB，首屏秒开
- 数据文件：异步加载，完成后初始化应用

### 部署要求
将此 `dist` 目录的所有文件上传到 GitHub Pages 根目录即可。

### 文件结构
```
dist/
├── index.html          # 核心页面（首屏加载）
├── .nojekyll           # GitHub Pages 标记
├── data.js             # 数据文件（异步加载）
├── src/
│   ├── data-loader.js  # 数据加载器
│   ├── scales.js       # 评估量表数据
│   ├── ...
```
"""
    with open(os.path.join(deploy_dir, 'README.md'), 'w', encoding='utf-8') as f:
        f.write(readme)

    print(f"\n📊 构建统计:")
    print(f"   核心页面: {html_size / 1024:.1f} KB")
    print(f"   数据总量: {total_data_size / 1024 / 1024:.2f} MB")
    print(f"   首屏加载: 仅需加载核心页面")
    print(f"\n✅ 分离部署构建完成")
    print(f"\n📁 部署目录: {deploy_dir}")
    print(f"   将 {deploy_dir} 中的所有文件推送到 GitHub Pages 即可上线")


if __name__ == '__main__':
    mode = 'deploy'  # 默认分离部署模式
    
    if '--single' in sys.argv:
        mode = 'single'
    elif '--deploy' in sys.argv:
        mode = 'deploy'
    elif '--help' in sys.argv or '-h' in sys.argv:
        print(__doc__)
        sys.exit(0)
    
    if mode == 'single':
        build_single()
    else:
        build_deploy()
