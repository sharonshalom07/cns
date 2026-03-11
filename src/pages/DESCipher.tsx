import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import CryptoJS from 'crypto-js';
export const DESCipher: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [input, setInput] = useState('Hello World');
  const [key, setKey] = useState('secret8!');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [showSteps, setShowSteps] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [useTrippleDES, setUseTrippleDES] = useState(false);
  const TOTAL_ROUNDS = 16;
  const handleEncrypt = () => {
    try {
      if (useTrippleDES) {
        const encrypted = CryptoJS.TripleDES.encrypt(input, key);
        setOutput(encrypted.toString());
      } else {
        const encrypted = CryptoJS.DES.encrypt(input, key);
        setOutput(encrypted.toString());
      }
    } catch (e) {
      setOutput('Encryption failed');
    }
  };
  const handleDecrypt = () => {
    try {
      if (useTrippleDES) {
        const bytes = CryptoJS.TripleDES.decrypt(input, key);
        const result = bytes.toString(CryptoJS.enc.Utf8);
        setOutput(result || 'Decryption failed');
      } else {
        const bytes = CryptoJS.DES.decrypt(input, key);
        const result = bytes.toString(CryptoJS.enc.Utf8);
        setOutput(result || 'Decryption failed');
      }
    } catch (e) {
      setOutput('Decryption failed - invalid key or ciphertext');
    }
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };
  const feistelSteps = [
    { name: 'Expansion (E)', bits: '32→48', desc: 'Expand right half using E-box', color: 'blue' },
    { name: 'Key XOR', bits: '48 bits', desc: 'XOR with 48-bit round subkey', color: 'yellow' },
    { name: 'S-Box Substitution', bits: '48→32', desc: '8 S-boxes compress data', color: 'purple' },
    { name: 'Permutation (P)', bits: '32 bits', desc: 'Rearrange bits using P-box', color: 'green' },
    { name: 'XOR with Left', bits: '32 bits', desc: 'XOR result with left half', color: 'red' },
    { name: 'Swap Halves', bits: '64 bits', desc: 'Swap left and right for next round', color: 'indigo' },
  ];
  return (
    <div className="space-y-6">
      {/* Educational Content */}
      <div className={`rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📚 Understanding DES (Data Encryption Standard)
        </h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            <strong className="text-indigo-600">DES</strong> was the dominant symmetric encryption algorithm 
            from the mid-1970s until AES was adopted. It uses a <strong>Feistel network</strong> structure 
            with exactly <strong>16 rounds</strong>.
          </p>
          
          <div className={`p-4 rounded-xl border-2 border-orange-300 ${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
            <h4 className="font-bold mb-2 text-orange-600">⚠️ Security Warning:</h4>
            <p>
              DES is considered cryptographically broken and unsuitable for security applications. 
              Its 56-bit key can be brute-forced in hours using modern hardware. Use AES for real-world encryption.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📐 Structure</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Block size: 64 bits</li>
                <li>Key size: 56 bits (64 with parity)</li>
                <li><strong>16 rounds</strong> of processing</li>
                <li>Feistel network structure</li>
              </ul>
            </div>
            
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🔑 Key Schedule</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>56-bit key → 16 subkeys</li>
                <li>Each subkey is 48 bits</li>
                <li>Derived through shifts & permutations</li>
              </ul>
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🔄 Triple DES (3DES)</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Applies DES 3 times</li>
                <li>Effective key: 112-168 bits</li>
                <li>E(K3, D(K2, E(K1, M)))</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Interactive Tool */}
      <div className={`rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          🔐 DES Encryption Tool
        </h3>
        {/* DES vs 3DES Selection */}
        <div className="mb-6">
          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            🔢 Select Algorithm
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setUseTrippleDES(false)}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
                !useTrippleDES
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-lg">DES</div>
              <div className="text-xs opacity-75">16 rounds • 56-bit key</div>
            </button>
            <button
              onClick={() => setUseTrippleDES(true)}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
                useTrippleDES
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-lg">Triple DES (3DES)</div>
              <div className="text-xs opacity-75">48 rounds (16×3) • 168-bit key</div>
            </button>
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
            🔑 Secret Key
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
        </div>
        {/* Process Button */}
        <button
          onClick={mode === 'encrypt' ? handleEncrypt : handleDecrypt}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg hover:shadow-lg transition-all hover:scale-[1.02]"
        >
          {mode === 'encrypt' 
            ? `🔒 Encrypt with ${useTrippleDES ? '3DES (48 rounds)' : 'DES (16 rounds)'}`
            : `🔓 Decrypt with ${useTrippleDES ? '3DES (48 rounds)' : 'DES (16 rounds)'}`
          }
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
            🔄 DES Feistel Structure (16 Rounds)
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
        {/* Round Selector */}
        <div className="mb-6">
          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Select Round to View (1-16):
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="16"
              value={currentRound}
              onChange={(e) => setCurrentRound(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className={`w-16 text-center py-2 rounded-lg font-bold text-lg ${
              isDarkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
            }`}>
              {currentRound}
            </div>
          </div>
          
          {/* Round Progress Indicators */}
          <div className="flex gap-1 mt-3">
            {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentRound(i + 1)}
                className={`flex-1 h-8 rounded text-xs font-bold transition-all ${
                  currentRound === i + 1
                    ? 'bg-indigo-500 text-white scale-110 shadow-lg'
                    : i + 1 < currentRound
                    ? isDarkMode ? 'bg-green-700 text-white' : 'bg-green-400 text-white'
                    : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        {showSteps && (
          <div className="space-y-4">
            {/* Feistel Round Diagram */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <h4 className={`font-bold mb-3 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Round {currentRound} Feistel Function Operations
              </h4>
              
              {/* Visual Flow */}
              <div className="flex justify-center mb-4">
                <div className="flex flex-col items-center">
                  {/* Input */}
                  <div className="flex gap-4 mb-2">
                    <div className={`px-4 py-2 rounded-lg font-mono text-sm ${
                      isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      Left (32 bits)
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-mono text-sm ${
                      isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                    }`}>
                      Right (32 bits)
                    </div>
                  </div>
                  
                  <div className={`text-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>↓</div>
                  
                  {/* Feistel Function */}
                  <div className={`px-6 py-3 rounded-xl text-center ${
                    isDarkMode ? 'bg-yellow-600' : 'bg-yellow-400'
                  }`}>
                    <div className="font-bold">f(R, K{currentRound})</div>
                    <div className="text-xs">Feistel Function</div>
                  </div>
                  
                  <div className={`text-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>↓</div>
                  
                  {/* XOR and Swap */}
                  <div className={`px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'
                  }`}>
                    L' = L ⊕ f(R, K{currentRound})
                  </div>
                  
                  <div className={`text-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>↓</div>
                  
                  {/* Output */}
                  <div className="flex gap-4">
                    <div className={`px-4 py-2 rounded-lg font-mono text-sm ${
                      isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                    }`}>
                      New Left = R
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-mono text-sm ${
                      isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      New Right = L'
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Step Details */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
              <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Feistel Function Steps:
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {feistelSteps.map((step, idx) => (
                  <div
                    key={step.name}
                    className={`p-4 rounded-xl transition-all ${
                      isDarkMode ? 'bg-gray-600' : 'bg-white shadow'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold bg-${step.color}-500`}
                        style={{ backgroundColor: 
                          step.color === 'blue' ? '#3B82F6' :
                          step.color === 'yellow' ? '#EAB308' :
                          step.color === 'purple' ? '#8B5CF6' :
                          step.color === 'green' ? '#22C55E' :
                          step.color === 'red' ? '#EF4444' : '#6366F1'
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {step.name}
                      </span>
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {step.desc}
                    </div>
                    <div className={`text-xs mt-1 font-mono ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                      {step.bits}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* S-Box Info */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                📦 S-Boxes (Substitution Boxes)
              </h4>
              <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                DES uses 8 different S-boxes, each taking 6 bits of input and producing 4 bits of output.
                This is the only non-linear operation in DES and provides its security.
              </p>
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded text-center font-bold ${
                      isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-400 text-white'
                    }`}
                  >
                    S{i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};