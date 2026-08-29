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
  isParticipating?: boolean; // false for Inauguration, Keynote, Lunch Breaks (Roadmap Schedule Only)
  // Schedule & Timeline Roadmap Fields
  day?: 'dec-4' | 'dec-5';
  dayLabel?: string;
  subtitle?: string;
  locationId?: string;
  speaker?: {
    name: string;
    role: string;
  };
  highlights?: string[];
  side?: 'left' | 'right';
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
  // Super Admin Security & Telemetry Metadata
  ipAddress?: string;
  deviceInfo?: string;
  locationInfo?: string;
  screenResolution?: string;
  ispProvider?: string;
  cpuCores?: string;
  deviceMemory?: string;
  connectionType?: string;
  languageTimezone?: string;
  userAgentRaw?: string;
}

export interface SystemSettings {
  upiId: string;
  upiQrImage: string;
  contactEmail: string;
  contactPhone: string;
  collegeName: string;
  cloudDbUrl: string;
}

interface FestContextType {
  events: EventItem[];
  sponsors: SponsorItem[];
  registrations: RegistrationRecord[];
  settings: SystemSettings;
  cloudStatus: 'synced' | 'syncing' | 'offline' | 'local';
  addEvent: (event: Omit<EventItem, 'id' | 'number'>) => void;
  updateEvent: (id: string, updatedEvent: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  addSponsor: (sponsor: Omit<SponsorItem, 'id'>) => void;
  deleteSponsor: (id: string) => void;
  addRegistration: (reg: Omit<RegistrationRecord, 'id' | 'passId' | 'securityHash' | 'registeredAt' | 'paymentStatus' | 'checkInStatus'>) => RegistrationRecord;
  updateRegistrationStatus: (id: string, paymentStatus: RegistrationRecord['paymentStatus'], checkInStatus?: RegistrationRecord['checkInStatus']) => void;
  deleteRegistration: (id: string) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  syncWithCloud: () => Promise<boolean>;
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonStr: string) => boolean;
}

