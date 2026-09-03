#!/usr/bin/env python3
"""
Dynamic, repository-wide verification and integrity engine.
Run locally or in CI to ensure:
  1. Bidirectional Disk <-> README.md synchronization.
  2. All internal cross-references resolve cleanly.
  3. No Mermaid syntax issues (e.g. unquoted comparison operators, broken dotted links).
  4. Zero AI em-dashes (\u2014) in markdown content.
  5. Minimum content depth threshold (guaranteeing comprehensive technical notes).
  6. Standard heading structure (# Single H1 per topic).
"""

import os
import re
import sys

def get_workspace_root():
    return os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def get_disk_topics(workspace):
    """Discovers all topic markdown files across phase directories."""
    disk_topics = {}
    for root, dirs, files in os.walk(workspace):
        if any(p in root.split(os.sep) for p in ['.git', 'node_modules', 'dist', 'viewer', 'scratch', '.system_generated']):
            continue
        rel_dir = os.path.relpath(root, workspace)
        if re.match(r'^phase-\d+', rel_dir):
            for file in files:
                if file.endswith('.md') and re.match(r'^topic-\d+', file):
                    rel_path = os.path.join(rel_dir, file).replace('\\', '/')
                    abs_path = os.path.join(root, file)
                    disk_topics[rel_path] = abs_path
    return disk_topics

def check_readme_synchronization(workspace, disk_topics):
    readme_path = os.path.join(workspace, "README.md")
    if not os.path.exists(readme_path):
        return ["README.md not found!"]
    
    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    links = re.findall(r'\[([^\]]+)\]\((phase-[^)]+\.md)\)', content)
    errors = []
    
    readme_links_set = set()
    for text, link in links:
        norm_link = link.replace('\\', '/')
        readme_links_set.add(norm_link)
        if norm_link not in disk_topics:
            errors.append(f"Broken link in README.md: '{text}' -> {norm_link} (File does not exist on disk)")
        elif os.path.getsize(disk_topics[norm_link]) == 0:
            errors.append(f"Empty topic file referenced in README.md: {norm_link}")

    # Check for orphaned files on disk that are NOT in README.md
    for disk_rel in sorted(disk_topics.keys()):
        if disk_rel not in readme_links_set:
            errors.append(f"Orphaned file on disk not linked in README.md: {disk_rel}")

    return errors, len(links)

