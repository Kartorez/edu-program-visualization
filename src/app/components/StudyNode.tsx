import { Handle, Position } from '@xyflow/react';
import type { StudyNodeData } from '@/types/node';
import type { PortUsage, Side } from '@/types/graph';
import '@/styles/StudyNode.scss';

interface Props {
  data: StudyNodeData & { ports?: PortUsage };
}

const pos: Record<Side, Position> = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
};

function renderSide(side: Side, count: number) {
  if (!count) return null;

  const gap = 100 / (count + 1);

  return Array.from({ length: count }).map((_, i) => {
    const percent = gap * (i + 1);
    const handleId = `${side}-${i}`;

    const style: React.CSSProperties = {
      [side === 'top' || side === 'bottom' ? 'left' : 'top']: `${percent}%`,
    };

    return (
      <div key={handleId}>
        <Handle
          id={handleId}
          type="source"
          position={pos[side]}
          style={style}
        />
        <Handle
          id={handleId}
          type="target"
          position={pos[side]}
          style={style}
        />
      </div>
    );
  });
}

export default function StudyNode({ data }: Props) {
  const { title, subject, kind, ports } = data;

  return (
    <div className={`node ${kind}`}>
      {ports &&
        (['top', 'right', 'bottom', 'left'] as Side[]).map((side) =>
          renderSide(side, ports[side])
        )}

      <div className="node__title">{title}</div>
      {subject && <div className="node__subject">{subject}</div>}
    </div>
  );
}
