import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: Readonly<LayoutProps>) {
  const { pathname } = useLocation();
  const isDashboard = pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0C10] text-[#E0E1DD] font-body selection:bg-primary-container selection:text-white relative overflow-x-hidden">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:top-4 focus:left-4 focus:bg-[var(--theme-accent)] focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:font-bold outline-none"
      >
        Skip to main content
      </a>

      {/* Global background */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none">
        <img
          src="/solidwhite.png"
          alt=""
          className="w-full h-full object-cover opacity-80"
        />
        {/* Subtle gradient overlay to mesh with the application UI */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#13131b]/60 via-transparent to-[#13131b]/90" />
      </div>
      <TopNavBar />
      <SideNavBar />
      <main id="main-content" className={`lg:ml-20 flex-grow flex flex-col min-h-screen relative z-10`}>
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}
