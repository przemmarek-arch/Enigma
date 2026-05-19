import React, { useState } from 'react';
import FileUpload from './FileUpload';
import PasswordInput from './PasswordInput';
import { encryptPDF } from '../utils/pdfUtils';

const alertStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-700'
};

function PDFEncryptSection({ onHistoryEvent }) {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setMessage('');
    } else {
      setMessageType('error');
      setMessage('Proszę wybrać plik PDF');
      setFile(null);
    }
  };

  const handleEncrypt = async () => {
    if (!file) {
      setMessageType('error');
      setMessage('Proszę wybrać plik PDF');
      return;
    }

    if (!password || password.length < 4) {
      setMessageType('error');
      setMessage('Hasło musi zawierać co najmniej 4 znaki');
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
      const result = await encryptPDF(fileContent, password);

      if (result.success) {
        const outputName = `${file.name.replace('.pdf', '')}_encrypted.pdf`;
        const blob = new Blob([result.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = outputName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        setMessageType('success');
        setMessage('PDF został zaszyfrowany.');
        onHistoryEvent?.({
          action: 'pdf_encrypt',
          fileName: file.name,
          outputName,
          fileSize: file.size,
          fileType: file.type || 'application/pdf'
        });
        setFile(null);
        setPassword('');
        setConfirmPassword('');
      } else {
        setMessageType('error');
        setMessage(result.error || 'Błąd podczas szyfrowania PDF');
      }
    } catch (error) {
      setMessageType('error');
      setMessage(`Błąd: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 sm:p-6">
      <h3 className="mb-4 text-lg font-semibold tracking-tight text-zinc-950">Zabezpiecz PDF hasłem</h3>
      <FileUpload onFileChange={handleFileChange} file={file} />

        {file && (
          <div className="mt-6 grid gap-4">
            <div className="grid gap-4 lg:grid-cols-2">
            <PasswordInput
              label="Hasło do PDF"
              value={password}
              onChange={setPassword}
              placeholder="Min. 4 znaki"
            />
            <PasswordInput
              label="Potwierdź hasło"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Powtórz hasło"
            />
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="flex items-start gap-3 text-sm leading-6 text-amber-800">
                <svg className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                PDF będzie chroniony hasłem. Każde otwarcie będzie wymagać hasła.
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
              Szyfruj PDF
            </>
          )}
        </button>
    </div>
  );
}

export default PDFEncryptSection;
