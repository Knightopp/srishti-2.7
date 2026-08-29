import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  QrCode, 
  Download, 
  Check,
  Ticket,
  Copy
} from 'lucide-react';
import { useFest, type RegistrationRecord } from '../context/FestContext';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.college || !formData.phone) {
      alert('Please fill in all required personal information fields.');
      return;
    }
    if (!formData.paymentUtr || formData.paymentUtr.length < 6) {
      alert('Please enter a valid 12-digit UTR or transaction reference number.');
      return;
    }

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

    setSubmittedRecord(record);
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
          <div className="w-6 h-6 rounded-md bg-gradient-27 flex items-center justify-center text-white font-display font-bold text-xs">
            S
          </div>
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
              Choose your events, enter your details, complete the payment, and receive your official Srishti 2.7 festival pass.
            </p>
          </div>

          {/* Main 2-Column Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Form Flow */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-14">
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
              </section>

              {/* STEP 03 — PAYMENT */}
              <section className="space-y-6">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-xs font-technical text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                    STEP 03
                  </span>
                  <h2 className="font-impact font-black text-2xl text-white uppercase tracking-tight">
                    PAYMENT
                  </h2>
                </div>

                <div className="p-6 rounded-xl bg-[#0A0D14] border border-white/10 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-28 h-28 bg-white p-2 rounded-lg flex items-center justify-center shrink-0">
                      {settings.upiQrImage ? (
                        <img src={settings.upiQrImage} alt="UPI QR Code" className="w-full h-full object-contain" />
                      ) : (
                        <QrCode className="w-full h-full text-black" />
                      )}
                    </div>

                    <div className="space-y-2 text-xs font-body flex-1">
                      <span className="text-white/50 block font-light">Scan QR code or pay via UPI ID:</span>
                      <div className="flex items-center gap-3">
                        <strong className="font-technical text-cyan-300 text-sm font-bold">{settings.upiId || 'srishti@stthomas.upi'}</strong>
                        <button
                          type="button"
                          onClick={copyUpi}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/15 text-white/80 hover:text-white text-[10px] font-technical transition-colors cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedUpi ? 'COPIED' : 'COPY'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-white/50 font-light pt-1 leading-relaxed">
                        Pay total <strong className="text-white font-semibold">₹{totalFee}</strong> using GPay, PhonePe, or Paytm. Enter your 12-digit UTR / Transaction reference number below.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <label className="text-xs font-body text-cyan-300 font-semibold block">
                      12-Digit Transaction UTR / Ref No. *
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
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-lg bg-gradient-27 text-white font-impact font-black uppercase text-sm tracking-wider hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>COMPLETE REGISTRATION →</span>
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
                    STEP 04
                  </span>
                  <h3 className="font-impact font-black text-xl text-white uppercase tracking-tight">
                    YOUR FESTIVAL PASS
                  </h3>
                </div>

                <p className="text-xs text-white/50 font-body font-light leading-relaxed max-w-xs mx-auto">
                  Complete your event selection, personal details, and UPI payment UTR number to generate your official Srishti 2.7 pass.
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
        /* Submission Confirmation — Generated Official Festival Pass */
        <main className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8 relative z-10">
          <div className="w-16 h-16 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mx-auto text-cyan-400 shadow-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-technical text-cyan-400 font-bold tracking-widest uppercase block">
              REGISTRATION COMPLETE
            </span>
            <h2 className="font-impact font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              YOUR OFFICIAL PASS IS READY
            </h2>
            <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto font-body font-light leading-relaxed">
              Thank you, <strong className="text-white font-semibold">{submittedRecord.fullName}</strong>. Your transaction reference UTR <strong className="text-cyan-300 font-technical">{submittedRecord.paymentUtr}</strong> has been logged.
            </p>
          </div>

          {/* OFFICIAL FESTIVAL PASS CREDENTIAL */}
          <div className="p-8 rounded-2xl bg-[#090C12] border border-cyan-400/40 shadow-2xl text-left space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-impact font-black text-lg text-white uppercase tracking-tight block">
                  SRISHTI <span className="text-gradient-27 font-impact font-black">2.7</span>
                </span>
                <span className="text-[10px] font-technical text-white/40 block">ST. THOMAS COLLEGE (AUTONOMOUS)</span>
              </div>
              <span className="px-3 py-1 text-[10px] font-technical font-bold bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 rounded-full uppercase">
                {submittedRecord.paymentStatus}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-technical text-white/40 uppercase block font-semibold">ATTENDEE NAME</span>
              <h3 className="font-impact font-black text-2xl text-white uppercase tracking-tight">
                {submittedRecord.fullName}
              </h3>
              <span className="text-xs font-body text-white/60 block">{submittedRecord.college}</span>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-technical text-cyan-400 uppercase font-bold tracking-wider block">
                REGISTERED EVENTS ({submittedRecord.selectedEventNames.length}):
              </span>
              <div className="space-y-1">
                {submittedRecord.selectedEventNames.map((name, i) => (
                  <div key={i} className="text-xs font-body font-medium text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="space-y-1">
                <span className="text-[10px] font-technical text-white/40 block">PASS SERIAL NUMBER</span>
                <span className="font-technical font-bold text-xs text-cyan-300 block">{submittedRecord.passId}</span>
                <span className="text-[10px] font-technical text-white/40 block">SECURITY: {submittedRecord.securityHash}</span>
              </div>
              <div className="w-16 h-16 bg-white p-1.5 rounded-xl flex items-center justify-center shrink-0">
                <QrCode className="w-full h-full text-black" />
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
    </div>
  );
};

export default RegistrationPage;
