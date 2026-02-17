import ELK from 'elkjs/lib/elk.bundled.js';
import type { Node, Edge } from '@xyflow/react';
import type { PortUsage, Side } from '@/types/graph';
import type { StudyNodeData } from '@/types/node';

const elk = new ELK();

// ─── Типи ────────────────────────────────────────────────────────────────────

interface ElkPoint {
  x: number;
  y: number;
}

interface ElkSection {
  id: string;
  startPoint: ElkPoint;
  endPoint: ElkPoint;
  bendPoints?: ElkPoint[];
}

interface ElkEdgeResult {
  id: string;
  sections?: ElkSection[];
}

interface ElkNodeResult {
  id: string;
  x: number;
  y: number;
}

export interface RoutedEdgeData extends Record<string, unknown> {
  sourceSide?: Side;
  targetSide?: Side;
  startPoint?: ElkPoint;
  endPoint?: ElkPoint;
  bendPoints?: ElkPoint[];
}

type StudyNode = Node<StudyNodeData & { ports?: PortUsage }>;
type StudyEdge = Edge<RoutedEdgeData>;

// ─── Константи — мають відповідати positionNodes.ts ──────────────────────────

const ROW_HEIGHT = 160;

// ELK потребує більше Y-простору між рядами для routing.
// Масштабуємо Y → після routing ділимо bend points назад.
const Y_SCALE = 2;

const SEP = '__';

const ELK_SIDE: Record<Side, string> = {
  top: 'NORTH',
  bottom: 'SOUTH',
  left: 'WEST',
  right: 'EAST',
};

// ─── Хелпери ─────────────────────────────────────────────────────────────────

function toElkPortId(nodeId: string, handleId: string): string {
  return `${nodeId}${SEP}${handleId}`;
}

function buildElkPorts(
  nodeId: string,
  ports: PortUsage | undefined,
  width: number,
  height: number
) {
  if (!ports) return [];

  const result: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    properties: Record<string, string>;
  }> = [];

  const sides: Side[] = ['top', 'bottom', 'left', 'right'];

  for (const side of sides) {
    const count = ports[side] ?? 0;
    if (count === 0) continue;

    const gap = 100 / (count + 1);

    for (let i = 0; i < count; i++) {
      const percent = (gap * (i + 1)) / 100;
      let x = 0;
      let y = 0;

      switch (side) {
        case 'top':
          x = width * percent;
          y = 0;
          break;
        case 'bottom':
          x = width * percent;
          y = height;
          break;
        case 'left':
          x = 0;
          y = height * percent;
          break;
        case 'right':
          x = width;
          y = height * percent;
          break;
      }

      result.push({
        id: toElkPortId(nodeId, `${side}-${i}`),
        x,
        y,
        width: 0,
        height: 0,
        properties: {
          'org.eclipse.elk.port.side': ELK_SIDE[side],
        },
      });
    }
  }

  return result;
}

// ─── Головна функція ──────────────────────────────────────────────────────────

export async function routeEdgesWithElk(
  nodes: StudyNode[],
  edges: StudyEdge[]
): Promise<StudyEdge[]> {
  const elkChildren = nodes.map((n) => {
    const width = n.measured?.width ?? 220;
    const height = n.measured?.height ?? 100;
    const semester = Math.round(n.position.y / ROW_HEIGHT);

    return {
      id: n.id,
      x: n.position.x,
      y: semester * ROW_HEIGHT * Y_SCALE,
      width,
      height,
      ports: buildElkPorts(n.id, n.data.ports, width, height),
      properties: {
        'org.eclipse.elk.portConstraints': 'FIXED_POS',
        // INTERACTIVE — єдина стратегія що поважає вхідні X координати нодів
        'org.eclipse.elk.layered.nodePlacement.strategy': 'INTERACTIVE',
      },
    };
  });

  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.edgeRouting': 'ORTHOGONAL',
      'elk.direction': 'DOWN',
      'elk.layered.nodePlacement.strategy': 'INTERACTIVE',
      // INTERACTIVE для crossing minimization теж поважає порядок
      'elk.layered.crossingMinimization.strategy': 'INTERACTIVE',
      'elk.spacing.edgeEdge': '6',
      'elk.spacing.edgeNode': '10',
      // Вимикаємо автоматичне масштабування графу
      'elk.separateConnectedComponents': 'false',
    },
    children: elkChildren,
    edges: edges.map((e) => ({
      id: e.id,
      sources: [toElkPortId(e.source, e.sourceHandle ?? '')],
      targets: [toElkPortId(e.target, e.targetHandle ?? '')],
    })),
  };

  let result;
  try {
    result = await elk.layout(elkGraph);
  } catch (err) {
    console.error('[ELK] layout failed:', err);
    return edges;
  }

  // Перевіряємо чи ELK змістив ноди — порівнюємо X вхід vs вихід
  const resultNodes = (result.children ?? []) as ElkNodeResult[];
  const nodeInputX = new Map(elkChildren.map((c) => [c.id, c.x]));
  const movedNodes = resultNodes.filter((n) => {
    const inputX = nodeInputX.get(n.id) ?? 0;
    return Math.abs(n.x - inputX) > 1;
  });
  if (movedNodes.length > 0) {
    console.warn(
      `[ELK] ${movedNodes.length} nodes were moved by ELK:`,
      movedNodes.map(
        (n) => `${n.id}: inputX=${nodeInputX.get(n.id)} → elkX=${n.x}`
      )
    );
  }

  // Будуємо map: elk node X → react flow node X для корекції bend points
  // Якщо ELK все одно зсунув ноду — коригуємо X bend points пропорційно
  const nodeXOffset = new Map(
    resultNodes.map((n) => [n.id, (nodeInputX.get(n.id) ?? n.x) - n.x])
  );

  const sectionsMap = new Map<string, ElkSection>(
    ((result.edges ?? []) as ElkEdgeResult[])
      .filter((e) => e.sections?.length)
      .map((e) => [e.id, e.sections![0]])
  );

  console.log(`[ELK] sections: ${sectionsMap.size}/${edges.length}`);

  return edges.map((edge) => {
    const section = sectionsMap.get(edge.id);
    if (!section) return edge;

    // Знаходимо X-offset для source ноди (bend points прив'язані до неї)
    const xOffset = nodeXOffset.get(edge.source) ?? 0;

    const scaleBack = (pt: ElkPoint): ElkPoint => ({
      // Коригуємо X якщо ELK зсунув ноди
      x: pt.x + xOffset,
      // Масштабуємо Y назад до реальних координат
      y: pt.y / Y_SCALE,
    });

    return {
      ...edge,
      data: {
        ...edge.data,
        startPoint: scaleBack(section.startPoint),
        endPoint: scaleBack(section.endPoint),
        bendPoints: (section.bendPoints ?? []).map(scaleBack),
      },
    };
  });
}