const DEFAULT_SETTINGS: SystemSettings = {
  upiId: 'abhiramcs2007@oksbi',
  upiQrImage: '',
  contactEmail: 'srishti@stthomas.ac.in',
  contactPhone: '+91 98765 43210',
  collegeName: 'St. Thomas College',
  cloudDbUrl: 'https://script.google.com/macros/s/AKfycbxtHO-ypMU7h-pYeR0_JpZ_kaeTEQDaoqvz_OoFhk3Vx1QrTECvXsEIbMayPtH838Tj/exec',
};

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: 'ev-1',
    number: '01',
    stageLabel: 'INAUGURAL CEREMONY',
    title: 'Inaugural Ceremony & Srishti 2.7 Launch',
    category: 'Cultural & Keynote',
    highlightText: 'Opening address, lamp lighting, and official fest launch',
    description: 'The grand opening of Srishti 2.7 with dignitaries, faculty address, and the unveiling of this year\'s theme. A montage of past editions kicks off the energy.',
    time: 'DEC 4 • 09:00 AM - 10:00 AM',
    venue: 'Main Auditorium',
    locationId: 'main-auditorium',
    prize: 'Keynote & Ceremony',
    tags: ['Inauguration', 'Keynote', 'Launch'],
    color: '#0077ff',
    bgGradient: 'from-[#0a182e] via-[#0d1e38] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    fee: 0,
    isParticipating: false,
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    subtitle: 'Opening Address & Lamp Lighting',
    speaker: { name: 'Prof. Dr. Mathew K.', role: 'Head of Department, CS' },
    highlights: ['Lamp Lighting & Prayer', 'Keynote Address by Chief Guest', 'Srishti 2.7 Promo Reveal'],
    side: 'left',
  },
  {
    id: 'code-clash',
    number: '02',
    stageLabel: 'ALGORITHMIC ARENA',
    title: 'Code Clash — Competitive Programming',
    category: 'Speed Competitive Programming Tournament',
    highlightText: 'Live HackerRank real-time leaderboard with instant test case execution',
    description: 'Individual competitive programming contest hosted on HackerRank. Solve DSA challenges in C++, Java, or Python within the time limit to top the leaderboard.',
    time: 'DEC 4 • 10:30 AM - 12:30 PM',
    venue: 'CS Lab Complex',
    locationId: 'cs-lab',
    prize: '₹10,000 Pool',
    tags: ['DSA', 'Competitive Coding', 'HackerRank'],
    color: '#00e5ff',
    bgGradient: 'from-[#082230] via-[#091a26] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    fee: 100,
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    subtitle: 'Algorithmic Battle on HackerRank',
    speaker: { name: 'Arun K. & Neeraj S.', role: 'Event Coordinators' },
    highlights: ['Live HackerRank leaderboard', 'Prizes for Top 3 contestants', 'Open to all CS/IT students'],
    side: 'right',
  },
  {
    id: 'ui-design',
    number: '03',
    stageLabel: 'DESIGN SPRINT',
    title: 'UI/UX Design Sprint',
    category: 'Rapid Product Prototyping & Interface Design',
    highlightText: 'Transform raw problem briefs into interactive Figma prototypes in 120 mins',
    description: 'Teams receive a secret industry problem statement and must craft complete mobile/web UI flows. Judged on design systems, micro-interactions, and usability.',
    time: 'DEC 4 • 11:00 AM - 01:00 PM',
    venue: 'Seminar Hall',
    locationId: 'seminar-hall',
    prize: '₹10,000 Pool',
    tags: ['UI/UX', 'Figma', 'Product Design'],
    color: '#00d4ff',
    bgGradient: 'from-[#071830] via-[#091424] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    fee: 150,
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    subtitle: 'Design a Mobile App Interface in 2 Hours',
    speaker: { name: 'Meera R.', role: 'Design Lead' },
    highlights: ['Figma-based rapid prototyping', 'Industry judges scoring panel', 'Best design wins goodies + certificate'],
    side: 'left',
  },
  {
    id: 'ev-4',
    number: '04',
    stageLabel: 'MACHINE LEARNING LAB',
    title: 'AI & Machine Learning Masterclass',
    category: 'Hands-on Deep Learning & LLM Deployment',
    highlightText: '100% hands-on building: Train & deploy neural models directly on GPU colabs',
    description: 'A beginner-to-advanced hands-on workshop where participants build and train a machine learning classification model using PyTorch, scikit-learn, and Hugging Face.',
    time: 'DEC 4 • 02:00 PM - 04:00 PM',
    venue: 'Conference Room',
    locationId: 'conference-room',
    prize: 'Certificates + Swag',
    tags: ['AI/ML', 'Python', 'PyTorch', 'Workshop'],
    color: '#0077ff',
    bgGradient: 'from-[#0a2436] via-[#0c1c2b] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    fee: 150,
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    subtitle: 'Build Your First ML Model with Python',
    speaker: { name: 'Vishnu Prasad', role: 'AI Research Intern, IIT Madras' },
    highlights: ['Hands-on Google Colab notebooks', 'Real-world dataset classification', 'Certificate for all participants'],
    side: 'right',
  },
  {
    id: 'ev-5',
    number: '05',
    stageLabel: 'TECH TRIVIA',
    title: 'Tech Quiz — ByteBlitz',
    category: 'CS Trivia & Rapid Fire Showdown',
    highlightText: 'High-energy buzzer rounds covering CS fundamentals and tech pop culture',
    description: 'A high-energy tech quiz in teams of 3 covering data structures, OS, DBMS, networking, current tech trends, and pop culture crossovers.',
    time: 'DEC 4 • 04:30 PM - 06:30 PM',
    venue: 'Main Auditorium',
    locationId: 'main-auditorium',
    prize: 'Trophies + Cash',
    tags: ['Quiz', 'Trivia', 'Buzzer Round'],
    color: '#38bdf8',
    bgGradient: 'from-[#0c2838] via-[#0a1d2b] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    fee: 100,
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    subtitle: 'CS Trivia & Rapid Fire Showdown',
    speaker: { name: 'Quizmaster Ajay V.', role: 'Quiz Committee Head' },
    highlights: ['Buzzer-round finals on stage', 'Wildcard audience participation', 'Trophies for winning team'],
    side: 'left',
  },
  {
    id: 'ev-6',
    number: '06',
    stageLabel: 'CULTURAL NIGHT',
    title: 'Cultural Night & DJ Evening',
    category: 'Band Performances, Dance & Open Mic',
    highlightText: 'Live student band performances, western dance, and DJ set',
    description: 'The Day 1 cultural evening featuring student band performances, western and classical dance, stand-up comedy, and a DJ set to close the night.',
    time: 'DEC 4 • 07:00 PM - 10:00 PM',
    venue: 'Open Air Stage',
    locationId: 'open-stage',
    prize: 'Open Stage Event',
    tags: ['Cultural', 'Music', 'DJ Night'],
    color: '#00e5ff',
    bgGradient: 'from-[#180a2e] via-[#100924] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    fee: 0,
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    subtitle: 'Band Performances, Dance & Open Mic',
    speaker: { name: 'Cultural Committee', role: 'Srishti 2.7 Team' },
    highlights: ['Live Band & Acoustic Sets', 'Dance Performances & Open Mic', 'DJ Night with Light Show'],
    side: 'right',
  },
  {
    id: 'ctf',
    number: '07',
    stageLabel: 'CYBERSECURITY SHOWDOWN',
    title: 'Capture The Flag — CyberSec CTF',
    category: 'Capture The Flag — Offensive & Defensive Security',
    highlightText: 'Over 30 live exploitation & forensic puzzles on real-time sandboxes',
    description: 'Crack ciphers, exploit web vulnerabilities, reverse-engineer binaries, and race through digital forensics puzzles in this high-intensity team CTF contest.',
    time: 'DEC 5 • 09:30 AM - 11:30 AM',
    venue: 'CS Lab Complex',
    locationId: 'cs-lab',
    prize: '₹15,000 Pool',
    tags: ['Cybersecurity', 'CTF', 'Ethical Hacking'],
    color: '#0077ff',
    bgGradient: 'from-[#082230] via-[#091a26] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    fee: 200,
    day: 'dec-5',
    dayLabel: 'DECEMBER 5, 2026',
    subtitle: 'Offensive Security & Forensics Challenge',
    speaker: { name: 'Team CyberCell', role: 'CTF Organizers' },
    highlights: ['Web Exploitation & Crypto challenges', 'Live scoreboard on big screen', 'Prizes for Top 3 teams'],
    side: 'left',
  },
  {
    id: 'hackathon',
    number: '08',
    stageLabel: 'BUILD & PROTOTYPE',
    title: '6-Hour Hackathon — BuildBlitz',
    category: '6-Hour Rapid Prototyping Challenge',
    highlightText: 'More than 40% of participants win prizes or seed mentorship for MVPs',
    description: 'Teams of 3-4 race against the clock to build a working prototype from scratch. Industry mentors, live tech demos, and a ₹25,000 grand prize pool await.',
    time: 'DEC 5 • 10:00 AM - 04:00 PM',
    venue: 'CS Innovation Hub',
    locationId: 'innovation-lab',
    prize: '₹25,000 Pool',
    tags: ['Hackathon', 'Full-Stack', 'Team Challenge'],
    color: '#00e5ff',
    bgGradient: 'from-[#0a182e] via-[#0d1e38] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    fee: 300,
    day: 'dec-5',
    dayLabel: 'DECEMBER 5, 2026',
    subtitle: 'Build a Working Prototype in 6 Hours',
    speaker: { name: 'Industry Mentor Panel', role: 'Hackathon Jury' },
    highlights: ['₹25,000 Grand Prize', 'Mentorship from industry professionals', 'Live Demo Pitches to judges'],
    side: 'right',
  },
  {
    id: 'ev-9',
    number: '09',
    stageLabel: 'KEYNOTE & TALK',
    title: 'Industry Talk: Future of Web Development',
    category: 'Tech Talk & Keynote',
    highlightText: 'From React to AI-Powered Interfaces and Serverless Architectures',
    description: 'A keynote talk by an industry expert on the evolution of modern web development, serverless architectures, and AI-assisted coding tools.',
    time: 'DEC 5 • 11:30 AM - 01:00 PM',
    venue: 'Seminar Hall',
    locationId: 'seminar-hall',
    prize: 'Open Keynote',
    tags: ['WebDev', 'AI', 'Keynote'],
    color: '#00d4ff',
    bgGradient: 'from-[#071a2e] via-[#081524] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    fee: 0,
    day: 'dec-5',
    dayLabel: 'DECEMBER 5, 2026',
    subtitle: 'From React to AI-Powered Interfaces',
    speaker: { name: 'Rahul Menon', role: 'Sr. Engineer, Zoho Corp' },
    highlights: ['Modern web stack evolution', 'AI pair-programming demos', 'Q&A and career advice'],
    side: 'left',
  },
  {
    id: 'ev-10',
    number: '10',
    stageLabel: 'CLOSING CEREMONY',
    title: 'Valedictory & Prize Distribution',
    category: 'Closing Ceremony & Awards',
    highlightText: 'Grand prize announcements, trophies, and official fest wrap-up',
    description: 'The grand closing ceremony of Srishti 2.7 with hackathon results, competition prize distribution, best participant awards, and the official wrap-up address.',
    time: 'DEC 5 • 04:30 PM - 06:00 PM',
    venue: 'Main Auditorium',
    locationId: 'main-auditorium',
    prize: 'Grand Trophy Distribution',
    tags: ['Valedictory', 'Awards', 'Closing'],
    color: '#38bdf8',
    bgGradient: 'from-[#0b2438] via-[#091b2b] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80',
    fee: 0,
    day: 'dec-5',
    dayLabel: 'DECEMBER 5, 2026',
    subtitle: 'Closing Ceremony & Awards',
    speaker: { name: 'Faculty & Chief Guest', role: 'Valedictory Panel' },
    highlights: ['Hackathon Grand Prize Announcement', 'Best Participant & Team Awards', 'Srishti 2.8 Teaser Reveal'],
    side: 'right',
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
    ipAddress: '103.120.178.42',
    deviceInfo: 'Chrome 122 (Windows 11 x64)',
    locationInfo: 'Kochi, Kerala, IN',
    screenResolution: '1920x1080',
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
    ipAddress: '49.37.210.15',
    deviceInfo: 'Safari 17.2 (Apple iPhone iOS 17)',
    locationInfo: 'Thrissur, Kerala, IN',
    screenResolution: '390x844',
  },
];

