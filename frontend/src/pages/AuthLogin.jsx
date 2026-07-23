import { useEffect, useMemo, useRef, useState } from 'react';

const PIECES = {
  I: { color: 'cyan', cells: [[0, 1], [1, 1], [2, 1], [3, 1]] },
  O: { color: 'yellow', cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  T: { color: 'violet', cells: [[0, 0], [1, 0], [2, 0], [1, 1]] },
  S: { color: 'green', cells: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  Z: { color: 'red', cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  J: { color: 'blue', cells: [[0, 0], [0, 1], [1, 1], [2, 1]] },
  L: { color: 'orange', cells: [[2, 0], [0, 1], [1, 1], [2, 1]] }
};

const MEMORY_SEQUENCE = ['T', 'I', 'O', 'S'];
const MATCH_ROUNDS = [
  { target: 'L', choices: ['T', 'L', 'Z'] },
  { target: 'S', choices: ['J', 'O', 'S'] },
  { target: 'I', choices: ['Z', 'I', 'T'] },
  { target: 'T', choices: ['L', 'S', 'T'] }
];

function Tetromino({ type = 'T', size = 'md', muted = false }) {
  const piece = PIECES[type];
  return (
    <span className={`tetromino tetromino-${size} ${muted ? 'tetromino-muted' : ''}`} aria-hidden="true">
      {piece.cells.map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          className={`tetromino-cell cell-${piece.color}`}
          style={{ '--x': x, '--y': y }}
        />
      ))}
    </span>
  );
}

function Progress({ stage }) {
  return (
    <div className="campaign-progress" aria-label={`Livello ${Math.min(stage, 3)} di 3`}>
      {[1, 2, 3].map((level) => (
        <span key={level} className={stage >= level ? 'is-complete' : ''}>
          <i />
          {stage > level ? 'OK' : `0${level}`}
        </span>
      ))}
    </div>
  );
}

function useSound() {
  const contextRef = useRef(null);
  const [soundOn, setSoundOn] = useState(true);

  const play = (frequency = 220, duration = 0.09) => {
    if (!soundOn) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = contextRef.current || new AudioContext();
    contextRef.current = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.045, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  };

  return { soundOn, setSoundOn, play };
}

function Intro({ onStart, soundOn, setSoundOn }) {
  return (
    <section className="campaign-screen intro-screen">
      <div className="topbar">
        <span className="mini-brand"><Tetromino type="T" size="xs" /> NEXT DROP</span>
        <button className="sound-button" onClick={() => setSoundOn(!soundOn)} aria-label={soundOn ? 'Disattiva audio' : 'Attiva audio'}>
          {soundOn ? 'SOUND ON' : 'SOUND OFF'}
        </button>
      </div>

      <div className="hero-stack" aria-hidden="true">
        <Tetromino type="L" size="xl" />
        <Tetromino type="S" size="lg" />
        <Tetromino type="I" size="md" />
      </div>

      <div className="intro-copy">
        <p className="eyebrow">UN NUOVO PEZZO STA PER CADERE</p>
        <h1>SBLOCCA<br /><span>IL PROSSIMO</span><br />DROP.</h1>
        <p className="intro-text">Tre livelli. Un titolo segreto.<br />Segui il ritmo e completa la griglia.</p>
      </div>

      <button className="tetris-cta" onClick={onStart}>
        <span>GIOCA ORA</span>
        <Tetromino type="T" size="xs" />
      </button>
      <p className="microcopy">AUDIO CONSIGLIATO · 2 MIN</p>
    </section>
  );
}

function BeatGame({ onComplete, play }) {
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Tocca quando il pezzo entra nella zona');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPosition((current) => {
        if (current >= 94) setDirection(-1);
        if (current <= 0) setDirection(1);
        return Math.max(0, Math.min(94, current + direction * 3.1));
      });
    }, 34);
    return () => window.clearInterval(timer);
  }, [direction]);

  const hit = () => {
    const distance = Math.abs(position - 50);
    if (distance <= 14) {
      const next = score + 1;
      setScore(next);
      setMessage(next === 5 ? 'Ritmo agganciato!' : distance < 7 ? 'PERFETTO!' : 'GRANDE!');
      play(260 + next * 65);
      if (next === 5) window.setTimeout(onComplete, 650);
    } else {
      setMessage('Quasi! Aspetta il centro');
      play(100, 0.06);
    }
  };

  return (
    <GameShell stage={1} kicker="LIVELLO 01" title="AGGANCIA IL BEAT" subtitle={message}>
      <div className="beat-score">{Array.from({ length: 5 }).map((_, index) => <i key={index} className={index < score ? 'on' : ''} />)}</div>
      <div className="beat-lane">
        <div className="beat-zone" />
        <div className="falling-piece" style={{ left: `${position}%` }}><Tetromino type="I" size="sm" /></div>
      </div>
      <button className="game-pad" onClick={hit}><span>TAP</span><small>SUL TEMPO</small></button>
    </GameShell>
  );
}

