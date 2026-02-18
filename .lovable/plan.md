

# Plan : Confiance, confidentialite et conformite

## Audit de l'existant

**Ce qui existe deja :**
- Page Politique de confidentialite (`/legal/privacy`) -- contenu complet en 7 sections
- Page Conditions d'utilisation (`/legal/terms`) -- contenu complet en 8 sections
- Composant `HomeTrustBadge` sur la page d'accueil -- 3 badges minimalistes (Donnees protegees, Hebergement securise, 55 pays)
- Liens dans le footer : Confidentialite, CGU, Soutien
- Composant `ConsentManager` interne (dans le panneau analytics, pas visible publiquement)
- Hook `usePrivacyConsent` avec localStorage

**Ce qui manque :**
- Aucune banniere de consentement cookies visible pour les visiteurs
- Les pages legales n'ont pas de header/footer (navigation incoherente)
- Pas de section dediee "Securite et Protection des donnees" sur la page d'accueil
- Les badges de confiance actuels sont trop discrets (texte `white/50`, petite taille)
- Pas d'explication visible sur la collecte, le stockage et la protection des donnees
- Pas de mention des mesures de moderation

---

## Modifications prevues

### 1. Banniere de consentement cookies (visible a tous les visiteurs)

**Nouveau fichier : `src/components/privacy/CookieConsentBanner.tsx`**

Banniere fixe en bas de page, affichee au premier visit (si pas encore accepte dans localStorage) :
- Texte : "Ce site utilise des cookies pour ameliorer votre experience..."
- Lien vers la politique de confidentialite
- 2 boutons : "Accepter" (dore) et "Personnaliser" (outline, ouvre un dialogue de gestion)
- Stocke le choix dans localStorage (`cookie-consent-accepted`)
- S'integre avec le hook `usePrivacyConsent` existant

**Fichier : `src/App.tsx`**
- Ajouter `<CookieConsentBanner />` au niveau global (visible sur toutes les pages)

### 2. Section "Securite et Protection" sur la page d'accueil

**Nouveau fichier : `src/components/home/HomeTrustSection.tsx`**

Section dediee entre les fonctionnalites et le CTA, contenant :
- Titre : "Securite et Protection des donnees"
- 4 cartes visuelles :
  - Chiffrement TLS/SSL (icone Lock)
  - Controle d'acces RBAC (icone ShieldCheck)
  - Conformite RGPD/UA (icone FileCheck)
  - Moderation active (icone Eye)
- Chaque carte : icone, titre, description courte
- Lien vers la politique de confidentialite en bas de section

**Fichier : `src/pages/Index.tsx`**
- Ajouter `<HomeTrustSection />` apres `HomeFeaturesBlock`

### 3. Ameliorer le composant HomeTrustBadge existant

**Fichier : `src/components/home/HomeTrustBadge.tsx`**
- Agrandir les badges : passer de `h-4 w-4` a `h-5 w-5` et texte de `text-sm` a `text-base`
- Ameliorer le contraste : passer de `text-white/50` a `text-white/70`
- Ajouter 2 badges supplementaires : "Conforme RGPD" (icone CheckCircle) et "Moderation active" (icone Eye)

### 4. Ajouter navigation coherente aux pages legales

**Fichier : `src/pages/legal/PrivacyPolicy.tsx`**
- Ajouter `PublicHeader` et `Footer` pour une navigation coherente
- Ajouter une section supplementaire "8. Cookies et technologies" expliquant la collecte via cookies
- Ajouter une section "9. Moderation et securite" detaillant les mesures de moderation

**Fichier : `src/pages/legal/TermsOfUse.tsx`**
- Ajouter `PublicHeader` et `Footer`
- Ajouter une section "9. Securite des donnees" resumant les mesures techniques de protection

### 5. Cles i18n

**Fichiers : `fr.json`, `en.json`, `ar.json`, `pt.json`**

Nouvelles cles :
- `cookie.banner.text` : message de la banniere cookies
- `cookie.banner.accept` / `cookie.banner.customize`
- `trust.section.title` : "Securite et Protection des donnees"
- `trust.section.encryption` / `trust.section.rbac` / `trust.section.compliance` / `trust.section.moderation`

---

## Resume technique

| Fichier | Action |
|---|---|
| `src/components/privacy/CookieConsentBanner.tsx` | Creer -- banniere consentement cookies |
| `src/components/home/HomeTrustSection.tsx` | Creer -- section securite sur l'accueil |
| `src/components/home/HomeTrustBadge.tsx` | Ameliorer -- badges plus visibles + 2 nouveaux |
| `src/pages/Index.tsx` | Ajouter HomeTrustSection |
| `src/pages/legal/PrivacyPolicy.tsx` | Header/Footer + sections cookies et moderation |
| `src/pages/legal/TermsOfUse.tsx` | Header/Footer + section securite |
| `src/App.tsx` | Ajouter CookieConsentBanner global |
| `src/i18n/translations/fr.json` | Cles cookies + trust |
| `src/i18n/translations/en.json` | Traductions anglaises |
| `src/i18n/translations/ar.json` | Traductions arabes |
| `src/i18n/translations/pt.json` | Traductions portugaises |

Aucune migration de base de donnees requise.

