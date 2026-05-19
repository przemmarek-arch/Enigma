const USERS_KEY = 'enigma.users';
const SESSION_KEY = 'enigma.session';
const HISTORY_PREFIX = 'enigma.history.';

const readJson = (key, fallback) => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const hashPassword = async (password, salt) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const createId = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getSessionUser = () => {
  const session = readJson(SESSION_KEY, null);
  if (!session?.userId) {
    return null;
  }

  const users = readJson(USERS_KEY, []);
  const user = users.find((item) => item.id === session.userId);
  return user ? { id: user.id, name: user.name, email: user.email } : null;
};

export const registerUser = async ({ name, email, password }) => {
  const cleanName = name.trim();
  const cleanEmail = normalizeEmail(email);

  if (!cleanName || !cleanEmail || !password) {
    return { success: false, error: 'Uzupełnij imię, email i hasło.' };
  }

  if (password.length < 8) {
    return { success: false, error: 'Hasło do konta musi mieć co najmniej 8 znaków.' };
  }

  const users = readJson(USERS_KEY, []);
  if (users.some((user) => user.email === cleanEmail)) {
    return { success: false, error: 'Konto z tym adresem email już istnieje.' };
  }

  const salt = createId();
  const passwordHash = await hashPassword(password, salt);
  const user = {
    id: createId(),
    name: cleanName,
    email: cleanEmail,
    salt,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  writeJson(USERS_KEY, [...users, user]);
  writeJson(SESSION_KEY, { userId: user.id });

  return { success: true, user: { id: user.id, name: user.name, email: user.email } };
};

export const loginUser = async ({ email, password }) => {
  const cleanEmail = normalizeEmail(email);
  const users = readJson(USERS_KEY, []);
  const user = users.find((item) => item.email === cleanEmail);

  if (!user) {
    return { success: false, error: 'Nie znaleziono konta dla tego adresu email.' };
  }

  const passwordHash = await hashPassword(password, user.salt);
  if (passwordHash !== user.passwordHash) {
    return { success: false, error: 'Nieprawidłowe hasło.' };
  }

  writeJson(SESSION_KEY, { userId: user.id });
  return { success: true, user: { id: user.id, name: user.name, email: user.email } };
};

export const logoutUser = () => {
  window.localStorage.removeItem(SESSION_KEY);
};

export const getHistory = (userId) => readJson(`${HISTORY_PREFIX}${userId}`, []);

export const addHistoryEntry = (userId, entry) => {
  const key = `${HISTORY_PREFIX}${userId}`;
  const history = readJson(key, []);
  const nextEntry = {
    id: createId(),
    createdAt: new Date().toISOString(),
    ...entry
  };

  writeJson(key, [nextEntry, ...history].slice(0, 100));
  return nextEntry;
};

export const clearHistory = (userId) => {
  window.localStorage.removeItem(`${HISTORY_PREFIX}${userId}`);
};
