

# Page QA Checklist i18n -- Verification des traductions

## Objectif
Creer une page admin dediee a la verification interactive des traductions (FR/EN/AR/PT) et du support RTL. Contrairement a la page d'export existante (`TranslationsExport`), cette page permet de **tester visuellement** chaque section de l'application dans les 4 langues.

## Ce qui sera cree

### 1. Page `src/pages/admin/I18nQAChecklist.tsx`

Une page avec 4 sections principales :

- **Tableau de bord global** : pourcentages de couverture par langue (reutilise `getTranslationStats` de `export-translations.ts`), avec indicateurs vert/orange/rouge
- **Test visuel par section** : pour chaque section (Navigation, Dashboard, Reseau, Forum...), affiche un panneau avec les traductions FR/EN/PT/AR cote a cote. Les cles manquantes sont surlignees en rouge
- **Checklist RTL** : liste de verifications manuelles pour l'arabe (direction du texte, alignement des icones, navigation inversee) avec des cases a cocher persistees en localStorage
- **Apercu live** : un composant qui affiche un texte d'exemple dans la langue selectionnee, avec un bouton pour basculer entre les 4 langues en temps reel

### 2. Composant `src/components/admin/i18n/QALanguagePreview.tsx`

Un composant qui rend un bloc de texte echantillon (titres de navigation, labels de boutons, messages d'erreur) dans une langue choisie, avec detection automatique des cles vides.

### 3. Composant `src/components/admin/i18n/RTLChecklist.tsx`

Une checklist interactive avec ~10 points de verification RTL :
- Direction du texte arabe
- Alignement des icones
- Navigation laterale inversee
- Formulaires et inputs
- Tableaux et listes
- Boutons et dropdowns

Chaque point peut etre coche (OK / Probleme / Non teste). L'etat est sauvegarde en localStorage.

### 4. Route dans `src/config/routes.ts`

Ajout de la route `/admin/i18n-qa` en tant que route admin protegee (`super_admin`, `admin_pays`), masquee de la navigation principale.

## Details techniques

- Reutilise `buildTranslationData` et `getTranslationStats` depuis `src/utils/export-translations.ts`
- Utilise les composants UI existants : `Card`, `Tabs`, `Badge`, `Progress`, `Checkbox`, `Table`
- Utilise `useLanguage` pour le basculement de langue en temps reel
- Utilise `useDirection` pour les tests RTL
- Pas de dependance backend -- tout est cote client avec les fichiers JSON existants
- Checklist RTL persistee via `localStorage` sous la cle `i18n-qa-rtl-checklist`

