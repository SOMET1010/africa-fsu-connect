import React, { memo, useMemo, useState, useCallback } from 'react';
import { VirtualizedList } from './VirtualizedList';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

interface PerformantTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchable?: boolean;
  virtualizedThreshold?: number;
  className?: string;
  onRowClick?: (item: T) => void;
}

function PerformantTableComponent<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 50,
  searchable = true,
  virtualizedThreshold = 100,
  className,
  onRowClick
}: PerformantTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Mémorisation des données filtrées et triées
  const processedData = useMemo(() => {
    let result = [...data];

    // Filtrage
    if (searchTerm) {
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Tri
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortColumn, sortDirection]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = currentPage * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize);
  const useVirtualization = processedData.length > virtualizedThreshold;

  const handleSort = useCallback((column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(0); // Reset à la première page
  }, []);

  const renderRow = useCallback((item: T, index: number) => (
    <TableRow 
      key={index}
      className={cn(
        "hover:bg-muted/50 transition-colors",
        onRowClick && "cursor-pointer"
      )}
      onClick={() => onRowClick?.(item)}
    >
      {columns.map((column) => (
        <TableCell 
          key={String(column.key)}
          style={{ width: column.width }}
        >
          {column.render 
            ? column.render(item[column.key], item)
            : String(item[column.key] || '')
          }
        </TableCell>
      ))}
    </TableRow>
  ), [columns, onRowClick]);

  return (
    <div className={cn("space-y-4", className)}>
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className={cn(
                    column.sortable && "cursor-pointer hover:bg-muted/50",
                    sortColumn === column.key && "bg-muted"
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {useVirtualization ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <VirtualizedList
                    items={paginatedData}
                    itemHeight={50}
                    containerHeight={400}
                    renderItem={renderRow}
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => renderRow(item, index))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} sur {totalPages} ({processedData.length} éléments)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export const PerformantTable = memo(PerformantTableComponent) as typeof PerformantTableComponent;