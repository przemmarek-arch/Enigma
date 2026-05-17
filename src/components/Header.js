import React from 'react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-900 to-slate-900 border-b border-purple-500/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Enigma
              </h1>
              <p className="text-sm text-gray-400">Zaawansowane szyfrowanie plików</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-400">Obsługiwane formaty</p>
            <p className="text-sm font-semibold text-purple-300">PDF • DOC • JPG</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
