import React, { useState } from 'react';
import PasswordInput from './PasswordInput';
import { loginUser, registerUser } from '../utils/authUtils';

function AuthPanel({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const result = mode === 'login'
      ? await loginUser({ email, password })
      : await registerUser({ name, email, password });

    setLoading(false);

    if (result.success) {
      onAuth(result.user);
      return;
    }

    setMessage(result.error);
  };

  return (
    <section className="mx-auto w-full max-w-xl rounded-lg border border-white/70 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Konto użytkownika</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          {mode === 'login' ? 'Zaloguj się' : 'Utwórz konto'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Historia operacji jest przypisana do konta i zapisywana lokalnie w tej przeglądarce.
        </p>
      </div>

      <div className="mb-6 grid rounded-lg border border-zinc-200 bg-zinc-100 p-1 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`min-h-10 rounded-md px-4 text-sm font-semibold transition ${
            mode === 'login' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Logowanie
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`min-h-10 rounded-md px-4 text-sm font-semibold transition ${
            mode === 'register' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Rejestracja
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {mode === 'register' && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-800">Nazwa użytkownika</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              placeholder="np. Marek"
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-800">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
            placeholder="adres@email.pl"
          />
        </div>

        <PasswordInput
          label="Hasło do konta"
          value={password}
          onChange={setPassword}
          placeholder={mode === 'login' ? 'Wpisz hasło' : 'Min. 8 znaków'}
        />

        {message && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center rounded-lg bg-zinc-950 px-5 py-4 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(24,24,27,0.24)] transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
        >
          {loading ? 'Przetwarzanie...' : mode === 'login' ? 'Zaloguj się' : 'Utwórz konto'}
        </button>
      </form>
    </section>
  );
}

export default AuthPanel;
