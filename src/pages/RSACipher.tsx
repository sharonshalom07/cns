import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { generateRSAKeys, rsaEncrypt, rsaDecrypt } from '../utils/ciphers';
import { Lock, Unlock, Copy, Check, Key } from 'lucide-react';

const PRIME_PAIRS = [
  { p: 61, q: 53, label: 'p=61, q=53' },
  { p: 17, q: 11, label: 'p=17, q=11' },
  { p: 23, q: 19, label: 'p=23, q=19' },
  { p: 31, q: 37, label: 'p=31, q=37' },
];

export const RSACipher: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [p, setP] = useState(61);
  const [q, setQ] = useState(53);
  const [keys, setKeys] = useState<{ n: number; e: number; d: number } | null>(null);
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [copied, setCopied] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newKeys = generateRSAKeys(p, q);
    setKeys(newKeys);
    if (!newKeys) {
      setError('Could not generate keys with these primes');
    } else {
      setError(null);
    }
  }, [p, q]);

  const handleEncrypt = () => {
    if (!keys) return;
    const result = rsaEncrypt(plaintext, keys.e, keys.n);
    setCiphertext(result);
  };

  const handleDecrypt = () => {
    if (!keys) return;
    const result = rsaDecrypt(ciphertext, keys.d, keys.n);
    setDecrypted(result);
  };

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const cardClass = `rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  const inputClass = `w-full p-4 rounded-xl border-2 transition-all duration-200
    ${isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500' 
      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
    } focus:outline-none`;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Educational Content */}
      <div className={cardClass + ' p-6'}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📚 Understanding RSA
        </h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            <strong className="text-indigo-600">RSA</strong> is an asymmetric (public-key) cryptosystem. 
            It uses a pair of keys: a public key for encryption and a private key for decryption.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🔑 Key Generation:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Choose two prime numbers: p and q</li>
                <li>Calculate n = p × q</li>
                <li>Calculate φ(n) = (p-1) × (q-1)</li>
                <li>Choose e where 1 &lt; e &lt; φ(n) and gcd(e, φ(n)) = 1</li>
                <li>Calculate d where d × e ≡ 1 (mod φ(n))</li>
                <li>Public key: (n, e), Private key: (n, d)</li>
              </ol>
            </div>
            
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🔐 Encryption/Decryption:
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Encryption:</strong> C = M<sup>e</sup> mod n</p>
                <p><strong>Decryption:</strong> M = C<sup>d</sup> mod n</p>
                <p className="mt-2 text-xs">
                  Where M is the message (as a number), C is the ciphertext, 
                  e is the public exponent, d is the private exponent, and n is the modulus.
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ⚠️ Demo Limitations:
            </h4>
            <p className="text-sm">
              This is a simplified educational demo using small primes. Real RSA uses 2048+ bit keys. 
              Each character is encrypted separately here, which is insecure. Production RSA uses 
              proper padding (OAEP) and typically encrypts symmetric keys, not raw data.
            </p>
          </div>
        </div>
      </div>

      {/* Key Generation */}
      <div className={cardClass + ' p-6'}>
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Key className="text-indigo-600" />
          Key Generation
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Prime p
            </label>
            <input
              type="number"
              value={p}
              onChange={(e) => setP(parseInt(e.target.value) || 2)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Prime q
            </label>
            <input
              type="number"
              value={q}
              onChange={(e) => setQ(parseInt(e.target.value) || 2)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Presets:</span>
          {PRIME_PAIRS.map((pair) => (
            <button
              key={pair.label}
              onClick={() => { setP(pair.p); setQ(pair.q); }}
              className={`px-3 py-1 rounded-lg text-sm transition-all
                ${p === pair.p && q === pair.q
                  ? 'bg-indigo-600 text-white'
                  : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {pair.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm mb-4">
            ⚠️ {error}
          </div>
        )}

        {keys && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                n = p × q
              </div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {keys.n}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {p} × {q}
              </div>
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
              <div className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                🔓 Public Key (n, e)
              </div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                ({keys.n}, {keys.e})
              </div>
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
              <div className={`text-sm font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                🔐 Private Key (n, d)
              </div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                ({keys.n}, {keys.d})
              </div>
            </div>
          </div>
        )}

        {keys && (
          <div className={`mt-4 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
            <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              📊 Calculation Details:
            </h4>
            <div className={`grid md:grid-cols-2 gap-2 text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div>φ(n) = (p-1) × (q-1) = {(p-1) * (q-1)}</div>
              <div>e = {keys.e} (coprime with φ(n))</div>
              <div>d = {keys.d} (d × e ≡ 1 mod φ(n))</div>
              <div>Verification: {keys.d} × {keys.e} mod {(p-1)*(q-1)} = {(keys.d * keys.e) % ((p-1)*(q-1))}</div>
            </div>
          </div>
        )}
      </div>

      {/* Encryption */}
      <div className={cardClass + ' p-6'}>
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Lock className="text-green-600" />
          Encryption (using Public Key)
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Plaintext Message
            </label>
            <textarea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder="Enter message to encrypt (short messages work best)..."
              rows={3}
              className={inputClass + ' resize-none'}
            />
          </div>
          
          <button
            onClick={handleEncrypt}
            disabled={!keys || !plaintext}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl
              hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Lock size={20} />
            Encrypt with Public Key
          </button>

          {ciphertext && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Ciphertext (numbers)
                </label>
                <button
                  onClick={() => handleCopy(ciphertext, 'cipher')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-sm
                    ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {copied === 'cipher' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <div className={`p-4 rounded-xl font-mono text-sm break-all
                ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'}`}>
                {ciphertext}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decryption */}
      <div className={cardClass + ' p-6'}>
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Unlock className="text-blue-600" />
          Decryption (using Private Key)
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Ciphertext (space-separated numbers)
            </label>
            <textarea
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
              placeholder="Enter ciphertext to decrypt..."
              rows={3}
              className={inputClass + ' resize-none'}
            />
          </div>
          
          <button
            onClick={handleDecrypt}
            disabled={!keys || !ciphertext}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl
              hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Unlock size={20} />
            Decrypt with Private Key
          </button>

          {decrypted && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Decrypted Message
                </label>
                <button
                  onClick={() => handleCopy(decrypted, 'decrypted')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-sm
                    ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {copied === 'decrypted' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <div className={`p-4 rounded-xl font-mono text-lg
                ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                {decrypted}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
