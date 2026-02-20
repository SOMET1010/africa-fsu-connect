
# Mise a jour de la page d'accueil UDC

## 1. Renommer la plateforme "USF Digital Connect Africa"

**Fichiers concernes :**
- `index.html` : Modifier le `<title>` en "USF Digital Connect Africa"
- `src/components/layout/PublicHeader.tsx` : Modifier le texte du logo ("UDC" reste, mais le sous-titre passe a "Digital Connect Africa")
- `src/components/home/HomeHeroBlock.tsx` : Mettre a jour le badge par defaut ("USF Digital Connect Africa")
- `src/components/layout/Footer.tsx` : Mettre a jour le texte "UDC" dans le logo footer
- `src/types/platformConfig.ts` : Mettre a jour `DEFAULT_PLATFORM_CONFIG.identity.platformName`

## 2. Modifier le lien www.atuuat.africa

Remplacer toutes les references a `atu-uat.org` et `platform.atu-uat.org` par `www.atuuat.africa` dans :

- `src/components/layout/Footer.tsx` (lignes 89, 148, 151, 171, 176) : liens partenaires, email et site web
- `src/pages/Contact.tsx` : email et site officiel
- `src/pages/About.tsx` : email et lien plateforme
- `src/pages/legal/TermsOfUse.tsx` : email de contact
- `src/pages/legal/PrivacyPolicy.tsx` : email de contact
- `src/types/platformConfig.ts` : website du partenaire UAT

Les emails `secretariat@atu-uat.org` seront mis a jour en `secretariat@atuuat.africa`.

## 3. Eclaircir la page d'accueil (moins sombre)

La page utilise un fond `nx-night` tres sombre avec une image d'opacite 0.30 et un gradient lourd. Modifications :

- `src/pages/Index.tsx` : Augmenter l'opacite de l'image de fond de 0.30 a 0.45, allegir le gradient overlay (reduire les valeurs /60 et /80)
- Augmenter legerement la luminosite des textes secondaires (passer de `text-white/70` a `text-white/80` dans les sections cles)

## 4. Retirer Banque Mondiale et Union Europeenne, ajouter GSMA

Les partenaires sont stockes en base de donnees dans la table `homepage_content_blocks` (block_key = 'partners'). Il faut mettre a jour les 4 langues :

**Mise a jour SQL** pour remplacer les items dans les 4 colonnes de contenu :
- FR : Retirer "Banque Mondiale" et "Union Europeenne", ajouter "GSMA"
- EN : Retirer "World Bank" et "European Union", ajouter "GSMA"
- PT : Retirer "Banco Mundial" et "Uniao Europeia", ajouter "GSMA"
- AR : Retirer "البنك الدولي" et "الاتحاد الأوروبي", ajouter "GSMA"

## 5. Carte complete de l'Afrique

La carte de la page d'accueil (`HomeMemberMap.tsx`) est limitee par `maxBounds` a `[-40, -25] / [40, 55]` ce qui coupe certaines parties. Modifications :

- `src/components/home/HomeMemberMap.tsx` : Elargir les `maxBounds` a `[-38, -30] / [42, 60]` pour inclure tout le continent (Madagascar, Cap-Vert, iles)
- Ajuster le `center` a `[5, 20]` et le `zoom` a `3.2` pour un meilleur cadrage initial montrant l'Afrique entiere

---

## Details techniques

| Fichier | Type de modification |
|---------|---------------------|
| `index.html` | Titre de la page |
| `src/pages/Index.tsx` | Opacite image, gradient |
| `src/components/layout/PublicHeader.tsx` | Nom plateforme |
| `src/components/layout/Footer.tsx` | Nom, liens, email |
| `src/components/home/HomeHeroBlock.tsx` | Badge par defaut |
| `src/components/home/HomeMemberMap.tsx` | Bounds et zoom carte |
| `src/pages/Contact.tsx` | Liens et emails |
| `src/pages/About.tsx` | Liens et emails |
| `src/pages/legal/TermsOfUse.tsx` | Email |
| `src/pages/legal/PrivacyPolicy.tsx` | Email |
| `src/types/platformConfig.ts` | Config par defaut |
| Base de donnees | UPDATE homepage_content_blocks (partenaires) |
