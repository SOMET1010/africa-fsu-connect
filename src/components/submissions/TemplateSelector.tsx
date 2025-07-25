import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, FileText, Star, TrendingUp, Eye, CheckCircle } from 'lucide-react';
import { submissionTemplateService, SubmissionTemplate } from '@/services/submissionTemplateService';

interface TemplateSelectorProps {
  type: 'project' | 'position' | 'regulation' | 'funding';
  onTemplateSelect: (template: SubmissionTemplate) => void;
  selectedTemplateId?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  type,
  onTemplateSelect,
  selectedTemplateId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<SubmissionTemplate | null>(null);

  const allTemplates = useMemo(() => 
    submissionTemplateService.getTemplates(type), 
    [type]
  );

  const categories = useMemo(() => 
    submissionTemplateService.getCategories(), 
    []
  );

  const popularTemplates = useMemo(() => 
    submissionTemplateService.getPopularTemplates().filter(t => t.type === type), 
    [type]
  );

  const filteredTemplates = useMemo(() => {
    let templates = allTemplates;

    // Filter by search query
    if (searchQuery) {
      templates = submissionTemplateService.searchTemplates(searchQuery)
        .filter(t => t.type === type);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      templates = templates.filter(t => t.category === selectedCategory);
    }

    return templates;
  }, [allTemplates, searchQuery, selectedCategory, type]);

  const handleTemplateSelect = (template: SubmissionTemplate) => {
    submissionTemplateService.incrementUsage(template.id);
    onTemplateSelect(template);
  };

  const TemplateCard: React.FC<{ template: SubmissionTemplate; compact?: boolean }> = ({ 
    template, 
    compact = false 
  }) => (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedTemplateId === template.id ? 'ring-2 ring-primary' : ''
      } ${compact ? 'h-32' : ''}`}
      onClick={() => handleTemplateSelect(template)}
    >
      <CardHeader className={compact ? "pb-2" : ""}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={`${compact ? 'text-sm' : 'text-base'} line-clamp-1`}>
              {template.name}
            </CardTitle>
            {!compact && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {template.description}
              </p>
            )}
          </div>
          {selectedTemplateId === template.id && (
            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      
      {!compact && (
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                {template.category}
              </Badge>
              {template.isDefault && (
                <Badge variant="outline" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Recommandé
                </Badge>
              )}
              {(template.usage_count || 0) > 0 && (
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {template.usage_count}
                </Badge>
              )}
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(template);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {template.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-muted px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{template.tags.length - 3}
              </span>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Choisir un Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un template..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="all" className="text-xs">Tous</TabsTrigger>
                {categories.slice(0, 3).map(category => (
                  <TabsTrigger key={category} value={category} className="text-xs">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={selectedCategory} className="space-y-4">
              {/* Popular Templates */}
              {popularTemplates.length > 0 && searchQuery === '' && selectedCategory === 'all' && (
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Templates Populaires
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {popularTemplates.slice(0, 3).map(template => (
                      <TemplateCard key={template.id} template={template} compact />
                    ))}
                  </div>
                </div>
              )}

              {/* All Templates */}
              <div>
                <h3 className="text-sm font-medium mb-3">
                  {searchQuery ? `Résultats (${filteredTemplates.length})` : 'Tous les Templates'}
                </h3>
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun template trouvé</p>
                    {searchQuery && (
                      <p className="text-sm">Essayez un autre terme de recherche</p>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredTemplates.map(template => (
                      <TemplateCard key={template.id} template={template} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Template Preview Dialog */}
      {previewTemplate && (
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{previewTemplate.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">{previewTemplate.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <Badge>{previewTemplate.category}</Badge>
                {previewTemplate.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>

              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Aperçu du contenu :</h4>
                <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {JSON.stringify(previewTemplate.content, null, 2).substring(0, 500)}
                  {JSON.stringify(previewTemplate.content, null, 2).length > 500 && '...'}
                </pre>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => {
                  handleTemplateSelect(previewTemplate);
                  setPreviewTemplate(null);
                }}>
                  Utiliser ce Template
                </Button>
                <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                  Fermer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};