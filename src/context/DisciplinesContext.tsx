'use client';
import { createContext, useContext } from 'react';
import type { Discipline } from '@/payload-types';
import { sortByCode } from '@/utils/sortByCode';

const DisciplinesContext = createContext<Discipline[]>([]);

export function DisciplinesProvider({
  children,
  disciplines,
}: {
  children: React.ReactNode;
  disciplines: Discipline[];
}) {
  return (
    <DisciplinesContext.Provider value={sortByCode(disciplines)}>
      {children}
    </DisciplinesContext.Provider>
  );
}

export const useDisciplines = () => useContext(DisciplinesContext);
