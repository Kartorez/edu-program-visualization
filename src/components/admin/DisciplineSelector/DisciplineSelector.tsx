'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useField } from '@payloadcms/ui';
import './DisciplineSelector.scss';

type Discipline = {
  id: string;
  code: string;
  name: string;
  type: 'required' | 'elective';
  credits?: number;
};

export default function DisciplineSelector({ path }: { path: string }) {
  const { value, setValue } = useField<string[]>({ path });
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const res = await fetch('/api/disciplines?limit=1000&depth=0&sort=code');
        const data = await res.json();
        setDisciplines(data.docs || []);
      } catch (err) {
        console.error('Failed to fetch disciplines:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDisciplines();
  }, []);

  const selectedIds = useMemo(() => new Set(value || []), [value]);

  const filteredDisciplines = useMemo(() => {
    if (!search) return disciplines;
    const lowerSearch = search.toLowerCase();
    return disciplines.filter(
      (d) =>
        d.name.toLowerCase().includes(lowerSearch) ||
        d.code.toLowerCase().includes(lowerSearch)
    );
  }, [disciplines, search]);

  const toggleDiscipline = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setValue(Array.from(newSelected));
  };

  const selectAllFiltered = () => {
    const newSelected = new Set(selectedIds);
    filteredDisciplines.forEach((d) => newSelected.add(d.id));
    setValue(Array.from(newSelected));
  };

  const deselectAllFiltered = () => {
    const newSelected = new Set(selectedIds);
    filteredDisciplines.forEach((d) => newSelected.delete(d.id));
    setValue(Array.from(newSelected));
  };

  if (loading) return <div style={{ padding: '20px' }}>Завантаження дисциплін...</div>;

  return (
    <div className="discipline-selector">
      <div className="discipline-selector__header">
        <input
          type="text"
          className="discipline-selector__search"
          placeholder="🔍 Пошук за назвою або кодом..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="discipline-selector__actions">
          <button
            type="button"
            className="discipline-selector__btn discipline-selector__btn--primary"
            onClick={selectAllFiltered}
          >
            Вибрати всі ({filteredDisciplines.length})
          </button>
          <button
            type="button"
            className="discipline-selector__btn"
            onClick={deselectAllFiltered}
          >
            Зняти вибір
          </button>
        </div>
      </div>

      <div className="discipline-selector__stats">
        Вибрано <strong>{selectedIds.size}</strong> дисциплін | Відображено <strong>{filteredDisciplines.length}</strong> з {disciplines.length}
      </div>

      <div className="discipline-selector__table-wrapper">
        <table className="discipline-selector__table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th style={{ width: '120px' }}>Код</th>
              <th>Назва дисципліни</th>
              <th style={{ width: '100px' }}>Тип</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Кредити</th>
            </tr>
          </thead>
          <tbody>
            {filteredDisciplines.map((d) => {
              const isSelected = selectedIds.has(d.id);
              return (
                <tr
                  key={d.id}
                  className={isSelected ? 'is-selected' : ''}
                  onClick={() => toggleDiscipline(d.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <input
                      type="checkbox"
                      className="discipline-selector__checkbox"
                      checked={isSelected}
                      readOnly
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td>
                    <span className="discipline-selector__code">{d.code}</span>
                  </td>
                  <td>{d.name}</td>
                  <td>
                    <span className={`discipline-selector__type discipline-selector__type--${d.type}`}>
                      {d.type === 'required' ? 'ОК' : 'ВК'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>{d.credits || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
