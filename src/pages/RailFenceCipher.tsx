import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherPlayground } from '../components/CipherPlayground';
import { railFenceEncrypt, railFenceDecrypt } from '../utils/ciphers';

export const RailFenceCipher: React.FC = () => {
  const { isDarkMode } = useTheme();

  const encrypt = (text: string, key: string) => {
    const rails = parseInt(key) || 3;
    return railFenceEncrypt(text, rails);
  };

  const decrypt = (text: string, key: string) => {
    const rails = parseInt(key) || 3;
    return railFenceDecrypt(text, rails);
  };

  const renderVisualization = (text: string, key: string) => {
    const rails = Math.max(2, Math.min(parseInt(key) || 3, 10));
    const displayText = text.slice(0, 20);
    
    // Build the zigzag pattern
    const fence: (string | null)[][] = Array.from({ length: rails }, () => 
      Array(displayText.length).fill(null)
    );
    
    let rail = 0;
    let direction = 1;
    for (let i = 0; i < displayText.length; i++) {
      fence[rail][i] = displayText[i];
      rail += direction;
      if (rail === rails - 1 || rail === 0) direction *= -1;
    }

    return (
      <div className="space-y-6">
        {/* Zigzag Visualization */}
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            📊 Rail Fence Pattern ({rails} Rails)
          </h4>
          <div className="overflow-x-auto">
            <div className={`inline-block p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              {fence.map((row, railIdx) => (
                <div key={railIdx} className="flex">
                  <span className={`w-12 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Rail {railIdx + 1}:
                  </span>
                  <div className="flex">
                    {row.map((char, colIdx) => (
                      <div
                        key={colIdx}
                        className={`w-8 h-8 flex items-center justify-center font-mono text-sm
                          ${char 
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-lg m-0.5' 
                            : ''
                          }`}
                      >
                        {char || ''}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reading Order */}
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            📖 Reading Order (Row by Row)
          </h4>
          <div className="flex flex-wrap gap-2">
            {fence.map((row, railIdx) => (
              <div key={railIdx} className="flex items-center gap-1">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>R{railIdx + 1}:</span>
                {row.filter(c => c !== null).map((char, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 flex items-center justify-center rounded font-mono font-bold
                      ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-700'}`}
                  >
                    {char === ' ' ? '␣' : char}
                  </div>
                ))}
                {railIdx < fence.length - 1 && (
                  <span className={`mx-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>+</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            🔒 Encrypted Result
          </h4>
          <div className={`inline-flex px-4 py-2 rounded-xl font-mono text-lg
            ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
            {railFenceEncrypt(displayText, rails)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Educational Content */}
      <div className={`rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📚 Understanding Rail Fence Cipher
        </h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            The <strong className="text-indigo-600">Rail Fence Cipher</strong> is a transposition cipher that 
            rearranges the plaintext by writing it in a zigzag pattern across a number of "rails" (rows).
          </p>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>How it works:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Write the plaintext in a zigzag pattern down and up the rails</li>
              <li>Read off each rail from left to right, starting from the top</li>
              <li>Concatenate all rails to get the ciphertext</li>
            </ol>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Example with 3 Rails:</h4>
            <pre className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
{`Plaintext: WEAREDISCOVERED

W . . . E . . . C . . . R . .
. E . R . D . S . O . E . E .
. . A . . . I . . . V . . . D

Reading row by row: WECR + ERDSOEE + AIVD = WECREDRSOEEAIVD`}
            </pre>
          </div>
        </div>
      </div>

      <CipherPlayground
        title="Rail Fence Cipher"
        description="A transposition cipher that writes text in a zigzag pattern."
        keyLabel="🚃 Number of Rails"
        keyPlaceholder="Enter number of rails (e.g., 3)"
        keyType="number"
        defaultKey="3"
        encrypt={encrypt}
        decrypt={decrypt}
        validateKey={(key) => {
          const rails = parseInt(key);
          if (isNaN(rails)) return { valid: false, error: 'Please enter a valid number' };
          if (rails < 2) return { valid: false, error: 'Need at least 2 rails' };
          if (rails > 10) return { valid: false, error: 'Maximum 10 rails for clarity' };
          return { valid: true };
        }}
        renderVisualization={renderVisualization}
      />
    </div>
  );
};
