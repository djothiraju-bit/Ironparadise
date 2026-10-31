import React from 'react';
import { Calendar, Flame, CheckCircle, Clock, QrCode, Shield, Award } from 'lucide-react';
import { Member, AttendanceRecord } from '../../types';

interface MemberAttendanceProps {
  member: Member;
  attendance: AttendanceRecord[];
}

export const MemberAttendance: React.FC<MemberAttendanceProps> = ({ member, attendance }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  // Get total days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = now.toLocaleString('default', { month: 'long' });

  // Map of days attended in current month
  const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const attendedDays = new Set(
    attendance
      .filter((a) => a.date.startsWith(currentMonthPrefix))
      .map((a) => parseInt(a.date.split('-')[2], 10))
  );

  const totalThisMonth = attendedDays.size;

  return (
    <div className="flex-1 w-full p-4 space-y-5 pb-24 text-zinc-100">
      {/* Header */}
      <div className="pt-1">
        <h2 className="text-xl font-black tracking-tight text-white uppercase">
          Workout Attendance
        </h2>
        <p className="text-xs text-zinc-400">
          Track your gym consistency and check-in history
        </p>
      </div>

      {/* Consistency Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>This Month</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white tabular-nums">
              {totalThisMonth} <span className="text-xs font-normal text-zinc-400">Days</span>
            </div>
            <div className="text-[10px] text-[#B7F34A] font-semibold mt-0.5">
              {monthName} {currentYear}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-2">
            <Award className="w-4 h-4 text-[#B7F34A]" />
            <span>All-Time Workouts</span>
          </div>
          <div>
            <div className="text-2xl font-black text-white tabular-nums">
              {attendance.length} <span className="text-xs font-normal text-zinc-400">Total</span>
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              Since {new Date(member.joining_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid Representation */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>{monthName} {currentYear}</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-zinc-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#B7F34A]" /> Attended
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-zinc-700" /> Rest
            </span>
          </div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5 pt-2">
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const hasAttended = attendedDays.has(day);
            const isToday = day === now.getDate();

            return (
              <div
                key={day}
                className={`h-9 rounded-lg flex flex-col items-center justify-center text-xs font-semibold relative transition-all ${
                  hasAttended
                    ? 'bg-[#B7F34A] text-black font-bold shadow-sm shadow-[#B7F34A]/20'
                    : isToday
                    ? 'bg-zinc-800 border border-zinc-600 text-white'
                    : 'bg-zinc-950/70 text-zinc-400'
                }`}
              >
                <span>{day}</span>
                {hasAttended && <span className="w-1 h-1 rounded-full bg-black mt-0.5" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chronological Check-In Ledger */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Recent Check-In Ledger
          </span>
          <span className="text-[11px] text-zinc-400 font-mono">
            {attendance.length} Record{attendance.length === 1 ? '' : 's'}
          </span>
        </div>

        {attendance.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 text-zinc-400 text-xs">
            No check-in entries found yet. Use your Digital QR Pass at the turnstile to record your workouts!
          </div>
        ) : (
          <div className="space-y-2">
            {attendance.slice(0, 10).map((record) => (
              <div
                key={record.id}
                className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 text-[#B7F34A] flex items-center justify-center shrink-0">
                    {record.method === 'qr_pass' ? (
                      <QrCode className="w-4 h-4" />
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-white">
                      {new Date(record.date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-[#B7F34A]" />
                      <span className="font-mono">{record.check_in_time}</span>
                      <span>·</span>
                      <span className="capitalize">{record.method.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="px-2 py-0.5 rounded bg-emerald-950/80 border border-[#B7F34A]/40 text-[#B7F34A] text-[10px] font-bold">
                  VERIFIED
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
