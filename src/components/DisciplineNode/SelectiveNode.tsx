import './DisciplineNode.scss';

export default function SelectiveNode({ code }: { code: string }) {
  return (
    <div className="node selective">
      <div className="node__text">
        <div className="node__code">{code}</div>
      </div>
    </div>
  );
}
