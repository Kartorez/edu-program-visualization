import { getSmoothStepPath, type EdgeProps } from '@xyflow/react';

interface CustomEdgeData {
  sourceSide?: string;
  targetSide?: string;
  offset?: number;
}

export default function CustomEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    data,
  } = props;

  const { offset = 0, sourceSide, targetSide } = (data as CustomEdgeData) ?? {};

  // Визначаємо чи це вертикальне з'єднання (між семестрами)
  const isVertical =
    sourceSide === 'bottom' ||
    sourceSide === 'top' ||
    targetSide === 'bottom' ||
    targetSide === 'top';

  let adjustedSourceX = sourceX;
  let adjustedSourceY = sourceY;
  let adjustedTargetX = targetX;
  let adjustedTargetY = targetY;

  if (isVertical) {
    // Для вертикальних з'єднань - зміщуємо по X (горизонталі)
    adjustedSourceX = sourceX + offset;
    adjustedTargetX = targetX + offset;
  } else {
    // Для горизонтальних з'єднань - зміщуємо по Y
    adjustedSourceY = sourceY + offset;
    adjustedTargetY = targetY + offset;
  }

  const [path] = getSmoothStepPath({
    sourceX: adjustedSourceX,
    sourceY: adjustedSourceY,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <path
      id={String(id)}
      d={path}
      stroke="#222"
      strokeWidth={1.6}
      fill="none"
      markerEnd={markerEnd}
    />
  );
}
