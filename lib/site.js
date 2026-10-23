// Єдине джерело контактів і адреси сайту для компонентів, метаданих та schema.org.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://elektrik-kyiv.top"
).replace(/\/+$/, "");

export const BRAND = "ВОЛЬТ";

export const PHONE_DISPLAY = "+38 (066) 448-49-63";
export const PHONE_HREF = "tel:+380664484963";
export const PHONE_E164 = "+380664484963";

export const EMAIL = "elektrik.service.ua@gmail.com";

export const SEO_TITLE = "Електрик Київ — електромонтаж і резервне живлення | ВОЛЬТ";
export const SEO_DESCRIPTION =
  "Електрик у Києві та області: проводка, електрощити, підключення генератора з АВР, інвертора, акумуляторів і EcoFlow до мережі. Ціну фіксуємо після огляду.";
