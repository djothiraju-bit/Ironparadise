import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  X,
  Printer,
  Smartphone,
  Banknote,
  Building,
} from 'lucide-react';
import { Payment, Member, MembershipPlan } from '../../types';
import { api } from '../../services/api';

interface AdminPaymentsProps {
  payments: Payment[];
  members: Member[];
  plans: MembershipPlan[];
  preSelectedMember: Member | null;
  onPaymentRecorded: () => void;
  onViewReceipt: (payment: Payment) => void;
  onClearPreSelectedMember: () => void;
}

export const AdminPayments: React.FC<AdminPaymentsProps> = ({
  payments,
  members,
  plans,
  preSelectedMember,
  onPaymentRecorded,
  onViewReceipt,
  onClearPreSelectedMember,
}) => {
  const [showRecordModal, setShowRecordModal] = useState(Boolean(preSelectedMember));
  const [selectedMemberId, setSelectedMemberId] = useState(preSelectedMember?.id || members[0]?.id || '');
  const [selectedPlanId, setSelectedPlanId] = useState(preSelectedMember?.plan_id || plans[0]?.id || '');
  const [amountInr, setAmountInr] = useState<number>(plans[0]?.fee_inr || 1800);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'bank_transfer'>('cash');
  const [notes, setNotes] = useState('');
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | 'razorpay' | 'upi' | 'cash'>('all');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If preselected member arrives
  React.useEffect(() => {
    if (preSelectedMember) {
      setSelectedMemberId(preSelectedMember.id);
      setSelectedPlanId(preSelectedMember.plan_id);
      setAmountInr(preSelectedMember.fee_inr);
      setShowRecordModal(true);
    }
  }, [preSelectedMember]);

  // When plan changes in modal, update fee
  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = plans.find((p) => p.id === planId);
    if (plan) setAmountInr(plan.fee_inr);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !amountInr) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.recordOfflinePayment({
        member_id: selectedMemberId,
        plan_id: selectedPlanId,
        amount_inr: amountInr,
        method: paymentMethod,
        notes,
      });

      setShowRecordModal(false);
      onClearPreSelectedMember();
      onPaymentRecorded();
      onViewReceipt(res.payment);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed recording payment.');
    } finally {
      setLoading(false);
    }
  };

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.receipt_no.toLowerCase().includes(search.toLowerCase()) ||
      p.member_name.toLowerCase().includes(search.toLowerCase()) ||
      p.member_code.toLowerCase().includes(search.toLowerCase());

    const matchesMethod = methodFilter === 'all' || p.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="flex-1 w-full p-4 space-y-4 pb-24 text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white uppercase">
            Payment Ledger
          </h2>
          <p className="text-xs text-zinc-400">
            Cash, UPI & Razorpay transactions
          </p>
        </div>

        <button
          onClick={() => setShowRecordModal(true)}
          className="h-9 px-3.5 rounded-xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-sm shadow-[#B7F34A]/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Fee</span>
        </button>
      </div>

      {/* Search & Method Tabs */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search receipt no (IPF-REC-...), member..."
            className="w-full h-10 pl-10 pr-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#B7F34A]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] font-semibold">
          {(['all', 'razorpay', 'upi', 'cash'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`flex-1 py-1.5 rounded-lg transition-colors capitalize ${
                methodFilter === m
                  ? 'bg-zinc-800 text-[#B7F34A]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {m === 'razorpay' ? 'Online' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-2">
        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 text-zinc-400 text-xs">
            No payments found matching criteria.
          </div>
        ) : (
          filteredPayments.map((p) => (
            <div
              key={p.id}
              onClick={() => onViewReceipt(p)}
              className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 text-[#B7F34A] flex items-center justify-center shrink-0">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <span>{p.member_name}</span>
                    <span className="font-mono text-[10px] text-zinc-400">({p.member_code})</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    {p.plan_name} · <span className="font-mono text-zinc-400">{p.receipt_no}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-black text-white tabular-nums">
                  ₹{p.amount_inr.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] font-semibold text-[#B7F34A] uppercase flex items-center justify-end gap-1">
                  <span>{p.method}</span>
                  <span className="text-zinc-400 font-normal">· {new Date(p.paid_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Record Offline Fee Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#161618] border border-zinc-700 rounded-3xl p-5 shadow-2xl relative text-zinc-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-black text-white uppercase">Record Gym Fee Collection</h3>
              <button
                onClick={() => {
                  setShowRecordModal(false);
                  onClearPreSelectedMember();
                }}
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

            <form onSubmit={handleRecordPayment} className="space-y-3 pt-2 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Select Member *</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => {
                    const mId = e.target.value;
                    setSelectedMemberId(mId);
                    const mem = members.find((m) => m.id === mId);
                    if (mem) {
                      setSelectedPlanId(mem.plan_id);
                      setAmountInr(mem.fee_inr);
                    }
                  }}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.member_code} - {m.name} ({m.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Membership Plan</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => handlePlanChange(e.target.value)}
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
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Amount Collected (INR) *</label>
                <input
                  type="number"
                  required
                  value={amountInr}
                  onChange={(e) => setAmountInr(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Payment Method *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`h-9 rounded-xl border flex items-center justify-center gap-1.5 font-bold ${
                      paymentMethod === 'cash'
                        ? 'bg-[#B7F34A] text-black border-[#B7F34A]'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Cash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`h-9 rounded-xl border flex items-center justify-center gap-1.5 font-bold ${
                      paymentMethod === 'upi'
                        ? 'bg-[#B7F34A] text-black border-[#B7F34A]'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`h-9 rounded-xl border flex items-center justify-center gap-1.5 font-bold ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-[#B7F34A] text-black border-[#B7F34A]'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Bank</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Notes / Transaction Reference</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Paid in cash at front counter"
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400">
                ⚡ Automatically extends member expiry date and issues an official digital receipt.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-extrabold text-xs flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Recording...' : 'Generate Receipt & Extend Expiry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
