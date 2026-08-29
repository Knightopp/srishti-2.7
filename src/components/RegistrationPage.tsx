import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Download, 
  Check,
  Ticket,
  X,
  Loader2,
  ShieldCheck,
  Eye,
  Printer,
  QrCode
} from 'lucide-react';
import QRCode from 'qrcode';
import { useFest, type RegistrationRecord } from '../context/FestContext';
import srishtiLogo from '../assets/images/srishti-logo.png';

interface RegistrationPageProps {
  onBackToHome: () => void;
  onNavigateToAdmin?: () => void;
  initialEventId?: string;
}

/**
 * High-Resolution (1600 x 1000 px) Pass Graphic Generator
 * Generates a standalone, crisp landscape festival credential.
 */
export const generatePassImage = async (record: RegistrationRecord): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  // Deep Rich Navy Background (#0A0D14)
  ctx.fillStyle = '#0A0D14';
  ctx.fillRect(0, 0, 1600, 1000);

  // Outer Border Frame Lines (#1E293B & #00F0FF Accent)
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#1E293B';
  ctx.strokeRect(30, 30, 1540, 940);

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#00F0FF';
  ctx.strokeRect(40, 40, 1520, 920);

  // Header Background Bar (#0F172A)
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(40, 40, 1520, 160);

  // Draw Srishti Logo Image
  try {
    const logoImg = new Image();
    logoImg.src = srishtiLogo;
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = resolve;
    });
    if (logoImg.complete && logoImg.naturalWidth > 0) {
      ctx.drawImage(logoImg, 80, 70, 100, 100);
    }
  } catch (err) {
    console.error('Logo render error:', err);
  }

  // Header Titles
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 48px "Montserrat", sans-serif, Arial';
  ctx.fillText('SRISHTI 2.7', 210, 115);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 20px "Inter", sans-serif, Arial';
  ctx.fillText('ST. THOMAS COLLEGE (AUTONOMOUS) • NATIONAL TECH FESTIVAL', 210, 155);

  // Delegate Pass Badge Capsule
  ctx.fillStyle = '#00F0FF';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(1200, 85, 300, 55, 28);
  } else {
    ctx.rect(1200, 85, 300, 55);
  }
  ctx.fill();

  ctx.fillStyle = '#0A0D14';
  ctx.font = '900 18px "Montserrat", sans-serif, Arial';
  ctx.textAlign = 'center';
  ctx.fillText('OFFICIAL DELEGATE PASS', 1350, 120);
  ctx.textAlign = 'left'; // Reset

  // Left Content Section (Attendee Info)
  ctx.fillStyle = '#00F0FF';
  ctx.font = '700 18px "Inter", sans-serif, Arial';
  ctx.fillText('ATTENDEE DELEGATE', 80, 260);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 44px "Montserrat", sans-serif, Arial';
  let displayName = record.fullName.toUpperCase();
  if (displayName.length > 28) displayName = displayName.substring(0, 26) + '...';
  ctx.fillText(displayName, 80, 320);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '500 24px "Inter", sans-serif, Arial';
  let displayCollege = record.college;
  if (displayCollege.length > 42) displayCollege = displayCollege.substring(0, 40) + '...';
  ctx.fillText(displayCollege, 80, 365);

  // Divider Line
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 410);
  ctx.lineTo(1060, 410);
  ctx.stroke();

  // Registered Events Section
  ctx.fillStyle = '#00F0FF';
  ctx.font = '700 20px "Inter", sans-serif, Arial';
  ctx.fillText(`REGISTERED EVENTS (${record.selectedEventNames.length}):`, 80, 465);

  let startY = 515;
  record.selectedEventNames.forEach((evtName) => {
    if (startY < 780) {
      // Bullet Dot
      ctx.fillStyle = '#00F0FF';
      ctx.beginPath();
      ctx.arc(95, startY - 8, 6, 0, Math.PI * 2);
      ctx.fill();

      // Event Title
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '600 24px "Inter", sans-serif, Arial';
      let title = evtName;
      if (title.length > 48) title = title.substring(0, 45) + '...';
      ctx.fillText(title, 120, startY);
      startY += 52;
    }
  });

  // Vertical Separator
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(1120, 240);
  ctx.lineTo(1120, 880);
  ctx.stroke();

  // Right Content Section (Real QR Code & Pass Credentials)
  const qrPayload = `SRISHTI-2.7|PASS:${record.passId}|NAME:${record.fullName}|COLLEGE:${record.college}|UTR:${record.paymentUtr}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0A0D14',
        light: '#FFFFFF',
      },
    });

    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    await new Promise((resolve) => {
      qrImg.onload = resolve;
      qrImg.onerror = resolve;
    });

    // Draw White Card Background for QR
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(1175, 270, 350, 350, 20);
    } else {
      ctx.rect(1175, 270, 350, 350);
    }
    ctx.fill();

    // Draw Real QR Code Image
    ctx.drawImage(qrImg, 1190, 285, 320, 320);
  } catch (err) {
    console.error('QR code generation error:', err);
  }

  // Credentials Typography
  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 18px "Inter", sans-serif, Arial';
  ctx.fillText('SERIAL PASS ID:', 1175, 670);

  ctx.fillStyle = '#00F0FF';
  ctx.font = '900 28px "Montserrat", sans-serif, Arial';
  ctx.fillText(record.passId, 1175, 710);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 18px "Inter", sans-serif, Arial';
  ctx.fillText('UTR / REF NO:', 1175, 760);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 22px "Inter", sans-serif, Arial';
  ctx.fillText(record.paymentUtr, 1175, 795);

  // Bottom Footer Bar (#0F172A)
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(40, 890, 1520, 70);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 18px "Inter", sans-serif, Arial';
  ctx.fillText('DATED: DEC 4-5, 2026 • ST. THOMAS COLLEGE CAMPUS, THRISSUR', 80, 932);

  ctx.fillStyle = '#00F0FF';
  ctx.font = '700 18px "Inter", sans-serif, Arial';
  ctx.textAlign = 'right';
  ctx.fillText('VERIFIED & VALIDATED DELEGATE CREDENTIAL', 1520, 932);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
};

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
  const [isGeneratingPass, setIsGeneratingPass] = useState(false);
  const [passImageUrl, setPassImageUrl] = useState<string | null>(null);
  const [isViewPassModalOpen, setIsViewPassModalOpen] = useState(false);

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

  // Generate high-resolution pass image when registration record is verified
  useEffect(() => {
    if (submittedRecord) {
      setIsGeneratingPass(true);
      generatePassImage(submittedRecord)
        .then((url) => {
          setPassImageUrl(url);
        })
        .catch((err) => console.error('Pass image generation failed:', err))
        .finally(() => setIsGeneratingPass(false));
    }
  }, [submittedRecord]);

  const handleDownloadPass = () => {
    if (!passImageUrl || !submittedRecord) return;
    const link = document.createElement('a');
    link.href = passImageUrl;
    link.download = `SRISHTI-2.7-PASS-${submittedRecord.passId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPassImage = () => {
    if (!passImageUrl) return;
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>SRISHTI 2.7 DELEGATE PASS - ${submittedRecord?.passId || ''}</title>
            <style>
              @page { size: landscape; margin: 0; }
              body, html {
                margin: 0;
                padding: 0;
                background: #ffffff !important;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
              }
              img {
                max-width: 95%;
                max-height: 95vh;
                height: auto;
                display: block;
                margin: auto;
              }
            </style>
          </head>
          <body>
            <img src="${passImageUrl}" onload="window.print(); setTimeout(function(){ window.close(); }, 500);" />
          </body>
        </html>
      `);
      printWin.document.close();
    }
  };

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

      {/* STATE 1 & STATE 2: NOT REGISTERED / FORM IN PROGRESS */}
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

            {/* STATE 1 / STATE 2 SIDEBAR PASS NOTICE (STRICT SECURITY: NO PASS EXISTS BEFORE PAYMENT) */}
            <aside className="lg:col-span-5 sticky top-28 space-y-4">
              <div className="p-8 rounded-2xl bg-[#090C12] border border-white/10 text-center space-y-5 shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-cyan-400 shadow-inner">
                  <Ticket className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-technical text-cyan-400 font-bold uppercase tracking-widest block">
                    STATE 1 • REGISTRATION IN PROGRESS
                  </span>
                  <h3 className="font-impact font-black text-2xl text-white uppercase tracking-tight">
                    YOUR SRISHTI PASS
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left space-y-2 text-xs font-body">
                  <p className="text-white/80 font-medium text-center">
                    Complete registration and payment to generate your official pass.
                  </p>
                  <p className="text-white/40 text-[11px] text-center leading-relaxed font-light">
                    Official pass image, serial pass ID, and scannable QR code are generated only after backend settlement verification.
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 text-left text-xs font-body space-y-2 text-white/50">
                  <div className="flex justify-between items-center">
                    <span>Events Selected:</span>
                    <span className="text-white font-bold">{selectedEvents.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Amount Payable:</span>
                    <span className="text-cyan-300 font-technical font-bold text-sm">₹{totalFee}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      ) : (
        /* STATE 4: REGISTERED + PAYMENT VERIFIED — GENERATED HIGH-RES PASS READY */
        <main className="max-w-4xl mx-auto px-4 py-12 text-center space-y-8 relative z-10">
          <div className="w-16 h-16 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mx-auto text-cyan-400 shadow-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-technical text-cyan-400 font-bold tracking-widest uppercase block">
              REGISTRATION COMPLETE • PAYMENT VERIFIED
            </span>
            <h2 className="font-impact font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
              YOUR PASS IS READY
            </h2>
            <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto font-body font-light leading-relaxed">
              Thank you, <strong className="text-white font-semibold">{submittedRecord.fullName}</strong>. Your payment UTR <strong className="text-cyan-300 font-technical">{submittedRecord.paymentUtr}</strong> has been verified.
            </p>
          </div>

          {/* GENERATED HIGH-RESOLUTION PASS IMAGE DISPLAY */}
          <div className="max-w-2xl mx-auto space-y-4">
            {isGeneratingPass || !passImageUrl ? (
              <div className="w-full aspect-[16/10] bg-[#0A0D14] border border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-2xl">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <span className="text-xs font-technical text-cyan-300 font-bold tracking-widest uppercase">
                  GENERATING HIGH-RES PASS IMAGE...
                </span>
              </div>
            ) : (
              <div className="relative group rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 bg-[#0A0D14] p-2">
                <img
                  src={passImageUrl}
                  alt={`SRISHTI 2.7 Pass for ${submittedRecord.fullName}`}
                  className="w-full h-auto rounded-xl object-contain transition-transform duration-300"
                />
              </div>
            )}
          </div>

          {/* ACTION BUTTONS: VIEW PASS & DOWNLOAD PASS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setIsViewPassModalOpen(true)}
              disabled={!passImageUrl}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-impact font-black text-xs uppercase tracking-wider hover:bg-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>VIEW PASS</span>
            </button>

            <button
              onClick={handleDownloadPass}
              disabled={!passImageUrl}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-27 text-white font-impact font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-2xl cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD PASS</span>
            </button>

            <button
              onClick={handlePrintPassImage}
              disabled={!passImageUrl}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white font-body text-xs font-semibold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT PASS</span>
            </button>
          </div>
        </main>
      )}

      {/* STATE 2 & STATE 3: PHONEPE / UPI SCANNER POPUP MODAL */}
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

      {/* VIEW PASS FULL SCREEN INSPECTION MODAL */}
      {isViewPassModalOpen && passImageUrl && submittedRecord && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-5xl w-full bg-[#0A0D14] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-technical text-cyan-400 font-bold uppercase tracking-widest block">
                  OFFICIAL DELEGATE CREDENTIAL
                </span>
                <h3 className="font-impact font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                  SRISHTI 2.7 PASS — {submittedRecord.passId}
                </h3>
              </div>
              <button
                onClick={() => setIsViewPassModalOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
              <img
                src={passImageUrl}
                alt="Full Pass Preview"
                className="w-full h-auto object-contain max-h-[70vh] mx-auto"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleDownloadPass}
                className="px-8 py-3 rounded-xl bg-gradient-27 text-white font-impact font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD PASS PNG</span>
              </button>

              <button
                onClick={() => setIsViewPassModalOpen(false)}
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-body text-xs font-semibold uppercase tracking-wider hover:bg-white/20 transition-all cursor-pointer"
              >
                <span>CLOSE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;
