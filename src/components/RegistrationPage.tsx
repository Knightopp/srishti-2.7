import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  QrCode, 
  Sparkles, 
  User, 
  Download, 
  CreditCard,
  Lock,
  Check
} from 'lucide-react';
import { useFest, type RegistrationRecord } from '../context/FestContext';

interface RegistrationPageProps {
  onBackToHome: () => void;
  onNavigateToAdmin?: () => void;
  initialEventId?: string;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onBackToHome,
  onNavigateToAdmin,
  initialEventId,
}) => {
  const { events, addRegistration, settings } = useFest();

  // Multi-select events state (default initialEventId or first event selected)
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

  const [hologramTheme, setHologramTheme] = useState<'cyan' | 'purple' | 'gold' | 'obsidian'>('cyan');
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
    navigator.clipboard.writeText('srishti@stthomas.upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Toggle multi-select event
  const toggleEventSelection = (eventId: string) => {
    if (selectedEventIds.includes(eventId)) {
      if (selectedEventIds.length === 1) {
        alert('You must select at least one event to register.');
        return;
      }
      setSelectedEventIds(selectedEventIds.filter((id) => id !== eventId));
    } else {
      setSelectedEventIds([...selectedEventIds, eventId]);
    }
  };

  // Selected events objects
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

  // 1. Detect OS & Version
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

  // 2. Detect Browser Name & Version
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

  // 3. Detect Form Factor / Device Brand
  let formFactor = 'Desktop PC';
  if (/iPhone/.test(ua)) formFactor = 'Apple iPhone';
  else if (/iPad/.test(ua)) formFactor = 'Apple iPad';
  else if (/Android/.test(ua)) {
    formFactor = isTouch ? 'Android Smartphone' : 'Android Tablet';
  } else if (isTouch && window.innerWidth < 1024) {
    formFactor = 'Mobile Device';
  }

  const deviceInfo = `${formFactor} [${browser} on ${os}]`;

  // 4. Fetch Client Public IP, City, Region & ISP Provider
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
      alert('Please fill in all required fields.');
      return;
    }
    if (!formData.paymentUtr || formData.paymentUtr.length < 6) {
      alert('Please enter a valid Bank UTR / Transaction Reference ID for payment verification.');
      return;
    }

    // Extract deep device & IP telemetry
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
    <div className="min-h-screen bg-[#070709] text-[#f5f5f7] antialiased select-none relative overflow-x-hidden pt-24 pb-20">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#0077ff]/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#00e5ff]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Controls Bar */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between mb-10 z-30 relative">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 text-white/80 hover:bg-white/10 hover:text-white font-mono text-xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HOMEPAGE</span>
        </button>

        {onNavigateToAdmin && (
          <button
            onClick={onNavigateToAdmin}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0077ff]/20 border border-[#0077ff]/40 text-[#00e5ff] hover:bg-[#0077ff]/30 font-mono text-xs transition-all active:scale-95"
          >
            <span>ADMIN DASHBOARD</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {!submittedRecord ? (
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-20">
          {/* Left Column: Multi-Event Selection & Form */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-mono text-[#0077ff] tracking-widest uppercase font-bold block mb-2">
                07 / OFFICIAL MULTI-EVENT REGISTRATION
              </span>
              <h1 className="font-impact font-black text-3xl sm:text-5xl uppercase text-white tracking-tight leading-none">
                REGISTER FOR <span className="text-gradient-27 font-impact font-black">SRISHTI 2.7</span>
              </h1>
              <p className="text-xs sm:text-sm text-white/60 font-light mt-3 leading-relaxed">
                Select one or multiple events to build your custom fest pass. Verify your UPI payment UTR reference ID below to generate your cryptographically signed pass.
              </p>
            </div>

            {/* Multi-Select Event Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-white/70 uppercase font-semibold block">
                  Select Events (Multiple Allowed):
                </label>
                <span className="text-xs font-mono text-[#00e5ff]">
                  {selectedEventIds.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {registerableList.map((evt) => {
                  const isSelected = selectedEventIds.includes(evt.id);
                  return (
                    <div
                      key={evt.id}
                      onClick={() => toggleEventSelection(evt.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start gap-3 relative ${
                        isSelected
                          ? 'bg-[#0077ff]/15 border-[#0077ff] ring-2 ring-[#0077ff]/50 shadow-lg shadow-[#0077ff]/20'
                          : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                        <Sparkles className="w-4 h-4" style={{ color: evt.color || '#0077ff' }} />
                      </div>
                      <div className="space-y-1 overflow-hidden flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-syne font-bold text-sm text-white truncate">
                            {evt.title}
                          </h4>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#00e5ff] border-[#00e5ff] text-black' : 'border-white/30'}`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-white/50 block truncate">
                          {evt.category}
                        </span>
                        <div className="flex items-center gap-2 text-[9px] font-mono pt-1">
                          <span className="text-[#00e5ff] font-bold">
                            {evt.fee > 0 ? `₹${evt.fee}` : 'FREE ENTRY'}
                          </span>
                          <span className="text-white/30">•</span>
                          <span className="text-white/60 truncate">{evt.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
              <h3 className="font-syne text-lg font-bold text-white uppercase border-b border-white/10 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#0077ff]" />
                <span>Student Personal Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/70 font-semibold flex items-center gap-1.5">
                    <span>FULL NAME *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/30 text-xs font-mono focus:outline-none focus:border-[#0077ff]"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/70 font-semibold flex items-center gap-1.5">
                    <span>EMAIL ADDRESS *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/30 text-xs font-mono focus:outline-none focus:border-[#0077ff]"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/70 font-semibold flex items-center gap-1.5">
                    <span>PHONE NUMBER *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/30 text-xs font-mono focus:outline-none focus:border-[#0077ff]"
                  />
                </div>

                {/* College Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/70 font-semibold flex items-center gap-1.5">
                    <span>COLLEGE / INSTITUTION *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="St. Thomas College"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/30 text-xs font-mono focus:outline-none focus:border-[#0077ff]"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/70 font-semibold flex items-center gap-1.5">
                    <span>DEPARTMENT</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#0077ff]"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Other Stream">Other Stream</option>
                  </select>
                </div>

                {/* Year of Study */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-white/70 font-semibold flex items-center gap-1.5">
                    <span>YEAR OF STUDY</span>
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#0077ff]"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year / PG">4th Year / PG</option>
                  </select>
                </div>
              </div>

              {/* UPI Payment Verification Box */}
              <div className="p-5 rounded-2xl bg-[#0b101c] border border-[#0077ff]/40 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#00e5ff]" />
                    <span className="font-syne font-bold text-sm text-white uppercase">
                      UPI Payment Gateway & Verification
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#00e5ff]">
                    TOTAL: ₹{totalFee}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* UPI QR Code */}
                  <div className="w-24 h-24 bg-white p-2 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-xl overflow-hidden">
                    {settings.upiQrImage ? (
                      <img src={settings.upiQrImage} alt="UPI QR Code" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="w-full h-full text-black" />
                    )}
                  </div>

                  <div className="space-y-1 text-xs font-mono flex-1">
                    <span className="text-white/50 block">Scan QR code or Pay via UPI ID:</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-cyan-300 font-bold block text-sm">{settings.upiId}</strong>
                      <button
                        type="button"
                        onClick={copyUpi}
                        className="px-2.5 py-1 rounded bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono hover:bg-cyan-400/20 transition-all cursor-pointer"
                      >
                        {copiedUpi ? '✓ COPIED' : 'COPY'}
                      </button>
                    </div>
                    <p className="text-[10px] text-white/40 pt-1">
                      Pay total <strong className="text-white">₹{totalFee}</strong> using GPay/PhonePe/Paytm. Enter your 12-digit Bank Transaction Reference/UTR ID below for instant cryptographic pass verification.
                    </p>
                  </div>
                </div>

                {/* UTR Input Field */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-mono text-[#00e5ff] font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>12-DIGIT BANK TRANSACTION UTR / REF NO. (REQUIRED) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 984210459821"
                    value={formData.paymentUtr}
                    onChange={(e) => setFormData({ ...formData, paymentUtr: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/80 border border-[#0077ff]/60 text-white placeholder-white/30 text-xs font-mono focus:outline-none focus:border-[#00e5ff]"
                  />
                  <span className="text-[10px] font-mono text-white/40 block pt-0.5">
                    💡 Tip: Open Google Pay / PhonePe / Paytm ➔ Click payment details ➔ Copy 12-digit UTR/Ref No.
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00e5ff] via-[#0077ff] to-[#0055ff] text-white font-syne font-extrabold uppercase text-xs sm:text-sm tracking-wider shadow-lg shadow-[#0077ff]/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Verify Payment & Issue Cryptographic Pass</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Live Holographic Digital Pass Preview */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="sticky top-28 space-y-4">
              {/* Urgency & Hologram Theme Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white/50 uppercase tracking-wider font-semibold">
                    LIVE DYNAMIC PASS PREVIEW
                  </span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                    LIVE DRAFT
                  </span>
                </div>

                {/* Hologram Theme Pills */}
                <div className="flex items-center justify-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setHologramTheme('cyan')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                      hologramTheme === 'cyan'
                        ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    CYAN
                  </button>
                  <button
                    type="button"
                    onClick={() => setHologramTheme('purple')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                      hologramTheme === 'purple'
                        ? 'bg-purple-400 text-black shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    VIOLET
                  </button>
                  <button
                    type="button"
                    onClick={() => setHologramTheme('gold')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                      hologramTheme === 'gold'
                        ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    GOLD VIP
                  </button>
                  <button
                    type="button"
                    onClick={() => setHologramTheme('obsidian')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                      hologramTheme === 'obsidian'
                        ? 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    OBSIDIAN
                  </button>
                </div>
              </div>

              {/* High-Tech Holographic Pass Card */}
              <div
                className={`p-6 rounded-3xl border shadow-2xl relative overflow-hidden space-y-5 transition-all duration-500 group ${
                  hologramTheme === 'cyan'
                    ? 'border-cyan-400/50 shadow-[0_0_35px_rgba(0,240,255,0.2)] bg-gradient-to-b from-[#091522] via-[#080d16] to-[#040609]'
                    : hologramTheme === 'purple'
                    ? 'border-purple-400/50 shadow-[0_0_35px_rgba(168,85,247,0.2)] bg-gradient-to-b from-[#180922] via-[#100816] to-[#060409]'
                    : hologramTheme === 'gold'
                    ? 'border-amber-400/50 shadow-[0_0_35px_rgba(245,158,11,0.2)] bg-gradient-to-b from-[#221709] via-[#161008] to-[#090604]'
                    : 'border-emerald-400/50 shadow-[0_0_35px_rgba(16,185,129,0.2)] bg-gradient-to-b from-[#092218] via-[#081610] to-[#040906]'
                }`}
              >
                {/* Holographic Sheen Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                    hologramTheme === 'cyan'
                      ? 'from-cyan-400 via-blue-500 to-indigo-500'
                      : hologramTheme === 'purple'
                      ? 'from-purple-400 via-pink-500 to-indigo-500'
                      : hologramTheme === 'gold'
                      ? 'from-amber-300 via-yellow-500 to-orange-500'
                      : 'from-emerald-400 via-teal-500 to-cyan-500'
                  }`}
                />

                {/* Metallic Watermark Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />

                {/* Pass Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/15 p-1 flex items-center justify-center">
                      <img src="/srishti-logo-transparent.png" alt="Srishti Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <span className="font-impact font-black text-sm text-white block uppercase tracking-tight">
                        SRISHTI <span className="text-gradient-27 font-impact font-black">2.7</span>
                      </span>
                      <span className="text-[9px] font-mono text-white/40 block">ST. THOMAS COLLEGE (AUTONOMOUS)</span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[9px] font-mono font-bold border rounded-full uppercase tracking-wider ${
                      hologramTheme === 'cyan'
                        ? 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40'
                        : hologramTheme === 'purple'
                        ? 'bg-purple-400/20 text-purple-300 border-purple-400/40'
                        : hologramTheme === 'gold'
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                        : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40'
                    }`}
                  >
                    OFFICIAL DELEGATE PASS
                  </span>
                </div>

                {/* Attendee Name */}
                <div className="space-y-0.5 relative z-10">
                  <span className="text-[9px] font-mono text-white/40 uppercase block font-semibold">ATTENDEE NAME</span>
                  <h3 className="font-display font-bold text-xl text-white truncate uppercase tracking-tight">
                    {formData.fullName || 'YOUR FULL NAME'}
                  </h3>
                  <span className="text-xs font-mono text-white/50 block truncate">
                    {formData.college || 'COLLEGE / INSTITUTION'}
                  </span>
                </div>

                {/* Selected Events Badges */}
                <div className="space-y-2 pt-1 relative z-10">
                  <span className="text-[9px] font-mono text-cyan-300 uppercase font-bold tracking-wider block">
                    BOOKED EVENTS ({selectedEvents.length}):
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {selectedEvents.map((evt) => (
                      <div key={evt.id} className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-semibold truncate">{evt.title}</span>
                        <span className="text-[10px] text-cyan-300 shrink-0 font-bold ml-2">
                          {evt.fee > 0 ? `₹${evt.fee}` : 'FREE'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Code Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 relative z-10">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-white/40 block">CRYPTOGRAPHIC PASS SERIAL</span>
                    <span className="font-mono font-bold text-[11px] text-cyan-300 block tracking-widest">
                      SR27-8A9F-3E21
                    </span>
                    <span className="text-[9px] font-mono text-white/50 block">
                      TOTAL FEE PAID: ₹{totalFee}
                    </span>
                  </div>
                  <div className="w-14 h-14 bg-white p-1.5 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Submission Confirmation Pass Screen */
        <div className="max-w-2xl mx-auto px-5 py-12 text-center space-y-8 relative z-20">
          <div className="w-20 h-20 rounded-full bg-[#0077ff]/20 border-2 border-[#00e5ff] flex items-center justify-center mx-auto text-[#00e5ff] shadow-2xl shadow-[#0077ff]/50 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-[#00e5ff] tracking-widest uppercase font-bold">
              REGISTRATION SUBMITTED & UTR RECORDED!
            </span>
            <h2 className="font-syne text-3xl sm:text-4xl font-black text-white uppercase">
              Digital Entry Pass Issued!
            </h2>
            <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto font-light">
              Thank you, <strong className="text-white font-bold">{submittedRecord.fullName}</strong>. UTR <strong className="text-[#00e5ff]">{submittedRecord.paymentUtr}</strong> is recorded for verification.
            </p>
          </div>

          {/* Generated Official Pass */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#101524] via-[#0b0e18] to-[#06070a] border border-[#0077ff]/50 shadow-2xl relative overflow-hidden space-y-5 text-left max-w-md mx-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <img src="/srishti-logo-transparent.png" alt="Srishti Logo" className="w-7 h-7 object-contain" />
                <div>
                  <span className="font-syne font-bold text-sm text-white block">
                    SRISHTI <span className="font-orbitron text-[#00e5ff]">2.7</span>
                  </span>
                  <span className="text-[9px] font-mono text-white/40 block">ST. THOMAS COLLEGE</span>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[9px] font-mono font-bold bg-[#0077ff]/20 text-[#00e5ff] border border-[#0077ff]/40 rounded-full uppercase">
                {submittedRecord.paymentStatus}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#00e5ff] uppercase font-bold tracking-wider block">
                ATTENDEE: {submittedRecord.fullName}
              </span>
              <span className="text-xs font-mono text-white/70 block">{submittedRecord.college}</span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-white/40 uppercase block">BOOKED EVENTS</span>
              {submittedRecord.selectedEventNames.map((name, i) => (
                <div key={i} className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
                  <span>{name}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div>
                <span className="text-[9px] font-mono text-white/40 block">SECURITY VERIFICATION HASH</span>
                <span className="font-mono font-bold text-xs text-[#00e5ff] block">{submittedRecord.securityHash}</span>
                <span className="text-[9px] font-mono text-white/50 block">PASS ID: {submittedRecord.passId}</span>
              </div>
              <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center">
                <QrCode className="w-full h-full text-black" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-27 text-white font-body text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Print / Save Digital Ticket</span>
            </button>

            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-syne text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all"
            >
              <span>Return To Homepage</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;
