import { Panel } from '@xyflow/react';
import { useState } from 'react';
import { Button } from '@/shared/ui';

export default function DownloadButton() {
    const [loading, setLoading] = useState(false);

    const onClick = async () => {
        setLoading(true);
        try {
            const id = document.cookie
                .split('; ')
                .find((row) => row.startsWith('programVersionId='))
                ?.split('=')[1];

            const res = await fetch(`/api/export-pdf${id ? `?id=${id}` : ''}`);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            Object.assign(document.createElement('a'), {
                href: url,
                download: 'study-plan.pdf',
            }).click();
            URL.revokeObjectURL(url);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Panel position="top-right" className="download-panel download-panel--desktop">
            <Button className="button--sm download-button" disabled={loading} onClick={onClick}>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="download-icon"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span className="download-text">{loading ? 'генерація...' : 'Зберегти PDF'}</span>
            </Button>
        </Panel>
    );
}