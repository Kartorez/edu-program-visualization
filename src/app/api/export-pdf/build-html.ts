import { DisciplineNode } from '@/types/DisciplineNode';
import { makeAbsPosResolver, calcContentSize } from './positions';

const PAD = 40;
const CSS = `
  * { margin:0; padding:0; box-sizing:border-box; font-family:Arial,sans-serif; }
  body { background:white; }
  .node { display:flex; align-items:stretch; width:100%; height:100%; color:#000; font-size:11px; border:1px solid #aaa; border-radius:3px; overflow:hidden; }
  .node__text { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:4px; padding:2px; }
  .node__code { font-weight:600; white-space:nowrap; }
  .node__title { font-size:10px; line-height:1.2; word-break:break-word; hyphens:auto; }
  .node__req { display:flex; height:100%; }
  .node__req-col { display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:8px; line-height:1.3; padding:0 2px; }
  .node__req-col + .node__req-col { border-left:1px solid #aaa; }
  .node__req-col span { white-space:nowrap; }
  .node__prereqs, .node__postreqs { flex-shrink:0; display:flex; align-items:center; justify-content:center; }
  .node__prereqs { background:#f8d7e3; border-right:1px solid #aaa; }
  .node__postreqs { background:#e6f0ff; border-left:1px solid #aaa; }
  .semester { background:#dae8fc; border-color:#6c8ebf; width:100px; }
  .discipline { background:#fff2cc; border-color:#d6b656; }
  .selective { background:#d5e8d4; border-color:#82b366; }
`;

function buildReqList(ids: string[]): string {
  if (!ids.length) return '';
  const needTwo = ids.length > 6;
  const half = Math.ceil(ids.length / 2);
  const col1 = (needTwo ? ids.slice(0, half) : ids).map((id) => `<span>${id}</span>`).join('');
  const col2 = needTwo
    ? `<div class="node__req-col">${ids
        .slice(half)
        .map((id) => `<span>${id}</span>`)
        .join('')}</div>`
    : '';
  return `<div class="node__req"><div class="node__req-col">${col1}</div>${col2}</div>`;
}

function buildNodeHtml(node: DisciplineNode): string {
  const { code, name, shortName, prerequisites, postrequisites } = node.data;
  const title = shortName ?? name;

  if (!code) {
    return `<div class="node semester"><div class="node__text"><div class="node__title">${title}</div></div></div>`;
  }

  if (code.startsWith('ВК')) {
    return `<div class="node selective"><div class="node__text"><div class="node__code">${code}</div></div></div>`;
  }

  return `<div class="node discipline">
    ${prerequisites.length ? `<div class="node__prereqs">${buildReqList(prerequisites)}</div>` : ''}
    <div class="node__text">
      <div class="node__code">${code}</div>
      <div class="node__title">${title}</div>
    </div>
    ${postrequisites.length ? `<div class="node__postreqs">${buildReqList(postrequisites)}</div>` : ''}
  </div>`;
}

function buildNodeWrapper(
  node: DisciplineNode,
  getAbsPos: ReturnType<typeof makeAbsPosResolver>,
  _scale: number // не використовуємо — scale через transform на батьку
): string {
  const abs = getAbsPos(node.id);
  const x = abs.x + PAD;
  const y = abs.y + PAD;

  if (node.id.startsWith('year-')) {
    const w = node.style?.width as number;
    const h = node.style?.height as number;
    return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:rgba(255,255,200,0.4);border:1.5px solid rgba(180,180,180,0.8);border-radius:12px;box-sizing:border-box;"></div>`;
  }

  if (node.id.startsWith('semester-')) {
    return `<div style="position:absolute;left:${x}px;top:${y}px;width:100px;height:90px;box-sizing:border-box;">${buildNodeHtml(node)}</div>`;
  }

  const w = (node.style?.width as number) ?? 140;
  const h = (node.style?.height as number) ?? 90;
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;box-sizing:border-box;">${buildNodeHtml(node)}</div>`;
}

export function buildHtml(nodes: DisciplineNode[]): {
  html: string;
  contentW: number;
  contentH: number;
} {
  const getAbsPos = makeAbsPosResolver(nodes);
  const { maxX, maxY } = calcContentSize(nodes, getAbsPos);

  const PAD = 40;
  const contentW = maxX + PAD * 2;
  const contentH = maxY + PAD * 2;

  const A4_W = 1123;
  const A4_H = 794;

  const scale = Math.min(A4_W / contentW, A4_H / contentH);

  const nodesHtml = nodes.map((n) => buildNodeWrapper(n, getAbsPos, scale)).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>${CSS}</style></head>
    <body><div style="width:${A4_W}px;height:${A4_H}px;position:relative;overflow:hidden;">
    <div style="position:absolute;top:0;left:0;transform-origin:top left;transform:scale(${scale});">
    ${nodesHtml}
    </div></div></body></html>`;

  return { html, contentW: A4_W, contentH: A4_H };
}
