import React, { createContext, useContext, useState, useEffect } from 'react';

export interface EventItem {
  id: string;
  number: string;
  stageLabel: string;
  title: string;
  category: string;
  highlightText: string;
  description: string;
  time: string;
  venue: string;
  prize: string;
  tags: string[];
  color: string;
  bgGradient: string;
  image: string;
  fee: number; // in INR (0 for free)
}

export interface SponsorItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  logoUrl: string;
  accentColor: string;
}

export interface RegistrationRecord {
  id: string;
  passId: string;
  securityHash: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  teamName?: string;
  selectedEventIds: string[];
  selectedEventNames: string[];
  totalFee: number;
  paymentUtr: string;
  paymentScreenshotUrl?: string;
  paymentStatus: 'Pending Verification' | 'Payment Verified' | 'Rejected';
  checkInStatus: 'Not Checked In' | 'Checked In';
  registeredAt: string;
}

export interface SystemSettings {
  upiId: string;
  upiQrImage: string;
  contactEmail: string;
  contactPhone: string;
  collegeName: string;
}

interface FestContextType {
  events: EventItem[];
  sponsors: SponsorItem[];
  registrations: RegistrationRecord[];
  settings: SystemSettings;
  addEvent: (event: Omit<EventItem, 'id' | 'number'>) => void;
  updateEvent: (id: string, updatedEvent: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  addSponsor: (sponsor: Omit<SponsorItem, 'id'>) => void;
  deleteSponsor: (id: string) => void;
  addRegistration: (reg: Omit<RegistrationRecord, 'id' | 'passId' | 'securityHash' | 'registeredAt' | 'paymentStatus' | 'checkInStatus'>) => RegistrationRecord;
  updateRegistrationStatus: (id: string, paymentStatus: RegistrationRecord['paymentStatus'], checkInStatus?: RegistrationRecord['checkInStatus']) => void;
  deleteRegistration: (id: string) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
}

const DEFAULT_SETTINGS: SystemSettings = {
  upiId: 'srishti@stthomas.upi',
  upiQrImage: '',
  contactEmail: 'srishti@stthomas.ac.in',
  contactPhone: '+91 98765 43210',
  collegeName: 'St. Thomas College',
};

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: 'hackathon',
    number: '01',
    stageLabel: 'BUILD & PROTOTYPE',
    title: 'BuildBlitz Hackathon',
    category: '6-Hour Rapid Prototyping Challenge',
    highlightText: 'More than 40% of participants win prizes or seed mentorship for MVPs',
    description: 'Teams of 3-4 race against the clock to build a working prototype from scratch. Industry mentors, live tech demos, and a ₹25,000 grand prize pool await.',
    time: 'DEC 4 • 10:00 AM - 04:00 PM',
    venue: 'CS Innovation Hub',
    prize: '₹25,000 Pool',
    tags: ['Hackathon', 'Full-Stack', 'Team Challenge'],
    color: '#0077ff',
    bgGradient: 'from-[#0a182e] via-[#0d1e38] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    fee: 300,
  },
  {
    id: 'ctf',
    number: '02',
    stageLabel: 'CYBERSECURITY SHOWDOWN',
    title: 'CyberSec CTF Challenge',
    category: 'Capture The Flag — Offensive & Defensive Security',
    highlightText: 'Over 30 live exploitation & forensic puzzles on real-time sandboxes',
    description: 'Crack ciphers, exploit web vulnerabilities, reverse-engineer binaries, and race through digital forensics puzzles in this high-intensity team CTF contest.',
    time: 'DEC 4 • 01:00 PM - 05:00 PM',
    venue: 'CS Lab Complex',
    prize: '₹15,000 Pool',
    tags: ['Cybersecurity', 'CTF', 'Forensics', 'Ethical Hacking'],
    color: '#00e5ff',
    bgGradient: 'from-[#082230] via-[#091a26] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    fee: 200,
  },
  {
    id: 'ai-workshop',
    number: '03',
    stageLabel: 'MACHINE LEARNING LAB',
    title: 'AI & ML Masterclass',
    category: 'Hands-on Deep Learning & LLM Deployment',
    highlightText: '100% hands-on building: Train & deploy neural models directly on GPU colabs',
    description: 'Build your first deep learning model in a beginner-to-advanced hands-on workshop using PyTorch, scikit-learn, and Hugging Face on real-world datasets.',
    time: 'DEC 5 • 10:00 AM - 01:00 PM',
    venue: 'Seminar Hall B',
    prize: 'Certificates + Swag',
    tags: ['AI/ML', 'Python', 'PyTorch', 'Workshop'],
    color: '#00d4ff',
    bgGradient: 'from-[#0a2436] via-[#0c1c2b] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    fee: 150,
  },
  {
    id: 'code-clash',
    number: '04',
    stageLabel: 'ALGORITHMIC ARENA',
    title: 'Code Clash Algo Battles',
    category: 'Speed Competitive Programming Tournament',
    highlightText: 'Live HackerRank real-time leaderboard with instant test case execution',
    description: 'Test your algorithmic agility and data structures mastery. Face multi-tier coding challenges under intense countdown pressure to claim the coding throne.',
    time: 'DEC 4 • 10:30 AM - 12:30 PM',
    venue: 'CS Lab 1 & 2',
    prize: '₹10,000 Pool',
    tags: ['DSA', 'Competitive Coding', 'HackerRank'],
    color: '#38bdf8',
    bgGradient: 'from-[#0c2838] via-[#0a1d2b] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    fee: 100,
  },
  {
    id: 'ui-design',
    number: '05',
    stageLabel: 'DESIGN SPRINT',
    title: 'UI/UX Design Sprint',
    category: 'Rapid Product Prototyping & Interface Design',
    highlightText: 'Transform raw problem briefs into interactive Figma prototypes in 120 mins',
    description: 'Teams receive a secret industry problem statement and must craft complete mobile/web UI flows. Judged on design systems, micro-interactions, and usability.',
    time: 'DEC 5 • 02:00 PM - 04:30 PM',
    venue: 'Design Studio A',
    prize: '₹10,000 Pool',
    tags: ['UI/UX', 'Figma', 'Product Design'],
    color: '#0055ff',
    bgGradient: 'from-[#071830] via-[#091424] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    fee: 150,
  },
];

