import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherTabLayout } from '../components/CipherTabLayout';
import { CipherPlayground } from '../components/CipherPlayground';
import { FrequencyAnalysis } from '../components/FrequencyAnalysis';
import { caesarEncrypt, caesarDecrypt } from '../utils/ciphers';

const COMMON_WORDS = [
  'THE','AND','FOR','ARE','BUT','NOT','YOU','ALL','CAN','HER','WAS','ONE',
  'OUR','OUT','HAS','HIS','HOW','ITS','MAY','NEW','NOW','OLD','SEE','WAY',
  'WHO','DID','GET','HIM','SAY','SHE','TOO','USE','HELLO','WORLD','THIS',
  'THAT','WITH','HAVE','FROM','THEY','BEEN','SAID','EACH','WHICH','THEIR',
  'WILL','OTHER','ABOUT','MANY','THEN','THEM','WOULD','MAKE','LIKE','JUST',
  'OVER','SUCH','TAKE','INTO','SOME','COULD','GOOD','COME','MADE','AFTER',
];

/* ───────────── Learn Tab ───────────── */
const LearnTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const c = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;

  return (
    <div className="space-y-6">
      <div className={c}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📚 What is the Caesar Cipher?
        </h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            The <strong className="text-indigo-600">Caesar Cipher</strong> is one of the simplest and
            most widely known encryption techniques, named after Julius Caesar who used it in private
            correspondence around 50 BC.
          </p>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>How it works:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Each letter is shifted by a fixed number of positions in the alphabet</li>
              <li>With shift 3: A→D, B→E, C→F, … X→A, Y→B, Z→C</li>
              <li>The shift value (0-25) is the secret key</li>
              <li>Decryption reverses the shift</li>
            </ul>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⚡ Fun Fact — ROT13</h4>
            <p>
              ROT13 is a Caesar cipher with shift 13. Since 26 / 2 = 13, applying ROT13 twice returns
              the original text. It's still used today to hide spoilers online!
            </p>
          </div>
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📐 Mathematical Formula</h4>
            <div className="font-mono text-sm space-y-1">
              <p><strong>Encrypt:</strong> E(x) = (x + k) mod 26</p>
              <p><strong>Decrypt:</strong> D(x) = (x − k) mod 26</p>
              <p className="text-xs mt-2">Where x is the letter index (A=0 … Z=25) and k is the shift key.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────────── Tool Tab ───────────── */
const ToolTab: React.FC = () => {
  const { isDarkMode } = useTheme();

  const renderVisualization = (text: string, key: string, mode: 'encrypt' | 'decrypt') => {
    const shift = parseInt(key) || 0;
    const actualShift = mode === 'decrypt' ? -shift : shift;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    return (
      <div className="space-y-6">
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Alphabet Mapping (Shift {Math.abs(actualShift)})
          </h4>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex gap-1 mb-1">
                {alphabet.split('').map((ch, i) => (
                  <div key={i} className={`w-8 h-8 flex items-center justify-center rounded text-sm font-mono
                    ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{ch}</div>
                ))}
              </div>
              <div className={`text-center text-2xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>↓</div>
              <div className="flex gap-1 mt-1">
                {alphabet.split('').map((_, i) => {
                  const ni = ((i + actualShift) % 26 + 26) % 26;
                  return (
                    <div key={i} className="w-8 h-8 flex items-center justify-center rounded text-sm font-mono bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                      {alphabet[ni]}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Character-by-Character
          </h4>
          <div className="flex flex-wrap gap-2">
            {text.slice(0, 20).split('').map((ch, i) => {
              const isLetter = ch.match(/[a-z]/i);
              const result = isLetter ? caesarEncrypt(ch, actualShift) : ch;
              return (
                <div key={i} className={`flex flex-col items-center p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className={`text-lg font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{ch === ' ' ? '␣' : ch}</span>
                  <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>↓</span>
                  <span className="text-lg font-mono text-indigo-600 font-bold">{result === ' ' ? '␣' : result}</span>
                </div>
              );
            })}
            {text.length > 20 && <div className={`flex items-center px-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>…</div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <CipherPlayground
      title="Caesar Cipher"
      description="Shift each letter by a fixed number of positions."
      keyLabel="🔢 Shift Value (0-25)"
      keyPlaceholder="e.g. 3"
      keyType="number"
      defaultKey="3"
      encrypt={(t, k) => caesarEncrypt(t, parseInt(k) || 0)}
      decrypt={(t, k) => caesarDecrypt(t, parseInt(k) || 0)}
      validateKey={(k) => {
        const s = parseInt(k);
        if (isNaN(s)) return { valid: false, error: 'Enter a number' };
        if (s < 0 || s > 25) return { valid: false, error: 'Shift must be 0-25' };
        return { valid: true };
      }}
      renderVisualization={renderVisualization}
    />
  );
};

/* ───────────── Attack Tab ───────────── */
const AttackTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [attackText, setAttackText] = useState('Wkh txlfn eurzq ira mxpsv ryhu wkh odcb grj');
  const [activeAttack, setActiveAttack] = useState<'brute' | 'freq'>('brute');
  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;

  const scoreText = (text: string): number => {
    const upper = text.toUpperCase();
    let score = 0;
    for (const w of COMMON_WORDS) {
      if (upper.includes(w)) score += w.length;
    }
    return score;
  };

  const bruteForceResults = Array.from({ length: 26 }, (_, shift) => {
    const decrypted = caesarDecrypt(attackText, shift);
    return { shift, decrypted, score: scoreText(decrypted) };
  }).sort((a, b) => b.score - a.score);

  const bestShift = bruteForceResults[0];

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className={card}>
        <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          ⚔️ Attack the Caesar Cipher
        </h3>
        <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Paste a Caesar-encrypted ciphertext below to try breaking it.
        </p>
        <textarea value={attackText} onChange={(e) => setAttackText(e.target.value)}
          rows={3}
          className={`w-full p-4 rounded-xl border-2 resize-none font-mono
            ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}
            focus:border-indigo-500 focus:outline-none`}
          placeholder="Enter ciphertext to attack…" />
      </div>

      {/* Attack Type Selector */}
      <div className={card}>
        <div className="flex gap-2 mb-6">
          {([
            { id: 'brute' as const, label: '🔨 Brute Force', desc: 'Try all 25 keys' },
            { id: 'freq' as const, label: '📊 Frequency Analysis', desc: 'Statistical approach' },
          ]).map((a) => (
            <button key={a.id} onClick={() => setActiveAttack(a.id)}
              className={`flex-1 p-4 rounded-xl text-left transition-all ${
                activeAttack === a.id
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              <div className="font-bold">{a.label}</div>
              <div className={`text-xs mt-1 ${activeAttack === a.id ? 'text-white/80' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {a.desc}
              </div>
            </button>
          ))}
        </div>

        {activeAttack === 'brute' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-900/30 border border-green-600' : 'bg-green-50 border border-green-300'}`}>
              <h4 className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                🏆 Most Likely Key: Shift = {bestShift.shift}
              </h4>
              <p className={`mt-1 font-mono text-sm ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                {bestShift.decrypted}
              </p>
            </div>

            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Since there are only 25 possible keys, we can try them all.
                Results ranked by likelihood (common English words detected):
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-1 pr-2">
              {bruteForceResults.map((r) => (
                <div key={r.shift}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    r.shift === bestShift.shift
                      ? isDarkMode ? 'bg-green-900/40 border border-green-600' : 'bg-green-50 border border-green-300'
                      : isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                  <div className={`w-14 text-center font-bold text-sm px-2 py-1 rounded-lg ${
                    r.shift === bestShift.shift
                      ? 'bg-green-500 text-white'
                      : isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    ←{r.shift}
                  </div>
                  <div className={`flex-1 font-mono text-sm truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {r.decrypted}
                  </div>
                  {r.score > 0 && (
                    <div className="text-xs px-2 py-1 rounded-full bg-yellow-400 text-yellow-900 font-bold">
                      {r.score} pts
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeAttack === 'freq' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>How it works:</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                In English, 'E' is the most common letter (~12.7%). By finding the most frequent letter
                in the ciphertext and assuming it maps to 'E', we can estimate the shift key.
              </p>
            </div>

            <FrequencyAnalysis text={attackText} title="📊 Ciphertext Letter Frequencies vs English" />

            {(() => {
              const letters = attackText.toUpperCase().replace(/[^A-Z]/g, '');
              if (!letters) return null;
              const freq: Record<string, number> = {};
              for (const c of letters) freq[c] = (freq[c] || 0) + 1;
              const mostCommon = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
              if (!mostCommon) return null;
              const guessedShift = ((mostCommon[0].charCodeAt(0) - 65) - 4 + 26) % 26;
              return (
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Most frequent letter: <strong>{mostCommon[0]}</strong> ({mostCommon[1]}×).
                    If it maps to E → estimated shift = <strong>{guessedShift}</strong>
                  </p>
                  <p className={`mt-2 font-mono text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                    Decrypted: {caesarDecrypt(attackText, guessedShift)}
                  </p>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

/* ───────────── Main Page ───────────── */
export const CaesarCipher: React.FC = () => (
  <CipherTabLayout tabs={[
    { id: 'learn',   label: 'Learn',             icon: '📖', content: <LearnTab /> },
    { id: 'tool',    label: 'Encrypt / Decrypt',  icon: '🔧', content: <ToolTab /> },
    { id: 'attacks', label: 'Attack Simulator',   icon: '⚔️', content: <AttackTab /> },
  ]} />
);