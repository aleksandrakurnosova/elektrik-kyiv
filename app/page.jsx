import Header from "../components/Header";
import Hero from "../components/Hero";
import SignalBar from "../components/SignalBar";
import Services from "../components/Services";
import BackupPower from "../components/BackupPower";
import Benefits from "../components/Benefits";
import ObjectStrip from "../components/ObjectStrip";
import Process from "../components/Process";
import Gallery from "../components/Gallery";
// Тимчасово приховано з рендерингу: import SafetyCallout from "../components/SafetyCallout";
import Faq, { faqItems } from "../components/Faq";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import { BRAND, EMAIL, PHONE_E164, SEO_DESCRIPTION, SITE_URL } from "../lib/site";

const services = [
  {
    name: "Проєктування та монтаж електропроводки",
    description: "Проєктування та прокладання проводки у квартирах і будинках, збірка електрощитів, освітлення.",
  },
  {
    name: "Підключення сонячних електростанцій",
    description: "Монтаж панелей, підключення інвертора та інтеграція системи в домашню мережу.",
  },
  {
    name: "Комплексні електромонтажні роботи",
    description: "Монтаж, модернізація та діагностика електромереж житлових і комерційних об’єктів.",
  },
  {
    name: "Підключення генератора та АВР",
    description: "Підключення генератора до мережі будинку через перекидний рубильник або автоматичне введення резерву.",
  },
  {
    name: "Монтаж інвертора та акумуляторів",
    description: "Безперебійне живлення квартири чи будинку на базі інвертора та акумуляторної системи.",
  },
  {
    name: "Підключення EcoFlow та зарядних станцій до мережі",
    description: "Підключення зарядної станції до проводки квартири через перемикач мережа / резерв.",
  },
];

const areaServed = [
  { "@type": "City", name: "Київ" },
  { "@type": "AdministrativeArea", name: "Київська область" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Electrician",
      "@id": `${SITE_URL}/#business`,
      name: BRAND,
      description: SEO_DESCRIPTION,
      url: `${SITE_URL}/`,
      telephone: PHONE_E164,
      email: EMAIL,
      image: `${SITE_URL}/images/og-image.jpg`,
      logo: `${SITE_URL}/images/logo.png`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Київ",
        addressRegion: "Київська область",
        addressCountry: "UA",
      },
      areaServed,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Послуги електрика",
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: service.description,
            serviceType: service.name,
            areaServed,
            provider: { "@id": `${SITE_URL}/#business` },
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: BRAND,
      inLanguage: "uk",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
    {
      "@type": "VideoObject",
      name: "Система резервного живлення на об’єкті: інвертор та акумулятори Deye",
      description:
        "Відеоогляд змонтованої системи резервного живлення: гібридний інвертор, DC-бокс сонячних панелей і стійка акумуляторів Deye.",
      thumbnailUrl: `${SITE_URL}/images/rezervne-zhyvlennia-poster.jpg`,
      contentUrl: `${SITE_URL}/images/rezervne-zhyvlennia-obiekt.mp4`,
      uploadDate: "2026-10-22",
      duration: "PT1M23S",
      inLanguage: "uk",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
      <main>
        <Header />
        <Hero />
        <SignalBar />
        <Services />
        <BackupPower />
        <Benefits />
        <ObjectStrip />
        <Process />
        <Gallery />
        {/* <SafetyCallout /> */}
        <Faq />
        <Contact />
        <Footer />
      </main>
      <BackToTop />
    </>
  );
}
