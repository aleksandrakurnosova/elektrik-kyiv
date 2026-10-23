"use client";

import { useEffect, useImperativeHandle, useRef } from "react";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TOKEN_TIMEOUT_MS = 45000;

let scriptPromise = null;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.turnstile);
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error("Turnstile script failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

// Невидимий за замовчуванням віджет Cloudflare Turnstile (Managed mode задається в Dashboard).
// Батьківський компонент отримує токен через ref: getToken() і reset().
export default function Turnstile({ siteKey, action, ref }) {
  const containerRef = useRef(null);
  const widgetId = useRef(null);
  const token = useRef(null);
  const failed = useRef(false);
  const waiters = useRef([]);
  const startLoading = useRef(null);

  function settle(value, error) {
    const pending = waiters.current;
    waiters.current = [];
    pending.forEach(({ resolve, reject, timer }) => {
      clearTimeout(timer);
      if (error) reject(error);
      else resolve(value);
    });
  }

  useEffect(() => {
    if (!siteKey) {
      console.error("[turnstile] NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set");
      return;
    }

    const container = containerRef.current;
    const form = container?.closest("form");
    let cancelled = false;
    let started = false;

    const render = async () => {
      if (started) return;
      started = true;
      try {
        const turnstile = await loadTurnstile();
        if (cancelled || widgetId.current !== null) return;
        widgetId.current = turnstile.render(container, {
          sitekey: siteKey,
          action,
          theme: "dark",
          size: "flexible",
          language: "uk",
          appearance: "interaction-only",
          "refresh-expired": "auto",
          callback: (value) => {
            token.current = value;
            failed.current = false;
            settle(value);
          },
          "expired-callback": () => {
            token.current = null;
          },
          "timeout-callback": () => {
            token.current = null;
          },
          "error-callback": (code) => {
            token.current = null;
            failed.current = true;
            settle(null, new Error(`Turnstile error ${code}`));
          },
        });
      } catch (error) {
        started = false;
        failed.current = true;
        settle(null, error);
      }
    };
    startLoading.current = render;

    // Скрипт вантажимо, коли форма поруч або користувач почав її заповнювати.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          render();
        }
      },
      { rootMargin: "600px" }
    );
    if (form) {
      observer.observe(form);
      form.addEventListener("focusin", render, { once: true });
    } else {
      render();
    }

    return () => {
      cancelled = true;
      observer.disconnect();
      form?.removeEventListener("focusin", render);
      if (widgetId.current !== null) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey, action]);

  useImperativeHandle(ref, () => ({
    getToken() {
      if (!siteKey) return Promise.resolve(null);
      if (token.current) return Promise.resolve(token.current);

      if (failed.current && widgetId.current !== null) {
        failed.current = false;
        window.turnstile?.reset(widgetId.current);
      }
      startLoading.current?.();

      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          waiters.current = waiters.current.filter((w) => w.timer !== timer);
          reject(new Error("Turnstile timeout"));
        }, TOKEN_TIMEOUT_MS);
        waiters.current.push({ resolve, reject, timer });
      });
    },
    // Токен одноразовий: після кожної спроби відправки потрібен новий.
    reset() {
      token.current = null;
      if (widgetId.current !== null) window.turnstile?.reset(widgetId.current);
    },
  }));

  return <div className="turnstile-box" ref={containerRef} />;
}
