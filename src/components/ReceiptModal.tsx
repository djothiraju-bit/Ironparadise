import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, Dumbbell, Download } from 'lucide-react';
import { Payment, GymSettings } from '../types';

interface ReceiptModalProps {
  payment: Payment | null;
  settings: GymSettings | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  settings,
  onClose,
}) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(payment.paid_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#161618] border border-zinc-700/80 rounded-3xl p-6 shadow-2xl relative text-zinc-100 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Printable Invoice Container */}
        <div id="gym-receipt-content" className="space-y-4 pt-1">
          {/* Gym Header */}
          <div className="text-center pb-4 border-b border-zinc-800">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#B7F34A] text-black mb-2">
              <Dumbbell className="w-5 h-5 -rotate-45 font-black" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white uppercase">
              {settings?.gym_name || 'IP FITNESS'}
            </h2>
            <p className="text-[10px] uppercase font-bold text-[#B7F34A] tracking-widest">
              {settings?.tagline || 'TRAIN HARD. STAY CONSISTENT.'}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1 max-w-xs mx-auto">
              {settings?.address ? `${settings.address}, ${settings.city}` : 'Radhakrishnan Nagar, Puducherry, 605009'}
            </p>
            <p className="text-[10px] text-zinc-400">
              Tel: {settings?.phone || '+91 97913 61041'} · GSTIN: 07AAACI1928K1Z5
            </p>
          </div>

          {/* Receipt Status Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <div>
              <div className="text-[10px] uppercase font-semibold text-zinc-400">Official Receipt</div>
              <div className="text-xs font-bold font-mono text-white">{payment.receipt_no}</div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-[#B7F34A]/50 text-[#B7F34A] text-xs font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>PAID</span>
            </div>
          </div>

          {/* Member Billed-To Info */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/80">
            <div>
              <span className="text-[10px] uppercase font-medium text-zinc-400 block">Member Name</span>
              <span className="font-semibold text-white">{payment.member_name}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-medium text-zinc-400 block">Member ID</span>
              <span className="font-mono font-bold text-[#B7F34A]">{payment.member_code}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-medium text-zinc-400 block">Payment Date</span>
              <span className="text-zinc-300 tabular-nums">{formattedDate}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-medium text-zinc-400 block">Payment Mode</span>
              <span className="capitalize font-semibold text-zinc-200">
                {payment.method === 'razorpay' ? 'Razorpay Online' : payment.method.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Transaction Line Item */}
          <div className="border border-zinc-800 rounded-xl overflow-hidden">
            <div className="bg-zinc-900/90 px-3 py-2 text-[11px] font-bold text-zinc-400 flex justify-between">
              <span>MEMBERSHIP SUBSCRIPTION</span>
              <span>AMOUNT</span>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex justify-between items-start text-xs">
                <div>
                  <div className="font-semibold text-white">{payment.plan_name}</div>
                  <div className="text-[10px] text-zinc-400">Gym Access & Facility Membership</div>
                </div>
                <div className="font-bold text-white tabular-nums">
                  ₹{payment.amount_inr.toLocaleString('en-IN')}
                </div>
              </div>

              {payment.payment_id && (
                <div className="text-[10px] text-zinc-400 font-mono pt-1 border-t border-zinc-800/60 truncate">
                  Txn ID: {payment.payment_id}
                </div>
              )}
            </div>

            <div className="bg-zinc-900 p-3 border-t border-zinc-800 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-white uppercase">Total Paid</span>
                <span className="text-[10px] text-zinc-400 block">(Inclusive of all applicable taxes)</span>
              </div>
              <div className="text-lg font-black text-[#B7F34A] tabular-nums">
                ₹{payment.amount_inr.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Digital Signature & Verification Seal */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-[#B7F34A]" />
              <span>Verified System Digital Receipt</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-zinc-300">IP FITNESS ACADEMY</span>
              <span className="block text-zinc-400">Authorized Signatory</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-[#B7F34A]" />
            <span>Print / Save Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 h-11 rounded-xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
