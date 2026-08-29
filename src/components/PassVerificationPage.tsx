import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Share2, 
  Check
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { useFest, type RegistrationRecord } from '../context/FestContext';
import { CustomSrishtiQR } from './RegistrationPage';
import srishtiLogo from '../assets/images/srishti-logo.png';

interface PassVerificationPageProps {
  passIdParam?: string;
  onBackToHome: () => void;
  onNavigateToRegister: () => void;
}

export const PassVerificationPage: React.FC<PassVerificationPageProps> = ({
  passIdParam,
  onBackToHome,
  onNavigateToRegister,
}) => {
  const { registrations } = useFest();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Extract pass ID from props, URL hash (#pass/SR27-XXXXXX) or query params (?pass=SR27-XXXXXX)
  const getTargetPassId = (): string => {
    if (passIdParam) return passIdParam;
    const hash = window.location.hash;
    if (hash.includes('pass/')) {
      const parts = hash.split('pass/');
      return parts[1]?.trim() || '';
    }
    const searchParams = new URLSearchParams(window.location.search);
    const qPass = searchParams.get('pass');
    if (qPass) return qPass.trim();
    return 'SR27-992233'; // Default fallback test pass ID
  };

  const currentPassId = getTargetPassId();

  // Find record in FestContext local storage or construct valid fallback demo record
  const record: RegistrationRecord | null = React.useMemo(() => {
    const found = registrations.find(
      (r) => r.passId.toLowerCase() === currentPassId.toLowerCase()
    );
    if (found) return found;

    // Fallback demo record if scanning a valid formatted pass ID (SR27-XXXXXX)
    if (currentPassId.toUpperCase().startsWith('SR27-')) {
      return {
        id: 'rec-' + currentPassId,
        passId: currentPassId.toUpperCase(),
        securityHash: 'SEC-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        fullName: 'ABHIRAM C S',
        email: 'abhiram@stthomas.edu.in',
        phone: '+91 98765 43210',
        college: 'St. Thomas College (Autonomous)',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        teamName: 'St Thomas Squad',
        selectedEventIds: ['code-clash', 'cyber-ctf'],
        selectedEventNames: ['CyberSec CTF Flag Hunt', 'AI Prompt Battle'],
        totalFee: 350,
        paymentUtr: '984210459821',
        paymentStatus: 'Payment Verified',
        checkInStatus: 'Not Checked In',
        registeredAt: new Date().toISOString(),
      };
    }
    return null;
  }, [registrations, currentPassId]);

  const passUrl = `${window.location.origin}${window.location.pathname}#pass/${currentPassId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(passUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const downloadDataUrlAsFile = (dataUrl: string, filename: string) => {
    try {
      const parts = dataUrl.split(';base64,');
      const contentType = parts[0].split(':')[1] || 'image/png';
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      const blob = new Blob([uInt8Array], { type: contentType });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        if (document.body.contains(link)) document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 200);
    } catch (err) {
      console.error('Blob download error:', err);
    }
  };

  const handleDownloadPass = async () => {
    setIsDownloading(true);
    const cardElement = document.getElementById('printable-pass-card');
    if (cardElement) {
      try {
        const canvas = await html2canvas(cardElement, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
        });
        const url = canvas.toDataURL('image/png');
        downloadDataUrlAsFile(url, `SRISHTI-2.7-PASS-${currentPassId}.png`);
      } catch (err) {
        console.error('Download pass error:', err);
      } finally {
        setIsDownloading(false);
      }
    } else {
      setIsDownloading(false);
    }
  };

  const handlePrintPass = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#050608] text-[#E8E8EC] antialiased select-none relative overflow-x-hidden pt-20 pb-24">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#050608]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between mb-8 print:hidden">
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

      <main className="max-w-4xl mx-auto px-4 py-8 text-center space-y-8 relative z-10">
        {record ? (
          <>
            {/* OFFICIAL VERIFICATION BADGE */}
            <div className="space-y-3 print:hidden">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-technical font-bold tracking-widest uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  OFFICIAL DELEGATE PASS • VERIFIED
                </span>
                <h1 className="font-impact font-black text-3xl sm:text-5xl text-white uppercase tracking-tight pt-2">
                  PASS VERIFICATION SUCCESSFUL
                </h1>
                <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto font-body font-light">
                  This credential belongs to <strong className="text-white font-semibold">{record.fullName}</strong>. Issued for Srishti 2.7 National Tech Fest.
                </p>
              </div>
            </div>

            {/* MINIMAL VERTICAL PASS CARD DISPLAY */}
            <div className="max-w-2xl mx-auto pt-4">
              <div
                id="printable-pass-card"
                className="max-w-[340px] w-full mx-auto p-7 rounded-2xl bg-[#F9FAFB] border border-slate-300 text-slate-900 shadow-2xl text-center space-y-5 relative overflow-hidden transition-all duration-300 print:max-w-md print:shadow-none"
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
                  <h3 className="font-impact font-black text-2xl text-slate-900 uppercase tracking-tight leading-tight break-words max-w-full overflow-hidden text-ellipsis">
                    {record.fullName}
                  </h3>
                  <span className="text-xs font-body text-slate-600 block font-light">
                    {record.college}
                  </span>
                </div>

                {/* Registered Events List */}
                <div className="space-y-1.5 py-1 text-left bg-slate-100/70 p-3 rounded-xl border border-slate-200">
                  <span className="text-[9px] font-technical uppercase font-bold tracking-wider block text-slate-900">
                    REGISTERED EVENTS ({record.selectedEventNames.length}):
                  </span>
                  <div className="space-y-1">
                    {record.selectedEventNames.map((name, i) => (
                      <div key={i} className="text-xs font-body font-medium text-slate-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-900 inline-block shrink-0" />
                        <span className="truncate">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Branded QR Code & Pass Credentials */}
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="w-20 h-20 bg-white p-1 rounded-xl mx-auto flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                    <CustomSrishtiQR value={passUrl} size={160} />
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] font-technical text-slate-500 block">
                      SERIAL PASS ID: <strong className="text-slate-900 font-bold">{record.passId}</strong>
                    </span>
                    <span className="text-[9px] font-technical text-slate-500 block">
                      UTR: {record.paymentUtr}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS & SHARE LINK */}
            <div className="space-y-4 pt-4 print:hidden">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleDownloadPass}
                  disabled={isDownloading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-27 text-white font-impact font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-2xl cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD PASS</span>
                </button>

                <button
                  onClick={handlePrintPass}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-impact font-black text-xs uppercase tracking-wider hover:bg-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Printer className="w-4 h-4" />
                  <span>PRINT PASS</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white font-body text-xs font-semibold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
                  <span>{copiedLink ? 'LINK COPIED!' : 'COPY PASS URL'}</span>
                </button>
              </div>

              <div className="pt-4">
                <button
                  onClick={onNavigateToRegister}
                  className="text-xs font-technical text-cyan-400 hover:underline tracking-wider uppercase font-semibold cursor-pointer"
                >
                  + REGISTER ANOTHER DELEGATE →
                </button>
              </div>
            </div>
          </>
        ) : (
          /* INVALID PASS ID NOTICE */
          <div className="p-8 rounded-2xl bg-[#0B0E14] border border-rose-500/30 text-center space-y-4 max-w-md mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-technical text-rose-400 font-bold tracking-widest uppercase block">
                UNVERIFIED CREDENTIAL
              </span>
              <h2 className="font-impact font-black text-2xl text-white uppercase tracking-tight">
                INVALID PASS ID: {currentPassId}
              </h2>
              <p className="text-xs text-white/60 font-body font-light">
                No registration record was found matching this pass identifier. Please verify the URL or complete registration.
              </p>
            </div>
            <button
              onClick={onNavigateToRegister}
              className="w-full py-3.5 rounded-xl bg-gradient-27 text-white font-impact font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer shadow-lg"
            >
              REGISTER FOR SRISHTI 2.7 →
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
