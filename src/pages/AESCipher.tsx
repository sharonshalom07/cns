import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherTabLayout } from '../components/CipherTabLayout';
import CryptoJS from 'crypto-js';

type KeySize = 128 | 192 | 256;
const getRounds = (s: KeySize) => s === 128 ? 10 : s === 192 ? 12 : 14;

const LearnTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const c = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  return (
    <div className="space-y-6">
      <div className={c}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📚 Understanding AES</h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p><strong className="text-indigo-600">AES</strong> (Advanced Encryption Standard) is the gold standard of symmetric encryption, adopted by the U.S. government in 2001. It operates on 128-bit blocks using 10, 12, or 14 rounds depending on key size.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Each Round:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li><strong>SubBytes</strong> — S-box substitution (non-linear)</li>
                <li><strong>ShiftRows</strong> — Cyclically shift rows</li>
                <li><strong>MixColumns</strong> — Mix column data (skipped in final round)</li>
                <li><strong>AddRoundKey</strong> — XOR with round subkey</li>
              </ol>
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Key Sizes:</h4>
              <ul className="space-y-2 text-sm">
                <li><strong>AES-128:</strong> 10 rounds — secure for most uses</li>
                <li><strong>AES-192:</strong> 12 rounds — higher margin</li>
                <li><strong>AES-256:</strong> 14 rounds — approved for TOP SECRET</li>
              </ul>
            </div>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📊 State Matrix (4×4)</h4>
            <div className="flex justify-center">
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 16 }, (_, i) => (
                  <div key={i} className={`w-12 h-12 rounded flex items-center justify-center font-mono text-sm ${isDarkMode ? 'bg-gray-600 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                    S{Math.floor(i / 4)},{i % 4}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [input, setInput] = useState('Hello World');
  const [key, setKey] = useState('mysecretkey123');
  const [keySize, setKeySize] = useState<KeySize>(256);
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;

  const deriveKey = (pw: string, size: KeySize) =>
    CryptoJS.PBKDF2(pw, CryptoJS.enc.Utf8.parse('salt'), { keySize: size / 32, iterations: 1000 });

  const handleProcess = () => {
    try {
      if (mode === 'encrypt') {
        const dk = deriveKey(key, keySize);
        const iv = CryptoJS.lib.WordArray.random(16);
        const enc = CryptoJS.AES.encrypt(input, dk, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        setOutput(CryptoJS.enc.Base64.stringify(iv.concat(enc.ciphertext)));
      } else {
        const dk = deriveKey(key, keySize);
        const combined = CryptoJS.enc.Base64.parse(input);
        const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);
        const ct = CryptoJS.lib.WordArray.create(combined.words.slice(4));
        const dec = CryptoJS.AES.decrypt({ ciphertext: ct } as CryptoJS.lib.CipherParams, dk, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        const r = dec.toString(CryptoJS.enc.Utf8);
        setOutput(r || 'Decryption failed');
      }
    } catch { setOutput('Operation failed — check key/data'); }
  };

  return (
    <div className="space-y-6">
      <div className={card}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🔐 AES Encryption Tool</h3>
        <div className="mb-4"><label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Key Size</label>
          <div className="flex gap-2">
            {([128, 192, 256] as KeySize[]).map((s) => (
              <button key={s} onClick={() => setKeySize(s)} className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${keySize === s ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                <div className="text-lg">{s}-bit</div><div className="text-xs opacity-75">{getRounds(s)} rounds</div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('encrypt')} className={`flex-1 py-3 rounded-xl font-semibold ${mode === 'encrypt' ? 'bg-green-500 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>🔒 Encrypt</button>
          <button onClick={() => setMode('decrypt')} className={`flex-1 py-3 rounded-xl font-semibold ${mode === 'decrypt' ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>🔓 Decrypt</button>
        </div>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} className={`w-full px-4 py-3 rounded-xl font-mono mb-4 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border-2 focus:border-indigo-500 focus:outline-none`} placeholder={mode === 'encrypt' ? 'Plaintext…' : 'Ciphertext…'} />
        <input value={key} onChange={(e) => setKey(e.target.value)} className={`w-full px-4 py-3 rounded-xl font-mono mb-4 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border-2 focus:border-indigo-500 focus:outline-none`} placeholder="Secret key" />
        <button onClick={handleProcess} className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg hover:shadow-lg transition-all">
          {mode === 'encrypt' ? `🔒 Encrypt AES-${keySize}` : `🔓 Decrypt AES-${keySize}`}
        </button>
        {output && <div className={`mt-4 p-4 rounded-xl font-mono break-all text-sm ${isDarkMode ? 'bg-gray-700 text-green-400' : 'bg-green-50 text-green-700 border-2 border-green-200'}`}>{output}</div>}
      </div>
    </div>
  );
};

const AttackTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  const attacks = [
    { name: 'Brute Force', icon: '🔨', time128: '~10³⁸ years', time256: '~10⁷⁷ years', desc: 'Try every possible key. Computationally infeasible for all AES key sizes.' },
    { name: 'Side-Channel', icon: '📡', time128: 'Varies', time256: 'Varies', desc: 'Exploit physical implementation (timing, power consumption, EM emissions) rather than the algorithm.' },
    { name: 'Related-Key', icon: '🔗', time128: '~2⁹⁹·⁵', time256: '~2⁹⁹·⁵', desc: 'Theoretical attack on AES-256 key schedule. Requires attacker to observe encryptions under related keys.' },
    { name: 'Biclique', icon: '🧮', time128: '~2¹²⁶·¹', time256: '~2²⁵⁴·⁴', desc: 'Best known theoretical attack. Reduces security by ~2 bits. Still utterly infeasible.' },
  ];
  return (
    <div className="space-y-6">
      <div className={card}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚔️ Known Attacks on AES</h3>
        <div className={`p-4 rounded-xl mb-4 ${isDarkMode ? 'bg-green-900/30 border border-green-600' : 'bg-green-50 border border-green-300'}`}>
          <p className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>✅ AES remains unbroken in practice. All known attacks are far from practical feasibility.</p>
        </div>
        <div className="space-y-4">
          {attacks.map((a) => (
            <div key={a.name} className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{a.icon}</span>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{a.name}</h4>
              </div>
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{a.desc}</p>
              <div className="flex gap-4 text-xs font-mono">
                <span className={isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}>AES-128: {a.time128}</span>
                <span className={isDarkMode ? 'text-purple-300' : 'text-purple-600'}>AES-256: {a.time256}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AESCipher: React.FC = () => (
  <CipherTabLayout tabs={[
    { id: 'learn', label: 'Learn', icon: '📖', content: <LearnTab /> },
    { id: 'tool', label: 'Encrypt / Decrypt', icon: '🔧', content: <ToolTab /> },
    { id: 'attacks', label: 'Security Analysis', icon: '⚔️', content: <AttackTab /> },
  ]} />
);