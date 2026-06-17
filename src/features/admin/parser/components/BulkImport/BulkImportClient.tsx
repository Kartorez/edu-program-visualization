'use client';
import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, Loader2, Save, X, RefreshCw } from 'lucide-react';
import { resolveList, resolveOrCreate, matchRelations } from '@/features/admin/parser/components/ParseButton/helpers';
import { parseElectiveGroup } from '@/shared/lib/normalize';
import './BulkImportView.scss';

const PARSER_URL = 'https://silabusvzwei-4.onrender.com/api/Syllabus';

type ParsedResult = {
  fileName: string;
  status: 'success' | 'error';
  error: string | null;
  data: any;
};

type FileEntry = {
  id: string;
  file: File;
  parseStatus: 'pending' | 'parsing' | 'success' | 'error';
  result?: ParsedResult;
  selected: boolean;
  overrideCode: string;
  saving: boolean;
  saved: boolean;
  savedId?: string;
  saveError?: string;
  overrideName?: string;
  overrideShortName?: string;
  overrideType?: 'required' | 'elective';
  overrideSemesters?: string;
  overrideDescription?: string;
};

function parseSemesters(data: any): string[] {
  return ([] as any[])
    .concat(data?.semesters || data?.semester || [])
    .map((s: any) => s.toString())
    .filter((s: string) => s && !isNaN(parseInt(s, 10)));
}

function parseType(data: any): 'required' | 'elective' {
  const t = (data?.status || data?.type || data?.disciplineType || '').toString().toLowerCase();
  return t.includes('вибір') ? 'elective' : 'required';
}

function parseCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('практика')) return 'practice';
  if (n.includes('кваліфікаційна') || n.includes('робота')) return 'thesis';
  return 'standard';
}

function parseAssessment(data: any): string {
  const raw = `${data?.finalAssessment ?? ''} ${data?.intermediateAssessment ?? ''}`.toLowerCase();
  if (raw.includes('іспит') || raw.includes('екзамен')) {
    return raw.includes('залік') ? 'exam_credit' : 'exam';
  }
  return 'credit';
}

function parseTopics(data: any, semesters: string[]): { title: string; semester: number }[] {
  const topics: { title: string; semester: number }[] = [];
  const safeSem = (s: any) => { const n = parseInt(s, 10); return isNaN(n) ? 1 : n; };

  const bySem = data?.courseTopicsBySemester || data?.topicsBySemester || {};
  if (Object.keys(bySem).length > 0) {
    const origKeys = Object.keys(bySem).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    Object.entries(bySem).forEach(([sem, items]) => {
      if (Array.isArray(items)) {
        const origIdx = origKeys.indexOf(sem);
        let targetSem = safeSem(sem);
        if (semesters.length > 0) {
          const newSemVal = semesters[Math.min(origIdx !== -1 ? origIdx : 0, semesters.length - 1)];
          targetSem = newSemVal ? parseInt(newSemVal, 10) : targetSem;
        }

        items.forEach((t: any) => topics.push({
          title: typeof t === 'string' ? t : t.title || '',
          semester: isNaN(targetSem) ? 1 : targetSem,
        }));
      }
    });
    return topics;
  }

  const flat = data?.courseTopics || data?.topics || [];
  const list = Array.isArray(flat) ? flat : [];
  if (list.length === 0) return topics;

  const numSem = semesters.length || 1;
  const perSem = Math.ceil(list.length / numSem);
  list.forEach((t: any, i: number) => {
    const semIdx = Math.min(Math.floor(i / perSem), numSem - 1);
    topics.push({
      title: typeof t === 'string' ? t : t.title || '',
      semester: safeSem(semesters[semIdx] || '1'),
    });
  });
  return topics;
}

