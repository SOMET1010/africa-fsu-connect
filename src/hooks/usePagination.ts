import { useMemo, useCallback, useState, useRef, useEffect } from 'react';

interface PaginationOptions {
  pageSize?: number;
  initialPage?: number;
  totalItems?: number;
}

export interface PaginatedResult<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  paginatedData: T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
}

/**
 * Hook pour la pagination optimisée avec mémorisation
 */
export function usePagination<T>(
  data: T[], 
  options: PaginationOptions = {}
): PaginatedResult<T> {
  const { 
    pageSize: initialPageSize = 10, 
    initialPage = 0,
    totalItems: externalTotalItems
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  
  // Reset page when data changes significantly
  const prevDataLengthRef = useRef(data.length);
  useEffect(() => {
    if (Math.abs(data.length - prevDataLengthRef.current) > pageSize) {
      setCurrentPage(0);
    }
    prevDataLengthRef.current = data.length;
  }, [data.length, pageSize]);

  const totalItems = externalTotalItems ?? data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Mémorisation des données paginées
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  // Callbacks optimisés
  const goToPage = useCallback((page: number) => {
    const clampedPage = Math.max(0, Math.min(page, totalPages - 1));
    setCurrentPage(clampedPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const previousPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    // Adjust current page to maintain roughly the same position
    const currentItemIndex = currentPage * pageSize;
    const newPage = Math.floor(currentItemIndex / size);
    setCurrentPage(newPage);
  }, [currentPage, pageSize]);

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    hasNextPage: currentPage < totalPages - 1,
    hasPreviousPage: currentPage > 0,
    paginatedData,
    goToPage,
    nextPage,
    previousPage,
    setPageSize
  };
}

/**
 * Hook pour la virtualisation de listes avec pagination automatique
 */
export interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  threshold?: number;
}

export function useVirtualizedList<T>(
  data: T[],
  options: VirtualizationOptions
) {
  const { itemHeight, containerHeight, overscan = 5, threshold = 100 } = options;
  
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const shouldVirtualize = data.length > threshold;

  // Calcul de la plage visible
  const visibleRange = useMemo(() => {
    if (!shouldVirtualize) {
      return { start: 0, end: data.length - 1, offset: 0 };
    }

    const visibleStart = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleEnd = Math.min(
      data.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { 
      start: visibleStart, 
      end: visibleEnd, 
      offset: visibleStart * itemHeight 
    };
  }, [scrollTop, itemHeight, containerHeight, data.length, overscan, shouldVirtualize]);

  const visibleItems = useMemo(() => {
    if (!shouldVirtualize) return data;
    return data.slice(visibleRange.start, visibleRange.end + 1);
  }, [data, visibleRange, shouldVirtualize]);

  const totalHeight = shouldVirtualize ? data.length * itemHeight : 'auto';

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    containerRef,
    visibleItems,
    visibleRange,
    totalHeight,
    shouldVirtualize,
    handleScroll,
    scrollTop
  };
}