

# Plan : Renommage complet restant -- USF Universal Digital Connect (UDC)

Le premier passage a couvert ~18 fichiers, mais il reste encore **~60+ fichiers** avec des mentions visibles par l'utilisateur de "ADCA", "NEXUS" ou "SUTEL" dans du texte en dur (hors noms de composants/variables techniques).

---

## Perimetre des changements

### Regle de remplacement

| Ancien | Nouveau |
|--------|---------|
| ADCA | UDC |
| UAT Digital Connect Africa | USF Universal Digital Connect |
| SUTEL (dans les textes affichables) | UDC |
| Réseau SUTEL / Réseau NEXUS | Réseau UDC |
| plateforme SUTEL / plateforme NEXUS | plateforme UDC |
| SUTEL Platform | UDC Platform |
| SUTEL Nexus (config/placeholder) | USF Universal Digital Connect |

### Ce qui NE change PAS

- Noms de fichiers/composants (NexusLogo, NexusCard, SutaChatbot, etc.)
- Variables CSS (--nx-*)
- Noms de fonctions/hooks (useNexusLayer, etc.)
- Commentaires techniques (NEXUS_LAYER1_GUARD, blueprintGuards)
- Champs metadata techniques (sutel_type dans la BDD)
- Noms de clés i18n (feed.demo.sutel.country reste comme cle, seule la valeur change)

---

## Fichiers a modifier -- Groupe 1 : Pages (src/pages/)

| Fichier | Mentions a remplacer |
|---------|---------------------|
| `SutaAssistant.tsx` | "plateforme ADCA" (x2), "base de données ADCA" |
| `About.tsx` | "A Propos d'ADCA", "Plateforme ADCA", "Comité de Pilotage ADCA" |
| `CountryProfile.tsx` | fallback "réseau SUTEL" |
| `ConceptNote.tsx` | "Note conceptuelle SUTEL" (x3) |
| `Community.tsx` | "réseau SUTEL" |
| `Strategies.tsx` | fallback "réseau SUTEL" |
| `CrossBorderCollaboration.tsx` | "réseau SUTEL" |
| `MyContributions.tsx` | "réseau SUTEL" |
| `AgencyDocuments.tsx` | "réseau SUTEL" |
| `Coauthoring.tsx` | "Rapport Annuel SUTEL 2025" |
| `Projects.tsx` | fallback "Réseau SUTEL" |
| `legal/TermsOfUse.tsx` | "plateforme ADCA" (x3), "réseau ADCA" |
| `admin/PlatformConfig.tsx` | "SUTEL Nexus" |
| `admin/TranslationsExport.tsx` | "plateforme SUTEL" |
| `admin/AdminDashboard.tsx` | "réseau NEXUS" |

## Fichiers a modifier -- Groupe 2 : Composants (src/components/)

| Fichier | Mentions a remplacer |
|---------|---------------------|
| `layout/Footer.tsx` | "ADCA" (badge logo) |
| `home/HomeTrustSection.tsx` | "plateforme ADCA" |
| `home/HomeMessagesBlock.tsx` | "plateforme ADCA", "d'ADCA" |
| `network/UATCoordinationSection.tsx` | "ADCA Network Coordination", "Réseau ADCA" |
| `dashboard/ImpactDashboard.tsx` | "Vue Réseau ADCA" |
| `dashboard/widgets/DashboardMapWidget.tsx` | "Carte du Réseau SUTEL" |
| `dashboard/widgets/MapWidget.tsx` | "Carte SUTEL", "Carte Interactive SUTEL", "Agences SUTEL" (texte label) |
| `dashboard/components/ExecutiveSummary.tsx` | "réseau SUTEL" |
| `dashboard/components/UpcomingEvents.tsx` | "Conférence Annuelle SUTEL" |
| `assistant/SutaChatbot.tsx` | "Statistiques SUTEL", "plateforme SUTEL offre" (dans les reponses) |
| `community/CommunityHero.tsx` | "SUTEL" |
| `map/ActivityPanel.tsx` | "réseau SUTEL" |
| `organizations/LeafletInteractiveMap.tsx` | "réseau SUTEL" (x2) |
| `organizations/EnrichedAgencyCard.tsx` | "SUTEL" (badge label -- texte visible) |
| `organizations/AgencyComparison.tsx` | "Type SUTEL", "SUTEL confirmees" |
| `organizations/AdvancedGeolocation.tsx` | "Couverture SUTEL Afrique" |
| `presentation/InteractiveDemoSection.tsx` | "plateforme SUTEL" |
| `presentation/InteractiveRegionalMap.tsx` | "Présence SUTEL" |
| `presentation/ROICalculator.tsx` | "SUTEL" (x5 dans les labels) |
| `presentation/SocialProofSection.tsx` | "Directeur SUTEL", "SUTEL Platform" |
| `projects/ProposeProjectCTA.tsx` | "réseau SUTEL" |
| `projects/ProjectReports.tsx` | "FSU/SUTEL" |
| `submit/ShareInitiativeHero.tsx` | "réseau SUTEL" |
| `submit/ContributionSuccess.tsx` | "equipe SUTEL" |
| `webinars/WebinarsHero.tsx` | "réseau NEXUS" |
| `webinars/WebinarReplays.tsx` | "architecture NEXUS", "Equipe NEXUS" |
| `shared/FloatingMapButton.tsx` | pas de texte visible (variable technique -- conserver) |
| `admin/config/IdentitySection.tsx` | placeholder "SUTEL Nexus" et "sutel-nexus.org" |
| `layout/AppSidebar.tsx` | fallback "NEXUS" |

## Fichiers a modifier -- Groupe 3 : Utilitaires/Services

| Fichier | Mentions a remplacer |
|---------|---------------------|
| `lib/advanced-presentation-export.ts` | "SUTEL PLATFORM", "Vision SUTEL Afrique", "sutel-presentation" (nom fichier export) |
| `features/security/components/advanced/EnhancedWebAuthn.tsx` | rp.name "SUTEL Platform" |
| `demo/services/demoExportService.ts` | "Plateforme SUTEL" |
| `hooks/usePlatformConfig.ts` | localStorage key "sutel_platform_config" et nom export "sutel-config" (technique mais visible dans fichier telecharge) |

## Fichiers a modifier -- Groupe 4 : Traductions manquantes

Les fichiers JSON de traduction ont ete partiellement mis a jour. Il reste des **fallbacks en dur** dans les composants TSX qui referent encore a SUTEL/NEXUS. Ces fallbacks seront aussi mis a jour.

---

## Resume

| Categorie | Fichiers restants |
|-----------|-------------------|
| Pages TSX | ~15 |
| Composants TSX | ~28 |
| Services/Utils | ~4 |
| **Total** | **~47 fichiers** |

Chaque fichier sera modifie avec des remplacements cibles (lov-line-replace) sur les lignes contenant du texte visible par l'utilisateur. Les identifiants techniques (noms de composants, hooks, cles i18n, variables CSS, metadata BDD) restent inchanges.

