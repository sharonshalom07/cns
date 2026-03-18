import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Menu,
  X,
  Sun,
  Moon,
  Home,
  Key,
  Lock,
  Shield,
  Grid3X3,
  Fence,
  Columns,
  Binary,
  Cpu,
  KeyRound,
  Users // NEW ICON
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/caesar', label: 'Caesar Cipher', icon: Key },
  { path: '/vigenere', label: 'Vigenère Cipher', icon: Lock },
  { path: '/hill', label: 'Hill Cipher', icon: Grid3X3 },
  { path: '/playfair', label: 'Playfair Cipher', icon: Shield },
  { path: '/railfence', label: 'Rail Fence Cipher', icon: Fence },
  { path: '/columnar', label: 'Column Transposition', icon: Columns },
  { path: '/aes', label: 'AES', icon: Binary },
  { path: '/des', label: 'DES', icon: Cpu },
  { path: '/rsa', label: 'RSA', icon: KeyRound },
  { path: '/diffie-hellman', label: 'Diffie-Hellman', icon: Users }, // NEW
];

// ... rest of the Layout component remains the same
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {/* Mobile Header */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <Menu className={isDarkMode ? 'text-white' : 'text-gray-700'} size={24} />
          </button>
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-indigo-600'}`}>
            🔐 CryptoLearn
          </h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            {isDarkMode ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-gray-700" size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-indigo-600'}`}>
                🔐 CryptoLearn
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className={`lg:hidden p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={isDarkMode ? 'text-white' : 'text-gray-700'} size={20} />
              </button>
            </div>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Interactive Cipher Education
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive
                          ? isDarkMode
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-indigo-600 text-white shadow-lg'
                          : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-indigo-50'
                        }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Theme Toggle (Desktop) */}
          <div className={`hidden lg:block p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all
                ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-20 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};