# Vero Studio — strona WWW

Statyczna strona internetowa (HTML/CSS/JS, bez frameworków i procesu budowania) dla **Vero Studio by Wioletta Pazdańska** — studia premium projektującego strony WWW, sklepy eCommerce oraz automatyzacje, chatboty i agentów AI.

Kolorystyka i typografia nawiązują bezpośrednio do przesłanego logo: głęboka czerń, szampańskie złoto i ecru, z akcentem szmaragdu w wybranych przyciskach CTA.

## Struktura plików

```
index.html          — Strona główna (PL)
o-nas.html          — O nas / O mnie (bio Wioletty Pazdańskiej)
uslugi.html         — Usługi — 4 filary: Strony WWW, eCommerce, Automatyzacje AI, Chatboty i Agenci AI
portfolio.html      — Portfolio / case studies (placeholdery)
cennik.html         — Cennik — pakiety Starter / Business / Premium + FAQ
blog.html           — Blog (placeholdery artykułów)
demo.html           — Żywe demo: symulacja chatbota + przepływ pracy agenta AI
kontakt.html        — Kontakt (dane + formularz + Calendly)
style.css           — Cały styl strony (kolory, layout, animacje, responsywność)
script.js           — Menu mobilne, animacje scroll-reveal, canvas z węzłami AI w hero,
                       logika demo chatbota i agenta, akordeon FAQ, formularz kontaktowy
logo.svg            — Logo Vero Studio (plik dostarczony przez klienta)
assets/             — Branded placeholdery SVG (zdjęcie założycielki, case studies, blog)
en/                 — Pełne lustro strony w języku angielskim (te same nazwy plików)
robots.txt          — Konfiguracja dla robotów wyszukiwarek
sitemap.xml         — Mapa strony z odnośnikami hreflang PL/EN
```

## WAŻNE — rzeczy do podmiany przed publikacją

To jest w pełni działający, ale **demonstracyjny** szkielet strony. Poniższe elementy są przykładowe i wymagają podmiany:

