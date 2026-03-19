import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherTabLayout } from '../components/CipherTabLayout';
import CryptoJS from 'crypto-js';

const LearnTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const c = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  return (
    <div className="space-y-6">
      <div className={c}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📚 Understanding DES</h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p><strong className="text-indigo-600">DES</strong> (Data Encryption Standard) dominated from the 1970s until AES replaced it. It uses a <strong>Feistel network</strong> with 16 rounds on 64-bit blocks.</p>
          <div className={`p-4 rounded-xl border-2 border-orange-300 ${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
            <h4 className="font-bold mb-2 text-orange-600">⚠️ Insecure!</h4>
            <p>DES's 56-bit key can be brute-forced in hours. Use AES for real-world encryption.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Structure</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>64-bit block size</li><li>56-bit key</li><li>16 rounds</li><li>Feistel network</li>
              </ul>
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Feistel Round</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Expansion (32→48 bits)</li><li>Key XOR</li><li>S-box substitution</li>
                <li>P-box permutation</li><li>XOR with left half</li><li>Swap halves</li>
              </ol>
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Triple DES</h4>
              <p className="text-sm">Applies DES 3 times: E(K3, D(K2, E(K1, M))). Effective key: 112-168 bits.</p>
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
  const [key, setKey] = useState('secret8!');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [use3DES, setUse3DES] = useState(false);
  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;

  const process = () => {
    try {
      const algo = use3DES ? CryptoJS.TripleDES : CryptoJS.DES;
      if (mode === 'encrypt') setOutput(algo.encrypt(input, key).toString());
      else {
        const r = algo.decrypt(input, key).toString(CryptoJS.enc.Utf8);
        setOutput(r || 'Decryption failed');
      }
    } catch { setOutput('Operation failed'); }
  };

  return (
    <div className="space-y-6">
      <div className={card}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🔐 DES Encryption Tool</h3>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setUse3DES(false)} className={`flex-1 px-4 py-3 rounded-xl font-semibold ${!use3DES ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}><div>DES</div><div className="text-xs opacity-75">16 rounds • 56-bit</div></button>
          <button onClick={() => setUse3DES(true)} className={`flex-1 px-4 py-3 rounded-xl font-semibold ${use3DES ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}><div>3DES</div><div className="text-xs opacity-75">48 rounds • 168-bit</div></button>
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('encrypt')} className={`flex-1 py-3 rounded-xl font-semibold ${mode === 'encrypt' ? 'bg-green-500 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>🔒 Encrypt</button>
          <button onClick={() => setMode('decrypt')} className={`flex-1 py-3 rounded-xl font-semibold ${mode === 'decrypt' ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>🔓 Decrypt</button>
        </div>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} className={`w-full px-4 py-3 rounded-xl font-mono mb-4 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border-2 focus:border-indigo-500 focus:outline-none`} />
        <input value={key} onChange={(e) => setKey(e.target.value)} className={`w-full px-4 py-3 rounded-xl font-mono mb-4 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border-2 focus:border-indigo-500 focus:outline-none`} placeholder="Secret key" />
        <button onClick={process} className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg hover:shadow-lg transition-all">
          {mode === 'encrypt' ? '🔒' : '🔓'} {use3DES ? '3DES' : 'DES'}
        </button>
        {output && <div className={`mt-4 p-4 rounded-xl font-mono break-all text-sm ${isDarkMode ? 'bg-gray-700 text-green-400' : 'bg-green-50 text-green-700 border-2 border-green-200'}`}>{output}</div>}
      </div>
    </div>
  );
};

const AttackTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  return (
    <div className="space-y-6">
      <div className={card}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚔️ DES Has Been Broken</h3>
        <div className={`p-4 rounded-xl mb-4 ${isDarkMode ? 'bg-red-900/30 border border-red-600' : 'bg-red-50 border border-red-300'}`}>
          <p className={`font-bold ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>❌ DES is cryptographically broken and should never be used for security.</p>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Brute Force', year: '1998', desc: 'EFF\'s "Deep Crack" machine cracked DES in 56 hours for $250,000. Today it takes minutes.', icon: '🔨' },
            { name: 'Differential Cryptanalysis', year: '1991', desc: 'Biham & Shamir showed DES can be broken with 2⁴⁷ chosen plaintexts. IBM knew about this during design.', icon: '🔬' },
            { name: 'Linear Cryptanalysis', year: '1993', desc: 'Matsui\'s attack requires 2⁴³ known plaintexts — practical with enough data.', icon: '📐' },
          ].map((a) => (
            <div key={a.name} className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{a.icon}</span>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{a.name} ({a.year})</h4>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={card}>
        <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⏱️ Brute Force Time Comparison</h4>
        <div className="space-y-2">
          {[
            { label: 'DES (2⁵⁶)', time: '~6 minutes', width: '2%', color: 'bg-red-500' },
            { label: '3DES (2¹¹²)', time: '~800 years', width: '30%', color: 'bg-yellow-500' },
            { label: 'AES-128 (2¹²⁸)', time: '~10²⁵ years', width: '60%', color: 'bg-green-500' },
            { label: 'AES-256 (2²⁵⁶)', time: '~10⁶⁵ years', width: '100%', color: 'bg-emerald-500' },
          ].map((b) => (
            <div key={b.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{b.label}</span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{b.time}</span>
              </div>
              <div className={`h-4 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className={`h-full rounded-full ${b.color}`} style={{ width: b.width }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DESCipher: React.FC = () => (
  <CipherTabLayout tabs={[
    { id: 'learn', label: 'Learn', icon: '📖', content: <LearnTab /> },
    { id: 'tool', label: 'Encrypt / Decrypt', icon: '🔧', content: <ToolTab /> },
    { id: 'attacks', label: 'Security Analysis', icon: '⚔️', content: <AttackTab /> },
  ]} />
);