const DEFAULT_SPONSORS: SponsorItem[] = [
  {
    id: 's1',
    name: 'IEEE',
    category: 'Technical Society',
    badge: 'TITLE',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
    accentColor: '#0077ff',
  },
  {
    id: 's2',
    name: 'Google DSC',
    category: 'Developer Student Club',
    badge: 'PLATINUM',
    logoUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=300&q=80',
    accentColor: '#00e5ff',
  },
  {
    id: 's3',
    name: 'GitHub Education',
    category: 'Developer Platform',
    badge: 'GOLD',
    logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=300&q=80',
    accentColor: '#00d4ff',
  },
  {
    id: 's4',
    name: 'JetBrains',
    category: 'Developer Tools',
    badge: 'GOLD',
    logoUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=300&q=80',
    accentColor: '#0055ff',
  },
];

const DEFAULT_REGISTRATIONS: RegistrationRecord[] = [
  {
    id: 'reg-1',
    passId: 'SR27-894210',
    securityHash: '8A9F-3E21-7B04-8942',
    fullName: 'Abhiram C S',
    email: 'abhiram@gmail.com',
    phone: '+91 98765 43210',
    college: 'St. Thomas College',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    teamName: 'CyberKnights',
    selectedEventIds: ['hackathon', 'ctf'],
    selectedEventNames: ['BuildBlitz Hackathon', 'CyberSec CTF Challenge'],
    totalFee: 500,
    paymentUtr: '984210459821',
    paymentStatus: 'Payment Verified',
    checkInStatus: 'Checked In',
    registeredAt: 'Dec 1, 2026 10:14 AM',
  },
  {
    id: 'reg-2',
    passId: 'SR27-652391',
    securityHash: '4F12-9A8C-3D56-6523',
    fullName: 'Meera Nair',
    email: 'meera.nair@college.edu',
    phone: '+91 91234 56789',
    college: 'Rajagiri School of Engg',
    department: 'Information Technology',
    year: '4th Year / PG',
    selectedEventIds: ['ai-workshop'],
    selectedEventNames: ['AI & ML Masterclass'],
    totalFee: 150,
    paymentUtr: '120984572910',
    paymentStatus: 'Payment Verified',
    checkInStatus: 'Not Checked In',
    registeredAt: 'Dec 2, 2026 02:30 PM',
  },
];

