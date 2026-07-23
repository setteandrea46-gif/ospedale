function Vaccines() {
  const vaccines = [
    'MPR', 'Polio', 'Tetano-difterite-pertosse', 'Epatite B', 'Influenza', 'COVID-19'
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Vaccini</p>
            <h1 className="text-2xl font-bold text-medink sm:text-3xl">Registro vaccinazioni</h1>
            <p className="mt-2 text-slate-600">Monitora vaccini ricevuti, lotto, medico e richiami.</p>
          </div>
          <button className="w-full rounded-lg bg-medink px-5 py-3 text-sm font-bold text-white sm:w-auto">Nuovo vaccino</button>
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {vaccines.map((vaccine) => (
            <div key={vaccine} className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <p className="text-sm font-semibold text-teal-700">{vaccine}</p>
              <p className="mt-2 text-lg font-bold text-medink">12/01/2025</p>
              <p className="mt-2 text-sm text-slate-600">Ospedale Santa Maria - Dr.ssa Neri</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-medblue p-4 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-medink">Richiami</h2>
        <p className="mt-3 text-sm text-slate-700">Ricevi promemoria per richiami in scadenza e calendario vaccinale consigliato.</p>
      </section>
    </div>
  );
}

export default Vaccines;
