import jsPDF from 'jspdf';
import type { PlatformConfiguration } from '@/types/platformConfig';

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Administrateur',
  technical_admin: 'Administrateur Technique',
  content_admin: 'Administrateur Contenu',
  main: 'Partenaire principal',
  pilot: 'Partenaire pilote',
  partner: 'Partenaire',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Actif',
  member: 'Membre',
  onboarding: 'En intégration',
  observer: 'Observateur',
};

export const exportConfigToPDF = (config: PlatformConfiguration): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  const addTitle = (text: string, size: number = 16) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, y);
    y += size * 0.5 + 4;
  };

  const addText = (label: string, value: string, indent: number = 0) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin + indent, y);
    doc.setFont('helvetica', 'normal');
    const labelWidth = doc.getTextWidth(`${label}: `);
    doc.text(value || 'Non renseigné', margin + indent + labelWidth, y);
    y += 6;
    checkPageBreak();
  };

  const addSection = (title: string) => {
    y += 8;
    doc.setDrawColor(30, 58, 95);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    addTitle(title, 14);
  };

  const checkPageBreak = () => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  // Header
  doc.setFillColor(30, 58, 95);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FICHE DE CONFIGURATION', pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Plateforme SUTEL Nexus', pageWidth / 2, 28, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 36, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  y = 55;

  // Section 1: Identité
  addTitle('1. IDENTITÉ DE LA PLATEFORME', 14);
  addText('Nom', config.identity.platformName);
  addText('Acronyme', config.identity.acronym);
  addText('Slogan', config.identity.slogan);
  addText('URL', config.identity.url);
  addText('Couleur primaire', config.identity.primaryColor);
  addText('Couleur secondaire', config.identity.secondaryColor);

  // Section 2: Partenaires
  addSection('2. PARTENAIRES INSTITUTIONNELS');
  config.partners.forEach((partner, i) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`${partner.acronym || `Partenaire ${i + 1}`}`, margin, y);
    y += 6;
    addText('Nom complet', partner.name, 5);
    addText('Rôle', ROLE_LABELS[partner.role] || partner.role, 5);
    addText('Site web', partner.website, 5);
    addText('Contact', partner.contactName, 5);
    addText('Email', partner.contactEmail, 5);
    addText('Téléphone', partner.contactPhone, 5);
    y += 4;
    checkPageBreak();
  });

  // Section 3: Administrateurs
  addSection('3. ADMINISTRATEURS');
  config.admins.forEach((admin) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(ROLE_LABELS[admin.role] || admin.role, margin, y);
    y += 6;
    addText('Nom', `${admin.firstName} ${admin.lastName}`, 5);
    addText('Organisation', admin.organization, 5);
    addText('Email', admin.email, 5);
    addText('Téléphone', admin.phone, 5);
    y += 4;
    checkPageBreak();
  });

  // Section 4: Langues
  addSection('4. LANGUES');
  config.languages.forEach((lang) => {
    const status = lang.enabled ? (lang.isDefault ? '✓ Défaut' : '✓ Activée') : '✗ Désactivée';
    addText(lang.name, status);
  });

  // Section 5: Modules
  addSection('5. MODULES ACTIVÉS');
  config.modules.forEach((module) => {
    const status = module.enabled ? '✓' : '✗';
    addText(`${status} ${module.name}`, module.description);
  });

  // Section 6: Calendrier
  addSection('6. CALENDRIER DE DÉPLOIEMENT');
  config.milestones.forEach((milestone) => {
    const date = milestone.targetDate 
      ? new Date(milestone.targetDate).toLocaleDateString('fr-FR')
      : 'Non planifié';
    addText(milestone.name, date);
  });

  // Section 7: Email
  addSection('7. CONFIGURATION EMAIL');
  addText('Email expéditeur', config.email.senderEmail);
  addText('Nom expéditeur', config.email.senderName);
  addText('Email support', config.email.supportEmail);

  // Section 8: Signatures
  addSection('8. VALIDATION');
  y += 10;
  
  config.signatures.forEach((sig) => {
    checkPageBreak();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(sig.role, margin, y);
    y += 15;
    
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + 60, y);
    y += 5;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(sig.name || 'Nom: _________________', margin, y);
    y += 5;
    doc.text(sig.organization || 'Organisation: _________________', margin, y);
    y += 5;
    doc.text(sig.signedAt ? `Date: ${new Date(sig.signedAt).toLocaleDateString('fr-FR')}` : 'Date: ___/___/______', margin, y);
    y += 15;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `SUTEL Nexus - Fiche de Configuration - Page ${i}/${pageCount}`,
      pageWidth / 2,
      290,
      { align: 'center' }
    );
  }

  // Télécharger
  doc.save(`SUTEL-Configuration-${new Date().toISOString().split('T')[0]}.pdf`);
};
