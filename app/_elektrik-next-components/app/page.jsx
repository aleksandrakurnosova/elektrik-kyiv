import Header from "../components/Header";
import Hero from "../components/Hero";
import SignalBar from "../components/SignalBar";
import Services from "../components/Services";
import Benefits from "../components/Benefits";
import ObjectStrip from "../components/ObjectStrip";
import Process from "../components/Process";
import Gallery from "../components/Gallery";
import SafetyCallout from "../components/SafetyCallout";
import Faq from "../components/Faq";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Lightbox from "../components/Lightbox";

export default function Home() {
  return (
    <>
      <main>
      <Header />
      <Hero />
      <SignalBar />
      <Services />
      <Benefits />
      <ObjectStrip />
      <Process />
      <Gallery />
      <SafetyCallout />
      <Faq />
      <Contact />
      <Footer />
      </main>
      <Lightbox />
    </>
  );
}
