'use client';

export default function TopHUD() {
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
            <div className="flex items-center justify-center gap-2 bg-black/25 rounded-lg px-2 py-1 overflow-hidden">
              <span className="text-base sm:text-lg leading-none shrink-0">{it.icon}</span>
              <div className="leading-tight text-white text-center min-w-0">
                <div className="font-extrabold tracking-tight tabular-nums text-sm sm:text-base truncate" style={{ textShadow: '0 2px 0 rgba(0,0,0,.35)' }}>
                  {formatNumber(it.amount)}{it.suffix || ''}
                </div>
                <div className="text-[9px] sm:text-[10px] text-white/80 truncate">{it.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
