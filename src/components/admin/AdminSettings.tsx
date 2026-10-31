import React, { useState } from 'react';
import {
  Settings,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Bell,
  Plus,
  Trash2,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Layers,
  Save,
} from 'lucide-react';
import { GymSettings, MembershipPlan, Announcement } from '../../types';
import { api } from '../../services/api';

interface AdminSettingsProps {
  settings: GymSettings | null;
  plans: MembershipPlan[];
  announcements: Announcement[];
  onSettingsUpdated: (updated: GymSettings) => void;
  onPlansUpdated: () => void;
  onAnnouncementsUpdated: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  plans,
  announcements,
  onSettingsUpdated,
  onPlansUpdated,
  onAnnouncementsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'plans' | 'announcements'>('profile');
  const [formData, setFormData] = useState<GymSettings>(
    settings || {
      gym_name: 'IRON PARADISE Unisex Fitness',
      tagline: 'TRAIN HARD. STAY CONSISTENT.',
      is_open: true,
      status_message: 'Open Now',
      opening_time: '05:30 AM',
      closing_time: '10:30 PM',
      sunday_timing: '06:00 AM - 01:00 PM',
      address: 'Radhakrishnan Nagar',
      city: 'Puducherry',
      pincode: '605009',
      phone: '+91 97913 61041',
      whatsapp: '+91 97913 61041',
      email: 'contact@ipfitness.in',
      upi_id: 'ipfitness@okhdfcbank',
      map_query: 'IRON PARADISE Unisex Fitness, Radhakrishnan Nagar, Puducherry, 605009',
      allow_member_registration: true,
    }
  );

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Announcement form
  const [ancTitle, setAncTitle] = useState('');
  const [ancContent, setAncContent] = useState('');
  const [ancPriority, setAncPriority] = useState<'normal' | 'urgent'>('normal');

