import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ConfigSection } from './ConfigSection';
import { Building2 } from 'lucide-react';
import type { PlatformIdentity } from '@/types/platformConfig';

interface IdentitySectionProps {
  identity: PlatformIdentity;
  onChange: (identity: PlatformIdentity) => void;
}

export const IdentitySection = ({ identity, onChange }: IdentitySectionProps) => {
  const handleChange = (field: keyof PlatformIdentity, value: string) => {
    onChange({ ...identity, [field]: value });
  };

  const isComplete = !!(identity.platformName && identity.url && identity.slogan);

  return (
    <ConfigSection
      title="Identité de la plateforme"
      description="Informations générales et branding"
      icon={<Building2 className="h-5 w-5" />}
      isComplete={isComplete}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="platformName">Nom de la plateforme *</Label>
          <Input
            id="platformName"
            value={identity.platformName}
            onChange={(e) => handleChange('platformName', e.target.value)}
            placeholder="SUTEL Nexus"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="acronym">Acronyme</Label>
          <Input
            id="acronym"
            value={identity.acronym}
            onChange={(e) => handleChange('acronym', e.target.value)}
            placeholder="SUTEL"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="slogan">Slogan / Tagline *</Label>
          <Textarea
            id="slogan"
            value={identity.slogan}
            onChange={(e) => handleChange('slogan', e.target.value)}
            placeholder="Connecter les régulateurs africains du service universel"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">URL de la plateforme *</Label>
          <Input
            id="url"
            type="url"
            value={identity.url}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://sutel-nexus.org"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoUrl">URL du logo</Label>
          <Input
            id="logoUrl"
            type="url"
            value={identity.logoUrl}
            onChange={(e) => handleChange('logoUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryColor">Couleur primaire</Label>
          <div className="flex gap-2">
            <Input
              id="primaryColor"
              type="color"
              value={identity.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="w-16 h-10 p-1 cursor-pointer"
            />
            <Input
              value={identity.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              placeholder="#1E3A5F"
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryColor">Couleur secondaire</Label>
          <div className="flex gap-2">
            <Input
              id="secondaryColor"
              type="color"
              value={identity.secondaryColor}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
              className="w-16 h-10 p-1 cursor-pointer"
            />
            <Input
              value={identity.secondaryColor}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
              placeholder="#10B981"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </ConfigSection>
  );
};
