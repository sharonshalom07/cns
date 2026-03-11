import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Key,
  Lock,
  Shield,
  Grid3X3,
  Fence,
  Columns,
  Binary,
  Cpu,
  KeyRound,
  ArrowRight,
  BookOpen,
  Sparkles,
  GraduationCap
} from 'lucide-react';

const ciphers = [
  {
    path: '/caesar',
    name: 'Caesar Cipher',
    icon: Key,
    color: 'from-red-500 to-orange-500',
    description: 'One of the oldest known encryption techniques, used by Julius Caesar.',
    type: 'Classical'
  },
  {
    path: '/vigenere',
    name: 'Vigenère Cipher',
    icon: Lock,
    color: 'from-orange-500 to-yellow-500',
    description: 'A polyalphabetic substitution cipher using a keyword.',
    type: 'Classical'
  },
  {
    path: '/hill',
    name: 'Hill Cipher',
    icon: Grid3X3,
    color: 'from-yellow-500 to-green-500',
    description: 'Uses linear algebra and matrix multiplication for encryption.',
    type: 'Classical'
  },
  {
    path: '/playfair',
    name: 'Playfair Cipher',
    icon: Shield,
    color: 'from-green-500 to-teal-500',
    description: 'Encrypts pairs of letters using a 5x5 matrix.',
    type: 'Classical'
  },
  {
    path: '/railfence',
    name: 'Rail Fence Cipher',
    icon: Fence,
    color: 'from-teal-500 to-cyan-500',
    description: 'A transposition cipher that writes text in a zigzag pattern.',
    type: 'Transposition'
  },
  {
    path: '/columnar',
    name: 'Column Transposition',
    icon: Columns,
    color: 'from-cyan-500 to-blue-500',
    description: 'Rearranges characters by writing and reading in columns.',
    type: 'Transposition'
  },
  {
    path: '/aes',
    name: 'AES',
    icon: Binary,
    color: 'from-blue-500 to-indigo-500',
    description: 'Advanced Encryption Standard - modern symmetric encryption.',
    type: 'Modern'
  },
  {
    path: '/des',
    name: 'DES',
    icon: Cpu,
    color: 'from-indigo-500 to-purple-500',
    description: 'Data Encryption Standard - historic symmetric-key algorithm.',
    type: 'Modern'
  },
  {
    path: '/rsa',
    name: 'RSA',
    icon: KeyRound,
    color: 'from-purple-500 to-pink-500',
    description: 'Public-key cryptosystem for secure data transmission.',
    type: 'Asymmetric'
  },
];

export const Home: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className={`rounded-3xl p-8 md:p-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">CryptoLearn</span>
            </h1>
            <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Master the art of cryptography through interactive learning. Explore classical and modern 
              encryption techniques with hands-on encryption and decryption tools.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-100'}`}>
                <BookOpen size={20} className="text-indigo-600" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Learn Concepts</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-purple-100'}`}>
                <Sparkles size={20} className="text-purple-600" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Interactive Tools</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-green-100'}`}>
                <GraduationCap size={20} className="text-green-600" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Step-by-Step</span>
              </div>
            </div>
          </div>
          <div className="text-9xl">🔐</div>
        </div>
      </div>

      {/* Cipher Categories */}
      <div className="grid gap-6">
        {/* Classical Ciphers */}
        <div>
          <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-yellow-500"></span>
            Classical Ciphers
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ciphers.filter(c => c.type === 'Classical').map(cipher => (
              <CipherCard key={cipher.path} {...cipher} isDarkMode={isDarkMode} />
            ))}
          </div>
        </div>

        {/* Transposition Ciphers */}
        <div>
          <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-blue-500"></span>
            Transposition Ciphers
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ciphers.filter(c => c.type === 'Transposition').map(cipher => (
              <CipherCard key={cipher.path} {...cipher} isDarkMode={isDarkMode} />
            ))}
          </div>
        </div>

        {/* Modern Ciphers */}
        <div>
          <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
            Modern & Asymmetric Ciphers
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ciphers.filter(c => c.type === 'Modern' || c.type === 'Asymmetric').map(cipher => (
              <CipherCard key={cipher.path} {...cipher} isDarkMode={isDarkMode} />
            ))}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className={`rounded-3xl p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} shadow-xl`}>
        <h2 className="text-2xl font-bold text-white mb-4">🎓 How to Use CryptoLearn</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <div className="text-4xl mb-3">1️⃣</div>
            <h3 className="text-xl font-bold text-white mb-2">Choose a Cipher</h3>
            <p className="text-white/80">Select any cipher from the sidebar or cards above to explore.</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <div className="text-4xl mb-3">2️⃣</div>
            <h3 className="text-xl font-bold text-white mb-2">Learn the Concept</h3>
            <p className="text-white/80">Read the explanation and understand how the cipher works.</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <div className="text-4xl mb-3">3️⃣</div>
            <h3 className="text-xl font-bold text-white mb-2">Practice & Experiment</h3>
            <p className="text-white/80">Use the interactive tool to encrypt and decrypt messages.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CipherCard: React.FC<{
  path: string;
  name: string;
  icon: React.FC<{ size?: number; className?: string }>;
  color: string;
  description: string;
  isDarkMode: boolean;
}> = ({ path, name, icon: Icon, color, description, isDarkMode }) => (
  <Link
    to={path}
    className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 
      hover:shadow-2xl hover:scale-105 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} mb-4`}>
      <Icon size={24} className="text-white" />
    </div>
    <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {name}
    </h3>
    <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      {description}
    </p>
    <div className={`flex items-center gap-1 text-sm font-semibold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
      Explore <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);
