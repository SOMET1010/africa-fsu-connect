

# Plan : Accessibilite multilingue, performances, lisibilite, inscription et image de marque

## Audit de l'existant

### 4. Accessibilite multilingue
- Le selecteur de langue existe dans le `PublicHeader` mais est minimal : une icone Globe sans label visible
- 4 langues sont deja configurees (FR, EN, AR, PT)
- Les traductions i18n sont en place pour la plupart des contenus

**Action requise** : Rendre le selecteur de langue plus visible avec le drapeau et le code langue affiches

### 5. Performances techniques
- La page d'accueil utilise 7 composants avec `framer-motion` (animations `whileInView`, `initial`, `animate`)
- L'image de fond `nexus-hero-africa.png` est chargee en plein ecran avec `object-cover`
- Plusieurs effets `backdrop-blur-xl` et `backdrop-blur-sm` (couteux en GPU)
- Chaque bloc de la page d'accueil est un composant anime separement

**Actions requises** :
- Reduire les animations framer-motion (remplacer `whileInView` par des animations CSS simples)
- Ajouter `will-change: transform` sur les elements animes pour optimiser le GPU
- Utiliser `content-visibility: auto` sur les sections hors ecran
- Reduire les `backdrop-blur` ou les limiter aux elements fixes

### 6. Accessibilite visuelle et lisibilite
Textes a faible contraste identifies :
- `HomeTrustSection` : descriptions en `text-xs text-white/50` (ratio ~2.5:1, minimum WCAG AA = 4.5:1)
- `HomeTrustBadge` : texte en `text-white/70` (ratio ~5:1, acceptable mais limite)
- `HomeFeaturesBlock` : descriptions en `text-white/60` (ratio ~4:1, sous le seuil)
- `HomePartnersBlock` : partenaires en `text-white/50`
- `HomeMessagesBlock` : citations en `text-white/70 text-sm italic`
- `HomeCtaBlock` : sous-titre en `text-white/60`

**Action requise** : Augmenter tous les niveaux d'opacite pour atteindre au minimum `text-white/80` sur les textes principaux et `text-white/70` sur les textes secondaires

### 7. Ameliorations de l'inscription
- Les champs Prenom, Nom, Pays, Organisation existent deja dans `SignupForm.tsx`
- La soumission passe deja ces donnees a `signUp()` dans `useAuthPage.ts`
- Aucune page de confirmation post-inscription n'existe : un simple `toast.success` est affiche

**Action requise** : Creer une page/ecran de confirmation affichant les informations de l'utilisateur (nom, pays, organisation) apres inscription reussie

### 8. Identite institutionnelle et image de marque
- Le logo ATU existe (`atu-logo.png`, `h-10` = ~40px) mais est petit
- Le bloc Messages affiche : "Secretaire General de l'UAT" et "President du Comite SUTEL"
- Le "Directeur General de l'ANSUT" n'est pas present (demande dans les specifications)

**Action requise** : Agrandir le logo, remplacer le deuxieme message par celui du DG de l'ANSUT

---

## Modifications prevues

### 1. Selecteur de langue visible (`PublicHeader.tsx`)
- Passer `showLabel={true}` sur le composant `LanguageSelector` dans le header
- Augmenter la taille du bouton pour afficher le drapeau et le code langue (ex: "FR", "EN")

### 2. Optimisation des performances (`Index.tsx` + composants home)

**`src/pages/Index.tsx`** :
- Ajouter `loading="lazy"` sur l'image de fond (deja present) -- confirme
- Envelopper les sections en-dessous du fold dans `React.lazy` + `Suspense` pour du code-splitting

**`src/components/home/HomeFeaturesBlock.tsx`** :
- Remplacer `motion.div` par un `div` avec une classe CSS `animate-fade-in` basee sur IntersectionObserver ou une animation CSS simple
- Supprimer le `delay: 0.5` qui bloque le rendu visuel

**`src/components/home/HomeTrustSection.tsx`** :
- Reduire les 4 animations individuelles `whileInView` a une seule animation sur le conteneur parent
- Supprimer les delays cascades (0.1, 0.2, 0.3)

**`src/components/home/HomeMessagesBlock.tsx`** :
- Remplacer `whileInView` par une animation CSS simple

