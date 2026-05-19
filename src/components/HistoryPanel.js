import React from 'react';

const actionLabels = {
  file_encrypt: 'Szyfrowanie pliku',
  file_decrypt: 'Odszyfrowanie pliku',
  pdf_encrypt: 'Szyfrowanie PDF',
  pdf_decrypt: 'Odszyfrowanie PDF',
  pdf_add_password: 'Dodanie hasła PDF',
  pdf_remove_password: 'Usunięcie hasła PDF',
  pdf_change_password: 'Zmiana hasła PDF'
};

const formatSize = (size) => {
  if (!size) return 'Brak danych';
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

function HistoryPanel({ history, error, onClear }) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Historia</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Historia dokumentów</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Lista ostatnich operacji zapisuje metadane plików. Hasła i zawartość dokumentów nie są przechowywane.
          </p>
        </div>

        <button
          type="button"
          onClick={onClear}
          disabled={!history.length}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-300"
        >
          Wyczyść historię
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {history.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-10 text-center">
          <p className="text-sm font-semibold text-zinc-800">Brak wpisów historii</p>
          <p className="mt-2 text-sm text-zinc-500">Po udanym szyfrowaniu lub operacji PDF wpis pojawi się tutaj.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200">
          <div className="hidden grid-cols-[1.2fr_1.5fr_0.8fr_1fr] gap-4 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 md:grid">
            <span>Operacja</span>
            <span>Plik</span>
            <span>Rozmiar</span>
            <span>Data</span>
          </div>
          <div className="divide-y divide-zinc-200">
            {history.map((entry) => (
              <div key={entry.id} className="grid gap-2 px-4 py-4 text-sm md:grid-cols-[1.2fr_1.5fr_0.8fr_1fr] md:gap-4">
                <div>
                  <span className="font-semibold text-zinc-950">{actionLabels[entry.action] || entry.action}</span>
                  {entry.outputName && <p className="mt-1 text-xs text-zinc-500">Wynik: {entry.outputName}</p>}
                </div>
                <div className="min-w-0 text-zinc-700">
                  <p className="truncate">{entry.fileName}</p>
                  <p className="mt-1 text-xs text-zinc-500">{entry.fileType || 'Nieznany typ'}</p>
                </div>
                <div className="text-zinc-600">{formatSize(entry.fileSize)}</div>
                <div className="text-zinc-600">{new Date(entry.createdAt).toLocaleString('pl-PL')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default HistoryPanel;
