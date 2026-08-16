import { useState, useEffect } from 'react';
import { useLenis } from './hooks/useLenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SponsorsTicker from './components/SponsorsTicker';
import TimelineRoadmap from './components/TimelineRoadmap';
import CaseShowcase from './components/CaseShowcase';
import PhotoGallery from './components/PhotoGallery';
import StudioPhilosophy from './components/StudioPhilosophy';
import CTA from './components/CTA';
import Footer from './components/Footer';
import RegistrationPage from './components/RegistrationPage';
import AdminPanel from './components/AdminPanel';
import CopperPanel from './components/CopperPanel';
import { FestProvider } from './context/FestContext';

export function AppContent() {
  useLenis();

  const [currentView, setCurrentView] = useState<'home' | 'register' | 'admin' | 'copper'>('home');

  useEffect(() => {
    const checkRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      
      if (hash.includes('copper') || path.includes('copper')) {
        setCurrentView('copper');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.includes('register') || path.includes('register')) {
        setCurrentView('register');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.includes('admin') || path.includes('admin')) {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setCurrentView('home');
      }
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  const navigateTo = (view: 'home' | 'register' | 'admin' | 'copper') => {
    if (view === 'home') {
      window.location.hash = '';
      setCurrentView('home');
    } else if (view === 'admin') {
      window.location.hash = 'adminodiyan';
      setCurrentView('admin');
    } else if (view === 'copper') {
      window.location.hash = 'copper';
      setCurrentView('copper');
    } else {
      window.location.hash = view;
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'copper') {
    return (
      <CopperPanel
        onBackToHome={() => navigateTo('home')}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <RegistrationPage
        onBackToHome={() => navigateTo('home')}
        onNavigateToAdmin={() => navigateTo('admin')}
      />
    );
  }

  if (currentView === 'admin') {
    return (
      <AdminPanel
        onBackToHome={() => navigateTo('home')}
        onNavigateToRegister={() => navigateTo('register')}
      />
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-[#0b0b0b] text-[#f5f5f7] antialiased overflow-x-hidden">
      {/* 1. Global Navigation */}
      <Navbar onNavigateToRegister={() => navigateTo('register')} onNavigateToAdmin={() => navigateTo('admin')} />

      {/* 2. Main Outcrowd Hero Section with Floating Widgets */}
      <section className="relative w-full">
        <Hero onNavigateToRegister={() => navigateTo('register')} />
      </section>

      {/* 3. Continuous Infinite Moving Sponsors Ticker */}
      <section className="relative w-full">
        <SponsorsTicker />
      </section>

      {/* 4. Event Map & Timeline Roadmap Section */}
      <section className="relative w-full">
        <TimelineRoadmap />
      </section>

      {/* 5. 3D Rotating Wheel Case Showcase */}
      <section className="relative w-full">
        <CaseShowcase onNavigateToRegister={() => navigateTo('register')} />
      </section>

      {/* 6. Compact Photo Gallery Section */}
      <section className="relative w-full">
        <PhotoGallery />
      </section>

      {/* 7. Studio Philosophy Section */}
      <section className="relative w-full">
        <StudioPhilosophy />
      </section>

      {/* 8. Call To Action Section */}
      <section className="relative w-full">
        <CTA onNavigateToRegister={() => navigateTo('register')} />
      </section>

      {/* 9. Footer */}
      <Footer onNavigateToAdmin={() => navigateTo('admin')} />
    </div>
  );
}

export function App() {
  return (
    <FestProvider>
      <AppContent />
    </FestProvider>
  );
}

export default App;
