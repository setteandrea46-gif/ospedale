import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const categories = ['Esami del sangue', 'Radiografie', 'Ecografie', 'Visite specialistiche', 'Dimissioni', 'Altro'];

function Archive() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: categories[0], date: '', doctor: '', notes: '', tags: '' });
  const [file, setFile] = useState(null);

  const load = () => api('/api/archive').then(({ archive }) => setItems(archive || []));
  useEffect(() => { load(); }, []);

  const save = async (event) => {
    event.preventDefault();
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.append(key, value));
    if (file) body.append('file', file);
    await api('/api/archive', { method: 'POST', body });
    setForm({ title: '', category: categories[0], date: '', doctor: '', notes: '', tags: '' });
    setFile(null);
    setShowForm(false);
    load();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Referti</p>
            <h1 className="text-2xl font-bold text-medink sm:text-3xl">Archivio clinico</h1>
            <p className="mt-2 text-slate-600">Carica file e organizza referti per categoria, data e medico.</p>
          </div>
          <button onClick={() => setShowForm((value) => !value)} className="w-full rounded-lg bg-medink px-5 py-3 text-sm font-bold text-white sm:w-auto">Nuovo referto</button>
        </div>
      </section>

      {showForm && (
        <form onSubmit={save} className="grid gap-4 rounded-xl bg-white p-4 shadow-sm sm:p-6 md:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))} required className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Titolo referto" />
          <select value={form.category} onChange={(e) => setForm((c) => ({ ...c, category: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3">
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <input type="date" value={form.date} onChange={(e) => setForm((c) => ({ ...c, date: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" />
          <input value={form.doctor} onChange={(e) => setForm((c) => ({ ...c, doctor: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Medico / struttura" />
          <input value={form.tags} onChange={(e) => setForm((c) => ({ ...c, tags: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Tag separati da virgola" />
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3" />
          <textarea value={form.notes} onChange={(e) => setForm((c) => ({ ...c, notes: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2" placeholder="Note" />
          <button className="rounded-lg bg-medaccent px-5 py-3 font-bold text-white md:col-span-2">Salva referto</button>
        </form>
      )}

      <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-medink">Documenti salvati</h2>
        <div className="mt-4 space-y-3">
          {(items.length ? items : [{ title: 'Nessun referto caricato', category: 'Archivio vuoto', date: '', doctor: '' }]).map((item) => (
            <article key={`${item.id || item.title}-${item.date}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-teal-700">{item.category} {item.date ? `- ${new Date(item.date).toLocaleDateString('it-IT')}` : ''}</p>
              <h3 className="mt-1 text-lg font-bold text-medink">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.doctor || item.notes}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Archive;
