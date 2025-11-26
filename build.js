import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JavaScriptObfuscator from 'javascript-obfuscator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

// Obfuscation options
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false,
  debugProtectionInterval: 0,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.75,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false
};

console.log('🔨 Building obfuscated version...\n');

// Create dist directory
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Read and obfuscate each source file
const files = ['index.js', 'crawler.js', 'formatter.js'];

files.forEach(file => {
  const srcPath = path.join(SRC_DIR, file);
  const distPath = path.join(DIST_DIR, file);

  console.log(`📦 Obfuscating ${file}...`);

  const sourceCode = fs.readFileSync(srcPath, 'utf-8');
  const obfuscated = JavaScriptObfuscator.obfuscate(sourceCode, obfuscationOptions);

  fs.writeFileSync(distPath, obfuscated.getObfuscatedCode(), 'utf-8');
  console.log(`   ✅ ${file} -> dist/${file}`);
});

console.log('\n✨ Build complete! Obfuscated files in dist/\n');
console.log('Run with: npm start\n');
