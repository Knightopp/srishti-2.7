import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  Check, 
  ArrowUpRight
} from 'lucide-react';

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
    a: 'Yes. You can select multiple events in the Registration portal. Please check the schedule timeline to ensure event timings do not overlap.',
  },
  {
    q: 'Will spot registrations be available on event days?',
    a: 'Spot registrations are subject to slot availability. Since hackathons and coding tournaments fill quickly, online pre-registration is strongly recommended.',
  },
  {
    q: 'Is accommodation provided for outstation teams?',
    a: 'Yes, basic campus hostel accommodation and verified nearby lodging assistance can be arranged for participants traveling from outside Thrissur district. Contact the Hospitality desk in advance.',
  },
  {
    q: 'What should hackathon and competitive programming participants bring?',
    a: 'Participants must bring their personal laptops, chargers, extension cords, and valid college ID cards. High-speed Wi-Fi and power strips will be provided in the venue.',
  },
];

export const ContactPage: React.FC<ContactPageProps> = ({
  onBackToHome,
  onNavigateToRegister,
}) => {

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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
    }, 600);
  };

  const facultyList = COORDINATORS.filter(c => c.category === 'Faculty');
  const studentLeads = COORDINATORS.filter(c => c.category === 'Student Lead');
  const operationsList = COORDINATORS.filter(c => c.category === 'Event Operations');

  return (
    <div className="min-h-screen w-full bg-[#050608] text-[#E8E8EC] antialiased select-none pb-24 overflow-x-hidden">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#050608]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between mb-8">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-body font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
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
            className="px-4 py-1.5 rounded-lg bg-gradient-27 text-white font-body font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>Register Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10 space-y-20 pt-6">
        {/* 01 — GET IN TOUCH (BANNER) */}
        <section className="max-w-3xl space-y-4">
          <span className="text-xs font-technical text-cyan-400 font-bold tracking-widest uppercase block">
            CONTACT & HELPDESK
          </span>
          <h1 className="font-impact font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[0.92]">
            GET IN TOUCH WITH <span className="text-gradient-27 font-impact font-black">SRISHTI 2.7</span>
          </h1>
          <p className="text-sm sm:text-base text-white/60 font-body font-light leading-relaxed max-w-xl">
            Have questions about event registrations, venue logistics, hackathons, or festival rules? Reach out to the organizing team.
          </p>
        </section>

        {/* 02 — SEND US A MESSAGE (FORM) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6 border-t border-white/10">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-technical text-cyan-400 font-bold uppercase tracking-wider block">
              01 // INQUIRIES
            </span>
            <h2 className="font-impact font-black text-3xl text-white uppercase tracking-tight">
              SEND US A MESSAGE
            </h2>
            <p className="text-xs sm:text-sm text-white/60 font-body font-light leading-relaxed">
              Fill out the form with your query and our team will get back to you promptly.
            </p>
          </div>

          <div className="lg:col-span-7">
            {submittedTicketId ? (
              <div className="p-8 rounded-2xl bg-[#090C12] border border-cyan-400/40 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-impact font-black text-2xl text-white uppercase tracking-tight">
                  MESSAGE SENT SUCCESSFULLY
                </h3>
                <p className="text-xs text-white/60 font-body">
                  Ticket Reference Number: <strong className="font-technical text-cyan-300">{submittedTicketId}</strong>
                </p>
                <button
                  onClick={() => setSubmittedTicketId(null)}
                  className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-body font-semibold text-white transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-body text-white/70 font-medium">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#0A0D14] border border-white/15 text-white placeholder-white/20 text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-body text-white/70 font-medium">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="student@college.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#0A0D14] border border-white/15 text-white placeholder-white/20 text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-body text-white/70 font-medium">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#0A0D14] border border-white/15 text-white placeholder-white/20 text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-body text-white/70 font-medium">Inquiry Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#0A0D14] border border-white/15 text-white text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Event Rules & Registration">Event Rules & Registration</option>
                      <option value="Accommodation & Hospitality">Accommodation & Hospitality</option>
                      <option value="Sponsorship & Partnerships">Sponsorship & Partnerships</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-body text-white/70 font-medium">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write your message or query here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[#0A0D14] border border-white/15 text-white placeholder-white/20 text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-lg bg-gradient-27 text-white font-impact font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>{isSubmitting ? 'SENDING...' : 'SUBMIT INQUIRY →'}</span>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* 03 — THE FESTIVAL TEAM (EDITORIAL DIRECTORY) */}
        <section className="space-y-10 pt-6 border-t border-white/10">
          <div className="space-y-2">
            <span className="text-xs font-technical text-cyan-400 font-bold uppercase tracking-wider block">
              02 // ORGANIZING COMMITTEE
            </span>
            <h2 className="font-impact font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              THE FESTIVAL TEAM
            </h2>
          </div>

          <div className="space-y-12">
            {/* FACULTY SECTION */}
            <div className="space-y-4">
              <h3 className="text-xs font-technical text-white/40 uppercase font-bold tracking-widest border-b border-white/10 pb-2">
                FACULTY CONVENORS & ADVISORS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {facultyList.map((c, i) => (
                  <div key={i} className="space-y-1 pb-4 border-b border-white/5">
                    <h4 className="font-impact font-black text-lg text-white uppercase tracking-tight">{c.name}</h4>
                    <p className="text-xs font-body text-cyan-300 font-medium">{c.role}</p>
                    <p className="text-xs font-body text-white/50">{c.department}</p>
                    <div className="flex items-center gap-4 text-xs font-technical text-white/60 pt-2">
                      <span>{c.phone}</span>
                      <span>•</span>
                      <span>{c.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STUDENT LEADS SECTION */}
            <div className="space-y-4">
              <h3 className="text-xs font-technical text-white/40 uppercase font-bold tracking-widest border-b border-white/10 pb-2">
                STUDENT CONVENORS & LEADS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studentLeads.map((c, i) => (
                  <div key={i} className="space-y-1 pb-4 border-b border-white/5">
                    <h4 className="font-impact font-black text-lg text-white uppercase tracking-tight">{c.name}</h4>
                    <p className="text-xs font-body text-cyan-300 font-medium">{c.role}</p>
                    <p className="text-xs font-body text-white/50">{c.department}</p>
                    <div className="flex items-center gap-4 text-xs font-technical text-white/60 pt-2">
                      <span>{c.phone}</span>
                      <span>•</span>
                      <span>{c.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EVENT OPERATIONS SECTION */}
            <div className="space-y-4">
              <h3 className="text-xs font-technical text-white/40 uppercase font-bold tracking-widest border-b border-white/10 pb-2">
                OPERATIONS & HOSPITALITY DESK
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {operationsList.map((c, i) => (
                  <div key={i} className="space-y-1 pb-4 border-b border-white/5">
                    <h4 className="font-impact font-black text-lg text-white uppercase tracking-tight">{c.name}</h4>
                    <p className="text-xs font-body text-cyan-300 font-medium">{c.role}</p>
                    <p className="text-xs font-body text-white/50">{c.department}</p>
                    <div className="flex items-center gap-4 text-xs font-technical text-white/60 pt-2">
                      <span>{c.phone}</span>
                      <span>•</span>
                      <span>{c.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 04 — FIND US (LOCATION & TRANSPORT) */}
        <section className="space-y-10 pt-6 border-t border-white/10">
          <div className="space-y-2">
            <span className="text-xs font-technical text-cyan-400 font-bold uppercase tracking-wider block">
              03 // VENUE DIRECTORY
            </span>
            <h2 className="font-impact font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              FIND US
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <h3 className="font-impact font-black text-2xl text-white uppercase tracking-tight">
                  ST. THOMAS COLLEGE (AUTONOMOUS)
                </h3>
                <p className="text-sm font-body text-white/70 leading-relaxed">
                  College Road, Thrissur, Kerala 680001
                </p>
              </div>

              {/* Map iFrame */}
              <div className="w-full h-72 rounded-xl overflow-hidden border border-white/15">
                <iframe
                  title="St. Thomas College Thrissur Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3922.610667362947!2d76.2144!3d10.5276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7ee466a9d1877%3A0x6b6c0e86b039433d!2sSt.%20Thomas%20College%2C%20Thrissur!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-xs font-technical text-white/40 uppercase font-bold tracking-widest border-b border-white/10 pb-2">
                GETTING HERE
              </h3>

              <div className="space-y-4 text-xs font-body">
                <div className="pb-3 border-b border-white/5 space-y-1">
                  <span className="font-technical text-cyan-300 font-bold uppercase block">BY TRAIN</span>
                  <p className="text-white/70">Thrissur Railway Station (TCR) — 1.5 km from campus. Auto rickshaws and buses available directly.</p>
                </div>

                <div className="pb-3 border-b border-white/5 space-y-1">
                  <span className="font-technical text-cyan-300 font-bold uppercase block">BY BUS</span>
                  <p className="text-white/70">Sakthan Thampuran Bus Stand & KSRTC Bus Stand are within 2 km of the campus.</p>
                </div>

                <div className="pb-3 border-b border-white/5 space-y-1">
                  <span className="font-technical text-cyan-300 font-bold uppercase block">BY AIR</span>
                  <p className="text-white/70">Cochin International Airport (COK) — 50 km away. Airport taxis available to Thrissur town.</p>
                </div>

                <div className="space-y-1">
                  <span className="font-technical text-cyan-300 font-bold uppercase block">PARKING & ENTRY</span>
                  <p className="text-white/70">Designated two-wheeler and four-wheeler parking grounds at Gate 2 with security verification.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 05 — FREQUENTLY ASKED QUESTIONS */}
        <section className="space-y-8 pt-6 border-t border-white/10">
          <div className="space-y-2">
            <span className="text-xs font-technical text-cyan-400 font-bold uppercase tracking-wider block">
              04 // FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-impact font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              FAQS
            </h2>
          </div>

          <div className="space-y-2 max-w-4xl">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border-b border-white/10 py-4 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-technical text-cyan-400 font-bold">
                        0{idx + 1}
                      </span>
                      <h3 className="font-impact font-black text-lg text-white uppercase tracking-tight group-hover:text-cyan-300 transition-colors">
                        {faq.q}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-white/50 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-3 pl-8 text-xs sm:text-sm text-white/60 font-body font-light leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;
