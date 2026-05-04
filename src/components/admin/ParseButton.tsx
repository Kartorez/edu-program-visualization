'use client';
import { useForm } from '@payloadcms/ui';
import { useState } from 'react';
import Fuse from 'fuse.js';
import './ParseButon.scss';

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

      const res = await fetch(`${PARSER_URL}/parse`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Помилка парсингу');

      const data = await res.json();

      const allRes = await fetch('/api/disciplines?limit=1000&depth=0');
      const allDisciplines = (await allRes.json()).docs ?? [];

      const fuse = new Fuse(allDisciplines, {
        keys: ['name', 'shortName'],
        threshold: 0.35,
      });

      const allCompetencies = [
        ...(data.generalCompetencies ?? []).map((c: any) => ({ ...c, type: 'zk' })),
        ...(data.specialCompetencies ?? []).map((c: any) => ({ ...c, type: 'sk' })),
      ];

      const competencyIds = await Promise.all(
        allCompetencies.map((c: any) =>
          resolveOrCreate('competencies', c.code, {
            code: c.code,
            description: c.description,
            type: c.type,
          })
        )
      );

      const allOutcomes = [...(data.learningOutcomes ?? []), ...(data.practicOutcome ?? [])];

      const outcomeIds = await Promise.all(
        allOutcomes.map((o: any) =>
          resolveOrCreate('learning-outcomes', o.code, {
            code: o.code,
            description: o.description,
          })
        )
      );

      const findId = (p: any) => {
        const text = p.fullName || p.shortName || '';
        const results = fuse.search(text);
        return (results[0]?.item as any)?.id;
      };

      const missingPrereqs: string[] = [];
      const prereqIds: string[] = [];

      for (const p of data.prerequisites ?? []) {
        const id = findId(p);
        if (id) prereqIds.push(id);
        else missingPrereqs.push(p.fullName);
      }

      const missingPostreqs: string[] = [];
      const postreqIds: string[] = [];

      for (const p of data.postrequisites ?? []) {
        const id = findId(p);
        if (id) postreqIds.push(id);
        else missingPostreqs.push(p.fullName);
      }

      const statusText = (data.status || data.type || data.disciplineType || data.disciplineStatus || '').toString().toLowerCase();
      const isElective = statusText.includes('вибір');
      const disciplineType = isElective ? 'elective' : 'required';
      const prefix = isElective ? 'ВК ' : 'ОК ';
      const rawCode = (data.disciplineCode || data.code || '').toString().trim();

      const formattedCode = rawCode.match(/^(ОК|ВК)/i) ? rawCode : `${prefix}${rawCode}`.trim();

      dispatchFields({ type: 'UPDATE', path: 'type', value: disciplineType });
      if (formattedCode) {
        dispatchFields({ type: 'UPDATE', path: 'code', value: formattedCode });
      }

      dispatchFields({ type: 'UPDATE', path: 'name', value: data.disciplineName ?? '' });
      dispatchFields({ type: 'UPDATE', path: 'shortName', value: data.disciplineShortName ?? '' });
      dispatchFields({ type: 'UPDATE', path: 'credits', value: data.ectsCredits ?? 0 });
      dispatchFields({ type: 'UPDATE', path: 'hours', value: data.totalHours?.total ?? 0 });

      dispatchFields({
        type: 'UPDATE',
        path: 'assessment',
        value: [data.finalAssessment, data.intermediateAssessment].filter(Boolean).join(' / '),
      });

      dispatchFields({ type: 'UPDATE', path: 'competencies', value: competencyIds });
      dispatchFields({ type: 'UPDATE', path: 'learningOutcomes', value: outcomeIds });

      if (prereqIds.length) {
        dispatchFields({ type: 'UPDATE', path: 'prerequisites', value: prereqIds });
      }

      if (postreqIds.length) {
        dispatchFields({ type: 'UPDATE', path: 'postrequisites', value: postreqIds });
      }

      const semesters = Array.isArray(data.semester)
        ? data.semester
        : data.semester
          ? [data.semester]
          : [];

      const wait = (ms = 0) => new Promise((r) => setTimeout(r, ms));

      for (let i = 0; i < semesters.length; i++) {
        dispatchFields({ type: 'ADD_ROW', path: 'semesters' });
        await wait(10);
        dispatchFields({
          type: 'UPDATE',
          path: `semesters.${i}.semester`,
          value: semesters[i],
        });
      }

      const topics = data.courseTopics ?? [];

      for (let i = 0; i < topics.length; i++) {
        dispatchFields({ type: 'ADD_ROW', path: 'topics' });
        await wait(10);
        dispatchFields({
          type: 'UPDATE',
          path: `topics.${i}.title`,
          value: topics[i],
        });
      }

      setNotFoundPrereqs(missingPrereqs);
      setNotFoundPostreqs(missingPostreqs);
      if (data.parseWarnings?.length) setWarnings(data.parseWarnings);

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
