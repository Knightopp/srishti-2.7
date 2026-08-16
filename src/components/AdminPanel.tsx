import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Download, 
  Users, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Building2, 
  BarChart3, 
  Edit3, 
  X, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { useFest, type EventItem } from '../context/FestContext';

interface AdminPanelProps {
  onBackToHome: () => void;
  onNavigateToRegister?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToHome,
  onNavigateToRegister,
}) => {
  const { 
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
    updateRegistrationStatus, 
    deleteRegistration,
    updateSettings,
    syncWithCloud,
    exportDatabaseJSON,
    importDatabaseJSON
  } = useFest();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('srishti_admin_auth') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'registrations' | 'events' | 'sponsors' | 'settings'>('registrations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('All');

  // Login Submit Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === 'odiyan' && passwordInput === 'friedchicken') {
      setIsAuthenticated(true);
      sessionStorage.setItem('srishti_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Username or Password! Access Denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('srishti_admin_auth');
    onBackToHome();
  };

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    upiId: settings?.upiId || 'srishti@stthomas.upi',
    upiQrImage: settings?.upiQrImage || '',
    contactEmail: settings?.contactEmail || 'srishti@stthomas.ac.in',
    collegeName: settings?.collegeName || 'St. Thomas College',
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert('System & UPI Payment Settings updated successfully!');
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsForm({ ...settingsForm, upiQrImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Modals state
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isAddSponsorOpen, setIsAddSponsorOpen] = useState(false);

  // Add/Edit Event Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    stageLabel: 'TECH COMPETITION',
    category: 'Competition',
    subtitle: '',
    day: 'dec-4' as 'dec-4' | 'dec-5',
    dayLabel: 'DECEMBER 4, 2026',
    time: 'DEC 4 • 10:00 AM - 12:00 PM',
    venue: 'CS Innovation Hub',
    locationId: 'innovation-lab',
    speakerName: 'Event Coordinators',
    speakerRole: 'Srishti 2.7 Team',
    highlights: 'Live prototyping challenge, Mentorship session, Cash prize pool',
    description: '',
    highlightText: '',
    prize: '₹10,000 Pool',
    color: '#0077ff',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    fee: 100,
    tags: 'Coding, Tech',
  });

  // Add Sponsor Form State
  const [sponsorForm, setSponsorForm] = useState({
    name: '',
    category: 'Technical Partner',
    badge: 'GOLD',
    logoUrl: '',
    accentColor: '#00e5ff',
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060608] text-[#f5f5f7] flex items-center justify-center p-5 select-none relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0077ff]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0c101d] border border-[#0077ff]/40 shadow-2xl space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0077ff]/20 border border-[#0077ff]/40 flex items-center justify-center mx-auto text-[#00e5ff]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-[#00e5ff] tracking-widest uppercase font-bold block">
              RESTRICTED SYSTEM ACCESS
            </span>
            <h2 className="font-syne text-2xl font-black uppercase text-white">
              Admin Authentication
            </h2>
            <p className="text-xs font-mono text-white/50">
              Enter secure credentials to access Srishti 2.7 Control Dashboard.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-white/70">USERNAME</label>
              <input
                type="text"
                required
                placeholder="Enter admin username..."
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#0077ff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70">PASSWORD</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-[#0077ff]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00e5ff] to-[#0077ff] text-white font-syne font-extrabold uppercase text-xs tracking-wider shadow-lg shadow-[#0077ff]/30 hover:scale-[1.01] active:scale-95 transition-all"
            >
              Authenticate & Unlock Admin Panel
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onBackToHome}
              className="text-xs font-mono text-white/40 hover:text-white transition-colors"
            >
              ← Return To Fest Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter Registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.passId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.paymentUtr.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEvent =
      selectedEventFilter === 'All' || reg.selectedEventNames.includes(selectedEventFilter);

    return matchesSearch && matchesEvent;
  });

  const openAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      stageLabel: 'TECH COMPETITION',
      category: 'Competition',
      subtitle: '',
      day: 'dec-4',
      dayLabel: 'DECEMBER 4, 2026',
      time: 'DEC 4 • 10:00 AM - 12:00 PM',
      venue: 'CS Innovation Hub',
      locationId: 'innovation-lab',
      speakerName: 'Event Coordinators',
      speakerRole: 'Srishti 2.7 Team',
      highlights: 'Live contest, Cash prize pool, Certificates',
      description: '',
      highlightText: '',
      prize: '₹10,000 Pool',
      color: '#0077ff',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      fee: 100,
      tags: 'Coding, Tech',
    });
    setIsAddEventOpen(true);
  };

  const openEditEvent = (evt: EventItem) => {
    setEditingEvent(evt);
    setEventForm({
      title: evt.title,
      stageLabel: evt.stageLabel || 'TECH EVENT',
      category: evt.category || 'Competition',
      subtitle: evt.subtitle || '',
      day: evt.day || 'dec-4',
      dayLabel: evt.dayLabel || (evt.day === 'dec-5' ? 'DECEMBER 5, 2026' : 'DECEMBER 4, 2026'),
      time: evt.time,
      venue: evt.venue,
      locationId: evt.locationId || 'main-auditorium',
      speakerName: evt.speaker?.name || '',
      speakerRole: evt.speaker?.role || '',
      highlights: evt.highlights ? evt.highlights.join(', ') : '',
      description: evt.description,
      highlightText: evt.highlightText || '',
      prize: evt.prize,
      color: evt.color || '#0077ff',
      image: evt.image,
      fee: evt.fee,
      tags: evt.tags ? evt.tags.join(', ') : '',
    });
    setIsAddEventOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.time) {
      alert('Event title and timing are required.');
      return;
    }

    const highlightsArray = eventForm.highlights
      ? eventForm.highlights.split(',').map((h) => h.trim()).filter(Boolean)
      : [];

    const eventPayload = {
      title: eventForm.title,
      stageLabel: eventForm.stageLabel,
      category: eventForm.category,
      subtitle: eventForm.subtitle,
      day: eventForm.day,
      dayLabel: eventForm.day === 'dec-5' ? 'DECEMBER 5, 2026' : 'DECEMBER 4, 2026',
      time: eventForm.time,
      venue: eventForm.venue,
      locationId: eventForm.locationId,
      speaker: {
        name: eventForm.speakerName || 'Event Coordinators',
        role: eventForm.speakerRole || 'Srishti 2.7 Team',
      },
      highlights: highlightsArray.length > 0 ? highlightsArray : [eventForm.highlightText || 'Official Srishti 2.7 event.'],
      description: eventForm.description,
      highlightText: eventForm.highlightText || (highlightsArray[0] || eventForm.description.slice(0, 60)),
      prize: eventForm.prize,
      color: eventForm.color,
      bgGradient: 'from-[#0a182e] via-[#0d1e38] to-[#080b12]',
      image: eventForm.image,
      fee: Number(eventForm.fee),
      tags: eventForm.tags ? eventForm.tags.split(',').map((t) => t.trim()).filter(Boolean) : ['Tech'],
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventPayload);
    } else {
      addEvent(eventPayload);
    }

    setIsAddEventOpen(false);
  };

  const handleSaveSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorForm.name) {
      alert('Sponsor name is required.');
      return;
    }

    addSponsor({
      name: sponsorForm.name,
      category: sponsorForm.category,
      badge: sponsorForm.badge,
      logoUrl: sponsorForm.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
      accentColor: sponsorForm.accentColor,
    });

    setIsAddSponsorOpen(false);
  };

  const handleSponsorLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSponsorForm({ ...sponsorForm, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Pass ID,Security Hash,Full Name,Email,Phone,College,Selected Events,Total Fee,UTR Ref,Payment Status,Check-In']
        .concat(
          registrations.map(
            (r) =>
              `"${r.passId}","${r.securityHash}","${r.fullName}","${r.email}","${r.phone}","${r.college}","${r.selectedEventNames.join('; ')}","${r.totalFee}","${r.paymentUtr}","${r.paymentStatus}","${r.checkInStatus}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `srishti_2.7_registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-[#f5f5f7] antialiased select-none relative overflow-x-hidden pt-24 pb-20">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[300px] bg-[#0077ff]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[300px] bg-[#00e5ff]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 space-y-8 relative z-20">
        {/* Top Header Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] animate-ping" />
              <span className="text-xs font-mono text-[#00e5ff] tracking-widest uppercase font-bold">
                SRISHTI 2.7 • ADMIN MANAGEMENT PANEL
              </span>
            </div>
            <h1 className="font-syne text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              Festival Control & Verification
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 font-mono text-xs transition-all active:scale-95 shadow-lg"
            >
              <Download className="w-4 h-4 text-[#00e5ff]" />
              <span>Export CSV</span>
            </button>

            {onNavigateToRegister && (
              <button
                onClick={onNavigateToRegister}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0077ff] text-white font-mono text-xs font-bold uppercase hover:bg-[#0055ff] transition-all active:scale-95 shadow-lg shadow-[#0077ff]/30"
              >
                <Plus className="w-4 h-4" />
                <span>Register Student</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 font-mono text-xs transition-all active:scale-95"
            >
              <span>Logout</span>
            </button>

            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white/80 hover:bg-white/10 hover:text-white font-mono text-xs transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Fest Homepage</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-white/50">
              <span className="text-xs font-mono font-bold uppercase">TOTAL REGISTRATIONS</span>
              <Users className="w-4 h-4 text-[#0077ff]" />
            </div>
            <span className="font-syne font-black text-3xl text-white block">{registrations.length}</span>
            <span className="text-[10px] font-mono text-[#00e5ff] block">Live student passes</span>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-white/50">
              <span className="text-xs font-mono font-bold uppercase">VERIFIED PAYMENTS</span>
              <CheckCircle2 className="w-4 h-4 text-[#00e5ff]" />
            </div>
            <span className="font-syne font-black text-3xl text-[#00e5ff] block">
              {registrations.filter((r) => r.paymentStatus === 'Payment Verified').length}
            </span>
            <span className="text-[10px] font-mono text-white/40 block">UTR reference verified</span>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-white/50">
              <span className="text-xs font-mono font-bold uppercase">ACTIVE EVENTS</span>
              <BarChart3 className="w-4 h-4 text-[#00d4ff]" />
            </div>
            <span className="font-syne font-black text-3xl text-white block">{events.length}</span>
            <span className="text-[10px] font-mono text-white/40 block">Dynamic wheel sync</span>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-white/50">
              <span className="text-xs font-mono font-bold uppercase">PARTNER SPONSORS</span>
              <Building2 className="w-4 h-4 text-[#38bdf8]" />
            </div>
            <span className="font-syne font-black text-3xl text-white block">{sponsors.length}</span>
            <span className="text-[10px] font-mono text-[#0077ff] block">Infinite ticker sync</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all ${
              activeTab === 'registrations'
                ? 'bg-[#0077ff] text-white shadow-lg shadow-[#0077ff]/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Passes & Verification ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all ${
              activeTab === 'events'
                ? 'bg-[#0077ff] text-white shadow-lg shadow-[#0077ff]/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Manage Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('sponsors')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all ${
              activeTab === 'sponsors'
                ? 'bg-[#0077ff] text-white shadow-lg shadow-[#0077ff]/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Manage Sponsors ({sponsors.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all ${
              activeTab === 'settings'
                ? 'bg-[#0077ff] text-white shadow-lg shadow-[#0077ff]/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            UPI & System Settings
          </button>
        </div>

        {/* TAB 1: REGISTRATIONS & PAYMENT VERIFICATION */}
        {activeTab === 'registrations' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student, pass ID, UTR ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/40 text-xs font-mono focus:outline-none focus:border-[#0077ff]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedEventFilter}
                  onChange={(e) => setSelectedEventFilter(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-[#0077ff]"
                >
                  <option value="All">All Events ({registrations.length})</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.title}>
                      {e.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-x-auto shadow-2xl">
              <table className="w-full text-left text-xs font-mono border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-white/60 uppercase">
                    <th className="p-4 font-semibold">Pass ID / Security Hash</th>
                    <th className="p-4 font-semibold">Student & College</th>
                    <th className="p-4 font-semibold">Booked Events</th>
                    <th className="p-4 font-semibold">UPI UTR Ref</th>
                    <th className="p-4 font-semibold">Payment Status</th>
                    <th className="p-4 font-semibold">Check-In</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-[#00e5ff] block">{reg.passId}</span>
                          <span className="text-[9px] text-white/40 block tracking-widest">{reg.securityHash}</span>
                        </td>
                        <td className="p-4 font-syne font-bold text-white text-sm">
                          {reg.fullName}
                          <span className="block text-[10px] font-mono text-white/50 font-normal">
                            {reg.college} • {reg.phone}
                          </span>
                        </td>
                        <td className="p-4 text-white">
                          <div className="space-y-1">
                            {reg.selectedEventNames.map((n, i) => (
                              <span key={i} className="inline-block px-2 py-0.5 mr-1 mb-1 rounded bg-white/10 text-[10px]">
                                {n}
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] text-[#00e5ff] font-bold block pt-1">Total: ₹{reg.totalFee}</span>
                        </td>
                        <td className="p-4 text-[#00e5ff] font-bold">
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-[#0077ff]" />
                            <span>{reg.paymentUtr}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() =>
                              updateRegistrationStatus(
                                reg.id,
                                reg.paymentStatus === 'Payment Verified' ? 'Pending Verification' : 'Payment Verified'
                              )
                            }
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                              reg.paymentStatus === 'Payment Verified'
                                ? 'bg-[#0077ff]/20 text-[#00e5ff] border border-[#0077ff]/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {reg.paymentStatus}
                          </button>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() =>
                              updateRegistrationStatus(
                                reg.id,
                                reg.paymentStatus,
                                reg.checkInStatus === 'Checked In' ? 'Not Checked In' : 'Checked In'
                              )
                            }
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                              reg.checkInStatus === 'Checked In'
                                ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40'
                                : 'bg-white/5 text-white/50 border border-white/10'
                            }`}
                          >
                            {reg.checkInStatus}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => deleteRegistration(reg.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/40 transition-colors"
                            title="Remove Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-white/40">
                        No registration passes match your search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE EVENTS (ADD, EDIT, REMOVE) */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white/60 uppercase font-bold tracking-widest">
                HOMEPAGE 3D WHEEL & SCHEDULE EVENTS
              </span>
              <button
                onClick={openAddEvent}
                className="px-4 py-2.5 rounded-xl bg-[#0077ff] text-white font-mono text-xs font-bold uppercase hover:bg-[#0055ff] transition-all flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Event</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((evt) => (
                <div key={evt.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 relative overflow-hidden group">
                  <div className="aspect-video rounded-xl overflow-hidden relative">
                    <img src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-[#00e5ff] border border-white/20">
                      ₹{evt.fee} Fee
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#0077ff] font-bold uppercase">{evt.stageLabel}</span>
                    <h3 className="font-syne font-extrabold text-lg text-white">{evt.title}</h3>
                    <span className="text-xs font-mono text-white/60 block">{evt.time} • {evt.venue}</span>
                  </div>

                  <p className="text-xs text-white/50 font-light line-clamp-2">{evt.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <button
                      onClick={() => openEditEvent(evt)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-white font-mono text-xs hover:bg-white/20 transition-all flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#00e5ff]" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteEvent(evt.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 font-mono text-xs hover:bg-red-500/20 transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE SPONSORS (ADD LOGO PNG, REMOVE) */}
        {activeTab === 'sponsors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white/60 uppercase font-bold tracking-widest">
                HOMEPAGE INFINITE TICKER SPONSORS
              </span>
              <button
                onClick={() => setIsAddSponsorOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#0077ff] text-white font-mono text-xs font-bold uppercase hover:bg-[#0055ff] transition-all flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Sponsor Logo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {sponsors.map((sp) => (
                <div key={sp.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 p-2 overflow-hidden flex items-center justify-center shrink-0 border border-white/10">
                      <img src={sp.logoUrl} alt={sp.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-syne font-bold text-sm text-white">{sp.name}</h4>
                      <span className="text-[10px] font-mono text-[#00e5ff] block">{sp.badge} • {sp.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSponsor(sp.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* TAB 4: SYSTEM & UPI PAYMENT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* CLOUD DATABASE CROSS-DEVICE SYNC CARD */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c101d] via-[#101426] to-[#080b12] border border-[#0077ff]/40 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] animate-ping" />
                    <span className="text-[10px] font-mono text-[#00e5ff] tracking-widest uppercase font-bold">
                      REAL-TIME CROSS-DEVICE SYNC
                    </span>
                  </div>
                  <h3 className="font-syne font-extrabold text-xl text-white uppercase">
                    Cloud Database Sync & Backup
                  </h3>
                </div>

                <div className="px-3 py-1 rounded-full bg-[#0077ff]/20 border border-[#0077ff]/40 text-[#00e5ff] text-xs font-mono font-bold uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>STATUS: {cloudStatus.toUpperCase()}</span>
                </div>
              </div>

              <p className="text-xs font-mono text-white/70 leading-relaxed">
                Changes made on your phone or PC are automatically synchronized. You can also manually push data to the cloud or export/import database JSON files below.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={async () => {
                    await syncWithCloud();
                    alert('Cloud database synchronized successfully across all devices!');
                  }}
                  className="px-4 py-3 rounded-xl bg-[#0077ff] text-white font-mono text-xs font-bold uppercase hover:bg-[#0055ff] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Sync Cloud Now</span>
                </button>

                <button
                  onClick={exportDatabaseJSON}
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-xs font-bold uppercase hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#00e5ff]" />
                  <span>Export DB JSON</span>
                </button>

                <label className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-xs font-bold uppercase hover:bg-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <Edit3 className="w-4 h-4 text-[#00d4ff]" />
                  <span>Import DB JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const success = importDatabaseJSON(reader.result as string);
                          if (success) {
                            alert('Database restored successfully from file!');
                          } else {
                            alert('Invalid JSON file format!');
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-syne font-extrabold text-xl text-white uppercase">
                  UPI Gateway & College Settings
                </h3>
                <p className="text-xs font-mono text-white/50 pt-1">
                  Updates made here immediately reflect on the Registration Page payment gateway and festival headers.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-[#00e5ff] font-bold block">OFFICIAL FESTIVAL UPI ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="srishti@stthomas.upi"
                    value={settingsForm.upiId}
                    onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#0077ff]/60 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/80 block">UPLOAD CUSTOM UPI QR CODE IMAGE</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrUpload}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white/80 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-[#0077ff] file:text-white"
                  />
                  <input
                    type="url"
                    placeholder="OR paste QR image URL (https://...)"
                    value={settingsForm.upiQrImage}
                    onChange={(e) => setSettingsForm({ ...settingsForm, upiQrImage: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-white/80 block">COLLEGE NAME</label>
                    <input
                      type="text"
                      value={settingsForm.collegeName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, collegeName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-white/80 block">CONTACT EMAIL</label>
                    <input
                      type="email"
                      value={settingsForm.contactEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00e5ff] to-[#0077ff] text-white font-syne font-extrabold uppercase text-xs tracking-wider shadow-lg shadow-[#0077ff]/30 hover:scale-[1.01] active:scale-95 transition-all mt-4"
                >
                  Save System & UPI Settings
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT EVENT */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0c101d] border border-[#0077ff]/40 max-w-xl w-full space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-syne font-extrabold text-xl text-white uppercase">
                {editingEvent ? 'Edit Event Details' : 'Add New Event Card'}
              </h3>
              <button onClick={() => setIsAddEventOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[#00e5ff] font-bold">EVENT TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BuildBlitz Hackathon"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70">FESTIVAL SCHEDULE DAY *</label>
                  <select
                    value={eventForm.day}
                    onChange={(e) => setEventForm({ ...eventForm, day: e.target.value as 'dec-4' | 'dec-5' })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                  >
                    <option value="dec-4">December 4 (Day 1)</option>
                    <option value="dec-5">December 5 (Day 2)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-white/70">STAGE BADGE LABEL</label>
                  <input
                    type="text"
                    placeholder="BUILD & PROTOTYPE"
                    value={eventForm.stageLabel}
                    onChange={(e) => setEventForm({ ...eventForm, stageLabel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70">CATEGORY</label>
                  <input
                    type="text"
                    placeholder="Hackathon / Workshop / Competition"
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/70">SUBTITLE / TAGLINE</label>
                  <input
                    type="text"
                    placeholder="6-Hour Rapid Prototyping Challenge"
                    value={eventForm.subtitle}
                    onChange={(e) => setEventForm({ ...eventForm, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70">TIMING & DATE *</label>
                  <input
                    type="text"
                    required
                    placeholder="DEC 4 • 10:00 AM - 04:00 PM"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/70">VENUE NAME</label>
                  <input
                    type="text"
                    placeholder="CS Innovation Hub"
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70">MAP VENUE PIN LOCATION</label>
                  <select
                    value={eventForm.locationId}
                    onChange={(e) => setEventForm({ ...eventForm, locationId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                  >
                    <option value="main-auditorium">Main Auditorium</option>
                    <option value="cs-lab">CS Lab Complex</option>
                    <option value="seminar-hall">Seminar Hall</option>
                    <option value="open-stage">Open Air Stage</option>
                    <option value="innovation-lab">Innovation Hub</option>
                    <option value="conference-room">Conference Room</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-white/70">ACCENT COLOR</label>
                  <input
                    type="color"
                    value={eventForm.color}
                    onChange={(e) => setEventForm({ ...eventForm, color: e.target.value })}
                    className="w-full h-10 px-2 py-1 rounded-xl bg-black/60 border border-white/15 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70">COORDINATOR / SPEAKER NAME</label>
                  <input
                    type="text"
                    placeholder="Dr. Mathew K."
                    value={eventForm.speakerName}
                    onChange={(e) => setEventForm({ ...eventForm, speakerName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/70">SPEAKER ROLE / TITLE</label>
                  <input
                    type="text"
                    placeholder="Head of Department, CS"
                    value={eventForm.speakerRole}
                    onChange={(e) => setEventForm({ ...eventForm, speakerRole: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/70">EVENT HIGHLIGHTS (comma separated)</label>
                <input
                  type="text"
                  placeholder="Live leaderboard, Cash prizes, Certificate for all"
                  value={eventForm.highlights}
                  onChange={(e) => setEventForm({ ...eventForm, highlights: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70">PRIZE POOL</label>
                  <input
                    type="text"
                    placeholder="₹25,000 Pool"
                    value={eventForm.prize}
                    onChange={(e) => setEventForm({ ...eventForm, prize: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/70">FEE AMOUNT (INR)</label>
                  <input
                    type="number"
                    placeholder="150"
                    value={eventForm.fee}
                    onChange={(e) => setEventForm({ ...eventForm, fee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/70">IMAGE COVER URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={eventForm.image}
                  onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70">TAGS (comma separated)</label>
                <input
                  type="text"
                  placeholder="Hackathon, Full-Stack, Team Challenge"
                  value={eventForm.tags}
                  onChange={(e) => setEventForm({ ...eventForm, tags: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70">DESCRIPTION</label>
                <textarea
                  rows={3}
                  placeholder="Detailed event description..."
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00e5ff] to-[#0077ff] text-white font-syne font-extrabold uppercase text-xs tracking-wider shadow-lg shadow-[#0077ff]/30 hover:scale-[1.01] active:scale-95 transition-all mt-2"
              >
                Save Schedule Event To Website
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SPONSOR LOGO PNG */}
      {isAddSponsorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0c101d] border border-[#0077ff]/40 max-w-md w-full space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-syne font-extrabold text-xl text-white uppercase">
                Add Sponsor PNG Logo
              </h3>
              <button onClick={() => setIsAddSponsorOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSponsor} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-white/70">SPONSOR / BRAND NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NVIDIA"
                  value={sponsorForm.name}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70">BADGE TYPE</label>
                  <select
                    value={sponsorForm.badge}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, badge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                  >
                    <option value="TITLE">TITLE</option>
                    <option value="PLATINUM">PLATINUM</option>
                    <option value="GOLD">GOLD</option>
                    <option value="SILVER">SILVER</option>
                    <option value="PARTNER">PARTNER</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-white/70">CATEGORY</label>
                  <input
                    type="text"
                    placeholder="AI Partner"
                    value={sponsorForm.category}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                  />
                </div>
              </div>

              {/* Upload PNG File */}
              <div className="space-y-1">
                <label className="text-[#00e5ff] font-bold block">UPLOAD SPONSOR PNG LOGO</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleSponsorLogoUpload}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white/80 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-[#0077ff] file:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/70">OR PASTE PNG IMAGE URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={sponsorForm.logoUrl}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, logoUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0077ff] text-white font-syne font-bold uppercase text-xs hover:bg-[#0055ff] transition-all"
              >
                Add To Sponsors Marquee Ticker
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
