#!/usr/bin/env python3
"""
Repository-wide verification and integrity script.
Run locally or in CI to ensure:
  1. README.md links are valid and non-empty.
  2. All internal cross-references resolve cleanly.
  3. No Mermaid syntax issues (e.g. unquoted comparison operators).
  4. Zero AI em-dashes (\u2014) in markdown content.
"""

import os
import re
import sys

def get_workspace_root():
    # scripts/ directory is one level below repository root
    return os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def check_readme_links(workspace):
    readme_path = os.path.join(workspace, "README.md")
    if not os.path.exists(readme_path):
        return ["README.md not found!"]
    
    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    links = re.findall(r'\[([^\]]+)\]\((phase-[^)]+\.md)\)', content)
    errors = []
    
    if len(links) != 211:
        errors.append(f"Expected 211 topic links in README.md, found {len(links)}")

    for text, link in links:
        full_path = os.path.join(workspace, link.replace('/', os.sep))
        if not os.path.exists(full_path):
            errors.append(f"Broken link in README: '{text}' -> {link}")
        elif os.path.getsize(full_path) == 0:
            errors.append(f"Empty topic file in README: {link}")
            
    return errors

def check_cross_references(workspace):
    errors = []
    # Map of all known files
    known_topics = {}
    for root, dirs, files in os.walk(workspace):
        if any(p in root.split(os.sep) for p in ['.git', 'node_modules', 'dist', 'viewer', 'scratch', '.system_generated']):
            continue
        for file in files:
            if file.endswith('.md'):
                m = re.match(r'topic-(\d+)-', file)
                if m:
                    phase_folder = os.path.basename(root)
                    phase_m = re.match(r'phase-(\d+)-', phase_folder)
                    if phase_m:
                        p_num = int(phase_m.group(1))
                        t_num = int(m.group(1))
                        full_p = os.path.join(root, file)
                        is_empty = os.path.getsize(full_p) == 0
                        known_topics[(p_num, t_num)] = (file, is_empty)

    for root, dirs, files in os.walk(workspace):
        if any(p in root.split(os.sep) for p in ['.git', 'node_modules', 'dist', 'viewer', 'scratch', '.system_generated']):
            continue
        for file in files:
            if file.endswith('.md'):
                full_p = os.path.join(root, file)
                with open(full_p, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Check for (Phase X, topic Y)
                for m in re.finditer(r'\(Phase\s+(\d+),\s*topics?\s+(\d+)\)', content, re.I):
                    p_num = int(m.group(1))
                    t_num = int(m.group(2))
                    if (p_num, t_num) not in known_topics:
                        errors.append(f"{file}: References non-existent Phase {p_num}, Topic {t_num}")
                    elif known_topics[(p_num, t_num)][1]:
                        errors.append(f"{file}: References EMPTY file Phase {p_num}, Topic {t_num}")

    return errors

def check_mermaid_syntax(workspace):
    errors = []
    for root, dirs, files in os.walk(workspace):
        if any(p in root.split(os.sep) for p in ['.git', 'node_modules', 'dist', 'viewer', 'scratch', '.system_generated']):
            continue
        for file in files:
            if file.endswith('.md'):
                full_p = os.path.join(root, file)
                with open(full_p, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()

                for m in re.finditer(r'```mermaid\s*([\s\S]*?)```', content):
                    block = m.group(1)
                    for line_idx, line in enumerate(block.split('\n'), 1):
                        # Check unquoted < or > in edge labels
                        for lm in re.finditer(r'\|([^|]+)\|', line):
                            label = lm.group(1)
                            if ('<' in label or '>' in label) and not (label.startswith('"') and label.endswith('"')):
                                errors.append(f"{file} (line {line_idx}): Unquoted comparison in edge label: |{label}|")
                        # Check chained & with dotted link
                        if re.search(r'&\s*[\w\d_]+\s*-\.->', line):
                            errors.append(f"{file} (line {line_idx}): Chained '&' with dotted arrow '-.->'")

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
                    errors.append(f"{file}: Found {count} AI em-dashes ('—')")

    return errors

def main():
    workspace = get_workspace_root()
    print(f"Verifying repository at: {workspace}")
    
    all_errors = []
    
    print("1. Checking README.md links...")
    readme_errors = check_readme_links(workspace)
    if readme_errors:
        print(f"   FAILED ({len(readme_errors)} errors)")
        all_errors.extend(readme_errors)
    else:
        print("   PASSED (211 valid, non-empty topic links)")
        
    print("2. Checking cross-references...")
    xref_errors = check_cross_references(workspace)
    if xref_errors:
        print(f"   FAILED ({len(xref_errors)} errors)")
        all_errors.extend(xref_errors)
    else:
        print("   PASSED (0 invalid cross-references)")

    print("3. Checking Mermaid syntax...")
    mermaid_errors = check_mermaid_syntax(workspace)
    if mermaid_errors:
        print(f"   FAILED ({len(mermaid_errors)} errors)")
        all_errors.extend(mermaid_errors)
    else:
        print("   PASSED (0 Mermaid syntax violations)")

    print("4. Checking AI em-dashes...")
    dash_errors = check_ai_em_dashes(workspace)
    if dash_errors:
        print(f"   FAILED ({len(dash_errors)} errors)")
        all_errors.extend(dash_errors)
    else:
        print("   PASSED (0 em-dashes found)")

    print("-" * 50)
    if all_errors:
        print(f"VERIFICATION FAILED WITH {len(all_errors)} ERRORS:")
        for err in all_errors[:20]:
            print(f"  - {err}")
        if len(all_errors) > 20:
            print(f"  ... and {len(all_errors) - 20} more errors.")
        sys.exit(1)
    else:
        print("ALL QUALITY & INTEGRITY GATES PASSED! (100% CLEAN)")
        sys.exit(0)

if __name__ == "__main__":
    main()
