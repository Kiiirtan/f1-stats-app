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

  // Show the F1 background on ALL pages identically
  const showBg = true;

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0C10] text-[#E0E1DD] font-body selection:bg-primary-container selection:text-white relative overflow-x-hidden">
      {/* Global static background for all pages except Dashboard and News */}
      {showBg && (
        <div className="fixed inset-0 z-0 bg-black pointer-events-none">
          <img
            alt="F1 Background"
            className="w-full h-full object-cover opacity-80" // Slightly dimmed to match cinematic shadow effects
            src="/bg-dark-f1.webp"
          />
          {/* Subtle gradient overlay to mesh with the application UI */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#13131b]/60 via-transparent to-[#13131b]/90" />
        </div>
      )}
      <TopNavBar />
      <SideNavBar />
      <main className={`lg:ml-20 flex-grow flex flex-col min-h-screen relative z-10`}>
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}
