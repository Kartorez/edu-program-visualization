import Button from '@/shared/ui/Button/Button';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <div className={styles['not-found-page']}>
      <div className={styles['not-found-page__bg']}>404</div>
      <div className={styles['not-found-page__content']}>
        <h1 className={styles['not-found-page__title']}>Ой, сторінку не знайдено</h1>
        <p className={styles['not-found-page__desc']}>
          Схоже, ви перейшли за неправильним посиланням, або сторінка була переміщена. 
          Давайте повернемось до навчальних матеріалів.
        </p>
        <div className={styles['not-found-page__actions']}>
          <Button href="/" variant="primary" size="lg">
            На головну (вибір програми)
          </Button>
        </div>
      </div>
    </div>
  );
}
