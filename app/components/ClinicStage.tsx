'use client';

import { useEffect, useRef, useState } from 'react';

export default function ClinicStage() {
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
        curr.length < 10 ? [...curr, patientEmojis[Math.floor(Math.random() * patientEmojis.length)]] : curr
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
