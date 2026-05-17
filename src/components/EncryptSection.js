import React, { useState } from 'react';
import FileUpload from './FileUpload';
import PasswordInput from './PasswordInput';

function EncryptSection() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setMessage('');
  };

  const handleEncrypt = async () => {
    if (!file) {
      setMessageType('error');
      setMessage('Proszę wybrać plik');
      return;
    }

    if (!password || password.length < 6) {
      setMessageType('error');
      setMessage('Hasło musi zawierać co najmniej 6 znaków');
      return;
    }

    if (password !== confirmPassword) {
      setMessageType('error');
      setMessage('Hasła nie są identyczne');
      return;
    }

    setLoading(true);
    try {
      const fileContent = await file.arrayBuffer();
      const fileData = new Uint8Array(fileContent);

      // Use Web Crypto API for encryption
      const encoder = new TextEncoder();
      const salt = crypto.getRandomValues(new Uint8Array(32));
      const passwordData = encoder.encode(password);

      const importedKey = await crypto.subtle.importKey(
        'raw',
        passwordData,
        'PBKDF2',
        false,
        ['deriveBits']
      );

      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        importedKey,
        256
      );

      const key = await crypto.subtle.importKey(
        'raw',
        derivedBits,
        'AES-CBC',
        false,
        ['encrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(16));
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        key,
        fileData
      );

      // Combine salt + iv + encrypted data
      const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

      // Create encrypted file
      const blob = new Blob([combined], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name}.enigma`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setMessageType('success');
      setMessage('Plik został zaszyfrowany i pobrany!');
      setFile(null);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessageType('error');
      setMessage(`Błąd podczas szyfrowania: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Szyfruj plik
          </span>
        </h2>
        <p className="text-gray-400 mb-6">Zabezpiecz swoje pliki za pomocą zaawansowanego szyfrowania AES-256</p>

        <FileUpload onFileChange={handleFileChange} file={file} />

        {file && (
          <div className="mt-6 space-y-4">
            <PasswordInput
              label="Hasło"
              value={password}
              onChange={setPassword}
              placeholder="Wpisz silne hasło"
            />
            <PasswordInput
              label="Potwierdź hasło"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Powtórz hasło"
            />

            <div className="bg-blue-900/30 border border-blue-500/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-200 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Użyj silnego hasła (co najmniej 6 znaków)
              </p>
            </div>
          </div>
        )}

        {message && (
          <div className={`mt-6 p-4 rounded-lg ${
            messageType === 'success'
              ? 'bg-green-900/30 border border-green-500/30 text-green-200'
              : 'bg-red-900/30 border border-red-500/30 text-red-200'
          }`}>
            {message}
          </div>
        )}

        <button
          onClick={handleEncrypt}
          disabled={loading || !file}
          className={`mt-6 w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            loading || !file
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Szyfrowanie...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Szyfruj plik
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default EncryptSection;
