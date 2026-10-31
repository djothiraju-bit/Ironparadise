import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserX,
  Edit2,
  Phone,
  Mail,
  Calendar,
  X,
  ChevronRight,
  Shield,
  CreditCard,
  QrCode,
} from 'lucide-react';
import { Member, MembershipPlan } from '../../types';
import { api } from '../../services/api';

interface AdminMembersProps {
  members: Member[];
  plans: MembershipPlan[];
  onMembersUpdated: () => void;
  onRecordPaymentForMember: (member: Member) => void;
}

export const AdminMembers: React.FC<AdminMembersProps> = ({
  members,
  plans,
  onMembersUpdated,
  onRecordPaymentForMember,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring_soon' | 'expired' | 'inactive'>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states for Add Member
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPlanId, setNewPlanId] = useState(plans[0]?.id || 'plan_monthly');
  const [newJoiningDate, setNewJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [newGender, setNewGender] = useState('Male');
  const [newBloodGroup, setNewBloodGroup] = useState('B+');
  const [newEmergencyContact, setNewEmergencyContact] = useState('');
  const [newEmergencyPhone, setNewEmergencyPhone] = useState('');
  const [newFitnessGoal, setNewFitnessGoal] = useState<'cardio' | 'fat_loss' | 'diet_plan' | 'bodybuilding'>('bodybuilding');
  const [newNotes, setNewNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states for Edit Member
  const [editMemberData, setEditMemberData] = useState<Partial<Member>>({});

  // Filter members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.member_code.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      m.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await api.createMember({
        name: newName,
        email: newEmail,
        phone: newPhone,
        plan_id: newPlanId,
        joining_date: newJoiningDate,
        gender: newGender,
        blood_group: newBloodGroup,
        emergency_contact: newEmergencyContact,
        emergency_phone: newEmergencyPhone,
        notes: newNotes,
        fitness_goal: newFitnessGoal,
      });

      setShowAddModal(false);
      // Reset fields
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      setNewEmergencyContact('');
      setNewEmergencyPhone('');
      setNewNotes('');
      onMembersUpdated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed adding member.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (member: Member) => {
    setSelectedMember(member);
    setEditMemberData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      plan_id: member.plan_id,
      expiry_date: member.expiry_date,
      status: member.status,
      emergency_contact: member.emergency_contact || '',
      emergency_phone: member.emergency_phone || '',
      notes: member.notes || '',
      fitness_goal: member.fitness_goal || 'bodybuilding',
    });
    setShowEditModal(true);
  };

  const handleSaveEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      await api.updateMember(selectedMember.id, editMemberData);
      setShowEditModal(false);
      setSelectedMember(null);
      onMembersUpdated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed updating member.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (memberId: string) => {
    try {
      await api.toggleMemberStatus(memberId);
      onMembersUpdated();
      if (selectedMember && selectedMember.id === memberId) {
        const updated = await api.getMember(memberId);
        setSelectedMember(updated);
      }
    } catch (err) {
      console.error('Failed toggling member status:', err);
    }
  };

  return (
    <div className="flex-1 w-full p-4 space-y-4 pb-24 text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white uppercase">
            Member Registry
          </h2>
          <p className="text-xs text-zinc-400">
            {members.length} Registered Gym Athletes
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="h-9 px-3.5 rounded-xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-sm shadow-[#B7F34A]/20 transition-all active:scale-95"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, ID (IP-1001), phone..."
          className="w-full h-10 pl-10 pr-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#B7F34A]"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto text-[11px] font-semibold no-scrollbar">
        {(['all', 'active', 'expiring_soon', 'expired', 'inactive'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors capitalize ${
              statusFilter === st
                ? 'bg-zinc-800 text-[#B7F34A]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Members List */}
      <div className="space-y-2">
        {filteredMembers.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 text-zinc-400 text-xs">
            No gym members found matching the filter criteria.
          </div>
        ) : (
          filteredMembers.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMember(m)}
              className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 text-[#B7F34A] font-mono font-black flex items-center justify-center text-xs shrink-0">
                  {m.member_code.replace('IP-', '')}
                </div>
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <span>{m.name}</span>
                    <span className="font-mono text-[10px] text-zinc-400">({m.member_code})</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-2">
                    <span>{m.plan_name}</span>
                    <span>·</span>
                    <span>Expires {m.expiry_date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                    m.status === 'active'
                      ? 'bg-emerald-950/80 border-[#B7F34A]/50 text-[#B7F34A]'
                      : m.status === 'expiring_soon'
                      ? 'bg-amber-950/80 border-amber-500/50 text-amber-400'
                      : m.status === 'expired'
                      ? 'bg-red-950/80 border-red-500/50 text-red-400'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}
                >
                  {m.status.replace('_', ' ')}
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Member Details Drawer */}
      {selectedMember && !showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#161618] border border-zinc-700 rounded-3xl p-5 shadow-2xl relative text-zinc-100 max-h-[85vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Member Card Header */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-[#B7F34A] text-black font-mono font-black flex items-center justify-center text-sm">
                {selectedMember.member_code}
              </div>
              <div>
                <h3 className="text-base font-black text-white">{selectedMember.name}</h3>
                <div className="text-xs text-zinc-400 flex items-center gap-2">
                  <span>{selectedMember.plan_name}</span>
                  <span>·</span>
                  <span className="capitalize font-bold text-[#B7F34A]">{selectedMember.status}</span>
                </div>
              </div>
            </div>

            {/* Profile Data Grid */}
            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-medium">Phone</span>
                <span className="font-semibold text-white">{selectedMember.phone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-medium">Email</span>
                <span className="font-semibold text-zinc-300 truncate block">{selectedMember.email}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-medium">Joined On</span>
                <span className="font-semibold text-zinc-300">{selectedMember.joining_date}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-medium">Expiry Date</span>
                <span className="font-bold text-[#B7F34A]">{selectedMember.expiry_date}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-medium">Fee</span>
                <span className="font-bold text-white">₹{selectedMember.fee_inr}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-medium">Gender / Blood</span>
                <span className="font-semibold text-zinc-300">{selectedMember.gender || 'N/A'} · {selectedMember.blood_group || 'N/A'}</span>
              </div>
            </div>

            {/* Emergency & Notes */}
            {selectedMember.emergency_contact && (
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs">
                <span className="text-[10px] uppercase text-zinc-400 font-bold block mb-0.5">
                  Emergency Contact
                </span>
                <p className="text-zinc-200">{selectedMember.emergency_contact} ({selectedMember.emergency_phone || 'No phone'})</p>
              </div>
            )}

            {selectedMember.notes && (
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs">
                <span className="text-[10px] uppercase text-zinc-400 font-bold block mb-0.5">
                  Trainer Notes
                </span>
                <p className="text-zinc-300">{selectedMember.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  onRecordPaymentForMember(selectedMember);
                  setSelectedMember(null);
                }}
                className="h-10 rounded-xl bg-[#B7F34A] text-black font-extrabold text-xs flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Record Fee</span>
              </button>

              <button
                onClick={() => openEditModal(selectedMember)}
                className="h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#B7F34A]" />
                <span>Edit / Renew</span>
              </button>
            </div>

            <button
              onClick={() => handleToggleStatus(selectedMember.id)}
              className="w-full py-2 text-[11px] font-semibold text-zinc-400 hover:text-red-400 transition-colors"
            >
              {selectedMember.status === 'inactive' ? 'Reactivate Member Account' : 'Deactivate Member Account'}
            </button>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#161618] border border-zinc-700 rounded-3xl p-5 shadow-2xl relative text-zinc-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-black text-white uppercase">Add New Gym Member</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="my-2 p-2.5 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-3 pt-2 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Athlete Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Manav Sharma"
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="athlete@gmail.com"
                    className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Membership Plan *</label>
                <select
                  value={newPlanId}
                  onChange={(e) => setNewPlanId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.duration_months} mo) — ₹{p.fee_inr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={newJoiningDate}
                    onChange={(e) => setNewJoiningDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Emergency Name</label>
                  <input
                    type="text"
                    value={newEmergencyContact}
                    onChange={(e) => setNewEmergencyContact(e.target.value)}
                    placeholder="Relation & Name"
                    className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    value={newEmergencyPhone}
                    onChange={(e) => setNewEmergencyPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  Primary Fitness Track (Cardio / Fat Loss / Diet / Bodybuilding)
                </label>
                <select
                  value={newFitnessGoal}
                  onChange={(e) => setNewFitnessGoal(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-semibold"
                >
                  <option value="cardio">1. Cardio (HIIT & Heart-Rate Endurance)</option>
                  <option value="fat_loss">2. Fat Loss (Caloric Deficit & Step Targets)</option>
                  <option value="diet_plan">3. Diet Plan (High-Protein Indian Nutrition)</option>
                  <option value="bodybuilding">4. Bodybuilding (Hypertrophy & PPL Splits)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Trainer / Medical Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Goals, injuries, diet specifications..."
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-extrabold text-xs flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Creating Member...' : 'Register & Generate ID'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#161618] border border-zinc-700 rounded-3xl p-5 shadow-2xl relative text-zinc-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-black text-white uppercase">
                Edit Member: {selectedMember.member_code}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMember} className="space-y-3 pt-2 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editMemberData.name || ''}
                  onChange={(e) => setEditMemberData({ ...editMemberData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={editMemberData.phone || ''}
                    onChange={(e) => setEditMemberData({ ...editMemberData, phone: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={editMemberData.email || ''}
                    onChange={(e) => setEditMemberData({ ...editMemberData, email: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Membership Plan</label>
                <select
                  value={editMemberData.plan_id || ''}
                  onChange={(e) => {
                    const plan = plans.find((p) => p.id === e.target.value);
                    if (plan) {
                      // auto update expiry
                      const exp = new Date();
                      exp.setMonth(exp.getMonth() + plan.duration_months);
                      setEditMemberData({
                        ...editMemberData,
                        plan_id: plan.id,
                        plan_name: plan.name,
                        fee_inr: plan.fee_inr,
                        expiry_date: exp.toISOString().split('T')[0],
                      });
                    }
                  }}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.duration_months} mo) — ₹{p.fee_inr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Expiry Date (YYYY-MM-DD)</label>
                <input
                  type="date"
                  required
                  value={editMemberData.expiry_date || ''}
                  onChange={(e) => setEditMemberData({ ...editMemberData, expiry_date: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Status Override</label>
                <select
                  value={editMemberData.status || 'active'}
                  onChange={(e) => setEditMemberData({ ...editMemberData, status: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                >
                  <option value="active">Active</option>
                  <option value="expiring_soon">Expiring Soon</option>
                  <option value="expired">Expired</option>
                  <option value="inactive">Inactive / Deactivated</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  Primary Fitness Track (Cardio / Fat Loss / Diet / Bodybuilding)
                </label>
                <select
                  value={editMemberData.fitness_goal || 'bodybuilding'}
                  onChange={(e) => setEditMemberData({ ...editMemberData, fitness_goal: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-semibold"
                >
                  <option value="cardio">1. Cardio (HIIT & Heart-Rate Endurance)</option>
                  <option value="fat_loss">2. Fat Loss (Caloric Deficit & Step Targets)</option>
                  <option value="diet_plan">3. Diet Plan (High-Protein Indian Nutrition)</option>
                  <option value="bodybuilding">4. Bodybuilding (Hypertrophy & PPL Splits)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-extrabold text-xs flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
