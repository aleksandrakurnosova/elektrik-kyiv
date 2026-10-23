// Спільна валідація форми заявки для клієнта та API.

export const LIMITS = { name: 80, phone: 20, message: 2000 };

export const PHONE_ERROR =
  "Вкажіть український номер у форматі +380 XX XXX XX XX або 0XX XXX XX XX.";

// Повертає 9 цифр національного номера (без +380 / 0) або null.
export function nationalDigits(phone) {
  const digits = String(phone).replace(/\D/g, "");
  let national = null;
  if (digits.length === 12 && digits.startsWith("380")) national = digits.slice(3);
  else if (digits.length === 10 && digits.startsWith("0")) national = digits.slice(1);
  // Код оператора/міста не починається з 0: 044, 067, 093 тощо.
  return national && /^[1-9]\d{8}$/.test(national) ? national : null;
}

export function isValidUaPhone(phone) {
  return nationalDigits(phone) !== null;
}

// Канонічний вигляд для листа: +380 67 123 45 67.
export function formatUaPhone(phone) {
  const n = nationalDigits(phone);
  if (!n) return String(phone).trim();
  return `+380 ${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 7)} ${n.slice(7)}`;
}

export function toE164(phone) {
  const n = nationalDigits(phone);
  return n ? `+380${n}` : null;
}

function group(digits, sizes) {
  const parts = [];
  let i = 0;
  for (const size of sizes) {
    if (i >= digits.length) break;
    parts.push(digits.slice(i, i + size));
    i += size;
  }
  return parts.join(" ");
}

// Форматування «на льоту» під час введення. Підтримує 0XX… та +380…
export function formatPhoneInput(value) {
  const raw = String(value);
  let digits = raw.replace(/\D/g, "");
  if (!digits) return raw.trim().startsWith("+") ? "+" : "";

  if (digits.startsWith("0")) {
    return group(digits.slice(0, 10), [3, 3, 2, 2]);
  }

  // Старий формат «8 0XX…» → +380XX…
  if (digits.startsWith("80")) digits = "3" + digits;
  // Користувач почав із коду оператора без 0 (напр. 67…) — додаємо +380.
  else if (!"380".startsWith(digits.slice(0, 3)) || !digits.startsWith("3")) {
    digits = "380" + digits;
  }
  digits = digits.slice(0, 12);
  if (digits.length <= 3) return "+" + digits;
  return "+380 " + group(digits.slice(3), [2, 3, 2, 2]);
}

// Опис завдання необов’язковий — перевіряємо лише ім’я та телефон.
export function validateContact({ name, phone }) {
  const errors = {};

  if (name.length < 2) errors.name = "Вкажіть ім’я (мінімум 2 символи).";
  if (!phone) errors.phone = "Вкажіть номер телефону.";
  else if (!isValidUaPhone(phone)) errors.phone = PHONE_ERROR;

  return errors;
}
