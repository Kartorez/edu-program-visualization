import { memo } from 'react';
import { Node, NodeProps } from '@xyflow/react';
import ReqList from './ReqList';
import SemesterNode from './SemesterNode';
import SelectiveNode from './SelectiveNode';
import { sortByCode } from '@/shared/lib/sortByCode';
import styles from './Node.module.scss';

type DisciplineData = {
    code: string;
    name: string;
    shortName?: string;
    prerequisites: string[];
    postrequisites: string[];
};

type DisciplineNodeType = Node<DisciplineData, 'disciplineNode'>;

function getKind(code: string) {
    if (code.startsWith('ОК')) return 'discipline';
    if (code.startsWith('ВК')) return 'selective';
    return 'semester';
}

export default memo(
    function DisciplineNode({ data, selected }: NodeProps<DisciplineNodeType>) {
        const { code, name, shortName, prerequisites = [], postrequisites = [] } = data;
        const kind = getKind(code);
        const title = shortName ?? name;

        if (kind === 'semester') return <SemesterNode title={title} />;
        if (kind === 'selective') return <SelectiveNode code={code} />;

        const prereqs = sortByCode(prerequisites.filter((c) => !c.startsWith('ВК')).map(c => ({ code: c }))).map(o => o.code!);
        const postreqs = sortByCode(postrequisites.filter((c) => !c.startsWith('ВК')).map(c => ({ code: c }))).map(o => o.code!);

        return (
            <div className={`${styles.node} ${styles.discipline} ${selected ? styles.selected : ''}`}>
                {prereqs.length > 0 && (
                    <div className={styles.node__prereqs}>
                        <ReqList codes={prereqs} />
                    </div>
                )}
                <div className={styles.node__text}>
                    <div className={styles.node__code}>{code}</div>
                    <div className={styles.node__title}>{title}</div>
                </div>
                {postreqs.length > 0 && (
                    <div className={styles.node__postreqs}>
                        <ReqList codes={postreqs} />
                    </div>
                )}
            </div>
        );
    },
    (prev, next) => prev.data.code === next.data.code && prev.selected === next.selected
);