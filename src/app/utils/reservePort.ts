import type { PortUsage, Side } from '@/types/graph';

export default function reservePort(
  usage: Record<string, PortUsage>,
  nodeId: string,
  side: Side
): string {
  if (!usage[nodeId]) {
    usage[nodeId] = { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const index = usage[nodeId][side]++;
  return `${side}-${index}`;
}
