"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "./Lightbox";

const works = [
  {
    src: "/images/work-1.png",
    width: 1445,
    height: 1088,
    caption: "Перемикач «Мережа / Інвертор» у щиті",
    alt: "Електрощит із перемикачем мережа–інвертор для резервного живлення будинку",
  },
  {
    src: "/images/work-2.png",
    width: 1008,
    height: 1561,
    caption: "Стійка акумуляторів Deye",
    alt: "Змонтована стійка літієвих акумуляторів Deye для резервного живлення",
  },
  {
    src: "/images/work-3.png",
    width: 1445,
    height: 1088,
    caption: "Збірка електрощита з лічильником",
    alt: "Збірка електрощита з автоматами, ПЗВ та лічильником енергії Eastron",
  },
  {
    src: "/images/work-4.png",
    width: 1088,
    height: 1445,
    caption: "DC-бокс сонячної електростанції",
    alt: "DC-бокс сонячної електростанції із запобіжниками та захистом від перенапруги",
  },
  {
    src: "/images/invertor-deye.jpg",
    width: 964,
    height: 1280,
    caption: "Гібридний інвертор Deye",
    alt: "Гібридний інвертор Deye із захисним боксом, змонтований на стіні",
  },
  {
    src: "/images/avr-merezha-invertor.jpg",
    width: 720,
    height: 1280,
    caption: "АВР «Мережа / Інвертор» у щиті",
    alt: "Автоматичне введення резерву мережа–інвертор у щиті з реле напруги та ПЗВ",
  },
  {
    src: "/images/rezervne-zhyvlennia-poster.jpg",
    video: "/images/rezervne-zhyvlennia-obiekt.mp4",
    width: 720,
    height: 1280,
    caption: "Відео: система резервного живлення на об’єкті",
    alt: "Відеоогляд системи резервного живлення: інвертор, DC-бокс і стійка акумуляторів Deye",
    label: "▶",
  },
];

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="gallery section" id="gallery">
      <div className="section-heading gallery-heading">
        <div>
          <span className="section-kicker">Наші роботи</span>
          <h2>
            Результат видно
            <br />у деталях
          </h2>
        </div>
        <p>
          Приклади електромонтажу, підключення щитів, інверторів, сонячних
          панелей і резервного живлення.
        </p>
      </div>
      <div className="gallery-grid">
        {works.map((work, index) => (
          <button
            aria-label={`${work.video ? "Відтворити відео" : "Відкрити фото"}: ${work.caption}`}
            className={`gallery-item gallery-item-${index + 1}`}
            key={work.src}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <Image
              alt={work.alt}
              height={work.height}
              sizes="(max-width: 760px) 100vw, (max-width: 1050px) 50vw, 40vw"
              src={work.src}
              width={work.width}
            />
            {work.label && (
              <span>
                <small>{work.label}</small>
                {work.caption}
              </span>
            )}
          </button>
        ))}
      </div>
      <Lightbox
        index={activeIndex}
        items={works}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </section>
  );
}
