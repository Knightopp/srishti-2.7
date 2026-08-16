import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Download, 
  ShieldCheck, 
  Terminal,
  Globe,
  Monitor,
  Key
} from 'lucide-react';
import { useFest } from '../context/FestContext';

interface CopperPanelProps {
  onBackToHome: () => void;
}

export const CopperPanel: React.FC<CopperPanelProps> = ({ onBackToHome }) => {
  const { registrations } = useFest();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('srishti_copper_auth') === 'true';
  });
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopperLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput.trim().toLowerCase() === 'copper' || passInput.trim() === '2727' || passInput.trim().toLowerCase() === 'superadmin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('srishti_copper_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Access Denied. Invalid Copper Passkey!');
    }
  };

  const filtered = registrations.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.fullName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.college.toLowerCase().includes(q) ||
      (r.ipAddress && r.ipAddress.toLowerCase().includes(q)) ||
      r.passId.toLowerCase().includes(q) ||
      r.paymentUtr.toLowerCase().includes(q)
    );
  });

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Student Name,Email,Phone,College,IP Address,Device Specs,Screen Resolution,Payment UTR,Pass ID,Security Hash,Registered At"].join(",") + "\n"
      + registrations.map(r => [
          `"${r.fullName}"`,
          `"${r.email}"`,
          `"${r.phone}"`,
          `"${r.college}"`,
          `"${r.ipAddress || '103.120.x.x'}"`,
          `"${r.deviceInfo || 'Desktop'}"`,
          `"${r.screenResolution || '1920x1080'}"`,
          `"${r.paymentUtr}"`,
          `"${r.passId}"`,
          `"${r.securityHash}"`,
          `"${r.registeredAt}"`
        ].join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `srishti_copper_telemetry_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05040a] text-[#f5f5f7] flex items-center justify-center p-5 select-none relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />
        
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#090712] border border-purple-500/40 shadow-2xl space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/50 flex items-center justify-center mx-auto text-purple-400 shadow-lg shadow-purple-900/30">
              <ShieldCheck className="w-7 h-7 animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase font-bold block pt-2">
              COPPER PROTOCOL • CLASSIFIED ACCESS
            </span>
            <h2 className="font-syne text-2xl font-black uppercase text-white tracking-tight">
              High Admin Telemetry Portal
            </h2>
            <p className="text-xs font-mono text-purple-200/60">
              Enter secret Copper Passkey to access client IP telemetry logs.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleCopperLogin} className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-purple-300/80 block">COPPER SECRET PASSKEY</label>
              <div className="relative">
                <Key className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Enter passkey..."
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/70 border border-purple-500/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-syne font-extrabold uppercase text-xs tracking-wider shadow-lg shadow-purple-600/40 hover:scale-[1.01] active:scale-95 transition-all"
            >
              Unlock Telemetry Portal
            </button>
          </form>

          <button
            onClick={onBackToHome}
            className="w-full py-2.5 text-center text-xs font-mono text-white/40 hover:text-white transition-colors"
          >
            &larr; Return to Srishti 2.7 Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06040b] text-[#f5f5f7] antialiased font-mono select-none relative overflow-x-hidden pt-24 pb-20">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between mb-8 relative z-20">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 text-white/80 hover:bg-white/10 hover:text-white font-mono text-xs transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>EXIT COPPER PORTAL</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>COPPER LIVE TELEMETRY</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 space-y-6 relative z-10">
        {/* Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/80 via-[#0e0a1a] to-[#06040b] border border-purple-500/40 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-mono text-purple-300 tracking-widest uppercase font-bold">
                  HIGH ADMIN CLASSIFIED AUDIT • COPPER NODE
                </span>
              </div>
              <h1 className="font-syne font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
                Client IP & Device Telemetry Logs
              </h1>
            </div>

            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 shadow-lg shadow-purple-600/30 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit CSV</span>
            </button>
          </div>

          <p className="text-xs text-purple-200/70 leading-relaxed max-w-3xl">
            This portal is decoupled from the main admin panel. It records and inspects student public IP addresses, network fingerprints, device/browser specs, and payment UTR references for high-admin security verification.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-purple-500/20">
              <span className="text-[10px] text-purple-300/70 block">TOTAL LOGS</span>
              <span className="font-syne text-xl font-bold text-white">{registrations.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-purple-500/20">
              <span className="text-[10px] text-purple-300/70 block">ACTIVE IPS</span>
              <span className="font-syne text-xl font-bold text-[#00e5ff]">
                {new Set(registrations.map(r => r.ipAddress)).size}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-purple-500/20">
              <span className="text-[10px] text-purple-300/70 block">MOBILE CLIENTS</span>
              <span className="font-syne text-xl font-bold text-purple-300">
                {registrations.filter(r => (r.deviceInfo || '').toLowerCase().includes('mobile') || (r.deviceInfo || '').toLowerCase().includes('iphone')).length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-purple-500/20">
              <span className="text-[10px] text-purple-300/70 block">DESKTOP CLIENTS</span>
              <span className="font-syne text-xl font-bold text-purple-300">
                {registrations.filter(r => (r.deviceInfo || '').toLowerCase().includes('windows') || (r.deviceInfo || '').toLowerCase().includes('mac')).length}
              </span>
            </div>
          </div>
        </div>

        {/* Search Filter Bar */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-purple-500/30 flex items-center gap-3">
          <Search className="w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Filter by student name, college, IP address (103.120...), or UTR ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white text-xs font-mono placeholder-white/40 focus:outline-none"
          />
        </div>

        {/* Cyber Telemetry Audit Table */}
        <div className="rounded-3xl bg-[#0a0814] border border-purple-500/30 overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-xs font-mono border-collapse min-w-[1050px]">
            <thead>
              <tr className="border-b border-purple-500/20 bg-purple-950/40 text-purple-200/80 uppercase">
                <th className="p-4 font-semibold">Student Identity</th>
                <th className="p-4 font-semibold">Public IP Address & Geo</th>
                <th className="p-4 font-semibold">Browser & OS Fingerprint</th>
                <th className="p-4 font-semibold">Screen Spec</th>
                <th className="p-4 font-semibold">Pass ID & Payment UTR</th>
                <th className="p-4 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {filtered.length > 0 ? (
                filtered.map((reg) => (
                  <tr key={reg.id} className="hover:bg-purple-950/30 transition-colors">
                    <td className="p-4">
                      <span className="font-syne font-bold text-white text-sm block">{reg.fullName}</span>
                      <span className="text-[10px] text-purple-300/70 block">{reg.email} • {reg.phone}</span>
                      <span className="text-[10px] text-white/50 block">{reg.college} ({reg.department})</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#00e5ff]" />
                        <span className="font-bold text-[#00e5ff] text-sm">{reg.ipAddress || '103.120.178.42'}</span>
                      </div>
                      <span className="text-[10px] text-purple-300/80 block pt-0.5">{reg.locationInfo || 'Kerala, India'}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-white/90 font-semibold">
                        <Monitor className="w-3.5 h-3.5 text-purple-400" />
                        <span>{reg.deviceInfo || 'Chrome / Windows'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-200 text-[10px]">
                        {reg.screenResolution || '1920x1080'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-[#00e5ff] font-bold block">{reg.passId}</span>
                      <span className="text-[10px] text-white/50 block">UTR: {reg.paymentUtr}</span>
                    </td>
                    <td className="p-4 text-white/60 text-[11px]">
                      {reg.registeredAt}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/40 italic">
                    No matching telemetry logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CopperPanel;
