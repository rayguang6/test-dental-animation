'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFullscreen } from '../hooks/useFullscreen';

interface Industry {
  id: string;
  name: string;
  emoji: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface MainGameScreenProps {
  selectedIndustry: Industry;
  onBack: () => void;
}

// Top HUD with 4 stats
function TopHUD() {
  const shortNumber = (n: number) => {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return String(n);
  };
  const formatNumber = (n: number) => (n < 100_000 ? n.toLocaleString() : shortNumber(n));

  const items = [
    { key: 'cash', label: 'Cash', amount: 1250000, icon: '💵' },
    { key: 'revenue', label: 'Revenue', amount: 56234, icon: '📈' },
    { key: 'expenses', label: 'Expenses', amount: 980, icon: '📉' },
    { key: 'reputation', label: 'Reputation', amount: 85, suffix: '%', icon: '⭐' },
  ];

  return (
    <div className="w-full px-2 sm:px-4 lg:px-8">
      <div className="flex items-stretch justify-around gap-1 sm:gap-2">
        {items.map((it) => (
          <div key={it.key} className="flex-1 min-w-0">
            <div className="flex items-center justify-center gap-2 bg-black/25 rounded-lg px-2 py-1">
              <span className="text-base sm:text-lg leading-none">{it.icon}</span>
              <div className="leading-tight text-white text-center">
                <div className="font-extrabold tracking-tight tabular-nums text-base sm:text-lg" style={{ textShadow: '0 2px 0 rgba(0,0,0,.35)' }}>
                  {formatNumber(it.amount)}{it.suffix || ''}
                </div>
                <div className="text-[10px] sm:text-xs text-white/85 uppercase tracking-wide">{it.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Removed multi-step strip; we'll use a single stage below

// Upgrade Section Component
function UpgradeSection() {
  const upgrades = [
    { id: 'equipment', name: 'Equipment', icon: '🔧', cost: 100, level: 1 },
    { id: 'staff', name: 'Staff', icon: '👨‍⚕️', cost: 200, level: 1 },
    { id: 'facility', name: 'Facility', icon: '🏥', cost: 500, level: 1 },
    { id: 'marketing', name: 'Marketing', icon: '📢', cost: 300, level: 1 },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">⬆️</span>
        Upgrades
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {upgrades.map((upgrade) => (
          <button
            key={upgrade.id}
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{upgrade.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-medium text-white text-sm">{upgrade.name}</div>
                <div className="text-xs text-gray-400">Level {upgrade.level}</div>
                <div className="text-xs text-green-400">${upgrade.cost}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Treatment Queue Component
function TreatmentQueue() {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🔄</span>
        Treatment Queue
      </h3>
      
      <div className="space-y-4">
        {/* Processing Animation */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">👤</span>
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">Patient #001</div>
              <div className="text-sm text-gray-400">Waiting for treatment...</div>
            </div>
            <div className="text-green-400 text-sm">Ready</div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsProcessing(!isProcessing)}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
            isProcessing
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isProcessing ? 'Stop Treatment' : 'Start Treatment'}
        </button>
      </div>
    </div>
  );
}

// Simple Visualization: Waiting Area -> Treatment Rooms
function ClinicStage() {
  const patientEmojis = ['🧑', '👩', '👨', '🧑‍🦱', '🧒', '👵', '👴'];
  const chairEmoji = '🪑';
  const toothEmoji = '🦷';

  const [waiting, setWaiting] = useState<string[]>(() =>
    Array.from({ length: 6 }, (_, i) => patientEmojis[i % patientEmojis.length])
  );
  const [treating, setTreating] = useState<Array<{ id: number; emoji: string; progress: number }>>([]);
  const idRef = useRef(0);

  // Periodically assign from waiting to treatment if a chair available
  const maxChairs = 3;

  useEffect(() => {
    const assignTimer = setInterval(() => {
      setWaiting((curr) => {
        if (curr.length === 0) return curr;
        setTreating((currTreat) => {
          if (currTreat.length >= maxChairs) return currTreat;
          const [next, ...rest] = curr;
          const id = ++idRef.current;
          return [...currTreat, { id, emoji: next, progress: 0 }];
        });
        return curr.slice(1);
      });
    }, 1200);
    return () => clearInterval(assignTimer);
  }, []);

  // Progress treatment and free chairs when complete
  useEffect(() => {
    const progTimer = setInterval(() => {
      setTreating((curr) =>
        curr
          .map((t) => ({ ...t, progress: Math.min(100, t.progress + 8) }))
          .filter((t) => t.progress < 100)
      );
    }, 300);
    return () => clearInterval(progTimer);
  }, []);

  // Refill waiting slowly so there is motion
  useEffect(() => {
    const refill = setInterval(() => {
      setWaiting((curr) =>
        curr.length < 10 ? [...curr, patientEmojis[(curr.length + Date.now()) % patientEmojis.length]] : curr
      );
    }, 2500);
    return () => clearInterval(refill);
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-3 sm:p-4">
      <div className="text-white/90 text-sm font-semibold mb-2">Clinic</div>
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 to-gray-900 border border-gray-700">
        {/* Floor */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gray-800/70 border-t border-gray-700" />

        {/* Waiting bench area (left) */}
        <div className="absolute left-[4%] top-[8%] bottom-[8%] w-[28%] rounded-xl bg-gray-900/60 border border-gray-800 p-2">
          <div className="text-[11px] text-gray-300 mb-1">Waiting • {waiting.length}</div>
          <div className="flex flex-col gap-2">
            {waiting.slice(0, 6).map((w, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 border border-gray-700 text-base">
                  {w}
                </div>
                <div className="flex-1 h-1.5 rounded bg-gray-800 overflow-hidden">
                  <div className="h-full w-1/3 bg-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment chairs (right) */}
        <div className="absolute right-[4%] top-[8%] bottom-[8%] w-[60%] grid grid-cols-3 gap-3">
          {Array.from({ length: maxChairs }).map((_, i) => {
            const seat = treating[i];
            return (
              <div key={i} className="relative bg-gray-900/60 border border-gray-800 rounded-xl p-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 text-xl">
                    {chairEmoji}
                  </div>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${seat ? 'bg-emerald-900/30 border-emerald-700' : 'bg-gray-800 border-gray-700'} text-lg`}>
                    {seat ? seat.emoji : toothEmoji}
                  </div>
                </div>
                <div className="mt-2 h-1.5 rounded bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${seat ? seat.progress : 0}%` }}
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-emerald-500/80 border border-emerald-300 animate-pulse" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Main Game Screen
export default function MainGameScreen({ selectedIndustry, onBack }: MainGameScreenProps) {
  const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();
  const [menuOpen, setMenuOpen] = useState(false);
  const week = 1;
  const phaseLabel = 'Phase 1 - Rat Race';
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#352A91] via-[#434CAF] to-[#352A91]">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Single Menu Button */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="ui-chip px-3 py-2 flex items-center gap-2"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="text-white">☰</span>
                <span className="text-white text-sm font-semibold">Menu</span>
              </button>
              {menuOpen && (
                <div className="absolute left-0 mt-2 w-56 ui-card p-2 z-50">
                  {isSupported && (
                    <button
                      onClick={() => { toggleFullscreen(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 text-purple-100"
                    >
                      <span className="text-lg">⛶</span>
                      <span>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => { /* music toggle placeholder */ setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 text-purple-100"
                  >
                    <span className="text-lg">🎵</span>
                    <span>Game Music(TODO)</span>
                  </button>
                  <div className="my-1 h-px bg-white/10" />
                  <button
                    onClick={() => { onBack(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 text-purple-100"
                  >
                    <span className="text-lg">🚪</span>
                    <span>Exit Game</span>
                  </button>
                </div>
              )}
            </div>

            {/* Center Title */}
            <div className="text-center">
              <div className="text-xl font-extrabold text-white tracking-wide">Dental</div>
              <div className="text-xs text-purple-200">{phaseLabel}</div>
            </div>

            {/* Right Date/Week */}
            <div className="text-right">
              <div className="text-sm text-white font-semibold">Week {week}</div>
              <div className="text-[10px] text-purple-200">{selectedIndustry.name}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Top HUD */}
      <div className="py-3"><TopHUD /></div>

      

      {/* Main Content: Dental game elements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
        <div className="grid grid-cols-1 gap-6">
          <ClinicStage />
          <UpgradeSection />
        </div>
      </div>

      {/* Floating Controls removed in favor of Menu button */}

      {/* Bottom Dock - 人财物销 */}
      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-safe">
          <div className="mb-3"></div>
          <div className="grid grid-cols-4 gap-2 bg-gray-900/90 backdrop-blur border-t border-gray-700 rounded-t-2xl p-2">
            {[
              { key: 'people', label: '人', sub: 'Team', icon: '👥' },
              { key: 'finance', label: '财', sub: 'Finance', icon: '💰' },
              { key: 'assets', label: '物', sub: 'Assets', icon: '🏭' },
              { key: 'sales', label: '销', sub: 'Sales', icon: '📈' },
            ].map((item) => (
              <button
                key={item.key}
                className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">{item.label}</span>
                  <span className="text-[10px] text-gray-400">{item.sub}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
