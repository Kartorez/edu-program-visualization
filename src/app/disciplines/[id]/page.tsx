import DisciplineView from '@/components/DisciplineView/DisciplineView';

export default async function DisciplinePage({ params }: { params: { id: string } }) {
  return <DisciplineView />;
}
