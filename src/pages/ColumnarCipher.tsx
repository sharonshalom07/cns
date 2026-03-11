import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherPlayground } from '../components/CipherPlayground';
import { columnTranspositionEncrypt, columnTranspositionDecrypt } from '../utils/ciphers';

export const ColumnarCipher: React.FC = () => {
  const { isDarkMode } = useTheme();

  const renderVisualization = (text: string, key: string) => {
    const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
    const numCols = keyUpper.length;
    const numRows = Math.ceil(text.length / numCols);
    const paddedText = text.padEnd(numRows * numCols, 'X');
    
    // Create grid
    const grid: string[][] = [];
    for (let i = 0; i < numRows; i++) {
      grid.push(paddedText.slice(i * numCols, (i + 1) * numCols).split(''));
    }
    
    // Get column order
    const keyOrder = keyUpper.split('').map((char, i) => ({ char, i, order: 0 }));
    const sorted = [...keyOrder].sort((a, b) => a.char.localeCompare(b.char));
    sorted.forEach((item, idx) => { keyOrder[item.i].order = idx + 1; });

    return (
      <div className="space-y-6">
        {/* Grid Visualization */}
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            📊 Column Arrangement (Key: {keyUpper})
          </h4>
          <div className="overflow-x-auto">
            <table className={`border-collapse ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <thead>
                <tr>
                  {keyUpper.split('').map((char, i) => (
                    <th key={i} className={`w-10 h-10 text-center font-bold
                      ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-500'} text-white rounded-t-lg`}>
                      {char}
                    </th>
                  ))}
                </tr>
                <tr>
                  {keyOrder.map((item, i) => (
                    <th key={i} className={`w-10 h-6 text-center text-xs
                      ${isDarkMode ? 'bg-indigo-800' : 'bg-indigo-200'} 
                      ${isDarkMode ? 'text-indigo-200' : 'text-indigo-800'}`}>
                      #{item.order}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((char, colIdx) => (
                      <td key={colIdx} className={`w-10 h-10 text-center font-mono border
                        ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                        {char === ' ' ? '␣' : char}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reading Order */}
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            📖 Reading Order (By Column Number)
          </h4>
          <div className="space-y-2">
            {sorted.map(({ char, i, order }) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-24 font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Col #{order} ({char}):
                </span>
                <div className="flex gap-1">
                  {grid.map((row, rowIdx) => (
                    <div
                      key={rowIdx}
                      className={`w-8 h-8 flex items-center justify-center rounded font-mono
                        ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-700'}`}
                    >
                      {row[i] === ' ' ? '␣' : row[i]}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            🔒 Encrypted Result
          </h4>
          <div className={`inline-flex px-4 py-2 rounded-xl font-mono text-lg break-all
            ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
            {columnTranspositionEncrypt(text, keyUpper)}
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
          📚 Understanding Column Transposition
        </h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            The <strong className="text-indigo-600">Columnar Transposition Cipher</strong> rearranges the plaintext 
            by writing it row by row into columns, then reading the columns in a specific order determined by a keyword.
          </p>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>How it works:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Write the keyword above the grid</li>
              <li>Number the columns based on alphabetical order of keyword letters</li>
              <li>Write the plaintext row by row under the keyword</li>
              <li>Pad with 'X' if needed to fill the last row</li>
              <li>Read columns in numerical order to get ciphertext</li>
            </ol>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Example:</h4>
            <pre className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
{`Keyword: ZEBRA
Column order: Z(5) E(2) B(1) R(4) A(1)

Z E B R A
5 2 1 4 1
-------
H E L L O
W O R L D

Reading by column numbers:
Col 1(A): OD
Col 2(B): LR  
Col 3(E): EO
Col 4(R): LL
Col 5(Z): HW

Ciphertext: ODLREOLLHW`}
            </pre>
          </div>
        </div>
      </div>

      <CipherPlayground
        title="Columnar Transposition"
        description="A transposition cipher that rearranges text by columns using a keyword."
        keyLabel="🔑 Keyword"
        keyPlaceholder="Enter keyword (e.g., ZEBRA)"
        defaultKey="ZEBRA"
        encrypt={columnTranspositionEncrypt}
        decrypt={columnTranspositionDecrypt}
        validateKey={(key) => {
          const cleaned = key.replace(/[^a-zA-Z]/g, '');
          if (cleaned.length === 0) return { valid: false, error: 'Please enter a keyword with letters' };
          if (cleaned.length < 2) return { valid: false, error: 'Keyword should be at least 2 letters' };
          return { valid: true };
        }}
        renderVisualization={renderVisualization}
      />
    </div>
  );
};
