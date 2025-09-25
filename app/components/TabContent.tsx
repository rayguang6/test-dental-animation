'use client';

import ActionTile from './ActionTile';

interface TabContentProps {
  activeTab: 'people' | 'finance' | 'assets' | 'sales';
}

export default function TabContent({ activeTab }: TabContentProps) {
  if (activeTab === 'people') {
    return (
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
    );
  }

  if (activeTab === 'finance') {
    return (
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
    );
  }

  if (activeTab === 'assets') {
    return (
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
    );
  }

  if (activeTab === 'sales') {
    return (
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
    );
  }

  return null;
}
