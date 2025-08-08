export interface SubmissionTemplate {
  id: string;
  name: string;
  type: 'project' | 'position' | 'regulation' | 'funding' | 'concept_note';
  description: string;
  content: Record<string, any>;
  category: string;
  tags: string[];
  isDefault?: boolean;
  usage_count?: number;
}

export const defaultTemplates: SubmissionTemplate[] = [
  {
    id: 'project-infrastructure',
    name: 'Projet d\'Infrastructure',
    type: 'project',
    description: 'Template pour les projets d\'infrastructure de télécommunications',
    category: 'Infrastructure',
    tags: ['infrastructure', 'télécommunications', 'réseau'],
    content: {
      title: '',
      country: '',
      description: 'Ce projet vise à améliorer l\'infrastructure de télécommunications dans la région de...',
      budget: '',
      start_date: '',
      end_date: '',
      kpis: [
        'Nombre de nouveaux points d\'accès installés',
        'Amélioration de la couverture réseau (%)',
        'Réduction du temps de latence',
        'Nombre d\'utilisateurs impactés'
      ],
      objectives: [
        'Étendre la couverture réseau dans les zones rurales',
        'Améliorer la qualité du service',
        'Réduire la fracture numérique'
      ],
      methodology: 'Phase 1: Étude de faisabilité\nPhase 2: Déploiement pilote\nPhase 3: Déploiement complet\nPhase 4: Évaluation et optimisation',
      risks: [
        'Retards dans les autorisations réglementaires',
        'Conditions météorologiques défavorables',
        'Disponibilité des équipements'
      ],
      stakeholders: [
        'Ministère des Télécommunications',
        'Opérateurs télécoms locaux',
        'Communautés locales',
        'Fournisseurs d\'équipements'
      ]
    },
    isDefault: true,
  },
  {
    id: 'project-digital-inclusion',
    name: 'Inclusion Numérique',
    type: 'project',
    description: 'Template pour les projets d\'inclusion numérique et d\'alphabétisation digitale',
    category: 'Social',
    tags: ['inclusion', 'formation', 'digital'],
    content: {
      title: '',
      country: '',
      description: 'Initiative visant à réduire la fracture numérique par la formation et l\'accès facilité aux technologies...',
      budget: '',
      start_date: '',
      end_date: '',
      kpis: [
        'Nombre de personnes formées',
        'Taux de réussite des formations',
        'Nombre de centres d\'accès créés',
        'Impact sur l\'emploi local'
      ],
      target_audience: 'Populations rurales, personnes âgées, femmes, jeunes sans emploi',
      training_modules: [
        'Utilisation de base des smartphones',
        'Navigation internet et recherche d\'information',
        'Services gouvernementaux en ligne',
        'Commerce électronique et paiements numériques'
      ],
      partnerships: [
        'ONGs locales',
        'Établissements éducatifs',
        'Bibliothèques publiques',
        'Centres communautaires'
      ]
    },
    isDefault: true,
  },
  {
    id: 'position-net-neutrality',
    name: 'Position sur la Neutralité du Net',
    type: 'position',
    description: 'Template pour les positions officielles sur la neutralité du net',
    category: 'Réglementation',
    tags: ['neutralité', 'internet', 'réglementation'],
    content: {
      subject: 'Position officielle concernant la neutralité du net',
      context: 'Dans le cadre des discussions sur la régulation d\'internet et l\'égalité d\'accès aux services numériques...',
      position: 'Notre organisation soutient le principe de neutralité du net qui garantit...',
      justification: [
        'Garantie de l\'égalité d\'accès à l\'information',
        'Protection de l\'innovation et de la concurrence',
        'Préservation des droits des consommateurs',
        'Promotion du développement économique équitable'
      ],
      legal_framework: 'Basé sur les recommandations de l\'UIT et les meilleures pratiques internationales...',
      implementation_measures: [
        'Interdiction du blocage de contenu légal',
        'Prohibition de la limitation arbitraire de vitesse',
        'Transparence des pratiques de gestion de trafic',
        'Mécanismes de recours pour les utilisateurs'
      ],
      monitoring: 'Mise en place d\'un système de surveillance et de rapports périodiques...'
    },
    isDefault: true,
  },
  {
    id: 'funding-rural-connectivity',
    name: 'Financement Connectivité Rurale',
    type: 'funding',
    description: 'Template pour les demandes de financement de projets de connectivité rurale',
    category: 'Financement',
    tags: ['rural', 'connectivité', 'financement'],
    content: {
      project_title: '',
      total_budget: '',
      requested_amount: '',
      funding_period: '',
      project_summary: 'Ce projet vise à améliorer la connectivité dans les zones rurales de...',
      problem_statement: 'Les zones rurales font face à un manque d\'accès aux services de télécommunications...',
      solution_approach: 'Déploiement d\'infrastructure de télécommunications adaptée aux défis ruraux...',
      expected_outcomes: [
        'Connexion de X villages',
        'Amélioration de l\'accès aux services de santé',
        'Facilitation de l\'éducation à distance',
        'Développement économique local'
      ],
      budget_breakdown: {
        'Infrastructure et équipements': '60%',
        'Formation et renforcement des capacités': '20%',
        'Gestion de projet': '10%',
        'Maintenance et support': '10%'
      },
      sustainability_plan: 'Modèle économique basé sur les revenus des services et le support communautaire...',
      risk_mitigation: [
        'Engagement communautaire fort',
        'Partenariats avec opérateurs locaux',
        'Plan de maintenance préventive',
        'Formation de techniciens locaux'
      ]
    },
    isDefault: true,
  },
  {
    id: 'concept-note-default',
    name: 'Note conceptuelle - Modèle SUTEL',
    type: 'concept_note',
    description: 'Structure standard pour rédiger une note conceptuelle',
    category: 'Outils',
    tags: ['note conceptuelle', 'présentation', 'outil'],
    content: {
      title: 'Amélioration de la connectivité et des services numériques',
      subject: 'Accélérer l\'accès équitable aux services numériques pour les populations prioritaires',
      context: 'Le développement des services numériques est un levier de croissance... ',
      objectives: [
        'Réduire la fracture numérique dans les zones rurales',
        'Améliorer la qualité de service (QoS) des opérateurs',
        'Renforcer les capacités des usagers et administrations'
      ],
      audience: 'Décideurs SUTEL, partenaires techniques et financiers, ministères sectoriels',
      scope: [
        'Couverture réseau 4G/5G zones prioritaires',
        'Inclusion et alphabétisation numérique',
        'Interopérabilité et services publics numériques'
      ],
      budget: 'Estimation préliminaire: 1,2 milliard FCFA (CAPEX/OPEX)',
      outcomes: [
        'Hausse de 20% de la couverture dans 12 mois',
        'Création de 50 centres d\'accès communautaires',
        'Amélioration de 30% des indicateurs de QoS'
      ],
      indicators: [
        'Taux de couverture',
        'Temps de latence',
        'Taux d\'adoption des services',
        'Nombre de bénéficiaires'
      ],
      timeline: [
        'T1: cadrage et études',
        'T2: pilotes et partenariats',
        'T3: déploiement',
        'T4: évaluation et passage à l\'échelle'
      ],
      risks: [
        'Retards d\'approvisionnement',
        'Contraintes réglementaires',
        'Adhésion communautaire variable'
      ],
      decisions: 'Validation du périmètre, arbitrage budgétaire, mandat pour partenariats',
    },
    isDefault: true,
  }
];

