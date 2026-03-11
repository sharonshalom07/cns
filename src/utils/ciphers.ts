// Caesar Cipher
export const caesarEncrypt = (text: string, shift: number): string => {
  return text
    .split('')
    .map((char) => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26 + 26) % 26 + base);
      }
      return char;
    })
    .join('');
};

export const caesarDecrypt = (text: string, shift: number): string => {
  return caesarEncrypt(text, -shift);
};

// Vigenère Cipher
export const vigenereEncrypt = (text: string, key: string): string => {
  const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (keyUpper.length === 0) return text;
  
  let keyIndex = 0;
  return text
    .split('')
    .map((char) => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        const shift = keyUpper.charCodeAt(keyIndex % keyUpper.length) - 65;
        keyIndex++;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    })
    .join('');
};

export const vigenereDecrypt = (text: string, key: string): string => {
  const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (keyUpper.length === 0) return text;
  
  let keyIndex = 0;
  return text
    .split('')
    .map((char) => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        const shift = keyUpper.charCodeAt(keyIndex % keyUpper.length) - 65;
        keyIndex++;
        return String.fromCharCode(((code - base - shift + 26) % 26) + base);
      }
      return char;
    })
    .join('');
};

// Hill Cipher (2x2 matrix)
const mod = (n: number, m: number): number => ((n % m) + m) % m;

const modInverse = (a: number, m: number): number => {
  a = mod(a, m);
  for (let x = 1; x < m; x++) {
    if (mod(a * x, m) === 1) return x;
  }
  return -1;
};

const matrixDeterminant2x2 = (matrix: number[][]): number => {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
};

const matrixInverse2x2Mod26 = (matrix: number[][]): number[][] | null => {
  const det = mod(matrixDeterminant2x2(matrix), 26);
  const detInv = modInverse(det, 26);
  
  if (detInv === -1) return null;
  
  return [
    [mod(matrix[1][1] * detInv, 26), mod(-matrix[0][1] * detInv, 26)],
    [mod(-matrix[1][0] * detInv, 26), mod(matrix[0][0] * detInv, 26)]
  ];
};

export const parseHillKey = (key: string): number[][] | null => {
  const nums = key.split(',').map(n => parseInt(n.trim()));
  if (nums.length !== 4 || nums.some(isNaN)) return null;
  return [[nums[0], nums[1]], [nums[2], nums[3]]];
};

export const isHillKeyValid = (matrix: number[][]): boolean => {
  const det = mod(matrixDeterminant2x2(matrix), 26);
  const detInv = modInverse(det, 26);
  return detInv !== -1;
};

export const hillEncrypt = (text: string, keyMatrix: number[][]): string => {
  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
  const paddedText = cleanText.length % 2 === 0 ? cleanText : cleanText + 'X';
  
  let result = '';
  for (let i = 0; i < paddedText.length; i += 2) {
    const p1 = paddedText.charCodeAt(i) - 65;
    const p2 = paddedText.charCodeAt(i + 1) - 65;
    
    const c1 = mod(keyMatrix[0][0] * p1 + keyMatrix[0][1] * p2, 26);
    const c2 = mod(keyMatrix[1][0] * p1 + keyMatrix[1][1] * p2, 26);
    
    result += String.fromCharCode(c1 + 65) + String.fromCharCode(c2 + 65);
  }
  return result;
};

export const hillDecrypt = (text: string, keyMatrix: number[][]): string | null => {
  const inverseMatrix = matrixInverse2x2Mod26(keyMatrix);
  if (!inverseMatrix) return null;
  
  return hillEncrypt(text, inverseMatrix);
};

// Playfair Cipher
const generatePlayfairMatrix = (key: string): string[][] => {
  const keyUpper = key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // No J
  const seen = new Set<string>();
  const chars: string[] = [];
  
  for (const c of keyUpper + alphabet) {
    if (!seen.has(c)) {
      seen.add(c);
      chars.push(c);
    }
  }
  
  const matrix: string[][] = [];
  for (let i = 0; i < 5; i++) {
    matrix.push(chars.slice(i * 5, (i + 1) * 5));
  }
  return matrix;
};

const findInMatrix = (matrix: string[][], char: string): [number, number] => {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix[i][j] === char) return [i, j];
    }
  }
  return [-1, -1];
};

export const playfairEncrypt = (text: string, key: string): string => {
  const matrix = generatePlayfairMatrix(key);
  let cleanText = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  
  // Insert X between repeated letters
  let processed = '';
  for (let i = 0; i < cleanText.length; i++) {
    processed += cleanText[i];
    if (i + 1 < cleanText.length && cleanText[i] === cleanText[i + 1]) {
      processed += 'X';
    }
  }
  if (processed.length % 2 !== 0) processed += 'X';
  
  let result = '';
  for (let i = 0; i < processed.length; i += 2) {
    const [r1, c1] = findInMatrix(matrix, processed[i]);
    const [r2, c2] = findInMatrix(matrix, processed[i + 1]);
    
    if (r1 === r2) {
      result += matrix[r1][(c1 + 1) % 5] + matrix[r2][(c2 + 1) % 5];
    } else if (c1 === c2) {
      result += matrix[(r1 + 1) % 5][c1] + matrix[(r2 + 1) % 5][c2];
    } else {
      result += matrix[r1][c2] + matrix[r2][c1];
    }
  }
  return result;
};

