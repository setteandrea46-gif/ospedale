import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const emptyForm = { name: '', dosage: '', frequency: '', route: '', reason: '', prescriber: '', startDate: '', notes: '' };

function Medications() {
  const [medications, setMedications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = () => api('/api/medications').then(({ medications }) => setMedications(medications || []));
  useEffect(() => { load(); }, []);

  const save = async (event) => {
    event.preventDefault();
    await api('/api/medications', { method: 'POST', body: JSON.stringify(form) });
    setForm(emptyForm);
    setShowForm(false);
    load();
  };

  const requestNotifications = async () => {
    if (!('Notification' in window)) return;
    await Notification.requestPermission();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Terapie</p>
            <h1 className="text-3xl font-bold text-medink">Farmaci e promemoria</h1>
            <p className="mt-2 text-slate-600">Salva farmaco, dosaggio, orario e motivo della terapia.</p>
          </div>
          <button onClick={() => setShowForm((value) => !value)} className="rounded-lg bg-medink px-5 py-3 text-sm font-bold text-white">
            Nuovo farmaco
          </button>
        </div>
      </section>

      {showForm && (
        <form onSubmit={save} className="grid gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2">
          {[
            ['name', 'Nome farmaco'],
            ['dosage', 'Dosaggio es. 500 mg'],
            ['frequency', 'Orario/frequenza es. 08:00 e 20:00'],
            ['route', 'Via es. orale'],
            ['reason', 'Motivo terapia'],
            ['prescriber', 'Prescrittore']
          ].map(([name, placeholder]) => (
            <input key={name} value={form[name]} onChange={(e) => setForm((current) => ({ ...current, [name]: e.target.value }))} required={name === 'name'} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder={placeholder} />
          ))}
          <input type="date" value={form.startDate} onChange={(e) => setForm((current) => ({ ...current, startDate: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" />
          <input value={form.notes} onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Note" />
          <button className="rounded-lg bg-medaccent px-5 py-3 font-bold text-white md:col-span-2">Salva farmaco</button>
        </form>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-medink">Terapie attive</h2>
          <div className="mt-4 space-y-3">
            {(medications.length ? medications : [{ name: 'Nessun farmaco inserito', dosage: 'Usa Nuovo farmaco per iniziare', frequency: '' }]).map((item) => (
              <article key={`${item.id || item.name}-${item.dosage}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-lg font-bold text-medink">{item.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{[item.dosage, item.frequency, item.route].filter(Boolean).join(' - ')}</p>
                {item.reason && <p className="mt-2 text-sm text-slate-500">Motivo: {item.reason}</p>}
              </article>
            ))}
          </div>
        </section>

        <aside className="rounded-xl bg-medblue p-6 shadow-sm">
          <h2 className="text-xl font-bold text-medink">Notifiche pillole</h2>
          <p className="mt-3 text-sm text-slate-700">Il browser puo chiederti il permesso per avvisi locali. La pianificazione completa sara il prossimo passo.</p>
          <button onClick={requestNotifications} className="mt-5 rounded-lg bg-medaccent px-4 py-3 text-sm font-bold text-white">Attiva notifiche</button>
        </aside>
      </div>
    </div>
  );
}

export default Medications;
