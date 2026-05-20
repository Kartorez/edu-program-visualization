'use client';
import { createContext, useContext } from 'react';
import { sortByCode } from '@/shared/lib/sortByCode';

// Мінімальний тип дисципліни для sidebar/topbar — не прив'язаний до жодного ORM
export type SidebarDiscipline = {
  id: string;
  code?: string | null;
  name: string;
  shortName?: string | null;
  type?: string | null;
  currentSemester?: number;
};

const DisciplinesContext = createContext<SidebarDiscipline[]>([]);

export function DisciplinesProvider({
  children,
  disciplines,
}: {
  children: React.ReactNode;
  disciplines: SidebarDiscipline[];
}) {
  return (
    <DisciplinesContext.Provider value={sortByCode(disciplines)}>
      {children}
    </DisciplinesContext.Provider>
  );
}

export const useDisciplines = () => useContext(DisciplinesContext);
