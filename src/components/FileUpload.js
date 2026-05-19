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
    e.currentTarget.classList.add('border-zinc-900', 'bg-zinc-50');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-zinc-900', 'bg-zinc-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-zinc-900', 'bg-zinc-50');
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
        className="group cursor-pointer rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center transition hover:border-zinc-900 hover:bg-zinc-50 sm:p-10"
      >
        {file ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              </span>
            </div>
            <div>
              <p className="text-base font-semibold text-zinc-950">Plik gotowy</p>
              <p className="mx-auto mt-1 max-w-full truncate text-sm text-zinc-600">{file.name}</p>
              <p className="mt-1 text-xs font-medium text-zinc-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
              }}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100"
            >
              Zmień plik
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-zinc-950 text-white shadow-[0_14px_32px_rgba(24,24,27,0.2)] transition group-hover:scale-[1.03]">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 16V4m0 0l-4.5 4.5M12 4l4.5 4.5M4 16.5V18a2 2 0 002 2h12a2 2 0 002-2v-1.5" />
              </svg>
              </span>
            </div>
            <div>
              <p className="text-base font-semibold text-zinc-950">Przeciągnij plik tutaj</p>
              <p className="mt-1 text-sm text-zinc-500">albo kliknij, aby wybrać z dysku</p>
            </div>
            <p className="text-xs font-medium text-zinc-400">PDF, DOC, DOCX, JPG, PNG, ENIGMA</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
