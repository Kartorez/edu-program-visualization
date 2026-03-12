import { memo } from 'react';
import { Discipline } from '@/schemas/discipline.schema';
import { Node, NodeProps } from '@xyflow/react';
import ReqList from './ReqList';
import SemesterNode from './SemesterNode';
import SelectiveNode from './SelectiveNode';
import './DisciplineNode.scss';

type DisciplineNodeType = Node<Discipline, 'disciplineNode'>;

function getKind(code: string) {
  if (code.startsWith('ОК')) return 'discipline';
  if (code.startsWith('ВК')) return 'selective';
  return 'semester';
}

export default memo(
  function DisciplineNode({ data, id, selected }: NodeProps<DisciplineNodeType>) {
    const { code, name, shortName, prerequisites = [], postrequisites = [] } = data;
    const kind = getKind(code);
    const title = shortName ?? name;
    console.log('render', id, 'selected:', selected);
    if (kind === 'semester') return <SemesterNode title={title} />;
    if (kind === 'selective') return <SelectiveNode code={code} />;

    return (
      <div className="node discipline">
        {prerequisites.length > 0 && (
          <div className="node__prereqs">
            <ReqList ids={prerequisites} />
          </div>
        )}
        <div className="node__text">
          <div className="node__code">{code}</div>
          <div className="node__title">{title}</div>
        </div>
        {postrequisites.length > 0 && (
          <div className="node__postreqs">
            <ReqList ids={postrequisites} />
          </div>
        )}
      </div>
    );
  },
  (prev, next) => prev.data.code === next.data.code && prev.selected === next.selected
);
