'use client';

import { useFullscreen } from '../hooks/useFullscreen';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-gray-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white border border-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Game Settings</h2>
          <p className="text-gray-400">Configure your gaming experience</p>
        </div>

        {/* Display Settings */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Display Settings
            </h3>
            
            {/* Fullscreen Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Fullscreen Mode</p>
                  <p className="text-sm text-gray-400">
                    {isFullscreen ? 'Currently in fullscreen' : 'Currently windowed'}
                  </p>
                </div>
                <button
                  onClick={toggleFullscreen}
                  disabled={!isSupported}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isSupported
                      ? isFullscreen
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
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
          </div>

        </div>
      </div>
    </div>
  );
}
