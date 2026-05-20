import './DisciplineNode.scss';

export default function SemesterNode({ title }: { title: string }) {
  return (
    <div className="node semester">
      <div className="node__text">
        <div className="node__title">{title}</div>
      </div>
    </div>
  );
}
