import React from 'react';
import {
  QrCode,
  CreditCard,
  Calendar,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  ChevronRight,
  ShieldCheck,
  Dumbbell,
  Sparkles,
  Flame,
  CheckCircle2,
  Activity,
  Utensils,
} from 'lucide-react';
import { Member, GymSettings, Announcement, AttendanceRecord } from '../../types';

interface MemberHomeProps {
  member: Member;
  settings: GymSettings | null;
  announcements: Announcement[];
  recentAttendance: AttendanceRecord[];
  onNavigateTab: (
    tab: 'home' | 'pass' | 'payments' | 'attendance' | 'info' | 'programs',
    programTab?: 'cardio' | 'fat_loss' | 'diet_plan' | 'bodybuilding'
  ) => void;
  onOpenPayModal: () => void;
}

export const MemberHome: React.FC<MemberHomeProps> = ({
  member,
  settings,
  announcements,
  recentAttendance,
  onNavigateTab,
  onOpenPayModal,
}) => {
  // Days remaining calculation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(member.expiry_date);
  expiry.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const statusConfig = {
    active: {
      label: 'ACTIVE MEMBERSHIP',
      badgeClass: 'bg-emerald-950/80 border-[#B7F34A]/50 text-[#B7F34A]',
      icon: CheckCircle2,
    },
    expiring_soon: {
      label: 'EXPIRING SOON',
      badgeClass: 'bg-amber-950/80 border-amber-500/50 text-amber-400',
      icon: AlertTriangle,
    },
    expired: {
      label: 'EXPIRED',
      badgeClass: 'bg-red-950/80 border-red-500/50 text-red-400',
      icon: AlertTriangle,
    },
    inactive: {
      label: 'DEACTIVATED',
      badgeClass: 'bg-zinc-800 border-zinc-700 text-zinc-400',
      icon: AlertTriangle,
    },
  }[member.status] || {
    label: 'UNKNOWN',
    badgeClass: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    icon: CheckCircle2,
  };

  const StatusIcon = statusConfig.icon;

  // Format dates
  const formattedExpiry = new Date(member.expiry_date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedJoining = new Date(member.joining_date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Calculate workouts this month
  const thisMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const workoutsThisMonth = recentAttendance.filter((a) => a.date.startsWith(thisMonthStr)).length;

  return (
    <div className="flex-1 w-full p-4 space-y-4 pb-20 text-zinc-100">
      {/* Top Welcome Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7F34A]" />
            <span>Welcome back, Athlete</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white capitalize">
            {member.name}
          </h2>
        </div>

        <button
          onClick={() => onNavigateTab('pass')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#B7F34A]/50 transition-colors"
        >
          <QrCode className="w-4 h-4 text-[#B7F34A]" />
          <span className="text-xs font-mono font-bold text-white">{member.member_code}</span>
        </button>
      </div>

      {/* Gym Live Open/Closed Alert Banner */}
      <div
        className={`p-3 rounded-2xl border flex items-center justify-between ${
          settings?.is_open
            ? 'bg-zinc-900/90 border-zinc-800'
            : 'bg-red-950/40 border-red-900/60'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              settings?.is_open
                ? 'bg-[#B7F34A] shadow-[0_0_10px_#B7F34A]'
                : 'bg-red-500 shadow-[0_0_8px_red]'
            }`}
          />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>{settings?.is_open ? 'GYM IS OPEN NOW' : 'GYM IS CURRENTLY CLOSED'}</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {settings?.status_message || (settings?.is_open ? 'Welcome to your training session' : 'Closed for maintenance')}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('info')}
          className="text-xs font-semibold text-[#B7F34A] hover:underline flex items-center"
        >
          <span>Hours</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Urgent Announcements Banner (if any) */}
      {announcements.filter((a) => a.priority === 'urgent').map((urgent) => (
        <div
          key={urgent.id}
          className="p-3 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-start gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-300">{urgent.title}</div>
            <p className="text-[11px] text-amber-200/80 mt-0.5">{urgent.content}</p>
          </div>
        </div>
      ))}

      {/* Digital Membership Pass Card (Hero) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18181b] via-[#141416] to-[#0d0d0f] border border-zinc-700/80 p-5 shadow-xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#B7F34A]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black tracking-wider text-white">IP FITNESS</span>
              <span className="text-[10px] text-zinc-400">CLUB PASS</span>
            </div>
            <div className="text-lg font-black text-white">{member.plan_name}</div>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${statusConfig.badgeClass}`}
          >
            <StatusIcon className="w-3 h-3" />
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/* Member code and expiry */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 grid grid-cols-3 gap-2 relative z-10 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Member ID</span>
            <span className="font-mono font-black text-[#B7F34A] text-sm">{member.member_code}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Valid Until</span>
            <span className="font-bold text-white tabular-nums">{formattedExpiry}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Fee / Mo</span>
            <span className="font-bold text-zinc-200 tabular-nums">₹{member.fee_inr}</span>
          </div>
        </div>

        {/* Expiry countdown tag */}
        <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between relative z-10">
          <div className="text-xs">
            {diffDays > 0 ? (
              <span className="text-zinc-300 font-medium">
                ⏳ <strong className="text-white font-bold">{diffDays} days</strong> remaining
              </span>
            ) : (
              <span className="text-red-400 font-bold">
                ⚠️ Membership expired {Math.abs(diffDays)} days ago
              </span>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('pass')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#B7F34A] hover:underline"
          >
            <span>Show QR Pass</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pending Fee Notification & Renewal Call-To-Action */}
      {(member.status === 'expired' || member.status === 'expiring_soon') && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-[#1b1c16] border border-amber-500/40 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {member.status === 'expired' ? 'Membership Expired — Renew Now' : 'Renewal Due Soon'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Pay online via Razorpay (UPI, Cards) to keep your gym access active.
            </p>
          </div>

          <button
            onClick={onOpenPayModal}
            className="px-4 py-2.5 rounded-xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-extrabold text-xs shrink-0 shadow-md shadow-[#B7F34A]/20 transition-all active:scale-95"
          >
            Pay ₹{member.fee_inr}
          </button>
        </div>
      )}

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigateTab('pass')}
          className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 text-left transition-all active:scale-98 group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#B7F34A]/10 text-[#B7F34A] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-white">QR Entry Pass</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Instant check-in at turnstile</div>
        </button>

        <button
          onClick={onOpenPayModal}
          className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 text-left transition-all active:scale-98 group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#B7F34A]/10 text-[#B7F34A] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-white">Pay Fees (INR)</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Razorpay UPI & Cards</div>
        </button>
      </div>

      {/* 4 Core Features: Cardio, Fat Loss, Diet Plan, Bodybuilding */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#B7F34A]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Training & Nutrition Programs
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('programs', 'cardio')}
            className="text-xs text-[#B7F34A] hover:underline flex items-center font-semibold"
          >
            <span>Open Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. Cardio */}
          <div
            onClick={() => onNavigateTab('programs', 'cardio')}
            className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 cursor-pointer transition-all active:scale-98 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-[#B7F34A] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-[#B7F34A] bg-[#B7F34A]/10 px-1.5 py-0.5 rounded">
                HIIT Timer
              </span>
            </div>
            <div className="font-extrabold text-xs text-white">1. Cardio</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Sprint intervals & HR zones</div>
          </div>

          {/* 2. Fat Loss */}
          <div
            onClick={() => onNavigateTab('programs', 'fat_loss')}
            className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 cursor-pointer transition-all active:scale-98 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                -500 kcal
              </span>
            </div>
            <div className="font-extrabold text-xs text-white">2. Fat Loss</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Deficit targets & roadmap</div>
          </div>

          {/* 3. Diet Plan */}
          <div
            onClick={() => onNavigateTab('programs', 'diet_plan')}
            className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 cursor-pointer transition-all active:scale-98 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                Water & Veg
              </span>
            </div>
            <div className="font-extrabold text-xs text-white">3. Diet Plan</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Indian charts & hydration</div>
          </div>

          {/* 4. Bodybuilding */}
          <div
            onClick={() => onNavigateTab('programs', 'bodybuilding')}
            className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 cursor-pointer transition-all active:scale-98 group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                1RM & PPL
              </span>
            </div>
            <div className="font-extrabold text-xs text-white">4. Bodybuilding</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Hypertrophy splits & sets</div>
          </div>
        </div>
      </div>

      {/* Attendance & Workout Streak Metric */}
      <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Workout Consistency
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('attendance')}
            className="text-xs text-[#B7F34A] hover:underline"
          >
            View Log
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-white tabular-nums">
              {workoutsThisMonth} <span className="text-xs font-normal text-zinc-400">Sessions</span>
            </div>
            <div className="text-[11px] text-zinc-400">Recorded workouts this month</div>
          </div>

          <div className="text-right">
            <div className="text-xs font-semibold text-zinc-300">
              Joined {formattedJoining}
            </div>
            <div className="text-[11px] text-[#B7F34A] font-medium">Keep up the momentum!</div>
          </div>
        </div>
      </div>

      {/* Announcements Feed */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Gym Announcements
          </span>
        </div>

        {announcements.length === 0 ? (
          <div className="p-4 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/60 text-zinc-400 text-xs">
            No active announcements.
          </div>
        ) : (
          announcements.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{item.title}</span>
                <span className="text-[10px] text-zinc-400">
                  {new Date(item.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">{item.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Bottom Gym Contact Strip */}
      <div className="pt-2 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/80">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-[#B7F34A] shrink-0" />
          <span className="truncate">{settings?.address || 'Sector 18, Commercial Hub'}</span>
        </div>
        <button
          onClick={() => onNavigateTab('info')}
          className="text-[#B7F34A] font-semibold shrink-0 hover:underline ml-2"
        >
          View Map
        </button>
      </div>
    </div>
  );
};
