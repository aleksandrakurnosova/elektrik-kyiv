import { PHONE_HREF } from "../lib/site";

export default function SafetyCallout() {
  return (
    <section className="safety-callout">
     <div className="safety-icon">
      <span>
       ϟ
      </span>
     </div>
     <div>
      <small>
       ТЕРМІНОВИЙ ВИКЛИК ЕЛЕКТРИКА У КИЄВІ
      </small>
      <h2>
       Вибиває автомат чи немає світла
       <br/>
       лише у вашій квартирі?
      </h2>
     </div>
     <a className="button button-primary" href={PHONE_HREF}>
      Зателефонувати електрику
      <svg aria-hidden="true" viewBox="0 0 20 20">
       <path d="M4 10h12M11 5l5 5-5 5">
       </path>
      </svg>
     </a>
    </section>
  );
}
