import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherPlayground } from '../components/CipherPlayground';
import { aesEncrypt, aesDecrypt } from '../utils/ciphers';

export const AESCipher: React.FC = () => {
  const { isDarkMode } = useTheme();

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
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AES Rounds:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>AES-128: 10 rounds</li>
                <li>AES-192: 12 rounds</li>
                <li>AES-256: 14 rounds</li>
              </ul>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🔄 AES Round Operations:
            </h4>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              <div className={`p-3 rounded-lg text-center ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <div className="text-2xl mb-1">1️⃣</div>
                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SubBytes</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Non-linear substitution using S-box
                </div>
              </div>
              <div className={`p-3 rounded-lg text-center ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <div className="text-2xl mb-1">2️⃣</div>
                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ShiftRows</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Cyclically shift rows
                </div>
              </div>
              <div className={`p-3 rounded-lg text-center ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <div className="text-2xl mb-1">3️⃣</div>
                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>MixColumns</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Mix data within columns
                </div>
              </div>
              <div className={`p-3 rounded-lg text-center ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <div className="text-2xl mb-1">4️⃣</div>
                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AddRoundKey</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  XOR with round key
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🔒 Security & Usage:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>No known practical attacks against properly implemented AES</li>
              <li>Used in HTTPS, VPNs, disk encryption, and more</li>
              <li>Approved for TOP SECRET data by NSA (AES-256)</li>
            </ul>
          </div>
        </div>
      </div>

      <CipherPlayground
        title="AES Encryption"
        description="Industry-standard symmetric encryption algorithm."
        keyLabel="🔑 Secret Key (Password)"
        keyPlaceholder="Enter a secret key"
        defaultKey="mysecretkey123"
        encrypt={aesEncrypt}
        decrypt={aesDecrypt}
        validateKey={(key) => {
          if (key.length < 4) return { valid: false, error: 'Key should be at least 4 characters' };
          return { valid: true };
        }}
      />

      {/* Technical Note */}
      <div className={`rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          ℹ️ Implementation Note
        </h3>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
          This demo uses CryptoJS library which implements AES with PKCS7 padding and CBC mode by default. 
          The key is derived from your passphrase using a key derivation function. In production systems, 
          proper key management and IV (Initialization Vector) handling is crucial.
        </p>
      </div>
    </div>
  );
};
