

# Tests unitaires i18n pour le branding "USF Digital Connect Africa"

## Objectif

Creer des tests automatises qui verifient que le nouveau nom de marque "USF Digital Connect Africa" est correctement present dans toutes les traductions (FR, EN, PT, AR) pour les composants cles de l'interface.

## Mise en place du framework de test

Le projet n'a pas encore de configuration Vitest. Il faut creer les fichiers de base :

- `vitest.config.ts` : configuration Vitest avec jsdom
- `src/test/setup.ts` : fichier de setup avec les mocks necessaires (matchMedia)

## Tests a creer

### Fichier : `src/i18n/__tests__/branding.test.ts`

Ce fichier testera directement les fichiers JSON de traduction sans rendu React, ce qui est rapide et fiable :

1. **Badge hero** : Verifier que `home.hero.badge` vaut "USF Digital Connect Africa" dans les 4 langues
2. **Nom footer** : Verifier que `footer.platform.name` vaut "USF Digital Connect Africa" dans les 4 langues
3. **Absence de l'ancien nom** : Verifier qu'aucune des 4 traductions ne contient "NEXUS", "Universal Digital Connect (UDC)" ou "Plateforme UDC" dans ces cles
4. **Coherence inter-langues** : Verifier que la valeur du badge et du footer est identique dans les 4 langues (le nom de marque ne se traduit pas)

### Fichier : `src/components/home/__tests__/HomeHeroBlock.test.tsx`

Test de rendu du composant hero :

1. Verifier que le fallback du badge contient "USF Digital Connect Africa"

## Details techniques

| Fichier | Action |
|---------|--------|
| `vitest.config.ts` | Creer - configuration Vitest |
| `src/test/setup.ts` | Creer - setup avec mocks |
| `tsconfig.app.json` | Ajouter `"vitest/globals"` aux types |
| `src/i18n/__tests__/branding.test.ts` | Creer - tests des traductions JSON |
| `src/components/home/__tests__/HomeHeroBlock.test.tsx` | Creer - test du composant hero |

Les tests importent directement les fichiers JSON et verifient les valeurs des cles, sans necessite de monter l'application complete. Cela garantit que toute regression sur le nom de marque sera detectee immediatement.

