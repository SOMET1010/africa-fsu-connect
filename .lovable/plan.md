

# Plan : 3 corrections du Hero de la page d'accueil

## Correction 1 -- Slogan officiel et description

Remplacer le titre/description generiques du Hero par le contenu institutionnel demande.

**Fichier : `src/components/home/HomeHeroBlock.tsx`**
- Changer le titre principal (ligne 20) : remplacer le fallback `'Plateforme de cooperation'` par **"Ne laisser personne hors ligne"**
- Changer le highlight dore (ligne 21) : **"Service Universel"** (deja correct)
- Changer le suffix (ligne 22) : remplacer `'Africain'` par **"pour connecter les non-connectes"**
- Mettre a jour la description (ligne 23) avec : **"Renforcer le service universel pour une connectivite numerique inclusive. Fournir un service universel performant pour reduire la fracture numerique."**

**Fichiers i18n** (`fr.json`, `en.json`, `ar.json`, `pt.json`) :
- Mettre a jour les cles `home.hero.subtitle.prefix`, `home.hero.subtitle.highlight`, `home.hero.subtitle.suffix` et `home.hero.description` avec les traductions correspondantes

## Correction 2 -- Bouton "S'inscrire" dans le Hero + meilleur contraste CTA

**Fichier : `src/components/home/HomeHeroBlock.tsx`**
- Ajouter un 3e bouton **"S'inscrire"** (lien vers `/auth`) avec un style dore bien visible, en premier dans la rangee de CTA
- Renommer le bouton actuel "Espace membre" en **"Se connecter"** pour plus de clarte
- Ameliorer le contraste du bouton outline : passer de `border-white/30 text-white` a `border-white/50 text-white bg-white/10` pour une meilleure visibilite

Resultat : 3 CTA visibles dans le hero :
1. **S'inscrire** (bouton dore, principal)
2. **Explorer le reseau** (bouton outline clair)
3. **Se connecter** (bouton outline)

## Correction 3 -- Ameliorer le texte `white/70` pour le contraste

**Fichier : `src/components/home/HomeHeroBlock.tsx`**
- Ligne 61 : passer la description de `text-white/70` a `text-white/85` pour atteindre le ratio WCAG AA de 4.5:1

**Fichier : `src/components/home/HomePartnersBlock.tsx`**
- Ligne 22 : passer le titre de `text-white/40` a `text-white/60`
- Ligne 27 : passer les noms de partenaires de `text-white/30` a `text-white/50` et le border de `border-white/10` a `border-white/20`

---

## Resume technique

| Fichier | Modifications |
|---|---|
| `src/components/home/HomeHeroBlock.tsx` | Slogan officiel, 3 CTA (S'inscrire/Explorer/Se connecter), contraste description |
| `src/components/home/HomePartnersBlock.tsx` | Contraste texte partenaires |
| `src/i18n/translations/fr.json` | Nouvelles cles hero |
| `src/i18n/translations/en.json` | Traductions anglaises |
| `src/i18n/translations/ar.json` | Traductions arabes |
| `src/i18n/translations/pt.json` | Traductions portugaises |

Aucune migration de base de donnees necessaire -- les contenus CMS utiliseront les memes cles JSONB existantes.

