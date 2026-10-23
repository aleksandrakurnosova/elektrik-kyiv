"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const SWIPE_THRESHOLD = 50;

export default function Lightbox({ items, index, onIndexChange, onClose }) {
  const closeRef = useRef(null);
  const touchStart = useRef(null);
  const [direction, setDirection] = useState(0);

  const isOpen = index !== null && index !== undefined;
  const item = isOpen ? items[index] : null;
  const hasMany = items.length > 1;

  const go = useCallback(
    (step) => {
      if (!isOpen || !hasMany) return;
      setDirection(step);
      onIndexChange((current) => (current + step + items.length) % items.length);
    },
    [hasMany, isOpen, items.length, onIndexChange]
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };
    document.body.classList.add("lightbox-open");
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("lightbox-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [go, isOpen, onClose]);

  // Фокус лише при відкритті, а не при кожному перемиканні фото.
  useEffect(() => {
    if (isOpen) {
      setDirection(0);
      closeRef.current?.focus();
    }
  }, [isOpen]);

  function handleTouchStart(event) {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event) {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  }

  return (
    <div
      aria-label="Перегляд фото"
      aria-modal="true"
      className="lightbox"
      hidden={!isOpen}
      id="lightbox"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
      role="dialog"
    >
      <button
        aria-label="Закрити галерею"
        className="lightbox-close"
        onClick={onClose}
        ref={closeRef}
        type="button"
      >
        ×
      </button>
      {item && hasMany && (
        <>
          <div aria-live="polite" className="lightbox-counter">
            <strong>{String(index + 1).padStart(2, "0")}</strong> /{" "}
            {String(items.length).padStart(2, "0")}
          </div>
          <button
            aria-label="Попереднє фото"
            className="lightbox-nav lightbox-prev"
            onClick={() => go(-1)}
            type="button"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20">
              <path d="M16 10H4M9 5l-5 5 5 5"></path>
            </svg>
          </button>
          <button
            aria-label="Наступне фото"
            className="lightbox-nav lightbox-next"
            onClick={() => go(1)}
            type="button"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20">
              <path d="M4 10h12M11 5l5 5-5 5"></path>
            </svg>
          </button>
        </>
      )}
      {item && (
        <figure
          className="lightbox-figure"
          key={index}
          style={{ "--lightbox-dir": direction }}
        >
          {item.video ? (
            <video
              aria-label={item.alt}
              autoPlay
              controls
              playsInline
              poster={item.src}
              preload="metadata"
              src={item.video}
            />
          ) : (
            <Image
              alt={item.alt}
              height={item.height}
              sizes="90vw"
              src={item.src}
              width={item.width}
            />
          )}
          <figcaption>{item.caption}</figcaption>
        </figure>
      )}
    </div>
  );
}
