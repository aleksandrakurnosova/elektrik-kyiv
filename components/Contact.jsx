"use client";

import { useEffect, useRef, useState } from "react";
import { formatPhoneInput, LIMITS, validateContact } from "../lib/contact";
import { EMAIL, PHONE_DISPLAY, PHONE_HREF } from "../lib/site";
import Turnstile from "./Turnstile";

const COOLDOWN_MS = 60 * 1000;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// Форматує номер під час введення і зберігає позицію курсора за кількістю цифр.
function handlePhoneInput(event, lastValue) {
  const input = event.target;
  const value = input.value;
  const caret = input.selectionStart ?? value.length;
  let digits = value.replace(/\D/g, "");
  let digitsBefore = value.slice(0, caret).replace(/\D/g, "").length;

  // Backspace по пробілу видаляє попередню цифру, а не роздільник.
  const deletedSeparator =
    event.nativeEvent?.inputType === "deleteContentBackward" &&
    digits === lastValue.replace(/\D/g, "") &&
    digitsBefore > 0;
  if (deletedSeparator) {
    digits = digits.slice(0, digitsBefore - 1) + digits.slice(digitsBefore);
    digitsBefore -= 1;
  }

  const source = value.trim().startsWith("+") ? "+" + digits : digits;
  const formatted = formatPhoneInput(source);
  const formattedDigits = formatted.replace(/\D/g, "");
  // Форматер може додати «380» на початку — зсуваємо курсор на ці цифри.
  if (formattedDigits.length > digits.length && formattedDigits.endsWith(digits)) {
    digitsBefore += formattedDigits.length - digits.length;
  }

  let position = formatted.length;
  if (digitsBefore < formattedDigits.length) {
    let seen = 0;
    for (let i = 0; i < formatted.length; i += 1) {
      if (/\d/.test(formatted[i])) seen += 1;
      if (seen === digitsBefore) {
        position = i + 1;
        break;
      }
    }
    if (digitsBefore === 0) position = formatted.startsWith("+") ? 1 : 0;
  }

  input.value = formatted;
  if (document.activeElement === input) input.setSelectionRange(position, position);
  return formatted;
}

