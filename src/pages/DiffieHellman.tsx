import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CipherTabLayout } from '../components/CipherTabLayout';
import { Eye, EyeOff, AlertTriangle, Shield, Users } from 'lucide-react';

// Common safe primes for demonstration
const PRIMES = [23, 47, 59, 83, 107, 167, 227];

// Primitive roots (generators) for each prime
const PRIMITIVE_ROOTS: Record<number, number[]> = {
  23: [5, 7, 10, 11, 14, 15, 17, 19, 20, 21],
  47: [5, 10, 11, 13, 15, 19, 20, 22, 23, 26],
  59: [2, 6, 8, 10, 11, 13, 14, 18, 23, 24],
  83: [2, 5, 6, 8, 10, 11, 12, 13, 14, 15],
  107: [2, 5, 6, 8, 10, 11, 13, 14, 15, 17],
  167: [5, 6, 10, 11, 13, 15, 17, 19, 20, 22],
  227: [2, 3, 5, 6, 7, 8, 10, 11, 12, 13],
};

// Modular exponentiation: base^exp mod mod
const modPow = (base: number, exp: number, mod: number): number => {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
};

// Brute force discrete log: find x such that g^x ≡ h (mod p)
const discreteLog = (g: number, h: number, p: number): { x: number; attempts: number } | null => {
  for (let x = 1; x < p; x++) {
    if (modPow(g, x, p) === h) {
      return { x, attempts: x };
    }
  }
  return null;
};

