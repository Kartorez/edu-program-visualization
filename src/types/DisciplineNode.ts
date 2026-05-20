import { Node } from '@xyflow/react';
import { Discipline } from '@/payload-types';

export type DisciplineNode = Node<Discipline & Record<string, any>>;
