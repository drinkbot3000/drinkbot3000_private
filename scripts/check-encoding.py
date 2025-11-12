#!/usr/bin/env python3
"""
Encoding Validation Script for DrinkBot3000

This script checks for text encoding errors (mojibake) in source files.
Run this before committing to ensure all files use proper UTF-8 encoding.

Usage:
    python3 scripts/check-encoding.py
"""

import os
import sys
from pathlib import Path

# Mojibake patterns to detect (double-encoded UTF-8)
MOJIBAKE_PATTERNS = [
    b'\xc3\xa2\xc2\x9d\xc5\x92',  # ❌ encoded wrong
    b'\xc3\xa2\xc2\x9c\xe2\x80\x9c',  # ✓ encoded wrong
    b'\xc3\xa2\xc2\x9c\xc5\x93',  # ✓ encoded wrong (variant)
    b'\xc3\xa2\xe2\x80\xa0\xe2\x80\x99',  # → encoded wrong
    b'\xc3\xa2',  # Generic mojibake start bytes
]

# File extensions to check
FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.md', '.json']

# Directories to skip
SKIP_DIRS = ['node_modules', 'build', 'dist', '.git', 'coverage']


def check_file_encoding(file_path):
    """Check a single file for encoding errors."""
    try:
        with open(file_path, 'rb') as f:
            content = f.read()

        errors = []
        for pattern in MOJIBAKE_PATTERNS:
            if pattern in content:
                # Count occurrences
                count = content.count(pattern)
                errors.append(f"  Found {count} mojibake pattern(s): {pattern.hex()}")

        return errors
    except Exception as e:
        return [f"  Error reading file: {e}"]


def check_all_files(root_dir):
    """Check all relevant files in the project."""
    root_path = Path(root_dir)
    files_checked = 0
    files_with_errors = 0
    total_errors = []

    print("🔍 Checking files for encoding errors...\n")

    for file_path in root_path.rglob('*'):
        # Skip directories
        if file_path.is_dir():
            continue

        # Skip if in skip_dirs
        if any(skip_dir in file_path.parts for skip_dir in SKIP_DIRS):
            continue

        # Check only relevant file extensions
        if file_path.suffix not in FILE_EXTENSIONS:
            continue

        files_checked += 1
        errors = check_file_encoding(file_path)

        if errors:
            files_with_errors += 1
            relative_path = file_path.relative_to(root_path)
            print(f"❌ {relative_path}")
            for error in errors:
                print(error)
            print()
            total_errors.extend(errors)

    # Summary
    print("=" * 60)
    print(f"Files checked: {files_checked}")
    print(f"Files with errors: {files_with_errors}")

    if files_with_errors == 0:
        print("\n✅ All files have correct UTF-8 encoding!")
        return 0
    else:
        print(f"\n❌ Found encoding errors in {files_with_errors} file(s)")
        print("\nTo fix encoding errors:")
        print("  1. Open the file in a UTF-8 capable editor")
        print("  2. Ensure editor is set to UTF-8 encoding")
        print("  3. Replace mojibake characters with correct UTF-8:")
        print("     - Checkmark: Use U+2713")
        print("     - X mark: Use U+274C")
        print("     - Right arrow: Use U+2192")
        print("  4. Save file with UTF-8 encoding")
        return 1


if __name__ == '__main__':
    # Get project root (parent of scripts directory)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    sys.exit(check_all_files(project_root))
