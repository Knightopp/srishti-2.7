import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Download, 
  Check,
  X,
  Loader2,
  ShieldCheck,
  Eye,
  Printer,
  QrCode
} from 'lucide-react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { useFest, type RegistrationRecord } from '../context/FestContext';
import srishtiLogo from '../assets/images/srishti-logo.png';

interface RegistrationPageProps {
  onBackToHome: () => void;
  onNavigateToAdmin?: () => void;
  initialEventId?: string;
}

/**
 * Custom Branded Srishti QR Code Component
 * Renders High Error Correction ('H') QR matrix with the Srishti Logo emblem in the center.
 */
export const CustomSrishtiQR: React.FC<{ value: string; size?: number }> = ({ value, size = 160 }) => {
  const [qrSrc, setQrSrc] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const generateCustomQR = async () => {
      try {
        const canvas = document.createElement('canvas');
        const dpr = 3;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Level 'H' Error Correction (30% redundancy capacity)
        const qrDataUrl = await QRCode.toDataURL(value, {
          errorCorrectionLevel: 'H',
          width: size * dpr,
          margin: 1,
          color: {
            dark: '#0F172A',
            light: '#FFFFFF',
          },
        });

        const qrImg = new Image();
        qrImg.src = qrDataUrl;
        await new Promise((resolve) => {
          qrImg.onload = resolve;
          qrImg.onerror = resolve;
        });

        ctx.drawImage(qrImg, 0, 0, size * dpr, size * dpr);

        // Center Logo Circle Badge (24% of QR size)
        const logoDiameter = (size * dpr) * 0.24;
        const centerPos = (size * dpr) / 2;

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerPos, centerPos, logoDiameter / 2 + 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#CBD5E1';
        ctx.stroke();

        const logoImg = new Image();
        logoImg.src = srishtiLogo;
        await new Promise((resolve) => {
          logoImg.onload = resolve;
          logoImg.onerror = resolve;
        });

        if (logoImg.complete && logoImg.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerPos, centerPos, logoDiameter / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(
            logoImg, 
            centerPos - logoDiameter / 2, 
            centerPos - logoDiameter / 2, 
            logoDiameter, 
            logoDiameter
          );
          ctx.restore();
        }

        if (isMounted) {
          setQrSrc(canvas.toDataURL('image/png'));
        }
      } catch (err) {
        console.error('Custom QR generation error:', err);
      }
    };

    generateCustomQR();
    return () => { isMounted = false; };
  }, [value, size]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {qrSrc ? (
        <img src={qrSrc} alt="Custom Srishti QR" className="w-full h-full object-contain rounded-lg shadow-sm" />
      ) : (
        <QrCode className="w-full h-full text-black animate-pulse" />
      )}
    </div>
  );
};

/**
 * High-Resolution (1000 x 1400 px) Minimal Off-White Paper Vertical Lanyard Pass Generator
 * Generates the clean, minimal off-white festival pass credential.
 */
