# 36-website

Landing page WWW przygotowany na bazie projektu Flutter `moja_apka`.

## Co zawiera

- responsywny landing page (desktop/mobile)
- sekcje trybów gry inspirowane aplikacją (Classic 36, Rozmowy, Karty Wariata)
- animacje wejścia elementów
- gotową strukturę pod publikację statyczną

## Uruchomienie lokalne

Otwórz plik `index.html` w przeglądarce.

## Publikacja

Możesz wdrożyć stronę na dowolnym hostingu statycznym (GitHub Pages, Netlify, Vercel).

### GitHub Pages (automatycznie)

W repo jest gotowy workflow: `.github/workflows/deploy-pages.yml`.

1. Wejdź w ustawienia repo: Settings -> Pages.
2. W Source wybierz GitHub Actions.
3. Każdy push na `main` automatycznie wdroży stronę.

### Podmiana screenshotów

Sekcja screenshotów jest w `index.html` pod `#sekcja-screenshoty`.
Podmień wartości `src` w trzech tagach `<img>` na swoje linki do screenów.

### Baner hero (Google App)

Aby aktywować baner w sekcji hero, dodaj plik:

- `graphics/banner-google-app.webp`

Layout ma fallback, ale po dodaniu pliku baner pojawi sie automatycznie.
