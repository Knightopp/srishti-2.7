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
import ContactPage from './components/ContactPage';
import EventsPage from './components/EventsPage';
import EventDetailPage from './components/EventDetailPage';
import SchedulePage from './components/SchedulePage';
import { FestProvider } from './context/FestContext';

export type AppView = 
  | 'home' 
  | 'events' 
  | 'event-detail' 
  | 'schedule' 
  | 'contact' 
  | 'register' 
  | 'admin' 
  | 'copper';

export function AppContent() {
  useLenis();

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeEventId, setActiveEventId] = useState<string>('');
  const [registerEventId, setRegisterEventId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const checkRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      
      if (hash.includes('copper') || path.includes('copper')) {
        setCurrentView('copper');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.includes('admin') || path.includes('admin')) {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.startsWith('#event/') || hash.startsWith('#events/')) {
        const parts = window.location.hash.split('/');
        const id = parts[1] || '';
        setActiveEventId(id);
        setCurrentView('event-detail');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.includes('events') || path.includes('events')) {
        setCurrentView('events');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.includes('schedule') || hash === '#roadmap' || path.includes('schedule')) {
        setCurrentView('schedule');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.includes('contact') || path.includes('contact')) {
        setCurrentView('contact');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash.includes('register') || path.includes('register')) {
        if (hash.includes('/')) {
          const parts = window.location.hash.split('/');
          setRegisterEventId(parts[1]);
        }
        setCurrentView('register');
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

  const navigateTo = (view: AppView, param?: string) => {
    if (view === 'home') {
      window.location.hash = '';
      setCurrentView('home');
    } else if (view === 'admin') {
      window.location.hash = 'adminodiyan';
      setCurrentView('admin');
    } else if (view === 'copper') {
      window.location.hash = 'copper';
      setCurrentView('copper');
    } else if (view === 'event-detail' && param) {
      setActiveEventId(param);
      window.location.hash = `event/${param}`;
      setCurrentView('event-detail');
    } else if (view === 'register') {
      setRegisterEventId(param);
      window.location.hash = param ? `register/${param}` : 'register';
      setCurrentView('register');
    } else {
      window.location.hash = view;
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Dedicated Copper Panel View
  if (currentView === 'copper') {
    return (
      <CopperPanel
        onBackToHome={() => navigateTo('home')}
      />
    );
  }

  // 2. Dedicated Registration & Multi-Pass Checkout View
  if (currentView === 'register') {
    return (
      <RegistrationPage
        initialEventId={registerEventId}
        onBackToHome={() => navigateTo('home')}
        onNavigateToAdmin={() => navigateTo('admin')}
      />
    );
  }

  // 3. Dedicated Admin & System Panel View
  if (currentView === 'admin') {
    return (
      <AdminPanel
        onBackToHome={() => navigateTo('home')}
        onNavigateToRegister={() => navigateTo('register')}
      />
    );
  }

  // 4. Dedicated Events Catalog Hub Page
  if (currentView === 'events') {
    return (
      <EventsPage
        onBackToHome={() => navigateTo('home')}
        onSelectEventDetail={(id) => navigateTo('event-detail', id)}
        onNavigateToRegister={(id) => navigateTo('register', id)}
      />
    );
  }

  // 5. Dynamic Dedicated Event Detail Page (Loads ANY event dynamically!)
  if (currentView === 'event-detail') {
    return (
      <EventDetailPage
        eventId={activeEventId}
        onBackToEvents={() => navigateTo('events')}
        onBackToHome={() => navigateTo('home')}
        onNavigateToRegister={(id) => navigateTo('register', id || activeEventId)}
        onSelectEventDetail={(id) => navigateTo('event-detail', id)}
      />
    );
  }

  // 6. Dedicated Schedule & Campus Map Page
  if (currentView === 'schedule') {
    return (
      <SchedulePage
        onBackToHome={() => navigateTo('home')}
        onNavigateToRegister={(id) => navigateTo('register', id)}
        onNavigateToEventDetail={(id) => navigateTo('event-detail', id)}
      />
    );
  }

  // 7. Dedicated Contact Page
  if (currentView === 'contact') {
    return (
      <ContactPage
        onBackToHome={() => navigateTo('home')}
        onNavigateToRegister={() => navigateTo('register')}
      />
    );
  }

  // 8. Main Home Landing Page
  return (
    <div className="relative w-full min-h-screen bg-[#050608] text-[#E8E8EC] antialiased overflow-x-hidden">
      {/* 1. Global Navigation Bar */}
      <Navbar 
        currentView={currentView}
        onNavigateToHome={() => navigateTo('home')}
        onNavigateToEvents={() => navigateTo('events')}
        onNavigateToSchedule={() => navigateTo('schedule')}
        onNavigateToContact={() => navigateTo('contact')}
        onNavigateToRegister={() => navigateTo('register')} 
        onNavigateToAdmin={() => navigateTo('admin')} 
      />

      {/* 2. Main Outcrowd Hero Section with Floating Widgets */}
      <section className="relative w-full">
        <Hero onNavigateToRegister={() => navigateTo('register')} />
      </section>

      {/* 3. 3D Rotating Wheel Case Showcase */}
      <section className="relative w-full">
        <CaseShowcase 
          onNavigateToRegister={(id) => navigateTo('register', id)} 
          onSelectEventDetail={(id) => navigateTo('event-detail', id)}
        />
      </section>

      {/* 4. Continuous Infinite Moving Sponsors Ticker */}
      <section className="relative w-full">
        <SponsorsTicker />
      </section>

      {/* 5. Event Map & Timeline Roadmap Section with Deep Neon Glow & St. Thomas College Maps */}
      <section className="relative w-full">
        <TimelineRoadmap 
          onNavigateToRegister={(id) => navigateTo('register', id)}
          onNavigateToEventDetail={(id) => navigateTo('event-detail', id)}
        />
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
      <Footer 
        onNavigateToAdmin={() => navigateTo('admin')} 
        onNavigateToEvents={() => navigateTo('events')}
        onNavigateToSchedule={() => navigateTo('schedule')}
        onNavigateToContact={() => navigateTo('contact')}
        onNavigateToRegister={() => navigateTo('register')}
      />
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
