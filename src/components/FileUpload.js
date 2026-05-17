import React, { useRef } from 'react';

function FileUpload({ onFileChange, file }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-purple-400', 'bg-purple-500/10');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-purple-400', 'bg-purple-500/10');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-purple-400', 'bg-purple-500/10');
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileChange(droppedFile);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.enigma"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-purple-400 hover:bg-purple-500/5 bg-slate-900/50"
      >
        {file ? (
          <div className="space-y-3">
            <div className="flex justify-center">
              <svg className="w-12 h-12 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-green-400">Plik wybrany</p>
              <p className="text-sm text-gray-400 mt-1 truncate">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
              }}
              className="text-xs text-blue-400 hover:text-blue-300 mt-2"
            >
              Zmień plik
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Przeciągnij plik tutaj</p>
              <p className="text-sm text-gray-400 mt-2">lub kliknij aby wybrać</p>
            </div>
            <p className="text-xs text-gray-500">Obsługiwane: PDF, DOC, DOCX, JPG, PNG, ENIGMA</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
