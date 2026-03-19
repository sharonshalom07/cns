import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ENGLISH_FREQ: Record<string, number> = {
  A: 8.2, B: 1.5, C: 2.8, D: 4.3, E: 12.7, F: 2.2, G: 2.0, H: 6.1,
  I: 7.0, J: 0.15, K: 0.77, L: 4.0, M: 2.4, N: 6.7, O: 7.5, P: 1.9,
  Q: 0.095, R: 6.0, S: 6.3, T: 9.1, U: 2.8, V: 0.98, W: 2.4, X: 0.15,
  Y: 2.0, Z: 0.074,
};

interface Props {
  text: string;
  showEnglishComparison?: boolean;
  title?: string;
}

export const getLetterFrequencies = (input: string): Record<string, number> => {
  const freq: Record<string, number> = {};
  const letters = input.toUpperCase().replace(/[^A-Z]/g, '');
  if (letters.length === 0) return freq;
  for (const c of letters) freq[c] = (freq[c] || 0) + 1;
  for (const k in freq) freq[k] = (freq[k] / letters.length) * 100;
  return freq;
};

export const ENGLISH_FREQUENCIES = ENGLISH_FREQ;

export const FrequencyAnalysis: React.FC<Props> = ({
  text,
  showEnglishComparison = true,
  title = '📊 Letter Frequency Analysis',
}) => {
  const { isDarkMode } = useTheme();
  const freq = getLetterFrequencies(text);
  const maxFreq = Math.max(...Object.values(freq), ...Object.values(ENGLISH_FREQ), 1);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  if (text.replace(/[^a-zA-Z]/g, '').length === 0) {
    return (
      <div className={`p-6 rounded-xl text-center ${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
        Enter some text to see frequency analysis.
      </div>
    );
  }

  return (
    <div>
      <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h4>
      <div className="space-y-1">
        {alphabet.map((letter) => {
          const tf = freq[letter] || 0;
          const ef = ENGLISH_FREQ[letter] || 0;
          return (
            <div key={letter} className="flex items-center gap-2 text-sm">
              <span className={`w-5 font-mono font-bold text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {letter}
              </span>
              <div className="flex-1 h-5 rounded-full overflow-hidden relative"
                style={{ backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${(tf / maxFreq) * 100}%` }}
                />
                {showEnglishComparison && (
                  <div
                    className="absolute top-0 h-full w-0.5 bg-red-500 opacity-80"
                    style={{ left: `${(ef / maxFreq) * 100}%` }}
                    title={`English avg: ${ef.toFixed(1)}%`}
                  />
                )}
              </div>
              <span className={`w-14 text-right text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {tf.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
      {showEnglishComparison && (
        <div className="flex items-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 rounded bg-gradient-to-r from-indigo-500 to-purple-500" />
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Your text</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-3 bg-red-500 rounded" />
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>English average</span>
          </div>
        </div>
      )}
    </div>
  );
};