import React, { useState } from 'react';
import FileUpload from './FileUpload';
import PasswordInput from './PasswordInput';

const alertStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-700'
};

function DecryptSection({ onHistoryEvent }) {
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
      onHistoryEvent?.({
        action: 'file_decrypt',
        fileName: file.name,
        outputName: originalFileName,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream'
      });
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
    <section className="rounded-lg border border-white/70 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Przywracanie plików</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Odszyfruj plik</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          Wybierz plik z rozszerzeniem .enigma i podaj hasło użyte podczas szyfrowania.
        </p>
      </div>

      <FileUpload onFileChange={handleFileChange} file={file} />

      {file && (
        <div className="mt-6 space-y-4">
          <PasswordInput
            label="Hasło do odszyfrowania"
            value={password}
            onChange={setPassword}
            placeholder="Wpisz hasło szyfrowania"
          />

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-start gap-3 text-sm leading-6 text-amber-800">
              <svg className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              Upewnij się, że plik ma rozszerzenie .enigma i pochodzi z tej aplikacji.
            </p>
          </div>
        </div>
      )}

      {message && (
        <div className={`mt-6 rounded-lg border px-4 py-3 text-sm font-medium ${alertStyles[messageType] || alertStyles.error}`}>
          {message}
        </div>
      )}

      <button
        onClick={handleDecrypt}
        disabled={loading || !file}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-5 py-4 text-sm font-semibold transition ${
          loading || !file
            ? 'cursor-not-allowed bg-zinc-200 text-zinc-400'
            : 'bg-zinc-950 text-white shadow-[0_16px_36px_rgba(24,24,27,0.24)] hover:bg-zinc-800'
        }`}
      >
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Odszyfrowywanie...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm6 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Odszyfruj plik
            </>
          )}
      </button>
    </section>
  );
}

export default DecryptSection;
