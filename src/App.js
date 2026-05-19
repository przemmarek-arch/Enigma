import React, { useEffect, useState } from 'react';
import EncryptSection from './components/EncryptSection';
import DecryptSection from './components/DecryptSection';
import PDFSection from './components/PDFSection';
import Header from './components/Header';
import AuthPanel from './components/AuthPanel';
import HistoryPanel from './components/HistoryPanel';
import { addHistoryEntry, clearHistory, getHistory, getSessionUser, logoutUser } from './utils/authUtils';

const tabs = [
  {
    id: 'encrypt',
    label: 'Szyfruj',
    description: 'AES-256 dla plików',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V8a4 4 0 10-8 0v3m-1 0h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2z" />
      </svg>
    )
  },
  {
    id: 'decrypt',
    label: 'Odszyfruj',
    description: 'Przywracanie plików',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V8a4 4 0 118 0v3m-9 0h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2z" />
      </svg>
    )
  },
  {
    id: 'pdf',
    label: 'PDF',
    description: 'Hasła i ochrona',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V8.5L13.5 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3v6h6" />
      </svg>
    )
  },
  {
    id: 'history',
    label: 'Historia',
    description: 'Operacje użytkownika',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v5l3 3m6-4a9 9 0 11-3.5-7.14" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 3v5h-5" />
      </svg>
    )
  }
];

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('encrypt');
  const [history, setHistory] = useState([]);
  const [loadingSession, setLoadingSession] = useState(true);
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const sessionUser = await getSessionUser();

      if (!isMounted) {
        return;
      }

      setUser(sessionUser);

      if (sessionUser) {
        try {
          setHistory(await getHistory(sessionUser.id));
        } catch (error) {
          setHistoryError(error.message);
        }
      }

      setLoadingSession(false);
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAuth = async (nextUser) => {
    setUser(nextUser);
    setHistoryError('');
    try {
      setHistory(await getHistory(nextUser.id));
    } catch (error) {
      setHistoryError(error.message);
    }
    setActiveTab('encrypt');
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setHistory([]);
    setHistoryError('');
    setActiveTab('encrypt');
  };

  const handleHistoryEvent = async (entry) => {
    if (!user) {
      return;
    }

    try {
      const nextEntry = await addHistoryEntry(user.id, entry);
      setHistory((currentHistory) => [nextEntry, ...currentHistory].slice(0, 100));
      setHistoryError('');
    } catch (error) {
      setHistoryError(error.message);
    }
  };

  const handleClearHistory = async () => {
    if (!user) {
      return;
    }

    await clearHistory(user.id);
    setHistory([]);
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-zinc-950">
        <Header />
        <main className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-white/70 bg-white/90 px-6 py-5 text-sm font-semibold text-zinc-700 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
            Ładowanie sesji...
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-zinc-950">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <AuthPanel onAuth={handleAuth} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <Header user={user} onLogout={handleLogout} />

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-8 lg:py-8">
        <aside className="space-y-4">
          <div className="rounded-lg border border-white/70 bg-white/80 p-2 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="grid gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex min-h-[72px] items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                    activeTab === tab.id
                      ? 'bg-zinc-950 text-white shadow-[0_12px_30px_rgba(24,24,27,0.22)]'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    activeTab === tab.id ? 'bg-white/15 text-white' : 'bg-white text-zinc-600 shadow-sm'
                  }`}>
                    {tab.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{tab.label}</span>
                    <span className={`block text-xs ${activeTab === tab.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {tab.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-zinc-950 p-5 text-white shadow-[0_22px_55px_rgba(24,24,27,0.18)]">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">Bezpieczeństwo</p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">Lokalne przetwarzanie plików</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Pliki i hasła są obsługiwane na tym urządzeniu. Nie dodawaj ich do logów ani zrzutów ekranu.
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          {activeTab === 'encrypt' && <EncryptSection onHistoryEvent={handleHistoryEvent} />}
          {activeTab === 'decrypt' && <DecryptSection onHistoryEvent={handleHistoryEvent} />}
          {activeTab === 'pdf' && <PDFSection onHistoryEvent={handleHistoryEvent} />}
          {activeTab === 'history' && <HistoryPanel history={history} error={historyError} onClear={handleClearHistory} />}
        </div>
      </main>
    </div>
  );
}

export default App;
