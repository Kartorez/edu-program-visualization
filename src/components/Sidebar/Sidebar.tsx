'use client';
import { useSidebar } from '@/context/SidebarContext';
import { MainSidebar } from './MainSidebar';

export function Sidebar() {
  const { open, close } = useSidebar();

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={close} />}
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <MainSidebar />
      </aside>
    </>
  );
}
