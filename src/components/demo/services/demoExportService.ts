export class DemoExportService {
  static exportToPDF(): void {
    // Pour l'instant, utiliser l'impression du navigateur
    // Dans une version future, on pourrait utiliser une bibliothèque comme jsPDF
    window.print();
  }

  static exportToMarkdown(steps: any[], completedSteps: string[]): string {
    let content = '# Guide de Démonstration Interactive\n\n';
    content += '**Plateforme UDC - Scénario Marie Diallo**\n\n';
    
    steps.forEach((step, index) => {
      const completed = completedSteps.includes(step.id) ? '✅' : '⏳';
      content += `## ${completed} Étape ${index + 1}: ${step.title}\n\n`;
      content += `**Durée:** ${step.duration} minutes\n`;
      content += `**Route:** ${step.route}\n\n`;
      content += `${step.description}\n\n`;
      
      content += '### Actions à réaliser:\n';
      step.actions.forEach((action: string, i: number) => {
        content += `${i + 1}. ${action}\n`;
      });
      
      content += '\n### Points clés:\n';
      step.keyPoints.forEach((point: string) => {
        content += `- ${point}\n`;
      });
      
      content += `\n**Message assistant:** ${step.assistantMessage}\n\n---\n\n`;
    });
    
    return content;
  }

  static downloadAsFile(content: string, filename: string, type: string = 'text/markdown'): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}