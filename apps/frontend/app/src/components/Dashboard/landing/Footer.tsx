import Link from 'next/link';
import { TextHoverEffect } from '../ui/text-hover-border';

const socialLinks = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/PiyushC2P',
    icon: (
      <svg className="w-6 h-6 text-gray-300 hover:text-sky-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/piyush-rj',
    icon: (
      <svg className="w-6 h-6 text-gray-300 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/piyushraj.2004',
    icon: (
      <svg className="w-6 h-6 text-gray-300 hover:text-pink-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM12 7.25A4.75 4.75 0 1112 16.75 4.75 4.75 0 0112 7.25zm0 1.5a3.25 3.25 0 100 6.5 3.25 3.25 0 000-6.5zM17.75 6a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#linkedin',
    icon: (
      <svg className="w-[22px] h-[22px] mt-[1px] text-gray-300 hover:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
];


export default function Footer() {
  return (
    <footer className="bg-[#000] py-12 flex justify-center items-center">
      <div className="max-w-7xl w-full mx-auto">
        <div 
          className="bg-cover bg-center relative rounded-3xl overflow-hidden"
          style={{ backgroundImage: "url('/eclipse.jpeg')" }}
        >
          <div className="absolute inset-0 bg-[#141414] bg-opacity-40"></div>
          
          <div className="relative px-6 md:px-12">
            <div className=" mx-8"></div>
            
            <div className="py-8 md:py-12">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                <div className="col-span-1 md:col-span-3">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center -mr-[4px]">
                      <span className="text-black font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e4e4e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-orbit">
                          <path d="M20.341 6.484A10 10 0 0 1 10.266 21.85" />
                          <path d="M3.659 17.516A10 10 0 0 1 13.74 2.152" />
                          <circle cx="12" cy="12" r="3" />
                          <circle cx="19" cy="5" r="2" />
                          <circle cx="5" cy="19" r="2" />
                        </svg>
                      </span>
                    </div>
                    <span className="text-white text-3xl tracking-wider font-bold">rbit</span>
                  </div>
                  <p className="text-gray-300 mb-6 max-w-md">
                    The next generation chat platform that brings conversations to life with seamless connectivity and cutting-edge design.
                  </p>
                  <div className="flex space-x-4">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="sr-only">{link.name}</span>
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </div>
{/* 
                <div className="col-span-1 md:col-span-3 flex items-end justify-end relative">
                  <div className="font-bold tracking-widest text-[#0f0f0f] absolute -bottom-[102px] -right-[65px] text-[10vw] md:text-[10vw] lg:text-[8vw]">
                    <span className="bg-gradient-to-b from-[#414141] to-[#080808] text-transparent bg-clip-text transition-all duration-300">ORBIT</span>
                  </div>
                </div> */}
              </div>
            </div>
            
          </div>
        </div>
        
        <div className="px-6 md:px-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Orbit | All rights reserved.
          </p>
          <div className="flex space-x-6 z-30">
            <Link href="#terms">
              <span className="text-gray-500 hover:text-gray-300 text-sm">Terms</span>
            </Link>
            <Link href="#privacy">
              <span className="text-gray-500 hover:text-gray-300 text-sm">Privacy</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}