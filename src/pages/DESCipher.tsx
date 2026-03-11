import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherPlayground } from '../components/CipherPlayground';
import { desEncrypt, desDecrypt } from '../utils/ciphers';

export const DESCipher: React.FC = () => {
  const { isDarkMode } = useTheme();

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
            from the mid-1970s until AES was adopted. While now considered insecure due to its short key length, 
            it remains important for understanding modern cryptography.
          </p>
          
          <div className={`p-4 rounded-xl border-2 border-orange-300 ${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
            <h4 className={`font-bold mb-2 text-orange-600`}>⚠️ Security Warning:</h4>
            <p>
              DES is considered cryptographically broken and unsuitable for security applications. 
              Its 56-bit key can be brute-forced in hours using modern hardware. Use AES for real-world encryption.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Key Facts:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Block size: 64 bits</li>
                <li>Key size: 56 bits (64 with parity)</li>
                <li>16 rounds of processing</li>
                <li>Feistel network structure</li>
                <li>Developed by IBM, standardized in 1977</li>
              </ul>
            </div>
            
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Historical Impact:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>First widely-adopted encryption standard</li>
                <li>Sparked public cryptography research</li>
                <li>Led to development of 3DES and AES</li>
                <li>Still used in legacy systems</li>
              </ul>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🔄 DES Feistel Structure (16 Rounds):
            </h4>
            <div className="flex flex-wrap gap-4 mt-3">
              <div className={`flex-1 min-w-[200px] p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <div className="text-lg font-semibold mb-2">Initial Permutation (IP)</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Rearranges the 64 input bits
                </div>
              </div>
              <div className={`flex-1 min-w-[200px] p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <div className="text-lg font-semibold mb-2">16 Feistel Rounds</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Expansion → XOR → S-boxes → Permutation
                </div>
              </div>
              <div className={`flex-1 min-w-[200px] p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <div className="text-lg font-semibold mb-2">Final Permutation (FP)</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Inverse of initial permutation
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              📊 Feistel Round Function:
            </h4>
            <ol className="list-decimal list-inside space-y-1">
              <li><strong>Expansion:</strong> 32 bits → 48 bits using E-box</li>
              <li><strong>Key Mixing:</strong> XOR with 48-bit round subkey</li>
              <li><strong>Substitution:</strong> 48 bits → 32 bits using 8 S-boxes</li>
              <li><strong>Permutation:</strong> Rearrange the 32 bits using P-box</li>
              <li><strong>Swap:</strong> XOR with left half, then swap halves</li>
            </ol>
          </div>
        </div>
      </div>

      <CipherPlayground
        title="DES Encryption"
        description="Historic encryption standard - for educational purposes only."
        keyLabel="🔑 Secret Key"
        keyPlaceholder="Enter a secret key"
        defaultKey="secret8!"
        encrypt={desEncrypt}
        decrypt={desDecrypt}
        validateKey={(key) => {
          if (key.length < 4) return { valid: false, error: 'Key should be at least 4 characters' };
          return { valid: true };
        }}
      />

      {/* 3DES Note */}
      <div className={`rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          🔐 Triple DES (3DES)
        </h3>
        <p className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          To extend DES's lifetime, Triple DES applies DES three times with different keys:
        </p>
        <div className={`p-4 rounded-xl font-mono text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          Ciphertext = E<sub>K3</sub>(D<sub>K2</sub>(E<sub>K1</sub>(Plaintext)))
        </div>
        <p className={`mt-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          3DES provides effective key length of 112-168 bits, but is slower than AES and is being phased out.
        </p>
      </div>
    </div>
  );
};
