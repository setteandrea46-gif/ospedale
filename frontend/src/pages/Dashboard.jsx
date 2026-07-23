import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, calculateProfileStatus } from '../lib/api';

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [archive, setArchive] = useState([]);

  useEffect(() => {
    Promise.all([
      api('/api/profile'),
      api('/api/medications'),
      api('/api/calendar'),
      api('/api/vitals'),
      api('/api/archive')
    ]).then(([profileData, medData, calendarData, vitalsData, archiveData]) => {
      setProfile(profileData.profile);
      setMedications(medData.medications || []);
      setAppointments(calendarData.appointments || []);
      setVitals(vitalsData.vitals || []);
      setArchive(archiveData.archive || []);
    });
  }, []);

  const status = useMemo(() => calculateProfileStatus(profile), [profile]);
  const upcoming = appointments
    .filter((item) => item.date && new Date(item.date) >= new Date(new Date().toDateString()))
    .slice(0, 3);
  const activeMeds = medications.slice(0, 4);
  const alerts = [
    status.missing.length > 0 && `Mancano dati profilo: ${status.missing.slice(0, 2).join(', ')}`,
    medications.length === 0 && 'Nessun farmaco inserito',
    appointments.length === 0 && 'Nessuna visita in agenda',
    archive.length === 0 && 'Nessun referto caricato'
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-medink p-4 text-white shadow-sm sm:p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-100">Home paziente</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">Oggi nella tua cartella clinica</h1>
            <p className="mt-3 max-w-2xl text-slate-200">Priorita, terapie, visite e dati mancanti in una schermata chiara.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/profile" className="w-full rounded-lg bg-white px-5 py-3 text-center text-sm font-bold text-medink hover:bg-teal-50 sm:w-auto">Completa profilo</Link>
              <Link to="/emergency" className="w-full rounded-lg border border-white/30 px-5 py-3 text-center text-sm font-bold text-white hover:bg-white/10 sm:w-auto">Scheda emergenza</Link>
            </div>
          </div>
          <div className="rounded-xl bg-white/10 p-5 ring-1 ring-white/15">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-100">Cartella completata</p>
            <p className="mt-2 text-5xl font-black">{status.completion}%</p>
            <div className="mt-4 h-2 rounded-full bg-white/20">
              <div className="h-2 rounded-full bg-teal-300" style={{ width: `${status.completion}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Farmaci attivi', medications.length],
          ['Visite agenda', appointments.length],
          ['Parametri registrati', vitals.length],
          ['Referti caricati', archive.length]
        ].map(([label, value]) => (
          <section key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-medink">{value}</p>
          </section>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Alert</p>
          <h2 className="mt-1 text-2xl font-bold text-medink">Cose da sistemare</h2>
          <div className="mt-5 space-y-3">
            {(alerts.length ? alerts : ['Tutto ok: la cartella e in ordine.']).map((alert) => (
              <div key={alert} className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">{alert}</div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Terapie di oggi</p>
          <h2 className="mt-1 text-2xl font-bold text-medink">Farmaci e orari</h2>
          <div className="mt-5 space-y-3">
            {(activeMeds.length ? activeMeds : [{ name: 'Nessun farmaco inserito', dosage: 'Aggiungi una terapia', frequency: '' }]).map((medication) => (
              <div key={`${medication.name}-${medication.id || medication.dosage}`} className="grid gap-2 rounded-lg border border-slate-200 p-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-bold text-medink">{medication.name}</p>
                  <p className="text-sm text-slate-600">{[medication.dosage, medication.frequency].filter(Boolean).join(' - ')}</p>
                </div>
                <Link to="/medications" className="rounded-lg bg-teal-50 px-3 py-2 text-center text-sm font-bold text-medaccent">Gestisci</Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Prossime visite</p>
            <h2 className="mt-1 text-2xl font-bold text-medink">Agenda paziente</h2>
          </div>
          <Link to="/calendar" className="w-full rounded-lg bg-medink px-4 py-2 text-center text-sm font-bold text-white sm:w-auto">Nuova visita</Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {(upcoming.length ? upcoming : [{ title: 'Nessuna visita programmata', facility: 'Aggiungi un appuntamento', date: '' }]).map((item) => (
            <article key={`${item.title}-${item.date}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-teal-700">{item.date ? new Date(item.date).toLocaleString('it-IT') : 'Agenda vuota'}</p>
              <h3 className="mt-1 font-bold text-medink">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.facility}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
