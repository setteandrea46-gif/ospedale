const API_URL = import.meta.env.VITE_API_URL || '';
const DEMO_KEY = 'medcard-demo-data';

function isDemoHost() {
  return window.location.hostname.endsWith('github.io') || window.localStorage.getItem('medcard-demo') === '1';
}

function readDemoData() {
  const saved = window.localStorage.getItem(DEMO_KEY);
  return saved ? JSON.parse(saved) : {
    user: null,
    profile: null,
    medications: [],
    appointments: [],
    vitals: [],
    archive: []
  };
}

function writeDemoData(data) {
  window.localStorage.setItem(DEMO_KEY, JSON.stringify(data));
}

function nextId(items) {
  return Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1;
}

function formDataToObject(body) {
  if (!(body instanceof FormData)) return JSON.parse(body || '{}');
  return Object.fromEntries([...body.entries()].filter(([, value]) => typeof value === 'string'));
}

function buildEmergency(data) {
  const profile = data.profile || {};
  const details = profile.emergency_details || {};
  return {
    userId: data.user?.id || 1,
    name: [profile.name, profile.surname].filter(Boolean).join(' ') || data.user?.email || 'Paziente',
    dob: profile.dob,
    sex: profile.sex,
    height: profile.height,
    weight: profile.weight,
    fiscalCode: profile.fiscal_code,
    bloodType: details.bloodType || '',
    organDonor: Boolean(details.organDonor),
    allergies: {
      drug: details.drugAllergies || '',
      food: details.foodAllergies || '',
      environmental: details.environmentalAllergies || ''
    },
    chronicIssues: details.selectedConditions || [],
    emergencyContacts: [
      { name: details.emergencyContact || '', phone: details.emergencyPhone || '' },
      { name: details.secondEmergencyContact || '', phone: details.secondEmergencyPhone || '' }
    ].filter((item) => item.name || item.phone),
    medications: data.medications
  };
}

async function demoApi(path, options = {}) {
  const method = options.method || 'GET';
  const data = readDemoData();

  if (path === '/api/auth/register' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    data.user = { id: 1, email: body.email };
    writeDemoData(data);
    return { token: 'demo-token', user: data.user };
  }

  if (path === '/api/auth/login' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    data.user = data.user || { id: 1, email: body.email };
    writeDemoData(data);
    return { token: 'demo-token', user: data.user };
  }

  if (path === '/api/auth/me') return { user: data.user || { id: 1, email: 'demo@medcard.local' } };
  if (path === '/api/profile' && method === 'GET') return { profile: data.profile };
  if (path === '/api/profile' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    data.profile = {
      id: 1,
      name: body.name,
      surname: body.surname,
      dob: body.dob,
      sex: body.sex,
      height: body.height,
      weight: body.weight,
      fiscal_code: body.fiscalCode,
      emergency_details: body.emergencyDetails || {}
    };
    writeDemoData(data);
    return { success: true, profile: data.profile };
  }

  const collections = {
    '/api/medications': 'medications',
    '/api/calendar': 'appointments',
    '/api/vitals': 'vitals',
    '/api/archive': 'archive'
  };
  const collection = collections[path];
  if (collection && method === 'GET') {
    const responseKey = collection === 'appointments' ? 'appointments' : collection === 'archive' ? 'archive' : collection;
    return { [responseKey]: data[collection] };
  }
  if (collection && method === 'POST') {
    const body = formDataToObject(options.body);
    const row = { id: nextId(data[collection]), ...body, uploaded_at: new Date().toISOString() };
    if (collection === 'appointments') row.date = body.date || null;
    if (collection === 'vitals') {
      row.recorded_at = body.recordedAt || new Date().toISOString();
      row.heart_rate = body.heartRate;
    }
    data[collection] = [row, ...data[collection]];
    writeDemoData(data);
    return { success: true };
  }

  if (path === '/api/emergency') return { emergency: buildEmergency(data) };
  if (path.startsWith('/api/public/emergency/')) return { emergency: buildEmergency(data) };

  throw new Error('Funzione demo non disponibile');
}

export function getStoredSession() {
  const token = window.localStorage.getItem('medcard-token');
  const user = window.localStorage.getItem('medcard-user');
  return { token, user: user ? JSON.parse(user) : null };
}

export function storeSession({ token, user }) {
  window.localStorage.setItem('medcard-token', token);
  window.localStorage.setItem('medcard-user', JSON.stringify(user));
  if (isDemoHost()) window.localStorage.setItem('medcard-demo', '1');
}

export function clearSession() {
  window.localStorage.removeItem('medcard-token');
  window.localStorage.removeItem('medcard-user');
}

export async function api(path, options = {}) {
  if (isDemoHost()) return demoApi(path, options);

  const { token } = getStoredSession();
  const headers = options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { ...headers, ...options.headers }
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Operazione non riuscita');
    }
    return data;
  } catch (error) {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      window.localStorage.setItem('medcard-demo', '1');
      return demoApi(path, options);
    }
    throw error;
  }
}

export function calculateProfileStatus(profile) {
  const details = profile?.emergency_details || {};
  const fields = [
    ['Nome', profile?.name],
    ['Cognome', profile?.surname],
    ['Data di nascita', profile?.dob],
    ['Gruppo sanguigno', details.bloodType],
    ['Contatto emergenza', details.emergencyContact],
    ['Telefono emergenza', details.emergencyPhone],
    ['Allergie', details.drugAllergies || details.foodAllergies || details.environmentalAllergies],
    ['Patologie', details.selectedConditions?.length]
  ];
  const missing = fields.filter(([, value]) => !value).map(([label]) => label);
  const completion = Math.round(((fields.length - missing.length) / fields.length) * 100);
  return { completion, missing };
}
