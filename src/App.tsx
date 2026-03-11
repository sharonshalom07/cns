import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CaesarCipher } from './pages/CaesarCipher';
import { VigenereCipher } from './pages/VigenereCipher';
import { HillCipher } from './pages/HillCipher';
import { PlayfairCipher } from './pages/PlayfairCipher';
import { RailFenceCipher } from './pages/RailFenceCipher';
import { ColumnarCipher } from './pages/ColumnarCipher';
import { AESCipher } from './pages/AESCipher';
import { DESCipher } from './pages/DESCipher';
import { RSACipher } from './pages/RSACipher';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/caesar" element={<CaesarCipher />} />
            <Route path="/vigenere" element={<VigenereCipher />} />
            <Route path="/hill" element={<HillCipher />} />
            <Route path="/playfair" element={<PlayfairCipher />} />
            <Route path="/railfence" element={<RailFenceCipher />} />
            <Route path="/columnar" element={<ColumnarCipher />} />
            <Route path="/aes" element={<AESCipher />} />
            <Route path="/des" element={<DESCipher />} />
            <Route path="/rsa" element={<RSACipher />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
