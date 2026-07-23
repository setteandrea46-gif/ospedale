import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const emptyForm = { type: 'pressione', systolic: '', diastolic: '', heartRate: '', oxygen: '', glucose: '', weight: '', temperature: '', recordedAt: '', notes: '' };

function Vitals() {
  const [vitals, setVitals] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = () => api('/api/vitals').then(({ vitals }) => setVitals(vitals || []));
  useEffect(() => { load(); }, []);

  const save = async (event) => {
    event.preventDefault();
    await api('/api/vitals', {
      method: 'POST',
      body: JSON.stringify({ ...form, recordedAt: form.recordedAt || new Date().toISOString() })
    });
    setForm(emptyForm);
    setShowForm(false);
    load();
  };

  const latest = vitals[0] || {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Parametri</p>
            <h1 className="text-3xl font-bold text-medink">Monitoraggio salute</h1>
            <p className="mt-2 text-slate-600">Registra pressione, glicemia, saturazione, peso e temperatura.</p>
          </div>
          <button onClick={() => setShowForm((value) => !value)} className="rounded-lg bg-medink px-5 py-3 text-sm font-bold text-white">Nuovo parametro</button>
        </div>
      </section>

      {showForm && (
        <form onSubmit={save} className="grid gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-3">
          <select value={form.type} onChange={(e) => setForm((c) => ({ ...c, type: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3">
            <option value="pressione">Pressione</option>
            <option value="glicemia">Glicemia</option>
            <option value="saturazione">Saturazione</option>
            <option value="peso">Peso</option>
            <option value="temperatura">Temperatura</option>
          </select>
          {['systolic', 'diastolic', 'heartRate', 'oxygen', 'glucose', 'weight', 'temperature'].map((name) => (
            <input key={name} type="number" value={form[name]} onChange={(e) => setForm((c) => ({ ...c, [name]: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder={name} />
          ))}
          <input type="datetime-local" value={form.recordedAt} onChange={(e) => setForm((c) => ({ ...c, recordedAt: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" />
          <input value={form.notes} onChange={(e) => setForm((c) => ({ ...c, notes: e.target.value }))} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2" placeholder="Note" />
          <button className="rounded-lg bg-medaccent px-5 py-3 font-bold text-white md:col-span-3">Salva parametro</button>
        </form>
      )}

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ['Pressione', latest.systolic ? `${latest.systolic}/${latest.diastolic || '-'}` : '-'],
            ['Frequenza', latest.heart_rate ? `${latest.heart_rate} bpm` : '-'],
            ['Saturazione', latest.oxygen ? `${latest.oxygen}%` : '-'],
            ['Glicemia', latest.glucose ? `${latest.glucose} mg/dL` : '-']
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <p className="mt-3 text-2xl font-black text-medink">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-medblue p-6 shadow-sm">
        <h2 className="text-xl font-bold text-medink">Grafico rapido</h2>
        <div className="mt-6 flex h-64 items-end gap-2 rounded-lg bg-white p-4">
          {(vitals.length ? vitals.slice(0, 12).reverse() : [20, 45, 35, 65, 55]).map((item, index) => {
            const value = typeof item === 'number' ? item : Number(item.systolic || item.glucose || item.oxygen || item.weight || 30);
            return <div key={item.id || index} className="flex-1 rounded-t bg-medaccent" style={{ height: `${Math.max(12, Math.min(100, value / 2))}%` }} />;
          })}
        </div>
      </section>
    </div>
  );
}

export default Vitals;