def check_cross_references(workspace, disk_topics):
    errors = []
    known_topics = {}
    
    for rel_path, abs_path in disk_topics.items():
        m_phase = re.match(r'phase-(\d+)', rel_path)
        m_topic = re.search(r'topic-(\d+)', rel_path)
        if m_phase and m_topic:
            p_num = int(m_phase.group(1))
            t_num = int(m_topic.group(1))
            is_empty = os.path.getsize(abs_path) == 0
            known_topics[(p_num, t_num)] = (rel_path, is_empty)

    for root, dirs, files in os.walk(workspace):
        if any(p in root.split(os.sep) for p in ['.git', 'node_modules', 'dist', 'viewer', 'scratch', '.system_generated']):
            continue
        for file in files:
            if file.endswith('.md'):
                full_p = os.path.join(root, file)
                with open(full_p, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                for m in re.finditer(r'\(Phase\s+(\d+),\s*topics?\s+(\d+)\)', content, re.I):
                    p_num = int(m.group(1))
                    t_num = int(m.group(2))
                    if (p_num, t_num) not in known_topics:
                        errors.append(f"{file}: References non-existent Phase {p_num}, Topic {t_num}")
                    elif known_topics[(p_num, t_num)][1]:
                        errors.append(f"{file}: References EMPTY file Phase {p_num}, Topic {t_num}")

    return errors

def check_mermaid_syntax(disk_topics):
    errors = []
    for rel_path, abs_path in disk_topics.items():
        with open(abs_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        for m in re.finditer(r'```mermaid\s*([\s\S]*?)```', content):
            block = m.group(1)
            for line_idx, line in enumerate(block.split('\n'), 1):
                # Check unquoted < or > in edge labels
                for lm in re.finditer(r'\|([^|]+)\|', line):
                    label = lm.group(1)
                    if ('<' in label or '>' in label) and not (label.startswith('"') and label.endswith('"')):
                        errors.append(f"{rel_path} (line {line_idx}): Unquoted comparison in edge label: |{label}|")
                # Check chained & with dotted arrow
                if re.search(r'&\s*[\w\d_]+\s*-\.->', line):
                    errors.append(f"{rel_path} (line {line_idx}): Chained '&' with dotted arrow '-.->'")

    return errors

def check_ai_em_dashes(workspace):
    errors = []
    for root, dirs, files in os.walk(workspace):
        if any(p in root.split(os.sep) for p in ['.git', 'node_modules', 'dist', 'viewer', 'scratch', '.system_generated']):
            continue
        for file in files:
            if file.endswith('.md'):
                full_p = os.path.join(root, file)
                with open(full_p, 'r', encoding='utf-8', errors='ignore') as f:
                    c = f.read()
                count = c.count('\u2014')
                if count > 0:
                    rel_f = os.path.relpath(full_p, workspace).replace('\\', '/')
                    errors.append(f"{rel_f}: Found {count} AI em-dashes ('—')")

    return errors

def check_content_depth_and_headings(disk_topics):
    errors = []
    for rel_path, abs_path in disk_topics.items():
        with open(abs_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        words = len(re.findall(r'\b\w+\b', content))
        if words < 300:
            errors.append(f"{rel_path}: Insufficient content depth ({words} words < 300 words threshold)")

        # Strip code blocks before checking markdown headings
        text_without_code = re.sub(r'```[\s\S]*?```', '', content)
        h1s = re.findall(r'^#\s+(.+)$', text_without_code, re.M)
        if len(h1s) == 0:
            errors.append(f"{rel_path}: Missing top-level # H1 heading")
        elif len(h1s) > 1:
            errors.append(f"{rel_path}: Multiple ({len(h1s)}) # H1 headings found; expected exactly 1")

    return errors

def check_latex_math_syntax(disk_topics):
    errors = []
    for rel_path, abs_path in disk_topics.items():
        with open(abs_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        # Check for unescaped & inside display math $$ ... $$
        for m in re.finditer(r'\$\$([^\$]+)\$\$', content):
            math_block = m.group(1)
            if re.search(r'(?<!\\)&', math_block):
                if not ('\\begin{align' in math_block or '\\begin{matrix' in math_block):
                    errors.append(f"{rel_path}: Unescaped '&' inside $$ LaTeX math block")

    return errors

def main():
    workspace = get_workspace_root()
    print(f"==================================================")
    print(f"System Design Curriculum Verification Engine")
    print(f"Workspace: {workspace}")
    print(f"==================================================")
    
    all_errors = []
    
    # 1. Discover disk topics dynamically
    disk_topics = get_disk_topics(workspace)
    print(f"Discovered {len(disk_topics)} topic files on disk.")
    
    print("\n1. Checking README.md Bidirectional Parity...")
    sync_errors, readme_link_count = check_readme_synchronization(workspace, disk_topics)
    if sync_errors:
        print(f"   FAILED ({len(sync_errors)} errors)")
        all_errors.extend(sync_errors)
    else:
        print(f"   PASSED ({readme_link_count} topics in README.md perfectly match {len(disk_topics)} files on disk)")

    print("2. Checking Cross-References...")
    xref_errors = check_cross_references(workspace, disk_topics)
    if xref_errors:
        print(f"   FAILED ({len(xref_errors)} errors)")
        all_errors.extend(xref_errors)
    else:
        print("   PASSED (0 broken or empty references)")

    print("3. Checking Mermaid Syntax...")
    mermaid_errors = check_mermaid_syntax(disk_topics)
    if mermaid_errors:
        print(f"   FAILED ({len(mermaid_errors)} errors)")
        all_errors.extend(mermaid_errors)
    else:
        print("   PASSED (0 syntax violations across all diagrams)")

    print("4. Checking AI Em-Dashes...")
    dash_errors = check_ai_em_dashes(workspace)
    if dash_errors:
        print(f"   FAILED ({len(dash_errors)} errors)")
        all_errors.extend(dash_errors)
    else:
        print("   PASSED (0 AI em-dashes found)")

    print("5. Checking Content Depth & Heading Structure...")
    depth_errors = check_content_depth_and_headings(disk_topics)
    if depth_errors:
        print(f"   FAILED ({len(depth_errors)} errors)")
        all_errors.extend(depth_errors)
    else:
        print(f"   PASSED (All {len(disk_topics)} topics exceed depth threshold with valid H1 structure)")

    print("6. Checking LaTeX Math Syntax...")
    math_errors = check_latex_math_syntax(disk_topics)
    if math_errors:
        print(f"   FAILED ({len(math_errors)} errors)")
        all_errors.extend(math_errors)
    else:
        print("   PASSED (0 unescaped '&' or LaTeX syntax errors)")

    print("\n" + "=" * 50)
    if all_errors:
        print(f"VERIFICATION FAILED WITH {len(all_errors)} ERRORS:")
        for err in all_errors[:25]:
            print(f"  - {err}")
        if len(all_errors) > 25:
            print(f"  ... and {len(all_errors) - 25} more errors.")
        sys.exit(1)
    else:
        print(f"ALL 6 QUALITY GATES PASSED! (100% CLEAN - {len(disk_topics)} TOPICS)")
        sys.exit(0)

if __name__ == "__main__":
    main()
