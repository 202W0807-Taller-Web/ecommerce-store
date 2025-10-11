import { createContext } from 'react';
import type { Atributo } from '../types';

export interface AtributosContextType {
  atributos: Atributo[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const AtributosContext = createContext<AtributosContextType | undefined>(undefined);
