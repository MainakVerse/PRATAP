import CallToAction from '@/sections/CallToAction';
import Companies from '@/sections/Companies';
import Features from '@/sections/Features';
import Footer from '@/sections/Footer';
import Header from '@/sections/Header';
import Hero from '@/sections/Hero';
import Roadmap from '@/sections/Roadmap';


import Testimonials from '@/sections/Testimonials';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Companies />
      <Features />
      <Testimonials />
      <Roadmap />
      <CallToAction />
      <Footer />
    </>
  );
}
