import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Resend } from "resend";
import { EMAIL, SITE_URL } from "../../../lib/site";
import { formatUaPhone, LIMITS, toE164, validateContact } from "../../../lib/contact";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || EMAIL;
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "Сайт ВОЛЬТ <onboarding@resend.dev>";

// Мінімальний час заповнення форми людиною; швидше — майже напевно бот.
const MIN_FILL_MS = 3000;
const MAX_BODY_BYTES = 10_000;
const TURNSTILE_ACTION = "contact";
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_FAILED = "Не вдалося підтвердити, що ви не робот.";
const MAX_TOKEN_LENGTH = 2048;
const SITEVERIFY_TIMEOUT_MS = 10_000;

// Токен дійсний лише для форми на цих доменах (localhost сюди не додаємо).
const siteHost = new URL(SITE_URL).hostname.replace(/^www\./, "");
const ALLOWED_HOSTNAMES = (process.env.TURNSTILE_ALLOWED_HOSTNAMES || `${siteHost},www.${siteHost}`)
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function json(body, status = 200) {
  return Response.json(body, { status });
}

function getClientIp(request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

// Workers Rate Limiting API: лічильник спільний для всіх ізолятів у локації Cloudflare,
// на відміну від пам'яті процесу. Поза Workers (next start) біндинга немає.
async function isRateLimited(ip) {
  let limiter;
  try {
    limiter = getCloudflareContext().env.CONTACT_RATE_LIMITER;
  } catch {
    limiter = undefined;
  }
  if (!limiter) {
    console.warn("[contact] CONTACT_RATE_LIMITER binding is unavailable");
    return false;
  }
  const { success } = await limiter.limit({ key: `contact:${ip}` });
  return !success;
}

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("[contact] TURNSTILE_SECRET_KEY is not set");
    return { ok: false, status: 500, error: "Сервіс тимчасово недоступний." };
  }
  if (!token || token.length > MAX_TOKEN_LENGTH) {
    return { ok: false, status: 403, error: "Не вдалося пройти перевірку безпеки." };
  }

  let outcome;
  try {
    const form = new URLSearchParams({ secret, response: token });
    if (ip !== "unknown") form.append("remoteip", ip);
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(SITEVERIFY_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`Siteverify HTTP ${response.status}`);
    outcome = await response.json();
  } catch (error) {
    console.error("[contact] Siteverify request failed:", error);
    return { ok: false, status: 502, error: "Не вдалося перевірити захист від ботів." };
  }

  if (!outcome.success) {
    const codes = outcome["error-codes"] || [];
    console.warn("[contact] Turnstile rejected:", codes.join(","));
    const expired = codes.includes("timeout-or-duplicate");
    return {
      ok: false,
      status: 403,
      error: expired ? "Перевірка безпеки застаріла." : TURNSTILE_FAILED,
    };
  }
  // Тестові ключі Cloudflare не повертають реальних action/hostname — їх пропускаємо.
  // На продакшні секрет справжній, тож ця гілка там недосяжна.
  if (!outcome.metadata?.result_with_testing_key) {
    if (outcome.action !== TURNSTILE_ACTION || !ALLOWED_HOSTNAMES.includes(outcome.hostname)) {
      console.warn("[contact] Turnstile mismatch:", outcome.action, outcome.hostname);
      return { ok: false, status: 403, error: TURNSTILE_FAILED };
    }
  }
  return { ok: true };
}

export async function POST(request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return json({ success: false, error: "Заборонено." }, 403);
  }

  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) {
    return json({ success: false, error: "Занадто великий запит." }, 413);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Некоректні дані форми." }, 400);
  }

  // Honeypot і перевірка часу: боту відповідаємо «успіхом», щоб не підказувати.
  const elapsed = Number(body?.elapsed);
  if (clean(body?.company, 200) || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return json({ success: true });
  }

  const data = {
    name: clean(body?.name, LIMITS.name),
    phone: clean(body?.phone, LIMITS.phone),
    message: clean(body?.message, LIMITS.message),
  };

  // U+FFFD з'являється, коли тіло прийшло не в UTF-8 — такий лист був би нечитабельним.
  if (Object.values(data).some((value) => value.includes("\uFFFD"))) {
    return json({ success: false, error: "Некоректне кодування даних форми." }, 400);
  }

  const errors = validateContact(data);
  if (Object.keys(errors).length > 0) {
    return json({ success: false, error: "Перевірте поля форми.", errors }, 422);
  }

  const ip = getClientIp(request);
  if (await isRateLimited(ip)) {
    return json(
      { success: false, error: "Забагато заявок за хвилину." },
      429
    );
  }

  // Токен перевіряємо до будь-якої відправки листа.
  const turnstile = await verifyTurnstile(clean(body?.turnstileToken, MAX_TOKEN_LENGTH + 1), ip);
  if (!turnstile.ok) {
    return json({ success: false, error: turnstile.error, code: "turnstile" }, turnstile.status);
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY is not set");
    return json({ success: false, error: "Сервіс тимчасово недоступний." }, 500);
  }

  const phone = formatUaPhone(data.phone);
  const sentAt = new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" });
  const safe = {
    name: escapeHtml(data.name),
    phone: escapeHtml(phone),
    message: escapeHtml(data.message).replace(/\n/g, "<br>"),
  };

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `Нова заявка з сайту ВОЛЬТ — ${data.name}, ${phone}`,
      html: `
        <h2>Нова заявка з сайту</h2>
        <p><strong>Ім'я:</strong> ${safe.name}</p>
        <p><strong>Телефон:</strong> <a href="tel:${toE164(data.phone)}">${safe.phone}</a></p>
        <p><strong>Що потрібно зробити:</strong><br>${safe.message}</p>
        <p style="color:#777">Надіслано: ${sentAt} (Київ)</p>
      `,
      text: `Нова заявка з сайту\nІм'я: ${data.name}\nТелефон: ${phone}\nЩо потрібно зробити: ${data.message}\nНадіслано: ${sentAt} (Київ)`,
    });

    if (error) {
      console.error("[contact] Resend error:", error.name, error.message);
      return json({ success: false, error: "Не вдалося надіслати заявку." }, 502);
    }

    return json({ success: true });
  } catch (error) {
    console.error("[contact] Send failed:", error);
    return json({ success: false, error: "Не вдалося надіслати заявку." }, 500);
  }
}