1. **Logo** — ✅ gotowe. Używany jest plik `logo.svg` we wszystkich podstronach (PL i EN) oraz jako favicon. Uwaga: dostarczony plik SVG zawiera osadzony obrazek rastrowy (nie jest to logo w czystej wektorowej formie ze ścieżkami), więc jakość wizualna jest identyczna jak w oryginalnym PNG — plik jest po prostu w formacie SVG.
2. **Dane kontaktowe** — e-mail (`hello@verostudio.pl`), telefon (`+48 000 000 000`) i miasto to placeholdery. Podmień w stopce oraz na `kontakt.html` / `en/kontakt.html`.
3. **Formularz kontaktowy** — działa tylko demonstracyjnie (JS pokazuje komunikat sukcesu, nic nie wysyła). Aby realnie wysyłał e-maile, załóż darmowe konto na [Formspree](https://formspree.io) lub [EmailJS](https://www.emailjs.com) i podmień atrybut `action="https://formspree.io/f/TWOJ_KOD_FORMSPREE"` w `kontakt.html` i `en/kontakt.html`.
4. **Kalendarz konsultacji** — link `https://calendly.com/vero-studio/konsultacja` jest przykładowy. Załóż konto na [Calendly](https://calendly.com) (lub innym narzędziu) i podmień link w `kontakt.html` / `en/kontakt.html`.
5. **Social media** — linki `#` w sekcji social w stopce i na `kontakt.html` — podmień na prawdziwe profile Instagram / LinkedIn / Facebook.
6. **Zdjęcie założycielki** — ✅ gotowe. Prawdziwe zdjęcie Wioletty Pazdańskiej (`logowp.svg`) jest już użyte na stronie "O nas". Grafika logo w sekcji "Poznaj Vero Studio" na stronie głównej to `logoph.svg`.
7. **Case studies / portfolio** — `assets/portfolio-0X.svg` i opisy "Nazwa projektu 0X" na `portfolio.html` to placeholdery — podmień na prawdziwe realizacje, najlepiej z linkami do rzeczywistych projektów.
8. **Opinie klientów** — przykładowe cytaty i inicjały na `index.html` i `portfolio.html` (sekcje `.testimonial-card`) — podmień na prawdziwe rekomendacje.
9. **Wpisy blogowe** — `assets/blog-0X.svg` i treści na `blog.html` to placeholdery — podmień na prawdziwe artykuły.
10. **Statystyki w hero i stat-strip** (np. „40+ zrealizowanych projektów") — oznaczone gwiazdką jako przykładowe — zaktualizuj po zebraniu realnych danych.
11. **Ceny w `cennik.html`** — orientacyjne kwoty (PLN w wersji PL, EUR w wersji EN) — dopasuj do własnej wyceny.
12. **Domena** — wszystkie meta tagi `canonical` i `og:image`/`hreflang` wskazują na `https://verostudio.pl/` — po wykupieniu docelowej domeny podmień w każdym pliku `.html` (najszybciej przez znajdź-i-zamień).

## Demo AI (`demo.html`)

Strona zawiera w pełni interaktywne demo:
- **Chatbot** — odtwarza zapisany scenariusz rozmowy (zdefiniowany w `window.__VERO_CHAT_SCRIPT__` na dole `demo.html`), a użytkownik może też wpisać własną wiadomość (dostaje uprzejmą odpowiedź demonstracyjną).
- **Agent AI** — animowany, cyklicznie odświeżający się panel pokazujący 5 kroków przykładowego przepływu pracy agenta.

To wyłącznie prezentacja poglądowa — nie łączy się z żadnym prawdziwym modelem AI ani API. Realne wdrożenie chatbota/agenta wymaga osobnej integracji (np. z Claude API, n8n, Make itp.) — do ustalenia w osobnym projekcie.

## Asystent czatu na żywo (widget na wszystkich podstronach)

W prawym dolnym rogu każdej podstrony (PL i EN) znajduje się **realnie działający, oparty na regułach asystent czatu** (logika w `script.js`, sekcja „Site-wide chat widget"). Prowadzi odwiedzającego od pytania o rodzaj usługi, przez zebranie imienia i adresu e-mail, aż po:
- przycisk **„Umów bezpłatną konsultację"** prowadzący wprost do linku Calendly,
- przycisk **„Napisz e-mail"** — otwiera domyślny program pocztowy z gotowym, wypełnionym e-mailem (imię, adres e-mail, wybrane zainteresowanie) do `hello@verostudio.pl`.

To **nie jest** chatbot oparty o prawdziwe AI/LLM — to logika typu drzewko decyzyjne (bez kosztów, bez klucza API, działa od razu na GitHub Pages). Żeby podłączyć prawdziwy model AI (np. Claude), docelowo potrzebna będzie osobna funkcja backendowa (np. Cloudflare Worker / Vercel Function), która bezpiecznie przechowa klucz API — obecna strona jest w pełni statyczna i nie może go bezpiecznie trzymać po stronie przeglądarki. To osobny, przyszły etap prac.

## Wersja angielska (`en/`)

Folder `en/` zawiera pełne lustro wszystkich podstron w języku angielskim, z tymi samymi nazwami plików (np. `en/uslugi.html`). Przełącznik języka w nagłówku (`PL / EN`) linkuje między odpowiadającymi sobie stronami. Linki `hreflang` w `<head>` oraz w `sitemap.xml` informują wyszukiwarki o obu wersjach językowych.

## Publikacja (GitHub Pages) — od zera

1. Wejdź w **Settings** repozytorium na GitHubie → **Pages**.
2. Jako źródło ("Source") wybierz **Deploy from a branch**, branch **main**, folder **/ (root)** → **Save**.
3. Po 1–2 minutach strona będzie dostępna pod adresem `https://<twoja-nazwa-uzytkownika>.github.io/VERO-STUDIO/`.
4. Docelowo można podpiąć własną domenę (np. `verostudio.pl`) w tych samych ustawieniach Pages — po podłączeniu domeny zaktualizuj adresy `canonical` w plikach `.html` oraz w `sitemap.xml` i `robots.txt`.

## Uwaga o SEO

Wszystkie podstrony mają unikalne tytuły, opisy meta oraz tagi Open Graph zoptymalizowane pod frazy: strony internetowe, projektowanie stron, eCommerce, sklepy internetowe, automatyzacje AI, chatboty AI, agenci AI. Po podpięciu domeny warto też dodać stronę do Google Search Console i przesłać `sitemap.xml`.
