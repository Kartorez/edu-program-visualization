import { Panel, useReactFlow } from '@xyflow/react';
import { useState } from 'react';
import Button from '../ui/Button/Button';

export default function DownloadButton() {
  const { getNodes } = useReactFlow();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);

    try {
      const nodes = getNodes();
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes }),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'study-plan.pdf';
      a.click();
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
