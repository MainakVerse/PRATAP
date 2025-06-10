import React from 'react';
import Image from 'next/image';
import { SectionBorder } from '@/components/SectionBorder';
import { SectionContent } from '@/components/SectionContent';

interface RoadmapProps {
  className?: string;
}

const roadmapItems = [
  { id: 1, row: 1, image: '/images/step1.png' },
  { id: 2, row: 1, image: '/images/step2.png' },
  { id: 3, row: 1, image: '/images/step3.png' },
  { id: 4, row: 2, image: '/images/step4.png' },
  { id: 5, row: 2, image: '/images/step5.png' },
  { id: 6, row: 2, image: '/images/step6.png' },
  { id: 7, row: 3, image: '/images/step7.png' },
  { id: 8, row: 3, image: '/images/step8.png' },
  { id: 9, row: 3, image: '/images/step9.png' },
];

const Roadmap: React.FC<RoadmapProps> = ({ className = '' }) => {
  const getItemsByRow = (row: number) =>
    roadmapItems.filter((item) => item.row === row);

  return (
    <section className={`my-20 ${className}`}>
      <div className="container">
        <SectionBorder borderTop>
          <SectionContent className="relative isolate [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8">HOW IT WORKS</h1>
            <div className="relative py-16 px-8">
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                viewBox="0 0 1000 800"
                preserveAspectRatio="xMidYMid meet"
                >
                <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                    </filter>
                </defs>

                <path
                    id="roadmapPath"
                    d="
                    M 50 100 L 500 100 L 950 100
                    Q 985 100 985 135 L 985 200
                    Q 985 235 950 235 L 500 235 L 50 235
                    Q 15 235 15 270 L 15 335
                    Q 15 370 50 370 L 500 370 L 950 370
                    Q 985 370 985 405 L 985 470
                    Q 985 605 950 605 L 500 605 L 50 605
                    "
                    stroke="url(#pathGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    className="animate-pulse"
                />

                <circle r="8" fill="#ffffff" opacity="1">
                    <animateMotion dur="8s" repeatCount="indefinite">
                    <mpath href="#roadmapPath"/>
                    </animateMotion>
                </circle>
                </svg>


              <div className="relative z-10 max-w-4xl mx-auto space-y-32">
                {[1, 2, 3].map((row) => (
                  <div key={row} className="flex justify-between items-center">
                    {getItemsByRow(row).map((item) => (
                      <div key={item.id} className="flex flex-col items-center group">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-white rounded-xl shadow-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 border-4 border-white/20 overflow-hidden">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={`Step ${item.id}`}
                                width={32}
                                height={32}
                                className="object-contain w-8 h-8 rounded"
                              />
                            )}
                          </div>
                          <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-white rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        </div>
                        <div className="mt-4 text-center">
                          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Step {item.id}
                          </h3>
                          
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Decorative background bubbles */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-xl opacity-50"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-xl opacity-50"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-100 dark:bg-pink-900/20 rounded-full blur-xl opacity-50"></div>
            </div>

            <div className="overflow-x-auto mt-12">
  <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
    <thead className="bg-gray-100 dark:bg-gray-800">
      <tr>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700">
          Step
        </th>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700">
          Description
        </th>
      </tr>
    </thead>
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
      {[
        "Break the Sentence into Pieces",
        "Turn Words into Numbers",
        "Remember the Order",
        "Look at Everything Together",
        "Think in Layers",
        "Focus on What Matters",
        "Guess One Word at a Time",
        "Control Creativity",
        "Put the Words Back Together",
       
      ].map((text, i) => (
        <tr key={i}>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-100">
            Step {i + 1}.
          </td>
          <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 dark:text-gray-300">
            {text || "—"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

          </SectionContent>
        </SectionBorder>
      </div>
    </section>
  );
};

export default Roadmap;
