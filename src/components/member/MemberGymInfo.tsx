import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Mail,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Dumbbell,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { GymSettings } from '../../types';

interface MemberGymInfoProps {
  settings: GymSettings | null;
}

export const MemberGymInfo: React.FC<MemberGymInfoProps> = ({ settings }) => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    settings ? `${settings.gym_name} ${settings.address} ${settings.city}` : 'IP Fitness New Delhi'
  )}`;

  const callPhone = () => {
    if (settings?.phone) {
      window.open(`tel:${settings.phone}`, '_self');
    }
  };

  const openWhatsApp = () => {
    if (settings?.whatsapp) {
      const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanPhone}?text=Hi%20IP%20Fitness,%20I%20have%20an%20inquiry`, '_blank');
    }
  };

  return (
    <div className="flex-1 w-full p-4 space-y-4 pb-24 text-zinc-100">
      {/* Header */}
      <div className="pt-1">
        <h2 className="text-xl font-black tracking-tight text-white uppercase">
          Gym Operations & Location
        </h2>
        <p className="text-xs text-zinc-400">
          Facility timings, location, and front-desk support
        </p>
      </div>

      {/* Live Status Card */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                settings?.is_open
                  ? 'bg-[#B7F34A] shadow-[0_0_12px_#B7F34A]'
                  : 'bg-red-500 shadow-[0_0_10px_red]'
              }`}
            />
            <span className="font-black text-sm text-white tracking-wide uppercase">
              {settings?.is_open ? 'GYM IS OPEN' : 'GYM IS CLOSED'}
            </span>
          </div>

          <span className="text-[10px] uppercase font-bold text-zinc-400">
            Real-time Status
          </span>
        </div>

        <p className="text-xs text-zinc-300">
          {settings?.status_message || (settings?.is_open ? 'Welcome to train' : 'Currently closed')}
        </p>

        {/* Timings breakdown */}
        <div className="pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] uppercase text-zinc-400 block font-semibold">
              Mon - Sat Hours
            </span>
            <span className="font-bold text-white">
              {settings?.opening_time || '05:30 AM'} - {settings?.closing_time || '10:30 PM'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] uppercase text-zinc-400 block font-semibold">
              Sunday Hours
            </span>
            <span className="font-bold text-white">
              {settings?.sunday_timing || '06:00 AM - 01:00 PM'}
            </span>
          </div>
        </div>
      </div>

      {/* Location & Navigation */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
            <MapPin className="w-4 h-4 text-[#B7F34A]" />
            <span>Gym Location</span>
          </div>
          <span className="text-[10px] text-zinc-400">Puducherry</span>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/90 text-xs">
          <div className="font-bold text-white text-sm">
            {settings?.gym_name || 'IRON PARADISE Unisex Fitness'}
          </div>
          <p className="text-zinc-400 mt-1 leading-relaxed">
            {settings?.address || 'Radhakrishnan Nagar'}, {settings?.city || 'Puducherry'} - {settings?.pincode || '605009'}
          </p>
        </div>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Navigation className="w-4 h-4 text-[#B7F34A]" />
          <span>Open Directions in Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
        </a>
      </div>

      {/* Front-Desk & Support Contact Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1 block">
          Contact Gym Reception
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={callPhone}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex items-center gap-2.5 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-[#B7F34A]/10 text-[#B7F34A] flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-xs text-white">Call Desk</div>
              <div className="text-[10px] text-zinc-400 truncate">{settings?.phone || '+91 97913 61041'}</div>
            </div>
          </button>

          <button
            onClick={openWhatsApp}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex items-center gap-2.5 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-xs text-white">WhatsApp</div>
              <div className="text-[10px] text-zinc-400">Direct Chat</div>
            </div>
          </button>
        </div>
      </div>

      {/* Facility Highlights */}
      <div className="p-4 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-white block">
          Club Amenities & Features
        </span>

        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>Biometric / QR Access</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>Eleiko Olympic Rigs</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>Steam & Sauna Bath</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>Locker & Hot Shower</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>Certified Coaches</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>Free Valet Parking</span>
          </div>
        </div>
      </div>
    </div>
  );
};
