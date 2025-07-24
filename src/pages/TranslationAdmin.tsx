import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslationAdmin } from '@/hooks/useTranslationDb';
import { migrateTranslations } from '@/services/translationMigration';
import { toast } from 'sonner';
import { Loader2, Upload, Download, Search, Plus } from 'lucide-react';

interface Translation {
  id: string;
  key: string;
  value: string;
  context?: string;
  is_approved: boolean;
  language: { code: string; name: string };
  namespace: { name: string };
}

const TranslationAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedNamespace, setSelectedNamespace] = useState<string>('all');
  const [newTranslation, setNewTranslation] = useState({
    key: '',
    value: '',
    context: '',
    language: '',
    namespace: ''
  });
  
  const queryClient = useQueryClient();
  const { addTranslation, getMissingTranslations } = useTranslationAdmin();

  // Fetch languages
  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const { data } = await supabase.from('languages').select('*').eq('is_active', true);
      return data || [];
    }
  });

  // Fetch namespaces
  const { data: namespaces } = useQuery({
    queryKey: ['namespaces'],
    queryFn: async () => {
      const { data } = await supabase.from('translation_namespaces').select('*');
      return data || [];
    }
  });

  // Fetch translations
  const { data: translations, isLoading } = useQuery({
    queryKey: ['admin-translations', selectedLanguage, selectedNamespace],
    queryFn: async (): Promise<Translation[]> => {
      let query = supabase
        .from('translations')
        .select(`
          *,
          languages:language_id(code, name),
          translation_namespaces:namespace_id(name)
        `);

      if (selectedLanguage !== 'all') {
        query = query.eq('languages.code', selectedLanguage);
      }
      
      if (selectedNamespace !== 'all') {
        query = query.eq('translation_namespaces.name', selectedNamespace);
      }

      const { data } = await query.order('key');
      return data?.map((item: any) => ({
        ...item,
        language: item.languages,
        namespace: item.translation_namespaces
      })) || [];
    }
  });

  // Migration mutation
  const migrationMutation = useMutation({
    mutationFn: migrateTranslations,
    onSuccess: () => {
      toast.success('Translations migrated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-translations'] });
    },
    onError: (error) => {
      toast.error(`Migration failed: ${error.message}`);
    }
  });

  // Add translation mutation
  const addMutation = useMutation({
    mutationFn: () => addTranslation(
      newTranslation.language,
      newTranslation.namespace,
      newTranslation.key,
      newTranslation.value,
      newTranslation.context
    ),
    onSuccess: () => {
      toast.success('Translation added successfully!');
      setNewTranslation({ key: '', value: '', context: '', language: '', namespace: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-translations'] });
    },
    onError: (error) => {
      toast.error(`Failed to add translation: ${error.message}`);
    }
  });

  // Filter translations based on search
  const filteredTranslations = translations?.filter(t => 
    t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.value.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddTranslation = () => {
    if (!newTranslation.key || !newTranslation.value || !newTranslation.language || !newTranslation.namespace) {
      toast.error('Please fill all required fields');
      return;
    }
    addMutation.mutate();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Translation Management</h1>
          <p className="text-muted-foreground">Manage multilingual content for the application</p>
        </div>
        <Button 
          onClick={() => migrationMutation.mutate()}
          disabled={migrationMutation.isPending}
          variant="outline"
        >
          {migrationMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Migrate Static Translations
        </Button>
      </div>

      <Tabs defaultValue="translations" className="w-full">
        <TabsList>
          <TabsTrigger value="translations">Translations</TabsTrigger>
          <TabsTrigger value="add">Add Translation</TabsTrigger>
          <TabsTrigger value="missing">Missing Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="translations" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search translations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {languages?.map(lang => (
                      <SelectItem key={lang.id} value={lang.code}>
                        {lang.native_name} ({lang.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedNamespace} onValueChange={setSelectedNamespace}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select namespace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Namespaces</SelectItem>
                    {namespaces?.map(ns => (
                      <SelectItem key={ns.id} value={ns.name}>
                        {ns.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Translations List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Translations ({filteredTranslations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTranslations.map(translation => (
                    <div key={translation.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-mono text-sm font-medium">{translation.key}</div>
                          <div className="text-sm">{translation.value}</div>
                          {translation.context && (
                            <div className="text-xs text-muted-foreground">
                              Context: {translation.context}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={translation.is_approved ? 'default' : 'secondary'}>
                            {translation.language.code.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {translation.namespace.name}
                          </Badge>
                          {translation.is_approved ? (
                            <Badge variant="default">Approved</Badge>
                          ) : (
                            <Badge variant="destructive">Pending</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Translation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Translation Key *</label>
                  <Input
                    value={newTranslation.key}
                    onChange={(e) => setNewTranslation(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="e.g., nav.dashboard"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Language *</label>
                  <Select 
                    value={newTranslation.language} 
                    onValueChange={(value) => setNewTranslation(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages?.map(lang => (
                        <SelectItem key={lang.id} value={lang.code}>
                          {lang.native_name} ({lang.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Namespace *</label>
                  <Select 
                    value={newTranslation.namespace} 
                    onValueChange={(value) => setNewTranslation(prev => ({ ...prev, namespace: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select namespace" />
                    </SelectTrigger>
                    <SelectContent>
                      {namespaces?.map(ns => (
                        <SelectItem key={ns.id} value={ns.name}>
                          {ns.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Translation Value *</label>
                <Textarea
                  value={newTranslation.value}
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Enter the translated text"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Context (Optional)</label>
                <Input
                  value={newTranslation.context}
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, context: e.target.value }))}
                  placeholder="Additional context for translators"
                />
              </div>

              <Button 
                onClick={handleAddTranslation}
                disabled={addMutation.isPending}
                className="w-full"
              >
                {addMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add Translation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missing">
          <Card>
            <CardHeader>
              <CardTitle>Missing Translation Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This feature will show missing translation keys across different languages.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TranslationAdmin;