/* ═══════════════════════════════════════════════════════════════════════════
   LEARN TAB - Theory and Concepts
═══════════════════════════════════════════════════════════════════════════ */
const LearnTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className={card}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📚 What is Diffie-Hellman Key Exchange?
        </h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
            <strong className="text-indigo-600">Diffie-Hellman (DH)</strong> is a revolutionary protocol invented in 1976 
            by Whitfield Diffie and Martin Hellman. It solves a fundamental problem in cryptography:
          </p>
          
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'} border-l-4 border-indigo-500`}>
            <p className="font-semibold text-indigo-600">🤔 The Problem:</p>
            <p className="mt-1">
              How can Alice and Bob agree on a secret key when their only communication channel 
              is being watched by Eve (the eavesdropper)?
            </p>
          </div>

          <p>
            Think of it like this: Alice and Bob are shouting across a crowded room, and everyone can hear them. 
            Yet somehow, they manage to agree on a secret number that only they know!
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className={card}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          🔄 How Does It Work?
        </h3>
        
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {/* Step-by-step with visual */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                📋 The Protocol Steps:
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong>Public Setup:</strong> Alice and Bob agree on two public numbers:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>p = a large prime number</li>
                    <li>g = a generator (primitive root mod p)</li>
                  </ul>
                </li>
                <li><strong>Private Keys:</strong> Each picks a secret number:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Alice chooses secret <code className="bg-pink-200 text-pink-800 px-1 rounded">a</code></li>
                    <li>Bob chooses secret <code className="bg-blue-200 text-blue-800 px-1 rounded">b</code></li>
                  </ul>
                </li>
                <li><strong>Public Values:</strong> Each computes and shares:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Alice: A = g<sup>a</sup> mod p → sends to Bob</li>
                    <li>Bob: B = g<sup>b</sup> mod p → sends to Alice</li>
                  </ul>
                </li>
                <li><strong>Shared Secret:</strong> Each computes the same secret:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Alice: s = B<sup>a</sup> mod p</li>
                    <li>Bob: s = A<sup>b</sup> mod p</li>
                    <li>Both get: s = g<sup>ab</sup> mod p ✓</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
              <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🎨 Paint Mixing Analogy:
              </h4>
              <div className="space-y-2 text-sm">
                <p>Imagine colors that are easy to mix but impossible to un-mix:</p>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-yellow-400"></div>
                    <span>Public color (like p, g)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-red-500"></div>
                    <span>Alice's secret color (a)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-500"></div>
                    <span>Bob's secret color (b)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-orange-500"></div>
                    <span>Alice shares: Yellow + Red</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-green-500"></div>
                    <span>Bob shares: Yellow + Blue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gray-700"></div>
                    <span>Both get: Yellow + Red + Blue = Secret!</span>
                  </div>
                </div>
                <p className="mt-3 text-xs italic">
                  Eve sees the mixed colors but can't extract the original secret colors!
                </p>
              </div>
            </div>
          </div>

          {/* Mathematical Proof */}
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              📐 Why Do Both Get The Same Secret?
            </h4>
            <div className="font-mono text-sm space-y-1">
              <p>Alice computes: s = B<sup>a</sup> mod p = (g<sup>b</sup>)<sup>a</sup> mod p = g<sup>ba</sup> mod p</p>
              <p>Bob computes: s = A<sup>b</sup> mod p = (g<sup>a</sup>)<sup>b</sup> mod p = g<sup>ab</sup> mod p</p>
              <p className="text-green-600 font-bold mt-2">Since ab = ba, both get the same value! ✓</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real World Usage */}
      <div className={card}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          🌍 Where Is Diffie-Hellman Used?
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: '🔒', title: 'HTTPS/TLS', desc: 'Every secure website uses DH to establish session keys' },
            { icon: '💬', title: 'WhatsApp/Signal', desc: 'End-to-end encrypted messaging uses DH variants' },
            { icon: '🖥️', title: 'SSH', desc: 'Secure shell connections use DH for key exchange' },
            { icon: '🌐', title: 'VPNs', desc: 'Virtual Private Networks establish secure tunnels with DH' },
            { icon: '📧', title: 'PGP Email', desc: 'Encrypted email uses DH for key agreement' },
            { icon: '🔐', title: 'IPSec', desc: 'Network-layer security protocols rely on DH' },
          ].map((item) => (
            <div key={item.title} className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl mb-2">{item.icon}</div>
              <h5 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h5>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Terminology */}
      <div className={card}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📖 Key Terms to Remember
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { term: 'Prime (p)', def: 'A large prime number that defines the mathematical group. Bigger = more secure.' },
            { term: 'Generator (g)', def: 'Also called "primitive root". A number whose powers generate all values from 1 to p-1.' },
            { term: 'Private Key (a, b)', def: 'Secret random numbers chosen by each party. Never shared!' },
            { term: 'Public Value (A, B)', def: 'Values computed from private keys that can be safely shared publicly.' },
            { term: 'Shared Secret (s)', def: 'The final secret both parties compute. Used as encryption key.' },
            { term: 'Discrete Logarithm', def: 'The hard math problem DH relies on. Finding x from g^x mod p is very hard!' },
          ].map((item) => (
            <div key={item.term} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <span className="font-bold text-indigo-600">{item.term}:</span>
              <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.def}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   TOOL TAB - Interactive Simulation
═══════════════════════════════════════════════════════════════════════════ */
const ToolTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [p, setP] = useState(23);
  const [g, setG] = useState(5);
  const [alicePrivate, setAlicePrivate] = useState(6);
  const [bobPrivate, setBobPrivate] = useState(15);
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Computed values
  const alicePublic = modPow(g, alicePrivate, p);
  const bobPublic = modPow(g, bobPrivate, p);
  const aliceShared = modPow(bobPublic, alicePrivate, p);
  const bobShared = modPow(alicePublic, bobPrivate, p);

  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  const inputClass = `w-full p-3 rounded-xl border-2 ${
    isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-200'
  } focus:border-indigo-500 focus:outline-none`;

  // Auto-play animation
  const runAnimation = () => {
    setIsAnimating(true);
    setAnimationStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setAnimationStep(step);
      if (step >= 5) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Public Parameters */}
      <div className={card}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          🔧 Step 1: Public Parameters (Visible to Everyone)
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Prime Number (p)
            </label>
            <select
              value={p}
              onChange={(e) => {
                const newP = parseInt(e.target.value);
                setP(newP);
                setG(PRIMITIVE_ROOTS[newP]?.[0] || 2);
              }}
              className={inputClass}
            >
              {PRIMES.map(prime => (
                <option key={prime} value={prime}>{prime}</option>
              ))}
            </select>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              In practice, this would be a 2048+ bit number
            </p>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Generator (g)
            </label>
            <select
              value={g}
              onChange={(e) => setG(parseInt(e.target.value))}
              className={inputClass}
            >
              {(PRIMITIVE_ROOTS[p] || [2, 3, 5]).slice(0, 6).map(root => (
                <option key={root} value={root}>{root}</option>
              ))}
            </select>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Must be a primitive root modulo p
            </p>
          </div>
        </div>

        <div className={`mt-4 p-3 rounded-xl ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'} flex items-center gap-3`}>
          <span className="text-2xl">📡</span>
          <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            These values are <strong>public</strong> — Eve (the attacker) knows them too. That's okay!
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className={card}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setShowPrivateKeys(!showPrivateKeys)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              showPrivateKeys
                ? 'bg-red-500 text-white'
                : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {showPrivateKeys ? <EyeOff size={18} /> : <Eye size={18} />}
            {showPrivateKeys ? 'Hide Private Keys' : 'Show Private Keys'}
          </button>
          
          <button
            onClick={runAnimation}
            disabled={isAnimating}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all
              ${isAnimating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg'
              }`}
          >
            {isAnimating ? '⏳ Running...' : '▶️ Run Animation'}
          </button>
          
          <button
            onClick={() => {
              setAlicePrivate(Math.floor(Math.random() * (p - 2)) + 1);
              setBobPrivate(Math.floor(Math.random() * (p - 2)) + 1);
            }}
            className={`px-4 py-2 rounded-xl font-semibold ${
              isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎲 Randomize Keys
          </button>
        </div>
      </div>

      {/* Alice and Bob Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Alice */}
        <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${
          animationStep >= 1 ? 'ring-4 ring-pink-400 ring-opacity-50' : ''
        } ${isDarkMode ? 'bg-pink-900/20 border-pink-600' : 'bg-pink-50 border-pink-300'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              A
            </div>
            <div>
              <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Alice</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Party 1</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Private Key */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} ${
              animationStep === 1 ? 'ring-2 ring-pink-400 animate-pulse' : ''
            }`}>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                🔐 Private Key (a) — SECRET!
              </label>
              <input
                type={showPrivateKeys ? 'number' : 'password'}
                value={alicePrivate}
                onChange={(e) => setAlicePrivate(Math.max(1, Math.min(p - 1, parseInt(e.target.value) || 1)))}
                min={1}
                max={p - 1}
                className={`w-full p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-600 text-white' : 'bg-pink-50'
                } border-2 border-pink-400 focus:outline-none font-mono text-lg`}
              />
              {!showPrivateKeys && (
                <p className="text-xs mt-1 text-pink-500">🔒 Hidden (click "Show Private Keys" to reveal)</p>
              )}
            </div>

            {/* Public Value */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} ${
              animationStep === 2 ? 'ring-2 ring-pink-400 animate-pulse' : ''
            }`}>
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                📤 Alice computes and sends:
              </div>
              <div className="font-mono text-sm">
                A = g<sup>a</sup> mod p = {g}<sup>{showPrivateKeys ? alicePrivate : '●●'}</sup> mod {p}
              </div>
              <div className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                A = {alicePublic}
              </div>
            </div>

            {/* Shared Secret */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} ${
              animationStep >= 4 ? 'ring-2 ring-green-400' : ''
            }`}>
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                🔐 After receiving B = {bobPublic}:
              </div>
              <div className="font-mono text-sm">
                s = B<sup>a</sup> mod p = {bobPublic}<sup>{showPrivateKeys ? alicePrivate : '●●'}</sup> mod {p}
              </div>
              <div className={`text-2xl font-bold mt-2 ${
                animationStep >= 4 ? 'text-green-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Shared Secret = {animationStep >= 4 ? aliceShared : '???'}
              </div>
            </div>
          </div>
        </div>

        {/* Bob */}
        <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${
          animationStep >= 1 ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
        } ${isDarkMode ? 'bg-blue-900/20 border-blue-600' : 'bg-blue-50 border-blue-300'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              B
            </div>
            <div>
              <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Bob</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Party 2</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Private Key */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} ${
              animationStep === 1 ? 'ring-2 ring-blue-400 animate-pulse' : ''
            }`}>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                🔐 Private Key (b) — SECRET!
              </label>
              <input
                type={showPrivateKeys ? 'number' : 'password'}
                value={bobPrivate}
                onChange={(e) => setBobPrivate(Math.max(1, Math.min(p - 1, parseInt(e.target.value) || 1)))}
                min={1}
                max={p - 1}
                className={`w-full p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-600 text-white' : 'bg-blue-50'
                } border-2 border-blue-400 focus:outline-none font-mono text-lg`}
              />
              {!showPrivateKeys && (
                <p className="text-xs mt-1 text-blue-500">🔒 Hidden (click "Show Private Keys" to reveal)</p>
              )}
            </div>

            {/* Public Value */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} ${
              animationStep === 2 ? 'ring-2 ring-blue-400 animate-pulse' : ''
            }`}>
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                📤 Bob computes and sends:
              </div>
              <div className="font-mono text-sm">
                B = g<sup>b</sup> mod p = {g}<sup>{showPrivateKeys ? bobPrivate : '●●'}</sup> mod {p}
              </div>
              <div className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                B = {bobPublic}
              </div>
            </div>

            {/* Shared Secret */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} ${
              animationStep >= 4 ? 'ring-2 ring-green-400' : ''
            }`}>
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                🔐 After receiving A = {alicePublic}:
              </div>
              <div className="font-mono text-sm">
                s = A<sup>b</sup> mod p = {alicePublic}<sup>{showPrivateKeys ? bobPrivate : '●●'}</sup> mod {p}
              </div>
              <div className={`text-2xl font-bold mt-2 ${
                animationStep >= 4 ? 'text-green-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Shared Secret = {animationStep >= 4 ? bobShared : '???'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Animation */}
      {animationStep === 3 && (
        <div className={`${card} text-center`}>
          <div className="text-4xl mb-2">📡 ↔️ 📡</div>
          <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Exchanging public values over insecure channel...
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Alice sends A = {alicePublic} to Bob | Bob sends B = {bobPublic} to Alice
          </p>
        </div>
      )}

      {/* Success Message */}
      {aliceShared === bobShared && animationStep >= 5 && (
        <div className={`${card} border-2 border-green-500 ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
          <div className="flex items-center gap-4">
            <div className="text-5xl">✅</div>
            <div>
              <h4 className={`text-xl font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                Key Exchange Successful!
              </h4>
              <p className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                Both Alice and Bob now share the secret: <span className="text-3xl font-bold">{aliceShared}</span>
              </p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                This secret can now be used as an encryption key for AES or another symmetric cipher.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Eve's View */}
      <div className={`${card} border-2 border-red-400 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <div>
            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              👁️ Eve (Eavesdropper)
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Can see all public communications
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <h5 className={`font-semibold mb-2 text-green-600`}>✅ What Eve Knows:</h5>
            <ul className="space-y-1 text-sm">
              <li>• Prime p = {p}</li>
              <li>• Generator g = {g}</li>
              <li>• Alice's public value A = {alicePublic}</li>
              <li>• Bob's public value B = {bobPublic}</li>
            </ul>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <h5 className={`font-semibold mb-2 text-red-600`}>❌ What Eve Can't Know:</h5>
            <ul className="space-y-1 text-sm">
              <li>• Alice's private key a = ???</li>
              <li>• Bob's private key b = ???</li>
              <li>• Shared secret s = ???</li>
            </ul>
          </div>
        </div>

        <div className={`mt-4 p-4 rounded-xl ${isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
            <strong>🔒 Why Can't Eve Compute the Secret?</strong><br />
            Eve would need to solve: "Find a such that {g}<sup>a</sup> ≡ {alicePublic} (mod {p})"<br />
            This is the <strong>Discrete Logarithm Problem</strong> — computationally infeasible for large numbers!
          </p>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   ATTACKS TAB - Security Analysis & Attack Simulations
═══════════════════════════════════════════════════════════════════════════ */
const AttacksTab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [targetP, setTargetP] = useState(23);
  const [targetG, setTargetG] = useState(5);
  const [targetA, setTargetA] = useState(8); // Public value to crack
  const [crackResult, setCrackResult] = useState<{ x: number; attempts: number } | null>(null);
  const [isCracking, setIsCracking] = useState(false);
  
  // MITM simulation state
  const [mitmStep, setMitmStep] = useState(0);
  const [mitmAlicePrivate] = useState(6);
  const [mitmBobPrivate] = useState(15);
  const [mitmMalloryPrivate] = useState(10);

  const card = `rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;

  // Run brute force attack
  const runBruteForce = () => {
    setIsCracking(true);
    setCrackResult(null);
    
    // Simulate delay for dramatic effect
    setTimeout(() => {
      const result = discreteLog(targetG, targetA, targetP);
      setCrackResult(result);
      setIsCracking(false);
    }, 500);
  };

  // MITM computations
  const mitmAlicePublic = modPow(targetG, mitmAlicePrivate, targetP);
  const mitmBobPublic = modPow(targetG, mitmBobPrivate, targetP);
  const mitmMalloryPublicForAlice = modPow(targetG, mitmMalloryPrivate, targetP);
  const mitmMalloryPublicForBob = modPow(targetG, mitmMalloryPrivate, targetP);
  const mitmSharedAliceMallory = modPow(mitmAlicePublic, mitmMalloryPrivate, targetP);
  const mitmSharedBobMallory = modPow(mitmBobPublic, mitmMalloryPrivate, targetP);

  return (
    <div className="space-y-6">
      {/* Introduction to Attacks Section */}
      <div className={card}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          ⚔️ Understanding Attacks on Diffie-Hellman
        </h2>
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>
             Understanding <strong>how cryptographic systems can be attacked</strong> is 
            just as important as understanding how they work. This section demonstrates two main attack vectors 
            against Diffie-Hellman:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-red-900/20 border border-red-600' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔨</span>
                <h4 className={`font-bold ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                  1. Discrete Logarithm Attack
                </h4>
              </div>
              <p className="text-sm">
                If an attacker can solve the discrete logarithm problem, they can recover the private key 
                from the public value and break the entire system.
              </p>
            </div>
            
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-orange-900/20 border border-orange-600' : 'bg-orange-50 border border-orange-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🕵️</span>
                <h4 className={`font-bold ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                  2. Man-in-the-Middle Attack
                </h4>
              </div>
              <p className="text-sm">
                Without authentication, an attacker can intercept and replace public values, 
                establishing separate keys with each party.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          ATTACK 1: DISCRETE LOGARITHM / BRUTE FORCE
      ═══════════════════════════════════════════════════════════════════ */}
      <div className={card}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🔨</span>
          <div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Attack 1: Solving the Discrete Logarithm
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Brute Force Approach — Try all possible private keys
            </p>
          </div>
        </div>

        {/* Explanation Box */}
        <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
          <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
            📚 What is This Attack?
          </h4>
          <div className={`text-sm space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <p>
              <strong>The Goal:</strong> Eve intercepts Alice's public value A = {targetA}. 
              She wants to find Alice's private key 'a' such that g<sup>a</sup> ≡ A (mod p).
            </p>
            <p>
              <strong>The Method:</strong> Try every possible value of 'a' from 1 to p-1 and check 
              if g<sup>a</sup> mod p equals A.
            </p>
            <p>
              <strong>Why It Matters:</strong> If Eve finds 'a', she can compute the shared secret 
              s = B<sup>a</sup> mod p and decrypt all communications!
            </p>
          </div>
        </div>

        {/* Attack Parameters */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Prime (p)
            </label>
            <select
              value={targetP}
              onChange={(e) => {
                const newP = parseInt(e.target.value);
                setTargetP(newP);
                setTargetG(PRIMITIVE_ROOTS[newP]?.[0] || 2);
                setCrackResult(null);
              }}
              className={`w-full p-3 rounded-xl border-2 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}
            >
              {PRIMES.map(prime => (
                <option key={prime} value={prime}>{prime}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Generator (g)
            </label>
            <select
              value={targetG}
              onChange={(e) => { setTargetG(parseInt(e.target.value)); setCrackResult(null); }}
              className={`w-full p-3 rounded-xl border-2 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}
            >
              {(PRIMITIVE_ROOTS[targetP] || [2]).slice(0, 4).map(root => (
                <option key={root} value={root}>{root}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Public Value to Crack (A)
            </label>
            <input
              type="number"
              value={targetA}
              onChange={(e) => { setTargetA(parseInt(e.target.value) || 1); setCrackResult(null); }}
              min={1}
              max={targetP - 1}
              className={`w-full p-3 rounded-xl border-2 ${
                isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}
            />
          </div>
        </div>

        {/* Attack Button */}
        <button
          onClick={runBruteForce}
          disabled={isCracking}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            isCracking
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:scale-[1.02]'
          }`}
        >
          {isCracking ? '🔄 Cracking...' : `🔨 Crack Private Key (Find 'a' where ${targetG}^a ≡ ${targetA} mod ${targetP})`}
        </button>

        {/* Results */}
        {crackResult && (
          <div className={`mt-6 p-6 rounded-xl ${isDarkMode ? 'bg-green-900/30 border border-green-600' : 'bg-green-50 border border-green-300'}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🎯</span>
              <div>
                <h4 className={`text-xl font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                  Private Key Cracked!
                </h4>
                <p className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Found a = <span className="text-3xl font-mono">{crackResult.x}</span>
                </p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                📊 Attack Statistics:
              </h5>
              <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• Attempts required: <strong>{crackResult.attempts}</strong></li>
                <li>• Maximum possible attempts: <strong>{targetP - 1}</strong></li>
                <li>• Verification: {targetG}<sup>{crackResult.x}</sup> mod {targetP} = {modPow(targetG, crackResult.x, targetP)} ✓</li>
              </ul>
            </div>
          </div>
        )}

        {/* Complexity Analysis Chart */}
        <div className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Why Brute Force Doesn't Work in Real World
          </h4>
          
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            The bar chart below shows how the number of attempts needed grows exponentially with key size. 
            Notice how small keys (like our demo) are cracked instantly, but real-world keys are impossible!
          </p>

          <div className="space-y-3">
            {[
              { bits: 'Our Demo (5-8 bits)', attempts: targetP - 1, width: 1, time: `${targetP - 1} attempts`, color: 'bg-red-500' },
              { bits: '32-bit prime', attempts: Math.pow(2, 32), width: 10, time: '~4 billion attempts (seconds)', color: 'bg-orange-500' },
              { bits: '64-bit prime', attempts: Math.pow(2, 64), width: 25, time: '~18 quintillion (years)', color: 'bg-yellow-500' },
              { bits: '256-bit prime', attempts: 'Impossibly large', width: 50, time: '> age of universe', color: 'bg-green-500' },
              { bits: '2048-bit (real DH)', attempts: 'Astronomical', width: 100, time: '🔒 Secure forever', color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.bits}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{item.bits}</span>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{item.time}</span>
                </div>
                <div className={`h-6 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-full rounded-full ${item.color} transition-all duration-1000`} 
                    style={{ width: `${item.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              <strong>📖 What This Chart Shows:</strong> Each bar represents how long it would take to try all 
              possible private keys for that key size. The red bar (our demo) is tiny because we use small numbers. 
              The green bars show that real-world DH is completely safe from brute force attacks!
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          ATTACK 2: MAN-IN-THE-MIDDLE
      ═══════════════════════════════════════════════════════════════════ */}
      <div className={card}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🕵️</span>
          <div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Attack 2: Man-in-the-Middle (MITM)
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Active attack when there's no authentication
            </p>
          </div>
        </div>

        {/* Explanation Box */}
        <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
          <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
            📚 What is a Man-in-the-Middle Attack?
          </h4>
          <div className={`text-sm space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <p>
              <strong>The Scenario:</strong> Alice wants to talk to Bob, but Mallory (the attacker) 
              positions herself between them on the network.
            </p>
            <p>
              <strong>The Attack:</strong> Instead of forwarding messages, Mallory:
            </p>
            <ol className="list-decimal list-inside ml-4 space-y-1">
              <li>Intercepts Alice's public value and sends her own to Bob</li>
              <li>Intercepts Bob's public value and sends her own to Alice</li>
              <li>Now has two separate shared secrets — one with each party!</li>
            </ol>
            <p>
              <strong>The Result:</strong> Alice thinks she's talking to Bob, Bob thinks he's talking to Alice, 
              but Mallory can read and modify ALL messages!
            </p>
          </div>
        </div>

        {/* MITM Step-by-Step Animation */}
        <div className="mb-6">
          <div className="flex justify-center gap-2 mb-4 flex-wrap">
            {[
              { step: 0, label: 'Setup' },
              { step: 1, label: 'Alice Sends' },
              { step: 2, label: 'Mallory Intercepts' },
              { step: 3, label: 'Bob Sends' },
              { step: 4, label: 'Mallory Intercepts' },
              { step: 5, label: 'Result' },
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => setMitmStep(s.step)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mitmStep === s.step
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white scale-105'
                    : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s.step + 1}. {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* MITM Visualization */}
        <div className={`p-6 rounded-xl min-h-[250px] ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          {/* Three parties */}
          <div className="flex justify-between items-start mb-8">
            {/* Alice */}
            <div className="text-center flex-1">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                A
              </div>
              <p className={`font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Alice</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>a = {mitmAlicePrivate}</p>
              <p className={`text-sm font-mono ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                A = {mitmAlicePublic}
              </p>
            </div>

            {/* Mallory */}
            <div className="text-center flex-1">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                mitmStep >= 2 ? 'bg-gradient-to-br from-red-500 to-orange-500 animate-pulse' : 'bg-gray-400'
              }`}>
                M
              </div>
              <p className={`font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mallory</p>
              <p className={`text-xs text-red-500`}>🕵️ Attacker</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>m = {mitmMalloryPrivate}</p>
              <p className={`text-sm font-mono ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                M = {mitmMalloryPublicForAlice}
              </p>
            </div>

            {/* Bob */}
            <div className="text-center flex-1">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                B
              </div>
              <p className={`font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Bob</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>b = {mitmBobPrivate}</p>
              <p className={`text-sm font-mono ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                B = {mitmBobPublic}
              </p>
            </div>
          </div>

          {/* Step descriptions */}
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-600' : 'bg-white'} min-h-[100px]`}>
            {mitmStep === 0 && (
              <div className="text-center">
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  🎭 Initial Setup
                </p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Alice (a={mitmAlicePrivate}), Bob (b={mitmBobPrivate}), and Mallory (m={mitmMalloryPrivate}) each have private keys.
                  Mallory is positioned between Alice and Bob on the network.
                </p>
              </div>
            )}

            {mitmStep === 1 && (
              <div>
                <p className={`font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  📤 Alice Sends Her Public Value
                </p>
                <div className="flex justify-center items-center mt-3">
                  <span className="px-3 py-1 rounded bg-pink-500 text-white">A = {mitmAlicePublic}</span>
                  <span className="mx-4 text-2xl">→→→</span>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>(intended for Bob)</span>
                </div>
              </div>
            )}

            {mitmStep === 2 && (
              <div>
                <p className={`font-semibold text-center text-red-500`}>
                  🚨 Mallory Intercepts & Replaces!
                </p>
                <div className="flex flex-col items-center mt-3 space-y-2">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Mallory catches A = {mitmAlicePublic} and computes shared secret with Alice:
                  </p>
                  <p className="font-mono text-sm">
                    s₁ = A<sup>m</sup> mod p = {mitmAlicePublic}<sup>{mitmMalloryPrivate}</sup> mod {targetP} = <span className="text-green-500 font-bold">{mitmSharedAliceMallory}</span>
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Then sends her own public value M = {mitmMalloryPublicForBob} to Bob (pretending to be Alice)
                  </p>
                </div>
              </div>
            )}

            {mitmStep === 3 && (
              <div>
                <p className={`font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  📤 Bob Sends His Public Value
                </p>
                <div className="flex justify-center items-center mt-3">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>(intended for Alice)</span>
                  <span className="mx-4 text-2xl">←←←</span>
                  <span className="px-3 py-1 rounded bg-blue-500 text-white">B = {mitmBobPublic}</span>
                </div>
              </div>
            )}

            {mitmStep === 4 && (
              <div>
                <p className={`font-semibold text-center text-red-500`}>
                  🚨 Mallory Intercepts Again!
                </p>
                <div className="flex flex-col items-center mt-3 space-y-2">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Mallory catches B = {mitmBobPublic} and computes shared secret with Bob:
                  </p>
                  <p className="font-mono text-sm">
                    s₂ = B<sup>m</sup> mod p = {mitmBobPublic}<sup>{mitmMalloryPrivate}</sup> mod {targetP} = <span className="text-green-500 font-bold">{mitmSharedBobMallory}</span>
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Then sends her own public value M = {mitmMalloryPublicForAlice} to Alice (pretending to be Bob)
                  </p>
                </div>
              </div>
            )}

            {mitmStep === 5 && (
              <div>
                <p className={`font-semibold text-center text-red-500`}>
                  💀 Attack Complete — Mallory Controls Everything!
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-pink-900/30' : 'bg-pink-50'}`}>
                    <p className="font-bold text-pink-600">Alice thinks:</p>
                    <p className="text-sm">Shared secret with "Bob" = {mitmSharedAliceMallory}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                    <p className="font-bold text-red-600">Mallory knows:</p>
                    <p className="text-sm">Secret with Alice = {mitmSharedAliceMallory}</p>
                    <p className="text-sm">Secret with Bob = {mitmSharedBobMallory}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                    <p className="font-bold text-blue-600">Bob thinks:</p>
                    <p className="text-sm">Shared secret with "Alice" = {mitmSharedBobMallory}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MITM Explanation */}
        <div className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} border border-red-400`}>
          <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
            📖 What This Simulation Shows:
          </h4>
          <div className={`text-sm space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <p>
              <strong>The Diagram Above:</strong> Shows three parties — Alice (pink), Mallory (red), and Bob (blue). 
              The arrows show message flow, and you can see how Mallory intercepts and replaces each public value.
            </p>
            <p>
              <strong>Key Insight:</strong> Notice that Alice and Bob end up with DIFFERENT "shared secrets" 
              (Alice: {mitmSharedAliceMallory}, Bob: {mitmSharedBobMallory}). This is the proof that the MITM attack worked — 
              they're not actually communicating securely with each other!
            </p>
            <p>
              <strong>Real-World Impact:</strong> Mallory can now decrypt Alice's messages using {mitmSharedAliceMallory}, 
              read/modify them, and re-encrypt with {mitmSharedBobMallory} before forwarding to Bob. Neither party knows!
            </p>
          </div>
        </div>

        {/* Prevention */}
        <div className={`mt-4 p-4 rounded-xl ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'} border border-green-400`}>
          <h4 className={`font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
            <Shield size={20} />
            How to Prevent MITM Attacks
          </h4>
          <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <li>✅ <strong>Digital Certificates:</strong> Use PKI to verify identities (like HTTPS does)</li>
            <li>✅ <strong>Pre-shared Secrets:</strong> Verify key fingerprints out-of-band</li>
            <li>✅ <strong>Authenticated DH:</strong> Use protocols like STS (Station-to-Station)</li>
            <li>✅ <strong>Signal Protocol:</strong> Uses Triple-DH with identity keys for authentication</li>
          </ul>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SUMMARY & KEY TAKEAWAYS
      ═══════════════════════════════════════════════════════════════════ */}
      <div className={card}>
        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          🎓 Key Takeaways for Students
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              ✅ DH Security Strengths
            </h4>
            <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• Discrete log is computationally hard for large primes</li>
              <li>• Forward secrecy — compromising long-term keys doesn't expose past sessions</li>
              <li>• Efficient — works well even with limited computing power</li>
              <li>• Well-studied — decades of cryptanalysis, still secure</li>
            </ul>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              ⚠️ DH Security Weaknesses
            </h4>
            <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• No built-in authentication — vulnerable to MITM</li>
              <li>• Small parameters are easily broken</li>
              <li>• Quantum computers could break it (Shor's algorithm)</li>
              <li>• Implementation bugs can be exploited</li>
            </ul>
          </div>
        </div>

        <div className={`mt-4 p-4 rounded-xl ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
          <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
            🔑 Remember for Your Exams:
          </h4>
          <ol className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} list-decimal list-inside`}>
            <li>DH solves the key distribution problem but NOT authentication</li>
            <li>Security relies on the difficulty of the Discrete Logarithm Problem (DLP)</li>
            <li>Use at least 2048-bit primes in real applications</li>
            <li>Always combine DH with authentication (certificates, signatures)</li>
            <li>Modern variant ECDH (Elliptic Curve DH) is more efficient</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT - Combines all tabs
═══════════════════════════════════════════════════════════════════════════ */
export const DiffieHellman: React.FC = () => (
  <CipherTabLayout 
    tabs={[
      { id: 'learn', label: 'Learn', icon: '📖', content: <LearnTab /> },
      { id: 'tool', label: 'Key Exchange Simulator', icon: '🔧', content: <ToolTab /> },
      { id: 'attacks', label: 'Attack Analysis', icon: '⚔️', content: <AttacksTab /> },
    ]} 
  />
);