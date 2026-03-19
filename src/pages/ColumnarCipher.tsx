import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherTabLayout } from '../components/CipherTabLayout';
import { CipherPlayground } from '../components/CipherPlayground';
import { columnTranspositionEncrypt, columnTranspositionDecrypt } from '../utils/ciphers';

const LearnTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const c = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  return (
    <div className="space-y-6">
      <div className={c}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📚 Understanding Column Transposition</h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>The <strong className="text-indigo-600">Columnar Transposition</strong> writes plaintext row by row into a grid, then reads the columns in an order determined by a keyword.</p>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Example:</h4>
            <pre className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
{`Keyword: Z E B R A  →  Column order: 5 2 1 4 1
         Z E B R A
         5 2 1 4 1
         H E L L O
         W O R L D

Read by order: B=LR, E=EO, R=LL, A=OD, Z=HW
Ciphertext: LREOLLHWOD`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolTab: React.FC = () => {
  const { isDarkMode } = useTheme();

  const renderViz = (text: string, key: string) => {
    const ku = key.toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
    const nc = ku.length, nr = Math.ceil(text.length / nc);
    const padded = text.padEnd(nr * nc, 'X');
    const grid: string[][] = [];
    for (let i = 0; i < nr; i++) grid.push(padded.slice(i * nc, (i + 1) * nc).split(''));
    const ko = ku.split('').map((ch, i) => ({ ch, i, order: 0 }));
    const sorted = [...ko].sort((a, b) => a.ch.localeCompare(b.ch));
    sorted.forEach((item, idx) => { ko[item.i].order = idx + 1; });

    return (
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className={isDarkMode ? 'text-white' : 'text-gray-900'}>
            <thead>
              <tr>{ku.split('').map((ch, i) => (
                <th key={i} className={`w-10 h-10 text-center font-bold ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-500'} text-white rounded-t-lg`}>{ch}</th>
              ))}</tr>
              <tr>{ko.map((item, i) => (
                <th key={i} className={`w-10 h-6 text-center text-xs ${isDarkMode ? 'bg-indigo-800 text-indigo-200' : 'bg-indigo-200 text-indigo-800'}`}>#{item.order}</th>
              ))}</tr>
            </thead>
            <tbody>{grid.map((row, ri) => (
              <tr key={ri}>{row.map((ch, ci) => (
                <td key={ci} className={`w-10 h-10 text-center font-mono border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>{ch}</td>
              ))}</tr>
            ))}</tbody>
          </table>
        </div>
        <div className={`inline-flex px-4 py-2 rounded-xl font-mono text-lg ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
          {columnTranspositionEncrypt(text, ku)}
        </div>
      </div>
    );
  };

  return (
    <CipherPlayground title="Columnar Transposition" description="Rearranges text by columns using a keyword."
      keyLabel="🔑 Keyword" keyPlaceholder="e.g. ZEBRA" defaultKey="ZEBRA"
      encrypt={columnTranspositionEncrypt} decrypt={columnTranspositionDecrypt}
      validateKey={(k) => {
        const cl = k.replace(/[^a-zA-Z]/g, '');
        return cl.length < 2 ? { valid: false, error: 'Keyword needs ≥2 letters' } : { valid: true };
      }}
      renderVisualization={renderViz}
    />
  );
};

const AttackTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  const [attackText, setAttackText] = useState('LREOLLHWOD');

  const tryKeyLength = (ct: string, kl: number): string => {
    const nr = Math.ceil(ct.length / kl);
    const cols: string[] = [];
    let idx = 0;
    for (let c = 0; c < kl; c++) {
      let col = '';
      for (let r = 0; r < nr && idx < ct.length; r++) col += ct[idx++];
      cols.push(col);
    }
    // try reading in different column orders (just show identity for demo)
    let result = '';
    for (let r = 0; r < nr; r++) {
      for (let c = 0; c < kl; c++) {
        if (r < cols[c].length) result += cols[c][r];
      }
    }
    return result;
  };

  return (
    <div className="space-y-6">
      <div className={card}>
        <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚔️ Key Length Estimation</h3>
        <textarea value={attackText} onChange={(e) => setAttackText(e.target.value)} rows={2}
          className={`w-full p-4 rounded-xl border-2 resize-none font-mono ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:border-indigo-500 focus:outline-none`} />
        <p className={`text-sm mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          The key length must evenly divide the ciphertext (or nearly). We test each possibility and check if the rearranged text looks like English.
        </p>
      </div>
      <div className={card}>
        <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Key Length Trials (identity order)</h4>
        <div className="space-y-2">
          {Array.from({ length: Math.min(8, attackText.length - 1) }, (_, i) => i + 2).map((kl) => (
            <div key={kl} className={`flex items-center gap-3 p-3 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <span className={`w-24 font-bold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Length {kl}</span>
              <span className={`flex-1 font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{tryKeyLength(attackText, kl)}</span>
              {attackText.length % kl === 0 && <span className="text-xs px-2 py-1 rounded-full bg-blue-400 text-white">exact fit</span>}
            </div>
          ))}
        </div>
        <p className={`text-sm mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          The attacker would then try all column permutations for each possible key length. For key length k, there are k! permutations to check.
        </p>
      </div>
    </div>
  );
};

export const ColumnarCipher: React.FC = () => (
  <CipherTabLayout tabs={[
    { id: 'learn', label: 'Learn', icon: '📖', content: <LearnTab /> },
    { id: 'tool', label: 'Encrypt / Decrypt', icon: '🔧', content: <ToolTab /> },
    { id: 'attacks', label: 'Attack Simulator', icon: '⚔️', content: <AttackTab /> },
  ]} />
);