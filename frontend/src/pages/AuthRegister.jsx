import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

function Register({ onRegister }) {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Le password non coincidono');
      return;
    }
    setLoading(true);
    try {
      const session = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      onRegister(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mx-auto max-w-xl rounded-xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-medink">Crea la tua cartella</h1>
      <p className="mt-2 text-slate-600">Dopo la registrazione potrai compilare i dati quando vuoi.</p>
      {error && <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input name="email" value={form.email} onChange={handleChange} type="email" required className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-medaccent focus:ring-2 focus:ring-medblue" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input name="password" value={form.password} onChange={handleChange} type="password" required className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-medaccent focus:ring-2 focus:ring-medblue" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Conferma password
          <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" required className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-medaccent focus:ring-2 focus:ring-medblue" />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-medink px-6 py-3 font-bold text-white transition hover:bg-slate-800 disabled:opacity-60">
          {loading ? 'Creazione...' : 'Registrati'}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600">Hai gia un account? <Link to="/login" className="font-bold text-medaccent hover:underline">Accedi</Link></p>
    </div>
  );
}

export default Register;
