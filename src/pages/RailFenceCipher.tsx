import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherTabLayout } from '../components/CipherTabLayout';
import { CipherPlayground } from '../components/CipherPlayground';
import { railFenceEncrypt, railFenceDecrypt } from '../utils/ciphers';

const COMMON_WORDS = ['THE','AND','FOR','ARE','BUT','NOT','YOU','ALL','THIS','THAT','WITH','HAVE','FROM','THEY','HELLO','WORLD'];

const LearnTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const c = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  return (
    <div className="space-y-6">
      <div className={c}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📚 Understanding Rail Fence Cipher</h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>The <strong className="text-indigo-600">Rail Fence Cipher</strong> is a transposition cipher that writes plaintext in a zigzag pattern across multiple "rails" (rows), then reads each rail left-to-right.</p>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Example (3 Rails):</h4>
            <pre className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
{`W . . . E . . . C . . . R .
. E . R . D . S . O . E . E
. . A . . . I . . . V . . .

Read rows: WECR + ERDSOEE + AIVD = WECREDRSOEEAIVD`}
            </pre>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Key Insight</h4>
            <p>This is a <strong>transposition</strong> cipher — letters are not replaced, only rearranged. The letter frequencies remain identical to the plaintext.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolTab: React.FC = () => {
  const { isDarkMode } = useTheme();

  const renderViz = (text: string, key: string) => {
    const rails = Math.max(2, Math.min(parseInt(key) || 3, 10));
    const dt = text.slice(0, 20);
    const fence: (string | null)[][] = Array.from({ length: rails }, () => Array(dt.length).fill(null));
    let rail = 0, dir = 1;
    for (let i = 0; i < dt.length; i++) { fence[rail][i] = dt[i]; rail += dir; if (rail === rails - 1 || rail === 0) dir *= -1; }

    return (
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <div className={`inline-block p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            {fence.map((row, ri) => (
              <div key={ri} className="flex">
                <span className={`w-14 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rail {ri + 1}:</span>
                <div className="flex">{row.map((ch, ci) => (
                  <div key={ci} className={`w-8 h-8 flex items-center justify-center font-mono text-sm m-0.5 ${ch ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-lg' : ''}`}>{ch || ''}</div>
                ))}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={`inline-flex px-4 py-2 rounded-xl font-mono text-lg ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
          {railFenceEncrypt(dt, rails)}
        </div>
      </div>
    );
  };

  return (
    <CipherPlayground title="Rail Fence Cipher" description="A transposition cipher using a zigzag pattern."
      keyLabel="🚃 Number of Rails" keyPlaceholder="e.g. 3" keyType="number" defaultKey="3"
      encrypt={(t, k) => railFenceEncrypt(t, parseInt(k) || 3)}
      decrypt={(t, k) => railFenceDecrypt(t, parseInt(k) || 3)}
      validateKey={(k) => {
        const r = parseInt(k);
        if (isNaN(r)) return { valid: false, error: 'Enter a number' };
        if (r < 2 || r > 10) return { valid: false, error: 'Rails: 2-10' };
        return { valid: true };
      }}
      renderVisualization={renderViz}
    />
  );
};

const AttackTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [attackText, setAttackText] = useState('Horel ollWd');
  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;

  const scoreText = (t: string) => {
    const u = t.toUpperCase();
    let s = 0;
    for (const w of COMMON_WORDS) if (u.includes(w)) s += w.length;
    return s;
  };

  const results = Array.from({ length: 9 }, (_, i) => {
    const rails = i + 2;
    const dec = railFenceDecrypt(attackText, rails);
    return { rails, dec, score: scoreText(dec) };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <div className={card}>
        <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚔️ Brute Force Attack</h3>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          With only ~10 practical rail counts, brute force is trivial.
        </p>
        <textarea value={attackText} onChange={(e) => setAttackText(e.target.value)} rows={2}
          className={`w-full p-4 rounded-xl border-2 resize-none font-mono ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:border-indigo-500 focus:outline-none`} />
      </div>
      <div className={card}>
        <div className="space-y-2">
          {results.map((r) => (
            <div key={r.rails} className={`flex items-center gap-3 p-3 rounded-xl ${
              r.score === results[0].score && r.score > 0 ? isDarkMode ? 'bg-green-900/40 border border-green-600' : 'bg-green-50 border border-green-300'
              : isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <span className={`w-20 font-bold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{r.rails} rails</span>
              <span className={`flex-1 font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{r.dec}</span>
              {r.score > 0 && <span className="text-xs px-2 py-1 rounded-full bg-yellow-400 text-yellow-900 font-bold">{r.score} pts</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const RailFenceCipher: React.FC = () => (
  <CipherTabLayout tabs={[
    { id: 'learn', label: 'Learn', icon: '📖', content: <LearnTab /> },
    { id: 'tool', label: 'Encrypt / Decrypt', icon: '🔧', content: <ToolTab /> },
    { id: 'attacks', label: 'Attack Simulator', icon: '⚔️', content: <AttackTab /> },
  ]} />
);