// Знак ϟ — векторна реконструкція початкового гліфа (public/images/elektrik-kyiv.top_.png),
// а не символ шрифту: так він однаковий на iOS, Android, Windows і macOS.
// Колір — currentColor (--ink на акцентній плашці).
export function BrandMark() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="48 84 198 198">
      <path
        d="M101 84H124C142 84 154 96 154 116L153.5 128 143 168H202L180 234V247H199V272Q199 281 190 281H166C150 281 140 270 140 255V236L151 197H93L113 119H95V90Q95 84 101 84Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Слова в окремих span: на вузьких екранах назва складається у дворядковий
// лого-блок (див. .brand-name у globals.css), а не переноситься довільно.
export default function BrandLogo({ ariaLabel }) {
  return (
    <a aria-label={ariaLabel} className="brand" href="#top">
     <span className="brand-mark">
      <BrandMark />
     </span>
     <span className="brand-name">
      <span>Електрик</span>{" "}
      <span>Максим</span>
     </span>
    </a>
  );
}
