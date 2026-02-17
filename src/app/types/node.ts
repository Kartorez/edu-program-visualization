export type StudyNodeKind = 'course' | 'selective' | 'practice' | `semester`;

export interface StudyNodeData extends Record<string, unknown> {
  title: string;
  subject?: string;
  semester: number;
  kind: StudyNodeKind;
}