export default function BulkImportClient() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const addFiles = useCallback((incoming: File[]) => {
    const pdfs = incoming.filter(f => f.type === 'application/pdf');
    const entries: FileEntry[] = pdfs.map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      parseStatus: 'pending',
      selected: true,
      overrideCode: '',
      saving: false,
      saved: false,
    }));
    setFiles(prev => [...prev, ...entries]);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (dragCounter.current === 1) setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const toggleSelected = (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, selected: !f.selected } : f));
  };

  const setCode = (id: string, code: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, overrideCode: code } : f));
  };

  const setName = (id: string, name: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, overrideName: name } : f));
  };

  const setShortName = (id: string, shortName: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, overrideShortName: shortName } : f));
  };

  const setType = (id: string, type: 'required' | 'elective') => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, overrideType: type } : f));
  };

  const setSemesters = (id: string, semesters: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, overrideSemesters: semesters } : f));
  };

  const setDescription = (id: string, description: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, overrideDescription: description } : f));
  };

  const parseAll = async () => {
    const pending = files.filter(f => f.parseStatus === 'pending');
    if (pending.length === 0) return;

    setIsParsing(true);
    setFiles(prev => prev.map(f =>
      f.parseStatus === 'pending' ? { ...f, parseStatus: 'parsing' } : f
    ));

    try {
      const formData = new FormData();
      pending.forEach(f => formData.append('files', f.file));

      const res = await fetch(`${PARSER_URL}/parse-multiple`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const results: ParsedResult[] = await res.json();

      setFiles(prev => prev.map(entry => {
        if (entry.parseStatus !== 'parsing') return entry;
        const found = results.find(r => r.fileName === entry.file.name);
        if (!found) {
          return {
            ...entry,
            parseStatus: 'error',
            selected: false,
            result: { fileName: entry.file.name, status: 'error', error: 'Не знайдено у відповіді сервера', data: null },
          };
        }
        const success = found.status === 'success';
        const d = found.data;
        return {
          ...entry,
          parseStatus: success ? 'success' : 'error',
          selected: success,
          result: found,
          overrideCode: '',
          overrideName: success ? (d?.disciplineName ?? '') : '',
          overrideShortName: success ? (d?.disciplineShortName ?? '') : '',
          overrideType: success ? parseType(d) : 'required',
          overrideSemesters: success ? parseSemesters(d).join(', ') : '',
          overrideDescription: success ? (d?.description ?? '') : '',
        };
      }));
    } catch (err: any) {
      setFiles(prev => prev.map(f =>
        f.parseStatus === 'parsing'
          ? { ...f, parseStatus: 'error', selected: false, result: { fileName: f.file.name, status: 'error', error: String(err), data: null } }
          : f
      ));
    } finally {
      setIsParsing(false);
    }
  };

  const saveSelected = async () => {
    const toSave = files.filter(f => f.selected && f.parseStatus === 'success' && !f.saved && !f.saving);
    if (toSave.length === 0) return;

    setIsSaving(true);

    const createdEntries: { entryId: string; dbId: string; rawData: any; code?: string }[] = [];

    for (const entry of toSave) {
      setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, saving: true } : f));

      try {
        const data = entry.result!.data;

        const [competencyIds, outcomeIds] = await Promise.all([
          resolveList(
            [
              ...(data.generalCompetencies ?? []).map((c: any) => ({ ...c, type: 'zk' })),
              ...(data.specialCompetencies ?? []).map((c: any) => ({ ...c, type: 'sk' })),
            ],
            'competencies',
            (c: any) => ({ code: c.code, description: c.description, type: c.type })
          ),
          resolveList(
            [...(data.learningOutcomes ?? []), ...(data.practicOutcome ?? [])],
            'learning-outcomes',
            (o: any) => ({ code: o.code, description: o.description })
          ),
        ]);

        const name = (entry.overrideName !== undefined ? entry.overrideName : (data.disciplineName ?? '')).trim();
        const shortName = (entry.overrideShortName !== undefined ? entry.overrideShortName : (data.disciplineShortName ?? '')).trim();
        const semestersStr = entry.overrideSemesters !== undefined ? entry.overrideSemesters : parseSemesters(data).join(', ');
        const semesters = semestersStr
          .split(',')
          .map(s => s.trim())
          .filter(s => s && !isNaN(parseInt(s, 10)));
        const code = entry.overrideCode.trim() || undefined;
        const disciplineType = entry.overrideType !== undefined ? entry.overrideType : parseType(data);

        let electiveGroupId: string | undefined;
        if (code && disciplineType === 'elective') {
          const groupInfo = parseElectiveGroup(code);
          if (groupInfo) {
            electiveGroupId = await resolveOrCreate(
              'elective-groups',
              groupInfo.groupCode,
              { code: groupInfo.groupCode, name: groupInfo.groupName }
            );
          }
        }

        const body: Record<string, any> = {
          name,
          shortName,
          description: entry.overrideDescription !== undefined ? entry.overrideDescription : (data.description ?? ''),
          year,
          credits: data.ectsCredits ?? 0,
          hours: data.totalHours?.total ?? 0,
          type: disciplineType,
          category: parseCategory(name),
          assessment: parseAssessment(data),
          semesters,
          topics: parseTopics(data, semesters),
          competencies: competencyIds,
          learningOutcomes: outcomeIds,
          prerequisites: [],
          postrequisites: [],
        };
        if (code) body.code = code;
        if (electiveGroupId) body.electiveGroup = electiveGroupId;

        const res = await fetch('/api/disciplines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `HTTP ${res.status}`);
        }

        const saved = await res.json();
        const savedId = saved.doc?.id ?? saved.id;

        if (savedId) {
          createdEntries.push({
            entryId: entry.id,
            dbId: savedId,
            rawData: data,
            code,
          });
        }

        setFiles(prev => prev.map(f =>
          f.id === entry.id ? { ...f, saved: true, savedId } : f
        ));
      } catch (err: any) {
        setFiles(prev => prev.map(f =>
          f.id === entry.id ? { ...f, saving: false, saveError: String(err) } : f
        ));
      }
    }

    if (createdEntries.length > 0) {
      try {
        const discRes = await fetch(`/api/disciplines?limit=1000&depth=0&sort=-year&t=${Date.now()}`, { cache: 'no-store' });
        const discData = await discRes.json();
        const allDisciplines: any[] = discData.docs || [];

        for (const item of createdEntries) {
          const { ids: prereqIds } = matchRelations(item.rawData.prerequisites, allDisciplines, year);
          const { ids: postreqIds } = matchRelations(item.rawData.postrequisites, allDisciplines, year);

          if (prereqIds.length > 0 || postreqIds.length > 0) {
            await fetch(`/api/disciplines/${item.dbId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prerequisites: prereqIds,
                postrequisites: postreqIds,
              }),
            });
          }
        }
      } catch (err) {
        console.error('Помилка при оновленні зв’язків:', err);
      }
    }

    setFiles(prev => prev.map(f => ({ ...f, saving: false })));
    setIsSaving(false);
  };

  const pendingCount = files.filter(f => f.parseStatus === 'pending').length;
  const successCount = files.filter(f => f.parseStatus === 'success').length;
  const selectedCount = files.filter(f => f.selected && f.parseStatus === 'success' && !f.saved).length;
  const savedCount = files.filter(f => f.saved).length;

  return (
    <div className="bulk-import">
      
      <div className="bulk-import__settings">
        <label className="bulk-import__settings-label">
          Рік набору
          <input
            type="number"
            className="bulk-import__year-input"
            value={year}
            min={2000}
            max={2100}
            onChange={e => setYear(Number(e.target.value))}
          />
        </label>
        <span className="bulk-import__settings-hint">Буде застосовано до всіх нових дисциплін</span>
      </div>

      
      <div
        className={`bulk-import__dropzone ${isDragging ? 'is-dragging' : ''} ${isParsing ? 'is-disabled' : ''}`}
        onClick={() => !isParsing && fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
        />
        <UploadCloud size={36} className="bulk-import__upload-icon" />
        <div className="bulk-import__dropzone-text">
          Перетягніть PDF-файли сюди або <span className="bulk-import__link">натисніть для вибору</span>
        </div>
        <div className="bulk-import__dropzone-hint">Підтримується кілька файлів одночасно</div>
      </div>

      
      {files.length > 0 && (
        <div className="bulk-import__toolbar">
          <div className="bulk-import__stats">
            <span>{files.length} файл(ів)</span>
            {pendingCount > 0 && <span className="stat-badge stat-badge--pending">{pendingCount} очікують</span>}
            {successCount > 0 && <span className="stat-badge stat-badge--success">{successCount} розпарсено</span>}
            {savedCount > 0 && <span className="stat-badge stat-badge--saved">{savedCount} збережено</span>}
          </div>
          <div className="bulk-import__toolbar-actions">
            {pendingCount > 0 && (
              <button className="bulk-btn bulk-btn--primary" onClick={parseAll} disabled={isParsing}>
                {isParsing ? <Loader2 size={16} className="spin" /> : <RefreshCw size={16} />}
                {isParsing ? 'Парсинг...' : `Розпарсити (${pendingCount})`}
              </button>
            )}
            {selectedCount > 0 && (
              <button className="bulk-btn bulk-btn--save" onClick={saveSelected} disabled={isSaving}>
                {isSaving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                {isSaving ? 'Збереження...' : `Зберегти вибрані (${selectedCount})`}
              </button>
            )}
          </div>
        </div>
      )}

      
      {files.length > 0 && (
        <div className="bulk-import__table-wrapper">
          <table className="bulk-import__table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Файл</th>
                <th>Статус</th>
                <th>Назва дисципліни</th>
                <th>Коротка назва</th>
                <th style={{ width: 120 }}>Код <span className="bulk-import__col-hint">(необов'язково)</span></th>
                <th>Опис</th>
                <th style={{ width: 95 }}>Семестри</th>
                <th style={{ width: 100 }}>Тип</th>
                <th style={{ width: 70 }}>Кред.</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {files.map(entry => {
                const d = entry.result?.data;
                return (
                  <tr
                    key={entry.id}
                    className={[
                      entry.saved ? 'row--saved' : '',
                      entry.saveError ? 'row--error' : '',
                      entry.selected && !entry.saved ? 'row--selected' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <td>
                      {entry.parseStatus === 'success' && !entry.saved && (
                        <input
                          type="checkbox"
                          checked={entry.selected}
                          onChange={() => toggleSelected(entry.id)}
                          className="bulk-import__checkbox"
                        />
                      )}
                    </td>
                    <td>
                      <span className="bulk-import__filename" title={entry.file.name}>
                        {entry.file.name}
                      </span>
                    </td>
                    <td>
                      {entry.parseStatus === 'pending' && <span className="status-badge status--pending">Очікує</span>}
                      {entry.parseStatus === 'parsing' && <span className="status-badge status--parsing"><Loader2 size={12} className="spin" /> Парсинг</span>}
                      {entry.parseStatus === 'success' && !entry.saved && !entry.saving && !entry.saveError && (
                        <span className="status-badge status--ok"><CheckCircle2 size={12} /> OK</span>
                      )}
                      {entry.saving && <span className="status-badge status--parsing"><Loader2 size={12} className="spin" /> Збереження</span>}
                      {entry.saved && <span className="status-badge status--saved"><CheckCircle2 size={12} /> Збережено</span>}
                      {entry.parseStatus === 'error' && (
                        <span className="status-badge status--error" title={entry.result?.error ?? ''}>
                          <AlertTriangle size={12} /> Помилка
                        </span>
                      )}
                      {entry.saveError && (
                        <span className="status-badge status--error" title={entry.saveError}>
                          <AlertTriangle size={12} /> Не збережено
                        </span>
                      )}
                    </td>
                    <td>
                      {entry.parseStatus === 'success' && !entry.saved ? (
                        <input
                          type="text"
                          className="bulk-import__text-input"
                          value={entry.overrideName !== undefined ? entry.overrideName : (d?.disciplineName ?? '')}
                          onChange={e => setName(entry.id, e.target.value)}
                        />
                      ) : (
                        <span>{entry.overrideName !== undefined ? entry.overrideName : (d?.disciplineName ?? '—')}</span>
                      )}
                    </td>
                    <td>
                      {entry.parseStatus === 'success' && !entry.saved ? (
                        <input
                          type="text"
                          className="bulk-import__text-input"
                          value={entry.overrideShortName !== undefined ? entry.overrideShortName : (d?.disciplineShortName ?? '')}
                          onChange={e => setShortName(entry.id, e.target.value)}
                        />
                      ) : (
                        <span>{entry.overrideShortName !== undefined ? entry.overrideShortName : (d?.disciplineShortName ?? '—')}</span>
                      )}
                    </td>
                    <td>
                      {entry.parseStatus === 'success' && !entry.saved ? (
                        <input
                          type="text"
                          className="bulk-import__code-input"
                          value={entry.overrideCode}
                          placeholder="напр. ВК 1.1"
                          onChange={e => setCode(entry.id, e.target.value)}
                        />
                      ) : (
                        <span className="bulk-import__code-value">{entry.overrideCode || '—'}</span>
                      )}
                    </td>
                    <td>
                      {entry.parseStatus === 'success' && !entry.saved ? (
                        <input
                          type="text"
                          className="bulk-import__text-input"
                          value={entry.overrideDescription !== undefined ? entry.overrideDescription : (d?.description ?? '')}
                          placeholder="Короткий опис..."
                          onChange={e => setDescription(entry.id, e.target.value)}
                        />
                      ) : (
                        <span style={{ display: 'inline-block', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={entry.overrideDescription !== undefined ? entry.overrideDescription : (d?.description ?? '')}>
                          {entry.overrideDescription !== undefined ? entry.overrideDescription : (d?.description ?? '—')}
                        </span>
                      )}
                    </td>
                    <td>
                      {entry.parseStatus === 'success' && !entry.saved ? (
                        <input
                          type="text"
                          className="bulk-import__semesters-input"
                          value={entry.overrideSemesters !== undefined ? entry.overrideSemesters : parseSemesters(d ?? {}).join(', ')}
                          onChange={e => setSemesters(entry.id, e.target.value)}
                          placeholder="1, 2"
                        />
                      ) : (
                        <span>{entry.overrideSemesters !== undefined ? entry.overrideSemesters : parseSemesters(d ?? {}).join(', ') || '—'}</span>
                      )}
                    </td>
                    <td>
                      {entry.parseStatus === 'success' && !entry.saved ? (
                        <select
                          className="bulk-import__type-select"
                          value={entry.overrideType !== undefined ? entry.overrideType : parseType(d)}
                          onChange={e => setType(entry.id, e.target.value as 'required' | 'elective')}
                        >
                          <option value="required">ОК</option>
                          <option value="elective">ВК</option>
                        </select>
                      ) : (
                        <span className={`type-badge type-badge--${entry.overrideType !== undefined ? entry.overrideType : parseType(d)}`}>
                          {(entry.overrideType !== undefined ? entry.overrideType : parseType(d)) === 'required' ? 'ОК' : 'ВК'}
                        </span>
                      )}
                    </td>
                    <td>{d?.ectsCredits ?? '—'}</td>
                    <td>
                      {!entry.saved && (
                        <button className="bulk-import__remove" onClick={() => removeFile(entry.id)} title="Видалити">
                          <X size={14} />
                        </button>
                      )}
                      {entry.saved && entry.savedId && (
                        <a
                          href={`/admin/collections/disciplines/${entry.savedId}`}
                          className="bulk-import__open-link"
                          target="_blank"
                          rel="noreferrer"
                          title="Відкрити дисципліну"
                        >
                          ↗
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
