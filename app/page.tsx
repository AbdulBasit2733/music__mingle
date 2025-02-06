import Image from "next/image";
import Appbar from "./components/Appbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import CTA from "./components/CTA";
import Redirect from "./components/Redirect";
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <Appbar />
      <Redirect />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
    </main>
  );
}
