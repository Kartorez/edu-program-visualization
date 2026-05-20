"use client";
import { useEffect, useState, useMemo, useTransition, useDeferredValue, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import Stat from '@/components/ui/Stat';
import MatrixRow from '../MatrixTable/MatrixRow';
import MatrixSearch from '../MatrixTable/MatrixSearch';
import './CompetenciesMatrixView.scss';

export default function CompetencyMatrixView({
  disciplines,
  competencies,
}: {
  disciplines: any[];
  competencies: any[];
}) {
  const router = useRouter();
  const [highlightedComp, setHighlightedComp] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [isPending, startTransition] = useTransition();

  const [visibleTypes, setVisibleTypes] = useState<string[]>(['zk', 'sk']);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedCols, setSelectedCols] = useState<Set<string>>(new Set());
  const selectedColsArray = useMemo(() => Array.from(selectedCols), [selectedCols]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#comp-')) {
        const code = decodeURIComponent(hash.replace('#comp-', ''));
        setHighlightedComp(code);

        const el = document.getElementById(`header-${code}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      } else {
        setHighlightedComp(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSearchChange = useCallback((val: string) => {
    setInputValue(val);
    startTransition(() => {
      setSearchQuery(val);
    });
  }, []);

  const filteredDisciplines = useMemo(() => {
    return disciplines.filter(d =>
      d.name.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
      (d.shortName && d.shortName.toLowerCase().includes(deferredSearchQuery.toLowerCase()))
    );
  }, [disciplines, deferredSearchQuery]);

  const toggleRow = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleCol = useCallback((code: string) => {
    let wasChanged = false;

    if (highlightedComp === code) {
      setHighlightedComp(null);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      wasChanged = true;
    }

    setSelectedCols(prev => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
        return next;
      } else if (!wasChanged) {
        next.add(code);
        return next;
      }
      return next;
    });
  }, [highlightedComp]);

  const handleCellClick = useCallback((disciplineId: string, colCode: string) => {
    setSelectedRows(prevRows => {
      setSelectedCols(prevCols => {
        const isRowSelected = prevRows.has(disciplineId);
        const isColSelected = prevCols.has(colCode);

        return prevCols;
      });
      return prevRows;
    });

    setSelectedRows(prev => {
      const next = new Set(prev);
      next.add(disciplineId);
      return next;
    });

    setSelectedCols(prev => {
      const next = new Set(prev);
      next.add(colCode);
      return next;
    });
  }, []);

  const zkList = competencies.filter((c) => c.type === 'zk' && visibleTypes.includes('zk'));
  const skList = competencies.filter((c) => c.type === 'sk' && visibleTypes.includes('sk'));
  const allVisibleComps = [...zkList, ...skList];

  return (
    <div className="matrix-page">
      <PageHeader
        code="ОПП · Комп'ютерні науки · Бакалавр"
        title="Матриця компетентностей"
        description="Відображає які загальні (ЗК) та спеціальні (СК) компетентності формує кожна дисципліна програми."
        stats={
          <>
            <Stat
              label="Дисциплін"
              value={
                deferredSearchQuery
                  ? `${filteredDisciplines.length} з ${disciplines.length}`
                  : disciplines.length
              }
              isAccent
              onClick={() => router.push('/plan/graph')}
              className="stat--disciplines"
              title="Переглянути візуальну структуру (граф)"
            />
            <Stat
              label="Загальні (ЗК)"
              value={competencies.filter(c => c.type === 'zk').length}
              onClick={() => setVisibleTypes(prev => prev.includes('zk') ? prev.filter(t => t !== 'zk') : [...prev, 'zk'])}
              className={visibleTypes.includes('zk') ? '' : 'is-inactive'}
              title="Перемкнути видимість ЗК"
            />
            <Stat
              label="Спеціальні (СК)"
              value={competencies.filter(c => c.type === 'sk').length}
              onClick={() => setVisibleTypes(prev => prev.includes('sk') ? prev.filter(t => t !== 'sk') : [...prev, 'sk'])}
              className={visibleTypes.includes('sk') ? '' : 'is-inactive'}
              title="Перемкнути видимість СК"
            />
          </>
        }
      />

      <div className="matrix-controls">
        <MatrixSearch
          value={inputValue}
          onChange={handleSearchChange}
          isPending={isPending}
        />

        <div className="matrix-filters">
          <button
            className={`filter-btn filter-btn--zk ${visibleTypes.includes('zk') ? 'active' : ''}`}
            onClick={() => setVisibleTypes(prev => prev.includes('zk') ? prev.filter(t => t !== 'zk') : [...prev, 'zk'])}
          >
            ЗК
          </button>
          <button
            className={`filter-btn filter-btn--sk ${visibleTypes.includes('sk') ? 'active' : ''}`}
            onClick={() => setVisibleTypes(prev => prev.includes('sk') ? prev.filter(t => t !== 'sk') : [...prev, 'sk'])}
          >
            СК
          </button>
        </div>

        {(selectedRows.size > 0 || selectedCols.size > 0) && (
          <button className="matrix-clear" onClick={() => { setSelectedRows(new Set()); setSelectedCols(new Set()); }}>
            Очистити
          </button>
        )}
      </div>

      <div className="matrix-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th className="matrix__discipline-column">Дисципліна</th>
              {allVisibleComps.map((c) => (
                <th
                  key={c.id}
                  id={`header-${c.code}`}
                  onClick={() => toggleCol(c.code)}
                  className={`matrix__th-clickable ${highlightedComp === c.code || selectedCols.has(c.code) ? 'matrix__th--highlight' : ''
                    }`}
                >
                  <div className="th-content">
                    {c.code}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredDisciplines.map((d) => (
              <MatrixRow
                key={d.id}
                discipline={d}
                columns={allVisibleComps}
                itemsKey="competencies"
                dotClass={(c) => `dot-${c.type}`}
                isSelected={selectedRows.has(d.id)}
                selectedColsArray={selectedColsArray}
                highlightedCol={highlightedComp}
                onToggleRow={toggleRow}
                onCellClick={handleCellClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