export default function Contact() {
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const startedAt = useRef(0);
  const lastSentAt = useRef(0);
  const formRef = useRef(null);
  const turnstileRef = useRef(null);
  const lastPhone = useRef("");
  // Синхронний замок: React-стан не встигає оновитися між швидкими Enter.
  const submitting = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function clearFieldError(e) {
    const { name } = e.target;
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function onPhoneInput(e) {
    lastPhone.current = handlePhoneInput(e, lastPhone.current);
    clearFieldError(e);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting.current) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    const fieldErrors = validateContact(data);
    setErrors(fieldErrors);
    setServerError("");
    const firstInvalid = Object.keys(fieldErrors)[0];
    if (firstInvalid) {
      form.elements[firstInvalid]?.focus();
      return;
    }

    if (Date.now() - lastSentAt.current < COOLDOWN_MS) {
      setServerError("Заявку вже надіслано. Зачекайте хвилину перед повторною відправкою.");
      setStatus("error");
      return;
    }

    submitting.current = true;
    setStatus("loading");

    try {
      let turnstileToken;
      try {
        turnstileToken = await turnstileRef.current?.getToken();
      } catch {
        throw new Error("Не вдалося пройти перевірку безпеки");
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          hp_check: formData.get("hp_check"),
          elapsed: Date.now() - startedAt.current,
          turnstileToken,
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.error || "Помилка відправлення");
      }

      lastSentAt.current = Date.now();
      form.reset();
      lastPhone.current = "";
      setStatus("success");
    } catch (error) {
      // Мережеві помилки браузера англійською — показуємо власний текст.
      const reason =
        error instanceof TypeError ? "Немає з’єднання з сервером." : error.message;
      setServerError(
        `${reason.replace(/\.$/, "")}. Спробуйте ще раз або зателефонуйте ${PHONE_DISPLAY}.`
      );
      setStatus("error");
    } finally {
      // Токен Turnstile одноразовий — готуємо новий для наступної спроби.
      turnstileRef.current?.reset();
      submitting.current = false;
    }
  }

  function handleReset() {
    setStatus("idle");
    setErrors({});
    setServerError("");
    startedAt.current = Date.now();
    requestAnimationFrame(() => formRef.current?.elements.name?.focus());
  }

  const isLoading = status === "loading";

  return (
    <section className="contact section" id="contact">
      <div className="contact-copy">
        <span className="section-kicker">Обговорімо ваш проєкт</span>
        <h2>
          Розкажіть,
          <br />
          що потрібно підключити
        </h2>
        <p>
          Відповімо на запитання, оцінимо завдання та запропонуємо відповідне
          рішення — від ремонту проводки до резервного живлення квартири чи
          будинку.
        </p>
        <div className="contact-details">
          <a href={PHONE_HREF}>
            <small>ТЕЛЕФОН</small>
            <strong>{PHONE_DISPLAY}</strong>
          </a>
          <a href={`mailto:${EMAIL}`}>
            <small>EMAIL</small>
            <strong>{EMAIL}</strong>
          </a>
          <div>
            <small>ГЕОГРАФІЯ</small>
            <strong>Київ та Київська область</strong>
          </div>
        </div>
      </div>
      <form
        aria-busy={isLoading}
        className="contact-form"
        hidden={status === "success"}
        id="contact-form"
        noValidate
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <label>
          Ваше ім’я
          <input
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            enterKeyHint="send"
            maxLength={LIMITS.name}
            name="name"
            onInput={clearFieldError}
            placeholder="Як до вас звертатися?"
            required
            type="text"
          />
          {errors.name && (
            <span className="field-error" id="contact-name-error">
              {errors.name}
            </span>
          )}
        </label>
        <label>
          Номер телефону
          <input
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
            aria-invalid={Boolean(errors.phone)}
            autoComplete="tel"
            enterKeyHint="send"
            inputMode="tel"
            name="phone"
            onInput={onPhoneInput}
            placeholder="+380 XX XXX XX XX"
            required
            type="tel"
          />
          {errors.phone && (
            <span className="field-error" id="contact-phone-error">
              {errors.phone}
            </span>
          )}
        </label>
        <label>
          Що потрібно зробити? (необов’язково)
          <textarea
            maxLength={LIMITS.message}
            name="message"
            placeholder="Напр.: підключити генератор або EcoFlow до щита"
            rows="3"
          ></textarea>
        </label>
        {/* Пастка для ботів. Назва без змісту, щоб автозаповнення браузера
            і менеджери паролів її не заповнювали. */}
        <label aria-hidden="true" className="form-trap">
          Не заповнюйте це поле
          <input
            autoComplete="off"
            data-1p-ignore="true"
            data-lpignore="true"
            name="hp_check"
            tabIndex={-1}
            type="text"
          />
        </label>
        <Turnstile action="contact" ref={turnstileRef} siteKey={TURNSTILE_SITE_KEY} />
        <button className="button button-primary" disabled={isLoading} type="submit">
          {isLoading ? "Надсилаємо…" : "Отримати консультацію"}
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path d="M4 10h12M11 5l5 5-5 5"></path>
          </svg>
        </button>
        {status === "error" && serverError && (
          <div className="form-error" role="alert">
            {serverError}
          </div>
        )}
        <p>Натискаючи кнопку, ви погоджуєтеся на обробку контактних даних</p>
      </form>
      <div className="form-success" hidden={status !== "success"} id="form-success" role="status">
        <span>✓</span>
        <h3>Дякуємо за заявку!</h3>
        <p>Ми зв’яжемося з вами найближчим робочим часом.</p>
        <button id="form-reset" onClick={handleReset} type="button">
          Надіслати ще одну
        </button>
      </div>
    </section>
  );
}
