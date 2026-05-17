import React, { useState } from 'react';
import PDFEncryptSection from './PDFEncryptSection';
import PDFDecryptSection from './PDFDecryptSection';
import PDFPasswordManager from './PDFPasswordManager';

function PDFSection() {
  const [pdfTab, setPdfTab] = useState('tools');

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-8 hover:border-red-500/50 transition-all duration-300 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
          </svg>
          <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Zarządzaj PDF 📄
          </span>
        </h2>
        <p className="text-gray-400 mb-6">Szyfruj, odszyfruj i zabezpiecz pliki PDF hasłem</p>

        {/* Sub-tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setPdfTab('tools')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              pdfTab === 'tools'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            🔒 Narzędzia
          </button>
          <button
            onClick={() => setPdfTab('encrypt')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              pdfTab === 'encrypt'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            🔐 Szyfruj PDF
          </button>
          <button
            onClick={() => setPdfTab('decrypt')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              pdfTab === 'decrypt'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            🔓 Odszyfruj PDF
          </button>
        </div>

        {/* Content */}
        <div>
          {pdfTab === 'tools' && <PDFPasswordManager />}
          {pdfTab === 'encrypt' && <PDFEncryptSection />}
          {pdfTab === 'decrypt' && <PDFDecryptSection />}
        </div>
      </div>
    </div>
  );
}

export default PDFSection;
