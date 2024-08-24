'use client';
import {
  CTA,
  FAQ,
  Footer,
  Header,
  Hero2,
  Testimonials1,
} from "@/components/landing-components";
import FeaturesShowcase from "@/components/LandingPage/FeaturesShowcase/FeaturesShowcase";
import Marketing from "@/components/LandingPage/Marketing/Marketing";
import PainExplanation from "@/components/LandingPage/PainExplanation/PainExplanation";
import Pricing2 from "@/components/LandingPage/Pricing2";
import SampleAppShowcase from "@/components/LandingPage/SampleAppShowcase/SampleAppShowcase";

import { defaultTestimonials } from "@/components/landing-components/Testimonials1/testimonials";
import "aos/dist/aos.css"; // Import AOS styles (you can customize the styles if needed)
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  // Redirect to the demo page
  const router = useRouter();
  useEffect(() => {


    router.push('/my/personas');
  }, []);
  

  return (
    <>
      <Header />
      <main>
        <Hero2 />
        <PainExplanation />
        <FeaturesShowcase />
        <SampleAppShowcase />
        <Pricing2 />
        <Marketing />

        <FAQ />
        <Testimonials1 testimonials={defaultTestimonials} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}