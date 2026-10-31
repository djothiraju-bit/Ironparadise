import React, { useState, useEffect } from 'react';
import {
  Home,
  QrCode,
  CreditCard,
  Calendar,
  MapPin,
  LayoutDashboard,
  Users,
  Settings,
  TrendingUp,
  LogOut,
  Dumbbell,
  Sparkles,
  Shield,
  User as UserIcon,
} from 'lucide-react';

import {
  GymSettings,
  MembershipPlan,
  User,
  Member,
  Payment,
  AttendanceRecord,
  Announcement,
  SummaryStats,
} from './types';
import { api } from './services/api';

import { DeviceFrame } from './components/DeviceFrame';
import { SplashScreen } from './components/SplashScreen';
import { ReceiptModal } from './components/ReceiptModal';
import { ExportBuildModal } from './components/ExportBuildModal';

import { MemberHome } from './components/member/MemberHome';
import { MemberPass } from './components/member/MemberPass';
import { MemberPayments } from './components/member/MemberPayments';
import { MemberAttendance } from './components/member/MemberAttendance';
import { MemberGymInfo } from './components/member/MemberGymInfo';
import { MemberPrograms } from './components/member/MemberPrograms';

import { AdminOverview } from './components/admin/AdminOverview';
import { AdminMembers } from './components/admin/AdminMembers';
import { AdminPayments } from './components/admin/AdminPayments';
import { AdminAttendance } from './components/admin/AdminAttendance';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminReports } from './components/admin/AdminReports';

