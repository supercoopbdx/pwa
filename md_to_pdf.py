#!/usr/bin/env python3
"""Convertit un fichier Markdown en PDF via weasyprint."""

import sys
import pathlib
import markdown
from weasyprint import HTML

if len(sys.argv) != 3:
    print(f"Usage: {sys.argv[0]} input.md output.pdf")
    sys.exit(1)

src = pathlib.Path(sys.argv[1])
dst = pathlib.Path(sys.argv[2])

css = """
body { font-family: sans-serif; margin: 2cm; line-height: 1.6; color: #222; }
h1 { font-size: 1.6em; border-bottom: 2px solid #333; padding-bottom: 0.3em; }
h2 { font-size: 1.3em; margin-top: 1.5em; }
h3 { font-size: 1.1em; }
table { border-collapse: collapse; width: 100%; margin: 1em 0; }
th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
th { background: #f0f0f0; font-weight: bold; }
blockquote { border-left: 4px solid #f0a000; margin-left: 0; padding-left: 1em; color: #555; background: #fffbe6; }
code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; font-size: 0.9em; }
pre { background: #f4f4f4; padding: 1em; border-radius: 5px; overflow-x: auto; }
li { margin: 0.3em 0; }
"""

md_text = src.read_text(encoding="utf-8")
html_body = markdown.markdown(md_text, extensions=["tables"])
html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>{css}</style></head>
<body>{html_body}</body></html>"""

HTML(string=html, base_url=str(src.parent)).write_pdf(dst)
print(f"PDF généré : {dst}")
