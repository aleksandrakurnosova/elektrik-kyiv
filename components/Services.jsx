export default function Services() {
  return (
    <section className="services section" id="services">
     <div className="section-heading">
      <div>
       <span className="section-kicker">
        Що ми робимо
       </span>
       <h2>
        Розв’язуємо завдання
        <br/>
        <em>
         будь-якої складності
        </em>
       </h2>
      </div>
      <p>
       Виконуємо побутові роботи електрика та реалізуємо повноцінні інженерні проєкти під ключ у Києві та області.
      </p>
     </div>
     <div className="services-grid">
      <a href="#contact" className="service-card">
       <div className="service-top">
        <span className="service-icon">
         <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9Z">
          </path>
          <path d="M9 21v-7h6v7">
          </path>
         </svg>
        </span>
        <span className="service-number">
         01
        </span>
       </div>
       <h3>
        Проєктування домашньої електромережі
       </h3>
       <p>
        Проєктування та прокладання проводки у квартирах і будинках — від нового щита до останньої розетки.
       </p>
       <div className="service-tags">
        <span>
         Проводка
        </span>
        <span>
         Електрощити
        </span>
        <span>
         Освітлення
        </span>
       </div>
       <div className="service-card-arrow">
        Обговорити завдання
        <svg aria-hidden="true" viewBox="0 0 20 20">
         <path d="M4 10h12M11 5l5 5-5 5">
         </path>
        </svg>
       </div>
      </a>
      <a href="#contact" className="service-card">
       <div className="service-top">
        <span className="service-icon">
         <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4">
          </circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42">
          </path>
         </svg>
        </span>
        <span className="service-number">
         02
        </span>
       </div>
       <h3>
        Підключення сонячних електростанцій
       </h3>
       <p>
        Монтаж панелей, підключення інвертора та інтеграція системи в наявну домашню мережу.
       </p>
       <div className="service-tags">
        <span>
         Панелі
        </span>
        <span>
         Інвертори
        </span>
        <span>
         Резерв
        </span>
       </div>
       <div className="service-card-arrow">
        Обговорити завдання
        <svg aria-hidden="true" viewBox="0 0 20 20">
         <path d="M4 10h12M11 5l5 5-5 5">
         </path>
        </svg>
       </div>
      </a>
      <a href="#contact" className="service-card">
       <div className="service-top">
        <span className="service-icon">
         <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 8.4 7.2 6.1 4.9a4 4 0 0 0 5 5L19.2 18a2 2 0 0 1-2.8 2.8l-8.1-8.1a4 4 0 0 1-5-5l2.3 2.3 3.6-3.6-2.3-2.3">
          </path>
         </svg>
        </span>
        <span className="service-number">
         03
        </span>
       </div>
       <h3>
        Комплексні електромонтажні роботи
       </h3>
       <p>
        Комплексні роботи для житлових і комерційних об’єктів — акуратно, безпечно та за проєктом.
       </p>
       <div className="service-tags">
        <span>
         Монтаж
        </span>
        <span>
         Модернізація
        </span>
        <span>
         Діагностика
        </span>
       </div>
       <div className="service-card-arrow">
        Обговорити завдання
        <svg aria-hidden="true" viewBox="0 0 20 20">
         <path d="M4 10h12M11 5l5 5-5 5">
         </path>
        </svg>
       </div>
      </a>
      <a href="#backup-power" className="service-card">
       <div className="service-top">
        <span className="service-icon">
         <svg aria-hidden="true" viewBox="0 0 24 24">
          <rect height="14" rx="2" width="18" x="3" y="5">
          </rect>
          <circle cx="9" cy="12" r="3">
          </circle>
          <path d="M15 10h3M15 14h3M7 2h10M6 22v-3M18 22v-3">
          </path>
         </svg>
        </span>
        <span className="service-number">
         04
        </span>
       </div>
       <h3>
        Генератори та резервне живлення
       </h3>
       <p>
        Підключення генератора, інвертора, акумуляторів чи EcoFlow до мережі з ручним перемикачем або АВР.
       </p>
       <div className="service-tags">
        <span>
         Генератори
        </span>
        <span>
         АВР
        </span>
        <span>
         Захист
        </span>
       </div>
       <div className="service-card-arrow">
        Варіанти резервного живлення
        <svg aria-hidden="true" viewBox="0 0 20 20">
         <path d="M4 10h12M11 5l5 5-5 5">
         </path>
        </svg>
       </div>
      </a>
     </div>
    </section>
  );
}
