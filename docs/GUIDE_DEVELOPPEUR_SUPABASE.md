# Guide Développeur Supabase - Projet SUTEL

> **Destiné à** : Développeurs SIFI-SITI (notamment Djéké Joseph)  
> **Objectif** : Comprendre et travailler avec Supabase sur ce projet  
> **Niveau requis** : Connaissance de base en SQL et JavaScript/TypeScript

---

## Table des Matières

1. [Introduction à Supabase](#1-introduction-à-supabase)
2. [Configuration de l'Environnement](#2-configuration-de-lenvironnement)
3. [Structure des Migrations](#3-structure-des-migrations)
4. [Travailler avec les Tables](#4-travailler-avec-les-tables)
5. [Edge Functions](#5-edge-functions)
6. [Authentification](#6-authentification)
7. [Dashboard Supabase](#7-dashboard-supabase)
8. [Commandes Utiles](#8-commandes-utiles)
9. [Workflow de Développement](#9-workflow-de-développement)
10. [FAQ et Troubleshooting](#10-faq-et-troubleshooting)
11. [Ressources](#11-ressources)

---

## 1. Introduction à Supabase

### Qu'est-ce que Supabase ?

**Supabase** est une alternative open-source à Firebase. C'est un **Backend-as-a-Service (BaaS)** qui fournit :

| Service | Description | Équivalent Traditionnel |
|---------|-------------|------------------------|
| **Database** | PostgreSQL hébergé | MySQL/PostgreSQL local |
| **Auth** | Authentification complète | Passport.js, JWT manuel |
| **Storage** | Stockage de fichiers | AWS S3, système de fichiers |
| **Edge Functions** | Fonctions serverless | Express.js, API Node.js |
| **Realtime** | Websockets automatiques | Socket.io |

### Différences avec une Base de Données Traditionnelle

| Aspect | Base Locale (MySQL/PostgreSQL) | Supabase |
|--------|-------------------------------|----------|
| **Installation** | Installer sur votre machine | Hébergé dans le cloud |
| **Connexion** | `localhost:3306` | URL HTTPS sécurisée |
| **Migrations** | Fichiers SQL manuels | Fichiers SQL versionnés |
| **API** | Créer Express/Flask | API REST auto-générée |
| **Authentification** | À implémenter | Intégrée |

### Architecture du Projet SUTEL

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
│                  src/components, src/pages                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT SUPABASE                               │
│              src/integrations/supabase/client.ts                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE CLOUD                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │PostgreSQL│  │   Auth   │  │ Storage  │  │ Edge Functions   │ │
│  │ 49 tables│  │  Users   │  │ Buckets  │  │ 11 fonctions     │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
│                                                                  │
│  URL: https://wsbawdvqfbmtjtdtyddy.supabase.co                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Configuration de l'Environnement

### Option A : Développement avec le Cloud (Recommandé)

C'est l'option la plus simple pour commencer. Vous utilisez directement la base de données cloud.

#### Étapes d'installation

```bash
# 1. Cloner le repository
git clone <url-du-repo>
cd sutel-platform

# 2. Installer les dépendances
npm install
# ou avec Bun (plus rapide)
bun install

# 3. Vérifier le fichier .env (déjà configuré)
# Les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont présentes

# 4. Lancer le serveur de développement
npm run dev
```

#### Variables d'environnement (déjà configurées)

```env
# .env ou .env.local
VITE_SUPABASE_URL=https://wsbawdvqfbmtjtdtyddy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Important** : Ces clés sont des clés publiques (anon key). Elles peuvent être dans le code frontend car elles sont protégées par les politiques RLS.

---

### Option B : Développement Local avec Docker

Cette option permet de travailler complètement hors ligne avec une copie locale de Supabase.

#### Prérequis

1. **Docker Desktop** : [Télécharger Docker](https://www.docker.com/products/docker-desktop)
2. **Supabase CLI** : 

```bash
# Installation globale
npm install -g supabase

# Vérifier l'installation
supabase --version
```

#### Configuration locale

```bash
# 1. Se placer dans le projet
cd sutel-platform

# 2. Démarrer les services Supabase locaux
supabase start

# Cette commande va :
# - Télécharger les images Docker (première fois uniquement)
# - Démarrer PostgreSQL, Auth, Storage, etc.
# - Afficher les URLs et clés locales
```

#### Sortie de `supabase start`

```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Appliquer les migrations existantes

```bash
# Réinitialiser la base avec toutes les migrations
supabase db reset

# Cette commande va :
# - Supprimer toutes les données locales
# - Appliquer les 35 fichiers de migration dans l'ordre
# - Recréer toutes les tables, fonctions, triggers, etc.
```

#### Modifier les variables d'environnement pour le local

Créer un fichier `.env.local` :

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<anon_key_affichée_par_supabase_start>
```

#### Arrêter les services locaux

```bash
supabase stop
```

---

### Comparaison des Options

| Critère | Option A (Cloud) | Option B (Local) |
|---------|------------------|------------------|
| **Installation** | Simple | Complexe (Docker requis) |
| **Données** | Partagées avec l'équipe | Isolées sur votre machine |
| **Connexion Internet** | Requise | Non requise |
| **Performance** | Dépend du réseau | Rapide |
| **Recommandé pour** | Débuter, tester | Développement offline |

---

## 3. Structure des Migrations

### Qu'est-ce qu'une Migration ?

Une **migration** est un fichier SQL qui modifie la structure de la base de données. Les migrations sont versionnées et appliquées dans l'ordre chronologique.

### Emplacement des Migrations

```
supabase/
└── migrations/
    ├── 20250716202502_hidden_frost.sql
    ├── 20250716202504_cold_math.sql
    ├── 20250716202507_square_harbor.sql
    ├── ... (35 fichiers au total)
    └── 20250722011206_quick_sea.sql
```

### Convention de Nommage

```
YYYYMMDDHHMMSS_nom_descriptif.sql
│              │
│              └── Description de la migration
└── Timestamp (date et heure)
```

### Contenu Typique d'une Migration

```sql
-- supabase/migrations/20250716202502_hidden_frost.sql

-- Créer une table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Créer une politique d'accès
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Créer un trigger
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

### Créer une Nouvelle Migration

```bash
# Méthode 1 : Avec Supabase CLI
supabase migration new nom_de_la_migration

# Cela crée : supabase/migrations/20250722120000_nom_de_la_migration.sql

# Méthode 2 : Manuellement
# Créer un fichier avec le bon format de nom
```

### Appliquer les Migrations

```bash
# En local : réinitialiser complètement
supabase db reset

# En local : appliquer les nouvelles migrations seulement
supabase db push

# En production : les migrations sont appliquées automatiquement
# via Lovable ou le Dashboard Supabase
```

---

## 4. Travailler avec les Tables

### Accès au Client Supabase dans le Code

```typescript
// Importer le client
import { supabase } from "@/integrations/supabase/client";
```

### Opérations CRUD

#### SELECT (Lecture)

```typescript
// Récupérer tous les profils
const { data, error } = await supabase
  .from('profiles')
  .select('*');

// Avec filtre
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('role', 'admin');

// Avec relations (jointures)
const { data, error } = await supabase
  .from('agency_projects')
  .select(`
    *,
    agencies (
      name,
      acronym
    )
  `);

// Avec pagination
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .range(0, 9); // 10 premiers résultats
```

#### INSERT (Création)

```typescript
// Insérer une ligne
const { data, error } = await supabase
  .from('profiles')
  .insert({
    user_id: 'uuid-here',
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'jean@example.com'
  })
  .select(); // Retourne la ligne insérée

// Insérer plusieurs lignes
const { data, error } = await supabase
  .from('profiles')
  .insert([
    { first_name: 'Jean', ... },
    { first_name: 'Marie', ... }
  ]);
```

#### UPDATE (Mise à jour)

```typescript
// Mettre à jour une ligne
const { data, error } = await supabase
  .from('profiles')
  .update({ first_name: 'Jean-Pierre' })
  .eq('id', 'uuid-here')
  .select();
```

#### DELETE (Suppression)

```typescript
// Supprimer une ligne
const { error } = await supabase
  .from('profiles')
  .delete()
  .eq('id', 'uuid-here');
```

### Comprendre les Politiques RLS

**Row Level Security (RLS)** permet de contrôler qui peut accéder à quelles données.

```sql
-- Exemple : seul le propriétaire peut voir ses données
CREATE POLICY "Users can view own data"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);
```

> ⚠️ **Important** : Si vous obtenez une erreur "permission denied" ou des données vides, vérifiez que l'utilisateur est authentifié et que les politiques RLS sont correctes.

### Tables Principales du Projet

| Table | Description | Lignes clés |
|-------|-------------|-------------|
| `profiles` | Profils utilisateurs | user_id, role, first_name |
| `agencies` | Agences de régulation | name, acronym, country |
| `agency_projects` | Projets des agences | title, status, budget |
| `indicator_values` | Valeurs des indicateurs | value, year, country_id |
| `documents` | Documents partagés | title, file_url, document_type |

---

## 5. Edge Functions

### Qu'est-ce qu'une Edge Function ?

Une **Edge Function** est une fonction serverless exécutée côté serveur. Elle permet de :
- Garder des secrets sécurisés (API keys)
- Exécuter de la logique métier complexe
- Communiquer avec des APIs externes

### Liste des Edge Functions du Projet

| Fonction | Description |
|----------|-------------|
| `agency-sync` | Synchronisation des données d'agences externes |
| `batch-sync` | Synchronisation par lots de données |
| `detect-late-payments` | Détection automatique des retards de paiement |
| `execute-recurring-payments` | Exécution des paiements récurrents |
| `get-mapbox-token` | Récupération sécurisée du token Mapbox |
| `security-ai-anomaly` | Détection d'anomalies de sécurité avec IA |
| `send-reminder-email` | Envoi d'emails de rappel |
| `sync-agency-data` | Synchronisation des données d'agence |
| `sync-itu-data` | Synchronisation avec les données ITU |
| `web-scraper` | Extraction de données web |
| `scrape-agency-indicators` | Extraction des indicateurs d'agences |

### Structure d'une Edge Function

```
supabase/
└── functions/
    └── get-mapbox-token/
        └── index.ts
```

### Exemple de Code Edge Function

```typescript
// supabase/functions/get-mapbox-token/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Gérer les requêtes OPTIONS (CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupérer un secret
    const mapboxToken = Deno.env.get('MAPBOX_PUBLIC_TOKEN');
    
    return new Response(
      JSON.stringify({ token: mapboxToken }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
```

### Appeler une Edge Function depuis le Frontend

```typescript
// Méthode recommandée : avec le client Supabase
const { data, error } = await supabase.functions.invoke('get-mapbox-token', {
  body: { param1: 'value1' }
});
```

### Déployer une Edge Function

```bash
# Déployer une fonction spécifique
supabase functions deploy get-mapbox-token

# Déployer toutes les fonctions
supabase functions deploy
```

### Voir les Logs

Dans le Dashboard Supabase :
1. Aller dans **Edge Functions**
2. Cliquer sur la fonction
3. Onglet **Logs**

Ou avec la CLI :
```bash
supabase functions logs get-mapbox-token
```

---

## 6. Authentification

### Système d'Authentification

Supabase gère l'authentification complètement. Le projet utilise :
- Email/Password
- OAuth (Google, etc.)

### Rôles Utilisateurs

Le projet définit ces rôles dans la table `profiles` :

| Rôle | Description | Permissions |
|------|-------------|-------------|
| `super_admin` | Administrateur global | Tout |
| `country_admin` | Administrateur pays | Gestion pays spécifique |
| `editeur` | Éditeur de contenu | Modification données |
| `user` | Utilisateur standard | Lecture seule |

### Utilisation dans le Code

```typescript
// Récupérer l'utilisateur connecté
const { data: { user } } = await supabase.auth.getUser();

// Écouter les changements d'authentification
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session);
});

// Connexion
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Déconnexion
await supabase.auth.signOut();
```

---

## 7. Dashboard Supabase

### Accès au Dashboard

**URL** : https://supabase.com/dashboard/project/wsbawdvqfbmtjtdtyddy

> ⚠️ **Note** : Vous devez être invité au projet par le propriétaire pour y accéder.

### Sections Importantes

| Section | Usage |
|---------|-------|
| **Table Editor** | Visualiser et modifier les données |
| **SQL Editor** | Exécuter des requêtes SQL manuelles |
| **Authentication** | Gérer les utilisateurs |
| **Storage** | Gérer les fichiers uploadés |
| **Edge Functions** | Voir et gérer les fonctions |
| **Logs** | Débugger les erreurs |

### Captures d'Écran Utiles

#### Table Editor
- Cliquer sur une table pour voir ses données
- Bouton "Insert" pour ajouter une ligne
- Double-cliquer sur une cellule pour modifier

#### SQL Editor
- Écrire des requêtes SQL directement
- Sauvegarder des requêtes fréquentes
- Exporter les résultats en CSV

---

## 8. Commandes Utiles

### Frontend

```bash
# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Vérifier le code (linting)
npm run lint

# Lancer les tests
npm run test

# Voir la taille du bundle
npm run analyze
```

### Supabase CLI (Développement Local)

```bash
# Démarrer les services locaux
supabase start

# Arrêter les services
supabase stop

# Voir le statut
supabase status

# Réinitialiser la base (applique toutes les migrations)
supabase db reset

# Pousser les changements de schéma
supabase db push

# Créer une nouvelle migration
supabase migration new ma_migration

# Déployer une Edge Function
supabase functions deploy nom-fonction

# Voir les logs d'une fonction
supabase functions logs nom-fonction

# Régénérer les types TypeScript
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Git

```bash
# Créer une branche pour une fonctionnalité
git checkout -b feature/ma-fonctionnalite

# Committer les changements
git add .
git commit -m "feat: description de la fonctionnalité"

# Pousser la branche
git push origin feature/ma-fonctionnalite
```

---

## 9. Workflow de Développement

### Workflow Recommandé

```
1. PULL         ──→  2. BRANCH       ──→  3. DEVELOP
   git pull          git checkout -b      npm run dev
                     feature/xxx          
                                          
4. TEST         ──→  5. COMMIT       ──→  6. PUSH
   npm run test      git add .            git push origin
                     git commit -m "..."   feature/xxx

7. PR           ──→  8. REVIEW      ──→  9. MERGE
   Créer Pull        Code review          Merger dans main
   Request           par l'équipe
```

### Bonnes Pratiques

1. **Toujours créer une branche** pour chaque fonctionnalité
2. **Tester localement** avant de committer
3. **Écrire des messages de commit clairs** :
   - `feat:` pour une nouvelle fonctionnalité
   - `fix:` pour une correction de bug
   - `docs:` pour la documentation
   - `refactor:` pour du refactoring
4. **Créer des Pull Requests** pour review
5. **Ne jamais pusher directement sur main**

### Exemple de Session de Développement

```bash
# 1. Récupérer les dernières modifications
git pull origin main

# 2. Créer une branche
git checkout -b feature/ajouter-filtre-agences

# 3. Lancer le dev server
npm run dev

# 4. Développer... tester...

# 5. Committer
git add .
git commit -m "feat: ajouter filtre par pays sur la liste des agences"

# 6. Pousser
git push origin feature/ajouter-filtre-agences

# 7. Créer une Pull Request sur GitHub/GitLab
```

---

## 10. FAQ et Troubleshooting

### Problèmes Courants

#### "Je n'ai pas accès au Dashboard Supabase"

**Solution** : Demander une invitation au propriétaire du projet (Lovable ou admin).

---

#### "La base de données semble vide"

**Causes possibles** :
1. Variables d'environnement incorrectes
2. Pas connecté (RLS bloque les données)

**Solution** :
```bash
# Vérifier les variables
cat .env

# Vérifier la connexion dans le code
console.log(supabase.auth.getUser());
```

---

#### "Erreur : permission denied for table xxx"

**Cause** : Politique RLS bloquante

**Solution** :
1. Vérifier que l'utilisateur est authentifié
2. Vérifier les politiques RLS dans le Dashboard
3. Ajouter une politique si nécessaire

---

#### "Edge Function ne répond pas"

**Solution** :
1. Vérifier les logs : Dashboard → Edge Functions → Logs
2. Vérifier que la fonction est déployée
3. Vérifier les CORS headers

---

#### "Types TypeScript incorrects"

**Cause** : Le fichier `types.ts` n'est plus à jour avec la base

**Solution** :
```bash
# Régénérer les types (avec Supabase CLI)
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

> ⚠️ Note : Ce fichier est en lecture seule dans Lovable. Contacter l'admin pour mise à jour.

---

#### "Docker prend trop de mémoire"

**Solution** :
1. Augmenter la mémoire allouée à Docker (Settings → Resources)
2. Ou utiliser l'Option A (Cloud) à la place

---

#### "supabase start échoue"

**Solutions** :
1. Vérifier que Docker est lancé
2. Supprimer les containers existants : `docker rm -f $(docker ps -aq)`
3. Relancer : `supabase start`

---

## 11. Ressources

### Documentation Officielle

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase CLI](https://supabase.com/docs/reference/cli/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Documentation du Projet

- [Feuille de Route SIFI-SITI](./FEUILLE_DE_ROUTE_SIFI_SITI.md)
- [README Principal](../README.md)

### Technologies Utilisées

- [React Query / TanStack Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

### Contacts Support

| Rôle | Contact |
|------|---------|
| **Chef de Projet SIFI-SITI** | À définir |
| **Lead Développeur** | Djéké Joseph |
| **Support Lovable** | Via l'interface chat |
| **Support Supabase** | support@supabase.io |

---

## Annexes

### A. Schéma de la Base de Données (Principales Tables)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    profiles     │     │    agencies     │     │ agency_projects │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │     │ id              │
│ user_id    ────────┐  │ name            │  ┌──│ agency_id       │
│ first_name      │  │  │ acronym         │  │  │ title           │
│ last_name       │  │  │ country         │  │  │ status          │
│ email           │  │  │ region          │  │  │ budget          │
│ role            │  │  │ website_url     │  │  │ beneficiaries   │
│ created_at      │  │  └─────────────────┘  │  └─────────────────┘
└─────────────────┘  │           │           │
                     │           └───────────┘
                     │
┌─────────────────┐  │  ┌─────────────────┐     ┌─────────────────┐
│   documents     │  │  │indicator_values │     │    countries    │
├─────────────────┤  │  ├─────────────────┤     ├─────────────────┤
│ id              │  │  │ id              │     │ id              │
│ title           │  │  │ indicator_id    │     │ code            │
│ file_url        │  │  │ country_id      │     │ name_fr         │
│ uploaded_by ────────┘  │ value           │     │ name_en         │
│ document_type   │     │ year            │     │ region          │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### B. Variables d'Environnement

| Variable | Description | Où la trouver |
|----------|-------------|---------------|
| `VITE_SUPABASE_URL` | URL du projet Supabase | Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Clé publique | Dashboard → Settings → API |

### C. Checklist Nouveau Développeur

- [ ] Accès au repository Git
- [ ] Node.js v18+ installé
- [ ] `npm install` ou `bun install` réussi
- [ ] `npm run dev` fonctionne
- [ ] Invitation au Dashboard Supabase reçue
- [ ] Accès au Dashboard vérifié
- [ ] Lecture de ce guide terminée

---

*Document créé le 31 décembre 2024*  
*Version 1.0*
