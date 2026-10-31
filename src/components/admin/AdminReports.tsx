import React from 'react';
import {
  TrendingUp,
  Download,
  Printer,
  FileSpreadsheet,
  PieChart,
  Calendar,
  CreditCard,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { SummaryStats, GymSettings } from '../../types';

interface AdminReportsProps {
  stats: SummaryStats | null;
  settings: GymSettings | null;
}

export const AdminReports: React.FC<AdminReportsProps> = ({ stats, settings }) => {
  const downloadCsv = (type: 'members' | 'payments') => {
    window.open(`/api/reports/export-csv?type=${type}`, '_blank');
  };

  const handlePrintAudit = () => {
    window.print();
  };

  const totalRev = stats?.totalRevenue || 1;
  const razorpayShare = Math.round(((stats?.paymentMethods.razorpay || 0) / totalRev) * 100);
  const upiShare = Math.round(((stats?.paymentMethods.upi || 0) / totalRev) * 100);
  const cashShare = Math.round(((stats?.paymentMethods.cash || 0) / totalRev) * 100);

  return (
    <div className="flex-1 w-full p-4 space-y-4 pb-24 text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white uppercase">
            Financial & Member Reports
          </h2>
          <p className="text-xs text-zinc-400">
            Export CSVs, revenue audits, and subscription metrics
          </p>
        </div>

        <button
          onClick={handlePrintAudit}
          className="h-9 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-[#B7F34A]" />
          <span>Print Audit</span>
        </button>
      </div>

      {/* Revenue KPI Summary */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
          Revenue Breakdown (INR)
        </span>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Total Lifetime</span>
            <div className="text-xl font-black text-white tabular-nums mt-0.5">
              ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-zinc-400">All payment channels</span>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Current Month</span>
            <div className="text-xl font-black text-[#B7F34A] tabular-nums mt-0.5">
              ₹{(stats?.thisMonthRevenue || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-zinc-400">Recorded collections</span>
          </div>
        </div>

        {/* Channel Distribution Bars */}
        <div className="space-y-2 pt-2 border-t border-zinc-800">
          <span className="text-[11px] text-zinc-400 block font-medium">Payment Channel Share</span>

          <div className="w-full h-3 rounded-full bg-zinc-950 flex overflow-hidden">
            <div
              style={{ width: `${razorpayShare}%` }}
              className="bg-blue-500 h-full"
              title={`Razorpay: ${razorpayShare}%`}
            />
            <div
              style={{ width: `${upiShare}%` }}
              className="bg-emerald-500 h-full"
              title={`UPI: ${upiShare}%`}
            />
            <div
              style={{ width: `${cashShare}%` }}
              className="bg-[#B7F34A] h-full"
              title={`Cash: ${cashShare}%`}
            />
          </div>

          <div className="grid grid-cols-3 gap-1 text-[10px] text-zinc-400 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Razorpay: ₹{(stats?.paymentMethods.razorpay || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>UPI: ₹{(stats?.paymentMethods.upi || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B7F34A]" />
              <span>Cash: ₹{(stats?.paymentMethods.cash || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Health Summary */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
          Membership Retention Status
        </span>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-base font-black text-[#B7F34A] block">
              {stats?.activeMembers || 0}
            </span>
            <span className="text-[10px] text-zinc-400">Active</span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-base font-black text-amber-400 block">
              {stats?.expiringSoon || 0}
            </span>
            <span className="text-[10px] text-zinc-400">Expiring &lt;7d</span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-base font-black text-red-400 block">
              {stats?.expired || 0}
            </span>
            <span className="text-[10px] text-zinc-400">Expired</span>
          </div>
        </div>
      </div>

      {/* One-Click CSV Export Cards */}
      <div className="space-y-2.5 pt-1">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1 block">
          Data Export & Spreadsheets
        </span>

        <div className="grid grid-cols-1 gap-2">
          {/* Members CSV */}
          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 text-[#B7F34A] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-white">Full Member Directory (.CSV)</div>
                <div className="text-[10px] text-zinc-400">Names, Codes, Plans, Joining & Expiry dates</div>
              </div>
            </div>

            <button
              onClick={() => downloadCsv('members')}
              className="px-3.5 h-8 rounded-lg bg-[#B7F34A] text-black font-extrabold text-xs flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          {/* Payments CSV */}
          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 text-[#B7F34A] flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-white">Payment Ledger Audit (.CSV)</div>
                <div className="text-[10px] text-zinc-400">Receipt numbers, timestamps, methods, amounts</div>
              </div>
            </div>

            <button
              onClick={() => downloadCsv('payments')}
              className="px-3.5 h-8 rounded-lg bg-[#B7F34A] text-black font-extrabold text-xs flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
