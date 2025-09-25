'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useIsClient } from '../hooks/useIsClient';
import EventCard from './EventCard';
import TopHUD from './TopHUD';
import ClinicStage from './ClinicStage';
import GameHeader from './GameHeader';
import BottomDock from './BottomDock';
import TabContent from './TabContent';

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

// Main Game Screen
export default function MainGameScreen({ selectedIndustry, onBack }: MainGameScreenProps) {
  const [activeTab, setActiveTab] = useState<'people' | 'finance' | 'assets' | 'sales'>('finance');
  const [eventOpen, setEventOpen] = useState(false);
  const [eventData, setEventData] = useState<{ variant: 'opportunity' | 'problem'; title: string; message?: string; description: string; choices: { id: string; label: string }[] } | null>(null);
  // Background music state - using proper localStorage hook
  const [musicEnabled, setMusicEnabled] = useLocalStorage('bgm_enabled', true);
  const [musicVolume, setMusicVolume] = useLocalStorage('bgm_volume', 0.4);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isClient = useIsClient();


  // Prototype: trigger a random event every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      const variants: Array<'opportunity' | 'problem'> = ['opportunity', 'problem'];
      const variant = variants[Math.floor(Math.random() * variants.length)];
      setEventData({
        variant,
        title: variant === 'opportunity' ? 'OPPORTUNITY' : 'PROBLEM',
        message: variant === 'opportunity' ? 'You Get Big Client!' : 'Unexpected Issue Occurred',
        description:
          variant === 'opportunity'
            ? 'A well-dressed stranger requests a full evaluation. Could boost your reputation.'
            : 'One dental chair malfunctions during peak hours. Handle it quickly.',
        choices:
          variant === 'opportunity'
            ? [
                { id: 'service', label: 'Provide excellent service (normal rates)' },
                { id: 'decline', label: 'Politely decline — too busy' },
              ]
            : [
                { id: 'repair', label: 'Call urgent repair (-$200)' },
                { id: 'improvise', label: 'Improvise for today (-5% reputation)' },
              ],
      });
      setEventOpen(true);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Initialize / control background music
  useEffect(() => {
    if (!isClient) return; // Don't run on server
    
    if (musicEnabled) {
      if (audioRef.current) {
        audioRef.current.loop = true;
        audioRef.current.volume = musicVolume;
        audioRef.current.play().catch(() => {
          // Autoplay blocked until user interacts
        });
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [musicEnabled, isClient]);

  // Try auto-start on first user interaction (click/keydown) to satisfy autoplay policies
  useEffect(() => {
    if (!isClient) return; // Don't run on server
    
    const tryStart = () => {
      if (musicEnabled && audioRef.current) {
        audioRef.current.volume = musicVolume;
        audioRef.current.play().catch(() => {});
      }
      window.removeEventListener('pointerdown', tryStart);
      window.removeEventListener('keydown', tryStart);
    };
    window.addEventListener('pointerdown', tryStart);
    window.addEventListener('keydown', tryStart);
    return () => {
      window.removeEventListener('pointerdown', tryStart);
      window.removeEventListener('keydown', tryStart);
    };
  }, [musicEnabled, musicVolume, isClient]);

  // React to volume changes
  useEffect(() => {
    if (!isClient) return; // Don't run on server
    
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
  }, [musicVolume, isClient]);


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#352A91] via-[#434CAF] to-[#352A91]">
      <audio
        ref={audioRef}
        src="/music/background.mp3"
        preload="auto"
        loop
        style={{ display: 'none' }}
      />
      
      {/* Header */}
      <GameHeader selectedIndustry={selectedIndustry} onBack={onBack} audioRef={audioRef} />

      {/* Unified Top HUD */}
      <div className="py-3"><TopHUD /></div>

      {/* Main Content: Dental game elements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-40">
        <div className="grid grid-cols-1 gap-6">
          <ClinicStage />
        </div>
        {/* Bottom Tab Content */}
        <div className="mt-6">
          <TabContent activeTab={activeTab} />
        </div>
      </div>

      {/* Bottom Dock - 人财物销 */}
      <BottomDock activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Event Card Modal */}
      <EventCard
        open={eventOpen}
        variant={eventData?.variant || 'opportunity'}
        title={eventData?.title || ''}
        message={eventData?.message}
        description={eventData?.description || ''}
        choices={eventData?.choices || []}
        onSelect={() => setEventOpen(false)}
        onClose={() => setEventOpen(false)}
      />
    </div>
  );
}
