import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';
import type { TranslationRow } from '@/utils/export-translations';

interface TranslationsTableProps {
  data: TranslationRow[];
}

export const TranslationsTable = ({ data }: TranslationsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'complete' | 'incomplete'>('all');

  // Get unique sections
  const sections = useMemo(() => {
    const sectionSet = new Set(data.map(row => row.section));
    return Array.from(sectionSet).sort();
  }, [data]);

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter(row => {
      const matchesSearch = 
        row.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.en.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSection = sectionFilter === 'all' || row.section === sectionFilter;
      
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'complete' && row.completeness === 100) ||
        (statusFilter === 'incomplete' && row.completeness < 100);
      
      return matchesSearch && matchesSection && matchesStatus;
    });
  }, [data, searchTerm, sectionFilter, statusFilter]);

  const getCompletenessColor = (completeness: number) => {
    if (completeness === 100) return 'bg-green-500/10 text-green-600 border-green-200';
    if (completeness >= 75) return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
    if (completeness >= 50) return 'bg-orange-500/10 text-orange-600 border-orange-200';
    return 'bg-red-500/10 text-red-600 border-red-200';
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return <span className="text-muted-foreground italic">—</span>;
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par clé ou contenu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={sectionFilter} onValueChange={setSectionFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les sections</SelectItem>
            {sections.map(section => (
              <SelectItem key={section} value={section}>{section}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="complete">Complètes (100%)</SelectItem>
            <SelectItem value="incomplete">Incomplètes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredData.length} traduction{filteredData.length > 1 ? 's' : ''} trouvée{filteredData.length > 1 ? 's' : ''}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[250px]">Clé</TableHead>
                <TableHead>🇫🇷 Français</TableHead>
                <TableHead>🇬🇧 Anglais</TableHead>
                <TableHead>🇵🇹 Portugais</TableHead>
                <TableHead>🇸🇦 Arabe</TableHead>
                <TableHead className="w-[100px]">Section</TableHead>
                <TableHead className="w-[100px] text-center">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.key} className={row.completeness < 100 ? 'bg-orange-50/50' : ''}>
                  <TableCell className="font-mono text-xs break-all">
                    {row.key}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {truncateText(row.fr)}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {truncateText(row.en)}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {row.pt ? (
                      truncateText(row.pt)
                    ) : (
                      <div className="flex items-center gap-1 text-orange-500">
                        <AlertCircle className="h-3 w-3" />
                        <span className="text-xs">Manquant</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px]" dir="rtl">
                    {row.ar ? (
                      truncateText(row.ar)
                    ) : (
                      <div className="flex items-center gap-1 text-orange-500" dir="ltr">
                        <AlertCircle className="h-3 w-3" />
                        <span className="text-xs">Manquant</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {row.section}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {row.completeness === 100 ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    ) : (
                      <Badge className={getCompletenessColor(row.completeness)}>
                        {row.completeness}%
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};
