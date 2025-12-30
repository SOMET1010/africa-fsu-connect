/**
 * Presentation Export Utilities
 * Functions to export presentation to PDF and other formats
 */

// PDF export function using browser print
export const exportToPDF = (presentationTitle: string = "NEXUS Platform Presentation") => {
  // Set document title for PDF
  const originalTitle = document.title;
  document.title = presentationTitle;
  
  // Trigger browser print dialog
  window.print();
  
  // Restore original title after print
  setTimeout(() => {
    document.title = originalTitle;
  }, 100);
};

// Export presentation data as JSON
export const exportToJSON = (sections: any[], currentSection: number) => {
  const exportData = {
    title: "NEXUS Platform Presentation",
    exportDate: new Date().toISOString(),
    currentSection,
    totalSections: sections.length,
    sections: sections.map(s => ({
      id: s.id,
      title: s.title,
    }))
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nexus-presentation-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Copy presentation link with tracking
export const copyPresentationLink = (section?: number) => {
  const url = new URL(window.location.href);
  if (section !== undefined) {
    url.searchParams.set('section', section.toString());
  }
  url.searchParams.set('utm_source', 'share');
  url.searchParams.set('utm_medium', 'link');
  
  return navigator.clipboard.writeText(url.toString());
};

// Generate presentation summary as Markdown
export const exportToMarkdown = (sections: any[]) => {
  let markdown = '# NEXUS Platform - Présentation Executive\n\n';
  markdown += `*Généré le ${new Date().toLocaleDateString('fr-FR')}*\n\n`;
  markdown += '---\n\n';
  
  markdown += '## Table des Matières\n\n';
  sections.forEach((section, index) => {
    markdown += `${index + 1}. [${section.title}](#section-${index + 1})\n`;
  });
  markdown += '\n---\n\n';
  
  sections.forEach((section, index) => {
    markdown += `## Section ${index + 1}: ${section.title} {#section-${index + 1}}\n\n`;
    markdown += `**ID:** \`${section.id}\`\n\n`;
    markdown += '---\n\n';
  });
  
  markdown += '## Contact\n\n';
  markdown += 'Pour plus d\'informations sur NEXUS Platform:\n\n';
  markdown += '- **Email:** contact@nexus-platform.com\n';
  markdown += '- **Site Web:** https://nexus-platform.com\n';
  markdown += '- **Demander une démo:** [Cliquez ici](https://nexus-platform.com/demo)\n';
  
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nexus-presentation-${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
};
