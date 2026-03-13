import { Panel } from '@xyflow/react';
import { useState } from 'react';
import Button from '../ui/Button/Button';

export default function DownloadButton() {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/export-pdf');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement('a'), {
        href: url,
        download: 'study-plan.pdf',
      }).click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Panel position="top-right">
      <Button className="button--sm" disabled={loading} onClick={onClick}>
        {loading ? 'Генерація...' : 'Зберегти в PDF'}
      </Button>
    </Panel>
  );
}