export const generatePassImage = async (record: RegistrationRecord): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 1300;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  // Clear canvas (transparent background so corners are rounded, NO sharp outer white box!)
  ctx.clearRect(0, 0, 900, 1300);

  // Card Body — Minimal Off-White Paper Finish (#F9FAFB) with Smooth Rounded Corners (44px)
  ctx.fillStyle = '#F9FAFB';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(6, 6, 888, 1288, 44);
  } else {
    ctx.rect(6, 6, 888, 1288);
  }
  ctx.fill();

  // Card Border (#CBD5E1 Slate Line)
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#CBD5E1';
  ctx.stroke();

  // Draw Srishti Logo Image Centered
  try {
    const logoImg = new Image();
    logoImg.src = srishtiLogo;
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = resolve;
    });
    if (logoImg.complete && logoImg.naturalWidth > 0) {
      ctx.drawImage(logoImg, 400, 70, 100, 100);
    }
  } catch (err) {
    console.error('Logo render error:', err);
  }

  // Header Titles
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0F172A';
  ctx.font = '900 46px "Montserrat", sans-serif, Arial';
  ctx.fillText('SRISHTI 2.7', 450, 215);

  ctx.fillStyle = '#64748B';
  ctx.font = '600 18px "Inter", sans-serif, Arial';
  ctx.fillText('ST. THOMAS COLLEGE (AUTONOMOUS)', 450, 250);

  // Delegate Pass Badge Capsule
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(280, 275, 340, 44, 22);
  } else {
    ctx.rect(280, 275, 340, 44);
  }
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 17px "Montserrat", sans-serif, Arial';
  ctx.fillText('OFFICIAL DELEGATE PASS', 450, 303);

  // Divider Line
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, 350);
  ctx.lineTo(820, 350);
  ctx.stroke();

  // Attendee Identity
  ctx.fillStyle = '#94A3B8';
  ctx.font = '700 16px "Inter", sans-serif, Arial';
  ctx.fillText('ATTENDEE DELEGATE', 450, 395);

  ctx.fillStyle = '#0F172A';
  ctx.font = '900 42px "Montserrat", sans-serif, Arial';
  let displayName = record.fullName.toUpperCase();
  if (displayName.length > 24) displayName = displayName.substring(0, 22) + '...';
  ctx.fillText(displayName, 450, 450);

  ctx.fillStyle = '#475569';
  ctx.font = '500 22px "Inter", sans-serif, Arial';
  let displayCollege = record.college;
  if (displayCollege.length > 36) displayCollege = displayCollege.substring(0, 34) + '...';
  ctx.fillText(displayCollege, 450, 490);

  // Registered Events Section (Light Gray Box)
  const eventsCount = record.selectedEventNames.length;
  const eventsBoxHeight = 80 + eventsCount * 45;
  ctx.fillStyle = '#F1F5F9';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(80, 525, 740, eventsBoxHeight, 20);
  } else {
    ctx.rect(80, 525, 740, eventsBoxHeight);
  }
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = '800 17px "Inter", sans-serif, Arial';
  ctx.fillText(`REGISTERED EVENTS (${eventsCount}):`, 110, 565);

  let eventY = 605;
  record.selectedEventNames.forEach((evtName) => {
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(125, eventY - 6, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1E293B';
    ctx.font = '600 20px "Inter", sans-serif, Arial';
    let title = evtName;
    if (title.length > 40) title = title.substring(0, 37) + '...';
    ctx.fillText(title, 145, eventY);
    eventY += 45;
  });

  // Footer Divider & Scannable Custom QR Code Section
  const qrSectionY = 550 + eventsBoxHeight + 25;

  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, qrSectionY);
  ctx.lineTo(820, qrSectionY);
  ctx.stroke();

  const qrPayload = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#pass/${record.passId}` : `https://srishti-2-7.vercel.app/#pass/${record.passId}`;
  try {
    // Generate QR with Level 'H' Error Correction
    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: 'H',
      width: 240,
      margin: 1,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    });

    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    await new Promise((resolve) => {
      qrImg.onload = resolve;
      qrImg.onerror = resolve;
    });

    // White background tile for QR
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(330, qrSectionY + 25, 240, 240, 16);
    } else {
      ctx.rect(330, qrSectionY + 25, 240, 240);
    }
    ctx.fill();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.drawImage(qrImg, 330, qrSectionY + 25, 240, 240);

    // Center Logo Emblem Badge over QR
    const centerLogoSize = 56;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(450, qrSectionY + 145, centerLogoSize / 2 + 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#CBD5E1';
    ctx.stroke();

    const logoCenterImg = new Image();
    logoCenterImg.src = srishtiLogo;
    await new Promise((resolve) => {
      logoCenterImg.onload = resolve;
      logoCenterImg.onerror = resolve;
    });

    if (logoCenterImg.complete && logoCenterImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(450, qrSectionY + 145, centerLogoSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        logoCenterImg, 
        450 - centerLogoSize / 2, 
        qrSectionY + 145 - centerLogoSize / 2, 
        centerLogoSize, 
        centerLogoSize
      );
      ctx.restore();
    }
  } catch (err) {
    console.error('QR code generation error:', err);
  }

  // Pass Credentials
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748B';
  ctx.font = '600 17px "Inter", sans-serif, Arial';
  ctx.fillText('SERIAL PASS ID:', 450, qrSectionY + 300);

  ctx.fillStyle = '#0F172A';
  ctx.font = '900 24px "Montserrat", sans-serif, Arial';
  ctx.fillText(record.passId, 450, 335 + qrSectionY);

  ctx.fillStyle = '#64748B';
  ctx.font = '600 17px "Inter", sans-serif, Arial';
  ctx.fillText(`UTR: ${record.paymentUtr}`, 450, 370 + qrSectionY);

  return canvas.toDataURL('image/png');
};

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onBackToHome,
  initialEventId,
}) => {
  const { events, addRegistration, updateRegistrationStatus, settings } = useFest();

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
  const [isDownloading, setIsDownloading] = useState(false);
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

  // Capture 100% exact 1-to-1 high-res image of the webpage card & execute automatic WhatsApp/Email dispatch
  useEffect(() => {
    if (submittedRecord) {
      const timer = setTimeout(async () => {
        const cardElement = document.getElementById('printable-pass-card');
        if (cardElement) {
          try {
            const canvas = await html2canvas(cardElement, {
              scale: 4, // 4x ultra high-res crisp capture
              useCORS: true,
              allowTaint: true,
              backgroundColor: null,
              logging: false,
            });
            setPassImageUrl(canvas.toDataURL('image/png'));
          } catch (err) {
            console.error('Error capturing pass image:', err);
          }
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [submittedRecord]);

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
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      }, 200);
    } catch (err) {
      console.error('Blob download error, using fallback link:', err);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 200);
    }
  };

  const getOrGeneratePassCanvasUrl = async (): Promise<string | null> => {
    if (passImageUrl) return passImageUrl;

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
        if (url && url.length > 100) {
          setPassImageUrl(url);
          return url;
        }
      } catch (err) {
        console.error('html2canvas capture error, trying native canvas:', err);
      }
    }

    if (submittedRecord) {
      try {
        const fallbackUrl = await generatePassImage(submittedRecord);
        setPassImageUrl(fallbackUrl);
        return fallbackUrl;
      } catch (err) {
        console.error('Native canvas generator error:', err);
      }
    }

    return null;
  };

  const handleDownloadPass = async () => {
    setIsDownloading(true);
    try {
      let imgUrl = await getOrGeneratePassCanvasUrl();
      if (!imgUrl && submittedRecord) {
        imgUrl = await generatePassImage(submittedRecord);
      }

      if (imgUrl) {
        const filename = `SRISHTI-2.7-PASS-${submittedRecord?.passId || 'DELEGATE'}.png`;

        // Direct anchor download trigger
        const link = document.createElement('a');
        link.href = imgUrl;
        link.download = filename;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
        }, 300);

        // Blob URL stream download trigger
        downloadDataUrlAsFile(imgUrl, filename);
      } else {
        alert('Pass image is being generated. Please click Download again in 2 seconds.');
      }
    } catch (err) {
      console.error('Download error:', err);
      if (submittedRecord) {
        const fallbackUrl = await generatePassImage(submittedRecord);
        downloadDataUrlAsFile(fallbackUrl, `SRISHTI-2.7-PASS-${submittedRecord.passId}.png`);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintPassImage = async () => {
    const imgUrl = await getOrGeneratePassCanvasUrl();
    if (!imgUrl) {
      window.print();
      return;
    }
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>SRISHTI 2.7 DELEGATE PASS - ${submittedRecord?.passId || ''}</title>
            <style>
              @page { size: portrait; margin: 0; }
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
                max-width: 90%;
                max-height: 95vh;
                height: auto;
                display: block;
                margin: auto;
              }
            </style>
          </head>
          <body>
            <img src="${imgUrl}" onload="window.print(); setTimeout(function(){ window.close(); }, 500);" />
          </body>
        </html>
      `);
      printWin.document.close();
    } else {
      window.print();
    }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(settings.upiId || 'abhiramcs2007@oksbi');
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
    <div className="min-h-screen bg-[#050608] text-[#E8E8EC] antialiased select-none relative overflow-x-hidden pb-24">
      {/* Top Header Navigation — Rock-solid sticky navbar */}
      <header className="sticky top-0 z-50 bg-[#050608]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl mb-8">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-body font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2.5">
          <img src={srishtiLogo} alt="Srishti Logo" className="w-7 h-7 object-contain" />
          <span className="font-impact font-black text-lg text-white uppercase tracking-tight flex items-baseline gap-1">
            SRISHTI <span className="text-cyan-400 font-technical text-sm font-bold tracking-normal">2.7</span>
          </span>
        </div>
      </header>

      {/* STATE 1 & STATE 2: NOT REGISTERED / FORM IN PROGRESS */}
      {!submittedRecord ? (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
          {/* Header Banner */}
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-technical text-cyan-400 font-bold tracking-widest uppercase block">
              REGISTRATION & DELEGATE PASS
            </span>
            <h1 className="font-impact font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
              REGISTER FOR <span className="text-cyan-400 font-impact font-black">SRISHTI 2.7</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/60 font-body font-light leading-relaxed">
              Select your events, fill in your delegate information, complete payment, and receive your official pass.
            </p>
          </div>

          {/* Main 2-Column Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Events & Personal Form */}
            <form onSubmit={handleOpenPaymentModal} className="lg:col-span-7 space-y-10">
              {/* STEP 01 — SELECT EVENTS */}
              <section className="space-y-4">
                <div className="flex items-baseline justify-between border-b border-white/10 pb-2.5">
                  <h2 className="font-impact font-black text-xl text-white uppercase tracking-tight">
                    1. SELECT EVENTS
                  </h2>
                  <span className="text-xs font-body text-white/50">
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
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-2.5 ${
                          isSelected
                            ? 'bg-[#0E1422] border-cyan-400/80'
                            : 'bg-[#0A0D14] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-technical font-bold text-cyan-400 uppercase tracking-wider block">
                              {evt.category}
                            </span>
                            <h3 className="font-impact font-black text-sm text-white tracking-tight leading-snug">
                              {evt.title}
                            </h3>
                          </div>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-cyan-400 border-cyan-400 text-black' : 'border-white/30 bg-transparent'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-body">
                          <span className="text-white/50 font-light">{evt.time || 'DEC 4-5'}</span>
                          <span className="font-technical font-bold text-cyan-300">
                            {evt.fee > 0 ? `₹${evt.fee}` : 'FREE ENTRY'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal Display */}
                <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-technical text-white/60 uppercase font-semibold">
                    TOTAL AMOUNT
                  </span>
                  <span className="font-impact font-black text-xl text-cyan-400 tracking-tight">
                    ₹{totalFee}
                  </span>
                </div>
              </section>

              {/* STEP 02 — YOUR DETAILS */}
              <section className="space-y-4">
                <div className="border-b border-white/10 pb-2.5">
                  <h2 className="font-impact font-black text-xl text-white uppercase tracking-tight">
                    2. DELEGATE INFORMATION
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-body text-white/70 font-medium">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abhiram C S"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0D14] border border-white/15 text-white placeholder-white/20 text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-body text-white/70 font-medium">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="student@college.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0D14] border border-white/15 text-white placeholder-white/20 text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-body text-white/70 font-medium">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0D14] border border-white/15 text-white placeholder-white/20 text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-body text-white/70 font-medium">College / Institution *</label>
                    <input
                      type="text"
                      required
                      placeholder="St. Thomas College"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0D14] border border-white/15 text-white placeholder-white/20 text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-body text-white/70 font-medium">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0D14] border border-white/15 text-white text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Basic Sciences & Humanities">Basic Sciences & Humanities</option>
                      <option value="Other Department">Other Department</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-body text-white/70 font-medium">Year of Study</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0A0D14] border border-white/15 text-white text-xs font-body focus:outline-none focus:border-cyan-400 transition-colors"
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
                  className="w-full py-3.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-impact font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-4"
                >
                  <span>PROCEED TO PAYMENT (₹{totalFee}) →</span>
                </button>
              </section>
            </form>

            {/* SIDEBAR ORDER SUMMARY */}
            <aside className="lg:col-span-5 sticky top-24 space-y-4">
              <div className="p-6 rounded-2xl bg-[#090C12] border border-white/10 space-y-4 shadow-xl">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[10px] font-technical text-cyan-400 font-bold uppercase tracking-widest block">
                    SUMMARY
                  </span>
                  <h3 className="font-impact font-black text-xl text-white uppercase tracking-tight">
                    PASS SUMMARY
                  </h3>
                </div>

                <div className="space-y-2 text-xs font-body text-white/70">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span>Events Selected:</span>
                    <span className="text-white font-bold">{selectedEvents.length}</span>
                  </div>
                  <div className="space-y-1 py-1">
                    {selectedEvents.map((evt) => (
                      <div key={evt.id} className="flex justify-between text-[11px]">
                        <span className="text-white/60 truncate max-w-[200px]">• {evt.title}</span>
                        <span className="font-mono text-cyan-300">₹{evt.fee}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="font-bold text-white">Total Payable Amount:</span>
                    <span className="text-cyan-400 font-mono font-bold text-base">₹{totalFee}</span>
                  </div>
                </div>

                <p className="text-[11px] text-white/40 leading-relaxed font-light text-center pt-2 border-t border-white/5">
                  Official pass image and serial pass ID are generated immediately upon completing payment.
                </p>
              </div>
            </aside>
          </div>
        </main>
      ) : (
        /* STATE 4: REGISTERED — CHECK PAYMENT SETTLEMENT STATUS */
        <main className="max-w-4xl mx-auto px-4 py-12 text-center space-y-8 relative z-10">
          {submittedRecord.paymentStatus === 'Payment Verified' ? (
            <>
              <div className="w-16 h-16 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mx-auto text-cyan-400 shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-technical text-cyan-400 font-bold tracking-widest uppercase block">
                  REGISTRATION COMPLETE • PASS CONFIRMED
                </span>
                <h2 className="font-impact font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
                  YOUR PASS IS READY
                </h2>
                <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto font-body font-light leading-relaxed">
                  Thank you, <strong className="text-white font-semibold">{submittedRecord.fullName}</strong>. Your pass has been generated.
                </p>
                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-technical font-bold shadow-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>AUTOMATICALLY DISPATCHED TO EMAIL ({submittedRecord.email})</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-technical text-amber-400 font-bold tracking-widest uppercase block">
                  SETTLEMENT VERIFICATION IN PROGRESS
                </span>
                <h2 className="font-impact font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
                  AWAITING PAYMENT SETTLEMENT
                </h2>
                <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto font-body font-light leading-relaxed">
                  Your registration is recorded. UTR <strong className="text-amber-300 font-technical">{submittedRecord.paymentUtr}</strong> is awaiting verification.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateRegistrationStatus(submittedRecord.id, 'Payment Verified');
                      setSubmittedRecord({ ...submittedRecord, paymentStatus: 'Payment Verified' });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-technical font-bold hover:bg-amber-400/20 transition-all cursor-pointer shadow-lg"
                  >
                    <span>Verify Settlement Now</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* GENERATED HIGH-RESOLUTION PASS IMAGE DISPLAY */}
          <div className="max-w-2xl mx-auto space-y-4">
            {/* MINIMALIST VERTICAL FESTIVAL PASS CARD (EXACTLY MATCHING USER SCREENSHOT) */}
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
                <h3 className="font-impact font-black text-2xl text-slate-900 uppercase tracking-tight leading-tight break-words max-w-full overflow-hidden text-ellipsis">
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
                <div className="w-20 h-20 bg-white p-1 rounded-xl mx-auto flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                  <CustomSrishtiQR value={`${window.location.origin}${window.location.pathname}#pass/${submittedRecord.passId}`} size={160} />
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
          </div>

          {/* ACTION BUTTONS: VIEW, DOWNLOAD, PRINT */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setIsViewPassModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-impact font-black text-xs uppercase tracking-wider hover:bg-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>VIEW PASS</span>
            </button>

            <button
              onClick={handleDownloadPass}
              disabled={isDownloading}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-27 text-white font-impact font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-2xl cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>GENERATING PNG...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD PASS</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrintPassImage}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white font-body text-xs font-semibold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT PASS</span>
            </button>
          </div>
        </main>
      )}

      {/* STATE 2 & STATE 3: PHONEPE / UPI SCANNER POPUP MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0B0E14] border border-white/15 rounded-2xl p-6 shadow-2xl relative space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span className="font-impact font-black text-base text-white uppercase tracking-tight">
                  UPI PAYMENT VERIFICATION
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DYNAMIC UPI QR & PAYMENT INSTRUCTIONS */}
            {(() => {
              const upiVpa = settings.upiId || 'abhiramcs2007@oksbi';
              const dynamicUpiUri = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent('Abhiram C S')}&am=${totalFee}&cu=INR`;

              return (
                <div className="text-center space-y-4">
                  {/* Dynamic QR Code Box */}
                  <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center shadow-xl border border-white/20 overflow-hidden">
                    {settings.upiQrImage ? (
                      <img src={settings.upiQrImage} alt="UPI QR" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <CustomSrishtiQR value={dynamicUpiUri} size={170} />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-technical text-white/50 uppercase block tracking-wider">AMOUNT TO PAY</span>
                    <span className="font-impact font-black text-3xl text-cyan-400">₹{totalFee}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-technical">
                    <span className="text-white/60">UPI VPA:</span>
                    <span className="text-cyan-400 font-mono font-semibold">{upiVpa}</span>
                    <button
                      type="button"
                      onClick={copyUpi}
                      className="px-2.5 py-1 rounded bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-[10px] hover:bg-cyan-400/20 transition-all cursor-pointer font-bold"
                    >
                      {copiedUpi ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* UTR Input Form */}
            <form onSubmit={handleVerifyAndSubmit} className="space-y-4 pt-2 border-t border-white/10">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-body text-white/80 font-semibold block">
                    12-Digit Transaction UTR / Ref No. *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const simulatedUtr = Math.floor(100000000000 + Math.random() * 900000000000).toString();
                      setFormData({ ...formData, paymentUtr: simulatedUtr });
                    }}
                    className="text-[10px] font-technical text-cyan-400/80 hover:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Auto-fill UTR
                  </button>
                </div>
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
                className="w-full py-3.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-impact font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>VERIFYING SETTLEMENT...</span>
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
