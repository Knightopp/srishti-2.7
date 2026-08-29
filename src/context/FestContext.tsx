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
  teamSize?: string; // Team constraint format
  isParticipating?: boolean;
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
    id: 'treasure-hunt',
    number: '01',
    stageLabel: 'CAMPUS EXPEDITION',
    title: 'Treasure Hunt',
    category: 'Campus Adventure & Clue Hunt',
    teamSize: 'Team of 4',
    highlightText: 'Decipher cryptic riddles across the campus map in a race against the clock',
    description: 'Gather your squad of 4 to solve cryptic puzzles, follow hidden campus trails, and locate the ultimate treasure trove before other squads.',
    time: 'DEC 4 • 11:00 AM - 01:30 PM',
    venue: 'Campus Grounds & Quadrangle',
    locationId: 'main-auditorium',
    prize: '₹8,000 Pool',
    tags: ['Treasure Hunt', 'Team of 4', 'Adventure', 'Strategy'],
    color: '#00e5ff',
    bgGradient: 'from-[#082230] via-[#091a26] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    fee: 200,
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    subtitle: 'Solve Campus Puzzles in Squads of 4',
    speaker: { name: 'Campus Quest Team', role: 'Event Leads' },
    highlights: ['Multi-stage physical clues', 'Campus-wide search grid', 'Grand treasure chest reward'],
    side: 'left',
  },
  {
    id: 'ideathon',
    number: '02',
    stageLabel: 'INNOVATION ARENA',
    title: 'Ideathon — Pitch & Innovate',
    category: 'Problem Solving & Startup Pitch',
    teamSize: 'Team of 4',
    highlightText: 'Pitch innovative tech solutions to real-world socio-industrial challenges',
    description: 'Form a 4-member team to brainstorm disruptive solutions, build presentation pitch decks, and present before industry judges and startup mentors.',
    time: 'DEC 4 • 10:00 AM - 01:00 PM',
    venue: 'Seminar Hall',
    locationId: 'seminar-hall',
    prize: '₹12,000 Pool',
    tags: ['Ideathon', 'Team of 4', 'Startup', 'Pitch'],
    color: '#38bdf8',
    bgGradient: 'from-[#071830] via-[#091424] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    fee: 200,
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    subtitle: 'Brainstorm & Pitch Tech Innovations',
    speaker: { name: 'Dr. Mathew K.', role: 'Jury Lead' },
    highlights: ['Industry problem statements', 'Live 5-minute startup pitch', 'Seed mentorship opportunities'],
    side: 'right',
  },
  {
    id: 'debugging',
    number: '03',
    stageLabel: 'CODE DIAGNOSTICS',
    title: 'Bug Hunt — Code Debugging',
    category: 'Code Debugging & Error Hunting',
    teamSize: 'Solo',
    highlightText: 'Find and fix syntax, memory, and logical bugs under intense countdown pressure',
    description: 'Individual debugging challenge. Spot deliberate memory leaks, logical pitfalls, and syntax errors across C++, Java, and Python codebases.',
    time: 'DEC 4 • 02:00 PM - 03:30 PM',
    venue: 'CS Lab Complex',
    locationId: 'cs-lab',
    prize: '₹6,000 Pool',
    tags: ['Debugging', 'Solo', 'C++', 'Java', 'Python'],
    color: '#0077ff',
    bgGradient: 'from-[#0a2436] via-[#0c1c2b] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    fee: 100,
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    subtitle: 'Speed Error Spotting & Fixes',
    speaker: { name: 'Arun K.', role: 'Code Lead' },
    highlights: ['30 rapid buggy code snippets', 'Automated test suite verification', 'Cash prize for top scorers'],
    side: 'left',
  },
  {
    id: 'ai-webdev',
    number: '04',
    stageLabel: 'GENERATIVE WEB SPRINT',
    title: 'AI WebSprint — AI Website Making',
    category: 'AI-Assisted Web Design & Development',
    teamSize: 'Solo',
    highlightText: 'Build functional, responsive landing pages leveraging AI generation tools and code APIs',
    description: 'Leverage AI development tools, prompt engineering, and modern web frameworks to design, code, and deploy an aesthetic, fully interactive web application in 90 minutes.',
    time: 'DEC 4 • 03:30 PM - 05:30 PM',
    venue: 'CS Lab 2',
    locationId: 'cs-lab',
    prize: '₹8,000 Pool',
    tags: ['AI WebDev', 'Solo', 'Frontend', 'Generative AI'],
    color: '#00d4ff',
    bgGradient: 'from-[#082230] via-[#091a26] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80',
    fee: 100,
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    subtitle: 'Rapid AI-Powered Web Crafting',
    speaker: { name: 'Vishnu Prasad', role: 'AI Mentor' },
    highlights: ['Prompt-to-code creation', 'Live UI design judging', 'Instant deployment requirement'],
    side: 'right',
  },
  {
    id: 'codex',
    number: '05',
    stageLabel: 'ALGORITHMIC ARENA',
    title: 'Codex — Competitive Programming',
    category: 'Speed Algorithmic Tournament',
    teamSize: 'Solo',
    highlightText: 'Live competitive coding battle on HackerRank with real-time test case leaderboards',
    description: 'Individual speed programming contest. Solve complex data structures and algorithmic challenges within time constraints to rank atop the live arena scoreboard.',
    time: 'DEC 5 • 09:30 AM - 11:30 AM',
    venue: 'CS Lab Complex',
    locationId: 'cs-lab',
    prize: '₹10,000 Pool',
    tags: ['Codex', 'Solo', 'DSA', 'HackerRank', 'Algorithms'],
    color: '#00e5ff',
    bgGradient: 'from-[#0a182e] via-[#0d1e38] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    fee: 100,
    day: 'dec-5',
    dayLabel: 'DECEMBER 5, 2026',
    subtitle: 'Algorithmic Speed Showdown',
    speaker: { name: 'Neeraj S.', role: 'Contest Coordinator' },
    highlights: ['Live arena leaderboard', 'DSA & optimization problems', 'Cash prizes for Top 3 coders'],
    side: 'left',
  },
  {
    id: 'waltz',
    number: '06',
    stageLabel: 'CHOREOGRAPHY ARENA',
    title: 'Waltz — Group Dance Competition',
    category: 'Western & Thematic Dance Battle',
    teamSize: 'Team (No Limit)',
    highlightText: 'High-octane group dance performance on the grand open stage',
    description: 'Synchronized choreography, electrifying beats, and stunning stage presence. Open team size dance showdown judged on rhythm, theme, and execution.',
    time: 'DEC 4 • 06:00 PM - 08:30 PM',
    venue: 'Main Auditorium Stage',
    locationId: 'open-stage',
    prize: '₹15,000 Pool',
    tags: ['Dance', 'Waltz', 'Team', 'Cultural', 'Stage'],
    color: '#38bdf8',
    bgGradient: 'from-[#180a2e] via-[#100924] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
    fee: 300,
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    subtitle: 'Grand Stage Group Dance Battle',
    speaker: { name: 'Cultural Committee', role: 'Stage Coordinators' },
    highlights: ['Unlimited team size welcome', 'Professional light & sound rig', 'Trophies + ₹15,000 cash pool'],
    side: 'right',
  },
  {
    id: 'tracebot',
    number: '07',
    stageLabel: 'ROBOTICS CIRCUIT',
    title: 'TraceBot — Line Follower Bot',
    category: 'Autonomous Robotics Race',
    teamSize: 'Team (Max 4)',
    highlightText: 'High-speed autonomous line tracing through sharp turns, loops, and obstacle bridges',
    description: 'Build and calibrate an autonomous microcontroller-based line following bot (PID/IR sensors). Race against the clock to navigate intricate track layouts with zero derailments.',
    time: 'DEC 5 • 10:00 AM - 01:00 PM',
    venue: 'Indoor Sports Complex',
    locationId: 'innovation-lab',
    prize: '₹12,000 Pool',
    tags: ['Robotics', 'TraceBot', 'Max 4', 'Hardware', 'Arduino'],
    color: '#0077ff',
    bgGradient: 'from-[#082230] via-[#091a26] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    fee: 250,
    day: 'dec-5',
    dayLabel: 'DECEMBER 5, 2026',
    subtitle: 'High-Speed Autonomous Track Race',
    speaker: { name: 'Robotics Wing', role: 'Circuit Marshals' },
    highlights: ['Intricate high-speed arena track', 'Precision PID calibration timing', 'Prizes for fastest lap bots'],
    side: 'left',
  },
  {
    id: 'blind-coding',
    number: '08',
    stageLabel: 'SCREENLESS CODING',
    title: 'Blind Coding — No Monitor Challenge',
    category: 'Blind Code & Pure Syntax Mastery',
    teamSize: 'Solo',
    highlightText: 'Type working code solutions with monitors completely turned off',
    description: 'Type algorithm solutions in C, C++, or Java with monitors powered off. No syntax highlighting, no backspace preview. The most accurate compiler execution wins.',
    time: 'DEC 5 • 11:30 AM - 01:00 PM',
    venue: 'CS Lab 3',
    locationId: 'cs-lab',
    prize: '₹6,000 Pool',
    tags: ['Blind Coding', 'Solo', 'Syntax', 'Hardcore'],
    color: '#00d4ff',
    bgGradient: 'from-[#0a182e] via-[#0d1e38] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    fee: 100,
    day: 'dec-5',
    dayLabel: 'DECEMBER 5, 2026',
    subtitle: 'Type Code with Displays Powered Off',
    speaker: { name: 'Code Cell', role: 'Lab Marshals' },
    highlights: ['Monitors turned off during typing', 'Compiler score test run', 'Pure memory syntax test'],
    side: 'right',
  },
  {
    id: 'mind-game',
    number: '09',
    stageLabel: 'LOGIC & STRATEGY',
    title: 'Mind Game — Psychological & Puzzle Arena',
    category: 'Strategy, Logic & Escape Puzzles',
    teamSize: 'Team of 4',
    highlightText: 'High-stakes multi-round mental challenges, logic locks, and situational riddles',
    description: 'Compete in squads of 4 across dynamic escape-room logic rounds, pattern deconstructions, and rapid tactical decision-making puzzles.',
    time: 'DEC 5 • 01:30 PM - 03:30 PM',
    venue: 'Conference Hall',
    locationId: 'conference-room',
    prize: '₹8,000 Pool',
    tags: ['Mind Game', 'Team of 4', 'Puzzles', 'Logic'],
    color: '#00e5ff',
    bgGradient: 'from-[#071830] via-[#091424] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    fee: 200,
    day: 'dec-5',
    dayLabel: 'DECEMBER 5, 2026',
    subtitle: 'Tactical Squad Escape & Logic Battle',
    speaker: { name: 'Puzzle Masters', role: 'Game Masters' },
    highlights: ['Multi-chamber logic locks', 'Squad collaborative deduction', 'Clock countdown escape'],
    side: 'left',
  },
  {
    id: 'tech-quiz',
    number: '10',
    stageLabel: 'TRIVIA ARENA',
    title: 'ByteQuiz — Tech & General Quiz',
    category: 'Rapid Fire & Stage Buzzer Showdown',
    teamSize: 'Duo or Solo',
    highlightText: 'Multi-round buzzer showdown covering tech breakthroughs, gaming, and CS trivia',
    description: 'Battle across prelims and on-stage buzzer rounds testing CS fundamentals, pop tech culture, cybersecurity lore, and general intelligence.',
    time: 'DEC 5 • 02:00 PM - 04:00 PM',
    venue: 'Main Auditorium',
    locationId: 'main-auditorium',
    prize: '₹8,000 Pool',
    tags: ['Quiz', 'Duo / Solo', 'Trivia', 'Buzzer'],
    color: '#38bdf8',
    bgGradient: 'from-[#0c2838] via-[#0a1d2b] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    fee: 100,
    day: 'dec-5',
    dayLabel: 'DECEMBER 5, 2026',
    subtitle: 'On-Stage Tech Buzzer Duel',
    speaker: { name: 'Quizmaster Ajay V.', role: 'Quiz Lead' },
    highlights: ['Stage buzzer finalists round', 'CS & gaming pop culture trivia', 'Trophies + Cash prize pool'],
    side: 'right',
  },
  {
    id: 'face-painting',
    number: '11',
    stageLabel: 'ART & CREATIVE EXPO',
    title: 'Face Painting — Cyberpunk & Theme Art',
    category: 'Creative Arts & Thematic Canvas',
    teamSize: 'Team of 2 or Solo',
    highlightText: 'Transform faces into futuristic cyber, fantasy, and sci-fi artwork',
    description: 'Express imagination with vibrant paint, thematic concepts, and futuristic motifs. Judged on creativity, precision, color harmony, and visual impact.',
    time: 'DEC 5 • 02:30 PM - 04:30 PM',
    venue: 'Art Courtyard',
    locationId: 'seminar-hall',
    prize: '₹6,000 Pool',
    tags: ['Face Painting', 'Duo / Solo', 'Art', 'Creative'],
    color: '#0077ff',
    bgGradient: 'from-[#0b2438] via-[#091b2b] to-[#080b12]',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    fee: 150,
    day: 'dec-5',
    dayLabel: 'DECEMBER 5, 2026',
    subtitle: 'Futuristic Cyber Canvas Painting',
    speaker: { name: 'Fine Arts Jury', role: 'Art Curators' },
    highlights: ['Theme: Cyberpunk & Future Tech', 'Paints & materials permitted', 'Cash prizes for Top 3 artists'],
    side: 'left',
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

const DEFAULT_REGISTRATIONS: RegistrationRecord[] = [];

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
    teamSize: raw.teamSize || defaultRef.teamSize || undefined,
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
      : (defaultRef.isParticipating !== undefined ? defaultRef.isParticipating : true),
  };
};

const FestContext = createContext<FestContextType | undefined>(undefined);

export const FestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('srishti_events_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_EVENTS.length) {
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
