'use client';
import React from 'react';
import { useField, Button } from '@payloadcms/ui';
import { Plus, Trash2, ListOrdered } from 'lucide-react';
import './TopicEditor.scss';

type Topic = {
  title: string;
  semester?: number;
  id?: string;
};

export default function TopicEditor({ path }: { path: string }) {
  const { value = [], setValue } = useField<Topic[]>({ path });

  const addTopic = () => {
    const current = Array.isArray(value) ? value : [];
    setValue([...current, { title: '', semester: 1 }]);
  };

  const removeTopic = (index: number) => {
    const current = Array.isArray(value) ? value : [];
    const newValue = current.filter((_, i) => i !== index);
    setValue(newValue);
  };

  const updateTopic = (index: number, key: keyof Topic, val: any) => {
    const current = Array.isArray(value) ? value : [];
    const newValue = current.map((item, i) => 
      i === index ? { ...item, [key]: val } : item
    );
    setValue(newValue);
  };

  const safeValue = Array.isArray(value) ? value : [];

  const sortedTopics = [...safeValue]
    .map((t, i) => ({ ...t, originalIndex: i }))
    .sort((a, b) => (a.semester || 0) - (b.semester || 0));

  return (
    <div className="topic-editor">
      <div className="topic-editor__header">
        <label className="field-label">Теми занять</label>
        <Button size="small" buttonStyle="secondary" onClick={addTopic} icon={<Plus size={14} />}>
          Додати тему
        </Button>
      </div>

      {sortedTopics.length === 0 ? (
        <div className="topic-editor__empty">Список тем порожній. Завантажте силабус або додайте вручну.</div>
      ) : (
        <div className="topic-editor__list">
          <div className="topic-editor__items">
            {sortedTopics.map((topic, i) => {
              const prevTopic = sortedTopics[i - 1];
              const showHeader = !prevTopic || prevTopic.semester !== topic.semester;

              return (
                <React.Fragment key={topic.originalIndex}>
                  {showHeader && (
                    <div className="topic-editor__sem-header">
                      <ListOrdered size={14} />
                      <span>{topic.semester === 0 ? 'Без семестру' : `Семестр ${topic.semester || 1}`}</span>
                    </div>
                  )}
                  <div className="topic-editor__item">
                    <input
                      type="number"
                      className="topic-editor__input-sem"
                      value={topic.semester ?? ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        updateTopic(topic.originalIndex, 'semester', isNaN(val) ? undefined : val);
                      }}
                      placeholder="Сем."
                    />
                    <input
                      type="text"
                      className="topic-editor__input-title"
                      value={topic.title}
                      onChange={(e) => updateTopic(topic.originalIndex, 'title', e.target.value)}
                      placeholder="Назва теми..."
                    />
                    <button
                      type="button"
                      className="topic-editor__remove"
                      title="Видалити тему"
                      onClick={() => removeTopic(topic.originalIndex)}
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
