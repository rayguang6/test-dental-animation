'use client';

interface BottomDockProps {
  activeTab: 'people' | 'finance' | 'assets' | 'sales';
  onTabChange: (tab: 'people' | 'finance' | 'assets' | 'sales') => void;
}

export default function BottomDock({ activeTab, onTabChange }: BottomDockProps) {
  const items = [
    { key: 'people', label: '人', sub: 'Team', icon: '👥', color: 'from-pink-400 to-fuchsia-500' },
    { key: 'finance', label: '财', sub: 'Finance', icon: '💰', color: 'from-amber-300 to-orange-400' },
    { key: 'assets', label: '物', sub: 'Assets', icon: '🏭', color: 'from-sky-300 to-blue-400' },
    { key: 'sales', label: '销', sub: 'Marketing', icon: '📢', color: 'from-emerald-300 to-lime-400' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pb-safe">
        <div className="mb-2"></div>
        <div className="relative rounded-t-2xl border-t border-white/10 bg-gradient-to-t from-[#1b1f3a]/95 to-[#2b2f5a]/90 shadow-[0_-8px_24px_rgba(0,0,0,.35)] p-2">
          <div className="grid grid-cols-4 gap-1">
            {items.map((item) => {
              const isActive = item.key === activeTab;
              return (
                <button
                  key={item.key}
                  onClick={() => onTabChange(item.key as typeof activeTab)}
                  className={`relative flex flex-col items-center gap-1 py-2 rounded-xl text-white/90 transition-transform active:scale-95 ${isActive ? 'bg-white/8' : 'hover:bg-white/5'} overflow-hidden`}
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-[0_2px_0_rgba(0,0,0,.4)]`}> 
                    <span className="text-lg leading-none">{item.icon}</span>
                  </div>
                  <div className="flex items-center gap-1 leading-none max-w-[80px]">
                    <span className={`text-sm font-extrabold ${isActive ? 'text-white' : 'text-white/90'} truncate`}>{item.label}</span>
                    <span className="text-[10px] text-white/70 truncate">{item.sub}</span>
                  </div>
                  {isActive && (
                    <div className="absolute -top-2 inset-x-6 h-1 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,.8)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
