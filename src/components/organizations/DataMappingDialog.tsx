import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, ArrowRight, Database, Target } from "lucide-react";

interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
  required: boolean;
}

interface DataMappingConfig {
  projects: FieldMapping[];
  resources: FieldMapping[];
  news: FieldMapping[];
}

interface DataMappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sampleData?: any;
  currentMapping?: DataMappingConfig;
  onSave: (mapping: DataMappingConfig) => void;
}

const defaultProjectFields = [
  { key: 'title', label: 'Titre', required: true },
  { key: 'description', label: 'Description', required: false },
  { key: 'budget', label: 'Budget', required: false },
  { key: 'status', label: 'Statut', required: false },
  { key: 'start_date', label: 'Date de début', required: false },
  { key: 'end_date', label: 'Date de fin', required: false },
  { key: 'location', label: 'Localisation', required: false },
  { key: 'beneficiaries', label: 'Bénéficiaires', required: false }
];

const defaultResourceFields = [
  { key: 'title', label: 'Titre', required: true },
  { key: 'description', label: 'Description', required: false },
  { key: 'resource_type', label: 'Type de ressource', required: true },
  { key: 'file_url', label: 'URL du fichier', required: false },
  { key: 'file_size', label: 'Taille du fichier', required: false },
  { key: 'mime_type', label: 'Type MIME', required: false }
];

const defaultNewsFields = [
  { key: 'title', label: 'Titre', required: true },
  { key: 'description', label: 'Description', required: false },
  { key: 'content', label: 'Contenu', required: false },
  { key: 'published_date', label: 'Date de publication', required: false },
  { key: 'author', label: 'Auteur', required: false }
];

const transformationOptions = [
  { value: 'none', label: 'Aucune' },
  { value: 'uppercase', label: 'MAJUSCULES' },
  { value: 'lowercase', label: 'minuscules' },
  { value: 'capitalize', label: 'Première lettre majuscule' },
  { value: 'trim', label: 'Supprimer les espaces' },
  { value: 'number', label: 'Convertir en nombre' },
  { value: 'date', label: 'Convertir en date' },
  { value: 'currency', label: 'Format monétaire' }
];

