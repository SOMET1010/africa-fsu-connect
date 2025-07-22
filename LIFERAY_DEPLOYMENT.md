
# Déploiement de l'application React SUTEL dans Liferay

## Prérequis

- Liferay Portal 7.4+
- Node.js 16+
- Gradle 7+
- Java 8 ou 11

## Structure du projet

```
├── modules/
│   └── react-sutel-portlet/          # Module portlet Liferay
│       ├── build.gradle               # Configuration Gradle
│       ├── bnd.bnd                   # Configuration OSGi
│       └── src/main/
│           ├── java/                 # Code Java du portlet
│           └── resources/META-INF/resources/
│               ├── view.jsp          # Vue JSP
│               ├── init.jsp          # Initialisation JSP
│               ├── css/              # Styles CSS
│               └── js/               # Bundle JavaScript React
├── src/
│   ├── LiferayApp.tsx               # Point d'entrée React pour Liferay
│   ├── liferay-main.tsx             # Initialisation du portlet
│   └── contexts/LiferayAuthContext.tsx  # Auth adapté pour Liferay
├── vite.config.liferay.ts           # Configuration Vite pour Liferay
└── scripts/build-for-liferay.sh     # Script de build
```

## Instructions de déploiement

### 1. Build de l'application React

```bash
# Build pour Liferay
npm run build:liferay

# Ou avec le script automatisé
chmod +x scripts/build-for-liferay.sh
./scripts/build-for-liferay.sh
```

### 2. Déploiement du portlet

```bash
# Dans le dossier du module
cd modules/react-sutel-portlet

# Build et déploiement
./gradlew deploy
```

### 3. Configuration Liferay

1. **Accéder au Control Panel** → Site Builder → Pages
2. **Créer une nouvelle page** ou éditer une page existante
3. **Ajouter le portlet** "React SUTEL" depuis la catégorie "Sample"
4. **Configurer les permissions** si nécessaire

### 4. Variables d'environnement

Configurer les variables suivantes dans Liferay :

- `SUPABASE_URL` : URL de votre instance Supabase
- `SUPABASE_ANON_KEY` : Clé anonyme Supabase
- `MAPBOX_PUBLIC_TOKEN` : Token public Mapbox

## Développement

### Mode développement local

```bash
# Développement normal (hors Liferay)
npm run dev

# Build de test pour Liferay
npm run build:liferay
```

### Debug

- Les logs du portlet sont visibles dans les logs Liferay
- Le namespace du portlet est injecté via JavaScript global
- L'authentification Liferay est synchronisée avec Supabase

## Fonctionnalités adaptées pour Liferay

### 1. **Routing**
- Utilisation de `HashRouter` au lieu de `BrowserRouter`
- Routes préfixées avec le namespace du portlet
- Navigation adaptée au contexte Liferay

### 2. **Authentification**
- Synchronisation entre l'authentification Liferay et Supabase
- Logs de sécurité enrichis avec les informations Liferay
- Gestion des rôles compatible avec Liferay

### 3. **Styling**
- CSS isolé pour éviter les conflits avec le thème Liferay
- Classes CSS préfixées avec le namespace du portlet
- Réinitialisation des styles Liferay qui interfèrent

### 4. **État global**
- QueryClient configuré pour le contexte multi-portlet
- Contexte Liferay accessible dans toute l'application
- Gestion des événements Liferay

## Problèmes courants et solutions

### 1. **Styles conflictuels**
Solution : Utiliser l'isolation CSS avec `.react-sutel-portlet`

### 2. **Routing ne fonctionne pas**
Solution : Vérifier le basename du HashRouter et le namespace

### 3. **Authentification échoue**
Solution : Configurer correctement les redirections Supabase

### 4. **Performance lente**
Solution : Optimiser les bundles et utiliser le lazy loading

## Maintenance

### Mise à jour de l'application
1. Modifier le code React
2. Rebuild avec `npm run build:liferay`
3. Redéployer le portlet avec `./gradlew deploy`

### Monitoring
- Vérifier les logs Liferay pour les erreurs
- Monitorer les performances via les outils Liferay
- Utiliser les métriques Supabase pour l'authentification
