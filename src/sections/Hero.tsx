'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import Typewriter from 'typewriter-effect';

import { Button } from '@/components/Button';
import { Orbit } from '@/components/Orbit';

import { SectionBorder } from '@/components/SectionBorder';
import { SectionContent } from '@/components/SectionContent';
import { useMousePosition } from '@/utils/hooks';

const textItems = [
  'Text Generation',
  'Image Generation',
  'Code Generation',
  'Music Generation',
  'Video Generation',
  'Data Analysis',
  'Chatbot Development',
];

const colors = [
  '#8F00FF', // Violet
  '#4B0082', // Indigo
  '#0000FF', // Blue
  '#00FF00', // Green
  '#FFFF00', // Yellow
  '#FFA500', // Orange
  '#FF0000', // Red
];

export const Hero = () => {
  const { xProgress, yProgress } = useMousePosition();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['end start', 'start end'],
  });

  const transformedY = useTransform(scrollYProgress, [0, 1], [200, -200]);

  const springX = useSpring(xProgress);
  const springY = useSpring(yProgress);

  const translateLargeX = useTransform(springX, [0, 1], ['-25%', '25%']);
  const translateLargeY = useTransform(springY, [0, 1], ['-25%', '25%']);
  const translateMediumX = useTransform(springX, [0, 1], ['-50%', '50%']);
  const translateMediumY = useTransform(springY, [0, 1], ['-50%', '50%']);
  const translateSmallX = useTransform(springX, [0, 1], ['-100%', '100%']);
  const translateSmallY = useTransform(springY, [0, 1], ['-100%', '100%']);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % textItems.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef}>
      <div className="container">
        <SectionBorder>
          <SectionContent className="relative isolate [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            {/* BACKGROUND ORBITS */}
            <div className="absolute -z-10 inset-0 bg-[radial-gradient(circle_farthest-corner,var(--color-fuchsia-900)_50%,var(--color-indigo-900)_75%,transparent)] [mask-image:radial-gradient(circle_farthest-side,black,transparent)]" />
            <div className="absolute inset-0 -z-10">
              {[350, 600, 850, 1100, 1350].map((size, i) => (
                <div key={i} className="absolute-center">
                  <Orbit className={`size-[${size}px]`} />
                </div>
              ))}
            </div>

            {/* HEADING */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-100 text-center leading-tight">
              Generate Optimized <br /> Prompts for <br />
              <span
                style={{
                  color: colors[currentIndex],
                  transition: 'color 0.5s ease-in-out',
                }}
              >
                <Typewriter
                  options={{
                    strings: [textItems[currentIndex]],
                    autoStart: true,
                    loop: false,
                    delay: 60,
                  }}
                />
              </span>
            </h1>

            {/* SUBTEXT */}
            <p className="text-center text-lg md:text-xl mt-8 lg:max-w-3xl lg:mx-auto">
              Want to optimize prompt engineering for your smart business? Try out Pratap, your prompt generation and auditing tool for free.
            </p>

            {/* BUTTON */}
            <div className="flex justify-center mt-10">
              <Link href="/generate">
                <Button variant="secondary">Get Started</Button>
              </Link>
            </div>

            {/* FLOATING PLANETS */}
            <div className="relative isolate max-w-5xl mx-auto">
              <div className="absolute left-1/2 top-0">
                <motion.div style={{ x: translateLargeX, y: translateLargeY }}>
                  
                </motion.div>
                <motion.div style={{ x: translateLargeX, y: translateLargeY }}>
                  
                </motion.div>
                <motion.div style={{ x: translateSmallX, y: translateSmallY }}>
                  
                </motion.div>
                <motion.div style={{ x: translateMediumX, y: translateMediumY }}>
                  
                </motion.div>
              </div>

              {/* CHAT MOCKUPS */}
              <div className="hidden lg:block absolute top-[30%] left-0 -translate-x-10 z-10">
                <motion.div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-xl p-4 w-72" style={{ y: transformedY }}>
                  <div>
                    <strong>Client:</strong>{' '}
                    <Typewriter
                      options={{
                        strings: [
                          'Can generate prompts for image',
                          'Can your write a code?',
                          'Can you verify prompt quality?',
                          'Can you optimize prompt?',
                        ],
                        autoStart: true,
                        loop: true,
                      }}
                    />
                  </div>
                  <div className="text-right text-gray-400 text-sm font-semibold">1m ago</div>
                </motion.div>
              </div>

              <div className="hidden lg:block absolute top-[50%] right-0 translate-x-10 z-10">
                <motion.div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-xl p-4 w-72" style={{ y: transformedY }}>
                  <div>
                    <strong>Pratap:</strong>{' '}
                    <Typewriter
                      options={{
                        strings: ['Definitely', 'I would love to...', 'Voila! Yes.', 'For sure'],
                        autoStart: true,
                        loop: true,
                      }}
                    />
                  </div>
                  <div className="text-right text-gray-400 text-sm font-semibold">Just now</div>
                </motion.div>
              </div>

              {/* VIDEO SECTION */}
              <div className="border-2 rounded-2xl mt-16 overflow-hidden border-gradient relative">
                <video autoPlay loop muted playsInline className="w-full h-auto object-cover">
                  <source src="/background.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute bottom-2 md:bottom-4 lg:bottom-10 left-1/2 -translate-x-1/2 w-full px-4 flex items-center justify-center">
                  <div className="bg-gray-950/80 flex justify-center items-center gap-4 px-4 py-2 rounded-2xl w-[320px] max-w-full">
                    <LoaderCircle className="text-violet-400 animate-spin" />
                    <div className="font-semibold text-xl text-gray-100">
                      Generating Prompt...
                      <span className="animate-cursor-blink font-thin">|</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionContent>
        </SectionBorder>
      </div>
    </section>
  );
};

export default Hero;
