import QRCode from 'qrcode';
import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';

function Emergency({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    api('/api/emergency')
      .then(({ emergency }) => setData(emergency))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data || !canvasRef.current) return;
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
    const publicUrl = `${window.location.origin}${basePath}/public/emergency/${user?.id || data.userId}`;
    QRCode.toCanvas(canvasRef.current, publicUrl, { width: 220 });
  }, [data, user]);

  const handlePrint = () => window.print();

  if (loading) return <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">Carico scheda emergenza...</div>;

  const allergies = [
    data?.allergies?.drug && `Farmaci: ${data.allergies.drug}`,
    data?.allergies?.food && `Alimentari: ${data.allergies.food}`,
    data?.allergies?.environmental && `Ambientali: ${data.allergies.environmental}`
  ].filter(Boolean);

  const rows = [
    { label: 'Nome paziente', value: data?.name },
    { label: 'Gruppo sanguigno', value: data?.bloodType || 'Non inserito' },
    { label: 'Allergie critiche', value: allergies.join(' - ') || 'Non inserite' },
    { label: 'Patologie', value: data?.chronicIssues?.join(', ') || 'Non inserite' },
    { label: 'Farmaci in terapia', value: data?.medications?.map((item) => `${item.name} ${item.dosage || ''} ${item.frequency || ''}`.trim()).join(', ') || 'Nessun farmaco inserito' },
    { label: 'Contatti emergenza', value: data?.emergencyContacts?.map((item) => `${item.name} ${item.phone}`.trim()).join(' - ') || 'Non inseriti' },
    { label: 'Donatore organi', value: data?.organDonor ? 'Si' : 'No / non indicato' }
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-medink p-4 text-white shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-100">Accesso medico NFC/QR</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Scheda emergenza paziente</h1>
            <p className="mt-2 text-slate-200">Questa e la schermata che medico o ospedale devono leggere velocemente.</p>
          </div>
          <button onClick={handlePrint} className="w-full rounded-lg bg-white px-5 py-3 text-sm font-bold text-medink hover:bg-teal-50 sm:w-auto">
            Stampa / PDF
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4">
            {rows.map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                <p className="mt-2 text-base font-bold text-medink">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-bold text-medink">QR pubblico</h3>
            <p className="text-sm text-slate-500">Da mettere anche su anello NFC o tessera</p>
          </div>
          <div className="flex justify-center">
            <canvas ref={canvasRef} />
          </div>
          <div className="mt-6 rounded-lg bg-medblue p-4 text-sm text-slate-700">
            Il QR apre la scheda pubblica senza login. Mostra solo i dati utili in emergenza.
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Emergency;
