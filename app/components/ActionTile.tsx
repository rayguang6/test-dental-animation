'use client';

interface ActionTileProps {
  icon: string;
  title: string;
  subtitle?: string;
  cost?: string;
  color?: string;
}

export default function ActionTile({ icon, title, subtitle, cost, color = 'from-purple-400 to-violet-500' }: ActionTileProps) {
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
