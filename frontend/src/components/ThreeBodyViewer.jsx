import { useState } from 'react';

const SKETCHFAB_MODEL =
  'https://sketchfab.com/models/31b40fd809b14665b93773936d67c52c/embed?autostart=1&preload=1&transparent=0&ui_theme=dark&ui_infos=0&ui_controls=1';

const layers = ['Muscolare', 'Scheletro', 'Organi', 'Nervi', 'Circolazione'];

const regions = [
  {
    name: 'Testa e collo',
    x: 50,
    y: 16,
    summary: 'Area di controllo neurologico, respirazione alta, vista, udito e deglutizione.',
    muscles: 'Temporale, massetere, sternocleidomastoideo, trapezio superiore.',
    nerves: 'Nervi cranici, nervo trigemino, nervo facciale, plesso cervicale.',
    organs: 'Cervello, occhi, orecchie, tiroide, faringe e laringe.'
  },
  {
    name: 'Torace',
    x: 50,
    y: 32,
    summary: 'Zona centrale per respirazione, circolazione e postura della parte alta.',
    muscles: 'Pettorale maggiore, intercostali, diaframma, dentato anteriore.',
    nerves: 'Nervi intercostali, nervo frenico, rami del plesso brachiale.',
    organs: 'Cuore, polmoni, trachea, esofago e grandi vasi.'
  },
  {
    name: 'Addome',
    x: 50,
    y: 46,
    summary: 'Area digestiva e metabolica, importante anche per stabilita del tronco.',
    muscles: 'Retto addominale, obliqui, trasverso addominale, ileopsoas.',
    nerves: 'Nervi toraco-addominali, ileoipogastrico, ileoinguinale.',
    organs: 'Stomaco, fegato, pancreas, reni, intestino tenue e colon.'
  },
  {
    name: 'Spalla e braccio',
    x: 31,
    y: 39,
    summary: 'Movimento dell’arto superiore, forza di presa e sensibilita della mano.',
    muscles: 'Deltoide, bicipite, tricipite, brachiale, muscoli dell’avambraccio.',
    nerves: 'Plesso brachiale, nervo radiale, mediano, ulnare e muscolocutaneo.',
    organs: 'Non contiene organi interni, ma comprende vasi, tendini e articolazioni.'
  },
  {
    name: 'Bacino',
    x: 50,
    y: 60,
    summary: 'Zona di sostegno del corpo, passaggio di vasi e nervi verso le gambe.',
    muscles: 'Glutei, pavimento pelvico, adduttori prossimali, ileopsoas.',
    nerves: 'Nervo sciatico, femorale, otturatorio, plesso sacrale.',
    organs: 'Vescica, retto e organi riproduttivi.'
  },
  {
    name: 'Coscia e ginocchio',
    x: 43,
    y: 75,
    summary: 'Cammino, stabilita, estensione e flessione del ginocchio.',
    muscles: 'Quadricipite, ischiocrurali, sartorio, adduttori.',
    nerves: 'Nervo femorale, sciatico, safeno e peroneo comune.',
    organs: 'Non contiene organi interni; include femore, rotula, legamenti e vasi principali.'
  },
  {
    name: 'Polpaccio e piede',
    x: 56,
    y: 90,
    summary: 'Equilibrio, spinta del passo, ritorno venoso e appoggio plantare.',
    muscles: 'Gastrocnemio, soleo, tibiale anteriore, peronieri, flessori del piede.',
    nerves: 'Nervo tibiale, peroneo profondo, peroneo superficiale.',
    organs: 'Non contiene organi interni; contiene ossa del piede, tendine d’Achille e vasi.'
  }
];

function ThreeBodyViewer() {
  const [activeLayer, setActiveLayer] = useState('Muscolare');
  const [selectedRegion, setSelectedRegion] = useState(regions[1]);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const visibleRegion = hoveredRegion || selectedRegion;

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-medink p-4 text-white shadow-sm sm:p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-100">Atlante anatomico</p>
        <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">Corpo umano 3D professionale</h1>
            <p className="mt-3 max-w-2xl text-slate-200">
              Passa sulle zone evidenziate o cliccale per leggere muscoli, nervi e organi principali.
            </p>
          </div>
          <a
            href="https://sketchfab.com/3d-models/myology-31b40fd809b14665b93773936d67c52c"
            target="_blank"
            rel="noreferrer"
            className="w-full rounded-lg bg-white px-4 py-3 text-center text-sm font-bold text-medink transition hover:bg-teal-50 sm:w-auto"
          >
            Fonte modello
          </a>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="mobile-scrollbar-hidden flex gap-2 overflow-x-auto border-b border-slate-200 bg-slate-50 p-3 sm:flex-wrap sm:p-4">
            {layers.map((layer) => (
              <button
                key={layer}
                type="button"
                onClick={() => setActiveLayer(layer)}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition ${
                  activeLayer === layer ? 'bg-medaccent text-white shadow-sm' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-teal-50'
                }`}
              >
                {layer}
              </button>
            ))}
          </div>

          <div className="relative h-[520px] bg-[#f5f1e8] sm:h-[640px] md:h-[760px]">
            <iframe
              title="Modello 3D anatomia muscolare"
              src={SKETCHFAB_MODEL}
              className="h-full w-full border-0"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
            />

            <div className="pointer-events-none absolute inset-0">
              {regions.map((region) => {
                const isActive = visibleRegion.name === region.name;
                return (
                  <button
                    key={region.name}
                    type="button"
                    onMouseEnter={() => setHoveredRegion(region)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onFocus={() => setHoveredRegion(region)}
                    onBlur={() => setHoveredRegion(null)}
                    onClick={() => setSelectedRegion(region)}
                    className={`pointer-events-auto absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 text-xs font-black shadow-lg transition sm:h-8 sm:w-8 ${
                      isActive
                        ? 'scale-110 border-white bg-medaccent text-white ring-4 ring-teal-200'
                        : 'border-white bg-medink/90 text-white hover:scale-110 hover:bg-medaccent'
                    }`}
                    style={{ left: `${region.x}%`, top: `${region.y}%` }}
                    aria-label={`Mostra dettagli ${region.name}`}
                  >
                    i
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">{activeLayer}</p>
          <h2 className="mt-1 text-2xl font-bold text-medink">{visibleRegion.name}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{visibleRegion.summary}</p>

          <div className="mt-5 space-y-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-bold text-medink">Muscoli principali</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{visibleRegion.muscles}</p>
            </div>
            <div className="rounded-lg bg-teal-50 p-4">
              <p className="text-sm font-bold text-medink">Nervi principali</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{visibleRegion.nerves}</p>
            </div>
            <div className="rounded-lg bg-medwarm p-4">
              <p className="text-sm font-bold text-medink">Organi e strutture</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{visibleRegion.organs}</p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {regions.map((region) => (
              <button
                key={region.name}
                type="button"
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => setSelectedRegion(region)}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                  selectedRegion.name === region.name
                    ? 'border-teal-300 bg-teal-50 text-medaccent'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ThreeBodyViewer;
