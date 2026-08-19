import { createContext, useContext } from 'react';

export const FiltersContext = createContext(null);

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters must be used inside FiltersProvider');
  return ctx;
}
