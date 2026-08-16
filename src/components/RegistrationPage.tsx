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
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onBackToHome,
  onNavigateToAdmin,
}) => {
  const { events, addRegistration, settings } = useFest();

  // Multi-select events state (default first event selected)
  const participatingEvents = events.filter((e) => e.isParticipating !== false);
  const registerableList = participatingEvents.length > 0 ? participatingEvents : events;

  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(() => {
    const firstPart = events.find((e) => e.isParticipating !== false);
    return firstPart ? [firstPart.id] : [events[0]?.id || 'code-clash'];
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.college || !formData.phone) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!formData.paymentUtr || formData.paymentUtr.length < 6) {
      alert('Please enter a valid Bank UTR / Transaction Reference ID for payment verification.');
      return;
    }

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
              <h1 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-none">
                Register For <span className="text-[#00e5ff]">Srishti 2.7</span>
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
                    <strong className="text-[#00e5ff] font-bold block text-sm">{settings.upiId}</strong>
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

          {/* Right Column: Live Digital Pass Preview Card (Dynamic Multi-Events) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="sticky top-28 space-y-4">
              <span className="text-xs font-mono text-white/50 uppercase tracking-widest block font-semibold text-center">
                LIVE DYNAMIC DIGITAL PASS PREVIEW
              </span>

              {/* High-Tech Pass Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#101524] via-[#0b0e18] to-[#06070a] border border-[#0077ff]/40 shadow-2xl relative overflow-hidden space-y-5">
                {/* Glow bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00e5ff] via-[#0077ff] to-[#0055ff]" />

                {/* Pass Header */}
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
                    OFFICIAL PASS
                  </span>
                </div>

                {/* Attendee Name */}
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-white/40 uppercase block">ATTENDEE NAME</span>
                  <h3 className="font-syne font-extrabold text-xl text-white truncate">
                    {formData.fullName || 'YOUR FULL NAME'}
                  </h3>
                  <span className="text-xs font-mono text-white/50 block truncate">
                    {formData.college || 'COLLEGE / INSTITUTION'}
                  </span>
                </div>

                {/* Selected Events Badges */}
                <div className="space-y-2 pt-1">
                  <span className="text-[9px] font-mono text-[#00e5ff] uppercase font-bold tracking-wider block">
                    BOOKED EVENTS ({selectedEvents.length}):
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {selectedEvents.map((evt) => (
                      <div key={evt.id} className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-semibold truncate">{evt.title}</span>
                        <span className="text-[10px] text-[#00e5ff] shrink-0 font-bold ml-2">
                          {evt.fee > 0 ? `₹${evt.fee}` : 'FREE'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Code Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-white/40 block">SECURITY VERIFICATION HASH</span>
                    <span className="font-mono font-bold text-[10px] text-[#00e5ff] block tracking-widest">
                      SR27-8A9F-3E21
                    </span>
                    <span className="text-[9px] font-mono text-white/50 block">
                      FEE PAID: ₹{totalFee}
                    </span>
                  </div>
                  <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
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
              onClick={() => alert(`Pass ${submittedRecord.passId} downloaded to device!`)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-syne text-xs font-bold uppercase tracking-wider hover:bg-[#0077ff] hover:text-white transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <Download className="w-4 h-4" />
              <span>Download Digital Pass</span>
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
