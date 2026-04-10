#!/usr/bin/env python3
"""Génère les screenshots de l'application pour la documentation."""

import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = "https://localhost:5173"
OUT = Path("screenshots")
OUT.mkdir(exist_ok=True)

MOBILE = {"width": 390, "height": 844}  # iPhone 14


async def login(page):
    """Se connecte via le mock OIDC en cliquant sur 'Utilisateur Test'."""
    await page.goto(BASE_URL, wait_until="networkidle")
    await page.click("text=Connexion")
    await page.wait_for_selector("button.user-btn")
    await page.click("button.user-btn")
    await page.wait_for_url(f"{BASE_URL}/accueil")


async def screenshot(page, name: str, path: str = None, wait_selector: str = None):
    if path:
        await page.goto(f"{BASE_URL}{path}", wait_until="networkidle")
    if wait_selector:
        await page.wait_for_selector(wait_selector)
    await page.wait_for_timeout(300)
    filepath = OUT / f"{name}.png"
    await page.screenshot(path=str(filepath), full_page=False)
    print(f"  ✓ {filepath}")


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        ctx = await browser.new_context(
            viewport=MOBILE,
            ignore_https_errors=True,
        )
        page = await ctx.new_page()

        print("Connexion...")
        await login(page)

        print("\nAccueil")
        await screenshot(page, "accueil")

        print("\nInventaire")
        await screenshot(page, "inventaire_accueil", "/inventaire")
        # Remplir le numéro de zone pour débloquer la liste
        await page.fill("input", "042")
        await page.click("text=Démarrer l'inventaire")
        await page.wait_for_url(f"{BASE_URL}/inventaire/list/")
        await screenshot(page, "inventaire_liste")
        # Aller directement sur la saisie manuelle via l'URL du scan
        await page.goto(f"{BASE_URL}/inventaire/scan", wait_until="networkidle")
        await page.wait_for_selector("button", timeout=5000)
        await page.locator("button", has_text="Saisie manuelle").click()
        await screenshot(page, "inventaire_scan_manuel")
        await page.fill("input", "0420000020868")
        await page.locator("button", has_text="Valider").click()
        await page.wait_for_url(lambda u: "/inventaire/form" in u)
        await screenshot(page, "inventaire_form", wait_selector="input[type=number]")
        await page.fill("input[type=number]", "12")
        await screenshot(page, "inventaire_form_rempli")
        await page.locator("button", has_text="Valider").click()
        await page.wait_for_url(f"{BASE_URL}/inventaire/list/")
        await screenshot(page, "inventaire_liste_produit")
        await page.locator("button", has_text="Terminer").click()
        await page.wait_for_url(f"{BASE_URL}/inventaire/send")
        await screenshot(page, "inventaire_envoi")

        print("\nRéception")
        await screenshot(page, "reception_accueil", "/reception")
        await page.locator("button", has_text="Commencer").click()
        await page.wait_for_url(f"{BASE_URL}/reception/commandes")
        await screenshot(page, "reception_commandes", wait_selector="input[type=text]")
        # Naviguer directement sur PO13930 qui a des produits avec barcode
        await page.goto(f"{BASE_URL}/reception/commandes/PO13930/products", wait_until="networkidle")
        await page.wait_for_timeout(1000)
        await screenshot(page, "reception_produits")
        # Scan via saisie manuelle
        scan_btn = page.locator("button", has_text="Scanner Code Barre")
        if await scan_btn.count() > 0:
            await scan_btn.click()
            await page.wait_for_url(lambda u: "/scan" in u)
            await page.wait_for_selector("button", timeout=5000)
            await page.locator("button", has_text="Saisie manuelle").click()
            await screenshot(page, "reception_scan_manuel")
            # Saisir le barcode du premier produit de PO13930
            await page.fill("input", "0420000020868")
            await page.locator("button", has_text="Valider").click()
            await page.wait_for_url(lambda u: "/products/" in u and "/scan" not in u, timeout=10000)
            await screenshot(page, "reception_form", wait_selector="button")

        await browser.close()
        print("\nTerminé — screenshots dans ./screenshots/")


asyncio.run(main())
