'use client';

import { useState } from 'react';
import { useFullscreen } from '../hooks/useFullscreen';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Fullscreen Settings */}
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-800 mb-3">Display Settings</h3>
            
            {/* Fullscreen Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Fullscreen Mode</p>
                <p className="text-sm text-gray-500">
                  {isFullscreen ? 'Currently in fullscreen' : 'Currently windowed'}
                </p>
              </div>
              <button
                onClick={toggleFullscreen}
                disabled={!isSupported}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isSupported
                    ? isFullscreen
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSupported
                  ? isFullscreen
                    ? 'Exit Fullscreen'
                    : 'Enter Fullscreen'
                  : 'Not Supported'}
              </button>
            </div>
          </div>

          {/* Status Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">System Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isSupported ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>Fullscreen API: {isSupported ? 'Supported' : 'Not Supported'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isFullscreen ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span>Current Mode: {isFullscreen ? 'Fullscreen' : 'Windowed'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
