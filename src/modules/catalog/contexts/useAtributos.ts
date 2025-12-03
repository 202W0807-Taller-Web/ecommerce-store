import { useContext } from 'react';
import { AtributosContext, type AtributosContextType } from './AtributosContext';

/**
 * Hook para acceder al contexto de atributos
 */
export const useAtributos = (): AtributosContextType => {
  const context = useContext(AtributosContext);
  if (context === undefined) {
    throw new Error('useAtributos debe ser usado dentro de un AtributosProvider');
  }
  return context;
};