const sanitizeEvent = (raw: any, index: number): EventItem => {
  const defaultRef = DEFAULT_EVENTS[index % DEFAULT_EVENTS.length] || DEFAULT_EVENTS[0];
  return {
    id: raw.id ? String(raw.id) : `evt-${Date.now()}-${index}`,
    number: raw.number || defaultRef.number || (index + 1).toString().padStart(2, '0'),
    stageLabel: raw.stageLabel || defaultRef.stageLabel || 'KEYNOTE / CONTEST',
    title: raw.title || raw.name || defaultRef.title || 'Srishti Festival Event',
    subtitle: raw.subtitle || defaultRef.subtitle || 'St. Thomas College Festival',
    category: raw.category || defaultRef.category || 'TECHNICAL',
    highlightText: raw.highlightText || defaultRef.highlightText || 'ST. THOMAS COLLEGE',
    description: raw.description || defaultRef.description || 'Srishti 2.7 National Level Inter-Collegiate Tech & Cultural Fest.',
    time: raw.time || defaultRef.time || '10:00 AM – 01:00 PM',
    venue: raw.venue || raw.location || defaultRef.venue || 'Main Auditorium',
    prize: raw.prize || raw.prizePool || defaultRef.prize || '₹10,000+',
    tags: Array.isArray(raw.tags) ? raw.tags : (defaultRef.tags || ['SRISHTI 2.7', 'TECH']),
    color: raw.color || defaultRef.color || '#0077ff',
    bgGradient: raw.bgGradient || defaultRef.bgGradient || 'from-[#0077ff]/20 to-transparent',
    image: raw.image || defaultRef.image || '',
    fee: typeof raw.fee === 'number' ? raw.fee : (defaultRef.fee || 150),
    day: raw.day || defaultRef.day || 'dec-4',
    dayLabel: raw.dayLabel || defaultRef.dayLabel || 'DAY 01 • DEC 4, 2026',
    locationId: raw.locationId || defaultRef.locationId || 'main-auditorium',
    speaker: raw.speaker && typeof raw.speaker === 'object' ? {
      name: raw.speaker.name || 'Event Coordinator',
      role: raw.speaker.role || 'St. Thomas Faculty / Student Lead',
    } : defaultRef.speaker,
    highlights: Array.isArray(raw.highlights) && raw.highlights.length > 0 ? raw.highlights : defaultRef.highlights,
    side: raw.side === 'right' ? 'right' : 'left',
    isParticipating: typeof raw.isParticipating === 'boolean' 
      ? raw.isParticipating 
      : (defaultRef.isParticipating !== undefined ? defaultRef.isParticipating : (raw.id === 'ev-1' || raw.category === 'CEREMONY' ? false : true)),
  };
};

