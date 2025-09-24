'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import GameControls from './GameControls';

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
  const items = [
    { key: 'cash', label: 'Cash', value: '$0', color: 'text-emerald-400', icon: '🪙' },
    { key: 'revenue', label: 'Revenue', value: '$0', color: 'text-green-400', icon: '💹' },
    { key: 'expenses', label: 'Expenses', value: '$0', color: 'text-red-400', icon: '💸' },
    { key: 'reputation', label: 'Reputation', value: '0%', color: 'text-yellow-400', icon: '⭐' },
  ];

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-2 sm:p-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {items.map((it) => (
              <div
                key={it.key}
                className="flex items-center gap-2 sm:gap-3 bg-gray-800/80 border border-gray-700 rounded-xl px-3 py-2"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-gray-900 border border-gray-700">
                  <span className="text-base sm:text-lg">{it.icon}</span>
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] sm:text-xs text-gray-400">{it.label}</div>
                  <div className={`text-sm sm:text-base font-semibold ${it.color}`}>{it.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <span className="text-lg">←</span>
              <span className="font-medium">Back</span>
            </button>

            {/* Industry Info */}
            <div className="flex items-center gap-4">
              <div className="text-2xl">{selectedIndustry.emoji}</div>
              <div>
                <h1 className="text-xl font-bold text-white">{selectedIndustry.name}</h1>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getDifficultyColor(selectedIndustry.difficulty)}`}></div>
                  <span className="text-sm text-gray-400">{selectedIndustry.difficulty} Difficulty</span>
                </div>
              </div>
            </div>

            {/* Spacer on desktop for balance */}
            <div className="hidden md:block w-16" />
          </div>
        </div>
      </div>

      {/* Unified Top HUD */}
      <div className="py-3"><TopHUD /></div>

      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
        <div className="grid grid-cols-1 gap-6">
          <ClinicStage />
          <UpgradeSection />
        </div>
      </div>

      {/* Floating Controls (Settings, Fullscreen) */}
      <GameControls onSettingsClick={() => {}} />

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
