import { isSupabaseConfigured, supabase } from './supabaseClient';

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
  if (isSupabaseConfigured) {
    return getSupabaseSessionUser();
  }

  const session = readJson(SESSION_KEY, null);
  if (!session?.userId) {
    return null;
  }

  const users = readJson(USERS_KEY, []);
  const user = users.find((item) => item.id === session.userId);
  return user ? { id: user.id, name: user.name, email: user.email } : null;
};

export const registerUser = async ({ name, email, password }) => {
  if (isSupabaseConfigured) {
    return registerSupabaseUser({ name, email, password });
  }

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
  if (isSupabaseConfigured) {
    return loginSupabaseUser({ email, password });
  }

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

export const logoutUser = async () => {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
};

export const getHistory = async (userId) => {
  if (isSupabaseConfigured) {
    return getSupabaseHistory();
  }

  return readJson(`${HISTORY_PREFIX}${userId}`, []);
};

export const addHistoryEntry = async (userId, entry) => {
  if (isSupabaseConfigured) {
    return addSupabaseHistoryEntry(entry);
  }

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

export const clearHistory = async (userId) => {
  if (isSupabaseConfigured) {
    await supabase.from('document_history').delete().eq('user_id', userId);
    return;
  }

  window.localStorage.removeItem(`${HISTORY_PREFIX}${userId}`);
};

const getDisplayName = (user) => {
  return user?.user_metadata?.name || user?.email?.split('@')[0] || 'Użytkownik';
};

const mapSupabaseUser = (user) => ({
  id: user.id,
  name: getDisplayName(user),
  email: user.email
});

const getSupabaseSessionUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return mapSupabaseUser(data.user);
};

const registerSupabaseUser = async ({ name, email, password }) => {
  const cleanName = name.trim();
  const cleanEmail = normalizeEmail(email);

  if (!cleanName || !cleanEmail || !password) {
    return { success: false, error: 'Uzupełnij imię, email i hasło.' };
  }

  if (password.length < 8) {
    return { success: false, error: 'Hasło do konta musi mieć co najmniej 8 znaków.' };
  }

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: { name: cleanName }
    }
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: false, error: 'Nie udało się utworzyć konta.' };
  }

  return { success: true, user: mapSupabaseUser(data.user) };
};

const loginSupabaseUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizeEmail(email),
    password
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: mapSupabaseUser(data.user) };
};

const mapHistoryRow = (row) => ({
  id: row.id,
  action: row.action,
  fileName: row.file_name,
  outputName: row.output_name,
  fileSize: row.file_size,
  fileType: row.file_type,
  createdAt: row.created_at
});

const getSupabaseHistory = async () => {
  const { data, error } = await supabase
    .from('document_history')
    .select('id, action, file_name, output_name, file_size, file_type, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(error.message);
  }

  return data.map(mapHistoryRow);
};

const addSupabaseHistoryEntry = async (entry) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error('Brak aktywnej sesji użytkownika.');
  }

  const { data, error } = await supabase
    .from('document_history')
    .insert({
      user_id: userData.user.id,
      action: entry.action,
      file_name: entry.fileName,
      output_name: entry.outputName,
      file_size: entry.fileSize,
      file_type: entry.fileType
    })
    .select('id, action, file_name, output_name, file_size, file_type, created_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapHistoryRow(data);
};
