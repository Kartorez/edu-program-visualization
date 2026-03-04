import { Discipline } from '@/schemas/discipline.schema';
import ReqList from './ReqList';
import './DisciplineNode.scss';

interface Props {
  data: Discipline;
}

export default function DisciplineNode({ data }: Props) {
  const {
    code,
    name,
    shortName,
    prerequisites = [],
    postrequisites = [],
  } = data;

  const title = shortName ?? name;
  const kind = code.startsWith('ОК')
    ? 'course'
    : code.startsWith('ВК')
      ? 'selective'
      : 'semester';

  if (kind === 'semester') {
    return (
      <div className="node semester">
        <div className="node__text">
          <div className="node__title">{title}</div>
        </div>
      </div>
    );
  } else if (kind === 'selective') {
    return (
      <div className="node selective">
        <div className="node__text">
          <div className="node__code">{code}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`node discipline`}>
      {prerequisites?.length > 0 && (
        <div className="node__prereqs">
          <ReqList ids={prerequisites} />
        </div>
      )}
      <div className="node__text">
        <div className="node__code">{code}</div>
        <div className="node__title">{title}</div>
      </div>
      {postrequisites?.length > 0 && (
        <div className="node__postreqs">
          <ReqList ids={postrequisites} />
        </div>
      )}
    </div>
  );
}
