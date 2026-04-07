export default function ReqList({ codes = [] }: { codes?: string[] }) {
  const needTwo = codes.length > 6;
  const half = Math.ceil(codes.length / 2);

  return (
    <div className="node__req">
      <div className="node__req-col">
        {(needTwo ? codes.slice(0, half) : codes).map((code) => (
          <span key={code}>{code}</span>
        ))}
      </div>
      {needTwo && (
        <div className="node__req-col">
          {codes.slice(half).map((code) => (
            <span key={code}>{code}</span>
          ))}
        </div>
      )}
    </div>
  );
}
