'use client';

import { useState } from 'react';
import { useFullscreen } from '../hooks/useFullscreen';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useIsClient } from '../hooks/useIsClient';

interface GameHeaderProps {
  selectedIndustry: { name: string };
  onBack: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export default function GameHeader({ selectedIndustry, onBack, audioRef }: GameHeaderProps) {
  const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();
  const [menuOpen, setMenuOpen] = useState(false);
  const [musicEnabled, setMusicEnabled] = useLocalStorage('bgm_enabled', true);
  const [musicVolume, setMusicVolume] = useLocalStorage('bgm_volume', 0.4);
  const isClient = useIsClient();
  const week = 1;
  const phaseLabel = 'Phase 1 - Rat Race';

  return (
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
                <div className="w-full px-1 py-1 rounded-md">
                  <button
                    onClick={() => {
                      setMusicEnabled((v) => {
                        const next = !v;
                        if (next && audioRef.current) {
                          audioRef.current.volume = musicVolume;
                          audioRef.current.play().catch(() => {});
                        }
                        return next;
                      });
                    }}
                    className="w-full flex items-center justify-between gap-2 px-2 py-2 rounded-md hover:bg-white/10 text-purple-100"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🎵</span>
                      <span>Background Music</span>
                    </span>
                    <span className="text-sm font-semibold">{isClient ? (musicEnabled ? 'On' : 'Off') : 'On'}</span>
                  </button>
                  <div className="mt-2 px-1">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={isClient ? musicVolume : 0.4}
                      onChange={(e) => setMusicVolume(Number(e.target.value))}
                      className="w-full"
                      aria-label="Music volume"
                    />
                  </div>
                </div>
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
  );
}
