import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherPlayground } from '../components/CipherPlayground';
import { caesarEncrypt, caesarDecrypt } from '../utils/ciphers';

export const CaesarCipher: React.FC = () => {
  const { isDarkMode } = useTheme();

  const encrypt = (text: string, key: string) => {
    const shift = parseInt(key) || 0;
    return caesarEncrypt(text, shift);
  };

  const decrypt = (text: string, key: string) => {
    const shift = parseInt(key) || 0;
    return caesarDecrypt(text, shift);
  };

  const renderVisualization = (text: string, key: string, mode: 'encrypt' | 'decrypt') => {
    const shift = parseInt(key) || 0;
    const actualShift = mode === 'decrypt' ? -shift : shift;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    return (
      <div className="space-y-6">
        {/* Alphabet Shift Visualization */}
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            📊 Alphabet Shift Visualization (Shift: {Math.abs(actualShift)})
          </h4>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex gap-1 mb-1">
                {alphabet.split('').map((char, i) => (
                  <div key={`orig-${i}`} className={`w-8 h-8 flex items-center justify-center rounded text-sm font-mono
                    ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {char}
                  </div>
                ))}
              </div>
              <div className={`text-center text-2xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>↓</div>
              <div className="flex gap-1 mt-1">
                {alphabet.split('').map((_, i) => {
                  const newIndex = ((i + actualShift) % 26 + 26) % 26;
                  return (
                    <div key={`shift-${i}`} className="w-8 h-8 flex items-center justify-center rounded text-sm font-mono
                      bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                      {alphabet[newIndex]}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Character by Character */}
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            🔤 Character-by-Character Transformation
          </h4>
          <div className="flex flex-wrap gap-2">
            {text.slice(0, 20).split('').map((char, i) => {
              const isLetter = char.match(/[a-z]/i);
              const result = isLetter ? caesarEncrypt(char, actualShift) : char;
              return (
                <div key={i} className={`flex flex-col items-center p-2 rounded-lg
                  ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className={`text-lg font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {char === ' ' ? '␣' : char}
                  </span>
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>↓</span>
                  <span className="text-lg font-mono text-indigo-600 font-bold">
                    {result === ' ' ? '␣' : result}
                  </span>
                </div>
              );
            })}
            {text.length > 20 && (
              <div className={`flex items-center px-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>...</div>
            )}
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
          📚 Understanding Caesar Cipher
        </h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            The <strong className="text-indigo-600">Caesar Cipher</strong> is one of the simplest and most widely known 
            encryption techniques. It's named after Julius Caesar, who used it in his private correspondence.
          </p>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>How it works:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Each letter in the plaintext is shifted by a fixed number of positions in the alphabet</li>
              <li>For example, with a shift of 3: A → D, B → E, C → F, etc.</li>
              <li>The shift can be any number from 1 to 25</li>
              <li>To decrypt, simply shift in the opposite direction</li>
            </ul>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚡ Fun Fact:</h4>
            <p>
              ROT13 is a special case of Caesar cipher where the shift is 13. Since the alphabet has 26 letters, 
              applying ROT13 twice returns the original text!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Playground */}
      <CipherPlayground
        title="Caesar Cipher"
        description="Shift each letter by a fixed number of positions in the alphabet."
        keyLabel="🔢 Shift Value (1-25)"
        keyPlaceholder="Enter shift value (e.g., 3)"
        keyType="number"
        defaultKey="3"
        encrypt={encrypt}
        decrypt={decrypt}
        validateKey={(key) => {
          const shift = parseInt(key);
          if (isNaN(shift)) return { valid: false, error: 'Please enter a valid number' };
          if (shift < 0 || shift > 25) return { valid: false, error: 'Shift must be between 0 and 25' };
          return { valid: true };
        }}
        renderVisualization={renderVisualization}
      />
    </div>
  );
};
