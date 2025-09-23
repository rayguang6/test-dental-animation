'use client';

import { useState } from 'react';
import SettingsPanel from './components/SettingsPanel';
import IndustrySelection from './components/IndustrySelection';
import MainGameScreen from './components/MainGameScreen';
import { useFullscreen } from './hooks/useFullscreen';

interface Industry {
  id: string;
  name: string;
  emoji: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const [showIndustrySelection, setShowIndustrySelection] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();

  const handleStartGame = () => {
    setShowIndustrySelection(true);
  };

  const handleIndustrySelect = (industry: Industry) => {
    setSelectedIndustry(industry);
    setShowIndustrySelection(false);
  };

  const handleBackToHome = () => {
    setSelectedIndustry(null);
  };

  // If an industry is selected, show the main game screen
  if (selectedIndustry) {
    return <MainGameScreen selectedIndustry={selectedIndustry} onBack={handleBackToHome} />;
  }

  return (
    <div 
      className="min-h-screen w-full relative bg-cover bg-center bg-no-repeat
                 bg-[url('/images/business-empire-mobile.jpg')] 
                 md:bg-[url('/images/business-empire-desktop.jpg')]"
    >
      {/* Top Right Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="p-3 bg-black/50 backdrop-blur-sm rounded-full shadow-lg border border-white/20 hover:bg-black/70 transition-all duration-300"
        >
          <span className="text-lg">⚙️</span>
        </button>

        {/* Fullscreen Toggle Button */}
        {isSupported && (
          <button
            onClick={toggleFullscreen}
            className="p-3 bg-black/50 backdrop-blur-sm rounded-full shadow-lg border border-white/20 hover:bg-black/70 transition-all duration-300 flex items-center gap-2"
          >
            <span className="text-lg text-white">
              {isFullscreen ? '📱' : '🔳'}
            </span>
            <span className="text-sm font-medium text-white hidden sm:inline">
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-20">
        {/* Content Card with better contrast */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center border border-white/20 shadow-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            Business Empire
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-white/90">
            Build your empire, one animation at a time!
          </p>
          
          {/* Start Game Button */}
          <button 
            onClick={handleStartGame}
            className="w-full px-8 py-4 bg-yellow-500 text-black rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg"
          >
            Start Game
          </button>
        </div>
      </div>

      {/* Industry Selection Modal */}
      <IndustrySelection
        isOpen={showIndustrySelection}
        onClose={() => setShowIndustrySelection(false)}
        onSelect={handleIndustrySelect}
      />

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
}