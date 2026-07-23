function Vaccines() {
  const vaccines = [
    'MPR', 'Polio', 'Tetano-difterite-pertosse', 'Epatite B', 'Influenza', 'COVID-19'
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Registro vaccinazioni</h1>
        <p className="mt-2 text-slate-600">Monitora i vaccini ricevuti, il lotto e i richiami.</p>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-2">
          {vaccines.map((vaccine) => (
            <div key={vaccine} className="rounded-3xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">{vaccine}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">12/01/2025</p>
              <p className="mt-2 text-sm text-slate-600">Ospedale Santa Maria · Dr.ssa Neri</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-medblue p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Richiami</h2>
        <p className="mt-3 text-sm text-slate-700">Ricevi promemoria per richiami in scadenza e segui il calendario vaccinale consigliato.</p>
      </section>
    </div>
  );
}

export default Vaccines;
