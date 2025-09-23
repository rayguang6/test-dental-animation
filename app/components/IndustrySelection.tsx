'use client';

interface Industry {
  id: string;
  name: string;
  emoji: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface IndustrySelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (industry: Industry) => void;
}

const industries: Industry[] = [
  {
    id: 'dental',
    name: 'Dental Clinic',
    emoji: '🦷',
    description: 'Build a dental empire with modern equipment and patient care',
    difficulty: 'Medium'
  },
  {
    id: 'restaurant',
    name: 'Restaurant Chain',
    emoji: '🍕',
    description: 'Create a food empire with multiple restaurant locations',
    difficulty: 'Hard'
  },
  {
    id: 'tech',
    name: 'Tech Startup',
    emoji: '💻',
    description: 'Launch innovative software and scale your tech company',
    difficulty: 'Hard'
  },
  {
    id: 'retail',
    name: 'Retail Store',
    emoji: '🛍️',
    description: 'Manage inventory and grow your retail business',
    difficulty: 'Easy'
  },
  {
    id: 'fitness',
    name: 'Fitness Center',
    emoji: '💪',
    description: 'Build a health and wellness empire',
    difficulty: 'Medium'
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    emoji: '🏠',
    description: 'Buy, sell, and develop properties for maximum profit',
    difficulty: 'Hard'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    emoji: '🎬',
    description: 'Create movies, music, and entertainment content',
    difficulty: 'Medium'
  },
  {
    id: 'transportation',
    name: 'Transportation',
    emoji: '🚚',
    description: 'Build a logistics and transportation network',
    difficulty: 'Hard'
  }
];

export default function IndustrySelection({ isOpen, onClose, onSelect }: IndustrySelectionProps) {
  if (!isOpen) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Choose Your Industry</h2>
              <p className="text-blue-100 mt-1">Select the business you want to build</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        {/* Industries Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => onSelect(industry)}
                className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{industry.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-800 group-hover:text-blue-600">
                        {industry.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(industry.difficulty)}`}>
                        {industry.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{industry.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Choose wisely - each industry has unique challenges and opportunities!
          </p>
        </div>
      </div>
    </div>
  );
}
