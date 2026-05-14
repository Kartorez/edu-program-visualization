export default function RequisiteList({
  title,
  ids,
  labelMap,
  onFocusNode,
  variant = 'pre',
}: {
  title: string;
  ids: string[];
  labelMap: Map<string, string>;
  onFocusNode: (code: string) => void;
  variant?: 'pre' | 'post';
}) {
  return (
    <div className="requisite-list">
      <p className="requisite-list__title">{title}</p>
      {ids.length ? (
        <ul className="requisite-list__list">
          {ids.map((id) => (
            <li
              key={id}
              className={`requisite-list__item requisite-list__item--${variant}`}
              onClick={() => onFocusNode(id)}
              style={{ cursor: 'pointer' }}
            >
              <span className="requisite-list__link">
                {labelMap.get(id) ?? id}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="requisite-list__empty">Немає</p>
      )}
    </div>
  );
}