export const playfairDecrypt = (text: string, key: string): string => {
  const matrix = generatePlayfairMatrix(key);
  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
  
  let result = '';
  for (let i = 0; i < cleanText.length; i += 2) {
    const [r1, c1] = findInMatrix(matrix, cleanText[i]);
    const [r2, c2] = findInMatrix(matrix, cleanText[i + 1] || 'X');
    
    if (r1 === r2) {
      result += matrix[r1][(c1 + 4) % 5] + matrix[r2][(c2 + 4) % 5];
    } else if (c1 === c2) {
      result += matrix[(r1 + 4) % 5][c1] + matrix[(r2 + 4) % 5][c2];
    } else {
      result += matrix[r1][c2] + matrix[r2][c1];
    }
  }
  return result;
};

export const getPlayfairMatrix = (key: string): string[][] => generatePlayfairMatrix(key);

// Rail Fence Cipher
export const railFenceEncrypt = (text: string, rails: number): string => {
  if (rails <= 1 || rails >= text.length) return text;
  
  const fence: string[][] = Array.from({ length: rails }, () => []);
  let rail = 0;
  let direction = 1;
  
  for (const char of text) {
    fence[rail].push(char);
    rail += direction;
    if (rail === rails - 1 || rail === 0) direction *= -1;
  }
  
  return fence.flat().join('');
};

export const railFenceDecrypt = (text: string, rails: number): string => {
  if (rails <= 1 || rails >= text.length) return text;
  
  const n = text.length;
  const fence: (string | null)[][] = Array.from({ length: rails }, () => Array(n).fill(null));
  
  let rail = 0;
  let direction = 1;
  for (let i = 0; i < n; i++) {
    fence[rail][i] = '*';
    rail += direction;
    if (rail === rails - 1 || rail === 0) direction *= -1;
  }
  
  let index = 0;
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < n; c++) {
      if (fence[r][c] === '*') {
        fence[r][c] = text[index++];
      }
    }
  }
  
  let result = '';
  rail = 0;
  direction = 1;
  for (let i = 0; i < n; i++) {
    result += fence[rail][i];
    rail += direction;
    if (rail === rails - 1 || rail === 0) direction *= -1;
  }
  
  return result;
};

// Column Transposition Cipher
export const columnTranspositionEncrypt = (text: string, key: string): string => {
  const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (keyUpper.length === 0) return text;
  
  const numCols = keyUpper.length;
  const numRows = Math.ceil(text.length / numCols);
  const paddedText = text.padEnd(numRows * numCols, 'X');
  
  // Create grid
  const grid: string[][] = [];
  for (let i = 0; i < numRows; i++) {
    grid.push(paddedText.slice(i * numCols, (i + 1) * numCols).split(''));
  }
  
  // Get column order based on key
  const keyOrder = keyUpper.split('').map((char, i) => ({ char, i }));
  keyOrder.sort((a, b) => a.char.localeCompare(b.char));
  
  let result = '';
  for (const { i } of keyOrder) {
    for (let row = 0; row < numRows; row++) {
      result += grid[row][i];
    }
  }
  
  return result;
};

export const columnTranspositionDecrypt = (text: string, key: string): string => {
  const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (keyUpper.length === 0) return text;
  
  const numCols = keyUpper.length;
  const numRows = Math.ceil(text.length / numCols);
  
  // Get column order based on key
  const keyOrder = keyUpper.split('').map((char, i) => ({ char, i }));
  keyOrder.sort((a, b) => a.char.localeCompare(b.char));
  
  // Fill columns in sorted order
  const columns: string[][] = Array.from({ length: numCols }, () => []);
  let index = 0;
  for (const { i } of keyOrder) {
    for (let row = 0; row < numRows; row++) {
      if (index < text.length) {
        columns[i].push(text[index++]);
      }
    }
  }
  
  // Read row by row
  let result = '';
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (columns[col][row]) {
        result += columns[col][row];
      }
    }
  }
  
  return result;
};

// AES (using crypto-js)
import CryptoJS from 'crypto-js';

export const aesEncrypt = (text: string, key: string): string => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

export const aesDecrypt = (ciphertext: string, key: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return 'Decryption failed - invalid key or ciphertext';
  }
};

// DES (using crypto-js)
export const desEncrypt = (text: string, key: string): string => {
  return CryptoJS.DES.encrypt(text, key).toString();
};

export const desDecrypt = (ciphertext: string, key: string): string => {
  try {
    const bytes = CryptoJS.DES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return 'Decryption failed - invalid key or ciphertext';
  }
};

// RSA (simplified demonstration - not cryptographically secure)
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const modPow = (base: bigint, exp: bigint, mod: bigint): bigint => {
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) {
      result = (result * base) % mod;
    }
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  return result;
};

export const generateRSAKeys = (p: number, q: number): { n: number; e: number; d: number } | null => {
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  
  // Find e
  let e = 65537;
  if (gcd(e, phi) !== 1) {
    for (e = 3; e < phi; e += 2) {
      if (gcd(e, phi) === 1) break;
    }
  }
  
  // Find d (modular inverse of e mod phi)
  let d = 1;
  while ((d * e) % phi !== 1) {
    d++;
    if (d > phi) return null;
  }
  
  return { n, e, d };
};

export const rsaEncrypt = (text: string, e: number, n: number): string => {
  return text
    .split('')
    .map((char) => {
      const m = BigInt(char.charCodeAt(0));
      const c = modPow(m, BigInt(e), BigInt(n));
      return c.toString();
    })
    .join(' ');
};

export const rsaDecrypt = (ciphertext: string, d: number, n: number): string => {
  try {
    return ciphertext
      .split(' ')
      .filter(s => s.length > 0)
      .map((num) => {
        const c = BigInt(num);
        const m = modPow(c, BigInt(d), BigInt(n));
        return String.fromCharCode(Number(m));
      })
      .join('');
  } catch {
    return 'Decryption failed';
  }
};
