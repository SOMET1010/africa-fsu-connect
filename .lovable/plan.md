
# Corrections finales P1 + quick-win UX

3 corrections mineures pour supprimer les derniers restes "pas fini".

---

## A) Route fantome `/docs` dans le preloader

**Fichier** : `src/hooks/usePreloader.ts` (ligne 10)

Remplacer `'/docs'` par `'/resources'` dans `routeComponentMap`. Cela aligne le preloader avec la route reelle et evite un import mort.

---

## B) Image placeholder dans AdminLayout

**Fichier** : `src/components/admin/AdminLayout.tsx` (ligne 43)

Supprimer l'attribut `src="/api/placeholder/32/32"` de `AvatarImage`. Le composant `AvatarFallback` avec "AD" est deja present et prendra le relais automatiquement, ce qui donne un rendu propre (initiales sur fond colore) sans image cassee.

---

## C) Validation du parametre `region` dans MembersDirectory

**Fichier** : `src/pages/MembersDirectory.tsx` (lignes 49-54)

Ajouter une verification : appliquer `setSelectedRegion(regionParam)` uniquement si `regionParam` est present dans la liste `regions` (meme pattern que le filtre `language` juste au-dessus). Sinon, ignorer le parametre invalide.

```
useEffect(() => {
  const regionParam = searchParams.get('region');
  if (regionParam && regions.includes(regionParam)) {
    setSelectedRegion(regionParam);
  }
}, [searchParams, regions, setSelectedRegion]);
```

---

## Resume

| Fichier | Modification |
|---|---|
| `src/hooks/usePreloader.ts` | `'/docs'` remplace par `'/resources'` |
| `src/components/admin/AdminLayout.tsx` | Suppression de `src="/api/placeholder/32/32"` |
| `src/pages/MembersDirectory.tsx` | Validation de `regionParam` contre `regions` |

3 fichiers modifies, 0 fichier cree, 0 dependance, 0 migration SQL.
