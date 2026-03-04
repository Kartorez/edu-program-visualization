export default function ReqList({ ids }: { ids: string[] }) {
  const needTwo = ids.length > 6;
  const half = Math.ceil(ids.length / 2);

  return (
    <div className="node__req">
      <div className="node__req-col">
        {(needTwo ? ids.slice(0, half) : ids).map((id) => (
          <span key={id}>{`${id}`}</span>
        ))}
      </div>
      {needTwo && (
        <div className="node__req-col">
          {ids.slice(half).map((id) => (
            <span key={id}>{` ${id}`}</span>
          ))}
        </div>
      )}
    </div>
  );
}
