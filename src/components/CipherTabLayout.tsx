import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export interface CipherTab {
  id: string;
  label: string;
  icon: string;
  content: React.ReactNode;
}

interface Props {
  tabs: CipherTab[];
}

export const CipherTabLayout: React.FC<Props> = ({ tabs }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className={`rounded-2xl shadow-xl p-2 sticky top-0 z-30 backdrop-blur-lg
        ${isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'}`}>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all whitespace-nowrap text-sm md:text-base flex-1 justify-center
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-[1.02]'
                  : isDarkMode
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div key={activeTab} className="animate-fade-in">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
};