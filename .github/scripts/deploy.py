#!/usr/bin/env python3
"""
Deploy ULTRA belleza theme to Shopify via Admin API.
Reads files from the theme/ directory and uploads them.
"""

import os
import sys
import json
import base64
import time
import urllib.request
import urllib.error
from pathlib import Path

STORE   = os.environ.get("SHOPIFY_STORE", "x0960f-c1.myshopify.com")
TOKEN   = os.environ.get("SHOPIFY_TOKEN", "")
API_VER = "2024-01"
BASE    = f"https://{STORE}/admin/api/{API_VER}"
HEADERS = {
    "X-Shopify-Access-Token": TOKEN,
    "Content-Type": "application/json",
}

THEME_NAME = "ULTRA belleza"

def request(method, path, body=None):
    url = f"{BASE}{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        print(f"  HTTP {e.code}: {err[:200]}")
        return None

def get_or_create_theme():
    resp = request("GET", "/themes.json")
    if not resp:
        sys.exit("Error al obtener los temas. Verifica el token.")
    themes = resp.get("themes", [])
    # Find unpublished ULTRA belleza theme
    for t in themes:
        if THEME_NAME in t.get("name", "") and t.get("role") != "main":
            print(f"✓ Tema encontrado: {t['name']} (ID: {t['id']})")
            return t["id"]
    # Find any ULTRA belleza theme
    for t in themes:
        if THEME_NAME in t.get("name", ""):
            print(f"✓ Tema encontrado: {t['name']} (ID: {t['id']}) [activo]")
            return t["id"]
    # Create new theme
    print(f"→ Creando tema '{THEME_NAME}'...")
    resp = request("POST", "/themes.json", {"theme": {"name": THEME_NAME, "role": "unpublished"}})
    if not resp or "theme" not in resp:
        sys.exit("No se pudo crear el tema.")
    theme_id = resp["theme"]["id"]
    print(f"✓ Tema creado con ID: {theme_id}")
    return theme_id

def upload_file(theme_id, key, content_bytes):
    """Upload a single file. Binary files use attachment (base64), text files use value."""
    binary_exts = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".woff", ".woff2", ".ttf", ".eot", ".svg"}
    ext = Path(key).suffix.lower()
    if ext in binary_exts:
        body = {"asset": {"key": key, "attachment": base64.b64encode(content_bytes).decode()}}
    else:
        body = {"asset": {"key": key, "value": content_bytes.decode("utf-8", errors="replace")}}
    resp = request("PUT", f"/themes/{theme_id}/assets.json", body)
    return resp is not None

def main():
    if not TOKEN:
        sys.exit("SHOPIFY_TOKEN no está configurado.")

    theme_dir = Path(__file__).parent.parent.parent / "theme"
    if not theme_dir.exists():
        sys.exit(f"Carpeta theme/ no encontrada: {theme_dir}")

    print(f"\n🚀 Conectando a {STORE}...")
    theme_id = get_or_create_theme()

    # Collect all files
    files = []
    for f in sorted(theme_dir.rglob("*")):
        if f.is_file() and not f.name.startswith("."):
            rel = f.relative_to(theme_dir)
            files.append((str(rel).replace("\\", "/"), f))

    print(f"\n📦 Subiendo {len(files)} archivos al tema {theme_id}...\n")
    ok = 0
    fail = 0
    for i, (key, path) in enumerate(files, 1):
        content = path.read_bytes()
        success = upload_file(theme_id, key, content)
        status = "✓" if success else "✗"
        print(f"  [{i:02d}/{len(files)}] {status} {key}")
        if success:
            ok += 1
        else:
            fail += 1
        # Shopify rate limit: ~2 req/s per bucket
        if i % 4 == 0:
            time.sleep(0.5)

    print(f"\n{'='*50}")
    print(f"✅ Subidos: {ok} | ❌ Fallos: {fail}")
    print(f"🔗 Previsualizar: https://{STORE}/?preview_theme_id={theme_id}")
    print(f"📋 Admin: https://admin.shopify.com/store/{STORE.split('.')[0]}/themes/{theme_id}/editor")
    print(f"{'='*50}\n")

    if fail > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
