import { useEffect, useMemo, useState } from 'react';
import { api, calculateProfileStatus } from '../lib/api';

const chronicConditions = [
  'ipertensione arteriosa', 'insufficienza cardiaca', 'fibrillazione atriale', 'diabete tipo 1', 'diabete tipo 2',
  'asma bronchiale', 'BPCO', 'ipotiroidismo', 'ipertiroidismo', 'epilessia', 'morbo di Parkinson',
  'morbo di Crohn', 'colite ulcerosa', 'anemia', 'depressione', 'artrite reumatoide', 'osteoporosi'
];

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'];

const emptyProfile = {
  name: '',
  surname: '',
  dob: '',
  sex: '',
  height: '',
  weight: '',
  fiscalCode: '',
  emergencyDetails: {
    bloodType: '',
    organDonor: false,
    drugAllergies: '',
    foodAllergies: '',
    environmentalAllergies: '',
    emergencyContact: '',
    emergencyPhone: '',
    secondEmergencyContact: '',
    secondEmergencyPhone: '',
    selectedConditions: []
  }
};

function formatDate(value) {
  if (!value) return '';
  return value.slice(0, 10);
}

function Profile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api('/api/profile')
      .then(({ profile: saved }) => {
        if (!saved) return;
        setProfile({
          name: saved.name || '',
          surname: saved.surname || '',
          dob: formatDate(saved.dob),
          sex: saved.sex || '',
          height: saved.height || '',
          weight: saved.weight || '',
          fiscalCode: saved.fiscal_code || '',
          emergencyDetails: { ...emptyProfile.emergencyDetails, ...(saved.emergency_details || {}) }
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const status = useMemo(() => calculateProfileStatus({
    name: profile.name,
    surname: profile.surname,
    dob: profile.dob,
    emergency_details: profile.emergencyDetails
  }), [profile]);

  const updateField = (name, value) => {
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const updateDetails = (name, value) => {
    setProfile((current) => ({
      ...current,
      emergencyDetails: { ...current.emergencyDetails, [name]: value }
    }));
  };

  const toggleCondition = (condition) => {
    const selected = profile.emergencyDetails.selectedConditions || [];
    updateDetails(
      'selectedConditions',
      selected.includes(condition) ? selected.filter((item) => item !== condition) : [...selected, condition]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        name: profile.name,
        surname: profile.surname,
        dob: profile.dob || null,
        sex: profile.sex,
        height: profile.height || null,
        weight: profile.weight || null,
        fiscalCode: profile.fiscalCode,
        emergencyDetails: profile.emergencyDetails
      };
      await api('/api/profile', { method: 'POST', body: JSON.stringify(payload) });
      setMessage('Profilo salvato. La scheda emergenza si aggiorna automaticamente.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">Carico profilo salute...</div>;

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_18rem] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Profilo salute</p>
            <h1 className="mt-1 text-2xl font-bold text-medink sm:text-3xl">Dati clinici del paziente</h1>
            <p className="mt-2 text-slate-600">Puoi compilarlo quando vuoi. Questi dati alimentano anche la scheda emergenza NFC/QR.</p>
          </div>
          <div className="rounded-lg bg-medblue p-4">
            <div className="flex items-end justify-between">
              <p className="text-sm font-bold text-medink">Cartella completata</p>
              <p className="text-3xl font-black text-medaccent">{status.completion}%</p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white">
              <div className="h-2 rounded-full bg-medaccent" style={{ width: `${status.completion}%` }} />
            </div>
            {status.missing.length > 0 && <p className="mt-3 text-xs text-slate-700">Manca: {status.missing.slice(0, 3).join(', ')}</p>}
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-xl bg-white p-4 shadow-sm sm:p-6 xl:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-medink">Anagrafica</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input value={profile.name} onChange={(e) => updateField('name', e.target.value)} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Nome" />
            <input value={profile.surname} onChange={(e) => updateField('surname', e.target.value)} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Cognome" />
            <input type="date" value={profile.dob} onChange={(e) => updateField('dob', e.target.value)} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" />
            <select value={profile.sex} onChange={(e) => updateField('sex', e.target.value)} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3">
              <option value="">Sesso</option>
              <option value="M">Maschio</option>
              <option value="F">Femmina</option>
              <option value="Altro">Altro</option>
            </select>
            <input type="number" value={profile.height} onChange={(e) => updateField('height', e.target.value)} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Altezza cm" />
            <input type="number" value={profile.weight} onChange={(e) => updateField('weight', e.target.value)} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Peso kg" />
            <input value={profile.fiscalCode} onChange={(e) => updateField('fiscalCode', e.target.value)} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2" placeholder="Codice fiscale" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-medink">Dati critici</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <select value={profile.emergencyDetails.bloodType} onChange={(e) => updateDetails('bloodType', e.target.value)} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3">
              <option value="">Gruppo sanguigno</option>
              {bloodTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <label className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={profile.emergencyDetails.organDonor} onChange={(e) => updateDetails('organDonor', e.target.checked)} />
              Donatore organi
            </label>
            <input value={profile.emergencyDetails.emergencyContact} onChange={(e) => updateDetails('emergencyContact', e.target.value)} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Contatto emergenza 1" />
            <input value={profile.emergencyDetails.emergencyPhone} onChange={(e) => updateDetails('emergencyPhone', e.target.value)} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Telefono emergenza 1" />
            <input value={profile.emergencyDetails.secondEmergencyContact} onChange={(e) => updateDetails('secondEmergencyContact', e.target.value)} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Contatto emergenza 2" />
            <input value={profile.emergencyDetails.secondEmergencyPhone} onChange={(e) => updateDetails('secondEmergencyPhone', e.target.value)} className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Telefono emergenza 2" />
          </div>
        </section>

        <section className="space-y-4 xl:col-span-2">
          <h2 className="text-xl font-bold text-medink">Allergie e patologie</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <textarea value={profile.emergencyDetails.drugAllergies} onChange={(e) => updateDetails('drugAllergies', e.target.value)} rows="3" className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Allergie farmaci" />
            <textarea value={profile.emergencyDetails.foodAllergies} onChange={(e) => updateDetails('foodAllergies', e.target.value)} rows="3" className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Allergie alimentari" />
            <textarea value={profile.emergencyDetails.environmentalAllergies} onChange={(e) => updateDetails('environmentalAllergies', e.target.value)} rows="3" className="rounded-lg border-slate-200 bg-slate-50 px-4 py-3" placeholder="Allergie ambientali" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {chronicConditions.map((condition) => (
              <label key={condition} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                <input type="checkbox" checked={profile.emergencyDetails.selectedConditions?.includes(condition)} onChange={() => toggleCondition(condition)} />
                {condition}
              </label>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 xl:col-span-2">
          {message && <p className="text-sm font-semibold text-medaccent">{message}</p>}
          <button type="submit" disabled={saving} className="w-full rounded-lg bg-medink px-6 py-3 font-bold text-white hover:bg-slate-800 disabled:opacity-60 sm:w-auto">
            {saving ? 'Salvataggio...' : 'Salva profilo salute'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
