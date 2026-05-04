'use client';

interface MatrixSearchProps {
  value: string;
  onChange: (value: string) => void;
  isPending?: boolean;
  placeholder?: string;
}

export default function MatrixSearch({ 
  value, 
  onChange, 
  isPending = false,
  placeholder = "Пошук..." 
}: MatrixSearchProps) {
  return (
    <div className="matrix-search">
      <div className="matrix-search__icon-wrap">
        {isPending ? (
          <div className="matrix-search__loader" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
      </div>
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
