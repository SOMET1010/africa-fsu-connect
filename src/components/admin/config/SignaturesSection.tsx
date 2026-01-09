import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfigSection } from './ConfigSection';
import { PenTool } from 'lucide-react';
import type { ValidationSignature } from '@/types/platformConfig';

interface SignaturesSectionProps {
  signatures: ValidationSignature[];
  onChange: (signatures: ValidationSignature[]) => void;
}

export const SignaturesSection = ({ signatures, onChange }: SignaturesSectionProps) => {
  const handleChange = (index: number, field: keyof ValidationSignature, value: string) => {
    const updated = [...signatures];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const completedCount = signatures.filter(s => s.name).length;
  const isComplete = completedCount === signatures.length;

  return (
    <ConfigSection
      title="Validation et signatures"
      description="Approbation par les parties prenantes"
      icon={<PenTool className="h-5 w-5" />}
      isComplete={isComplete}
    >
      <div className="space-y-6">
        {signatures.map((sig, index) => (
          <div 
            key={index} 
            className="p-4 border border-border/50 rounded-lg space-y-4"
          >
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {sig.role}
            </h4>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input
                  value={sig.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="Prénom Nom"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Organisation</Label>
                <Input
                  value={sig.organization}
                  onChange={(e) => handleChange(index, 'organization', e.target.value)}
                  placeholder="UAT, ANSUT..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Date de signature</Label>
                <Input
                  type="date"
                  value={sig.signedAt || ''}
                  onChange={(e) => handleChange(index, 'signedAt', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        
        <p className="text-sm text-muted-foreground text-center italic">
          Les signatures électroniques seront collectées lors de l'export PDF
        </p>
      </div>
    </ConfigSection>
  );
};