export function DataMappingDialog({ 
  open, 
  onOpenChange, 
  sampleData, 
  currentMapping, 
  onSave 
}: DataMappingDialogProps) {
  const { toast } = useToast();
  const [mapping, setMapping] = useState<DataMappingConfig>({
    projects: [],
    resources: [],
    news: []
  });

  const [sourceFields, setSourceFields] = useState<string[]>([]);

  useEffect(() => {
    if (currentMapping) {
      setMapping(currentMapping);
    }
  }, [currentMapping]);

  useEffect(() => {
    if (sampleData) {
      // Extraire les champs des données d'exemple
      const fields = new Set<string>();
      
      const extractFields = (obj: any, prefix = '') => {
        Object.keys(obj || {}).forEach(key => {
          const fieldName = prefix ? `${prefix}.${key}` : key;
          fields.add(fieldName);
          
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            extractFields(obj[key], fieldName);
          }
        });
      };

      if (sampleData.projects?.length > 0) {
        extractFields(sampleData.projects[0]);
      }
      if (sampleData.resources?.length > 0) {
        extractFields(sampleData.resources[0]);
      }
      if (sampleData.news?.length > 0) {
        extractFields(sampleData.news[0]);
      }

      setSourceFields(Array.from(fields));
    }
  }, [sampleData]);

  const addMapping = (type: keyof DataMappingConfig, sourceField: string, targetField: string) => {
    if (!sourceField || !targetField) return;

    const existingMapping = mapping[type].find(m => m.targetField === targetField);
    if (existingMapping) {
      toast({
        title: "Champ déjà mappé",
        description: "Ce champ cible est déjà utilisé",
        variant: "destructive"
      });
      return;
    }

    const targetFieldConfig = getTargetFieldConfig(type, targetField);
    
    setMapping(prev => ({
      ...prev,
      [type]: [...prev[type], {
        sourceField,
        targetField,
        transformation: 'none',
        required: targetFieldConfig?.required || false
      }]
    }));
  };

  const removeMapping = (type: keyof DataMappingConfig, index: number) => {
    setMapping(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const updateMapping = (
    type: keyof DataMappingConfig, 
    index: number, 
    field: keyof FieldMapping, 
    value: any
  ) => {
    setMapping(prev => ({
      ...prev,
      [type]: prev[type].map((mapping, i) => 
        i === index ? { ...mapping, [field]: value } : mapping
      )
    }));
  };

  const getTargetFieldConfig = (type: keyof DataMappingConfig, targetField: string) => {
    const fieldSets = {
      projects: defaultProjectFields,
      resources: defaultResourceFields,
      news: defaultNewsFields
    };
    
    return fieldSets[type].find(field => field.key === targetField);
  };

  const getAvailableTargetFields = (type: keyof DataMappingConfig) => {
    const fieldSets = {
      projects: defaultProjectFields,
      resources: defaultResourceFields,
      news: defaultNewsFields
    };
    
    const usedFields = mapping[type].map(m => m.targetField);
    return fieldSets[type].filter(field => !usedFields.includes(field.key));
  };

  const handleSave = () => {
    // Validation
    const requiredFieldsValidation = Object.entries(mapping).every(([type, mappings]) => {
      const fieldSets = {
        projects: defaultProjectFields,
        resources: defaultResourceFields,
        news: defaultNewsFields
      };
      
      const requiredFields = fieldSets[type as keyof DataMappingConfig]
        .filter(field => field.required)
        .map(field => field.key);
      
      const mappedFields = mappings.map(m => m.targetField);
      
      return requiredFields.every(field => mappedFields.includes(field));
    });

    if (!requiredFieldsValidation) {
      toast({
        title: "Mapping incomplet",
        description: "Certains champs obligatoires ne sont pas mappés",
        variant: "destructive"
      });
      return;
    }

    onSave(mapping);
    onOpenChange(false);
    
    toast({
      title: "Mapping sauvegardé",
      description: "La configuration de mapping a été enregistrée"
    });
  };

  const renderMappingTab = (type: keyof DataMappingConfig, title: string) => {
    const availableTargetFields = getAvailableTargetFields(type);
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="outline">
            {mapping[type].length} champ(s) mappé(s)
          </Badge>
        </div>

        {/* Mappings existants */}
        <div className="space-y-2">
          {mapping[type].map((fieldMapping, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{fieldMapping.sourceField}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 text-center">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{fieldMapping.targetField}</span>
                      {fieldMapping.required && (
                        <Badge variant="destructive" className="text-xs">Requis</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-span-3">
                    <Select
                      value={fieldMapping.transformation}
                      onValueChange={(value) => updateMapping(type, index, 'transformation', value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {transformationOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMapping(type, index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ajouter un nouveau mapping */}
        {availableTargetFields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ajouter un mapping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Champ source</Label>
                  <Select onValueChange={(sourceField) => {
                    const targetField = availableTargetFields[0]?.key;
                    if (targetField) {
                      addMapping(type, sourceField, targetField);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un champ source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceFields.map(field => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Champs disponibles */}
        <div>
          <Label className="text-sm font-medium">Champs cibles disponibles</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {availableTargetFields.map(field => (
              <Badge 
                key={field.key} 
                variant={field.required ? "destructive" : "secondary"}
                className="text-xs"
              >
                {field.label}
                {field.required && " *"}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuration du mapping de données</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="resources">Ressources</TabsTrigger>
            <TabsTrigger value="news">Actualités</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            {renderMappingTab('projects', 'Mapping des projets')}
          </TabsContent>

          <TabsContent value="resources">
            {renderMappingTab('resources', 'Mapping des ressources')}
          </TabsContent>

          <TabsContent value="news">
            {renderMappingTab('news', 'Mapping des actualités')}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Sauvegarder le mapping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}