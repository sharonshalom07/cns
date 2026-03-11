import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Lock, Unlock, Copy, Check, RefreshCw, ArrowRight } from 'lucide-react';

interface CipherPlaygroundProps {
  title: string;
  description: string;
  keyLabel: string;
  keyPlaceholder: string;
  keyType?: 'text' | 'number';
  defaultKey?: string;
  encrypt: (text: string, key: string) => string;
  decrypt: (text: string, key: string) => string | null;
  validateKey?: (key: string) => { valid: boolean; error?: string };
  renderVisualization?: (text: string, key: string, mode: 'encrypt' | 'decrypt') => React.ReactNode;
  additionalKeyInputs?: React.ReactNode;
}

export const CipherPlayground: React.FC<CipherPlaygroundProps> = ({
  title,
  description,
  keyLabel,
  keyPlaceholder,
  keyType = 'text',
  defaultKey = '',
  encrypt,
  decrypt,
  validateKey,
  renderVisualization,
  additionalKeyInputs,
}) => {
  const { isDarkMode } = useTheme();
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [keyValue, setKeyValue] = useState(defaultKey);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = () => {
    setError(null);
    
    if (validateKey) {
      const validation = validateKey(keyValue);
      if (!validation.valid) {
        setError(validation.error || 'Invalid key');
        return;
      }
    }

    try {
      if (mode === 'encrypt') {
        const result = encrypt(plaintext, keyValue);
        setCiphertext(result);
      } else {
        const result = decrypt(ciphertext, keyValue);
        if (result === null) {
          setError('Decryption failed. Please check your key.');
        } else {
          setPlaintext(result);
        }
      }
    } catch (e) {
      setError(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  const handleCopy = async () => {
    const textToCopy = mode === 'encrypt' ? ciphertext : plaintext;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setPlaintext(ciphertext);
    setCiphertext(plaintext);
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
  };

  const cardClass = `rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  const inputClass = `w-full p-4 rounded-xl border-2 transition-all duration-200 resize-none
    ${isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500' 
      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
    } focus:outline-none`;
  const labelClass = `block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className={cardClass + ' p-6'}>
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h1>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          {description}
        </p>
      </div>

      {/* Mode Toggle */}
      <div className={cardClass + ' p-4'}>
        <div className="flex rounded-xl overflow-hidden">
          <button
            onClick={() => setMode('encrypt')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 font-semibold transition-all
              ${mode === 'encrypt' 
                ? 'bg-green-500 text-white' 
                : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}
          >
            <Lock size={20} />
            Encrypt
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 font-semibold transition-all
              ${mode === 'decrypt' 
                ? 'bg-blue-500 text-white' 
                : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}
          >
            <Unlock size={20} />
            Decrypt
          </button>
        </div>
      </div>

      {/* Key Input */}
      <div className={cardClass + ' p-6'}>
        <label className={labelClass}>{keyLabel}</label>
        <input
          type={keyType}
          value={keyValue}
          onChange={(e) => setKeyValue(e.target.value)}
          placeholder={keyPlaceholder}
          className={inputClass.replace('resize-none', '')}
        />
        {additionalKeyInputs}
        {error && (
          <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Input/Output */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div className={cardClass + ' p-6'}>
          <label className={labelClass}>
            {mode === 'encrypt' ? '📝 Plaintext' : '🔒 Ciphertext'}
          </label>
          <textarea
            value={mode === 'encrypt' ? plaintext : ciphertext}
            onChange={(e) => mode === 'encrypt' ? setPlaintext(e.target.value) : setCiphertext(e.target.value)}
            placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter text to decrypt...'}
            rows={6}
            className={inputClass}
          />
        </div>

        {/* Output */}
        <div className={cardClass + ' p-6'}>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass + ' mb-0'}>
              {mode === 'encrypt' ? '🔒 Ciphertext' : '📝 Plaintext'}
            </label>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-all
                ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={mode === 'encrypt' ? ciphertext : plaintext}
            readOnly
            placeholder="Result will appear here..."
            rows={6}
            className={inputClass + ' cursor-default'}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleProcess}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 
            text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <ArrowRight size={20} />
          {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
        </button>
        <button
          onClick={handleSwap}
          className={`flex items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all
            ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          <RefreshCw size={20} />
          Swap & Switch Mode
        </button>
      </div>

      {/* Visualization */}
      {renderVisualization && (mode === 'encrypt' ? plaintext : ciphertext) && (
        <div className={cardClass + ' p-6'}>
          <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            🔍 Step-by-Step Visualization
          </h3>
          {renderVisualization(mode === 'encrypt' ? plaintext : ciphertext, keyValue, mode)}
        </div>
      )}
    </div>
  );
};
