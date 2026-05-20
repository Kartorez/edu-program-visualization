import {
    useState,
    useMemo,
    useTransition,
    useDeferredValue,
    useCallback,
    useEffect,
} from 'react';

interface Discipline {
    id: string;
    name: string;
    code: string;
    shortName?: string;
}

interface UseMatrixStateOptions {
    disciplines: Discipline[];
    /** Hash prefix to watch, e.g. '#comp-' or '#res-' */
    hashPrefix: string;
}

export function useMatrixState({ disciplines, hashPrefix }: UseMatrixStateOptions) {
    const [highlightedCol, setHighlightedCol] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const deferredSearchQuery = useDeferredValue(searchQuery);
    const [isPending, startTransition] = useTransition();

    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [selectedCols, setSelectedCols] = useState<Set<string>>(new Set());
    const selectedColsArray = useMemo(() => Array.from(selectedCols), [selectedCols]);

    // Hash-based column highlight
    useEffect(() => {
        const handleHash = () => {
            const hash = window.location.hash;
            if (hash.startsWith(hashPrefix)) {
                const code = decodeURIComponent(hash.replace(hashPrefix, ''));
                setHighlightedCol(code);
                const el = document.getElementById(`header-${code}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            } else {
                setHighlightedCol(null);
            }
        };

        handleHash();
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, [hashPrefix]);

    const handleSearchChange = useCallback((val: string) => {
        setInputValue(val);
        startTransition(() => setSearchQuery(val));
    }, []);

    const filteredDisciplines = useMemo(() => {
        const q = deferredSearchQuery.toLowerCase();
        return disciplines.filter(
            d =>
                d.name.toLowerCase().includes(q) ||
                d.code.toLowerCase().includes(q) ||
                (d.shortName?.toLowerCase().includes(q) ?? false),
        );
    }, [disciplines, deferredSearchQuery]);

    const toggleRow = useCallback((id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedRows(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    const toggleCol = useCallback((code: string) => {
        let wasCleared = false;

        if (highlightedCol === code) {
            setHighlightedCol(null);
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
            wasCleared = true;
        }

        setSelectedCols(prev => {
            const next = new Set(prev);
            if (next.has(code)) {
                next.delete(code);
            } else if (!wasCleared) {
                next.add(code);
            }
            return next;
        });
    }, [highlightedCol]);

    const handleCellClick = useCallback((disciplineId: string, colCode: string) => {
        setSelectedRows(prev => new Set(prev).add(disciplineId));
        setSelectedCols(prev => new Set(prev).add(colCode));
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedRows(new Set());
        setSelectedCols(new Set());
    }, []);

    const hasSelection = selectedRows.size > 0 || selectedCols.size > 0;

    return {
        // search
        inputValue,
        deferredSearchQuery,
        isPending,
        handleSearchChange,
        filteredDisciplines,
        // highlight
        highlightedCol,
        // selection
        selectedRows,
        selectedCols,
        selectedColsArray,
        toggleRow,
        toggleCol,
        handleCellClick,
        clearSelection,
        hasSelection,
    };
}
