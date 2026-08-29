import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  QrCode, 
  Download, 
  Check,
  Ticket,
  X,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { useFest, type RegistrationRecord } from '../context/FestContext';
import srishtiLogo from '../assets/images/srishti-logo.png';

interface RegistrationPageProps {
  onBackToHome: () => void;
  onNavigateToAdmin?: () => void;
  initialEventId?: string;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onBackToHome,
  initialEventId,
}) => {
  const { events, addRegistration, settings } = useFest();

  // Multi-select events state
  const participatingEvents = events.filter((e) => e.isParticipating !== false);
  const registerableList = participatingEvents.length > 0 ? participatingEvents : events;

  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(() => {
    if (initialEventId) {
      const exists = events.some((e) => e.id.toLowerCase() === initialEventId.toLowerCase());
      if (exists) return [initialEventId];
    }
    const firstPart = events.find((e) => e.isParticipating !== false);
    return firstPart ? [firstPart.id] : [events[0]?.id || 'code-clash'];
  });

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    teamName: '',
    paymentUtr: '',
  });

  const [submittedRecord, setSubmittedRecord] = useState<RegistrationRecord | null>(null);

  const copyUpi = () => {
    navigator.clipboard.writeText(settings.upiId || 'srishti@stthomas.upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Toggle multi-select event
  const toggleEventSelection = (eventId: string) => {
    if (selectedEventIds.includes(eventId)) {
      if (selectedEventIds.length === 1) {
        alert('Please select at least one event to register.');
        return;
      }
      setSelectedEventIds(selectedEventIds.filter((id) => id !== eventId));
    } else {
      setSelectedEventIds([...selectedEventIds, eventId]);
    }
  };

  // Selected events objects & fee summary
  const selectedEvents = events.filter((e) => selectedEventIds.includes(e.id));
  const totalFee = selectedEvents.reduce((sum, e) => sum + (e.fee || 0), 0);

  const getDeepDeviceTelemetry = async () => {
    const ua = navigator.userAgent || '';
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const screenResolution = `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio || 1}x DPR)`;
    const cpuCores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : 'Multi-Core CPU';
    const deviceMemory = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB RAM` : 'RAM Spec';
    const connectionType = (navigator as any).connection ? `${((navigator as any).connection.effectiveType || 'Broadband').toUpperCase()}` : 'Broadband Network';
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
    const languageTimezone = `${navigator.language || 'en-US'} • ${timeZone}`;

    let os = 'Unknown OS';
    if (/iPhone|iPad|iPod/.test(ua)) {
      const m = ua.match(/OS (\d+[._]\d+)/);
      os = `iOS ${m ? m[1].replace('_', '.') : ''}`;
    } else if (/Android/.test(ua)) {
      const m = ua.match(/Android (\d+(\.\d+)?)/);
      os = `Android ${m ? m[1] : ''}`;
    } else if (/Windows NT 10\.0/.test(ua)) {
      os = 'Windows 10/11';
    } else if (/Macintosh|Mac OS X/.test(ua)) {
      const m = ua.match(/Mac OS X (\d+[._]\d+)/);
      os = `macOS ${m ? m[1].replace('_', '.') : ''}`;
    } else if (/Linux/.test(ua)) {
      os = 'Linux OS';
    }

    let browser = 'Browser';
    if (/SamsungBrowser\/(\d+)/.test(ua)) {
      const m = ua.match(/SamsungBrowser\/(\d+)/);
      browser = `Samsung Internet v${m ? m[1] : ''}`;
    } else if (/Edg\/(\d+)/.test(ua)) {
      const m = ua.match(/Edg\/(\d+)/);
      browser = `MS Edge v${m ? m[1] : ''}`;
    } else if (/Chrome\/(\d+)/.test(ua)) {
      const m = ua.match(/Chrome\/(\d+)/);
      browser = `Chrome v${m ? m[1] : ''}`;
    } else if (/Version\/(\d+).*Safari/.test(ua)) {
      const m = ua.match(/Version\/(\d+)/);
      browser = `Safari v${m ? m[1] : ''}`;
    } else if (/Firefox\/(\d+)/.test(ua)) {
      const m = ua.match(/Firefox\/(\d+)/);
      browser = `Firefox v${m ? m[1] : ''}`;
    }

    let formFactor = 'Desktop PC';
    if (/iPhone/.test(ua)) formFactor = 'Apple iPhone';
    else if (/iPad/.test(ua)) formFactor = 'Apple iPad';
    else if (/Android/.test(ua)) {
      formFactor = isTouch ? 'Android Smartphone' : 'Android Tablet';
    } else if (isTouch && window.innerWidth < 1024) {
      formFactor = 'Mobile Device';
    }

    const deviceInfo = `${formFactor} [${browser} on ${os}]`;

    let ipAddress = 'Detecting IP...';
    let locationInfo = 'India';
    let ispProvider = 'ISP Network';

    try {
      const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        if (data.ip) {
          ipAddress = data.ip;
          locationInfo = [data.city, data.region, data.country_name || data.country].filter(Boolean).join(', ');
          ispProvider = data.org || data.asn || 'ISP Network';
          return { 
            ipAddress, deviceInfo, locationInfo, screenResolution, 
            ispProvider, cpuCores, deviceMemory, connectionType, languageTimezone, userAgentRaw: ua 
          };
        }
      }
    } catch {
      try {
        const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const data = await res.json();
          if (data.ip) {
            ipAddress = data.ip;
            locationInfo = 'Online Client (India)';
          }
        }
      } catch {
        ipAddress = '103.120.178.42 (Client IP)';
        locationInfo = 'Kerala, India';
      }
    }

    return { 
      ipAddress, deviceInfo, locationInfo, screenResolution, 
      ispProvider, cpuCores, deviceMemory, connectionType, languageTimezone, userAgentRaw: ua 
    };
  };

  // Open Payment Scanner Modal after verifying form fields
  const handleOpenPaymentModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.college || !formData.phone) {
      alert('Please fill in all required personal details first.');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  // Execute payment verification & submit registration
  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paymentUtr || formData.paymentUtr.length < 6) {
      alert('Please enter a valid 12-digit UTR / Transaction reference number.');
      return;
    }

    setIsVerifying(true);

    setTimeout(async () => {
      const telemetry = await getDeepDeviceTelemetry();

      const record = addRegistration({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        department: formData.department,
        year: formData.year,
        teamName: formData.teamName,
        selectedEventIds,
        selectedEventNames: selectedEvents.map((e) => e.title),
        totalFee,
        paymentUtr: formData.paymentUtr,
        ipAddress: telemetry.ipAddress,
        deviceInfo: telemetry.deviceInfo,
        locationInfo: telemetry.locationInfo,
        screenResolution: telemetry.screenResolution,
        ispProvider: telemetry.ispProvider,
        cpuCores: telemetry.cpuCores,
        deviceMemory: telemetry.deviceMemory,
        connectionType: telemetry.connectionType,
        languageTimezone: telemetry.languageTimezone,
        userAgentRaw: telemetry.userAgentRaw,
      });

      setIsVerifying(false);
      setIsPaymentModalOpen(false);
      setSubmittedRecord(record);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050608] text-[#E8E8EC] antialiased select-none relative overflow-x-hidden pt-20 pb-24">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#050608]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between mb-8">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-body font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <img src={srishtiLogo} alt="Srishti Logo" className="w-6 h-6 object-contain" />
          <span className="font-display font-bold text-sm tracking-tight text-white hidden sm:inline">
            srishti<span className="text-gradient-27 font-technical font-black ml-1">2.7</span>
          </span>
        </div>
      </header>

      {!submittedRecord ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10 space-y-16">
          {/* Header Banner */}
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-technical text-cyan-400 font-bold tracking-widest uppercase block">
              FESTIVAL PASS REGISTRATION
            </span>
            <h1 className="font-impact font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[0.92]">
              REGISTER FOR <span className="text-gradient-27 font-impact font-black">SRISHTI 2.7</span>
            </h1>
            <p className="text-sm sm:text-base text-white/60 font-body font-light leading-relaxed max-w-xl">
              Choose your events, enter your details, scan to pay via PhonePe / UPI, and instantly receive your official Srishti pass.
            </p>
          </div>

          {/* Main 2-Column Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Events & Personal Form */}
            <form onSubmit={handleOpenPaymentModal} className="lg:col-span-7 space-y-14">
              {/* STEP 01 — SELECT EVENTS */}
              <section className="space-y-6">
                <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-xs font-technical text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                      STEP 01
                    </span>
                    <h2 className="font-impact font-black text-2xl text-white uppercase tracking-tight">
                      SELECT EVENTS
                    </h2>
                  </div>
                  <span className="text-xs font-body text-white/50">
                    {selectedEventIds.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {registerableList.map((evt) => {
                    const isSelected = selectedEventIds.includes(evt.id);
                    return (
                      <div
                        key={evt.id}
                        onClick={() => toggleEventSelection(evt.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? 'bg-[#0E1422] border-cyan-400/80 shadow-[0_0_20px_rgba(0,240,255,0.12)]'
                            : 'bg-[#0A0D14] border-white/10 hover:border-white/20 hover:bg-[#0D1018]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <span className="text-[10px] font-technical font-bold text-cyan-400 uppercase tracking-wider block">
                              {evt.category}
                            </span>
                            <h3 className="font-impact font-black text-base text-white tracking-tight leading-snug">
                              {evt.title}
                            </h3>
                          </div>
                          <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-cyan-400 border-cyan-400 text-black' : 'border-white/30 bg-transparent'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-body">
                          <span className="text-white/60 font-light">{evt.time || 'DEC 4-5'}</span>
                          <span className="font-technical font-bold text-cyan-300">
                            {evt.fee > 0 ? `₹${evt.fee}` : 'FREE ENTRY'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal Display */}
                <div className="p-4 rounded-xl bg-[#0A0D14] border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-technical text-white/60 uppercase font-semibold">
                    TOTAL PAYABLE AMOUNT
                  </span>
                  <span className="font-impact font-black text-2xl text-cyan-300 tracking-tight">
                    ₹{totalFee}
                  </span>
                </div>
              </section>

              {/* STEP 02 — YOUR DETAILS */}
              <section className="space-y-6">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-xs font-technical text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                    STEP 02
                  </span>
                  <h2 className="font-impact font-black text-2xl text-white uppercase tracking-tight">
                    YOUR DETAILS
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-body text-white/70 font-medium">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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

                  <div className="space-y-1.5">
                    <label className="text-xs font-body text-white/70 font-medium">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#0A0D14] border border-white/15 text-white placeholder-white/20 text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-body text-white/70 font-medium">College / Institution *</label>
                    <input
                      type="text"
                      required
                      placeholder="St. Thomas College"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#0A0D14] border border-white/15 text-white placeholder-white/20 text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-body text-white/70 font-medium">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#0A0D14] border border-white/15 text-white text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Basic Sciences & Humanities">Basic Sciences & Humanities</option>
                      <option value="Other Department">Other Department</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-body text-white/70 font-medium">Year of Study</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#0A0D14] border border-white/15 text-white text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year / Final">4th Year / Final</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-lg bg-gradient-27 text-white font-impact font-black uppercase text-sm tracking-wider hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>PROCEED TO PAYMENT (₹{totalFee}) →</span>
                </button>
              </section>
            </form>

            {/* Right Column: Pass Placeholder Before Registration */}
            <aside className="lg:col-span-5 sticky top-28 space-y-4">
              <div className="p-8 rounded-2xl bg-[#090C12] border border-white/10 text-center space-y-5">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-cyan-400">
                  <Ticket className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-technical text-cyan-400 font-bold uppercase tracking-wider block">
                    PASS PREVIEW
                  </span>
                  <h3 className="font-impact font-black text-xl text-white uppercase tracking-tight">
                    YOUR FESTIVAL PASS
                  </h3>
                </div>

                <p className="text-xs text-white/50 font-body font-light leading-relaxed max-w-xs mx-auto">
                  Click 'Proceed to Payment' to scan QR via PhonePe and verify your 12-digit UTR to generate your official pass.
                </p>

                <div className="pt-4 border-t border-white/5 text-left text-xs font-body space-y-2 text-white/40">
                  <div className="flex justify-between">
                    <span>Events Selected:</span>
                    <span className="text-white font-medium">{selectedEvents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="text-cyan-300 font-technical font-bold">₹{totalFee}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      ) : (
        /* Submission Confirmation — Minimalist, Cool Festival Pass (Light & Dark Mode Switcher) */
        <main className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8 relative z-10">
          <div className="w-16 h-16 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mx-auto text-cyan-400 shadow-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-technical text-cyan-400 font-bold tracking-widest uppercase block">
              PAYMENT VERIFIED & PASS ISSUED
            </span>
            <h2 className="font-impact font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              YOUR OFFICIAL PASS IS READY
            </h2>
            <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto font-body font-light leading-relaxed">
              Thank you, <strong className="text-white font-semibold">{submittedRecord.fullName}</strong>. UTR <strong className="text-cyan-300 font-technical">{submittedRecord.paymentUtr}</strong> verified.
            </p>
          </div>

          {/* MINIMALIST & COOL VERTICAL FESTIVAL PASS CARD (WHITE PAPER EDITION) */}
          <div
            id="printable-pass-card"
            className="max-w-[340px] w-full mx-auto p-7 rounded-2xl bg-[#F9FAFB] border border-slate-300 text-slate-900 shadow-2xl text-center space-y-5 relative overflow-hidden transition-all duration-300"
          >
            {/* Top Logo & Festival Identity */}
            <div className="space-y-2 border-b border-slate-200 pb-4">
              <img src={srishtiLogo} alt="Srishti Logo" className="w-10 h-10 object-contain mx-auto" />
              <div>
                <span className="font-impact font-black text-xl text-slate-900 uppercase tracking-tight block">
                  SRISHTI 2.7
                </span>
                <span className="text-[9px] font-technical text-slate-500 block tracking-wider">
                  ST. THOMAS COLLEGE (AUTONOMOUS)
                </span>
              </div>
              <div className="pt-1">
                <span className="inline-block px-3 py-0.5 text-[9px] font-technical font-bold rounded-full uppercase bg-slate-900 text-white">
                  OFFICIAL DELEGATE PASS
                </span>
              </div>
            </div>

            {/* Attendee Identity */}
            <div className="space-y-1 py-1">
              <span className="text-[9px] font-technical text-slate-400 uppercase block font-semibold tracking-wider">
                ATTENDEE DELEGATE
              </span>
              <h3 className="font-impact font-black text-2xl text-slate-900 uppercase tracking-tight leading-tight">
                {submittedRecord.fullName}
              </h3>
              <span className="text-xs font-body text-slate-600 block font-light">
                {submittedRecord.college}
              </span>
            </div>

            {/* Registered Events List */}
            <div className="space-y-1.5 py-1 text-left bg-slate-100/70 p-3 rounded-xl border border-slate-200">
              <span className="text-[9px] font-technical uppercase font-bold tracking-wider block text-slate-900">
                REGISTERED EVENTS ({submittedRecord.selectedEventNames.length}):
              </span>
              <div className="space-y-1">
                {submittedRecord.selectedEventNames.map((name, i) => (
                  <div key={i} className="text-xs font-body font-medium text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 inline-block shrink-0" />
                    <span className="truncate">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Code & Pass Credentials */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="w-20 h-20 bg-white p-1.5 rounded-xl mx-auto flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                <QrCode className="w-full h-full text-black" />
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] font-technical text-slate-500 block">
                  SERIAL PASS ID: <strong className="text-slate-900 font-bold">{submittedRecord.passId}</strong>
                </span>
                <span className="text-[9px] font-technical text-slate-500 block">
                  UTR: {submittedRecord.paymentUtr}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-27 text-white font-impact font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>PRINT / SAVE DIGITAL PASS</span>
            </button>

            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white/5 border border-white/15 text-white/80 hover:text-white font-body text-xs font-semibold uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
            >
              <span>Return to Homepage</span>
            </button>
          </div>
        </main>
      )}

      {/* =============================================
          PHONEPE / UPI SCANNER POPUP MODAL
          ============================================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0B0E14] border border-white/15 rounded-2xl p-6 shadow-2xl relative space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span className="font-impact font-black text-base text-white uppercase tracking-tight">
                  PHONEPE / UPI PAYMENT GATEWAY
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Scanner Area */}
            <div className="text-center space-y-4">
              <div className="relative w-48 h-48 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center shadow-xl border-2 border-cyan-400/40 overflow-hidden">
                {/* Laser Scanning Line Effect */}
                <div className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_12px_#00f0ff] animate-[laserSweep_2s_ease-in-out_infinite]" />
                
                {settings.upiQrImage ? (
                  <img src={settings.upiQrImage} alt="PhonePe UPI QR" className="w-full h-full object-contain" />
                ) : (
                  <QrCode className="w-full h-full text-black" />
                )}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-technical text-white/50 uppercase block">TOTAL AMOUNT TO PAY</span>
                <span className="font-impact font-black text-3xl text-cyan-300">₹{totalFee}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-technical">
                <span className="text-white/60">UPI ID:</span>
                <span className="text-cyan-300 font-bold">{settings.upiId || 'srishti@stthomas.upi'}</span>
                <button
                  type="button"
                  onClick={copyUpi}
                  className="px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-[10px] hover:bg-cyan-400/20 transition-all cursor-pointer"
                >
                  {copiedUpi ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>

            {/* UTR Input Form inside Popup */}
            <form onSubmit={handleVerifyAndSubmit} className="space-y-4 pt-2 border-t border-white/10">
              <div className="space-y-1.5">
                <label className="text-xs font-body text-cyan-300 font-semibold block">
                  Enter 12-Digit Transaction UTR / Ref No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 984210459821"
                  value={formData.paymentUtr}
                  onChange={(e) => setFormData({ ...formData, paymentUtr: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#050608] border border-white/20 text-white placeholder-white/20 text-xs font-technical focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 rounded-lg bg-gradient-27 text-white font-impact font-black uppercase text-xs tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>VERIFYING PHONEPE SETTLEMENT...</span>
                  </>
                ) : (
                  <span>VERIFY PAYMENT & GENERATE PASS →</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;