const FestContext = createContext<FestContextType | undefined>(undefined);

export const FestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('srishti_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= DEFAULT_EVENTS.length) {
          return parsed.map((e: any, idx: number) => sanitizeEvent(e, idx));
        }
      }
      return DEFAULT_EVENTS;
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
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          cloudDbUrl: parsed.cloudDbUrl || DEFAULT_SETTINGS.cloudDbUrl,
        };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [cloudStatus, setCloudStatus] = useState<'synced' | 'syncing' | 'offline' | 'local'>('synced');

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

  // Export full database as downloadable JSON file
  const exportDatabaseJSON = () => {
    const data = {
      version: '2.7',
      exportedAt: new Date().toISOString(),
      events,
      sponsors,
      registrations,
      settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `srishti_2.7_db_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import database from JSON string
  const importDatabaseJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.events && Array.isArray(parsed.events)) {
        setEvents(parsed.events);
      }
      if (parsed.sponsors && Array.isArray(parsed.sponsors)) {
        setSponsors(parsed.sponsors);
      }
      if (parsed.registrations && Array.isArray(parsed.registrations)) {
        setRegistrations(parsed.registrations);
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      }
      setCloudStatus('synced');
      return true;
    } catch (err) {
      console.error('Failed to parse database JSON:', err);
      return false;
    }
  };



  // Fetch latest data from Cloud Database / Google Sheets API
  const fetchFromCloud = async () => {
    if (!settings.cloudDbUrl) return;
    try {
      setCloudStatus('syncing');
      const res = await fetch(settings.cloudDbUrl, {
        method: 'GET',
        redirect: 'follow',
      });
      const text = await res.text();
      // Check if response is valid JSON (not Google login HTML page)
      if (text && (text.trim().startsWith('{') || text.trim().startsWith('['))) {
        const payload = JSON.parse(text);
        const data = payload.data || payload;
        if (data.events && Array.isArray(data.events) && data.events.length > 0) {
          const sanitized = data.events.map((e: any, idx: number) => sanitizeEvent(e, idx));
          setEvents(sanitized);
        }
        if (data.sponsors && Array.isArray(data.sponsors) && data.sponsors.length > 0) {
          setSponsors(data.sponsors);
        }
        if (data.registrations && Array.isArray(data.registrations)) {
          setRegistrations(data.registrations);
        }
        setCloudStatus('synced');
      } else {
        console.warn('Cloud DB response is not JSON. Check Google Apps Script access permission (Who Has Access: Anyone).');
        setCloudStatus('offline');
      }
    } catch (err) {
      console.warn('Cloud DB fetch failed:', err);
      setCloudStatus('offline');
    }
  };

  // Cloud Sync Handler across windows & devices
  const syncWithCloud = async (overridePayload?: any): Promise<boolean> => {
    setCloudStatus('syncing');
    try {
      const payload = overridePayload || {
        events,
        sponsors,
        registrations,
        settings,
        passBaseUrl: `${window.location.origin}${window.location.pathname}`,
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('srishti_full_db', JSON.stringify(payload));
      window.dispatchEvent(new Event('srishti_db_updated'));

      // Push to Cloud Database / Google Sheets API if endpoint is set
      if (settings.cloudDbUrl) {
        await fetch(settings.cloudDbUrl, {
          method: 'POST',
          mode: 'no-cors', // Bypasses CORS preflight for Google Apps Script Web Apps!
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          redirect: 'follow',
        });
      }

      setCloudStatus('synced');
      return true;
    } catch (err) {
      console.error('syncWithCloud error:', err);
      setCloudStatus('offline');
      return false;
    }
  };

  // Auto-sync polling every 5 seconds & on window focus when cloudDbUrl is set
  useEffect(() => {
    if (!settings.cloudDbUrl) return;
    fetchFromCloud();

    const interval = setInterval(fetchFromCloud, 5000);
    const handleFocus = () => fetchFromCloud();

    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [settings.cloudDbUrl]);

  // Multi-tab / multi-device synchronization listener
  useEffect(() => {
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === 'srishti_full_db' && e.newValue) {
        try {
          const db = JSON.parse(e.newValue);
          if (db.events) setEvents(db.events);
          if (db.sponsors) setSponsors(db.sponsors);
          if (db.registrations) setRegistrations(db.registrations);
          if (db.settings) setSettings(db.settings);
          setCloudStatus('synced');
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);

  const addEvent = (newEventData: Omit<EventItem, 'id' | 'number'>) => {
    const num = (events.length + 1).toString().padStart(2, '0');
    const newEvent: EventItem = {
      ...newEventData,
      id: `evt-${Date.now()}`,
      number: num,
    };
    const next = [...events, newEvent];
    setEvents(next);
    syncWithCloud({ events: next, sponsors, registrations, settings });
  };

  const updateEvent = (id: string, updatedFields: Partial<EventItem>) => {
    const next = events.map((e) => (e.id === id ? { ...e, ...updatedFields } : e));
    setEvents(next);
    syncWithCloud({ events: next, sponsors, registrations, settings });
  };

  const deleteEvent = (id: string) => {
    if (events.length <= 1) {
      alert('At least one event must remain on the festival schedule.');
      return;
    }
    const next = events.filter((e) => e.id !== id);
    setEvents(next);
    syncWithCloud({ events: next, sponsors, registrations, settings });
  };

  const addSponsor = (newSponsorData: Omit<SponsorItem, 'id'>) => {
    const newSponsor: SponsorItem = {
      ...newSponsorData,
      id: `s-sp-${Date.now()}`,
    };
    const next = [...sponsors, newSponsor];
    setSponsors(next);
    syncWithCloud({ events, sponsors: next, registrations, settings });
  };

  const deleteSponsor = (id: string) => {
    const next = sponsors.filter((s) => s.id !== id);
    setSponsors(next);
    syncWithCloud({ events, sponsors: next, registrations, settings });
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

    const next = [newRecord, ...registrations];
    setRegistrations(next);
    syncWithCloud({ events, sponsors, registrations: next, settings });
    return newRecord;
  };

  const updateRegistrationStatus = (
    id: string, 
    paymentStatus: RegistrationRecord['paymentStatus'], 
    checkInStatus?: RegistrationRecord['checkInStatus']
  ) => {
    const next = registrations.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          paymentStatus,
          checkInStatus: checkInStatus || r.checkInStatus,
        };
      }
      return r;
    });
    setRegistrations(next);
    syncWithCloud({ events, sponsors, registrations: next, settings });
  };

  const deleteRegistration = (id: string) => {
    const next = registrations.filter((r) => r.id !== id);
    setRegistrations(next);
    syncWithCloud({ events, sponsors, registrations: next, settings });
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    const next = { ...settings, ...newSettings };
    setSettings(next);
    syncWithCloud({ events, sponsors, registrations, settings: next });
  };

  return (
    <FestContext.Provider
      value={{
        events,
        sponsors,
        registrations,
        settings,
        cloudStatus,
        addEvent,
        updateEvent,
        deleteEvent,
        addSponsor,
        deleteSponsor,
        addRegistration,
        updateRegistrationStatus,
        deleteRegistration,
        updateSettings,
        syncWithCloud,
        exportDatabaseJSON,
        importDatabaseJSON,
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
