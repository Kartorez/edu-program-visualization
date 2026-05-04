'use client';

import { useEffect, useState, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedCols, setSelectedCols] = useState<Set<string>>(new Set());

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

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
  };

  const filteredDisciplines = useMemo(() => {
    return disciplines.filter(d =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.shortName && d.shortName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [disciplines, searchQuery]);

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCol = (code: string) => {
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
  };

  return (
    <div className="matrix-page">
      <PageHeader
        code="ОПП · Комп'ютерні науки · Бакалавр"
        title="Матриця результатів навчання"
        description="Відображає які програмні результати навчання (РН) забезпечує кожна дисципліна програми."
        stats={
          <>
            <Stat label="Дисциплін" value={disciplines.length} isAccent />
            <Stat label="РН" value={outcomes.length} />
          </>
        }
      />

      <div className="matrix-controls">
        <MatrixSearch
          value={searchQuery}
          onChange={handleSearchChange}
          isPending={false}
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
                selectedCols={selectedCols}
                highlightedCol={highlightedRes}
                onToggleRow={toggleRow}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