export class SubmissionTemplateService {
  private templates: SubmissionTemplate[] = [...defaultTemplates];

  getTemplates(type?: string): SubmissionTemplate[] {
    if (type) {
      return this.templates.filter(template => template.type === type);
    }
    return this.templates;
  }

  getTemplateById(id: string): SubmissionTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  getTemplatesByCategory(category: string): SubmissionTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  searchTemplates(query: string): SubmissionTemplate[] {
    const lowercaseQuery = query.toLowerCase();
    return this.templates.filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  getCategories(): string[] {
    return [...new Set(this.templates.map(template => template.category))];
  }

  incrementUsage(templateId: string): void {
    const template = this.templates.find(t => t.id === templateId);
    if (template) {
      template.usage_count = (template.usage_count || 0) + 1;
    }
  }

  getPopularTemplates(limit: number = 5): SubmissionTemplate[] {
    return [...this.templates]
      .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
      .slice(0, limit);
  }

  createCustomTemplate(template: Omit<SubmissionTemplate, 'id'>): SubmissionTemplate {
    const newTemplate: SubmissionTemplate = {
      ...template,
      id: `custom-${Date.now()}`,
      usage_count: 0,
    };
    
    this.templates.push(newTemplate);
    return newTemplate;
  }

  updateTemplate(id: string, updates: Partial<SubmissionTemplate>): SubmissionTemplate | null {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.templates[index] = { ...this.templates[index], ...updates };
    return this.templates[index];
  }

  deleteTemplate(id: string): boolean {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.templates.splice(index, 1);
    return true;
  }
}

export const submissionTemplateService = new SubmissionTemplateService();