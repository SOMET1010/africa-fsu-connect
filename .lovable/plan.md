

# Plan : Navigation et structure du site web

## Audit de l'existant

### Header public (PublicHeader.tsx)
La navigation actuelle contient : Accueil, A propos, Fonctionnalites, Projets partages, Evenements, Vue Reseau, Connexion, S'inscrire

**Ecarts identifies :**
- "Strategies Et Politiques" : absent -- aucune page n'existe
- "Contact" : absent de la nav -- aucune page dediee n'existe (le contenu contact est dans la page A propos)
- "Vue Reseau" et "Tableau de bord" : ne correspondent pas a la structure demandee

### Footer (Footer.tsx)
Le footer existe et contient 4 colonnes (Plateforme, Modules, Partenaires, Contact) + liens legaux (A propos, Feuille de Route, Confidentialite, CGU).

**Ecarts identifies :**
- "Soutien" (Support) : absent des liens du bas
- Les liens existants sont bien structures

### Header authentifie (ModernHeader.tsx)
Utilise `mainNavigation` de `config/navigation.ts` avec des sous-menus (Reseau, Collaborer, Apprendre, Bibliotheque, A propos). Ce header n'est pas concerne par ce plan -- il est reserve aux utilisateurs connectes.

---

## Modifications prevues

### 1. Mettre a jour les liens de navigation publique

**Fichier : `src/components/layout/PublicHeader.tsx`**

Remplacer le tableau `NAV_ITEMS` par la structure demandee :

```text
Accueil          -> /
A propos         -> /about
Plateforme       -> /network
Strategies       -> /strategies  (nouvelle page)
Projets          -> /projects
Evenements       -> /events
Contact          -> /contact     (nouvelle page)
```

Les boutons "Connexion" et "S'inscrire" restent a droite (deja en place).

### 2. Creer la page Contact

**Nouveau fichier : `src/pages/Contact.tsx`**

Page simple et institutionnelle avec :
- Coordonnees du secretariat UAT (email, telephone, adresse physique)
- Lien vers le site officiel UAT
- Formulaire de contact basique (nom, email, message) -- affichage seulement, sans backend pour l'instant

### 3. Creer la page Strategies et Politiques

**Nouveau fichier : `src/pages/Strategies.tsx`**

Page presentant les textes reglementaires par pays :
- En-tete explicatif du cadre reglementaire FSU en Afrique
- Section "Documents reglementaires" avec lien vers la bibliotheque filtree
- Section "Cadres politiques regionaux" (CEDEAO, SADC, UA, UIT)
- CTA vers la bibliotheque des ressources (`/resources`) pour les documents detailles

### 4. Enregistrer les nouvelles routes

**Fichier : `src/config/routes.ts`**

Ajouter 2 entries :
- `/contact` -> composant `Contact`, `isProtected: false`
- `/strategies` -> composant `Strategies`, `isProtected: false`

### 5. Ajouter "Soutien" dans le footer

**Fichier : `src/components/layout/Footer.tsx`**

Ajouter un lien "Soutien" dans la barre de liens legaux du bas, pointant vers `/contact` (la nouvelle page).

### 6. Ajouter les cles i18n

**Fichiers : `fr.json`, `en.json`, `ar.json`, `pt.json`**

Nouvelles cles :
- `nav.platform` : "Plateforme" / "Platform" / etc.
- `nav.strategies` : "Strategies" / "Strategies" / etc.
- `nav.contact` : "Contact"
- `footer.links.support` : "Soutien" / "Support" / etc.
- `strategies.*` : titres et descriptions de la page Strategies
- `contact.*` : titres et descriptions de la page Contact

---

## Resume technique

| Fichier | Action |
|---|---|
| `src/components/layout/PublicHeader.tsx` | Remplacer NAV_ITEMS (7 liens standardises) |
| `src/pages/Contact.tsx` | Creer -- page contact institutionnelle |
| `src/pages/Strategies.tsx` | Creer -- page textes reglementaires |
| `src/config/routes.ts` | Ajouter 2 routes publiques |
| `src/components/layout/Footer.tsx` | Ajouter lien "Soutien" |
| `src/i18n/translations/fr.json` | Cles nav + pages |
| `src/i18n/translations/en.json` | Traductions anglaises |
| `src/i18n/translations/ar.json` | Traductions arabes |
| `src/i18n/translations/pt.json` | Traductions portugaises |

Aucune migration de base de donnees requise. Les nouvelles pages sont publiques (pas de protection d'acces).

