import React, { useState } from 'react';
import PDFEncryptSection from './PDFEncryptSection';
import PDFDecryptSection from './PDFDecryptSection';
import PDFPasswordManager from './PDFPasswordManager';

function PDFSection({ onHistoryEvent }) {
  const [pdfTab, setPdfTab] = useState('tools');

  const tabs = [
    { id: 'tools', label: 'Narzędzia' },
    { id: 'encrypt', label: 'Szyfruj PDF' },
    { id: 'decrypt', label: 'Odszyfruj PDF' }
  ];

  return (
    <section className="rounded-lg border border-white/70 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Dokumenty PDF</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Zarządzaj ochroną PDF</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Dodawaj, usuwaj i zmieniaj hasła w dokumentach PDF z jednego uporządkowanego widoku.
          </p>
        </div>

        <div className="grid rounded-lg border border-zinc-200 bg-zinc-100 p-1 sm:inline-grid sm:grid-cols-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPdfTab(tab.id)}
              className={`min-h-10 rounded-md px-4 text-sm font-semibold transition ${
                pdfTab === tab.id
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {pdfTab === 'tools' && <PDFPasswordManager onHistoryEvent={onHistoryEvent} />}
        {pdfTab === 'encrypt' && <PDFEncryptSection onHistoryEvent={onHistoryEvent} />}
        {pdfTab === 'decrypt' && <PDFDecryptSection onHistoryEvent={onHistoryEvent} />}
      </div>
    </section>
  );
}

export default PDFSection;
