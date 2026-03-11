import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherPlayground } from '../components/CipherPlayground';
import { playfairEncrypt, playfairDecrypt, getPlayfairMatrix } from '../utils/ciphers';

export const PlayfairCipher: React.FC = () => {
  const { isDarkMode } = useTheme();

  const renderVisualization = (text: string, key: string) => {
    const matrix = getPlayfairMatrix(key);
    
    return (
      <div className="space-y-6">
        {/* 5x5 Matrix */}
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            📊 Playfair 5×5 Matrix (Key: {key.toUpperCase() || 'NONE'})
          </h4>
          <div className="inline-block">
            <div className={`grid grid-cols-5 gap-1 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
              {matrix.flat().map((char, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono text-lg font-bold
                    ${key.toUpperCase().includes(char) 
                      ? 'bg-indigo-600 text-white' 
                      : isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-white text-gray-700'
                    }`}
                >
                  {char}
                </div>
              ))}
            </div>
          </div>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Note: I and J are combined (J → I)
          </p>
        </div>

        {/* Rules */}
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            📜 Encryption Rules
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
              <div className="text-2xl mb-2">↔️</div>
              <h5 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Same Row</h5>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Take the letter to the right (wrap around)
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
              <div className="text-2xl mb-2">↕️</div>
              <h5 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Same Column</h5>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Take the letter below (wrap around)
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
              <div className="text-2xl mb-2">🔄</div>
              <h5 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Rectangle</h5>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Swap corners on the same row
              </p>
            </div>
          </div>
        </div>

        {/* Digraph Processing */}
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            🔤 Digraph (Pair) Processing
          </h4>
          <div className="flex flex-wrap gap-2">
            {(() => {
              let cleanText = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
              let processed = '';
              for (let i = 0; i < cleanText.length; i++) {
                processed += cleanText[i];
                if (i + 1 < cleanText.length && cleanText[i] === cleanText[i + 1]) {
                  processed += 'X';
                }
              }
              if (processed.length % 2 !== 0) processed += 'X';
              
              const pairs = [];
              for (let i = 0; i < Math.min(processed.length, 10); i += 2) {
                pairs.push(processed.slice(i, i + 2));
              }
              
              return pairs.map((pair, i) => (
                <div key={i} className={`px-4 py-2 rounded-lg font-mono text-lg
                  ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                  {pair}
                </div>
              ));
            })()}
          </div>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Repeated letters are separated by 'X'. Odd-length text is padded with 'X'.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Educational Content */}
      <div className={`rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📚 Understanding Playfair Cipher
        </h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            The <strong className="text-indigo-600">Playfair Cipher</strong> encrypts pairs of letters (digraphs) 
            using a 5×5 matrix constructed from a keyword. It was the first practical digraph substitution cipher.
          </p>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>How it works:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Create a 5×5 matrix using the keyword (remove duplicates, I/J combined)</li>
              <li>Fill remaining cells with unused letters of alphabet</li>
              <li>Split plaintext into digraphs (pairs of letters)</li>
              <li>If a pair has two same letters, insert 'X' between them</li>
              <li>For each pair, apply the encryption rules based on their positions</li>
            </ol>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚡ Historical Note:</h4>
            <p>
              The Playfair cipher was used by the British in World War I and by the Australians during World War II. 
              It was considered secure enough for tactical purposes due to its resistance to frequency analysis.
            </p>
          </div>
        </div>
      </div>

      <CipherPlayground
        title="Playfair Cipher"
        description="A digraph substitution cipher using a 5×5 keyword matrix."
        keyLabel="🔑 Keyword"
        keyPlaceholder="Enter keyword (e.g., MONARCHY)"
        defaultKey="MONARCHY"
        encrypt={playfairEncrypt}
        decrypt={playfairDecrypt}
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
