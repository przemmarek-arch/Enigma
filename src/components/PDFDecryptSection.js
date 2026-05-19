import React, { useState } from 'react';
import FileUpload from './FileUpload';
import PasswordInput from './PasswordInput';
import { decryptPDF } from '../utils/pdfUtils';

const alertStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-700'
};

function PDFDecryptSection({ onHistoryEvent }) {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
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

  const handleDecrypt = async () => {
    if (!file) {
      setMessageType('error');
      setMessage('Proszę wybrać plik PDF');
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
      const result = await decryptPDF(fileContent, password);

      if (result.success) {
        const outputName = `${file.name.replace('_encrypted', '')}_unlocked.pdf`;
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
        setMessage('PDF został odszyfrowany.');
        onHistoryEvent?.({
          action: 'pdf_decrypt',
          fileName: file.name,
          outputName,
          fileSize: file.size,
          fileType: file.type || 'application/pdf'
        });
        setFile(null);
        setPassword('');
      } else {
        setMessageType('error');
        setMessage(result.error || 'Błąd podczas odszyfrowania PDF');
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
      <h3 className="mb-4 text-lg font-semibold tracking-tight text-zinc-950">Odblokuj PDF</h3>
      <FileUpload onFileChange={handleFileChange} file={file} />

        {file && (
          <div className="mt-6 space-y-4">
            <PasswordInput
              label="Hasło do PDF"
              value={password}
              onChange={setPassword}
              placeholder="Wpisz hasło do odblokownia"
            />

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="flex items-start gap-3 text-sm leading-6 text-blue-800">
                <svg className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Wprowadź hasło, które było użyte do zaszyfrowania tego PDF.
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
              Odszyfruj PDF
            </>
          )}
        </button>
    </div>
  );
}

export default PDFDecryptSection;
