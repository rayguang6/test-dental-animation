'use client';

import { useState } from 'react';

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

// Game Stats Component
function GameStats() {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-xs text-gray-400 mb-1">Revenue</div>
          <div className="text-lg font-bold text-green-400">$0</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">👥</div>
          <div className="text-xs text-gray-400 mb-1">Customers</div>
          <div className="text-lg font-bold text-blue-400">0</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-xs text-gray-400 mb-1">Reputation</div>
          <div className="text-lg font-bold text-yellow-400">0%</div>
        </div>
      </div>
    </div>
  );
}

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

            {/* Game Stats */}
            <div className="hidden md:block">
              <GameStats />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="md:hidden p-4">
        <GameStats />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upgrades */}
          <div className="lg:col-span-2">
            <UpgradeSection />
          </div>

          {/* Right Column - Treatment Queue */}
          <div className="lg:col-span-1">
            <TreatmentQueue />
          </div>
        </div>

      </div>
    </div>
  );
}
