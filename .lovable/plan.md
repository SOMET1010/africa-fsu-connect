

# Renommer en "USF Digital Connect Africa" dans les fichiers i18n

## Probleme

Le titre de la page (`index.html`) et le fallback du badge hero sont corrects ("USF Digital Connect Africa"), mais les **4 fichiers de traduction** (FR, EN, PT, AR) affichent encore l'ancien nom "USF Universal Digital Connect (UDC)" dans le badge hero et les noms de plateforme du footer.

## Modifications

### 4 fichiers de traduction JSON

| Cle | Valeur actuelle | Nouvelle valeur |
|-----|-----------------|-----------------|
| `home.hero.badge` (FR) | "USF Universal Digital Connect (UDC)" | "USF Digital Connect Africa" |
| `home.hero.badge` (EN) | "USF Universal Digital Connect (UDC)" | "USF Digital Connect Africa" |
| `home.hero.badge` (PT) | "USF Universal Digital Connect (UDC)" | "USF Digital Connect Africa" |
| `home.hero.badge` (AR) | "USF Universal Digital Connect (UDC)" | "USF Digital Connect Africa" |
| `footer.platform.name` (FR) | "Plateforme UDC" | "USF Digital Connect Africa" |
| `footer.platform.name` (EN) | "UDC Platform" | "USF Digital Connect Africa" |
| `footer.platform.name` (PT) | "Plataforma UDC" | "USF Digital Connect Africa" |
| `footer.platform.name` (AR) | "منصة UDC" | "USF Digital Connect Africa" |

### Fichiers concernes

- `src/i18n/translations/fr.json` (lignes 714, 728)
- `src/i18n/translations/en.json` (lignes 727, 741)
- `src/i18n/translations/pt.json` (lignes 720, 734)
- `src/i18n/translations/ar.json` (lignes 720, 734)

### Elements deja corrects (aucune modification)

- `index.html` : titre deja "USF Digital Connect Africa"
- `HomeHeroBlock.tsx` : fallback deja "USF Digital Connect Africa"
- `PublicHeader.tsx` : sous-titre deja "Digital Connect Africa"

