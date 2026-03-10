import { makeAbsPosResolver, calcContentSize } from './positions';
import { NODE_W, NODE_H, SEMESTER_W, PDF_PADDING } from '@/constants/nodeLayout';
import { DisciplineNode } from '@/types/DisciplineNode';
import * as sass from 'sass';
import path from 'path';

const { css } = sass.compile(
  path.resolve(process.cwd(), 'src/components/DisciplineNode/DisciplineNode.scss')
);
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
  getAbsPos: ReturnType<typeof makeAbsPosResolver>
): string {
  const abs = getAbsPos(node.id);
  const x = abs.x + PDF_PADDING;
  const y = abs.y + PDF_PADDING;

  if (node.id.startsWith('year-')) {
    const w = node.style?.width as number;
    const h = node.style?.height as number;
    return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:rgba(255,255,200,0.4);border:1.5px solid rgba(180,180,180,0.8);border-radius:12px;box-sizing:border-box;"></div>`;
  }

  if (node.id.startsWith('semester-')) {
    return `<div style="position:absolute;left:${x}px;top:${y}px;width:${SEMESTER_W}px;height:${NODE_H}px;box-sizing:border-box;">${buildNodeHtml(node)}</div>`;
  }

  const w = (node.style?.width as number) ?? NODE_W;
  const h = (node.style?.height as number) ?? NODE_H;
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;box-sizing:border-box;">${buildNodeHtml(node)}</div>`;
}

export function buildHtml(nodes: DisciplineNode[]): {
  html: string;
  contentW: number;
  contentH: number;
} {
  const getAbsPos = makeAbsPosResolver(nodes);
  const { maxX, maxY } = calcContentSize(nodes, getAbsPos);

  const contentW = maxX + PDF_PADDING * 2;
  const contentH = maxY + PDF_PADDING * 2;

  const A4_W = 1123;
  const A4_H = 794;

  const scale = Math.min(A4_W / contentW, A4_H / contentH);

  const nodesHtml = nodes.map((n) => buildNodeWrapper(n, getAbsPos)).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; font-family:Arial,sans-serif; }
      body { background:white; }
      :root {
        --node-w: ${NODE_W}px;
        --node-h: ${NODE_H}px;
        --semester-w: ${SEMESTER_W}px;
      }
      ${css}
    </style></head>
    <body>
      <div style="width:${A4_W}px;height:${A4_H}px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:0;left:0;transform-origin:top left;transform:scale(${scale});">
          ${nodesHtml}
        </div>
      </div>
    </body></html>`;

  return { html, contentW: A4_W, contentH: A4_H };
}
