import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Home', path: '/dashboard', icon: 'H' },
  { label: 'Profilo salute', path: '/profile', icon: '+' },
  { label: 'Emergenza', path: '/emergency', icon: '!' },
  { label: 'Referti', path: '/archive', icon: 'R' },
  { label: 'Terapie', path: '/medications', icon: 'T' },
  { label: 'Agenda', path: '/calendar', icon: 'A' },
  { label: 'Parametri', path: '/vitals', icon: 'P' },
  { label: 'Atlante 3D', path: '/3d-body', icon: '3D' },
  { label: 'Impostazioni', path: '/settings', icon: 'I' }
];

const defaultProfile = {
  name: '',
  surname: '',
  photo: ''
};

function Sidebar({ user, onLogout }) {
  const [profile, setProfile] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('medcard-user-profile');
    if (!saved) return;
    try {
      setProfile(JSON.parse(saved));
    } catch {
      window.localStorage.removeItem('medcard-user-profile');
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('medcard-user-profile', JSON.stringify(profile));
  }, [profile]);

  const displayName = [profile.name, profile.surname].filter(Boolean).join(' ') || (user ? user.email : 'Il tuo profilo');
  const initials = [profile.name, profile.surname]
    .filter(Boolean)
    .map((value) => value[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((current) => ({ ...current, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <aside className="w-full border-b border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-r lg:border-b-0 lg:p-4">
      <div className="mb-3 flex items-center gap-3 lg:mb-7">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-medaccent text-base font-black text-white shadow-sm lg:h-11 lg:w-11 lg:text-lg">M</div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">MedCard</div>
          <div className="text-lg font-bold text-medink lg:text-xl">Salute personale</div>
        </div>
      </div>

      <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-3 lg:mb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-medink text-sm font-black text-white ring-2 ring-white"
            aria-label="Carica foto profilo"
          >
            {profile.photo ? <img src={profile.photo} alt="Profilo" className="h-full w-full object-cover" /> : initials}
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-medink">{displayName}</p>
            <button type="button" onClick={() => setIsEditing((value) => !value)} className="text-xs font-bold text-medaccent hover:underline">
              Modifica profilo
            </button>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />

        {isEditing && (
          <div className="mt-3 grid gap-2">
            <input
              value={profile.name}
              onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
              placeholder="Nome"
              className="rounded-lg border-slate-200 bg-white px-3 py-2 text-sm"
            />
            <input
              value={profile.surname}
              onChange={(event) => setProfile((current) => ({ ...current, surname: event.target.value }))}
              placeholder="Cognome"
              className="rounded-lg border-slate-200 bg-white px-3 py-2 text-sm"
            />
          </div>
        )}
      </div>

      <div className="mobile-scrollbar-hidden -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:block lg:space-y-1.5 lg:overflow-visible lg:px-0 lg:pb-0">
        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition lg:gap-3 ${
                isActive ? 'bg-medink text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-medink'
              }`
            }
          >
            <span className="grid h-7 w-7 place-items-center rounded-md bg-white/15 text-[11px] font-black">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 lg:mt-8 lg:p-4">
        <div className="mb-3 font-medium text-slate-800">{user ? user.email : 'Accesso ospite'}</div>
        {user ? (
          <button onClick={onLogout} className="rounded-lg bg-medink px-4 py-2 text-white transition hover:bg-slate-800">
            Esci
          </button>
        ) : (
          <div className="flex gap-3">
            <NavLink className="font-semibold text-medaccent hover:underline" to="/login">Accedi</NavLink>
            <NavLink className="font-semibold text-medaccent hover:underline" to="/register">Registrati</NavLink>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
