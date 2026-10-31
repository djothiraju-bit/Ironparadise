import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Shield,
  Dumbbell,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  QrCode as QrIcon,
} from 'lucide-react';
import { Member, GymSettings } from '../../types';
import { api } from '../../services/api';

interface MemberPassProps {
  member: Member;
  settings: GymSettings | null;
  onCheckInSuccess: () => void;
}

export const MemberPass: React.FC<MemberPassProps> = ({
  member,
  settings,
  onCheckInSuccess,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInMsg, setCheckInMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Generate dynamic QR code payload with security token
  const refreshQR = async () => {
    const now = new Date();
    const timeCode = now.toISOString().substring(0, 16); // updates every minute
    setTimestamp(
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );

    const payload = JSON.stringify({
      club: 'IP FITNESS',
      code: member.member_code,
      id: member.id,
      name: member.name,
      plan: member.plan_name,
      status: member.status,
      sec: timeCode,
    });

    try {
      const url = await QRCode.toDataURL(payload, {
        width: 260,
        margin: 1.5,
        color: {
          dark: '#000000',
          light: '#B7F34A',
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('Failed generating QR code:', err);
    }
  };

  useEffect(() => {
    refreshQR();
    const interval = setInterval(refreshQR, 30000); // refresh token every 30s
    return () => clearInterval(interval);
  }, [member]);

  const handleSelfCheckIn = async () => {
    setCheckingIn(true);
    setCheckInMsg(null);
    try {
      const res = await api.checkIn({
        member_id: member.id,
        method: 'qr_pass',
      });
      setCheckInMsg({
        type: 'success',
        text: res.message || 'Check-in recorded! Have a great workout.',
      });
      onCheckInSuccess();
    } catch (err: any) {
      setCheckInMsg({
        type: 'error',
        text: err.message || 'Check-in failed.',
      });
    } finally {
      setCheckingIn(false);
    }
  };

  const isExpired = member.status === 'expired';

  return (
    <div className="flex-1 w-full p-4 space-y-4 pb-20 text-zinc-100 flex flex-col items-center">
      <div className="text-center pt-1">
        <h2 className="text-xl font-black tracking-tight text-white uppercase">
          Digital Member Pass
        </h2>
        <p className="text-xs text-zinc-400">
          Scan at turnstile or reception scanner for entry
        </p>
      </div>

      {/* Main Digital Pass Card */}
      <div className="w-full max-w-sm rounded-3xl bg-[#141416] border border-zinc-700/80 p-5 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Neon top accent strip */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-[#B7F34A]" />

        {/* Brand bar */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#B7F34A] text-black font-black flex items-center justify-center text-xs">
              IP
            </div>
            <div>
              <div className="text-xs font-black tracking-tight text-white">
                {settings?.gym_name || 'IP FITNESS'}
              </div>
              <div className="text-[9px] text-[#B7F34A] font-bold tracking-widest uppercase">
                Official Access ID
              </div>
            </div>
          </div>

          <div
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
              member.status === 'active'
                ? 'bg-emerald-950/80 border-[#B7F34A]/50 text-[#B7F34A]'
                : member.status === 'expiring_soon'
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-400'
                : 'bg-red-950/80 border-red-500/50 text-red-400'
            }`}
          >
            {member.status.replace('_', ' ')}
          </div>
        </div>

        {/* Member Name & ID */}
        <div className="text-center my-3">
          <h3 className="text-lg font-black text-white">{member.name}</h3>
          <div className="inline-block mt-0.5 px-3 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 font-mono font-bold text-sm text-[#B7F34A]">
            {member.member_code}
          </div>
          <div className="text-xs text-zinc-400 mt-1">{member.plan_name}</div>
        </div>

        {/* QR Code Canvas */}
        <div className="p-3 bg-zinc-950 rounded-2xl border-2 border-[#B7F34A]/40 shadow-inner flex flex-col items-center">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Member Access QR Code"
              className="w-48 h-48 rounded-xl object-contain"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-zinc-400 text-xs">
              Generating pass...
            </div>
          )}

          {/* Dynamic rotating security stamp */}
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
            <RefreshCw className="w-3 h-3 text-[#B7F34A] animate-spin" />
            <span>Live Security Token: {timestamp}</span>
          </div>
        </div>

        {/* Pass Validity Details */}
        <div className="w-full mt-4 pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] uppercase text-zinc-400 block font-medium">Valid Till</span>
            <span className="font-bold text-white">
              {new Date(member.expiry_date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase text-zinc-400 block font-medium">Phone</span>
            <span className="font-semibold text-zinc-300">{member.phone}</span>
          </div>
        </div>

        {/* Status warning if expired */}
        {isExpired && (
          <div className="w-full mt-3 p-2.5 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Membership expired. Please pay pending fees to unblock pass.</span>
          </div>
        )}
      </div>

      {/* Check-In Toast Message */}
      {checkInMsg && (
        <div
          className={`w-full max-w-sm p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            checkInMsg.type === 'success'
              ? 'bg-emerald-950/80 border border-[#B7F34A] text-[#B7F34A]'
              : 'bg-red-950/80 border border-red-700 text-red-300'
          }`}
        >
          {checkInMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{checkInMsg.text}</span>
        </div>
      )}

      {/* One-Tap Check-In Simulation Trigger */}
      <div className="w-full max-w-sm space-y-2">
        <button
          onClick={handleSelfCheckIn}
          disabled={checkingIn || isExpired}
          className="w-full h-12 rounded-2xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#B7F34A]/10"
        >
          <QrIcon className="w-4 h-4" />
          <span>{checkingIn ? 'Verifying with Scanner...' : 'Tap To Check-In At Gym'}</span>
        </button>

        <p className="text-center text-[11px] text-zinc-400">
          Hold this screen under the reception barcode/QR scanner or tap above.
        </p>
      </div>
    </div>
  );
};
