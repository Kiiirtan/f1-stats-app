import { ReactNode } from 'react';
import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: Readonly<LayoutProps>) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
      <TopNavBar />
      <SideNavBar />
      <main className="lg:ml-64 pt-16 flex-grow flex flex-col min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
}
