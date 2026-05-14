'use client';
import { useForm } from '@payloadcms/ui';
import { useState } from 'react';
import Fuse from 'fuse.js';
import './ParseButton.scss';

const PARSER_URL = 'https://silabusvzwei-4.onrender.com/api/Syllabus';

const cache = new Map<string, string>();

async function resolveOrCreate(
  collection: string,
  code: string,
  data: Record<string, unknown>
): Promise<string> {
  const key = `${collection}:${code}`;
  if (cache.has(key)) return cache.get(key)!;

  const res = await fetch(
    `/api/${collection}?where[code][equals]=${encodeURIComponent(code)}&limit=1`
  );
  const json = await res.json();

  let id: string;

  if (json.docs?.length > 0) {
    id = json.docs[0].id;
  } else {
    const created = await fetch(`/api/${collection}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const createdJson = await created.json();
    id = createdJson.doc?.id ?? createdJson.id;
  }

  cache.set(key, id);
  return id;
}

export default function ParseButton() {
  const { dispatchFields } = useForm();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [notFoundPrereqs, setNotFoundPrereqs] = useState<string[]>([]);
  const [notFoundPostreqs, setNotFoundPostreqs] = useState<string[]>([]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus('idle');
    setWarnings([]);
    setNotFoundPrereqs([]);
    setNotFoundPostreqs([]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${PARSER_URL}/parse`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Помилка парсингу');
      const data = await res.json();

      const allRes = await fetch('/api/disciplines?limit=1000&depth=0');
      const allDisciplines = (await allRes.json()).docs ?? [];

      const normalizeText = (t: string) =>
        t.toLowerCase()
          .replace(/[oakepi]/g, (m) => ({ o: 'о', a: 'а', k: 'к', e: 'е', p: 'р', i: 'і' }[m]!))
          .trim();

      const fuse = new Fuse(allDisciplines.map((d: any) => ({
        ...d,
        _normName: normalizeText(d.name || ''),
        _normShort: normalizeText(d.shortName || ''),
        _normCode: normalizeText(d.code || ''),
      })), {
        keys: ['_normName', '_normShort', '_normCode', 'code', 'name'],
        threshold: 0.4,
      });

      const resolveList = async (list: any[], collection: string, mapper: (item: any) => any) =>
        Promise.all(list.map(item => resolveOrCreate(collection, item.code, mapper(item))));

      const competencyIds = await resolveList(
        [...(data.generalCompetencies ?? []).map((c: any) => ({ ...c, type: 'zk' })),
        ...(data.specialCompetencies ?? []).map((c: any) => ({ ...c, type: 'sk' }))],
        'competencies',
        (c) => ({ code: c.code, description: c.description, type: c.type })
      );

      const outcomeIds = await resolveList(
        [...(data.learningOutcomes ?? []), ...(data.practicOutcome ?? [])],
        'learning-outcomes',
        (o) => ({ code: o.code, description: o.description })
      );

      const resolveRelations = (items: any[]) => {
        const ids: string[] = [];
        const missing: string[] = [];
        (items ?? []).forEach(p => {
          const text = normalizeText(p.fullName || p.shortName || p.code || '');
          const found = text ? fuse.search(text)[0]?.item : null;
          if (found) ids.push((found as any).id);
          else missing.push(p.fullName || p.code || 'Невідома дисципліна');
        });
        return { ids, missing };
      };

      const { ids: prereqIds, missing: missingPrereqs } = resolveRelations(data.prerequisites);
      const { ids: postreqIds, missing: missingPostreqs } = resolveRelations(data.postrequisites);

      const statusText = (data.status || data.type || data.disciplineType || '').toString().toLowerCase();
      const disciplineType = statusText.includes('вибір') ? 'elective' : 'required';

      const fieldUpdates = {
        type: disciplineType,
        code: (data.disciplineCode || data.code || '').toString().trim(),
        name: data.disciplineName ?? '',
        shortName: data.disciplineShortName ?? '',
        credits: data.ectsCredits ?? 0,
        hours: data.totalHours?.total ?? 0,
        competencies: competencyIds,
        learningOutcomes: outcomeIds,
        prerequisites: prereqIds,
        postrequisites: postreqIds,
      };

      Object.entries(fieldUpdates).forEach(([path, value]) => {
        if (value || typeof value === 'number') dispatchFields({ type: 'UPDATE', path, value });
      });

      const rawAssessment = `${data.finalAssessment} ${data.intermediateAssessment}`.toLowerCase();
      let assessmentValue = 'credit';
      if (rawAssessment.includes('іспит') || rawAssessment.includes('екзамен')) {
        assessmentValue = rawAssessment.includes('залік') ? 'exam_credit' : 'exam';
      }
      dispatchFields({ type: 'UPDATE', path: 'assessment', value: assessmentValue });

      const semesters = [].concat(data.semester || []);
      dispatchFields({ type: 'UPDATE', path: 'semesters', value: [] });
      for (let i = 0; i < semesters.length; i++) {
        dispatchFields({ type: 'ADD_ROW', path: 'semesters' });
        await new Promise(r => setTimeout(r, 10));
        dispatchFields({ type: 'UPDATE', path: `semesters.${i}.semester`, value: semesters[i] });
      }

      const allTopics: any[] = [];
      const topicsBySem = data.courseTopicsBySemester || {};

      if (Object.keys(topicsBySem).length > 0) {
        Object.entries(topicsBySem).forEach(([sem, topics]) => {
          if (Array.isArray(topics)) {
            topics.forEach(t => allTopics.push({ title: t, semester: parseInt(sem, 10) }));
          }
        });
      } else {
        (data.courseTopics || []).forEach((t: string) =>
          allTopics.push({ title: t, semester: semesters[0] || 1 }));
      }

      dispatchFields({ type: 'UPDATE', path: 'topics', value: allTopics });

      setNotFoundPrereqs(missingPrereqs);
      setNotFoundPostreqs(missingPostreqs);
      setWarnings(data.parseWarnings || []);
      setStatus('ok');
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="parse">
      <label className={`parse__btn ${loading ? 'is-loading' : ''}`}>
        <input type="file" accept=".pdf" onChange={handleFile} disabled={loading} hidden />
        {loading ? 'Парсинг...' : '📄 Завантажити силабус (PDF)'}
      </label>

      {status === 'ok' && <span className="parse__ok">✓ Дані заповнено</span>}
      {status === 'error' && <span className="parse__error">✗ Помилка</span>}

      {warnings.length > 0 && (
        <div className="parse__warn">
          {warnings.map((w, i) => (
            <div key={i}>⚠ {w}</div>
          ))}
        </div>
      )}

      {notFoundPrereqs.length > 0 && (
        <div className="parse__warn">
          <div>⚠ Пререквізити не знайдено:</div>
          {notFoundPrereqs.map((n, i) => (
            <div key={i}>• {n}</div>
          ))}
        </div>
      )}

      {notFoundPostreqs.length > 0 && (
        <div className="parse__info">
          <div>ℹ Постреквізити не знайдено:</div>
          {notFoundPostreqs.map((n, i) => (
            <div key={i}>• {n}</div>
          ))}
        </div>
      )}
    </div>
  );
}
