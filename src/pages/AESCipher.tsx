import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import CryptoJS from 'crypto-js';

type KeySize = 128 | 192 | 256;

export const AESCipher: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [input, setInput] = useState('Hello World');
  const [key, setKey] = useState('mysecretkey123');
  const [keySize, setKeySize] = useState<KeySize>(256);
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [showSteps, setShowSteps] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);

  const getRounds = (size: KeySize) => {
    switch (size) {
      case 128: return 10;
      case 192: return 12;
      case 256: return 14;
    }
  };

  const rounds = getRounds(keySize);

  // Generate a key of proper length based on key size
  const generateKey = (passphrase: string, size: KeySize): CryptoJS.lib.WordArray => {
    const keyBytes = size / 8;
    return CryptoJS.PBKDF2(passphrase, CryptoJS.enc.Utf8.parse('salt'), {
      keySize: keyBytes / 4,
      iterations: 1000
    });
  };

  const handleEncrypt = () => {
    try {
      const derivedKey = generateKey(key, keySize);
      const iv = CryptoJS.lib.WordArray.random(16);
      const encrypted = CryptoJS.AES.encrypt(input, derivedKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      // Prepend IV to ciphertext for decryption
      const combined = iv.concat(encrypted.ciphertext);
      setOutput(CryptoJS.enc.Base64.stringify(combined));
    } catch (e) {
      setOutput('Encryption failed');
    }
  };

  const handleDecrypt = () => {
    try {
      const derivedKey = generateKey(key, keySize);
      const combined = CryptoJS.enc.Base64.parse(input);
      const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);
      const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4));
      
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext } as CryptoJS.lib.CipherParams,
        derivedKey,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      );
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      setOutput(result || 'Decryption failed - invalid data');
    } catch (e) {
      setOutput('Decryption failed - invalid key or ciphertext');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const roundSteps = [
    { name: 'SubBytes', desc: 'Non-linear byte substitution using S-box lookup table', icon: '🔄' },
    { name: 'ShiftRows', desc: 'Cyclically shift rows of the state matrix', icon: '↔️' },
    { name: 'MixColumns', desc: 'Mix data within each column (skipped in final round)', icon: '🔀' },
    { name: 'AddRoundKey', desc: 'XOR state with round subkey', icon: '🔑' }
  ];

  return (
    <div className="space-y-6">
      {/* Educational Content */}
      <div className={`rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📚 Understanding AES (Advanced Encryption Standard)
        </h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            <strong className="text-indigo-600">AES</strong> is the gold standard of modern symmetric encryption. 
            It was adopted by the U.S. government in 2001 and is used worldwide to protect sensitive data.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Key Features:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Symmetric block cipher</li>
                <li>128-bit block size</li>
                <li>Key sizes: 128, 192, or 256 bits</li>
                <li>Multiple rounds of substitution and permutation</li>
                <li>Extremely fast in both software and hardware</li>
              </ul>
            </div>
            
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Rounds by Key Size:</h4>
              <ul className="space-y-2">
                <li className={`p-2 rounded ${keySize === 128 ? 'bg-indigo-500 text-white' : ''}`}>
                  <strong>AES-128:</strong> 10 rounds
                </li>
                <li className={`p-2 rounded ${keySize === 192 ? 'bg-indigo-500 text-white' : ''}`}>
                  <strong>AES-192:</strong> 12 rounds
                </li>
                <li className={`p-2 rounded ${keySize === 256 ? 'bg-indigo-500 text-white' : ''}`}>
                  <strong>AES-256:</strong> 14 rounds
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tool */}
      <div className={`rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          🔐 AES Encryption Tool
        </h3>

        {/* Key Size Selection */}
        <div className="mb-6">
          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            🔢 Select Key Size (Determines Number of Rounds)
          </label>
          <div className="flex gap-2 flex-wrap">
            {([128, 192, 256] as KeySize[]).map((size) => (
              <button
                key={size}
                onClick={() => setKeySize(size)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  keySize === size
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-lg">{size}-bit</div>
                <div className="text-xs opacity-75">{getRounds(size)} rounds</div>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selection */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('encrypt')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              mode === 'encrypt'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}
          >
            🔒 Encrypt
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              mode === 'decrypt'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}
          >
            🔓 Decrypt
          </button>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {mode === 'encrypt' ? '📝 Plaintext' : '🔐 Ciphertext'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 rounded-xl font-mono ${
              isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
            } border-2 focus:border-indigo-500 focus:outline-none`}
            placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter ciphertext to decrypt...'}
          />
        </div>

        {/* Key Input */}
        <div className="mb-4">
          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            🔑 Secret Key (Password)
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl font-mono ${
              isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
            } border-2 focus:border-indigo-500 focus:outline-none`}
            placeholder="Enter your secret key"
          />
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Key is derived using PBKDF2 to create a {keySize}-bit key
          </p>
        </div>

        {/* Process Button */}
        <button
          onClick={mode === 'encrypt' ? handleEncrypt : handleDecrypt}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg hover:shadow-lg transition-all hover:scale-[1.02]"
        >
          {mode === 'encrypt' ? '🔒 Encrypt with AES-' + keySize : '🔓 Decrypt with AES-' + keySize}
        </button>

        {/* Output */}
        {output && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {mode === 'encrypt' ? '🔐 Encrypted Output' : '📝 Decrypted Output'}
              </label>
              <button
                onClick={copyToClipboard}
                className={`px-3 py-1 rounded text-sm ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                📋 Copy
              </button>
            </div>
            <div className={`p-4 rounded-xl font-mono break-all ${
              isDarkMode ? 'bg-gray-700 text-green-400' : 'bg-green-50 text-green-700 border-2 border-green-200'
            }`}>
              {output}
            </div>
          </div>
        )}
      </div>

      {/* Round Visualization */}
      <div className={`rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            🔄 AES-{keySize} Round Structure ({rounds} Rounds)
          </h3>
          <button
            onClick={() => setShowSteps(!showSteps)}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white font-semibold`}
          >
            {showSteps ? 'Hide Details' : 'Show Round Details'}
          </button>
        </div>

        {/* Round Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${
              isDarkMode ? 'bg-yellow-600' : 'bg-yellow-400'
            }`}>
              Initial Round
            </div>
            <div className="flex-1 flex gap-1">
              {Array.from({ length: rounds - 1 }, (_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentRound(i + 1)}
                  className={`flex-1 h-8 rounded cursor-pointer transition-all flex items-center justify-center text-xs font-bold ${
                    currentRound === i + 1
                      ? 'bg-indigo-500 text-white scale-110 shadow-lg'
                      : isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-400'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${
              isDarkMode ? 'bg-green-600' : 'bg-green-500'
            } text-white`}>
              Final Round
            </div>
          </div>
          <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Click on a round number to see details
          </p>
        </div>

        {showSteps && (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
              <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Round {currentRound || 1} Operations:
              </h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                {roundSteps.map((step, idx) => (
                  <div
                    key={step.name}
                    className={`p-4 rounded-xl text-center transition-all ${
                      isDarkMode ? 'bg-gray-600' : 'bg-white shadow'
                    } ${currentRound === rounds && step.name === 'MixColumns' ? 'opacity-50' : ''}`}
                  >
                    <div className="text-3xl mb-2">{step.icon}</div>
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {idx + 1}. {step.name}
                    </div>
                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {step.desc}
                    </div>
                    {currentRound === rounds && step.name === 'MixColumns' && (
                      <div className="text-xs text-orange-500 mt-1">(Skipped in final round)</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* State Matrix Visualization */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                📊 State Matrix (4×4 bytes = 128 bits)
              </h4>
              <div className="flex justify-center">
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: 16 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded flex items-center justify-center font-mono text-sm ${
                        isDarkMode ? 'bg-gray-600 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      S{Math.floor(i / 4)},{i % 4}
                    </div>
                  ))}
                </div>
              </div>
              <p className={`text-center text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Each cell represents 1 byte (8 bits) of the state
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Security Note */}
      <div className={`rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          🔒 Security & Usage
        </h3>
        <div className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>• <strong>AES-128:</strong> Secure for most applications</p>
          <p>• <strong>AES-192:</strong> Higher security margin</p>
          <p>• <strong>AES-256:</strong> Approved for TOP SECRET data by NSA</p>
          <p className="mt-3 text-sm">
            This demo uses CBC mode with PKCS7 padding. The IV is randomly generated and prepended to the ciphertext.
          </p>
        </div>
      </div>
    </div>
  );
};
