'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useField, useForm } from '@payloadcms/ui';
import { resolveOrCreate } from '@/features/admin/parser/components/ParseButton/helpers';
import './DisciplineSelector.scss';

type Discipline = {
  id: string;
  code: string;
  name: string;
  year: number;
  type: 'required' | 'elective';
  credits?: number;
  semesters?: string[];
  electiveGroup?: string | null;
};

export default function DisciplineSelector({ path }: { path: string }) {
  const { value, setValue } = useField<string[]>({ path });
  const { getData } = useForm();
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignResult, setAssignResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const res = await fetch('/api/disciplines?limit=1000&depth=0&sort=-year,code');
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
        d.name?.toLowerCase().includes(lowerSearch) ||
        d.code?.toLowerCase().includes(lowerSearch) ||
        d.year?.toString().includes(lowerSearch)
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

  const assignCodes = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Присвоїти коди для ${selectedIds.size} вибраних дисциплін? Це перезапише існуючі коди.`)) return;

    setAssigning(true);
    setAssignResult(null);

    try {
      const ids = Array.from(selectedIds);
      const res = await fetch(`/api/disciplines?where[id][in]=${ids.join(',')}&limit=1000&depth=0`);
      const data = await res.json();
      const discs: Discipline[] = data.docs || [];

      const minSem = (d: any): number => {
        const sems = (d.semesters || []).map(Number).filter(Boolean);
        return sems.length ? Math.min(...sems) : 99;
      };

      const required = discs
        .filter(d => d.type === 'required')
        .sort((a, b) => minSem(a) - minSem(b));


      const elective = discs.filter(d => d.type === 'elective');
      const groupMap = new Map<string, Discipline[]>();
      elective.forEach(d => {
        const key = (d.electiveGroup as string) || `__solo_${d.id}`;
        if (!groupMap.has(key)) groupMap.set(key, []);
        groupMap.get(key)!.push(d);
      });

      const sortedGroups = Array.from(groupMap.values())
        .sort((a, b) => Math.min(...a.map(minSem)) - Math.min(...b.map(minSem)));

      const updates: { id: string; code: string; electiveGroup?: string }[] = [
        ...required.map((d, i) => ({ id: d.id, code: `ОК ${i + 1}` })),
        ...(
          await Promise.all(
            sortedGroups.map(async (group, gi) => {
              const groupNum = gi + 1;
              const groupId = await resolveOrCreate(
                'elective-groups',
                `ВК ${groupNum}`,
                { code: `ВК ${groupNum}`, name: `Вибіркова група ${groupNum}` }
              );
              return group.map((d, di) => ({
                id: d.id,
                code: `ВК ${groupNum}.${di + 1}`,
                electiveGroup: groupId,
              }));
            })
          )
        ).flat(),
      ];

      await Promise.all(updates.map(u => {
        const body: Record<string, any> = { code: u.code };
        if (u.electiveGroup) body.electiveGroup = u.electiveGroup;
        return fetch(`/api/disciplines/${u.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }));


      const refreshRes = await fetch('/api/disciplines?limit=1000&depth=0&sort=-year,code');
      const refreshData = await refreshRes.json();
      setDisciplines(refreshData.docs || []);
      setAssignResult(`✅ Присвоєно коди: ${required.length} ОК, ${elective.length} ВК`);
    } catch (err) {
      setAssignResult(`❌ Помилка: ${err}`);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Завантаження дисциплін...</div>;

  return (
    <div className="discipline-selector">
      <div className="discipline-selector__header">
        <input
          type="text"
          className="discipline-selector__search"
          placeholder="🔍 Пошук за назвою, кодом або роком..."
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
          {selectedIds.size > 0 && (
            <button
              type="button"
              className="discipline-selector__btn discipline-selector__btn--assign"
              onClick={assignCodes}
              disabled={assigning}
              title="Присвоїти коди ОК.01, ОК.02... і ВК.01, ВК.02... за порядком семестрів"
            >
              {assigning ? '⏳' : '🏷️'} Присвоїти коди
            </button>
          )}
        </div>
      </div>
      {assignResult && (
        <div className="discipline-selector__assign-result">{assignResult}</div>
      )}

      <div className="discipline-selector__stats">
        Вибрано <strong>{selectedIds.size}</strong> дисциплін | Відображено <strong>{filteredDisciplines.length}</strong> з {disciplines.length}
      </div>

      <div className="discipline-selector__table-wrapper">
        <table className="discipline-selector__table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th style={{ width: '100px' }}>Рік</th>
              <th style={{ width: '100px' }}>Код</th>
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
                    <span className="discipline-selector__year">{d.year}</span>
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
