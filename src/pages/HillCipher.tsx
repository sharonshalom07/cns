import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherPlayground } from '../components/CipherPlayground';
import { hillEncrypt, hillDecrypt, parseHillKey, isHillKeyValid } from '../utils/ciphers';

const VALID_KEYS = [
  { name: 'Default (3,3,2,5)', value: '3,3,2,5' },
  { name: 'Key A (6,24,1,13)', value: '6,24,1,13' },
  { name: 'Key B (2,4,3,5)', value: '2,4,3,5' },
  { name: 'Key C (5,8,17,3)', value: '5,8,17,3' },
];

export const HillCipher: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState(VALID_KEYS[0].value);

  const encrypt = (text: string, key: string) => {
    const matrix = parseHillKey(key);
    if (!matrix) return 'Invalid key format';
    return hillEncrypt(text, matrix);
  };

  const decrypt = (text: string, key: string) => {
    const matrix = parseHillKey(key);
    if (!matrix) return 'Invalid key format';
    const result = hillDecrypt(text, matrix);
    return result;
  };

  const validateKey = (key: string): { valid: boolean; error?: string } => {
    const matrix = parseHillKey(key);
    if (!matrix) {
      return { valid: false, error: 'Invalid format. Use: a,b,c,d (e.g., 3,3,2,5)' };
    }
    if (!isHillKeyValid(matrix)) {
      return { 
        valid: false, 
        error: 'Matrix not invertible mod 26. The determinant must have a multiplicative inverse in mod 26. Try one of the preset keys below.' 
      };
    }
    return { valid: true };
  };

  const renderVisualization = (text: string, key: string) => {
    const matrix = parseHillKey(key);
    if (!matrix) return null;
    
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
    const paddedText = cleanText.length % 2 === 0 ? cleanText : cleanText + 'X';
    
    return (
      <div className="space-y-6">
        {/* Matrix Visualization */}
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            📊 Key Matrix (2×2)
          </h4>
          <div className="flex items-center gap-4">
            <div className={`inline-flex flex-col p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
              <div className="flex gap-4 text-xl font-mono">
                <span className="w-8 text-center text-indigo-600">{matrix[0][0]}</span>
                <span className="w-8 text-center text-indigo-600">{matrix[0][1]}</span>
              </div>
              <div className="flex gap-4 text-xl font-mono mt-2">
                <span className="w-8 text-center text-indigo-600">{matrix[1][0]}</span>
                <span className="w-8 text-center text-indigo-600">{matrix[1][1]}</span>
              </div>
            </div>
            <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              <p>Determinant: {(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0])}</p>
              <p>Det mod 26: {((matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % 26 + 26) % 26}</p>
            </div>
          </div>
        </div>

        {/* Step by Step Encryption */}
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            🔢 Matrix Multiplication Process
          </h4>
          <div className="space-y-4">
            {Array.from({ length: Math.ceil(paddedText.length / 2) }).map((_, pairIdx) => {
              const p1 = paddedText[pairIdx * 2] || 'X';
              const p2 = paddedText[pairIdx * 2 + 1] || 'X';
              const v1 = p1.charCodeAt(0) - 65;
              const v2 = p2.charCodeAt(0) - 65;
              
              const c1 = (matrix[0][0] * v1 + matrix[0][1] * v2) % 26;
              const c2 = (matrix[1][0] * v1 + matrix[1][1] * v2) % 26;
              
              return (
                <div key={pairIdx} className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex flex-wrap items-center gap-4 font-mono text-sm">
                    <div className="flex flex-col">
                      <span>[{matrix[0][0]} {matrix[0][1]}]</span>
                      <span>[{matrix[1][0]} {matrix[1][1]}]</span>
                    </div>
                    <span className="text-2xl">×</span>
                    <div className="flex flex-col">
                      <span>[{p1}={v1}]</span>
                      <span>[{p2}={v2}]</span>
                    </div>
                    <span className="text-2xl">=</span>
                    <div className="flex flex-col">
                      <span>[{matrix[0][0]}×{v1} + {matrix[0][1]}×{v2} = {matrix[0][0] * v1 + matrix[0][1] * v2}]</span>
                      <span>[{matrix[1][0]}×{v1} + {matrix[1][1]}×{v2} = {matrix[1][0] * v1 + matrix[1][1] * v2}]</span>
                    </div>
                    <span className="text-2xl">mod 26 =</span>
                    <div className="flex flex-col text-indigo-600 font-bold">
                      <span>[{c1} = {String.fromCharCode(c1 + 65)}]</span>
                      <span>[{c2} = {String.fromCharCode(c2 + 65)}]</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const additionalKeyInputs = (
    <div className="mt-3">
      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Or choose a preset valid key:
      </label>
      <div className="flex flex-wrap gap-2">
        {VALID_KEYS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => {
              setSelectedPreset(preset.value);
              const input = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (input) {
                input.value = preset.value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${selectedPreset === preset.value
                ? 'bg-indigo-600 text-white'
                : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Educational Content */}
      <div className={`rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📚 Understanding Hill Cipher
        </h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            The <strong className="text-indigo-600">Hill Cipher</strong> is a polygraphic substitution cipher based on 
            linear algebra. It uses matrix multiplication for encryption, making it more secure than simple substitution ciphers.
          </p>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>How it works:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>The key is a square matrix (we use 2×2 for simplicity)</li>
              <li>Plaintext is divided into blocks (pairs of letters for 2×2)</li>
              <li>Each block is converted to numbers (A=0, B=1, ..., Z=25)</li>
              <li>The block is multiplied by the key matrix, then taken mod 26</li>
              <li>Results are converted back to letters</li>
            </ul>
          </div>
          <div className={`p-4 rounded-xl border-2 border-red-300 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
            <h4 className={`font-bold mb-2 text-red-600`}>⚠️ Important - Matrix Invertibility:</h4>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              For decryption to work, the key matrix must be <strong>invertible modulo 26</strong>. This means:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>The determinant of the matrix cannot be 0</li>
              <li>The determinant must have a multiplicative inverse in mod 26</li>
              <li>GCD(determinant, 26) must equal 1</li>
              <li>Valid determinants mod 26: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25</li>
            </ul>
            <p className="mt-2 text-sm">
              Use the preset keys above - they are all guaranteed to be invertible!
            </p>
          </div>
        </div>
      </div>

      <CipherPlayground
        title="Hill Cipher"
        description="A polygraphic substitution cipher using matrix multiplication."
        keyLabel="🔢 Key Matrix (a,b,c,d for 2×2 matrix)"
        keyPlaceholder="Enter matrix values (e.g., 3,3,2,5)"
        defaultKey="3,3,2,5"
        encrypt={encrypt}
        decrypt={decrypt}
        validateKey={validateKey}
        renderVisualization={renderVisualization}
        additionalKeyInputs={additionalKeyInputs}
      />
    </div>
  );
};
