import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const emptyForm = { title: '', type: '', doctor: '', facility: '', address: '', date: '', notes: '' };

function CalendarPage() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = () => api('/api/calendar').then(({ appointments }) => setAppointments(appointments || []));
  useEffect(() => { load(); }, []);

  const save = async (event) => {
    event.preventDefault();
    await api('/api/calendar', { method: 'POST', body: JSON.stringify(form) });
    setForm(emptyForm);
    setShowForm(false);
    load();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Agenda</p>
            <h1 className="text-3xl font-bold text-medink">Visite e appuntamenti</h1>
            <p className="mt-2 text-slate-600">Gestisci visite, strutture, medico e indirizzo.</p>
          </div>
          <button onClick={() => setShowForm((value) => !value)} className="rounded-lg bg-medink px-5 py-3 text-sm font-bold text-white">Nuova visita</button>
        </div>
      </section>

      {showForm && (
        <form onSubmit={save} className="grid gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))} required className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Titolo visita" />
          <input value={form.type} onChange={(e) => setForm((c) => ({ ...c, type: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Specialita" />
          <input value={form.doctor} onChange={(e) => setForm((c) => ({ ...c, doctor: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Medico" />
          <input value={form.facility} onChange={(e) => setForm((c) => ({ ...c, facility: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Struttura" />
          <input value={form.address} onChange={(e) => setForm((c) => ({ ...c, address: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Indirizzo" />
          <input type="datetime-local" value={form.date} onChange={(e) => setForm((c) => ({ ...c, date: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" />
          <input value={form.notes} onChange={(e) => setForm((c) => ({ ...c, notes: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2" placeholder="Note" />
          <button className="rounded-lg bg-medaccent px-5 py-3 font-bold text-white md:col-span-2">Salva visita</button>
        </form>
      )}

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-medink">Prossimi appuntamenti</h2>
        <div className="mt-4 grid gap-4">
          {(appointments.length ? appointments : [{ title: 'Nessuna visita inserita', facility: 'Aggiungi la prima visita', date: '' }]).map((item) => (
            <article key={`${item.id || item.title}-${item.date}`} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-teal-700">{item.date ? new Date(item.date).toLocaleString('it-IT') : 'Agenda vuota'}</p>
              <h3 className="mt-2 text-lg font-bold text-medink">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{[item.doctor, item.facility].filter(Boolean).join(' - ')}</p>
              {item.address && <a className="mt-2 inline-block text-sm font-bold text-medaccent hover:underline" href={`https://maps.google.com/?q=${encodeURIComponent(item.address)}`} target="_blank" rel="noreferrer">Apri mappa</a>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CalendarPage;
