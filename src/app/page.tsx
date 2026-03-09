import styles from './styles/page.module.scss';
import HeroPage from '@/components/ui/HeroPage';

export default function Home() {
  return (
    <div>
      <HeroPage />
      <div style={{ height: '100dvh', width: '100dvw' }}></div>
    </div>
  );
}