export default function App() {
  // App-level state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [role, setRole] = useState<'member' | 'admin' | null>(null);

  // Common data
  const [settings, setSettings] = useState<GymSettings | null>(null);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Member navigation
  const [memberTab, setMemberTab] = useState<'home' | 'pass' | 'payments' | 'attendance' | 'info' | 'programs'>('home');
  const [selectedProgramCategory, setSelectedProgramCategory] = useState<'cardio' | 'fat_loss' | 'diet_plan' | 'bodybuilding'>('cardio');
  const [memberPayments, setMemberPayments] = useState<Payment[]>([]);
  const [memberAttendance, setMemberAttendance] = useState<AttendanceRecord[]>([]);

  // Admin navigation
  const [adminTab, setAdminTab] = useState<'overview' | 'members' | 'payments' | 'attendance' | 'settings' | 'reports'>('overview');
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([]);
  const [adminStats, setAdminStats] = useState<SummaryStats | null>(null);
  const [preSelectedMemberForFee, setPreSelectedMemberForFee] = useState<Member | null>(null);

  // Modals
  const [activeReceipt, setActiveReceipt] = useState<Payment | null>(null);
  const [isBuildGuideOpen, setIsBuildGuideOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial load
  const loadInitialData = async () => {
    try {
      const [fetchedSettings, fetchedPlans, fetchedAnnouncements] = await Promise.all([
        api.getSettings(),
        api.getPlans(),
        api.getAnnouncements(),
      ]);
      setSettings(fetchedSettings);
      setPlans(fetchedPlans);
      setAnnouncements(fetchedAnnouncements);

      // Check current session
      const token = api.getToken();
      if (token) {
        try {
          const me = await api.getMe();
          setCurrentUser(me.user);
          setCurrentMember(me.member || null);
          setRole(me.user.role);
          if (me.user.role === 'member' && me.member) {
            loadMemberData(me.member.id);
          } else if (me.user.role === 'admin') {
            loadAdminData();
          }
        } catch (e) {
          api.clearToken();
        }
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMemberData = async (memberId: string) => {
    try {
      const [pays, att, updatedMem] = await Promise.all([
        api.getMemberPayments(memberId),
        api.getMemberAttendance(memberId),
        api.getMember(memberId),
      ]);
      setMemberPayments(pays);
      setMemberAttendance(att);
      setCurrentMember(updatedMem);
    } catch (err) {
      console.error('Error loading member data:', err);
    }
  };

  const loadAdminData = async () => {
    try {
      const [mems, pays, attToday, stats, ann] = await Promise.all([
        api.getMembers(),
        api.getPayments(),
        api.getTodayAttendance(),
        api.getSummaryStats(),
        api.getAnnouncements(),
      ]);
      setAllMembers(mems);
      setAllPayments(pays);
      setTodayAttendance(attToday);
      setAdminStats(stats);
      setAnnouncements(ann);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleLoginSuccess = (user: User, member?: Member) => {
    setCurrentUser(user);
    setCurrentMember(member || null);
    setRole(user.role);
    if (user.role === 'member' && member) {
      loadMemberData(member.id);
      setMemberTab('home');
    } else {
      loadAdminData();
      setAdminTab('overview');
    }
  };

  const handleLogout = () => {
    api.clearToken();
    setCurrentUser(null);
    setCurrentMember(null);
    setRole(null);
  };

  // Quick switch role from device bar
  const handleSwitchRole = async (targetRole: 'member' | 'admin') => {
    if (targetRole === 'admin') {
      try {
        const res = await api.login('vignesh', 'ironparadise@1234');
        handleLoginSuccess(res.user, res.member);
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const res = await api.login('rahul.sharma@gmail.com', 'rahul123');
        handleLoginSuccess(res.user, res.member);
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101010] flex flex-col items-center justify-center text-white">
        <div className="w-14 h-14 rounded-2xl bg-[#B7F34A] text-black font-black flex items-center justify-center text-xl shadow-lg shadow-[#B7F34A]/20 animate-pulse">
          IP
        </div>
        <div className="mt-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
          Loading IP FITNESS Engine...
        </div>
      </div>
    );
  }

  return (
    <DeviceFrame
      activeRole={role}
      onSwitchRole={handleSwitchRole}
      onOpenBuildGuide={() => setIsBuildGuideOpen(true)}
    >
      {/* If Not Logged In: Show Athletic Splash Screen */}
      {!currentUser ? (
        <SplashScreen
          settings={settings}
          onLoginSuccess={handleLoginSuccess}
          onExploreDemo={(demoRole) => handleSwitchRole(demoRole)}
        />
      ) : role === 'member' && currentMember ? (
        /* ================= MEMBER PORTAL ================= */
        <div className="flex-1 w-full flex flex-col justify-between relative bg-[#101010]">
          {/* Member Top Bar */}
          <div className="h-12 px-4 flex items-center justify-between border-b border-zinc-800/80 bg-[#141416]/90 backdrop-blur-md sticky top-0 z-30 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#B7F34A] text-black font-black flex items-center justify-center text-[10px]">
                IP
              </div>
              <span className="font-extrabold text-xs tracking-tight text-white uppercase">
                {settings?.gym_name || 'IP FITNESS'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#B7F34A] font-bold">
                {currentMember.member_code}
              </span>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Member Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            {memberTab === 'home' && (
              <MemberHome
                member={currentMember}
                settings={settings}
                announcements={announcements}
                recentAttendance={memberAttendance}
                onNavigateTab={(tab, progCat) => {
                  if (progCat) setSelectedProgramCategory(progCat);
                  setMemberTab(tab);
                }}
                onOpenPayModal={() => setMemberTab('payments')}
              />
            )}

            {memberTab === 'programs' && (
              <MemberPrograms
                member={currentMember}
                initialTab={selectedProgramCategory}
                onUpdateGoal={(goal) => {
                  api.updateMember(currentMember.id, { fitness_goal: goal });
                  setCurrentMember({ ...currentMember, fitness_goal: goal });
                }}
              />
            )}

            {memberTab === 'pass' && (
              <MemberPass
                member={currentMember}
                settings={settings}
                onCheckInSuccess={() => loadMemberData(currentMember.id)}
              />
            )}

            {memberTab === 'payments' && (
              <MemberPayments
                member={currentMember}
                plans={plans}
                payments={memberPayments}
                settings={settings}
                onPaymentSuccess={(newPay, updatedMem) => {
                  setActiveReceipt(newPay);
                  setCurrentMember(updatedMem);
                  loadMemberData(updatedMem.id);
                }}
                onViewReceipt={(pay) => setActiveReceipt(pay)}
              />
            )}

            {memberTab === 'attendance' && (
              <MemberAttendance
                member={currentMember}
                attendance={memberAttendance}
              />
            )}

            {memberTab === 'info' && (
              <MemberGymInfo settings={settings} />
            )}
          </div>

          {/* Member Fixed Bottom Tab Bar */}
          <div className="sticky bottom-0 inset-x-0 h-16 bg-[#141416]/95 backdrop-blur-md border-t border-zinc-800/80 grid grid-cols-5 items-center px-1 z-30 shrink-0">
            <button
              onClick={() => setMemberTab('home')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                memberTab === 'home' ? 'text-[#B7F34A]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-1">Home</span>
            </button>

            <button
              onClick={() => setMemberTab('programs')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                memberTab === 'programs' ? 'text-[#B7F34A]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Dumbbell className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-1">Programs</span>
            </button>

            <button
              onClick={() => setMemberTab('pass')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                memberTab === 'pass' ? 'text-[#B7F34A]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-1">Pass</span>
            </button>

            <button
              onClick={() => setMemberTab('payments')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                memberTab === 'payments' ? 'text-[#B7F34A]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-1">Pay Fee</span>
            </button>

            <button
              onClick={() => setMemberTab('info')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                memberTab === 'info' ? 'text-[#B7F34A]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-1">Gym</span>
            </button>
          </div>
        </div>
      ) : (
        /* ================= ADMIN OPERATIONS PORTAL ================= */
        <div className="flex-1 w-full flex flex-col justify-between relative bg-[#101010]">
          {/* Admin Top Bar */}
          <div className="h-12 px-4 flex items-center justify-between border-b border-zinc-800/80 bg-[#141416]/90 backdrop-blur-md sticky top-0 z-30 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#B7F34A] text-black font-black flex items-center justify-center text-[10px]">
                IP
              </div>
              <span className="font-extrabold text-xs tracking-tight text-white uppercase">
                ADMIN CONSOLE
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-400 hidden sm:inline">
                {currentUser.name}
              </span>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Admin Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            {adminTab === 'overview' && (
              <AdminOverview
                stats={adminStats}
                settings={settings}
                recentAttendance={todayAttendance}
                recentPayments={allPayments}
                onNavigateTab={setAdminTab}
                onOpenAddMember={() => setAdminTab('members')}
                onOpenRecordPayment={() => setAdminTab('payments')}
                onSettingsUpdate={(updated) => setSettings(updated)}
              />
            )}

            {adminTab === 'members' && (
              <AdminMembers
                members={allMembers}
                plans={plans}
                onMembersUpdated={loadAdminData}
                onRecordPaymentForMember={(mem) => {
                  setPreSelectedMemberForFee(mem);
                  setAdminTab('payments');
                }}
              />
            )}

            {adminTab === 'payments' && (
              <AdminPayments
                payments={allPayments}
                members={allMembers}
                plans={plans}
                preSelectedMember={preSelectedMemberForFee}
                onPaymentRecorded={loadAdminData}
                onViewReceipt={(pay) => setActiveReceipt(pay)}
                onClearPreSelectedMember={() => setPreSelectedMemberForFee(null)}
              />
            )}

            {adminTab === 'attendance' && (
              <AdminAttendance
                attendance={todayAttendance}
                members={allMembers}
                onAttendanceRecorded={loadAdminData}
                onRecordFeeForExpired={(mem) => {
                  setPreSelectedMemberForFee(mem);
                  setAdminTab('payments');
                }}
              />
            )}

            {adminTab === 'settings' && (
              <AdminSettings
                settings={settings}
                plans={plans}
                announcements={announcements}
                onSettingsUpdated={(up) => setSettings(up)}
                onPlansUpdated={loadAdminData}
                onAnnouncementsUpdated={loadAdminData}
              />
            )}

            {adminTab === 'reports' && (
              <AdminReports stats={adminStats} settings={settings} />
            )}
          </div>

          {/* Admin Fixed Bottom Navigation Tabs */}
          <div className="sticky bottom-0 inset-x-0 h-16 bg-[#141416]/95 backdrop-blur-md border-t border-zinc-800/80 grid grid-cols-6 items-center px-1 z-30 shrink-0">
            <button
              onClick={() => setAdminTab('overview')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                adminTab === 'overview' ? 'text-[#B7F34A]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-[9px] font-semibold mt-1">Ops</span>
            </button>

            <button
              onClick={() => setAdminTab('members')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                adminTab === 'members' ? 'text-[#B7F34A]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-[9px] font-semibold mt-1">Members</span>
            </button>

            <button
              onClick={() => setAdminTab('payments')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                adminTab === 'payments' ? 'text-[#B7F34A]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-[9px] font-semibold mt-1">Finances</span>
            </button>

            <button
              onClick={() => setAdminTab('attendance')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                adminTab === 'attendance' ? 'text-[#B7F34A]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span className="text-[9px] font-semibold mt-1">Scanner</span>
            </button>

            <button
              onClick={() => setAdminTab('reports')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                adminTab === 'reports' ? 'text-[#B7F34A]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-[9px] font-semibold mt-1">Reports</span>
            </button>

            <button
              onClick={() => setAdminTab('settings')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                adminTab === 'settings' ? 'text-[#B7F34A]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-[9px] font-semibold mt-1">Config</span>
            </button>
          </div>
        </div>
      )}

      {/* Receipts Modal */}
      <ReceiptModal
        payment={activeReceipt}
        settings={settings}
        onClose={() => setActiveReceipt(null)}
      />

      {/* Expo / Android APK Build Guide Modal */}
      <ExportBuildModal
        isOpen={isBuildGuideOpen}
        onClose={() => setIsBuildGuideOpen(false)}
      />
    </DeviceFrame>
  );
}
