'use client';
import { useEffect, useState, useMemo, useTransition, useDeferredValue, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import Stat from '@/components/ui/Stat';
import MatrixRow from '../MatrixTable/MatrixRow';
import MatrixSearch from '../MatrixTable/MatrixSearch';
import './LearningOutcomesMatrixView.scss';

export default function LearningOutcomesMatrixView({
  disciplines,
  outcomes,
}: {
  disciplines: any[];
  outcomes: any[];
}) {
  const [highlightedRes, setHighlightedRes] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [isPending, startTransition] = useTransition();

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedCols, setSelectedCols] = useState<Set<string>>(new Set());
  const selectedColsArray = useMemo(() => Array.from(selectedCols), [selectedCols]);

  const router = useRouter();

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#res-')) {
        const code = decodeURIComponent(hash.replace('#res-', ''));
        setHighlightedRes(code);

        const el = document.getElementById(`header-${code}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      } else {
        setHighlightedRes(null);
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

    if (highlightedRes === code) {
      setHighlightedRes(null);
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
  }, [highlightedRes]);

  const handleCellClick = useCallback((disciplineId: string, colCode: string) => {
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

  return (
    <div className="matrix-page">
      <PageHeader
        code="ОПП · Комп'ютерні науки · Бакалавр"
        title="Матриця результатів навчання"
        description="Відображає які програмні результати навчання (РН) забезпечує кожна дисципліна програми."
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
            <Stat label="РН" value={outcomes.length} />
          </>
        }
      />

      <div className="matrix-controls">
        <MatrixSearch
          value={inputValue}
          onChange={handleSearchChange}
          isPending={isPending}
        />

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
              {outcomes.map((o) => (
                <th
                  key={o.id}
                  id={`header-${o.code}`}
                  onClick={() => toggleCol(o.code)}
                  className={`matrix__th-clickable ${highlightedRes === o.code || selectedCols.has(o.code) ? 'matrix__th--highlight' : ''
                    }`}
                >
                  <div className="th-content">
                    {o.code}
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
                columns={outcomes}
                itemsKey="learningOutcomes"
                dotClass="dot-rn"
                isSelected={selectedRows.has(d.id)}
                selectedColsArray={selectedColsArray}
                highlightedCol={highlightedRes}
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
