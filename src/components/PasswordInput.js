import React, { useState } from 'react';

function PasswordInput({ label, value, onChange, placeholder }) {
  const [showPassword, setShowPassword] = useState(false);

  const getStrength = () => {
    if (value.length < 6) return { level: 0, text: 'Bardzo słabe', color: 'bg-red-500' };
    if (value.length < 8) return { level: 1, text: 'Słabe', color: 'bg-orange-500' };
    if (value.length < 12) return { level: 2, text: 'Średnie', color: 'bg-yellow-500' };
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]/.test(value)) {
      return { level: 3, text: 'Silne', color: 'bg-green-500' };
    }
    return { level: 2, text: 'Średnie', color: 'bg-yellow-500' };
  };

  const strength = getStrength();

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-zinc-800">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 pr-12 text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
          aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
        >
          {showPassword ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
              <path d="M15.171 13.576l1.414 1.414A10.015 10.015 0 0120.542 10c-1.274-4.057-5.064-7-9.542-7a9.948 9.948 0 00-2.742.384l1.414 1.414A7.971 7.971 0 0110 5c3.859 0 7.169 2.546 8.171 6a6.004 6.004 0 01-1-2.424z" />
            </svg>
          )}
        </button>
      </div>

      {value && (
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Siła hasła</span>
            <span className={`text-xs font-semibold ${strength.color === 'bg-green-500' ? 'text-emerald-600' : strength.color === 'bg-yellow-500' ? 'text-amber-600' : strength.color === 'bg-orange-500' ? 'text-orange-600' : 'text-red-600'}`}>
              {strength.text}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-200">
            <div
              className={`h-1.5 rounded-full transition-all ${strength.color === 'bg-green-500' ? 'bg-emerald-500' : strength.color}`}
              style={{ width: `${(strength.level + 1) * 25}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PasswordInput;