  // Plan editor form
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await api.updateSettings(formData);
      onSettingsUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed saving gym settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ancTitle || !ancContent) return;
    try {
      await api.createAnnouncement({
        title: ancTitle,
        content: ancContent,
        priority: ancPriority,
        author: 'Gym Director',
      });
      setAncTitle('');
      setAncContent('');
      onAnnouncementsUpdated();
    } catch (err) {
      console.error('Failed creating announcement:', err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await api.deleteAnnouncement(id);
      onAnnouncementsUpdated();
    } catch (err) {
      console.error('Failed deleting announcement:', err);
    }
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      await api.savePlan(editingPlan);
      setEditingPlan(null);
      onPlansUpdated();
    } catch (err) {
      console.error('Failed saving plan:', err);
    }
  };

  return (
    <div className="flex-1 w-full p-4 space-y-4 pb-24 text-zinc-100">
      {/* Header */}
      <div className="pt-1">
        <h2 className="text-xl font-black tracking-tight text-white uppercase">
          Gym Configuration
        </h2>
        <p className="text-xs text-zinc-400">
          Timings, address, membership prices & broadcasts
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-1.5 rounded-lg transition-colors ${
            activeTab === 'profile' ? 'bg-zinc-800 text-[#B7F34A]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Gym Details
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex-1 py-1.5 rounded-lg transition-colors ${
            activeTab === 'plans' ? 'bg-zinc-800 text-[#B7F34A]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Plans & Fees
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex-1 py-1.5 rounded-lg transition-colors ${
            activeTab === 'announcements' ? 'bg-zinc-800 text-[#B7F34A]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Announcements
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-[#B7F34A]/60 text-[#B7F34A] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Gym configuration saved successfully!</span>
        </div>
      )}

      {/* Profile & Timings Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          {/* General Gym Identity */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
              Gym Identity & Branding
            </span>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Official Gym Name</label>
              <input
                type="text"
                required
                value={formData.gym_name}
                onChange={(e) => setFormData({ ...formData, gym_name: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
              <div>
                <span className="font-bold text-white block text-xs">Allow Member Self-Registration</span>
                <span className="text-[10px] text-zinc-400">Athletes can create accounts via mobile app</span>
              </div>
              <input
                type="checkbox"
                checked={formData.allow_member_registration}
                onChange={(e) => setFormData({ ...formData, allow_member_registration: e.target.checked })}
                className="w-5 h-5 accent-[#B7F34A] rounded"
              />
            </div>
          </div>

          {/* Operating Hours */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
              Operating Hours & Timings
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Weekday Opening</label>
                <input
                  type="text"
                  value={formData.opening_time}
                  onChange={(e) => setFormData({ ...formData, opening_time: e.target.value })}
                  placeholder="05:30 AM"
                  className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Weekday Closing</label>
                <input
                  type="text"
                  value={formData.closing_time}
                  onChange={(e) => setFormData({ ...formData, closing_time: e.target.value })}
                  placeholder="10:30 PM"
                  className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Sunday Schedule</label>
              <input
                type="text"
                value={formData.sunday_timing}
                onChange={(e) => setFormData({ ...formData, sunday_timing: e.target.value })}
                placeholder="06:00 AM - 01:00 PM"
                className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono"
              />
            </div>
          </div>

          {/* Address & Contact */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
              Facility Address & Support
            </span>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Physical Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Postal Code (PIN)</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Reception Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Gym WhatsApp Number</label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Official Gym UPI ID (for Desk QR)</label>
              <input
                type="text"
                value={formData.upi_id}
                onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
                placeholder="ipfitness@okhdfcbank"
                className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full h-12 rounded-xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-extrabold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-[#B7F34A]/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Gym Profile & Timings'}</span>
          </button>
        </form>
      )}

      {/* Plans & Fees Management Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Configured Membership Plans
            </span>
          </div>

          <div className="space-y-2">
            {plans.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{p.name}</span>
                    {p.badge && (
                      <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-[#B7F34A] text-[9px] font-bold">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    Duration: {p.duration_months} Month{p.duration_months > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-white tabular-nums">
                      ₹{p.fee_inr.toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[9px] text-[#B7F34A]">
                      ₹{Math.round(p.fee_inr / p.duration_months)}/mo
                    </span>
                  </div>

                  <button
                    onClick={() => setEditingPlan(p)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Plan Modal */}
          {editingPlan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-sm bg-[#161618] border border-zinc-700 rounded-3xl p-5 shadow-2xl relative text-zinc-100">
                <h3 className="text-sm font-black text-white uppercase mb-3">
                  Edit Plan: {editingPlan.name}
                </h3>

                <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Plan Name</label>
                    <input
                      type="text"
                      required
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Duration (Months)</label>
                      <input
                        type="number"
                        required
                        value={editingPlan.duration_months}
                        onChange={(e) => setEditingPlan({ ...editingPlan, duration_months: parseInt(e.target.value, 10) || 1 })}
                        className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Total Fee (INR)</label>
                      <input
                        type="number"
                        required
                        value={editingPlan.fee_inr}
                        onChange={(e) => setEditingPlan({ ...editingPlan, fee_inr: parseFloat(e.target.value) || 0 })}
                        className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Badge (Optional)</label>
                    <input
                      type="text"
                      value={editingPlan.badge || ''}
                      onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                      placeholder="e.g. Popular, Best Value"
                      className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingPlan(null)}
                      className="flex-1 h-10 rounded-xl bg-zinc-800 text-zinc-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-10 rounded-xl bg-[#B7F34A] text-black font-extrabold"
                    >
                      Save Plan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {/* Create Announcement Form */}
          <form onSubmit={handleCreateAnnouncement} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
              Broadcast Gym Notice to All Members
            </span>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Notice Title</label>
              <input
                type="text"
                required
                value={ancTitle}
                onChange={(e) => setAncTitle(e.target.value)}
                placeholder="e.g. Special Holiday Hours / Maintenance"
                className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Message Content</label>
              <textarea
                rows={2}
                required
                value={ancContent}
                onChange={(e) => setAncContent(e.target.value)}
                placeholder="Full details visible on member dashboard..."
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-zinc-400">Priority:</label>
                <select
                  value={ancPriority}
                  onChange={(e) => setAncPriority(e.target.value as any)}
                  className="h-8 px-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs"
                >
                  <option value="normal">Normal Notice</option>
                  <option value="urgent">Urgent Warning Banner</option>
                </select>
              </div>

              <button
                type="submit"
                className="h-9 px-4 rounded-xl bg-[#B7F34A] text-black font-extrabold text-xs flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Publish Notice</span>
              </button>
            </div>
          </form>

          {/* List of active announcements */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1 block">
              Active Member Broadcasts ({announcements.length})
            </span>

            {announcements.map((a) => (
              <div
                key={a.id}
                className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start justify-between text-xs gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{a.title}</span>
                    {a.priority === 'urgent' && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 text-[9px] font-bold">
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">{a.content}</p>
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    Posted by {a.author} · {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteAnnouncement(a.id)}
                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
