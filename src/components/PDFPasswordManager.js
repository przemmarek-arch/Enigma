import React, { useState } from 'react';
import FileUpload from './FileUpload';
import PasswordInput from './PasswordInput';
import { addPDFPassword, removePDFPassword, changePDFPassword } from '../utils/pdfUtils';

function PDFPasswordManager() {
  const [file, setFile] = useState(null);
  const [operation, setOperation] = useState('add');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
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

  const handleAddPassword = async () => {
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
      const result = await addPDFPassword(fileContent, password);

      if (result.success) {
        downloadPDF(result.data, file.name, 'protected');
        setMessageType('success');
        setMessage('Hasło zostało dodane do PDF! ✅');
        resetForm();
      } else {
        setMessageType('error');
        setMessage(result.error || 'Błąd podczas dodawania hasła');
      }
    } catch (error) {
      setMessageType('error');
      setMessage(`Błąd: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePassword = async () => {
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
      const result = await removePDFPassword(fileContent, password);

      if (result.success) {
        downloadPDF(result.data, file.name, 'unprotected');
        setMessageType('success');
        setMessage('Hasło zostało usunięte z PDF! ✅');
        resetForm();
      } else {
        setMessageType('error');
        setMessage(result.error || 'Błąd: Nieprawidłowe hasło');
      }
    } catch (error) {
      setMessageType('error');
      setMessage(`Błąd: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!file) {
      setMessageType('error');
      setMessage('Proszę wybrać plik PDF');
      return;
    }

    if (!oldPassword) {
      setMessageType('error');
      setMessage('Proszę wpisać stare hasło');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setMessageType('error');
      setMessage('Nowe hasło musi zawierać co najmniej 4 znaki');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessageType('error');
      setMessage('Nowe hasła nie są identyczne');
      return;
    }

    setLoading(true);
    try {
      const fileContent = await file.arrayBuffer();
      const result = await changePDFPassword(fileContent, oldPassword, newPassword);

      if (result.success) {
        downloadPDF(result.data, file.name, 'changed');
        setMessageType('success');
        setMessage('Hasło zostało zmienione! ✅');
        resetForm();
      } else {
        setMessageType('error');
        setMessage(result.error || 'Błąd: Nieprawidłowe stare hasło');
      }
    } catch (error) {
      setMessageType('error');
      setMessage(`Błąd: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (data, originalName, suffix) => {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalName.replace('.pdf', '')}_${suffix}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFile(null);
    setPassword('');
    setConfirmPassword('');
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Operation Selector */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setOperation('add')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            operation === 'add'
              ? 'bg-green-500 text-white'
              : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
          }`}
        >
          ➕ Dodaj hasło
        </button>
        <button
          onClick={() => setOperation('remove')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            operation === 'remove'
              ? 'bg-red-500 text-white'
              : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
          }`}
        >
          ❌ Usuń hasło
        </button>
        <button
          onClick={() => setOperation('change')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            operation === 'change'
              ? 'bg-blue-500 text-white'
              : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
          }`}
        >
          🔄 Zmień hasło
        </button>
      </div>

      <div className="bg-slate-700/50 border border-red-500/30 rounded-lg p-6">
        <FileUpload onFileChange={handleFileChange} file={file} />

        {file && (
          <div className="mt-6 space-y-4">
            {operation === 'add' && (
              <>
                <PasswordInput
                  label="Nowe hasło"
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
              </>
            )}

            {operation === 'remove' && (
              <>
                <div className="bg-yellow-900/30 border border-yellow-500/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-200 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Wpisz hasło, aby usunąć ochronę z PDF
                  </p>
                </div>
                <PasswordInput
                  label="Hasło do usunięcia"
                  value={password}
                  onChange={setPassword}
                  placeholder="Wpisz hasło"
                />
              </>
            )}

            {operation === 'change' && (
              <>
                <PasswordInput
                  label="Stare hasło"
                  value={oldPassword}
                  onChange={setOldPassword}
                  placeholder="Wpisz obecne hasło"
                />
                <PasswordInput
                  label="Nowe hasło"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Min. 4 znaki"
                />
                <PasswordInput
                  label="Potwierdź nowe hasło"
                  value={confirmNewPassword}
                  onChange={setConfirmNewPassword}
                  placeholder="Powtórz nowe hasło"
                />
              </>
            )}
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
          onClick={() => {
            if (operation === 'add') handleAddPassword();
            else if (operation === 'remove') handleRemovePassword();
            else handleChangePassword();
          }}
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
              Przetwarzanie...
            </>
          ) : (
            <>
              {operation === 'add' && '➕ Dodaj hasło'}
              {operation === 'remove' && '❌ Usuń hasło'}
              {operation === 'change' && '🔄 Zmień hasło'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default PDFPasswordManager;
