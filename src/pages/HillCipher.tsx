import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherTabLayout } from '../components/CipherTabLayout';
import { CipherPlayground } from '../components/CipherPlayground';
import { hillEncrypt, hillDecrypt, parseHillKey, isHillKeyValid } from '../utils/ciphers';

const VALID_KEYS = [
  { name: 'Default (3,3,2,5)', value: '3,3,2,5' },
  { name: 'Key A (6,24,1,13)', value: '6,24,1,13' },
  { name: 'Key B (2,4,3,5)', value: '2,4,3,5' },
  { name: 'Key C (5,8,17,3)', value: '5,8,17,3' },
];

const LearnTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const c = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  return (
    <div className="space-y-6">
      <div className={c}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📚 Understanding Hill Cipher</h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>The <strong className="text-indigo-600">Hill Cipher</strong> uses linear algebra — specifically matrix multiplication over ℤ₂₆ — to encrypt blocks of letters simultaneously.</p>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>How it works:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Key is a square matrix (we use 2×2)</li>
              <li>Plaintext split into blocks of 2 letters</li>
              <li>Convert letters to numbers (A=0 … Z=25)</li>
              <li>Multiply key matrix × plaintext vector, mod 26</li>
              <li>Convert back to letters</li>
            </ul>
          </div>
          <div className={`p-4 rounded-xl border-2 border-red-300 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
            <h4 className="font-bold mb-2 text-red-600">⚠️ Matrix Invertibility</h4>
            <p>The determinant must have a multiplicative inverse mod 26. Valid det values: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [keyStr, setKeyStr] = useState('3,3,2,5');

  const renderViz = (text: string, key: string) => {
    const matrix = parseHillKey(key);
    if (!matrix) return null;
    const clean = text.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
    const padded = clean.length % 2 === 0 ? clean : clean + 'X';
    return (
      <div className="space-y-6">
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Key Matrix</h4>
          <div className={`inline-flex flex-col p-4 rounded-xl font-mono text-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
            <div className="flex gap-4"><span className="w-8 text-center text-indigo-600">{matrix[0][0]}</span><span className="w-8 text-center text-indigo-600">{matrix[0][1]}</span></div>
            <div className="flex gap-4 mt-2"><span className="w-8 text-center text-indigo-600">{matrix[1][0]}</span><span className="w-8 text-center text-indigo-600">{matrix[1][1]}</span></div>
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: Math.ceil(padded.length / 2) }).map((_, idx) => {
            const p1 = padded[idx * 2], p2 = padded[idx * 2 + 1] || 'X';
            const v1 = p1.charCodeAt(0) - 65, v2 = p2.charCodeAt(0) - 65;
            const c1 = ((matrix[0][0] * v1 + matrix[0][1] * v2) % 26 + 26) % 26;
            const c2 = ((matrix[1][0] * v1 + matrix[1][1] * v2) % 26 + 26) % 26;
            return (
              <div key={idx} className={`p-4 rounded-xl font-mono text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                [{matrix[0][0]} {matrix[0][1]}] × [{p1}={v1}] = [{c1} → {String.fromCharCode(c1 + 65)}]<br />
                [{matrix[1][0]} {matrix[1][1]}] &nbsp; [{p2}={v2}] &nbsp; [{c2} → {String.fromCharCode(c2 + 65)}]
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const presets = (
    <div className="mt-3">
      <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Preset valid keys:</label>
      <div className="flex flex-wrap gap-2">
        {VALID_KEYS.map((p) => (
          <button key={p.value} onClick={() => setKeyStr(p.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              keyStr === p.value ? 'bg-indigo-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>{p.name}</button>
        ))}
      </div>
    </div>
  );

  return (
    <CipherPlayground title="Hill Cipher" description="A polygraphic substitution cipher using matrix multiplication."
      keyLabel="🔢 Key Matrix (a,b,c,d)" keyPlaceholder="e.g. 3,3,2,5" defaultKey="3,3,2,5"
      controlledKey={keyStr} onKeyChange={setKeyStr}
      encrypt={(t, k) => { const m = parseHillKey(k); return m ? hillEncrypt(t, m) : 'Invalid key'; }}
      decrypt={(t, k) => { const m = parseHillKey(k); return m ? hillDecrypt(t, m) : null; }}
      validateKey={(k) => {
        const m = parseHillKey(k);
        if (!m) return { valid: false, error: 'Format: a,b,c,d (e.g. 3,3,2,5)' };
        if (!isHillKeyValid(m)) return { valid: false, error: 'Matrix not invertible mod 26. Try a preset.' };
        return { valid: true };
      }}
      renderVisualization={renderViz}
      additionalKeyInputs={presets}
    />
  );
};

const AttackTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [knownPlain, setKnownPlain] = useState('HE');
  const [knownCipher, setKnownCipher] = useState('IF');
  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;

  const recoverKey = (): string => {
    const p1 = knownPlain.toUpperCase().charCodeAt(0) - 65;
    const p2 = knownPlain.toUpperCase().charCodeAt(1) - 65;
    const c1 = knownCipher.toUpperCase().charCodeAt(0) - 65;
    const c2 = knownCipher.toUpperCase().charCodeAt(1) - 65;
    const det = ((p1 * p2 - p2 * p1) !== 0) ? p1 * 1 - p2 * 0 : 0; // simplified for 2x2
    // For a proper KPA we'd need two pairs. Show concept:
    return `With pairs (${knownPlain}→${knownCipher}), we need at least 2 pairs to solve the 2×2 matrix. This demonstrates the concept.`;
  };

  return (
    <div className="space-y-6">
      <div className={card}>
        <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚔️ Known Plaintext Attack</h3>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          If an attacker knows a plaintext-ciphertext pair, they can set up linear equations to solve for the key matrix.
          For a 2×2 Hill cipher, 2 known pairs (4 letters) are enough to recover the key.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Known Plaintext (2 letters)</label>
            <input value={knownPlain} onChange={(e) => setKnownPlain(e.target.value.slice(0, 2))} maxLength={2}
              className={`w-full p-3 rounded-xl font-mono uppercase ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border-2 focus:outline-none focus:border-indigo-500`} />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Corresponding Ciphertext</label>
            <input value={knownCipher} onChange={(e) => setKnownCipher(e.target.value.slice(0, 2))} maxLength={2}
              className={`w-full p-3 rounded-xl font-mono uppercase ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border-2 focus:outline-none focus:border-indigo-500`} />
          </div>
        </div>
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
          <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📐 System of Equations:</h4>
          <div className="font-mono text-sm space-y-1">
            <p>[k₁₁ k₁₂] × [{knownPlain[0]?.toUpperCase() || '?'}={((knownPlain[0]?.toUpperCase().charCodeAt(0) || 65) - 65)}] = [{knownCipher[0]?.toUpperCase() || '?'}={((knownCipher[0]?.toUpperCase().charCodeAt(0) || 65) - 65)}] (mod 26)</p>
            <p>[k₂₁ k₂₂] &nbsp; [{knownPlain[1]?.toUpperCase() || '?'}={((knownPlain[1]?.toUpperCase().charCodeAt(0) || 65) - 65)}] &nbsp; [{knownCipher[1]?.toUpperCase() || '?'}={((knownCipher[1]?.toUpperCase().charCodeAt(0) || 65) - 65)}]</p>
          </div>
          <p className={`text-sm mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            This gives 2 equations with 4 unknowns — need another pair to solve uniquely.
          </p>
        </div>
      </div>
      <div className={card}>
        <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🛡️ Why Hill is Vulnerable</h4>
        <ul className={`list-disc list-inside space-y-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <li>Completely linear → vulnerable to known-plaintext attacks</li>
          <li>With n² known plaintext-ciphertext letters, the n×n key can be recovered</li>
          <li>No diffusion across blocks → patterns can be exploited</li>
          <li>Not used in practice for security, but great for learning linear algebra in crypto</li>
        </ul>
      </div>
    </div>
  );
};

export const HillCipher: React.FC = () => (
  <CipherTabLayout tabs={[
    { id: 'learn', label: 'Learn', icon: '📖', content: <LearnTab /> },
    { id: 'tool', label: 'Encrypt / Decrypt', icon: '🔧', content: <ToolTab /> },
    { id: 'attacks', label: 'Attack Simulator', icon: '⚔️', content: <AttackTab /> },
  ]} />
);