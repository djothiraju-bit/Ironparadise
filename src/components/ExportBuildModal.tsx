import React, { useState } from 'react';
import { X, Smartphone, Check, Copy, Code, Terminal, Play, ShieldAlert, Sparkles, Layers } from 'lucide-react';

interface ExportBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportBuildModal: React.FC<ExportBuildModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'appjson' | 'easjson' | 'playstore'>('overview');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const appJsonCode = `{
  "expo": {
    "name": "IP FITNESS",
    "slug": "ip-fitness",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#101010"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.ipfitness.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#101010"
      },
      "package": "com.ipfitness.app",
      "permissions": [
        "CAMERA",
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow IP FITNESS to scan digital QR membership passes."
        }
      ]
    ]
  }
}`;

  const easJsonCode = `{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}`;

  const commands = `# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Log in to your Expo account
eas login

# 3. Initialize EAS configuration in your project
eas build:configure

# 4. Generate standalone Android APK for immediate testing on devices
eas build -p android --profile preview

# 5. Generate production Google Play Store Android App Bundle (.aab)
eas build -p android --profile production`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#141416] border border-zinc-700/80 rounded-3xl p-6 shadow-2xl relative text-zinc-100 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B7F34A] text-black font-black flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Android APK / AAB & Expo Guide</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-[#B7F34A] border border-zinc-700">
                  v1.0.0
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Production-ready deployment & Google Play publishing setup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl my-4 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-zinc-800 text-[#B7F34A] font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Build Commands
          </button>
          <button
            onClick={() => setActiveTab('appjson')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all ${
              activeTab === 'appjson'
                ? 'bg-zinc-800 text-[#B7F34A] font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            app.json
          </button>
          <button
            onClick={() => setActiveTab('easjson')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all ${
              activeTab === 'easjson'
                ? 'bg-zinc-800 text-[#B7F34A] font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            eas.json
          </button>
          <button
            onClick={() => setActiveTab('playstore')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all ${
              activeTab === 'playstore'
                ? 'bg-zinc-800 text-[#B7F34A] font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Play Store Steps
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300">
                <p className="font-semibold text-white mb-1">
                  How to build an installable Android APK on your machine:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-zinc-400">
                  <li>Run EAS cloud builder to produce a standalone APK without needing Android Studio installed.</li>
                  <li>Scan the resulting QR code or download link on any Android phone to install the app.</li>
                  <li>Use the production profile to build the signed Android App Bundle (.aab) for Google Play.</li>
                </ol>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 rounded-t-xl border-t border-x border-zinc-800 text-xs font-mono text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#B7F34A]" />
                    <span>Terminal Commands</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(commands, 'commands')}
                    className="flex items-center gap-1 text-[11px] text-[#B7F34A] hover:underline"
                  >
                    {copiedKey === 'commands' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'commands' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-black/90 rounded-b-xl border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap">
                  {commands}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'appjson' && (
            <div className="relative">
              <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 rounded-t-xl border-t border-x border-zinc-800 text-xs font-mono text-zinc-400">
                <span>app.json configuration</span>
                <button
                  onClick={() => copyToClipboard(appJsonCode, 'appjson')}
                  className="flex items-center gap-1 text-[11px] text-[#B7F34A] hover:underline"
                >
                  {copiedKey === 'appjson' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'appjson' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/90 rounded-b-xl border border-zinc-800 text-xs font-mono text-emerald-400/90 overflow-x-auto">
                {appJsonCode}
              </pre>
            </div>
          )}

          {activeTab === 'easjson' && (
            <div className="relative">
              <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 rounded-t-xl border-t border-x border-zinc-800 text-xs font-mono text-zinc-400">
                <span>eas.json (Expo Application Services)</span>
                <button
                  onClick={() => copyToClipboard(easJsonCode, 'easjson')}
                  className="flex items-center gap-1 text-[11px] text-[#B7F34A] hover:underline"
                >
                  {copiedKey === 'easjson' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'easjson' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/90 rounded-b-xl border border-zinc-800 text-xs font-mono text-emerald-400/90 overflow-x-auto">
                {easJsonCode}
              </pre>
            </div>
          )}

          {activeTab === 'playstore' && (
            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h3 className="font-bold text-white text-sm">Google Play Store Submission Checklist</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] flex items-center justify-center font-bold text-xs shrink-0">1</span>
                    <div>
                      <strong className="text-white">Developer Console Registration:</strong>
                      <p className="text-zinc-400 text-[11px]">Sign up at play.google.com/console ($25 one-time developer registration).</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] flex items-center justify-center font-bold text-xs shrink-0">2</span>
                    <div>
                      <strong className="text-white">Package Identity:</strong>
                      <p className="text-zinc-400 text-[11px]">Ensure package is set to <code className="text-[#B7F34A]">com.ipfitness.app</code> matching your keystore signature.</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] flex items-center justify-center font-bold text-xs shrink-0">3</span>
                    <div>
                      <strong className="text-white">Store Listing Metadata:</strong>
                      <p className="text-zinc-400 text-[11px]">App title: "IP FITNESS", Short description: "Train Hard. Stay Consistent. Single gym membership & fee app", Feature graphic: 1024x500, App Icon: 512x512.</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] flex items-center justify-center font-bold text-xs shrink-0">4</span>
                    <div>
                      <strong className="text-white">Data Safety & Permissions:</strong>
                      <p className="text-zinc-400 text-[11px]">Declare Camera usage for QR pass scanning and Internet for Razorpay payments and attendance verification.</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] flex items-center justify-center font-bold text-xs shrink-0">5</span>
                    <div>
                      <strong className="text-white">Upload AAB:</strong>
                      <p className="text-zinc-400 text-[11px]">Upload the production <code className="text-[#B7F34A]">.aab</code> artifact generated by <code className="text-white">eas build -p android --profile production</code>.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 h-10 rounded-xl bg-[#B7F34A] hover:bg-[#a6e03e] text-black font-bold text-xs transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
