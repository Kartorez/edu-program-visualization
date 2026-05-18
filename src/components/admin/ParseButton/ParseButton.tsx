'use client';
import { useForm } from '@payloadcms/ui';
import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { resolveList, matchRelations, safeSemester } from './helpers';
import './ParseButton.scss';

const PARSER_URL = 'https://silabusvzwei-4.onrender.com/api/Syllabus';

export default function ParseButton() {
  const { getData, dispatchFields, addFieldRow, removeFieldRow } = useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [notFoundPrereqs, setNotFoundPrereqs] = useState<string[]>([]);
  const [notFoundPostreqs, setNotFoundPostreqs] = useState<string[]>([]);

  const uploadFile = async (file: File) => {
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

      const discRes = await fetch(`/api/disciplines?limit=1000&depth=0&sort=-year&t=${Date.now()}`, {
        cache: 'no-store'
      });
      const discData = await discRes.json();
      const rawDisciplines = discData.docs || [];

      const payloadFormData: any = getData();
      const currentYear = payloadFormData?.year || new Date().getFullYear();

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

      const { ids: prereqIds, missing: missingPrereqs } = matchRelations(
        data.prerequisites,
        rawDisciplines,
        currentYear
      );

      const { ids: postreqIds, missing: missingPostreqs } = matchRelations(
        data.postrequisites,
        rawDisciplines,
        currentYear
      );

      const statusText = (data.status || data.type || data.disciplineType || '').toString().toLowerCase();
      const disciplineType = statusText.includes('вибір') ? 'elective' : 'required';

      const disciplineName = data.disciplineName ?? '';
      let category = 'standard';
      const normName = disciplineName.toLowerCase();
      if (normName.includes('практика')) category = 'practice';
      else if (normName.includes('кваліфікаційна') || normName.includes('робота')) category = 'thesis';

      const fieldUpdates = {
        type: disciplineType,
        category,
        name: disciplineName,
        shortName: data.disciplineShortName ?? '',
        year: currentYear,
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

      const semesters = ([] as any[]).concat(data.semesters || data.semester || [])
        .map(s => s.toString())
        .filter(s => s && !isNaN(parseInt(s, 10)));
      dispatchFields({ type: 'UPDATE', path: 'semesters', value: semesters });

      const allTopics: any[] = [];
      const topicsBySem = data.courseTopicsBySemester || data.topicsBySemester || {};
      const generateId = () => Math.random().toString(36).substring(2, 9);

      if (Object.keys(topicsBySem).length > 0) {
        Object.entries(topicsBySem).forEach(([sem, topics]) => {
          if (Array.isArray(topics)) {
            topics.forEach(t => {
              allTopics.push({
                id: generateId(),
                title: typeof t === 'string' ? t : (t as any).title || '',
                semester: safeSemester(sem)
              });
            });
          }
        });
      } else {
        const rawTopics = data.courseTopics || data.topics || [];
        const topicsList = Array.isArray(rawTopics) ? rawTopics : [];

        if (topicsList.length > 0) {
          const numSemesters = semesters.length > 0 ? semesters.length : 1;
          const topicsPerSemester = Math.ceil(topicsList.length / numSemesters);

          topicsList.forEach((t: any, index) => {
            const title = typeof t === 'string' ? t : t.title || '';
            const semIndex = Math.min(
              Math.floor(index / topicsPerSemester),
              numSemesters - 1
            );
            const semValue = semesters[semIndex] || '1';

            allTopics.push({
              id: generateId(),
              title: title,
              semester: safeSemester(semValue)
            });
          });
        }
      }

      const existingTopics = (getData()?.topics || []) as any[];
      if (Array.isArray(existingTopics)) {
        for (let i = existingTopics.length - 1; i >= 0; i--) {
          removeFieldRow({ path: 'topics', rowIndex: i });
        }
      }

      allTopics.forEach((topic, index) => {
        addFieldRow({
          path: 'topics',
          schemaPath: 'topics',
          rowIndex: index,
        });

        setTimeout(() => {
          dispatchFields({
            type: 'UPDATE',
            path: `topics.${index}.title`,
            value: topic.title,
          });
          dispatchFields({
            type: 'UPDATE',
            path: `topics.${index}.semester`,
            value: topic.semester,
          });
        }, 60);
      });

      setNotFoundPrereqs(missingPrereqs);
      setNotFoundPostreqs(missingPostreqs);
      setWarnings(data.parseWarnings || []);
      setStatus('ok');
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      uploadFile(file);
    }
  };

  return (
    <div className="syllabus-parser">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
        }}
        accept="application/pdf"
        style={{ display: 'none' }}
        hidden
      />

      <div
        className={`syllabus-parser__dropzone ${loading ? 'is-loading' : ''} ${status === 'ok' ? 'is-success' : ''} ${isDragging ? 'is-dragging' : ''}`}
        onClick={() => !loading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {loading ? (
          <div className="syllabus-parser__content">
            <Loader2 className="syllabus-parser__spinner" size={32} />
            <div className="syllabus-parser__title">Аналіз силабусу...</div>
            <div className="syllabus-parser__progress-bar">
              <div className="syllabus-parser__progress-fill" />
            </div>
            <div className="syllabus-parser__subtitle">Зчитуємо компетентності, теми та зв'язки...</div>
          </div>
        ) : status === 'ok' ? (
          <div className="syllabus-parser__content">
            <CheckCircle2 className="syllabus-parser__success-icon" size={32} />
            <div className="syllabus-parser__title">Силабус успішно імпортовано!</div>
            <div className="syllabus-parser__subtitle">Усі дані розкладено по відповідних полях форми.</div>
          </div>
        ) : (
          <div className="syllabus-parser__content">
            <UploadCloud className="syllabus-parser__upload-icon" size={32} />
            <div className="syllabus-parser__title">Перетягніть PDF силабусу сюди</div>
            <div className="syllabus-parser__subtitle">або натисніть для вибору файлу з комп'ютера</div>
          </div>
        )}
      </div>

      {(warnings.length > 0 || notFoundPrereqs.length > 0 || notFoundPostreqs.length > 0) && (
        <div className="syllabus-parser__results">
          {warnings.length > 0 && (
            <div className="syllabus-parser__result-box is-warning">
              <div className="syllabus-parser__result-title">
                <AlertTriangle size={16} />
                <span>Зауваження при аналізі тексту силабусу:</span>
              </div>
              <div className="syllabus-parser__result-list">
                {warnings.map((w, i) => (
                  <div key={i} className="syllabus-parser__result-item">• {w}</div>
                ))}
              </div>
            </div>
          )}

          {notFoundPrereqs.length > 0 && (
            <div className="syllabus-parser__result-box is-warning">
              <div className="syllabus-parser__result-title">
                <AlertTriangle size={16} />
                <span>Пререквізити не знайдено в базі даних:</span>
              </div>
              <div className="syllabus-parser__result-list">
                {notFoundPrereqs.map((n, i) => (
                  <div key={i} className="syllabus-parser__result-item">• {n}</div>
                ))}
              </div>
            </div>
          )}

          {notFoundPostreqs.length > 0 && (
            <div className="syllabus-parser__result-box is-info">
              <div className="syllabus-parser__result-title">
                <Info size={16} />
                <span>Постреквізити не знайдено в базі даних:</span>
              </div>
              <div className="syllabus-parser__result-list">
                {notFoundPostreqs.map((n, i) => (
                  <div key={i} className="syllabus-parser__result-item">• {n}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
