'use client';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import { MainSidebar } from './MainSidebar';
import { DisciplineSidebar } from './DisciplineSidebar';

export function Sidebar() {
  const pathname = usePathname();
  const { open, close } = useSidebar();
  const isDiscipline = pathname.startsWith('/plan/disciplines/');

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={close} />}
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        {isDiscipline ? <DisciplineSidebar /> : <MainSidebar />}
      </aside>
    </>
  );
}
