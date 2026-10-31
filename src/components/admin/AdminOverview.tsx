import React, { useState } from 'react';
import {
  Users,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Power,
  UserPlus,
  QrCode,
  Bell,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { SummaryStats, GymSettings, AttendanceRecord, Payment } from '../../types';
import { api } from '../../services/api';

interface AdminOverviewProps {
  stats: SummaryStats | null;
  settings: GymSettings | null;
  recentAttendance: AttendanceRecord[];
  recentPayments: Payment[];
  onNavigateTab: (tab: 'overview' | 'members' | 'payments' | 'attendance' | 'settings' | 'reports') => void;
  onOpenAddMember: () => void;
  onOpenRecordPayment: () => void;
  onSettingsUpdate: (updated: GymSettings) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  stats,
  settings,
  recentAttendance,
  recentPayments,
  onNavigateTab,
  onOpenAddMember,
  onOpenRecordPayment,
  onSettingsUpdate,
}) => {
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [customMsg, setCustomMsg] = useState(settings?.status_message || '');
  const [showStatusEdit, setShowStatusEdit] = useState(false);

  const handleToggleGym = async () => {
    if (!settings) return;
    setTogglingStatus(true);
    try {
      const updated = await api.toggleGymStatus(!settings.is_open, customMsg);
      onSettingsUpdate(updated);
    } catch (err) {
      console.error('Failed toggling gym status:', err);
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleSaveStatusMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const updated = await api.toggleGymStatus(settings.is_open, customMsg);
      onSettingsUpdate(updated);
      setShowStatusEdit(false);
    } catch (err) {
      console.error('Failed saving status msg:', err);
    }
  };

  return (
    <div className="flex-1 w-full p-4 space-y-5 pb-24 text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#B7F34A]">
            Director Command Center
          </span>
          <h2 className="text-xl font-black tracking-tight text-white uppercase">
            Gym Operations
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-zinc-400">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      {/* Gym Live Open / Closed Controller */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-3 h-3 rounded-full ${
                settings?.is_open
                  ? 'bg-[#B7F34A] shadow-[0_0_12px_#B7F34A]'
                  : 'bg-red-500 shadow-[0_0_10px_red]'
              }`}
            />
            <div>
              <div className="text-xs font-black text-white uppercase">
                {settings?.is_open ? 'GYM IS CURRENTLY OPEN' : 'GYM IS CURRENTLY CLOSED'}
              </div>
              <div className="text-[11px] text-zinc-400">
                {settings?.status_message || (settings?.is_open ? 'Open for workouts' : 'Closed')}
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleGym}
            disabled={togglingStatus}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 ${
              settings?.is_open
                ? 'bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300'
                : 'bg-[#B7F34A] hover:bg-[#a6e03e] text-black shadow-md shadow-[#B7F34A]/20'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{settings?.is_open ? 'Close Gym' : 'Open Gym'}</span>
          </button>
        </div>

        {/* Quick status message edit toggle */}
        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">
            Hours: {settings?.opening_time || '05:30 AM'} - {settings?.closing_time || '10:30 PM'}
          </span>
          <button
            onClick={() => setShowStatusEdit(!showStatusEdit)}
            className="text-[#B7F34A] hover:underline"
          >
            {showStatusEdit ? 'Cancel' : 'Edit Notice'}
          </button>
        </div>

        {showStatusEdit && (
          <form onSubmit={handleSaveStatusMsg} className="pt-2 flex gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="e.g. Open Now — Sunday morning batch"
              className="flex-1 h-9 px-3 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white"
            />
            <button
              type="submit"
              className="px-3 h-9 rounded-xl bg-[#B7F34A] text-black font-bold text-xs"
            >
              Update
            </button>
          </form>
        )}
      </div>

      {/* KPI Tiles Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Members */}
        <div
          onClick={() => onNavigateTab('members')}
          className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Total Members</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {stats?.totalMembers || 0}
          </div>
          <div className="text-[11px] text-[#B7F34A] font-semibold mt-0.5">
            {stats?.activeMembers || 0} Active ({stats?.expiringSoon || 0} Expiring)
          </div>
        </div>

        {/* Pending & Expired */}
        <div
          onClick={() => onNavigateTab('members')}
          className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Expired Dues</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 tabular-nums">
            {stats?.expired || 0}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">
            Renewal reminders needed
          </div>
        </div>

        {/* Total Revenue */}
        <div
          onClick={() => onNavigateTab('payments')}
          className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Total Revenue</span>
            <CreditCard className="w-4 h-4 text-[#B7F34A]" />
          </div>
          <div className="text-xl font-black text-white tabular-nums">
            ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">
            This Mo: ₹{(stats?.thisMonthRevenue || 0).toLocaleString('en-IN')}
          </div>
        </div>

        {/* Today's Check-ins */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Today's Visits</span>
            <QrCode className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {stats?.todayCheckIns || 0}
          </div>
          <div className="text-[11px] text-[#B7F34A] mt-0.5">
            Checked in at desk
          </div>
        </div>
      </div>

      {/* Quick Admin Actions */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1 block">
          Quick Operations
        </span>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onOpenAddMember}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex flex-col items-center justify-center text-center transition-all active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#B7F34A]/10 text-[#B7F34A] flex items-center justify-center mb-1 group-hover:scale-105">
              <UserPlus className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-white">Add Member</span>
          </button>

          <button
            onClick={onOpenRecordPayment}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex flex-col items-center justify-center text-center transition-all active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#B7F34A]/10 text-[#B7F34A] flex items-center justify-center mb-1 group-hover:scale-105">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-white">Record Fee</span>
          </button>

          <button
            onClick={() => onNavigateTab('attendance')}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex flex-col items-center justify-center text-center transition-all active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#B7F34A]/10 text-[#B7F34A] flex items-center justify-center mb-1 group-hover:scale-105">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-white">QR Scanner</span>
          </button>
        </div>
      </div>

      {/* Live Check-In Stream */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Recent Check-Ins Today
          </span>
          <button
            onClick={() => onNavigateTab('attendance')}
            className="text-xs text-[#B7F34A] hover:underline"
          >
            View All
          </button>
        </div>

        {recentAttendance.length === 0 ? (
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-zinc-400 text-xs">
            No check-ins recorded yet today.
          </div>
        ) : (
          <div className="space-y-1.5">
            {recentAttendance.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#B7F34A]">{a.member_code}</span>
                  <span className="font-semibold text-white">{a.member_name}</span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  {a.check_in_time}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Payments Stream */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Recent Fee Collections
          </span>
          <button
            onClick={() => onNavigateTab('payments')}
            className="text-xs text-[#B7F34A] hover:underline"
          >
            Full Ledger
          </button>
        </div>

        {recentPayments.length === 0 ? (
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-zinc-400 text-xs">
            No recent payments recorded.
          </div>
        ) : (
          <div className="space-y-1.5">
            {recentPayments.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-white">{p.member_name}</span>
                  <span className="text-[10px] text-zinc-400 ml-2">({p.plan_name})</span>
                </div>
                <div className="text-right">
                  <div className="font-black text-[#B7F34A] tabular-nums">
                    ₹{p.amount_inr.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[9px] text-zinc-400 uppercase">{p.method}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