function MemoryGame({ onComplete, play }) {
  const [input, setInput] = useState([]);
  const [active, setActive] = useState(null);
  const [watching, setWatching] = useState(true);
  const [status, setStatus] = useState('Guarda la sequenza');

  const runSequence = () => {
    setWatching(true);
    setInput([]);
    setStatus('Guarda la sequenza');
    MEMORY_SEQUENCE.forEach((piece, index) => {
      window.setTimeout(() => {
        setActive(piece);
        play(240 + index * 80);
      }, 550 + index * 650);
      window.setTimeout(() => setActive(null), 950 + index * 650);
    });
    window.setTimeout(() => {
      setWatching(false);
      setStatus('Ora ripetila');
    }, 550 + MEMORY_SEQUENCE.length * 650);
  };

  useEffect(runSequence, []);

  const choose = (piece) => {
    if (watching) return;
    const nextIndex = input.length;
    play(280 + nextIndex * 70);
    if (MEMORY_SEQUENCE[nextIndex] !== piece) {
      setStatus('Riproviamo: osserva bene');
      window.setTimeout(runSequence, 700);
      return;
    }
    const next = [...input, piece];
    setInput(next);
    setStatus(`${next.length} / ${MEMORY_SEQUENCE.length}`);
    if (next.length === MEMORY_SEQUENCE.length) {
      setStatus('Memoria perfetta!');
      window.setTimeout(onComplete, 650);
    }
  };

  return (
    <GameShell stage={2} kicker="LIVELLO 02" title="RICORDA LA STACK" subtitle={status}>
      <div className="memory-board">
        {MEMORY_SEQUENCE.map((piece, index) => (
          <span key={`${piece}-${index}`} className={active === piece ? 'flash' : input[index] === piece ? 'locked' : ''}>
            <Tetromino type={piece} size="md" muted={active !== piece && watching} />
          </span>
        ))}
      </div>
      <div className="piece-controls">
        {MEMORY_SEQUENCE.map((piece) => (
          <button key={piece} disabled={watching} onClick={() => choose(piece)} aria-label={`Pezzo ${piece}`}>
            <Tetromino type={piece} size="sm" />
          </button>
        ))}
      </div>
    </GameShell>
  );
}

function MatchGame({ onComplete, play }) {
  const [round, setRound] = useState(0);
  const [wrong, setWrong] = useState(null);
  const current = MATCH_ROUNDS[round];

  const choose = (piece) => {
    if (piece !== current.target) {
      setWrong(piece);
      play(110);
      window.setTimeout(() => setWrong(null), 350);
      return;
    }
    play(440 + round * 80);
    if (round === MATCH_ROUNDS.length - 1) {
      window.setTimeout(onComplete, 500);
    } else {
      setRound(round + 1);
    }
  };

  return (
    <GameShell stage={3} kicker="LIVELLO 03" title="CHIUDI LA GRIGLIA" subtitle={`Trova il pezzo giusto · ${round + 1}/4`}>
      <div className="match-target">
        <span>PROSSIMO SPAZIO</span>
        <Tetromino type={current.target} size="xl" muted />
      </div>
      <div className="match-choices">
        {current.choices.map((piece) => (
          <button key={`${round}-${piece}`} className={wrong === piece ? 'wrong' : ''} onClick={() => choose(piece)} aria-label={`Scegli il pezzo ${piece}`}>
            <Tetromino type={piece} size="md" />
          </button>
        ))}
      </div>
    </GameShell>
  );
}

function GameShell({ stage, kicker, title, subtitle, children }) {
  return (
    <section className="campaign-screen game-screen">
      <Progress stage={stage} />
      <div className="game-heading">
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="game-content">{children}</div>
    </section>
  );
}

function Reveal({ onReplay, play }) {
  useEffect(() => {
    [330, 415, 523, 659].forEach((tone, index) => window.setTimeout(() => play(tone, 0.18), 250 + index * 140));
  }, []);

  return (
    <section className="campaign-screen reveal-screen">
      <div className="confetti" aria-hidden="true">
        {['I', 'T', 'S', 'O', 'L', 'J', 'Z', 'T', 'I', 'S', 'O', 'L'].map((piece, index) => (
          <span key={index} style={{ '--i': index }}><Tetromino type={piece} size="xs" /></span>
        ))}
      </div>
      <p className="eyebrow">NUOVO SINGOLO · PROSSIMAMENTE</p>
      <div className="reveal-title">
        <span>IL TITOLO È</span>
        <h1>TETRIS<span>2</span></h1>
      </div>
      <div className="cover-grid" aria-hidden="true">
        <Tetromino type="T" size="xl" />
        <Tetromino type="I" size="lg" />
        <Tetromino type="L" size="xl" />
      </div>
      <p className="reveal-copy">Hai completato la griglia.<br />Ora preparati al drop.</p>
      <div className="release-tag"><i /> PRE-SAVE COMING SOON</div>
      <button className="tetris-cta secondary" onClick={onReplay}>RIGIOCA</button>
      <p className="signature">ANDREA SETTE · TETRIS2</p>
    </section>
  );
}

function Login() {
  const [stage, setStage] = useState(0);
  const { soundOn, setSoundOn, play } = useSound();
  const backgroundPieces = useMemo(() => ['T', 'L', 'S', 'I', 'O', 'Z'], []);

  return (
    <main className="music-campaign">
      <div className="ambient-grid" aria-hidden="true">
        {backgroundPieces.map((piece, index) => <span key={index} style={{ '--delay': `${index * -1.4}s` }}><Tetromino type={piece} size="sm" muted /></span>)}
      </div>
      <div className="phone-stage">
        {stage === 0 && <Intro onStart={() => { play(220); setStage(1); }} soundOn={soundOn} setSoundOn={setSoundOn} />}
        {stage === 1 && <BeatGame play={play} onComplete={() => setStage(2)} />}
        {stage === 2 && <MemoryGame play={play} onComplete={() => setStage(3)} />}
        {stage === 3 && <MatchGame play={play} onComplete={() => setStage(4)} />}
        {stage === 4 && <Reveal play={play} onReplay={() => setStage(0)} />}
      </div>
    </main>
  );
}

export default Login;
