'use client';

import React, { useEffect, useState } from 'react';
import { useField, RelationshipField } from '@payloadcms/ui';
import './RelationManager.scss';

export default function RelationManager({ path, label, relationTo }: { path: string; label: string; relationTo: any }) {
  const { value, setValue } = useField<any[]>({ path });
  const [resolvedDocs, setResolvedDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const ids = Array.isArray(value) ? value.join(',') : '';

  useEffect(() => {
    if (!ids) {
      setResolvedDocs([]);
      return;
    }

    const fetchDocs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/${relationTo}?where[id][in]=${ids}&limit=100`);
        const json = await res.json();
        if (json?.docs) {
          setResolvedDocs(json.docs);
        }
      } catch (err) {
        console.error('Error fetching relations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [ids, relationTo]);

  const removeId = (id: string | number) => {
    const newValue = (value || []).filter(v => String(v) !== String(id));
    setValue(newValue);
  };

  return (
    <div 
      className="relation-manager" 
      style={{ 
        opacity: loading ? 0.6 : 1, 
        pointerEvents: loading ? 'none' : 'auto', 
        transition: 'opacity 0.2s ease-in-out' 
      }}
    >
      <div className="relation-manager__label">
        {label}
        {loading && <span style={{ marginLeft: '10px', fontSize: '12px', color: '#888' }}>(Завантаження...)</span>}
      </div>

      <div className="relation-manager__grid">
        {resolvedDocs.map((doc) => (
          <div key={doc.id} className="relation-card">
            <div className="relation-card__code">{doc.code}</div>
            <div className="relation-card__name">{doc.name}</div>
            <button
              type="button"
              className="relation-card__remove"
              onClick={() => removeId(doc.id)}
            >
              ×
            </button>
          </div>
        ))}
        {(!value || value.length === 0) && (
          <div className="relation-manager__empty">Зв'язків ще немає</div>
        )}
      </div>

      <div className="relation-manager__picker">
        <RelationshipField
          path={path}
          field={{
            name: path,
            type: 'relationship',
            relationTo: relationTo as any,
            hasMany: true,
            label: 'Додати звʼязок',
          }}
        />
      </div>
    </div>
  );
}
