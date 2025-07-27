import { 
  Users,
  Building,
  Shield,
  TrendingUp,
  Map,
  FileText
} from 'lucide-react';
import { DemoStep } from '../types/demo-types';

export const demoStepsData: DemoStep[] = [
  {
    id: 'introduction',
    title: 'Introduction et Dashboard',
    duration: 3,
    route: '/',
    description: 'Présentation de Marie Diallo et découverte du tableau de bord personnalisé',
    actions: [
      'Se connecter en tant que Marie Diallo',
      'Explorer les missions quotidiennes',
      'Montrer les raccourcis workspace',
      'Présenter les recommandations intelligentes'
    ],
    keyPoints: [
      'Interface adaptative basée sur le profil utilisateur',
      'Missions personnalisées selon l\'expérience',
      'Accès rapide aux sections principales'
    ],
    assistantMessage: 'Commencez par présenter Marie comme représentante du Cameroun, soulignez son expertise de niveau intermédiaire.',
    icon: Users
  },
  {
    id: 'organizations',
    title: 'Exploration des Organisations',
    duration: 4,
    route: '/organizations',
    description: 'Découverte de l\'écosystème des agences de régulation africaines',
    actions: [
      'Naviguer vers la carte interactive',
      'Sélectionner la région Afrique Centrale',
      'Explorer les détails de l\'ART Cameroun',
      'Montrer les statuts de synchronisation'
    ],
    keyPoints: [
      '47 agences actives dans 34 pays',
      'Visualisation géographique du réseau',
      'Synchronisation temps réel des données',
      'Profils détaillés des agences partenaires'
    ],
    assistantMessage: 'Insistez sur la dimension panafricaine et la collaboration régionale.',
    icon: Building
  },
  {
    id: 'projects',
    title: 'Projets Collaboratifs',
    duration: 5,
    route: '/projects',
    description: 'Création et gestion d\'un projet de connectivité rurale',
    actions: [
      'Créer un nouveau projet "Connectivité Rurale 2024"',
      'Définir le budget et les bénéficiaires',
      'Assigner l\'ART Cameroun comme agence responsable',
      'Configurer les indicateurs de suivi'
    ],
    keyPoints: [
      'Gestion collaborative multi-agences',
      'Suivi budgétaire en temps réel',
      'Indicateurs d\'impact mesurables',
      'Workflows d\'approbation'
    ],
    assistantMessage: 'Mettez l\'accent sur la collaboration entre agences et le suivi des résultats.',
    icon: TrendingUp
  },
  {
    id: 'security',
    title: 'Sécurité et Conformité',
    duration: 3,
    route: '/security',
    description: 'Démonstration des fonctionnalités de sécurité avancées',
    actions: [
      'Consulter le tableau de bord sécurité',
      'Vérifier les sessions actives',
      'Examiner les logs d\'audit',
      'Configurer l\'authentification biométrique'
    ],
    keyPoints: [
      'Chiffrement de bout en bout',
      'Authentification multi-facteurs',
      'Conformité RGPD et standards africains',
      'Détection d\'anomalies par IA'
    ],
    assistantMessage: 'Rassurez sur la sécurité des données sensibles des télécommunications.',
    icon: Shield
  },
  {
    id: 'intelligence',
    title: 'Intelligence Collaborative',
    duration: 4,
    route: '/analytics',
    description: 'Exploitation des données pour l\'amélioration des services',
    actions: [
      'Analyser les tendances régionales',
      'Comparer les performances entre pays',
      'Générer des recommandations IA',
      'Planifier les actions d\'amélioration'
    ],
    keyPoints: [
      'Analytics temps réel multi-pays',
      'Benchmarking automatisé',
      'Suggestions intelligentes',
      'Rapports personnalisés'
    ],
    assistantMessage: 'Montrez comment l\'IA aide à prendre de meilleures décisions politiques.',
    icon: Map
  },
  {
    id: 'impact',
    title: 'Mesure d\'Impact',
    duration: 3,
    route: '/indicators',
    description: 'Évaluation des résultats et planification stratégique',
    actions: [
      'Consulter les indicateurs de service universel',
      'Analyser l\'évolution de la couverture mobile',
      'Comparer avec les standards internationaux',
      'Exporter le rapport annuel'
    ],
    keyPoints: [
      '15M+ de bénéficiaires touchés',
      'Amélioration de 40% de la couverture',
      'Conformité aux objectifs ODD',
      'Impact économique quantifié'
    ],
    assistantMessage: 'Concluez sur les résultats concrets et l\'impact sur les populations.',
    icon: FileText
  }
];