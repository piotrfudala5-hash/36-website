# 36-website

Statyczny landing page WWW dla aplikacji `36 pytań`, przygotowany jako osobny,
lekki frontend do publikacji na hostingu statycznym.

## Co zawiera

- responsywny landing page dla desktopu i mobile
- sekcje pokazujące tryby aplikacji: relacje, chemia i Karty Wariata
- galerię prawdziwych screenshotów z aplikacji
- lekkie animacje wejścia i prostą logikę galerii w czystym JavaScript
- gotową strukturę pod GitHub Pages

## Uruchomienie lokalne

Najprościej uruchomić lokalny serwer statyczny w katalogu `36-website`:

```powershell
python -m http.server 4173
```

Potem otwórz `http://localhost:4173`.

Można też otworzyć samo `index.html`, ale lokalny serwer lepiej odwzorowuje
docelowe zachowanie strony.

## Publikacja

Stronę możesz wdrożyć na dowolnym hostingu statycznym: GitHub Pages, Netlify,
Vercel albo własny serwer.

### GitHub Pages

W repo jest gotowy workflow: `.github/workflows/deploy-pages.yml`.

1. Wejdź w `Settings -> Pages`.
2. W `Source` wybierz `GitHub Actions`.
3. Każdy push na `main` automatycznie wdroży stronę.

## Podmiana screenshotów

Screenshoty i grafiki znajdują się w katalogu `graphics/`.

- sekcja hero używa `graphics/banner-google-app.png`
- sekcja galerii korzysta z plików `graphics/Screenshot_*.jpg`
- ikony trybów to pliki SVG z tego samego katalogu

Po podmianie obrazów wystarczy zaktualizować odpowiednie `src`, `alt` oraz,
jeśli trzeba, wymiary `width` i `height` w `index.html`.
