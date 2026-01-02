# ADR 0001: Stratégie de Typage Strict

## Statut

Accepté - Janvier 2025

## Contexte

L'audit du projet SUTEL Nexus a révélé environ 320 occurrences du type `any` dans le codebase, créant plusieurs risques :

1. **Erreurs runtime** : Pas de vérification de type à la compilation
2. **Maintenabilité réduite** : Difficile de comprendre les structures de données
3. **Refactoring risqué** : Modifications silencieuses sans erreur TypeScript
4. **Documentation implicite perdue** : Les types servent de documentation

## Décision

Nous adoptons une politique de **zéro `any`** avec les stratégies suivantes :

### 1. Remplacer `any` par `unknown`

```typescript
// ❌ Avant
} catch (err: any) {
  setError(err.message);
}

// ✅ Après
} catch (err: unknown) {
  const message = toErrorMessage(err);
  setError(message);
}
```

### 2. Utiliser le narrowing

```typescript
function processData(data: unknown): string {
  if (typeof data === 'string') {
    return data;
  }
  if (typeof data === 'object' && data !== null && 'message' in data) {
    return String((data as { message: unknown }).message);
  }
  return 'Unknown';
}
```

### 3. Types JSON sûrs pour les données dynamiques

Fichier : `src/types/safeJson.ts`

```typescript
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonObject { [k: string]: JsonValue; }
export interface JsonArray extends Array<JsonValue> {}
```

Usage :
```typescript
// ❌ Avant
interface LogContext {
  data?: any;
}

// ✅ Après
import type { JsonValue } from '@/types/safeJson';

interface LogContext {
  data?: JsonValue;
}
```

### 4. Utilitaires d'erreur centralisés

Fichier : `src/utils/errors.ts`

```typescript
export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Une erreur inattendue est survenue';
}

export function isErrorLike(error: unknown): error is { message: string } {
  return typeof error === 'object' 
    && error !== null 
    && 'message' in error;
}
```

### 5. Types dédiés pour les états complexes

```typescript
// ❌ Avant
const [selectedUser, setSelectedUser] = useState<any>(null);

// ✅ Après
interface AdminSelectedUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const [selectedUser, setSelectedUser] = useState<AdminSelectedUser | null>(null);
```

## Conséquences

### Positives

- Détection d'erreurs à la compilation
- Meilleure auto-complétion IDE
- Documentation implicite via les types
- Refactoring plus sûr
- Réduction des bugs runtime

### Négatives

- Temps de développement initial légèrement plus long
- Courbe d'apprentissage pour les contributeurs
- Certaines bibliothèques tierces exposent des `any`

## Exceptions Autorisées

1. **Types générés automatiquement** : `src/integrations/supabase/types.ts`
2. **Bibliothèques tierces** : Quand les types sont incomplets
3. **Migrations progressives** : Avec commentaire `// TODO: type this`

## Validation

```bash
# Vérifier qu'aucun nouveau any n'est introduit
npx tsc --noEmit

# Rechercher les any restants
grep -r ": any" src/ --include="*.ts" --include="*.tsx" | grep -v node_modules
```

## Références

- [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook - Unknown Type](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-unknown-type)
