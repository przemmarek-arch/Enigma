import React, { useState } from 'react';
import FileUpload from './FileUpload';
import PasswordInput from './PasswordInput';
import { decryptPDF } from '../utils/pdfUtils';

function PDFDecryptSection() {
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
        const blob = new Blob([result.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace('_encrypted', '')}_unlocked.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        setMessageType('success');
        setMessage('PDF został odszyfrowany! ✅');
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
    <div className="space-y-6">
      <div className="bg-slate-700/50 border border-red-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm6 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          Odblokuj PDF
        </h3>

        <FileUpload onFileChange={handleFileChange} file={file} />

        {file && (
          <div className="mt-6 space-y-4">
            <PasswordInput
              label="Hasło do PDF"
              value={password}
              onChange={setPassword}
              placeholder="Wpisz hasło do odblokownia"
            />

            <div className="bg-blue-900/30 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-200 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Wprowadź hasło, które było użyte do zaszyfrowania tego PDF.
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
              : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-red-500/50'
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
              Odszyfruj PDF 🔓
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default PDFDecryptSection;
