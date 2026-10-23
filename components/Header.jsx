import { PHONE_DISPLAY, PHONE_HREF } from "../lib/site";

export default function Header() {
  return (
    <header className="site-header">
     <a aria-label="Вольт — на головну" className="brand" href="#top">
      <span className="brand-mark">
       <span>
        ϟ
       </span>
      </span>
      <span className="brand-name">
       ВОЛЬТ
      </span>
     </a>
     <nav aria-label="Головна навігація" className="desktop-nav">
      <a href="#services">
       Послуги
      </a>
      <a href="#backup-power">
       Резервне живлення
      </a>
      <a href="#gallery">
       Роботи
      </a>
      <a href="#contact">
       Контакти
      </a>
     </nav>
     <a className="header-phone" href={PHONE_HREF}>
      <span className="phone">
       {PHONE_DISPLAY}
      </span>
      {/* <span aria-hidden="true" className="phone-dot">
      </span> */}
     </a>
    </header>
  );
}
