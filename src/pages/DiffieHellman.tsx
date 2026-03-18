import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, Users, Lock, Eye, EyeOff } from 'lucide-react';

const COMMON_PRIMES = [23, 47, 59, 83, 107, 167, 179, 227, 263];
const PRIMITIVE_ROOTS: Record<number, number[]> = {
  23: [5, 7, 10, 11, 14, 15, 17, 19, 20, 21],
  47: [5, 10, 11, 13, 15, 19, 20, 22, 23, 26],
  59: [2, 6, 8, 10, 11, 13, 14, 18, 23, 24],
  83: [2, 5, 6, 8, 10, 11, 12, 13, 14, 15],
  107: [2, 5, 6, 8, 10, 11, 13, 14, 15, 17],
  167: [5, 6, 10, 11, 13, 15, 17, 19, 20, 22],
  179: [2, 3, 5, 6, 7, 8, 10, 11, 12, 13],
  227: [2, 3, 5, 6, 7, 8, 10, 11, 12, 13],
  263: [5, 6, 7, 8, 10, 11, 12, 13, 14, 15],
};

const modPow = (base: number, exp: number, mod: number): number => {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) result = (result * base) % mod;
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
};

export const DiffieHellman: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [p, setP] = useState(23);
  const [g, setG] = useState(5);
  const [alicePrivate, setAlicePrivate] = useState(6);
  const [bobPrivate, setBobPrivate] = useState(15);
  const [alicePublic, setAlicePublic] = useState(0);
  const [bobPublic, setBobPublic] = useState(0);
  const [aliceShared, setAliceShared] = useState(0);
  const [bobShared, setBobShared] = useState(0);
  const [step, setStep] = useState(0);
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);
  const [eveIntercept, setEveIntercept] = useState(false);

  useEffect(() => {
    const aPublic = modPow(g, alicePrivate, p);
    const bPublic = modPow(g, bobPrivate, p);
    setAlicePublic(aPublic);
    setBobPublic(bPublic);
    setAliceShared(modPow(bPublic, alicePrivate, p));
    setBobShared(modPow(aPublic, bobPrivate, p));
  }, [p, g, alicePrivate, bobPrivate]);

  const cardClass = `rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Educational Header */}
      <div className={cardClass + ' p-6'}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📚 Understanding Diffie-Hellman Key Exchange
        </h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            <strong className="text-indigo-600">Diffie-Hellman Key Exchange</strong> allows two parties to establish 
            a shared secret over an insecure channel. It's the foundation of modern secure communications.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🔑 How It Works:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Alice and Bob agree on public values p (prime) and g (generator)</li>
                <li>Each picks a secret private key (a, b)</li>
                <li>Alice computes A = g<sup>a</sup> mod p and sends to Bob</li>
                <li>Bob computes B = g<sup>b</sup> mod p and sends to Alice</li>
                <li>Alice computes s = B<sup>a</sup> mod p</li>
                <li>Bob computes s = A<sup>b</sup> mod p</li>
                <li>Both now share the same secret: s = g<sup>ab</sup> mod p</li>
              </ol>
            </div>
            
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🛡️ Security:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Based on discrete logarithm problem</li>
                <li>Even if Eve intercepts A and B, she can't compute the shared secret</li>
                <li>Used in TLS/SSL, SSH, VPNs</li>
                <li>Vulnerable to man-in-the-middle without authentication</li>
                <li>Modern variant: Elliptic Curve Diffie-Hellman (ECDH)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Parameters */}
      <div className={cardClass + ' p-6'}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          🔧 Public Parameters
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Prime (p)
            </label>
            <select
              value={p}
              onChange={(e) => {
                const newP = parseInt(e.target.value);
                setP(newP);
                setG(PRIMITIVE_ROOTS[newP]?.[0] || 2);
              }}
              className={`w-full p-3 rounded-xl ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
              } border-2 focus:border-indigo-500 focus:outline-none`}
            >
              {COMMON_PRIMES.map(prime => (
                <option key={prime} value={prime}>{prime}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Generator (g) - Primitive Root mod {p}
            </label>
            <select
              value={g}
              onChange={(e) => setG(parseInt(e.target.value))}
              className={`w-full p-3 rounded-xl ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
              } border-2 focus:border-indigo-500 focus:outline-none`}
            >
              {(PRIMITIVE_ROOTS[p] || [2, 3, 5]).map(root => (
                <option key={root} value={root}>{root}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={`mt-4 p-4 rounded-xl ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            📡 These values are publicly known and can be transmitted over an insecure channel.
          </p>
        </div>
      </div>

      {/* Interactive Exchange */}
      <div className={cardClass + ' p-6'}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            🔄 Key Exchange Simulation
          </h3>
          <button
            onClick={() => setShowPrivateKeys(!showPrivateKeys)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {showPrivateKeys ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPrivateKeys ? 'Hide' : 'Show'} Private Keys
          </button>
        </div>

        {/* Alice and Bob */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Alice */}
          <div className={`p-6 rounded-xl border-2 ${isDarkMode ? 'bg-pink-900/20 border-pink-600' : 'bg-pink-50 border-pink-300'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <div>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Alice</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Party 1</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  🔐 Alice's Private Key (a)
                  {!showPrivateKeys && <span className="ml-2 text-xs">(hidden)</span>}
                </label>
                <input
                  type={showPrivateKeys ? 'number' : 'password'}
                  value={alicePrivate}
                  onChange={(e) => setAlicePrivate(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-full p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                  } border-2 border-pink-400 focus:outline-none`}
                  min="1"
                  max={p - 1}
                />
              </div>

              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Alice computes:
                </div>
                <div className="font-mono text-sm mt-1">
                  A = g<sup>a</sup> mod p = {g}<sup>{showPrivateKeys ? alicePrivate : '●'}</sup> mod {p}
                </div>
                <div className={`text-lg font-bold mt-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                  A = {alicePublic}
                </div>
              </div>

              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  After receiving B = {bobPublic}:
                </div>
                <div className="font-mono text-sm mt-1">
                  s = B<sup>a</sup> mod p = {bobPublic}<sup>{showPrivateKeys ? alicePrivate : '●'}</sup> mod {p}
                </div>
                <div className={`text-lg font-bold mt-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Shared Secret = {aliceShared}
                </div>
              </div>
            </div>
          </div>

          {/* Bob */}
          <div className={`p-6 rounded-xl border-2 ${isDarkMode ? 'bg-blue-900/20 border-blue-600' : 'bg-blue-50 border-blue-300'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                B
              </div>
              <div>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Bob</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Party 2</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  🔐 Bob's Private Key (b)
                  {!showPrivateKeys && <span className="ml-2 text-xs">(hidden)</span>}
                </label>
                <input
                  type={showPrivateKeys ? 'number' : 'password'}
                  value={bobPrivate}
                  onChange={(e) => setBobPrivate(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-full p-3 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                  } border-2 border-blue-400 focus:outline-none`}
                  min="1"
                  max={p - 1}
                />
              </div>

              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Bob computes:
                </div>
                <div className="font-mono text-sm mt-1">
                  B = g<sup>b</sup> mod p = {g}<sup>{showPrivateKeys ? bobPrivate : '●'}</sup> mod {p}
                </div>
                <div className={`text-lg font-bold mt-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  B = {bobPublic}
                </div>
              </div>

              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  After receiving A = {alicePublic}:
                </div>
                <div className="font-mono text-sm mt-1">
                  s = A<sup>b</sup> mod p = {alicePublic}<sup>{showPrivateKeys ? bobPrivate : '●'}</sup> mod {p}
                </div>
                <div className={`text-lg font-bold mt-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Shared Secret = {bobShared}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification */}
        {aliceShared === bobShared ? (
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'} border-2 border-green-500`}>
            <div className="flex items-center gap-3">
              <div className="text-4xl">✅</div>
              <div>
                <h4 className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                  Key Exchange Successful!
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Both Alice and Bob have computed the same shared secret: <strong>{aliceShared}</strong>
                </p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  This shared secret can now be used as a key for symmetric encryption (like AES).
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} border-2 border-red-500`}>
            <div className="flex items-center gap-3">
              <div className="text-4xl">❌</div>
              <div>
                <h4 className={`font-bold ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                  Mismatch!
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                  Something went wrong. The shared secrets don't match.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Eve's Perspective (Eavesdropper) */}
      <div className={cardClass + ' p-6'}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          👁️ Eve's Perspective (Eavesdropper)
        </h3>
        
        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} border-2 border-red-400`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
              E
            </div>
            <div>
              <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Eve (Attacker)</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Can intercept all public transmissions</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                What Eve Knows:
              </h5>
              <ul className="space-y-1 text-sm">
                <li>✅ Public prime p = {p}</li>
                <li>✅ Public generator g = {g}</li>
                <li>✅ Alice's public value A = {alicePublic}</li>
                <li>✅ Bob's public value B = {bobPublic}</li>
              </ul>
            </div>

            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                What Eve Doesn't Know:
              </h5>
              <ul className="space-y-1 text-sm">
                <li>❌ Alice's private key a</li>
                <li>❌ Bob's private key b</li>
                <li>❌ The shared secret {aliceShared}</li>
              </ul>
            </div>

            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
              <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                🔍 Why Eve Can't Compute the Secret:
              </h5>
              <p className="text-sm mb-2">
                To find the shared secret, Eve would need to solve the <strong>Discrete Logarithm Problem</strong>:
              </p>
              <div className="font-mono text-sm bg-black/20 p-3 rounded">
                Find a such that {g}<sup>a</sup> ≡ {alicePublic} (mod {p})
              </div>
              <p className="text-sm mt-2">
                For large primes (2048+ bits in practice), this is computationally infeasible with current technology.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Animation */}
      <div className={cardClass + ' p-6'}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📺 Animated Exchange Process
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setStep(s)}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${
                    step === s
                      ? 'bg-indigo-600 text-white scale-110'
                      : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s + 1}
                </button>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} min-h-[200px]`}>
            {step === 0 && (
              <div className="text-center space-y-3">
                <div className="text-5xl">🤝</div>
                <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Step 1: Public Agreement
                </h4>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Alice and Bob publicly agree on:
                </p>
                <div className="flex justify-center gap-8 mt-4">
                  <div className={`px-6 py-4 rounded-xl ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                    <div className="text-sm text-gray-500">Prime</div>
                    <div className="text-2xl font-bold text-indigo-600">p = {p}</div>
                  </div>
                  <div className={`px-6 py-4 rounded-xl ${isDarkMode ? 'bg-gray-600' : 'bg-white'}`}>
                    <div className="text-sm text-gray-500">Generator</div>
                    <div className="text-2xl font-bold text-indigo-600">g = {g}</div>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <div className="text-5xl text-center">🎲</div>
                <h4 className={`text-xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Step 2: Generate Private Keys
                </h4>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-pink-900/30' : 'bg-pink-50'}`}>
                    <div className="font-bold text-pink-600 mb-2">Alice chooses:</div>
                    <div className="text-3xl font-bold">a = {showPrivateKeys ? alicePrivate : '???'}</div>
                    <div className="text-sm mt-2 text-gray-500">(kept secret)</div>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                    <div className="font-bold text-blue-600 mb-2">Bob chooses:</div>
                    <div className="text-3xl font-bold">b = {showPrivateKeys ? bobPrivate : '???'}</div>
                    <div className="text-sm mt-2 text-gray-500">(kept secret)</div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <div className="text-5xl text-center">🔢</div>
                <h4 className={`text-xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Step 3: Compute Public Values
                </h4>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-pink-900/30' : 'bg-pink-50'}`}>
                    <div className="font-bold text-pink-600 mb-2">Alice computes:</div>
                    <div className="font-mono">A = {g}^{showPrivateKeys ? alicePrivate : 'a'} mod {p}</div>
                    <div className="text-3xl font-bold mt-2">A = {alicePublic}</div>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                    <div className="font-bold text-blue-600 mb-2">Bob computes:</div>
                    <div className="font-mono">B = {g}^{showPrivateKeys ? bobPrivate : 'b'} mod {p}</div>
                    <div className="text-3xl font-bold mt-2">B = {bobPublic}</div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div className="text-5xl text-center">📡</div>
                <h4 className={`text-xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Step 4: Exchange Public Values
                </h4>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className={`px-6 py-4 rounded-xl ${isDarkMode ? 'bg-pink-900/30' : 'bg-pink-50'}`}>
                    <div className="text-sm">Alice</div>
                    <div className="text-2xl font-bold">A = {alicePublic}</div>
                  </div>
                  <div className="text-4xl">⟷</div>
                  <div className={`px-6 py-4 rounded-xl ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                    <div className="text-sm">Bob</div>
                    <div className="text-2xl font-bold">B = {bobPublic}</div>
                  </div>
                </div>
                <p className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  These values can be sent over an insecure channel
                </p>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                <div className="text-5xl text-center">🔐</div>
                <h4 className={`text-xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Step 5: Compute Shared Secret
                </h4>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-pink-900/30' : 'bg-pink-50'}`}>
                    <div className="font-bold text-pink-600 mb-2">Alice computes:</div>
                    <div className="font-mono text-sm">s = {bobPublic}^{showPrivateKeys ? alicePrivate : 'a'} mod {p}</div>
                    <div className="text-3xl font-bold mt-2 text-green-600">s = {aliceShared}</div>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                    <div className="font-bold text-blue-600 mb-2">Bob computes:</div>
                    <div className="font-mono text-sm">s = {alicePublic}^{showPrivateKeys ? bobPrivate : 'b'} mod {p}</div>
                    <div className="text-3xl font-bold mt-2 text-green-600">s = {bobShared}</div>
                  </div>
                </div>
                <div className={`text-center p-4 rounded-xl mt-4 ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
                  <div className="text-sm text-gray-500 mb-2">Shared Secret</div>
                  <div className="text-4xl font-bold text-green-600">{aliceShared}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={`px-6 py-2 rounded-lg font-semibold ${
                step === 0
                  ? 'opacity-50 cursor-not-allowed bg-gray-300'
                  : isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              ← Previous
            </button>
            <button
              onClick={() => setStep(Math.min(4, step + 1))}
              disabled={step === 4}
              className={`px-6 py-2 rounded-lg font-semibold ${
                step === 4
                  ? 'opacity-50 cursor-not-allowed bg-gray-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};