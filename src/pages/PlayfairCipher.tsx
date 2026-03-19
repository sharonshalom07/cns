import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherTabLayout } from '../components/CipherTabLayout';
import { CipherPlayground } from '../components/CipherPlayground';
import { playfairEncrypt, playfairDecrypt, getPlayfairMatrix } from '../utils/ciphers';

const LearnTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const c = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  return (
    <div className="space-y-6">
      <div className={c}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📚 Understanding Playfair Cipher</h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>The <strong className="text-indigo-600">Playfair Cipher</strong> encrypts pairs of letters (digraphs) using a 5×5 matrix, making it the first practical digraph substitution cipher. Used by the British in WWI and Australians in WWII.</p>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Steps:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Build a 5×5 matrix from keyword (I/J combined)</li>
              <li>Split plaintext into digraphs, insert X between duplicates</li>
              <li>For each pair, apply 3 rules based on their positions</li>
            </ol>
          </div>
          <div className={`grid md:grid-cols-3 gap-4`}>
            {[{ icon: '↔️', title: 'Same Row', desc: 'Take letter to the right (wrap)' },
              { icon: '↕️', title: 'Same Column', desc: 'Take letter below (wrap)' },
              { icon: '🔄', title: 'Rectangle', desc: 'Swap corners on same row' }
            ].map((r) => (
              <div key={r.title} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow'}`}>
                <div className="text-2xl mb-2">{r.icon}</div>
                <h5 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{r.title}</h5>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolTab: React.FC = () => {
  const { isDarkMode } = useTheme();

  const renderViz = (text: string, key: string) => {
    const matrix = getPlayfairMatrix(key);
    return (
      <div className="space-y-6">
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>5×5 Matrix (Key: {key.toUpperCase() || 'NONE'})</h4>
          <div className={`inline-block grid grid-cols-5 gap-1 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
            {matrix.flat().map((ch, i) => (
              <div key={i} className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono text-lg font-bold
                ${key.toUpperCase().includes(ch) ? 'bg-indigo-600 text-white' : isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-white text-gray-700'}`}>{ch}</div>
            ))}
          </div>
        </div>
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Digraphs</h4>
          <div className="flex flex-wrap gap-2">
            {(() => {
              let cl = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
              let proc = '';
              for (let i = 0; i < cl.length; i++) { proc += cl[i]; if (i + 1 < cl.length && cl[i] === cl[i + 1]) proc += 'X'; }
              if (proc.length % 2 !== 0) proc += 'X';
              const pairs = [];
              for (let i = 0; i < Math.min(proc.length, 16); i += 2) pairs.push(proc.slice(i, i + 2));
              return pairs.map((p, i) => (
                <div key={i} className={`px-4 py-2 rounded-lg font-mono text-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-700'}`}>{p}</div>
              ));
            })()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <CipherPlayground title="Playfair Cipher" description="A digraph substitution cipher using a 5×5 keyword matrix."
      keyLabel="🔑 Keyword" keyPlaceholder="e.g. MONARCHY" defaultKey="MONARCHY"
      encrypt={playfairEncrypt} decrypt={playfairDecrypt}
      validateKey={(k) => k.replace(/[^a-zA-Z]/g, '').length === 0 ? { valid: false, error: 'Enter a keyword' } : { valid: true }}
      renderVisualization={renderViz}
    />
  );
};

const AttackTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  return (
    <div className="space-y-6">
      <div className={card}>
        <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚔️ Attacking the Playfair Cipher</h3>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-red-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📊 Digraph Frequency Analysis</h4>
            <p className="text-sm">Unlike simple substitution, Playfair operates on digraphs. However, digraph frequencies in English are still predictable (TH, HE, IN, ER are most common). With ~600+ characters, frequency analysis becomes effective.</p>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🔍 Pattern Analysis</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>A letter can never encrypt to itself</li>
              <li>If AB→CD then BA→DC (reversal property)</li>
              <li>Double letters are separated by X, creating recognizable patterns</li>
              <li>Only 25 possible letters in ciphertext (no J)</li>
            </ul>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🏛️ Historical Cryptanalysis</h4>
            <p className="text-sm">During WWI, the Playfair was broken by the French cryptanalyst Georges Painvin. The key matrix has only 25! / (25) ≈ 1.5×10²⁵ possible arrangements, but smart analysis reduces this dramatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PlayfairCipher: React.FC = () => (
  <CipherTabLayout tabs={[
    { id: 'learn', label: 'Learn', icon: '📖', content: <LearnTab /> },
    { id: 'tool', label: 'Encrypt / Decrypt', icon: '🔧', content: <ToolTab /> },
    { id: 'attacks', label: 'Attack Analysis', icon: '⚔️', content: <AttackTab /> },
  ]} />
);