function Settings() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Impostazioni</p>
        <h1 className="mt-1 text-3xl font-bold text-medink">Privacy e accesso</h1>
        <p className="mt-2 text-slate-600">Qui andranno gestione NFC, lingua, notifiche, esportazione PDF e privacy.</p>
      </section>
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-medink">Funzioni previste</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {['Link pubblico NFC', 'Lingua scheda emergenza', 'Notifiche farmaci', 'Esporta cartella PDF'].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-700">{item}</div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Settings;
