import React, { useState } from 'react';
import FileUpload from './FileUpload';
import PasswordInput from './PasswordInput';

const alertStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-700'
};

function EncryptSection({ onHistoryEvent }) {
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
      onHistoryEvent?.({
        action: 'file_encrypt',
        fileName: file.name,
        outputName: `${file.name}.enigma`,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream'
      });
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
    <section className="rounded-lg border border-white/70 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Szyfrowanie plików</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Szyfruj plik</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Zabezpiecz dokumenty, obrazy i archiwa prywatnym hasłem oraz kluczem AES-256.
          </p>
        </div>
        <span className="inline-flex w-fit items-center whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
          AES-256
        </span>
      </div>

      <FileUpload onFileChange={handleFileChange} file={file} />

      {file && (
        <div className="mt-6 grid gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
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
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="flex items-start gap-3 text-sm leading-6 text-blue-800">
              <svg className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              Użyj unikalnego hasła. Minimalna długość to 6 znaków, ale dłuższe hasło realnie podnosi odporność pliku.
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
        onClick={handleEncrypt}
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
              Szyfrowanie...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Szyfruj plik
            </>
          )}
      </button>
    </section>
  );
}

export default EncryptSection;
