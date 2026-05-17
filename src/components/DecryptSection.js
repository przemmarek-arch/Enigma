import React, { useState } from 'react';
import FileUpload from './FileUpload';
import PasswordInput from './PasswordInput';

function DecryptSection() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setMessage('');
  };

  const handleDecrypt = async () => {
    if (!file) {
      setMessageType('error');
      setMessage('Proszę wybrać plik');
      return;
    }

    if (!password) {
      setMessageType('error');
      setMessage('Proszę wpisać hasło');
      return;
    }

    setLoading(true);
    try {
      const fileContent = await file.arrayBuffer();
      const combined = new Uint8Array(fileContent);

      // Extract salt, iv, and encrypted data
      const salt = combined.slice(0, 32);
      const iv = combined.slice(32, 48);
      const encryptedData = combined.slice(48);

      // Derive key from password
      const encoder = new TextEncoder();
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
        ['decrypt']
      );

      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv },
        key,
        encryptedData
      );

      // Get original filename and extension
      let originalFileName = file.name;
      if (originalFileName.endsWith('.enigma')) {
        originalFileName = originalFileName.slice(0, -7);
      }

      // Download decrypted file
      const blob = new Blob([decryptedData], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = originalFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setMessageType('success');
      setMessage('Plik został odszyfrowany i pobrany!');
      setFile(null);
      setPassword('');
    } catch (error) {
      setMessageType('error');
      setMessage('Błąd: Nieprawidłowe hasło lub uszkodzony plik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Odszyfruj plik
          </span>
        </h2>
        <p className="text-gray-400 mb-6">Otwórz swoje zaszyfrowane pliki za pomocą hasła</p>

        <FileUpload onFileChange={handleFileChange} file={file} />

        {file && (
          <div className="mt-6 space-y-4">
            <PasswordInput
              label="Hasło do odszyfrowania"
              value={password}
              onChange={setPassword}
              placeholder="Wpisz hasło szyfrowania"
            />

            <div className="bg-amber-900/30 border border-amber-500/20 rounded-lg p-4">
              <p className="text-sm text-amber-200 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Upewnij się, że plik ma rozszerzenie .enigma
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
          onClick={handleDecrypt}
          disabled={loading || !file}
          className={`mt-6 w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            loading || !file
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/50'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Odszyfrowywanie...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm6 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Odszyfruj plik
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default DecryptSection;
