import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherTabLayout } from '../components/CipherTabLayout';
import { CipherPlayground } from '../components/CipherPlayground';
import { FrequencyAnalysis } from '../components/FrequencyAnalysis';
import { vigenereEncrypt, vigenereDecrypt } from '../utils/ciphers';

/* ───── Learn ───── */
const LearnTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const c = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  return (
    <div className="space-y-6">
      <div className={c}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📚 Understanding Vigenère Cipher</h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>The <strong className="text-indigo-600">Vigenère Cipher</strong> uses a keyword to apply different Caesar shifts to each letter, making it polyalphabetic. It was considered "le chiffre indéchiffrable" (the unbreakable cipher) for 300 years!</p>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>How it works:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Choose a keyword (e.g. "KEY")</li>
              <li>Repeat it to match plaintext length: KEYKEYK…</li>
              <li>Each keyword letter determines the shift (A=0, B=1 … Z=25)</li>
              <li>Apply each shift to the corresponding plaintext letter</li>
            </ul>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Example:</h4>
            <pre className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
{`Plain:  H E L L O  W O R L D
Key:    K E Y K E  K E Y K E
Shift:  10 4 24 10 4  10 4 24 10 4
Cipher: R I J V S  G S P V H`}
            </pre>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📐 Formula</h4>
            <div className="font-mono text-sm">
              <p>E(xᵢ) = (xᵢ + kᵢ) mod 26</p>
              <p>D(xᵢ) = (xᵢ − kᵢ) mod 26</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───── Tool ───── */
const ToolTab: React.FC = () => {
  const { isDarkMode } = useTheme();

  const renderViz = (text: string, key: string, mode: 'encrypt' | 'decrypt') => {
    const ku = key.toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
    const chars = text.slice(0, 15).split('');
    return (
      <div className="space-y-4">
        {['Plain', 'Key', 'Cipher'].map((row) => {
          let keyIdx = 0;
          return (
            <div key={row} className="flex gap-2 items-center flex-wrap">
              <span className={`w-16 font-semibold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{row}:</span>
              {chars.map((ch, i) => {
                const isLetter = !!ch.match(/[a-z]/i);
                if (row === 'Plain') {
                  return <div key={i} className={`w-8 h-8 flex items-center justify-center rounded font-mono ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{ch === ' ' ? '␣' : ch.toUpperCase()}</div>;
                }
                if (row === 'Key') {
                  const kChar = isLetter ? ku[keyIdx++ % ku.length] : '-';
                  return <div key={i} className={`w-8 h-8 flex items-center justify-center rounded font-mono ${isLetter ? 'bg-indigo-100 text-indigo-700' : isDarkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-50 text-gray-300'}`}>{kChar}</div>;
                }
                const fn = mode === 'encrypt' ? vigenereEncrypt : vigenereDecrypt;
                const res = fn(text.slice(0, i + 1), ku).slice(-1);
                return <div key={i} className="w-8 h-8 flex items-center justify-center rounded font-mono bg-gradient-to-br from-indigo-500 to-purple-500 text-white">{ch === ' ' ? '␣' : res.toUpperCase()}</div>;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <CipherPlayground title="Vigenère Cipher" description="A polyalphabetic cipher using a keyword for variable shifts."
      keyLabel="🔑 Keyword" keyPlaceholder="e.g. SECRET" defaultKey="KEY"
      encrypt={vigenereEncrypt} decrypt={vigenereDecrypt}
      validateKey={(k) => {
        const cl = k.replace(/[^a-zA-Z]/g, '');
        return cl.length === 0 ? { valid: false, error: 'Enter a keyword with letters' } : { valid: true };
      }}
      renderVisualization={renderViz}
    />
  );
};

/* ───── Attacks ───── */
const AttackTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [attackText, setAttackText] = useState(
    'LXFOPVEFRNHR' // sample encrypted with "LEMON"
  );
  const [guessedKeyLen, setGuessedKeyLen] = useState(3);
  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;

  const findRepeatedSequences = (text: string, seqLen: number = 3) => {
    const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
    const sequences: Record<string, number[]> = {};
    for (let i = 0; i <= clean.length - seqLen; i++) {
      const seq = clean.slice(i, i + seqLen);
      if (!sequences[seq]) sequences[seq] = [];
      sequences[seq].push(i);
    }
    return Object.entries(sequences)
      .filter(([, positions]) => positions.length > 1)
      .map(([seq, positions]) => {
        const distances = [];
        for (let i = 1; i < positions.length; i++) {
          distances.push(positions[i] - positions[0]);
        }
        return { seq, positions, distances };
      });
  };

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  const repeats = findRepeatedSequences(attackText);
  const allDistances = repeats.flatMap((r) => r.distances);
  const overallGcd = allDistances.length > 0 ? allDistances.reduce(gcd) : 0;

  const getPositionText = (text: string, keyLen: number, pos: number): string => {
    const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    for (let i = pos; i < clean.length; i += keyLen) result += clean[i];
    return result;
  };

  return (
    <div className="space-y-6">
      <div className={card}>
        <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚔️ Attack the Vigenère Cipher</h3>
        <textarea value={attackText} onChange={(e) => setAttackText(e.target.value)} rows={3}
          className={`w-full p-4 rounded-xl border-2 resize-none font-mono ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:border-indigo-500 focus:outline-none`}
          placeholder="Enter Vigenère ciphertext…" />
      </div>

      {/* Kasiski Examination */}
      <div className={card}>
        <h4 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🔍 Kasiski Examination</h4>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Find repeated trigrams in the ciphertext. The distances between them are likely multiples of the key length.
        </p>
        {repeats.length > 0 ? (
          <div className="space-y-2">
            {repeats.slice(0, 8).map((r) => (
              <div key={r.seq} className={`flex items-center gap-4 p-3 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <span className="font-mono font-bold text-indigo-600 w-14">{r.seq}</span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  at positions {r.positions.join(', ')}
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  distances: {r.distances.join(', ')}
                </span>
              </div>
            ))}
            {overallGcd > 1 && (
              <div className={`p-4 rounded-xl mt-4 ${isDarkMode ? 'bg-green-900/30 border border-green-600' : 'bg-green-50 border border-green-300'}`}>
                <p className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                  GCD of all distances = {overallGcd} → probable key length: <strong>{overallGcd}</strong>
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            No repeated trigrams found. Try a longer ciphertext.
          </p>
        )}
      </div>

      {/* Per-Position Frequency Analysis */}
      <div className={card}>
        <h4 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📊 Per-Position Frequency Analysis
        </h4>
        <div className="mb-4">
          <label className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Assumed Key Length:
          </label>
          <div className="flex gap-2 mt-2">
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <button key={n} onClick={() => setGuessedKeyLen(n)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  guessedKeyLen === n ? 'bg-indigo-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>{n}</button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: guessedKeyLen }, (_, pos) => (
            <div key={pos} className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <FrequencyAnalysis
                text={getPositionText(attackText, guessedKeyLen, pos)}
                title={`Position ${pos + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const VigenereCipher: React.FC = () => (
  <CipherTabLayout tabs={[
    { id: 'learn',   label: 'Learn',             icon: '📖', content: <LearnTab /> },
    { id: 'tool',    label: 'Encrypt / Decrypt',  icon: '🔧', content: <ToolTab /> },
    { id: 'attacks', label: 'Attack Simulator',   icon: '⚔️', content: <AttackTab /> },
  ]} />
);