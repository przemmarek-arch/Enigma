import React from 'react';

function Header({ user, onLogout }) {
  return (
    <header className="border-b border-zinc-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-950 text-white shadow-[0_14px_30px_rgba(24,24,27,0.22)]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Enigma</h1>
              <p className="text-sm text-zinc-500">Profesjonalne szyfrowanie plików</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            {user ? (
              <>
                <span className="whitespace-nowrap rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 font-medium text-zinc-700">
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="whitespace-nowrap rounded-full border border-zinc-200 bg-white px-3 py-1 font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
                >
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <span className="whitespace-nowrap rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 font-medium text-zinc-700">PDF</span>
                <span className="whitespace-nowrap rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 font-medium text-zinc-700">DOC</span>
                <span className="whitespace-nowrap rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 font-medium text-zinc-700">JPG</span>
                <span className="whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-700">AES-256</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
