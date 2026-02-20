

# Plan : Renommer la plateforme en "USF Universal Digital Connect"

## Changement demande

Remplacer toutes les occurrences du nom actuel **"ADCA"** / **"UAT Digital Connect Africa"** par le nouveau nom definitif **"USF Universal Digital Connect"**.

L'acronyme devient **UDC** (au lieu de ADCA).

## Fichiers a modifier

### 1. Composant Logo central
**`src/components/shared/NexusLogo.tsx`**
- Ligne 128 : `ADCA` -> `UDC`
- Ligne 132 : `UAT • Digital Connect Africa` -> `USF • Universal Digital Connect`
- Ligne 148 : `ADCA` -> `UDC`
- Ligne 152 : `UAT • Digital Connect Africa` -> `USF • Universal Digital Connect`

### 2. Page d'authentification
**`src/pages/auth/components/AuthHeader.tsx`**
- Ligne 23 : `ADCA` -> `UDC`
- Ligne 26 : `Connecter l'ecosysteme numerique de l'Afrique` (garde le slogan)
- Ligne 29 : `UAT • ANSUT • Digital Connect Africa` -> `UAT • ANSUT • Universal Digital Connect`

### 3. Traductions francaises
**`src/i18n/translations/fr.json`** (environ 25 remplacements)
- `"Réseau ADCA"` -> `"Réseau UDC"`
- `"Plateforme ADCA"` -> `"Plateforme UDC"`
- `"UAT Digital Connect Africa (ADCA)"` -> `"USF Universal Digital Connect (UDC)"`
- `"ADCA Platform"` -> `"UDC Platform"`
- `"Projets FSU/ADCA"` -> `"Projets FSU/UDC"`
- `"Bienvenue dans ADCA"` -> `"Bienvenue dans UDC"`
- `"réseau ADCA"` -> `"réseau UDC"`
- `"Carte du Réseau ADCA"` -> `"Carte du Réseau UDC"`
- `"footer.copyright"` : `"Plateforme ADCA"` -> `"Plateforme UDC"`
- Toutes les autres mentions

### 4. Traductions anglaises
**`src/i18n/translations/en.json`**
- `"UAT Digital Connect Africa (ADCA)"` -> `"USF Universal Digital Connect (UDC)"`

### 5. Traductions arabes
**`src/i18n/translations/ar.json`**
- `"UAT Digital Connect Africa (ADCA)"` -> `"USF Universal Digital Connect (UDC)"`

### 6. Traductions portugaises
**`src/i18n/translations/pt.json`**
- `"UAT Digital Connect Africa (ADCA)"` -> `"USF Universal Digital Connect (UDC)"`

### 7. Page HTML
**`index.html`**
- Titre : `FSU - Plateforme de Collaboration` -> `USF Universal Digital Connect`

### 8. Mentions dans les pages
**`src/pages/legal/PrivacyPolicy.tsx`**
- `"ADCA (UAT Digital Connect Africa)"` -> `"UDC (USF Universal Digital Connect)"`
- `"réseau ADCA"` -> `"réseau UDC"`
- `"plateforme ADCA"` -> `"plateforme UDC"`

**`src/pages/Roadmap.tsx`**
- `"l'aventure ADCA"` -> `"l'aventure UDC"`

**`src/pages/Auth.tsx`**
- `"compte NEXUS"` -> `"compte UDC"`
- `"communauté NEXUS"` -> `"communauté UDC"`

### 9. Composants Dashboard
**`src/components/dashboard/components/DashboardHero.tsx`**
- `"Réseau NEXUS"` (x2) -> `"USF Universal Digital Connect"`

**`src/components/dashboard/components/NetworkHero.tsx`**
- `"Réseau NEXUS"` -> `"USF Universal Digital Connect"`

### 10. Composant Chatbot
**`src/components/assistant/SutaChatbot.tsx`**
- `"plateforme SUTEL"` -> `"plateforme UDC"`
- `"Aide SUTEL"` -> `"Aide UDC"`

### 11. Landing page
**`src/components/landing/PremiumHeroSection.tsx`**
- `"Réseau NEXUS"` n'est pas en dur (utilise `t()`) - deja couvert par les traductions

### 12. Sidebar / Navigation
**`src/components/layout/SimplifiedSidebar.tsx`**
- `"NEXUS"` (fallback organisation) -> `"UDC"`

**`src/components/layout/AppSidebar.tsx`**
- Pas de texte en dur, utilise NexusLogo - deja couvert

### 13. Page presentation
**`src/i18n/locales/fr/presentation.json`**
- `"NEXUS Platform"` -> `"USF Universal Digital Connect"`
- `"NEXUS"` -> `"UDC"` (dans les descriptions)

**`src/i18n/locales/en/presentation.json`**
- Idem

### 14. Home CTA
**`src/components/home/HomeCtaBlock.tsx`**
- `"Rejoignez ADCA"` -> `"Rejoignez UDC"`

## Ce qui ne change PAS

- Les noms de fichiers et composants (`NexusLogo`, `NexusIcon`, etc.) restent inchanges pour eviter des refactors massifs sans valeur ajoutee
- Les variables CSS (`--nx-*`) restent inchanges
- Le SVG du logo reste identique visuellement
- Les commentaires techniques (`NEXUS_LAYER1_GUARD`, `blueprintGuards`) restent inchanges

## Resume

| Categorie | Nombre de fichiers |
|-----------|-------------------|
| Composants UI | 8 |
| Traductions JSON | 6 |
| Pages | 3 |
| HTML | 1 |
| **Total** | **~18 fichiers** |

Toutes les mentions visibles par l'utilisateur de "ADCA", "Digital Connect Africa", "NEXUS" et "SUTEL" (dans les textes affichables) seront remplacees par **"USF Universal Digital Connect"** (nom complet) ou **"UDC"** (acronyme).
