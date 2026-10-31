import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Shield, Sparkles, Code2, Download } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  activeRole: 'member' | 'admin' | null;
  onSwitchRole: (role: 'member' | 'admin') => void;
  onOpenBuildGuide: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  activeRole,
  onSwitchRole,
  onOpenBuildGuide,
}) => {
  const [deviceMode, setDeviceMode] = useState<'iphone' | 'android' | 'responsive'>('iphone');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#080809] text-zinc-100 flex flex-col items-center justify-start select-none">
      {/* Top Workspace Toolbar (Outer context bar) */}
      <div className="w-full bg-[#121214] border-b border-zinc-800/80 px-4 py-2.5 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#B7F34A] text-black font-black flex items-center justify-center text-xs tracking-tighter shadow-sm shadow-[#B7F34A]/20">
            IP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">IP FITNESS</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-[#B7F34A] border border-zinc-700/60">
                Single-Gym Engine
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              TRAIN HARD. STAY CONSISTENT. · Production Ready
            </p>
          </div>
        </div>

        {/* Device & Mode Selector */}
        <div className="flex items-center gap-2">
          {/* Role quick toggle */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => onSwitchRole('member')}
              className={`px-3 py-1 rounded font-medium transition-all ${
                activeRole === 'member'
                  ? 'bg-[#B7F34A] text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Member View
            </button>
            <button
              onClick={() => onSwitchRole('admin')}
              className={`px-3 py-1 rounded font-medium transition-all ${
                activeRole === 'admin'
                  ? 'bg-[#B7F34A] text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Admin View
            </button>
          </div>

          {/* Device Frame Switcher */}
          <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setDeviceMode('iphone')}
              title="Apple iPhone 16 Pro Frame"
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                deviceMode === 'iphone'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-zinc-300" />
              <span>iOS</span>
            </button>
            <button
              onClick={() => setDeviceMode('android')}
              title="Google Pixel Android Frame"
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                deviceMode === 'android'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-zinc-300" />
              <span>Android</span>
            </button>
            <button
              onClick={() => setDeviceMode('responsive')}
              title="Responsive Web Mode"
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                deviceMode === 'responsive'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-zinc-300" />
              <span>Full View</span>
            </button>
          </div>

          {/* Expo / APK Guide Trigger */}
          <button
            onClick={onOpenBuildGuide}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[#B7F34A] border border-[#B7F34A]/30 flex items-center gap-1.5 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expo APK Guide</span>
          </button>
        </div>
      </div>

      {/* Main Container Area */}
      <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-x-hidden">
        {deviceMode === 'responsive' ? (
          /* Full View Mode: Fits seamlessly */
          <div className="w-full max-w-lg min-h-[820px] bg-[#101010] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
            {children}
          </div>
        ) : (
          /* Realistic Smartphone Bezel Simulation */
          <div
            className={`relative transition-all duration-300 ${
              deviceMode === 'iphone'
                ? 'w-[390px] h-[844px] rounded-[52px] border-[10px] border-[#222226] ring-1 ring-zinc-700/50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
                : 'w-[400px] h-[860px] rounded-[44px] border-[10px] border-[#1e1e22] ring-1 ring-zinc-700/50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
            } bg-[#101010] flex flex-col overflow-hidden`}
          >
            {/* Status Bar */}
            <div className="h-11 w-full px-7 pt-2 flex items-center justify-between text-xs font-semibold text-zinc-300 z-40 bg-[#101010] shrink-0">
              <span className="tabular-nums tracking-tight">{currentTime || '09:41'}</span>

              {/* Center Cutout: Dynamic Island for iOS, Punch-hole for Android */}
              {deviceMode === 'iphone' ? (
                <div className="w-24 h-6 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
                  <div className="w-2 h-2 rounded-full bg-blue-900/60" />
                </div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-zinc-800" />
              )}

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-zinc-300">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9zm0 2c3.87 0 7 3.13 7 7 0 1.5-.47 2.89-1.28 4.03L12 19.34l-5.72-3.31C5.47 14.89 5 13.5 5 12c0-3.87 3.13-7 7-7z" />
                </svg>
                {/* Battery icon */}
                <div className="w-5 h-2.5 border border-zinc-400 rounded-sm p-0.5 flex items-center">
                  <div className="w-3.5 h-full bg-[#B7F34A] rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Screen Viewport with smooth scroll */}
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col relative bg-[#101010] overscroll-contain">
              {children}
            </div>

            {/* Bottom Home Indicator / Gesture Bar */}
            <div className="h-6 w-full flex items-center justify-center bg-[#101010] shrink-0 z-40">
              <div
                className={`h-1 rounded-full bg-zinc-600 transition-all ${
                  deviceMode === 'iphone' ? 'w-32' : 'w-24'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
