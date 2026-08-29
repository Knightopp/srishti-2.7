import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  Copy, 
  Check, 
  Building, 
  User, 
  ArrowUpRight 
} from 'lucide-react';
import { useFest } from '../context/FestContext';

interface ContactPageProps {
  onBackToHome: () => void;
  onNavigateToRegister?: () => void;
}

interface Coordinator {
  name: string;
  role: string;
  category: 'Faculty' | 'Student Lead' | 'Event Operations';
  phone: string;
  email: string;
  department: string;
}

const COORDINATORS: Coordinator[] = [
  {
    name: 'Dr. Mathew K.',
    role: 'Faculty General Convenor (HOD)',
    category: 'Faculty',
    phone: '+91 94471 23456',
    email: 'hodcs@stthomas.ac.in',
    department: 'Department of Computer Science',
  },
  {
    name: 'Prof. Priya S.',
    role: 'Faculty Staff Advisor',
    category: 'Faculty',
    phone: '+91 98460 78901',
    email: 'priyas@stthomas.ac.in',
    department: 'Department of Computer Science',
  },
  {
    name: 'Kailas Venugopal',
    role: 'Student Festival Convenor',
    category: 'Student Lead',
    phone: '+91 97455 11223',
    email: 'kailas@srishtifest.in',
    department: 'Final Year B.Sc / MCA',
  },
  {
    name: 'Ananya R.',
    role: 'Technical Events & Hackathon Lead',
    category: 'Student Lead',
    phone: '+91 96332 44556',
    email: 'ananya.tech@srishtifest.in',
    department: 'CS Department',
  },
  {
    name: 'Rahul M.',
    role: 'Operations & Registration Desk Lead',
    category: 'Event Operations',
    phone: '+91 95260 88990',
    email: 'registrations@srishtifest.in',
    department: 'CS Department',
  },
  {
    name: 'Sneha K.',
    role: 'Public Relations & Hospitality Lead',
    category: 'Event Operations',
    phone: '+91 98950 33221',
    email: 'hospitality@srishtifest.in',
    department: 'CS Department',
  },
];

const FAQS = [
  {
    q: 'Can students from any college or university register for Srishti 2.7?',
    a: 'Yes! Srishti 2.7 is an all-India intercollegiate techno-cultural fest open to all undergraduate and postgraduate students with a valid college ID card.',
  },
  {
    q: 'Can I participate in multiple events across Day 1 and Day 2?',
    a: 'Absolutely. You can select multiple events in the Registration portal. Please check the schedule timeline to ensure event timings do not overlap.',
  },
  {
    q: 'Will spot registrations be available on event days?',
    a: 'Spot registrations are subject to slot availability. Since slots for hackathons and coding tournaments fill quickly, online pre-registration is strongly recommended.',
  },
  {
    q: 'Is accommodation provided for outstation teams?',
    a: 'Yes, basic campus hostel accommodation and verified nearby lodging assistance can be arranged for participants traveling from outside Thrissur district. Contact the Hospitality desk in advance.',
  },
  {
    q: 'What should hackathon and competitive programming participants bring?',
    a: 'Participants must bring their personal laptops, chargers, extension cords, and valid college ID cards. High-speed Wi-Fi and power strips will be provided in the arena.',
  },
];

