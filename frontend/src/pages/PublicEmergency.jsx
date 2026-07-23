import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '';

function PublicEmergency() {
  const { userId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/public/emergency/${userId}`)
      .then((response) => response.json())
      .then(({ emergency }) => setData(emergency));
  }, [userId]);

  if (!data) return <div className="grid min-h-screen place-items-center bg-slate-50 text-medink">Apro scheda emergenza...</div>;

  const rows = [
    ['Paziente', data.name],
    ['Gruppo sanguigno', data.bloodType || 'Non inserito'],
    ['Allergie farmaci', data.allergies?.drug || 'Non inserite'],
    ['Allergie alimentari', data.allergies?.food || 'Non inserite'],
    ['Patologie', data.chronicIssues?.join(', ') || 'Non inserite'],
    ['Farmaci', data.medications?.map((item) => `${item.name} ${item.dosage || ''} ${item.frequency || ''}`.trim()).join(', ') || 'Non inseriti'],
    ['Contatti', data.emergencyContacts?.map((item) => `${item.name} ${item.phone}`.trim()).join(' - ') || 'Non inseriti']
  ];

  return (
    <main className="min-h-screen bg-[#f5f7f8] p-4 md:p-8">
      <section className="mx-auto max-w-4xl rounded-xl bg-medink p-6 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-100">Scheda pubblica emergenza</p>
        <h1 className="mt-2 text-3xl font-bold">MedCard NFC</h1>
        <p className="mt-2 text-slate-200">Dati critici del paziente per medico o soccorritore.</p>
      </section>
      <section className="mx-auto mt-6 grid max-w-4xl gap-3 rounded-xl bg-white p-5 shadow-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-bold text-medink">{value}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

export default PublicEmergency;