const FestContext = createContext<FestContextType | undefined>(undefined);

export const FestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('srishti_events');
      return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
    } catch {
      return DEFAULT_EVENTS;
    }
  });

  const [sponsors, setSponsors] = useState<SponsorItem[]>(() => {
    try {
      const saved = localStorage.getItem('srishti_sponsors');
      return saved ? JSON.parse(saved) : DEFAULT_SPONSORS;
    } catch {
      return DEFAULT_SPONSORS;
    }
  });

  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('srishti_registrations');
      return saved ? JSON.parse(saved) : DEFAULT_REGISTRATIONS;
    } catch {
      return DEFAULT_REGISTRATIONS;
    }
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem('srishti_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('srishti_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('srishti_sponsors', JSON.stringify(sponsors));
  }, [sponsors]);

  useEffect(() => {
    localStorage.setItem('srishti_registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('srishti_settings', JSON.stringify(settings));
  }, [settings]);

  const addEvent = (newEventData: Omit<EventItem, 'id' | 'number'>) => {
    const num = (events.length + 1).toString().padStart(2, '0');
    const newEvent: EventItem = {
      ...newEventData,
      id: `evt-${Date.now()}`,
      number: num,
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (id: string, updatedFields: Partial<EventItem>) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, ...updatedFields } : e)));
  };

  const deleteEvent = (id: string) => {
    if (events.length <= 1) {
      alert('At least one event must remain on the festival schedule.');
      return;
    }
    setEvents(events.filter((e) => e.id !== id));
  };

  const addSponsor = (newSponsorData: Omit<SponsorItem, 'id'>) => {
    const newSponsor: SponsorItem = {
      ...newSponsorData,
      id: `s-sp-${Date.now()}`,
    };
    setSponsors([...sponsors, newSponsor]);
  };

  const deleteSponsor = (id: string) => {
    setSponsors(sponsors.filter((s) => s.id !== id));
  };

  const addRegistration = (regData: Omit<RegistrationRecord, 'id' | 'passId' | 'securityHash' | 'registeredAt' | 'paymentStatus' | 'checkInStatus'>) => {
    const randomPassNum = Math.floor(100000 + Math.random() * 900000);
    const passId = `SR27-${randomPassNum}`;
    
    // Generate unique verification hash for QR code scanning
    const hashHex = Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()).join('-');
    const securityHash = `SR27-${hashHex}`;

    const newRecord: RegistrationRecord = {
      ...regData,
      id: `reg-${Date.now()}`,
      passId,
      securityHash,
      paymentStatus: 'Pending Verification',
      checkInStatus: 'Not Checked In',
      registeredAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    };

    setRegistrations([newRecord, ...registrations]);
    return newRecord;
  };

  const updateRegistrationStatus = (
    id: string, 
    paymentStatus: RegistrationRecord['paymentStatus'], 
    checkInStatus?: RegistrationRecord['checkInStatus']
  ) => {
    setRegistrations(
      registrations.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            paymentStatus,
            checkInStatus: checkInStatus || r.checkInStatus,
          };
        }
        return r;
      })
    );
  };

  const deleteRegistration = (id: string) => {
    setRegistrations(registrations.filter((r) => r.id !== id));
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  return (
    <FestContext.Provider
      value={{
        events,
        sponsors,
        registrations,
        settings,
        addEvent,
        updateEvent,
        deleteEvent,
        addSponsor,
        deleteSponsor,
        addRegistration,
        updateRegistrationStatus,
        deleteRegistration,
        updateSettings,
      }}
    >
      {children}
    </FestContext.Provider>
  );
};

export const useFest = () => {
  const context = useContext(FestContext);
  if (!context) {
    throw new Error('useFest must be used within a FestProvider');
  }
  return context;
};
