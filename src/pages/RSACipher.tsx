import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherTabLayout } from '../components/CipherTabLayout';
import { generateRSAKeys, rsaEncrypt, rsaDecrypt } from '../utils/ciphers';
import { Lock, Unlock, Copy, Check, Key } from 'lucide-react';

const PRIMES = [
  { p: 61, q: 53, label: 'p=61, q=53' },
  { p: 17, q: 11, label: 'p=17, q=11' },
  { p: 23, q: 19, label: 'p=23, q=19' },
  { p: 31, q: 37, label: 'p=31, q=37' },
];

const LearnTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const c = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  return (
    <div className="space-y-6">
      <div className={c}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📚 Understanding RSA</h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p><strong className="text-indigo-600">RSA</strong> is the most widely used asymmetric (public-key) cryptosystem. Security depends on the difficulty of factoring large numbers.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Key Generation:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Choose primes p, q</li><li>n = p × q</li><li>φ(n) = (p−1)(q−1)</li>
                <li>Choose e coprime with φ(n)</li><li>d = e⁻¹ mod φ(n)</li>
                <li>Public: (n, e) · Private: (n, d)</li>
              </ol>
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Operations:</h4>
              <div className="space-y-2 text-sm font-mono">
                <p>Encrypt: C = M<sup>e</sup> mod n</p>
                <p>Decrypt: M = C<sup>d</sup> mod n</p>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
            <h4 className="font-bold mb-2 text-yellow-600">⚠️ Demo Limitations</h4>
            <p className="text-sm">This uses small primes for education. Real RSA uses 2048+ bit keys and proper padding (OAEP).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [p, setP] = useState(61);
  const [q, setQ] = useState(53);
  const [keys, setKeys] = useState<{ n: number; e: number; d: number } | null>(null);
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => { setKeys(generateRSAKeys(p, q)); }, [p, q]);

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  const inp = `w-full p-4 rounded-xl border-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:border-indigo-500 focus:outline-none`;

  return (
    <div className="space-y-6">
      <div className={card}>
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}><Key className="text-indigo-600" /> Key Generation</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div><label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Prime p</label><input type="number" value={p} onChange={(e) => setP(parseInt(e.target.value) || 2)} className={inp} /></div>
          <div><label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Prime q</label><input type="number" value={q} onChange={(e) => setQ(parseInt(e.target.value) || 2)} className={inp} /></div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {PRIMES.map((pr) => (
            <button key={pr.label} onClick={() => { setP(pr.p); setQ(pr.q); }}
              className={`px-3 py-1 rounded-lg text-sm ${p === pr.p && q === pr.q ? 'bg-indigo-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{pr.label}</button>
          ))}
        </div>
        {keys && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>n = p×q</div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{keys.n}</div>
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
              <div className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>🔓 Public (n, e)</div>
              <div className={`text-xl font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>({keys.n}, {keys.e})</div>
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
              <div className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>🔐 Private (n, d)</div>
              <div className={`text-xl font-bold ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>({keys.n}, {keys.d})</div>
            </div>
          </div>
        )}
      </div>
      <div className={card}>
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}><Lock className="text-green-600" /> Encryption</h3>
        <textarea value={plaintext} onChange={(e) => setPlaintext(e.target.value)} rows={2} className={inp + ' resize-none mb-4'} placeholder="Message to encrypt…" />
        <button onClick={() => keys && setCiphertext(rsaEncrypt(plaintext, keys.e, keys.n))} disabled={!keys || !plaintext}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all">
          <Lock size={20} /> Encrypt
        </button>
        {ciphertext && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ciphertext</span>
              <button onClick={() => handleCopy(ciphertext, 'ct')} className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>{copied === 'ct' ? <Check size={14} /> : <Copy size={14} />}</button>
            </div>
            <div className={`p-4 rounded-xl font-mono text-sm break-all ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'}`}>{ciphertext}</div>
          </div>
        )}
      </div>
      <div className={card}>
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}><Unlock className="text-blue-600" /> Decryption</h3>
        <textarea value={ciphertext} onChange={(e) => setCiphertext(e.target.value)} rows={2} className={inp + ' resize-none mb-4'} placeholder="Ciphertext…" />
        <button onClick={() => keys && setDecrypted(rsaDecrypt(ciphertext, keys.d, keys.n))} disabled={!keys || !ciphertext}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">
          <Unlock size={20} /> Decrypt
        </button>
        {decrypted && <div className={`mt-4 p-4 rounded-xl font-mono text-lg ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>{decrypted}</div>}
      </div>
    </div>
  );
};

const AttackTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [targetN, setTargetN] = useState(3233);
  const [factorResult, setFactorResult] = useState<{ p: number; q: number; time: number } | null>(null);
  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;

  const factorize = (n: number): { p: number; q: number; time: number } | null => {
    const start = performance.now();
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return { p: i, q: n / i, time: performance.now() - start };
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className={card}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚔️ Attack RSA by Factoring n</h3>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          RSA's security relies on the difficulty of factoring n into p × q. For small n, this is trivial.
        </p>
        <div className="flex gap-4 items-end mb-4">
          <div className="flex-1">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Enter n to factor:</label>
            <input type="number" value={targetN} onChange={(e) => { setTargetN(parseInt(e.target.value) || 0); setFactorResult(null); }}
              className={`w-full p-3 rounded-xl ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border-2 focus:outline-none focus:border-indigo-500`} />
          </div>
          <button onClick={() => setFactorResult(factorize(targetN))}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all">
            🔨 Factor!
          </button>
        </div>
        {factorResult && (
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-900/30 border border-green-600' : 'bg-green-50 border border-green-300'}`}>
            <p className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
              ✅ Factored! {targetN} = {factorResult.p} × {factorResult.q}
            </p>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              Time: {factorResult.time.toFixed(3)} ms — With these factors, the private key can be computed instantly.
            </p>
          </div>
        )}
      </div>
      <div className={card}>
        <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📐 Factoring Difficulty by Key Size</h4>
        <div className="space-y-3">
          {[
            { bits: '512-bit', status: 'Broken (1999)', color: 'bg-red-500' },
            { bits: '768-bit', status: 'Broken (2009)', color: 'bg-red-500' },
            { bits: '1024-bit', status: 'Theoretically vulnerable', color: 'bg-yellow-500' },
            { bits: '2048-bit', status: 'Current standard ✅', color: 'bg-green-500' },
            { bits: '4096-bit', status: 'High security ✅', color: 'bg-emerald-500' },
          ].map((item) => (
            <div key={item.bits} className={`flex items-center gap-3 p-3 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <span className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className={`font-bold w-24 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.bits}</span>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const RSACipher: React.FC = () => (
  <CipherTabLayout tabs={[
    { id: 'learn', label: 'Learn', icon: '📖', content: <LearnTab /> },
    { id: 'tool', label: 'Encrypt / Decrypt', icon: '🔧', content: <ToolTab /> },
    { id: 'attacks', label: 'Attack Simulator', icon: '⚔️', content: <AttackTab /> },
  ]} />
);