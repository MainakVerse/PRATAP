'use client';

import { Orbit } from '@/components/Orbit';
import Link from 'next/link';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';

export const navItems = [
  { name: 'Generate', href: '/generate' },
  
  { name: 'Audit', href: '/auditors' },
  // { name: 'Gallery', href: '/gallery' },
  { name: 'Contacts', href: '/contacts' },
];

export const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="border-b border-[var(--color-border)] relative z-40">
        <div className="container">
          <div className="h-18 lg:h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
              <div className="font-extrabold text-2xl text-yellow-500">PRATAP</div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="h-full hidden lg:flex">
              <nav className="h-full">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="h-full px-10 relative font-bold text-md tracking-widest text-gray-400 uppercase inline-flex items-center 
                    before:content[''] before:absolute before:bottom-0 before:h-2 before:w-px before:bg-gray-200/20 before:left-0 
                    after:content[''] after:absolute after:bottom-0 after:h-2 after:w-px after:bg-gray-200/20 after:right-0 after:hidden 
                    last:after:block hover:text-gray-100 transition duration-300"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile Navigation Button */}
            <div className="flex items-center lg:hidden">
              <button
                className="size-10 rounded-lg border-2 relative bg-[conic-gradient(from_45deg,var(--color-violet-400),var(--color-fuchsia-400),var(--color-amber-300),var(--color-teal-300),var(--color-violet-400))] border-transparent bg-clip-border"
                onClick={() => setIsMobileNavOpen((prev) => !prev)}
              >
                <div className="bg-[var(--color-gray-950)] w-full h-full rounded-lg">
                  <div className="absolute-center">
                    <div
                      className={twMerge(
                        'w-4 h-0.5 bg-gray-200 -translate-y-1 transition-all duration-300',
                        isMobileNavOpen && 'translate-y-0 rotate-45 bg-rose-300'
                      )}
                    ></div>
                  </div>
                  <div className="absolute-center">
                    <div
                      className={twMerge(
                        'w-4 h-0.5 bg-gray-200 translate-y-1 transition-all duration-300',
                        isMobileNavOpen && 'translate-y-0 -rotate-45 bg-rose-300'
                      )}
                    ></div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileNavOpen && (
        <div className="fixed top-18 left-0 bottom-0 right-0 bg-gray-950 z-30 overflow-hidden">
          <div className="absolute-center isolate -z-10">
            <Orbit className="size-[200px]" />
          </div>
          <div className="absolute-center isolate -z-10">
            <Orbit className="size-[350px]" />
          </div>
          <div className="absolute-center isolate -z-10">
            <Orbit className="size-[500px]" />
          </div>
          <div className="absolute-center isolate -z-10">
            <Orbit className="size-[650px]" />
          </div>
          <div className="absolute-center isolate -z-10">
            <Orbit className="size-[800px]" />
          </div>

          <div className="container h-full border-b border-[var(--color-border)]">
            <nav className="flex flex-col items-center gap-4 py-8 h-full justify-center">
              {navItems.map((navItem, index) => (
                <button
                  key={index}
                  className="text-gray-200 uppercase tracking-widest font-body text-sm h-10"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    router.push(navItem.href);
                  }}
                >
                  {navItem.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
