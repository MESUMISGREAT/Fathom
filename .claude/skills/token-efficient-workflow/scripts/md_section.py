#!/usr/bin/env python3
"""Print one Markdown section, or list a file's headings, so only the relevant part is read.

Usage:
  python md_section.py FILE "Heading text"   # the section under the first heading matching the text
  python md_section.py FILE --headings       # every heading with its line number

A section runs from its heading to the next heading at the same or a higher level.
Headings inside fenced code blocks are ignored. Matching is case-insensitive and
exact first, then by substring.
"""
import re
import sys

HEADING = re.compile(r'^(#{1,6})\s+(.*?)\s*#*\s*$')


def headings(lines):
    fence = None
    for i, line in enumerate(lines):
        stripped = line.lstrip()
        if stripped.startswith(('```', '~~~')):
            marker = stripped[:3]
            fence = None if fence == marker else (fence or marker)
            continue
        if fence:
            continue
        m = HEADING.match(line)
        if m:
            yield i, len(m.group(1)), m.group(2)


def main(argv):
    if len(argv) != 3:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    path, query = argv[1], argv[2]
    with open(path, encoding='utf-8') as f:
        lines = f.read().splitlines()
    found = list(headings(lines))

    if query == '--headings':
        for i, level, text in found:
            print(f"{i + 1}: {'#' * level} {text}")
        return 0

    q = query.strip().lower()
    match = next((h for h in found if h[2].lower() == q), None) or next((h for h in found if q in h[2].lower()), None)
    if not match:
        print(f'No heading matching "{query}" in {path}. Run with --headings to list them.', file=sys.stderr)
        return 1
    start, level, _ = match
    end = next((i for i, lv, _ in found if i > start and lv <= level), len(lines))
    print(f'[{path} lines {start + 1}-{end}]')
    print('\n'.join(lines[start:end]))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
