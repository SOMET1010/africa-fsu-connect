
import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Filter, Search, Download, RefreshCw } from "lucide-react";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernCard } from "@/components/ui/modern-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { cn } from "@/lib/utils";

// Type-safe data row interface
interface DataRow {
  [key: string]: unknown;
}

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: unknown, row: DataRow) => React.ReactNode;
}

interface ModernDataTableProps {
  data: DataRow[];
  columns: Column[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  searchPlaceholder?: string;
  className?: string;
}

export function ModernDataTable({
  data,
  columns,
  loading = false,
  title,
  subtitle,
  onRefresh,
  onExport,
  searchPlaceholder = "Rechercher...",
  className
}: ModernDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onRefresh && (
              <ModernButton variant="outline" onClick={onRefresh} loading={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </ModernButton>
            )}
            
            {onExport && (
              <ModernButton variant="outline" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </ModernButton>
            )}
          </div>
        </div>
      )}

      {/* Search and Stats */}
      <GlassCard variant="subtle" className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <ModernButton variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </ModernButton>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <AnimatedCounter value={filteredAndSortedData.length} className="mr-1" />
              résultats
            </Badge>
            
            <Badge variant="secondary" className="bg-muted/50">
              Page {currentPage} sur {totalPages}
            </Badge>
          </div>
        </div>
      </GlassCard>

      {/* Table */}
      <ModernCard variant="glass">
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={cn(
                        "px-6 py-4 text-left font-semibold text-foreground",
                        column.width && `w-${column.width}`,
                        column.sortable && "cursor-pointer hover:bg-muted/30 transition-colors"
                      )}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && getSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody>
                {loading ? (
                  Array.from({ length: pageSize }).map((_, index) => (
                    <tr key={index} className="border-b border-border/30">
                      {columns.map((column) => (
                        <td key={column.key} className="px-6 py-4">
                          <div className="h-4 bg-muted/50 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  paginatedData.map((row, index) => (
                    <tr 
                      key={index}
                      className="border-b border-border/30 hover:bg-muted/30 transition-colors group"
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="px-6 py-4 text-sm">
                          {column.render ? 
                            column.render(row[column.key], row) : 
                            String(row[column.key] ?? '')
                          }
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Affichage {(currentPage - 1) * pageSize + 1} à{' '}
                {Math.min(currentPage * pageSize, filteredAndSortedData.length)} sur{' '}
                {filteredAndSortedData.length} résultats
              </div>
              
              <div className="flex items-center gap-2">
                <ModernButton
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </ModernButton>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <ModernButton
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </ModernButton>
                  );
                })}
                
                <ModernButton
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </ModernButton>
              </div>
            </div>
          </div>
        )}
      </ModernCard>
    </div>
  );
}