export const ContactPage: React.FC<ContactPageProps> = ({
  onBackToHome,
  onNavigateToRegister,
}) => {
  const { settings } = useFest();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ticketId = `SRI-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicketId(ticketId);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        college: '',
        subject: 'General Inquiry',
        message: '',
      });
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#050608] text-[#E8E8EC] antialiased select-none pb-24 overflow-x-hidden">
      
      {/* =============================================
          TOP STICKY NAVBAR
          ============================================= */}
      <header className="sticky top-0 z-50 bg-[#050608]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-body font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-27 flex items-center justify-center text-white font-display font-bold text-xs">
            S
          </div>
          <span className="font-display font-bold text-sm tracking-tight text-white hidden sm:inline">
            srishti<span className="text-gradient-27 font-technical font-black ml-1">2.7</span>
          </span>
        </div>

        {onNavigateToRegister && (
          <button
            onClick={onNavigateToRegister}
            className="px-4 py-1.5 rounded-lg bg-gradient-27 text-white font-body font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.35)]"
          >
            <span>Register Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </header>

      {/* =============================================
          HERO BANNER
          ============================================= */}
      <div className="relative py-14 sm:py-20 px-4 sm:px-6 md:px-12 border-b border-white/[0.08] overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/[0.07] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-technical font-semibold tracking-wider uppercase">
            <Sparkles className="w-3 h-3" />
            <span>COMMUNICATION & HELPDESK DESK</span>
          </div>

          <h1 className="font-impact font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase leading-tight">
            GET IN TOUCH WITH <span className="text-gradient-27 font-impact font-black">SRISHTI 2.7</span>
          </h1>

          <p className="font-body text-sm sm:text-base text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Have questions about event rules, passes, hackathon logistics, or campus directions? Reach out to the organizing committee directly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mt-12 space-y-16">
        
        {/* =============================================
            QUICK STATS / CONTACT CARDS
            ============================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Official Email */}
          <div className="p-5 rounded-xl bg-[#0A0D14] border border-white/[0.08] space-y-3 relative group hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-technical text-white/40 uppercase font-semibold">EMAIL HELPDESK</span>
              <a href={`mailto:${settings.contactEmail || 'srishti@stthomas.ac.in'}`} className="font-body font-semibold text-sm text-white hover:text-cyan-300 transition-colors block mt-0.5 break-all">
                {settings.contactEmail || 'srishti@stthomas.ac.in'}
              </a>
            </div>
            <button
              onClick={() => handleCopy(settings.contactEmail || 'srishti@stthomas.ac.in', 'email')}
              className="text-[11px] font-technical text-cyan-400/80 hover:text-cyan-300 inline-flex items-center gap-1 cursor-pointer"
            >
              {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedField === 'email' ? 'Copied' : 'Copy Email'}</span>
            </button>
          </div>

          {/* Card 2: Hotline Phone */}
          <div className="p-5 rounded-xl bg-[#0A0D14] border border-white/[0.08] space-y-3 relative group hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-technical text-white/40 uppercase font-semibold">CONVENOR HOTLINE</span>
              <a href={`tel:${settings.contactPhone || '+919876543210'}`} className="font-body font-semibold text-sm text-white hover:text-cyan-300 transition-colors block mt-0.5">
                {settings.contactPhone || '+91 98765 43210'}
              </a>
            </div>
            <button
              onClick={() => handleCopy(settings.contactPhone || '+919876543210', 'phone')}
              className="text-[11px] font-technical text-cyan-400/80 hover:text-cyan-300 inline-flex items-center gap-1 cursor-pointer"
            >
              {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedField === 'phone' ? 'Copied' : 'Copy Phone'}</span>
            </button>
          </div>

          {/* Card 3: Location */}
          <div className="p-5 rounded-xl bg-[#0A0D14] border border-white/[0.08] space-y-3 relative group hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-technical text-white/40 uppercase font-semibold">HOST INSTITUTION</span>
              <h4 className="font-body font-semibold text-sm text-white mt-0.5">
                St. Thomas College (Autonomous)
              </h4>
              <p className="text-[11px] text-white/50 font-body">Thrissur, Kerala 680001</p>
            </div>
            <a
              href="https://maps.app.goo.gl/Ngzox3SYdTJLwHes9"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-technical text-cyan-400/80 hover:text-cyan-300 inline-flex items-center gap-1"
            >
              <span>View on Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Card 4: Event Dates */}
          <div className="p-5 rounded-xl bg-[#0A0D14] border border-white/[0.08] space-y-3 relative group hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-technical text-white/40 uppercase font-semibold">FESTIVAL DATES</span>
              <h4 className="font-body font-semibold text-sm text-white mt-0.5">
                December 4 & 5, 2026
              </h4>
              <p className="text-[11px] text-white/50 font-body">Gates Open 08:30 AM Daily</p>
            </div>
            <span className="text-[11px] font-technical text-emerald-400 inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Registrations Active</span>
            </span>
          </div>
        </div>

        {/* =============================================
            CAMPUS GOOGLE MAP & COMMUTE SECTION
            ============================================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <span className="text-[10px] font-technical text-cyan-400 uppercase tracking-widest font-semibold block">
                CAMPUS NAVIGATION
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
                LOCATION & TRANSIT GUIDE
              </h2>
            </div>

            <a
              href="https://maps.app.goo.gl/Ngzox3SYdTJLwHes9"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-27 text-white text-xs font-body font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(56,189,248,0.35)] shrink-0"
            >
              <span>Get Directions on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Embedded Google Map */}
            <div className="lg:col-span-8 h-[380px] sm:h-[440px] rounded-xl overflow-hidden border border-white/[0.12] bg-[#07090E] relative shadow-2xl">
              <iframe
                title="St. Thomas College Thrissur Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.563964950444!2d76.2166589758784!3d10.523673289610214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7ee4bf854649f%3A0xd4b05e53a9abdc9c!2sSt.%20Thomas%20College%20(Autonomous)%2C%20Thrissur!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Floating address tag */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm p-3.5 rounded-xl bg-[#050608]/92 backdrop-blur-md border border-white/[0.12] shadow-2xl">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-technical font-bold uppercase mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>COLLEGE ADDRESS</span>
                </div>
                <p className="text-xs text-white/80 font-body leading-relaxed">
                  St. Thomas College (Autonomous), College Road, Thrissur, Kerala 680001
                </p>
              </div>
            </div>

            {/* Commute Guide Cards */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-3">
              <div className="p-4 rounded-xl bg-[#0A0D14] border border-white/[0.08] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-technical text-cyan-400 font-bold uppercase">
                  <span>🚆 BY TRAIN</span>
                </div>
                <h5 className="font-body font-semibold text-xs sm:text-sm text-white">Thrissur Railway Station (TCR)</h5>
                <p className="text-[11px] text-white/50 font-body leading-relaxed">
                  Located 2.5 km away. Frequent autorickshaws and town buses available directly to St. Thomas College stop.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0D14] border border-white/[0.08] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-technical text-cyan-400 font-bold uppercase">
                  <span>🚌 BY BUS</span>
                </div>
                <h5 className="font-body font-semibold text-xs sm:text-sm text-white">KSRTC Main Stand & North Bus Stand</h5>
                <p className="text-[11px] text-white/50 font-body leading-relaxed">
                  KSRTC stand is 2.0 km away; North Bus Stand is 1.2 km away. All city buses stop directly outside campus.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0D14] border border-white/[0.08] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-technical text-cyan-400 font-bold uppercase">
                  <span>✈️ BY AIR</span>
                </div>
                <h5 className="font-body font-semibold text-xs sm:text-sm text-white">Cochin International Airport (COK)</h5>
                <p className="text-[11px] text-white/50 font-body leading-relaxed">
                  52 km away. Direct prepaid taxis, feeder buses, and airport train connection available to Thrissur.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0D14] border border-white/[0.08] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-technical text-emerald-400 font-bold uppercase">
                  <span>🅿️ VISITOR PARKING</span>
                </div>
                <p className="text-[11px] text-white/50 font-body leading-relaxed">
                  Designated two-wheeler and four-wheeler parking available at the Jubilee Campus Ground Entrance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =============================================
            INTERACTIVE INQUIRY FORM & DIRECTORY
            ============================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Send a Message Form */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-[#0A0D14] border border-white/[0.08] shadow-2xl space-y-6">
            <div className="space-y-1 border-b border-white/[0.06] pb-4">
              <span className="text-[10px] font-technical text-cyan-400 uppercase font-semibold tracking-wider">
                ONLINE INQUIRY DESK
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white uppercase">
                SEND US A MESSAGE
              </h3>
              <p className="text-xs text-white/50 font-body">
                Our support desk typically responds within 2–4 hours during festival days.
              </p>
            </div>

            {submittedTicketId ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-lg text-white">Message Received!</h4>
                <p className="text-xs text-white/70 font-body max-w-sm mx-auto">
                  Your inquiry has been logged under ticket reference:
                </p>
                <div className="font-technical text-sm font-bold text-emerald-400 bg-black/40 px-3 py-1.5 rounded-lg inline-block border border-emerald-500/30">
                  {submittedTicketId}
                </div>
                <p className="text-[11px] text-white/40 font-body">
                  A representative will reach out to you via email shortly.
                </p>
                <button
                  onClick={() => setSubmittedTicketId(null)}
                  className="mt-2 text-xs font-technical text-cyan-400 hover:underline cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-technical text-white/60 uppercase font-semibold block">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-body text-white placeholder:text-white/20 focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-technical text-white/60 uppercase font-semibold block">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-body text-white placeholder:text-white/20 focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-technical text-white/60 uppercase font-semibold block">
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-body text-white placeholder:text-white/20 focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-technical text-white/60 uppercase font-semibold block">
                      COLLEGE / INSTITUTION
                    </label>
                    <input
                      type="text"
                      placeholder="Your College Name"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-body text-white placeholder:text-white/20 focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-technical text-white/60 uppercase font-semibold block">
                    INQUIRY CATEGORY
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#07090E] border border-white/[0.1] text-xs font-body text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  >
                    <option value="General Inquiry">General Festival Inquiry</option>
                    <option value="Registration & Passes">Passes & Registration Verification</option>
                    <option value="Hackathon & Competitions">Hackathon & Competitive Coding</option>
                    <option value="Accommodation & Travel">Outstation Travel & Accommodation</option>
                    <option value="Sponsorship & Partnership">Sponsorship & Brand Partnership</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-technical text-white/60 uppercase font-semibold block">
                    YOUR MESSAGE *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us your query in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.1] text-xs font-body text-white placeholder:text-white/20 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg bg-gradient-27 text-white font-body font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(56,189,248,0.4)] disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Ticket...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: Coordinators Directory */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-1 border-b border-white/[0.08] pb-4">
              <span className="text-[10px] font-technical text-cyan-400 uppercase font-semibold tracking-wider">
                CORE COMMITTEE
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white uppercase">
                FESTIVAL COORDINATORS
              </h3>
              <p className="text-xs text-white/50 font-body">
                Connect directly with lead organizers for urgent event-related inquiries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {COORDINATORS.map((coord, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#0A0D14] border border-white/[0.06] hover:border-cyan-500/30 transition-all space-y-2.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-technical px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 uppercase font-semibold">
                      {coord.category}
                    </span>
                    <User className="w-3.5 h-3.5 text-white/30 group-hover:text-cyan-400 transition-colors" />
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-sm text-white group-hover:text-cyan-200 transition-colors">
                      {coord.name}
                    </h4>
                    <p className="text-[11px] text-white/60 font-body font-medium">
                      {coord.role}
                    </p>
                    <span className="text-[10px] text-white/35 font-technical block mt-0.5">
                      {coord.department}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-technical">
                    <a
                      href={`tel:${coord.phone}`}
                      className="text-white/75 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <Phone className="w-3 h-3 text-cyan-400" />
                      <span className="text-[11px]">{coord.phone}</span>
                    </a>

                    <a
                      href={`mailto:${coord.email}`}
                      className="text-white/40 hover:text-cyan-300 transition-colors"
                      title={coord.email}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =============================================
            FREQUENTLY ASKED QUESTIONS (FAQ)
            ============================================= */}
        <div className="space-y-6 pt-6 border-t border-white/[0.08]">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-technical text-cyan-400 uppercase tracking-widest font-semibold block">
              NEED HELP?
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white uppercase tracking-tight">
              FREQUENTLY ASKED QUESTIONS
            </h3>
            <p className="text-xs sm:text-sm text-white/50 font-body font-light">
              Clear answers to common questions about Srishti 2.7 registration, participation, and logistics.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className={`rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                    isOpen
                      ? 'bg-[#0A0E18] border-cyan-400/40 shadow-lg'
                      : 'bg-[#0A0D14] border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <span className="font-body font-semibold text-xs sm:text-sm text-white flex items-center gap-3">
                      <HelpCircle className={`w-4 h-4 shrink-0 ${isOpen ? 'text-cyan-400' : 'text-white/30'}`} />
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-white/40 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-white/60 font-body leading-relaxed border-t border-white/[0.04] animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
