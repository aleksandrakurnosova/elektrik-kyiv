const options = [
  {
    title: "Підключення генератора",
    text: "Вводимо генератор у щит через перекидний рубильник — без живлення через розетку та ризику зворотної напруги в мережу.",
    tags: ["Рубильник", "Захист"],
    icon: (
      <>
        <rect height="12" rx="2" width="18" x="3" y="7"></rect>
        <path d="M7 7V4h4v3M7 19v2M17 19v2M13 10l-2 3h3l-2 3"></path>
      </>
    ),
  },
  {
    title: "АВР — автоматичний перехід",
    text: "Монтуємо автоматичне введення резерву: живлення перемикається на генератор чи інвертор без вашої участі.",
    tags: ["Автоматика", "Без участі"],
    icon: (
      <>
        <path d="M4 8h13l-3-3M20 16H7l3 3"></path>
      </>
    ),
  },
  {
    title: "Інвертор та акумулятори",
    text: "Безперебійне живлення для котла, насоса, холодильника, роутера й освітлення з розрахунком часу автономної роботи.",
    tags: ["ДБЖ", "Котел", "Роутер"],
    icon: (
      <>
        <rect height="12" rx="2" width="16" x="3" y="7"></rect>
        <path d="M21 11v4M7 11v4M11 11v4"></path>
      </>
    ),
  },
  {
    title: "EcoFlow та зарядні станції",
    text: "Підключаємо EcoFlow та інші станції до проводки квартири через перемикач «мережа / резерв», без кабелю «вилка-вилка».",
    tags: ["EcoFlow", "Квартира"],
    icon: (
      <>
        <path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4"></path>
      </>
    ),
  },
  {
    title: "Сонячна та гібридна система",
    text: "Інтегруємо сонячні панелі з гібридним інвертором, щоб будинок у Київській області менше залежав від графіків.",
    tags: ["Панелі", "Гібрид"],
    icon: (
      <>
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"></path>
      </>
    ),
  },
];

export default function BackupPower() {
  return (
    <section className="backup section" id="backup-power">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Резервне живлення</span>
          <h2>
            Шлях до автономії
            <br />
            <em></em>
          </h2>
        </div>
        <p>
          Графіки відключень у Києві та на Київщині змінюються щодня. Підбираємо
          й безпечно підключаємо резервне живлення для квартири, будинку чи
          офісу під ваше навантаження.
        </p>
      </div>
      <ul className="backup-grid">
        {options.map((option) => (
          <li className="backup-card" key={option.title}>
            <span className="service-icon backup-icon">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                {option.icon}
              </svg>
            </span>
            <div className="backup-body">
              <h3>{option.title}</h3>
              <p>{option.text}</p>
              <div className="service-tags">
                {option.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
