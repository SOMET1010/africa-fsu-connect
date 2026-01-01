import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { logger } from '@/utils/logger';

interface ExportProgress {
  current: number;
  total: number;
  status: string;
}

export async function exportToPDFAdvanced(
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  try {
    onProgress?.({ current: 0, total: 10, status: 'Préparation...' });

    // A4 landscape dimensions in mm
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Hide controls before capture
    const controls = document.querySelectorAll('.hide-on-export, .presentation-controls');
    controls.forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });

    // Force light theme for printing
    const originalTheme = document.documentElement.classList.contains('dark');
    if (originalTheme) {
      document.documentElement.classList.remove('dark');
    }

    onProgress?.({ current: 1, total: 10, status: 'Création de la page de couverture...' });

    // Cover page
    pdf.setFillColor(16, 185, 129); // Primary color
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(32);
    pdf.text('SUTEL PLATFORM', pageWidth / 2, pageHeight / 3, { align: 'center' });
    
    pdf.setFontSize(18);
    pdf.text("L'Avenir des Télécommunications Africaines", pageWidth / 2, pageHeight / 2, { align: 'center' });
    
    pdf.setFontSize(12);
    const date = new Date().toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    pdf.text(date, pageWidth / 2, pageHeight * 2 / 3, { align: 'center' });

    // Table of contents
    pdf.addPage();
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(24);
    pdf.text('Table des Matières', 20, 30);

    const sections = [
      'Vision SUTEL Afrique',
      'Impact Régional',
      'Calculateur ROI',
      'Démonstration Interactive',
      'Architecture Technique',
      'Preuves & Résultats',
      'Sécurité & Conformité',
      'Rejoignez-Nous'
    ];

    pdf.setFontSize(12);
    sections.forEach((section, index) => {
      pdf.text(`${index + 1}. ${section}`, 30, 50 + index * 10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Page ${index + 3}`, pageWidth - 40, 50 + index * 10);
      pdf.setTextColor(0, 0, 0);
    });

    onProgress?.({ current: 2, total: 10, status: 'Capture des sections...' });

    // Capture each section
    const sectionElements = document.querySelectorAll('.presentation-section');
    
    for (let i = 0; i < sectionElements.length; i++) {
      const element = sectionElements[i] as HTMLElement;
      
      onProgress?.({
        current: 3 + i,
        total: 10,
        status: `Capture section ${i + 1}/${sectionElements.length}...`
      });

      // Ensure all images and charts are loaded
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      
      pdf.addPage();
      
      // Calculate dimensions to fit page while maintaining aspect ratio
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (imgHeight > pageHeight - 30) {
        const ratio = (pageHeight - 30) / imgHeight;
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;
        pdf.addImage(imgData, 'JPEG', (pageWidth - finalWidth) / 2, 15, finalWidth, finalHeight);
      } else {
        pdf.addImage(imgData, 'JPEG', 10, 15, imgWidth, imgHeight);
      }

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`SUTEL Platform - ${date}`, 20, pageHeight - 10);
      pdf.text(`Page ${i + 3}`, pageWidth - 30, pageHeight - 10);
    }

    // Restore controls
    controls.forEach((el) => {
      (el as HTMLElement).style.display = '';
    });

    // Restore theme
    if (originalTheme) {
      document.documentElement.classList.add('dark');
    }

    onProgress?.({ current: 10, total: 10, status: 'Finalisation...' });

    // Save PDF
    pdf.save(`sutel-presentation-${Date.now()}.pdf`);

  } catch (error) {
    logger.error('Error generating PDF', error);
    throw error;
  }
}

export async function exportToPowerPoint(): Promise<void> {
  // Placeholder for PowerPoint export
  // Would use pptxgenjs library
  throw new Error('PowerPoint export not yet implemented');
}
