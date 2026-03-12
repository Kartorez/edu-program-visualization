import './Navbar.scss';
import Button from '../Button/Button';

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav__logo">КН · ВНАУ</div>
      <div className="nav__links">
        <Button href="/plan"> Навчальний план →</Button>
      </div>
    </nav>
  );
}
