

# Plan de correction -- Audit approfondi Africa FSU Connect

## Resume des problemes identifies et corrections proposees

L'audit a revele plusieurs problemes concrets que nous pouvons corriger. Voici le plan d'action organise par priorite.

---

## 1. Incoherence de branding dans le CMS (CRITIQUE)

**Probleme** : Le badge hero dans la base de donnees CMS affiche "UAT Digital Connect Africa (ADCA)" en francais, tandis que les autres langues affichent "SUTEL Network". Le nom officiel est "USF Digital Connect Africa".

**Correction** : Mettre a jour la table `homepage_content_blocks` pour le bloc `hero` :
- FR : `badge` = "USF Digital Connect Africa"
- EN : `badge` = "USF Digital Connect Africa"
- PT : `badge` = "USF Digital Connect Africa"
- AR : `badge` = "USF Digital Connect Africa"

Le nom de marque ne se traduit pas.

| Fichier/Ressource | Action |
|---|---|
| Migration SQL | UPDATE `homepage_content_blocks` pour corriger les 4 badges linguistiques |

---

## 2. Statistiques incoherentes : "54 Pays" vs "55 pays membres"

**Probleme** : Le badge de confiance dit "55 pays membres" mais la carte des features dit "54 Pays Membres". L'Union Africaine compte 55 Etats membres.

**Correction** : Mettre a jour le fallback du bloc features pour afficher "55" au lieu de "54".

| Fichier | Action |
|---|---|
| `src/components/home/HomeFeaturesBlock.tsx` | Changer "54 Pays Membres" en "55 Pays Membres" dans `FALLBACK_FEATURES` |

---

## 3. Hero : texte du 3eme bouton invisible

**Probleme** : Le bouton "Se connecter" dans le hero a un style `border-white/30 text-white` mais apparait presque invisible sur le screenshot (texte tres pale).

**Correction** : Augmenter l'opacite du texte et de la bordure du 3eme bouton CTA.

| Fichier | Action |
|---|---|
| `src/components/home/HomeHeroBlock.tsx` | Changer `border-white/30 text-white` en `border-white/50 text-white bg-white/10` (comme le 2eme bouton) |

---

## 4. Navigation "Projets partagés" -- lien trompeur

**Probleme** : Le menu affiche "Projets partagés" mais le lien pointe vers `/projects` qui est une route protegee. Un visiteur non connecte sera redirige vers la page d'authentification.

**Correction** : Renommer "Projets partagés" en "Projets" pour correspondre au contenu.

| Fichier | Action |
|---|---|
| `src/components/layout/PublicHeader.tsx` | Changer le label de "Projets" en "Projets partagés" dans `NAV_ITEMS` (deja correct, le fallback affiche "Projets") -- en realite, verifier la cle i18n `nav.projects` |

---

## 5. Nom de la plateforme dans le CTA

**Probleme** : Le bloc CTA affiche "Rejoignez le reseau SUTEL" alors que le nom officiel est "USF Digital Connect Africa" ou "UDC".

**Correction** : Mettre a jour le contenu CMS du bloc `cta` pour remplacer "SUTEL" par "UDC".

| Fichier/Ressource | Action |
|---|---|
| Migration SQL | UPDATE `homepage_content_blocks` pour le bloc `cta` : titre = "Rejoignez le reseau UDC" |

---

## 6. Accessibilite : attribut `lang` du HTML

**Probleme** : Le fichier `index.html` a `lang="en"` alors que la langue par defaut est le francais.

**Correction** : Changer `lang="en"` en `lang="fr"` puisque le contenu par defaut est en francais.

| Fichier | Action |
|---|---|
| `index.html` | Changer `lang="en"` en `lang="fr"` |

---

## 7. Titre de la page dans l'onglet du navigateur

**Probleme** : Le titre HTML est "USF Digital Connect Africa" -- c'est correct mais il manque le "| Plateforme panafricaine" pour le SEO.

**Correction** : Pas de modification necessaire, le titre actuel est acceptable.

---

## 8. Points non corrigeables dans ce cycle

Les elements suivants sont notes mais ne font pas partie de ce plan :

- **Badge Lovable visible** : Se desactive dans les parametres du projet Lovable (Settings > Hide Lovable Badge)
- **Fonctionnalites non accessibles** : Les modules (E-Learning, Forum, Carte interactive, etc.) existent dans le code mais sont derriere l'authentification -- c'est voulu
- **Zoom carte limité** : La carte de la page d'accueil est volontairement simplifiee ; la carte complete est accessible via "/network"

---

## Resume des fichiers modifies

| Fichier | Modification |
|---|---|
| Migration SQL | Corriger branding badge hero (4 langues) + titre CTA |
| `src/components/home/HomeFeaturesBlock.tsx` | 54 -> 55 pays |
| `src/components/home/HomeHeroBlock.tsx` | Opacite 3eme bouton CTA |
| `index.html` | `lang="en"` -> `lang="fr"` |

Total : 3 fichiers + 1 migration SQL.

