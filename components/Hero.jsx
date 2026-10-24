export default function Hero() {
  return (
    <section className="hero" id="top">
     <div aria-hidden="true" className="hero-grid">
     </div>
     <div aria-hidden="true" className="hero-spark hero-spark-one">
     </div>
     <div aria-hidden="true" className="hero-spark hero-spark-two">
     </div>
     <div className="hero-copy">
      <h1>
       <span className="eyebrow">
        <span>
        </span>
        Електрик у Києві та області
       </span>
       Електрика,
       <br/>
       на яку можна
       <br/>
       <em>
        покластися.
       </em>
      </h1>
      <p>
       Від нової розетки до повної електросистеми будинку. Проєктуємо, монтуємо та безпечно підключаємо резервне живлення: генератори, інвертори, акумулятори й зарядні станції.
      </p>
      <div className="hero-actions">
       <a className="button button-primary" href="#contact">
        Розрахувати вартість
        <svg aria-hidden="true" viewBox="0 0 20 20">
         <path d="M4 10h12M11 5l5 5-5 5">
         </path>
        </svg>
       </a>
       <a className="button button-ghost" href="#services">
        Наші послуги
       </a>
      </div>
      <div className="hero-trust">
       <div aria-hidden="true" className="avatar-stack">
        <span>
         В
        </span>
        <span>
         О
        </span>
        <span>
         Л
        </span>
       </div>
       <div className="hero-stats">
        <p>
         <strong>
          250+ об’єктів
         </strong>
         <br/>
         успішно підключено
        </p>
        <p>
         <strong>
          25 років
         </strong>
         <br/>
         досвіду
        </p>
       </div>
      </div>
     </div>
     <div aria-label="Візуалізація надійної електросистеми" className="power-visual">
      <div className="power-line power-line-a">
      </div>
      <div className="power-line power-line-b">
      </div>
      <div className="power-orbit orbit-one">
      </div>
      <div className="power-orbit orbit-two">
      </div>
      <div className="power-core">
       <div className="core-glow">
       </div>
       <span>
        ϟ
       </span>
      </div>
      <div className="status-card status-main">
       <span className="status-icon">
        ✓
       </span>
       <span>
        <small>
         СИСТЕМА
        </small>
        <strong>
         Працює стабільно
        </strong>
       </span>
      </div>
      <div className="status-card status-voltage">
       <span className="pulse">
       </span>
       <span>
        <small>
         НАПРУГА
        </small>
        <strong>
         220 V
        </strong>
       </span>
      </div>
      <div className="wire-label wire-label-one">
       01
      </div>
      <div className="wire-label wire-label-two">
       04
      </div>
     </div>
    </section>
  );
}
