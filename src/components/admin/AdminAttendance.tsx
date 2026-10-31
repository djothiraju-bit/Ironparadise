import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Camera,
  RefreshCw,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { AttendanceRecord, Member } from '../../types';
import { api } from '../../services/api';

interface AdminAttendanceProps {
  attendance: AttendanceRecord[];
  members: Member[];
  onAttendanceRecorded: () => void;
  onRecordFeeForExpired: (member: Member) => void;
}

export const AdminAttendance: React.FC<AdminAttendanceProps> = ({
  attendance,
  members,
  onAttendanceRecorded,
  onRecordFeeForExpired,
}) => {
  const [scanCode, setScanCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    member?: Member;
  } | null>(null);

  const handleCheckIn = async (codeToUse?: string) => {
    const code = (codeToUse || scanCode).trim();
    if (!code) return;

    setLoading(true);
    setScanResult(null);

    try {
      const res = await api.checkIn({
        member_code: code,
        method: 'admin_manual',
      });

      setScanResult({
        success: true,
        message: res.message || 'Check-in recorded successfully!',
        member: res.member,
      });
      setScanCode('');
      onAttendanceRecorded();
    } catch (err: any) {
      // Find member if possible to show their expired details
      const matched = members.find((m) => m.member_code.toUpperCase() === code.toUpperCase());
      setScanResult({
        success: false,
        message: err.message || 'Check-in rejected.',
        member: matched,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full p-4 space-y-4 pb-24 text-zinc-100">
      {/* Header */}
      <div className="pt-1">
        <h2 className="text-xl font-black tracking-tight text-white uppercase">
          Reception Check-In Scanner
        </h2>
        <p className="text-xs text-zinc-400">
          Verify digital member QR passes and log gym entry
        </p>
      </div>

      {/* Simulated Scanner Viewport Card */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <Camera className="w-4 h-4 text-[#B7F34A]" />
            <span>Turnstile Scanner Feed</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">Camera: Online</span>
        </div>

        {/* Viewport Animation */}
        <div className="relative w-full h-44 rounded-2xl bg-black border border-zinc-800 overflow-hidden flex flex-col items-center justify-center p-4">
          {/* Scanning line animation */}
          <div className="absolute inset-x-8 h-0.5 bg-[#B7F34A] shadow-[0_0_12px_#B7F34A] animate-bounce" />

          {/* Scanner target frame */}
          <div className="w-32 h-32 border-2 border-dashed border-[#B7F34A]/60 rounded-2xl flex flex-col items-center justify-center text-center p-2">
            <QrCode className="w-10 h-10 text-zinc-600 mb-1" />
            <span className="text-[10px] text-zinc-400 font-medium">Ready to scan</span>
          </div>
        </div>

        {/* Manual Code Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCheckIn();
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
            <input
              type="text"
              value={scanCode}
              onChange={(e) => setScanCode(e.target.value)}
              placeholder="Enter Member Code (e.g. IP-1001)"
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#B7F34A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !scanCode}
            className="px-4 h-10 rounded-xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-extrabold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
            <span>Log In</span>
          </button>
        </form>

        {/* Fast Member Selector for Desk Testing */}
        <div className="pt-2 border-t border-zinc-800/80">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">
            1-Tap Quick Scan Simulation:
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {members.slice(0, 4).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleCheckIn(m.member_code)}
                className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 text-left transition-colors flex items-center justify-between"
              >
                <div className="truncate">
                  <span className="font-mono font-bold text-[#B7F34A] text-[11px] block">{m.member_code}</span>
                  <span className="text-white text-[11px] truncate block">{m.name}</span>
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded capitalize ${
                    m.status === 'active'
                      ? 'bg-emerald-950 text-emerald-400'
                      : m.status === 'expired'
                      ? 'bg-red-950 text-red-400'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {m.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Immediate Result Card */}
      {scanResult && (
        <div
          className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in slide-in-from-top-2 ${
            scanResult.success
              ? 'bg-emerald-950/70 border-[#B7F34A]/60 text-zinc-200'
              : 'bg-red-950/80 border-red-700 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {scanResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-[#B7F34A] shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="font-bold text-sm">
              {scanResult.success ? 'Access Granted' : 'Access Denied / Verification Alert'}
            </span>
          </div>

          <p className="text-[11px] leading-relaxed">{scanResult.message}</p>

          {scanResult.member && (
            <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-white">{scanResult.member.name}</span>
                <span className="text-zinc-400 text-[10px] ml-1.5">
                  ({scanResult.member.member_code} · {scanResult.member.plan_name})
                </span>
              </div>

              {!scanResult.success && (
                <button
                  onClick={() => onRecordFeeForExpired(scanResult.member!)}
                  className="px-3 py-1 rounded-lg bg-[#B7F34A] text-black font-extrabold text-[11px] transition-transform active:scale-95"
                >
                  Collect Fee Now
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Today's Check-In Ledger */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Today's Attendance Ledger
          </span>
          <span className="text-[11px] font-mono text-[#B7F34A]">
            {attendance.length} Athletes Today
          </span>
        </div>

        {attendance.length === 0 ? (
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-zinc-400 text-xs">
            No check-in entries logged yet today.
          </div>
        ) : (
          <div className="space-y-1.5">
            {attendance.map((a) => (
              <div
                key={a.id}
                className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 text-[#B7F34A] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    {a.member_code.replace('IP-', '')}
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{a.member_name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">({a.member_code})</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-[#B7F34A]" />
                      <span className="font-mono">{a.check_in_time}</span>
                      <span>·</span>
                      <span className="capitalize">{a.method.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="px-2 py-0.5 rounded bg-emerald-950/80 border border-[#B7F34A]/40 text-[#B7F34A] text-[10px] font-bold">
                  CHECKED IN
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
