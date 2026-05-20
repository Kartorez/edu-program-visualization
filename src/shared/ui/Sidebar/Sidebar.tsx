'use client';
import { useSidebar } from '@/shared/lib/SidebarContext';
import { MainSidebar } from './MainSidebar';
import type { SidebarSection } from './MainSidebar';
import type { SidebarDiscipline } from '@/shared/lib/DisciplinesContext';

type SidebarProps = {
  sections?: SidebarSection[];
  sectionsLabel?: string;
  disciplinesLabel?: string;
  disciplines?: SidebarDiscipline[];
};

export function Sidebar({ sections, sectionsLabel, disciplinesLabel, disciplines }: SidebarProps) {
  const { open, close } = useSidebar();

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={close} />}
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <MainSidebar
          sections={sections}
          sectionsLabel={sectionsLabel}
          disciplinesLabel={disciplinesLabel}
          disciplines={disciplines}
        />
      </aside>
    </>
  );
}