**`src/components/home/HomeCtaBlock.tsx`** et **`HomePartnersBlock.tsx`** :
- Meme traitement : simplifier les animations

**Nouveau fichier CSS** `src/styles/animations.css` :
- Definir des keyframes CSS `fade-in-up` reutilisables
- Utiliser `@media (prefers-reduced-motion: reduce)` pour desactiver les animations

### 3. Amelioration du contraste (`tous les composants home`)

| Fichier | Avant | Apres |
|---|---|---|
| `HomeTrustSection.tsx` | `text-white/50` | `text-white/80` |
| `HomeTrustSection.tsx` | `text-white/60` subtitle | `text-white/80` |
| `HomeFeaturesBlock.tsx` | `text-white/60` | `text-white/80` |
| `HomePartnersBlock.tsx` | `text-white/50` | `text-white/75` |
| `HomeMessagesBlock.tsx` | `text-white/70` | `text-white/85` |
| `HomeCtaBlock.tsx` | `text-white/60` | `text-white/80` |
| `HomeHeroBlock.tsx` | `text-white/85` | `text-white/90` (deja bon) |
| `HomeTrustBadge.tsx` | OK (`text-white/70`) | Conserver |

### 4. Page de confirmation d'inscription

**Nouveau fichier : `src/pages/auth/components/SignupConfirmation.tsx`**
- Affiche un ecran de succes apres inscription avec :
  - Icone de validation (CheckCircle)
  - Nom complet de l'utilisateur
  - Pays (nom complet, pas le code)
  - Organisation
  - Message invitant a verifier son email
- Style coherent avec la page d'authentification

**Modification : `src/pages/auth/hooks/useAuthPage.ts`**
- Ajouter un etat `signupSuccess: boolean` et `signupData: { firstName, lastName, country, organization }`
- Apres inscription reussie, stocker les donnees et passer a l'ecran de confirmation

**Modification : `src/pages/Auth.tsx`**
- Afficher `SignupConfirmation` quand `signupSuccess === true` au lieu du formulaire

### 5. Image de marque et messages officiels

**`src/components/layout/PublicHeader.tsx`** :
- Augmenter la taille du logo de `h-10` a `h-12`
- Ajouter le nom complet "UAT" a cote du logo sur les ecrans larges

**`src/components/home/HomeHeroBlock.tsx`** :
- Ajouter un sous-titre avec la marque UAT sous le badge

**`src/components/home/HomeMessagesBlock.tsx`** :
- Remplacer le deuxieme message ("President du Comite SUTEL") par le message du "Directeur General de l'ANSUT"
- Mettre a jour le texte pour refleter le role de l'ANSUT dans le deploiement du service universel

---

## Resume technique

| Fichier | Action |
|---|---|
| `src/components/layout/PublicHeader.tsx` | Selecteur langue visible + logo agrandi |
| `src/pages/Index.tsx` | Code-splitting des sections sous le fold |
| `src/components/home/HomeFeaturesBlock.tsx` | Animations simplifiees + contraste |
| `src/components/home/HomeTrustSection.tsx` | Animations simplifiees + contraste |
| `src/components/home/HomeTrustBadge.tsx` | Contraste OK, conserve |
| `src/components/home/HomeMessagesBlock.tsx` | Animations + contraste + message DG ANSUT |
| `src/components/home/HomeCtaBlock.tsx` | Animations + contraste |
| `src/components/home/HomePartnersBlock.tsx` | Animations + contraste |
| `src/components/home/HomeHeroBlock.tsx` | Branding UAT renforce |
| `src/styles/animations.css` | Creer -- keyframes CSS reutilisables |
| `src/pages/auth/components/SignupConfirmation.tsx` | Creer -- ecran confirmation inscription |
| `src/pages/auth/hooks/useAuthPage.ts` | Etat signupSuccess + signupData |
| `src/pages/Auth.tsx` | Afficher SignupConfirmation conditionnellement |
| `src/i18n/translations/fr.json` | Cles confirmation + messages |
| `src/i18n/translations/en.json` | Traductions anglaises |
| `src/i18n/translations/ar.json` | Traductions arabes |
| `src/i18n/translations/pt.json` | Traductions portugaises |

Aucune migration de base de donnees requise.

