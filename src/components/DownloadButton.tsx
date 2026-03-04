// components/DownloadButton.tsx
import { Panel, useReactFlow } from '@xyflow/react';

function DownloadButton() {
  const { getNodes } = useReactFlow();

  const onClick = async () => {
    const nodes = getNodes();
    if (!nodes.length) return;

    const realBounds = nodes.reduce(
      (acc, node) => {
        const x2 =
          node.position.x + (node.measured?.width ?? node.width ?? 150);
        const y2 =
          node.position.y + (node.measured?.height ?? node.height ?? 50);
        return {
          x: Math.min(acc.x, node.position.x),
          y: Math.min(acc.y, node.position.y),
          maxX: Math.max(acc.maxX, x2),
          maxY: Math.max(acc.maxY, y2),
        };
      },
      { x: Infinity, y: Infinity, maxX: -Infinity, maxY: -Infinity }
    );

    const padding = 100;
    const width = realBounds.maxX - realBounds.x + padding * 2;
    const height = realBounds.maxY - realBounds.y + padding * 2;
    const translateX = -realBounds.x + padding;
    const translateY = -realBounds.y + padding;

    const viewportEl = document.querySelector(
      '.react-flow__viewport'
    ) as HTMLElement;
    if (!viewportEl) return;

    const originalTransform = viewportEl.style.transform;
    viewportEl.style.transform = `translate(${translateX}px, ${translateY}px) scale(1)`;
    const html = viewportEl.outerHTML;
    viewportEl.style.transform = originalTransform;

    const styles = Array.from(document.styleSheets)
      .map((s) => {
        try {
          return Array.from(s.cssRules)
            .map((r) => r.cssText)
            .join('');
        } catch {
          return '';
        }
      })
      .join('');

    const res = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, styles, bounds: { width, height } }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reactflow.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Panel position="top-right">
      <button className="download-btn xy-theme__button" onClick={onClick}>
        Download PDF
      </button>
    </Panel>
  );
}

export default DownloadButton;
