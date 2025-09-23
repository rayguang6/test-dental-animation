'use client';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-lg">←</span>
              <span className="font-medium">Back</span>
            </button>

            {/* Industry Info */}
            <div className="flex items-center gap-4">
              <div className="text-2xl">{selectedIndustry.emoji}</div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{selectedIndustry.name}</h1>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getDifficultyColor(selectedIndustry.difficulty)}`}></div>
                  <span className="text-sm text-gray-600">{selectedIndustry.difficulty} Difficulty</span>
                </div>
              </div>
            </div>

            {/* Placeholder for future controls */}
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4">{selectedIndustry.emoji}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to {selectedIndustry.name}!
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              {selectedIndustry.description}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
              <div className={`w-2 h-2 rounded-full ${getDifficultyColor(selectedIndustry.difficulty)}`}></div>
              <span className="font-medium">{selectedIndustry.difficulty} Difficulty</span>
            </div>
          </div>
        </div>

        {/* Game Stats Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-bold text-gray-800 mb-1">Revenue</h3>
            <p className="text-2xl font-bold text-green-600">$0</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold text-gray-800 mb-1">Customers</h3>
            <p className="text-2xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="font-bold text-gray-800 mb-1">Reputation</h3>
            <p className="text-2xl font-bold text-yellow-600">0%</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Start Operations
              </button>
              <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                Hire Staff
              </button>
              <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Upgrade Equipment
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Industry Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Industry:</span>
                <span className="font-medium">{selectedIndustry.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Difficulty:</span>
                <span className="font-medium">{selectedIndustry.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Ready to Start</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="text-4xl mb-2">🚧</div>
            <h3 className="text-lg font-bold text-yellow-800 mb-2">Game Development in Progress</h3>
            <p className="text-yellow-700">
              The full game mechanics are being developed. This is your industry selection and main game screen!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
