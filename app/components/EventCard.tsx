'use client';

interface Choice { id: string; label: string }

export default function EventCard({
  open,
  variant,
  title,
  message,
  description,
  choices,
  onSelect,
  onClose,
}: {
  open: boolean;
  variant: 'opportunity' | 'problem';
  title: string;
  message?: string;
  description: string;
  choices: Choice[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const palette =
    variant === 'opportunity'
      ? {
          bg: 'bg-gradient-to-b from-[#39C6F3] via-[#28B9F0] to-[#8BE9FF]',
          header: 'bg-gradient-to-b from-[#2DB1E8] to-[#1C8FD0]',
          stripe1: 'bg-white/30',
          stripe2: 'bg-white/15',
          choice: '#56D8D0',
        }
      : {
          bg: 'bg-gradient-to-b from-[#FF7AD6] via-[#FF64C5] to-[#FF9AE8]',
          header: 'bg-gradient-to-b from-[#FF66CC] to-[#E64AAE]',
          stripe1: 'bg-white/30',
          stripe2: 'bg-white/15',
          choice: '#E6B1E8',
        };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={`relative w-full max-w-xs rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,.5)]`}>
        <div className="absolute -inset-[3px] rounded-2xl bg-white/95" />
        <div className={`relative rounded-2xl overflow-hidden ${palette.bg} border border-black/30`}>
          <div className={`pointer-events-none absolute top-2 bottom-2 right-4 w-2 ${palette.stripe1} rounded-sm`} />
          <div className={`pointer-events-none absolute top-2 bottom-2 right-2 w-2 ${palette.stripe2} rounded-sm`} />

          {/* Header with notch (centered) */}
          <div className="pt-3 flex justify-center">
            <div className={`relative inline-flex items-center px-4 py-2 text-white font-extrabold text-[13px] tracking-wide shadow-[0_4px_0_rgba(0,0,0,.3)] ${palette.header} border border-white/80 rounded-md`}> 
              {(variant === 'opportunity' ? 'OPPORTUNITY' : 'PROBLEM')}
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-8 border-l-transparent border-r-transparent ${variant === 'opportunity' ? 'border-t-[#1C8FD0]' : 'border-t-[#E64AAE]'}`}></div>
            </div>
          </div>

          <div className="px-3 pb-3">
            {/* Info bar under header */}
            {message && (
              <div className="mt-2 rounded-md px-3 py-2 text-white font-extrabold text-[13px] text-center tracking-wide border border-white/70 shadow-[0_3px_0_rgba(0,0,0,.35)] bg-gradient-to-b from-[#2DB1E8] to-[#1C8FD0]">
                {message}
              </div>
            )}
            <div className="mt-2 rounded-xl bg-white/85 text-slate-900 p-3 border border-white shadow-inner">
              <p className="text-sm leading-snug">{description}</p>
            </div>

            <div className="mt-3 space-y-2">
              {choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className="w-full rounded-xl border-2 border-white/85 text-white font-extrabold px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_3px_0_rgba(0,0,0,.35),0_8px_16px_rgba(0,0,0,.2)] active:translate-y-[1px]"
                  style={{ backgroundColor: palette.choice as string }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <button onClick={onClose} className="mt-3 w-full text-center text-white/90 text-xs">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}


