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
                <div className="font-extrabold tracking-tight tabular-nums text-sm sm:text-base" style={{ textShadow: '0 2px 0 rgba(0,0,0,.35)' }}>
                  {formatNumber(it.amount)}{it.suffix || ''}
                </div>
                <div className="text-[9px] sm:text-[10px] text-white/80">{it.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Reusable Action Tile for upgrades/actions
function ActionTile({ icon, title, subtitle, cost, color = 'from-purple-400 to-violet-500' }: { icon: string; title: string; subtitle?: string; cost?: string; color?: string; }) {
  return (
    <button className="rounded-xl bg-black/25 border border-white/10 p-3 text-left hover:bg-white/10 transition-colors active:scale-[0.98]">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-[0_2px_0_rgba(0,0,0,.4)] text-xl`}>{icon}</div>
        <div className="flex-1">
          <div className="text-white font-semibold text-sm">{title}</div>
          {subtitle && <div className="text-[11px] text-white/70">{subtitle}</div>}
        </div>
        {cost && <div className="text-amber-200 font-extrabold text-sm tabular-nums">{cost}</div>}
      </div>
    </button>
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
    <div className="rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-300 border-2 border-yellow-300 shadow-[inset_0_0_0_3px_rgba(255,255,255,0.35),inset_0_-6px_0_rgba(0,0,0,0.2),0_8px_24px_rgba(0,0,0,0.35)]">
      <div className="text-yellow-950 text-sm font-extrabold mb-2 tracking-wide drop-shadow">Clinic</div>
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">

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
  const [activeTab, setActiveTab] = useState<'people' | 'finance' | 'assets' | 'sales'>('finance');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-40">
        <div className="grid grid-cols-1 gap-6">
          <ClinicStage />
        </div>
        {/* Bottom Tab Content */}
        <div className="mt-6">
          {activeTab === 'people' && (
            <div className="rounded-2xl p-4 bg-gradient-to-b from-indigo-900/60 to-slate-900/60 border border-indigo-700/60 shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_8px_20px_rgba(30,41,59,.4)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-500 flex items-center justify-center">👥</div>
                <div className="text-white font-extrabold">Team</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <ActionTile icon="🧑‍⚕️" title="Hire Dentist" subtitle="Base salary $200/day" cost="$200" color="from-pink-400 to-fuchsia-500" />
                <ActionTile icon="🧑‍💼" title="Hire Assistant" subtitle="Boost speed +5%" cost="$120" color="from-rose-400 to-orange-300" />
                <ActionTile icon="📚" title="Training" subtitle="Skill +1 level" cost="$80" color="from-sky-400 to-blue-500" />
              </div>
            </div>
          )}
          {activeTab === 'finance' && (
            <div className="rounded-2xl p-4 bg-gradient-to-b from-amber-900/40 to-orange-900/40 border border-amber-700/60 shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_8px_20px_rgba(146,64,14,.35)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center">💰</div>
                <div className="text-white font-extrabold">Finance</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-white/90">
                <div className="rounded-lg bg-black/25 border border-white/10 p-3">
                  <div className="text-[11px] text-white/70">Cash</div>
                  <div className="text-lg font-extrabold tabular-nums">$ 1.2M</div>
                </div>
                <div className="rounded-lg bg-black/25 border border-white/10 p-3">
                  <div className="text-[11px] text-white/70">Daily Revenue</div>
                  <div className="text-lg font-extrabold tabular-nums">$ 56,234</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <ActionTile icon="🏷️" title="Adjust Pricing" subtitle="Set service prices" color="from-yellow-300 to-orange-400" />
                <ActionTile icon="📊" title="Cost Cutting" subtitle="Reduce expenses" color="from-amber-400 to-rose-400" />
              </div>
            </div>
          )}
          {activeTab === 'assets' && (
            <div className="rounded-2xl p-4 bg-gradient-to-b from-sky-900/50 to-blue-900/50 border border-sky-700/60 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_8px_20px_rgba(2,132,199,.35)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-300 to-blue-400 flex items-center justify-center">🏭</div>
                <div className="text-white font-extrabold">Assets</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <ActionTile icon="🪑" title="Chair Slots" subtitle="+1 chair" cost="$500" color="from-sky-300 to-blue-400" />
                <ActionTile icon="🛠️" title="Tools" subtitle="Lv.1 → Lv.2" cost="$300" color="from-indigo-400 to-violet-500" />
                <ActionTile icon="🏥" title="Room" subtitle="Add 1 room" cost="$800" color="from-cyan-400 to-blue-500" />
              </div>
            </div>
          )}
          {activeTab === 'sales' && (
            <div className="rounded-2xl p-4 bg-gradient-to-b from-emerald-900/50 to-teal-900/50 border border-emerald-700/60 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_8px_20px_rgba(16,185,129,.35)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-300 to-lime-400 flex items-center justify-center">📢</div>
                <div className="text-white font-extrabold">Marketing</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-black/25 border border-white/10 p-3">
                  <div className="text-[11px] text-white/70">New Patients</div>
                  <div className="text-lg font-extrabold tabular-nums">+32/day</div>
                </div>
                <div className="rounded-lg bg-black/25 border border-white/10 p-3">
                  <div className="text-[11px] text-white/70">Conversion</div>
                  <div className="text-lg font-extrabold tabular-nums">48%</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <ActionTile icon="📣" title="Run Campaign" subtitle="7 days" cost="$200" color="from-emerald-300 to-lime-400" />
                <ActionTile icon="🪧" title="Buy Ads" subtitle="Local platform" cost="$150" color="from-teal-300 to-cyan-400" />
                <ActionTile icon="🎁" title="Promo Packs" subtitle="New patient bundle" cost="$100" color="from-green-300 to-emerald-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Controls removed in favor of Menu button */}

      {/* Bottom Dock - 人财物销 */}
      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pb-safe">
          <div className="mb-2"></div>
          <div className="relative rounded-t-2xl border-t border-white/10 bg-gradient-to-t from-[#1b1f3a]/95 to-[#2b2f5a]/90 shadow-[0_-8px_24px_rgba(0,0,0,.35)] p-2">
            <div className="grid grid-cols-4 gap-1">
              {(() => {
                const items = [
                  { key: 'people', label: '人', sub: 'Team', icon: '👥', color: 'from-pink-400 to-fuchsia-500' },
                  { key: 'finance', label: '财', sub: 'Finance', icon: '💰', color: 'from-amber-300 to-orange-400' },
                  { key: 'assets', label: '物', sub: 'Assets', icon: '🏭', color: 'from-sky-300 to-blue-400' },
                  { key: 'sales', label: '销', sub: 'Marketing', icon: '📢', color: 'from-emerald-300 to-lime-400' },
                ];
                return items.map((item) => {
                  const isActive = item.key === activeTab;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key as typeof activeTab)}
                      className={`relative flex flex-col items-center gap-1 py-2 rounded-xl text-white/90 transition-transform active:scale-95 ${isActive ? 'bg-white/8' : 'hover:bg-white/5'}`}
                    >
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-[0_2px_0_rgba(0,0,0,.4)]`}> 
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div className="flex items-center gap-1 leading-none">
                        <span className={`text-sm font-extrabold ${isActive ? 'text-white' : 'text-white/90'}`}>{item.label}</span>
                        <span className="text-[10px] text-white/70">{item.sub}</span>
                      </div>
                      {isActive && (
                        <div className="absolute -top-2 inset-x-6 h-1 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,.8)]" />
                      )}
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
