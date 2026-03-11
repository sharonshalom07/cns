import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherPlayground } from '../components/CipherPlayground';
import { vigenereEncrypt, vigenereDecrypt } from '../utils/ciphers';

export const VigenereCipher: React.FC = () => {
  const { isDarkMode } = useTheme();

  const renderVisualization = (text: string, key: string, mode: 'encrypt' | 'decrypt') => {
    const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
    const textChars = text.slice(0, 15).split('');
    
    return (
      <div className="space-y-6">
        {/* Vigenère Table (simplified) */}
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            📊 Vigenère Square (Key: {keyUpper})
          </h4>
          <div className="overflow-x-auto">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className={`p-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}></th>
                  {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => (
                    <th key={c} className={`w-6 h-6 text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {keyUpper.split('').slice(0, 5).map((keyChar, rowIdx) => {
                  const shift = keyChar.charCodeAt(0) - 65;
                  return (
                    <tr key={rowIdx}>
                      <td className={`p-2 font-bold text-indigo-600`}>{keyChar}</td>
                      {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((_, colIdx) => {
                        const newChar = String.fromCharCode(((colIdx + shift) % 26) + 65);
                        return (
                          <td key={colIdx} className={`w-6 h-6 text-xs font-mono text-center
                            ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {newChar}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step by Step */}
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            🔤 Step-by-Step Encryption
          </h4>
          <div className="space-y-2">
            <div className="flex gap-2 items-center flex-wrap">
              <span className={`w-20 font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Plain:</span>
              {textChars.map((char, i) => (
                <div key={`p-${i}`} className={`w-8 h-8 flex items-center justify-center rounded font-mono
                  ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  {char === ' ' ? '␣' : char.toUpperCase()}
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <span className={`w-20 font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Key:</span>
              {textChars.map((char, i) => {
                const isLetter = char.match(/[a-z]/i);
                let keyIdx = 0;
                for (let j = 0; j < i; j++) {
                  if (textChars[j].match(/[a-z]/i)) keyIdx++;
                }
                return (
                  <div key={`k-${i}`} className={`w-8 h-8 flex items-center justify-center rounded font-mono
                    ${isLetter ? 'bg-indigo-100 text-indigo-700' : isDarkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-50 text-gray-300'}`}>
                    {isLetter ? keyUpper[keyIdx % keyUpper.length] : '-'}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <span className={`w-20 font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cipher:</span>
              {textChars.map((char, i) => {
                const result = mode === 'encrypt' 
                  ? vigenereEncrypt(text.slice(0, i + 1), keyUpper).slice(-1)
                  : vigenereDecrypt(text.slice(0, i + 1), keyUpper).slice(-1);
                return (
                  <div key={`c-${i}`} className="w-8 h-8 flex items-center justify-center rounded font-mono
                    bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                    {char === ' ' ? '␣' : result.toUpperCase()}
                  </div>
                );
              })}
            </div>
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
          📚 Understanding Vigenère Cipher
        </h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            The <strong className="text-indigo-600">Vigenère Cipher</strong> is a polyalphabetic substitution cipher
            that uses a keyword to determine the shift for each letter. It was considered unbreakable for 300 years!
          </p>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>How it works:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Choose a keyword (e.g., "KEY")</li>
              <li>Repeat the keyword to match the length of the plaintext</li>
              <li>Each letter in the keyword determines the shift for the corresponding plaintext letter</li>
              <li>A = 0 shift, B = 1 shift, C = 2 shift, ..., Z = 25 shift</li>
            </ul>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Example:</h4>
            <p>Plaintext: HELLO, Key: KEY</p>
            <p>Key repeated: KEYKE</p>
            <p>H + K(10) = R, E + E(4) = I, L + Y(24) = J, L + K(10) = V, O + E(4) = S</p>
            <p>Ciphertext: RIJVS</p>
          </div>
        </div>
      </div>

      <CipherPlayground
        title="Vigenère Cipher"
        description="A polyalphabetic cipher that uses a keyword for variable shifts."
        keyLabel="🔑 Keyword"
        keyPlaceholder="Enter keyword (e.g., SECRET)"
        defaultKey="KEY"
        encrypt={vigenereEncrypt}
        decrypt={vigenereDecrypt}
        validateKey={(key) => {
          const cleaned = key.replace(/[^a-zA-Z]/g, '');
          if (cleaned.length === 0) return { valid: false, error: 'Please enter a keyword with letters' };
          return { valid: true };
        }}
        renderVisualization={renderVisualization}
      />
    </div>
  );
};
