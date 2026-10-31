import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Receipt,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Clock,
  Smartphone,
  Building,
  AlertCircle,
  X,
} from 'lucide-react';
import { Member, MembershipPlan, Payment, GymSettings } from '../../types';
import { api } from '../../services/api';

interface MemberPaymentsProps {
  member: Member;
  plans: MembershipPlan[];
  payments: Payment[];
  settings: GymSettings | null;
  onPaymentSuccess: (newPayment: Payment, updatedMember: Member) => void;
  onViewReceipt: (payment: Payment) => void;
}

export const MemberPayments: React.FC<MemberPaymentsProps> = ({
  member,
  plans,
  payments,
  settings,
  onPaymentSuccess,
  onViewReceipt,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(member.plan_id || plans[0]?.id || '');
  const [checkoutStep, setCheckoutStep] = useState<'plans' | 'razorpay_modal' | 'processing' | 'success'>('plans');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiVpa, setUpiVpa] = useState('user@okaxis');
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  // Initiate Razorpay checkout order
  const handleStartCheckout = async () => {
    if (!selectedPlan) return;
    setErrorMsg(null);
    setProcessing(true);
    try {
      // Step 1: Create order on backend
      const order = await api.createRazorpayOrder(member.id, selectedPlan.id);
      setCheckoutStep('razorpay_modal');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initialize payment gateway.');
    } finally {
      setProcessing(false);
    }
  };

  // Complete payment simulation and verify on backend
  const handleCompleteRazorpay = async () => {
    if (!selectedPlan) return;
    setProcessing(true);
    setErrorMsg(null);
    try {
      const orderId = `order_rzp_${Date.now()}`;
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      // Generate standard test signature
      const signature = `sig_test_${Date.now()}`;

      // Call backend verification
      const verifyRes = await api.verifyRazorpayPayment({
        order_id: orderId,
        payment_id: paymentId,
        signature,
        member_id: member.id,
        plan_id: selectedPlan.id,
      });

      setCheckoutStep('success');
      onPaymentSuccess(verifyRes.payment, verifyRes.member);
    } catch (err: any) {
      setErrorMsg(err.message || 'Signature verification failed.');
      setCheckoutStep('plans');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex-1 w-full p-4 space-y-5 pb-24 text-zinc-100">
      {/* Header */}
      <div className="pt-1">
        <h2 className="text-xl font-black tracking-tight text-white uppercase">
          Membership & Fees
        </h2>
        <p className="text-xs text-zinc-400">
          Secure online renewal powered by Razorpay (INR)
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Current Subscription Status Mini-card */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase font-bold text-zinc-400">Current Plan</div>
          <div className="text-sm font-black text-white">{member.plan_name}</div>
          <div className="text-[11px] text-zinc-400">
            Valid until {new Date(member.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>

        <div className="text-right">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
              member.status === 'active'
                ? 'bg-emerald-950/80 border-[#B7F34A]/50 text-[#B7F34A]'
                : member.status === 'expiring_soon'
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-400'
                : 'bg-red-950/80 border-red-500/50 text-red-400'
            }`}
          >
            {member.status.replace('_', ' ')}
          </span>
          <div className="text-xs font-mono text-zinc-400 mt-1">₹{member.fee_inr} / mo</div>
        </div>
      </div>

      {/* Choose Membership Plan */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Select Membership Duration
          </span>
          <span className="text-[10px] text-[#B7F34A] font-semibold">100% Tax Deductible</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const monthlyEquiv = Math.round(plan.fee_inr / plan.duration_months);

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-r from-zinc-900 to-[#1b1e16] border-[#B7F34A] shadow-md shadow-[#B7F34A]/10'
                    : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Badge if available */}
                {plan.badge && (
                  <div className="absolute top-0 right-0 bg-[#B7F34A] text-black text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg">
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#B7F34A] bg-[#B7F34A]' : 'border-zinc-600'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                      <span className="font-bold text-white text-sm">{plan.name}</span>
                    </div>

                    <div className="text-[11px] text-zinc-400 mt-1 pl-6">
                      {plan.duration_months} Month{plan.duration_months > 1 ? 's' : ''} Unlimited Access
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-white tabular-nums">
                      ₹{plan.fee_inr.toLocaleString('en-IN')}
                    </div>
                    {plan.duration_months > 1 && (
                      <div className="text-[10px] text-[#B7F34A] font-medium tabular-nums">
                        ₹{monthlyEquiv.toLocaleString('en-IN')}/mo
                      </div>
                    )}
                  </div>
                </div>

                {/* Features bullet list */}
                {plan.features && plan.features.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-zinc-800/80 pl-6 space-y-1">
                    {plan.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-[#B7F34A] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Proceed Button */}
        {selectedPlan && (
          <button
            onClick={handleStartCheckout}
            disabled={processing}
            className="w-full h-13 mt-2 rounded-2xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#B7F34A]/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay ₹{selectedPlan.fee_inr.toLocaleString('en-IN')} via Razorpay</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>

      {/* Payment History Section */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Payment History & Receipts
          </span>
          <span className="text-[11px] text-zinc-400 font-mono">
            {payments.length} Transaction{payments.length === 1 ? '' : 's'}
          </span>
        </div>

        {payments.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 text-zinc-400 text-xs">
            No previous payment records found.
          </div>
        ) : (
          <div className="space-y-2">
            {payments.map((p) => (
              <div
                key={p.id}
                onClick={() => onViewReceipt(p)}
                className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 text-[#B7F34A] flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white group-hover:text-[#B7F34A] transition-colors">
                      {p.plan_name}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      {new Date(p.paid_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      · <span className="font-mono text-zinc-400">{p.receipt_no}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-white tabular-nums">
                    ₹{p.amount_inr.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] font-semibold text-[#B7F34A] uppercase">
                    {p.method}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Razorpay Test Modal Simulation */}
      {checkoutStep === 'razorpay_modal' && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#18181b] border border-blue-500/40 rounded-3xl p-5 shadow-2xl relative text-zinc-100 animate-in fade-in zoom-in-95">
            {/* Razorpay Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  ₹
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Razorpay Checkout</span>
                    <span className="text-[9px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded border border-blue-800">
                      Sandbox
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400">Merchant: {settings?.gym_name || 'IP FITNESS'}</div>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep('plans')}
                className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Amount Summary */}
            <div className="my-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-zinc-400 block">{selectedPlan.name} Subscription</span>
                <span className="text-xs text-zinc-300 font-mono">{member.member_code} · {member.name}</span>
              </div>
              <div className="text-lg font-black text-white tabular-nums">
                ₹{selectedPlan.fee_inr.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Payment Options Selection */}
            <div className="space-y-2 text-xs">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Select Indian Payment Option
              </label>

              {/* UPI */}
              <div
                onClick={() => setSelectedMethod('upi')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'upi'
                    ? 'bg-blue-950/40 border-blue-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-bold text-xs">UPI / QR (Instant)</div>
                    <div className="text-[10px] text-zinc-400">GPay, PhonePe, Paytm, BHIM</div>
                  </div>
                </div>
                <input
                  type="radio"
                  readOnly
                  checked={selectedMethod === 'upi'}
                  className="accent-blue-500"
                />
              </div>

              {selectedMethod === 'upi' && (
                <div className="p-2.5 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-1.5">
                  <label className="text-[10px] text-zinc-400 block">Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    placeholder="mobile@upi"
                    className="w-full h-8 px-2.5 rounded-lg bg-black border border-zinc-700 text-xs text-white font-mono"
                  />
                </div>
              )}

              {/* Cards */}
              <div
                onClick={() => setSelectedMethod('card')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'card'
                    ? 'bg-blue-950/40 border-blue-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-bold text-xs">Debit / Credit Card</div>
                    <div className="text-[10px] text-zinc-400">Visa, Mastercard, RuPay</div>
                  </div>
                </div>
                <input
                  type="radio"
                  readOnly
                  checked={selectedMethod === 'card'}
                  className="accent-blue-500"
                />
              </div>

              {/* Netbanking */}
              <div
                onClick={() => setSelectedMethod('netbanking')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedMethod === 'netbanking'
                    ? 'bg-blue-950/40 border-blue-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-bold text-xs">Netbanking</div>
                    <div className="text-[10px] text-zinc-400">HDFC, SBI, ICICI, Axis</div>
                  </div>
                </div>
                <input
                  type="radio"
                  readOnly
                  checked={selectedMethod === 'netbanking'}
                  className="accent-blue-500"
                />
              </div>
            </div>

            {/* Submit Payment CTA */}
            <div className="mt-5 space-y-2">
              <button
                onClick={handleCompleteRazorpay}
                disabled={processing}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-98 transition-all disabled:opacity-50"
              >
                {processing ? (
                  <span>Verifying Razorpay Signature...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Pay ₹{selectedPlan.fee_inr.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-zinc-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>256-bit SSL Encrypted & HMAC Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Confirmation Toast */}
      {checkoutStep === 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#161618] border border-[#B7F34A]/50 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#B7F34A]/10 border-2 border-[#B7F34A] text-[#B7F34A] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Payment Successful!</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Your membership for <strong className="text-white">{selectedPlan.name}</strong> is now activated.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
              New Expiry Date: <strong className="text-[#B7F34A]">{member.expiry_date}</strong>
            </div>

            <button
              onClick={() => setCheckoutStep('plans')}
              className="w-full h-11 rounded-xl bg-[#B7F34A] text-black font-extrabold text-xs transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
