import { useState, useEffect } from 'react';
import { playTTS, preloadTTS } from '../utils/elevenlabs';
import { Box, Package, Rocket, TrainFront, Banknote, Building, Zap, Gem, Star, Bird, Flame, Leaf, Globe } from 'lucide-react';

/* ══════════════════════════════════════════════════════
   15 SCENARIOS — each a DIFFERENT interaction type
   covering Expanded ↔ Standard Form in a unique way
══════════════════════════════════════════════════════ */
const SCENARIOS = [

  // 1. COLLECTOR — click matching expanded parts
  {
    id: 1, type: 'collector',
    title: '💎 Treasure Chest Builder',
    instruction: 'Pick ONLY the coin bags that make 4,582. Click the correct ones!',
    targetText: 'Chest Goal: 4,582',
    items: [4000, 500, 80, 700, 2, 800],
    correctItems: ['4000', '500', '80', '2'],
    icon: <Gem size={30} />
  },

  // 2. NUMPAD — type full 4-digit standard form from robot dialogue
  {
    id: 2, type: 'input_numpad',
    title: '⚡ Robot Energy Pack',
    instruction: 'Listen to the robot and type the full number on the numpad.',
    dialogue: '"I need: 3 thousands, 6 hundreds, 4 tens, 9 ones. Power me up!"',
    target: '3649', maxLen: 4,
    icon: <Zap size={30} />
  },

  // 3. MATCH PAIRS — click value → click its place label
  {
    id: 3, type: 'match_pairs',
    title: '🔬 Place Value Lab',
    instruction: 'Click a number part, then click its matching place value label!',
    pairs: [
      { value: '5000', label: 'Thousands' },
      { value: '200',  label: 'Hundreds'  },
      { value: '30',   label: 'Tens'      },
      { value: '7',    label: 'Ones'      },
    ],
    icon: <Building size={30} />
  },

  // 4. SELECTOR — click the one missing expanded part
  {
    id: 4, type: 'selector',
    title: '🚀 Space Fuel Station',
    instruction: 'Which fuel tank is missing to make the rocket reach 8,706?',
    targetText: 'Rocket needs: 8,706',
    present: ['8000', '700', '6'],
    options: ['60', '0', '70'],
    correctOption: '0',
    icon: <Rocket size={30} />
  },

  // 5. EXPANSION PUZZLE — click chips in order to fill equation blanks  ← NEW (replaces true/false)
  {
    id: 5, type: 'expansion_puzzle',
    title: '🧩 Expanded Form Puzzle',
    instruction: 'Click the chips in order to complete the equation!',
    displayNumber: '8,563',
    correctParts: ['8000', '500', '60', '3'],          // must click in THIS order
    chips: ['8000', '500', '800', '60', '3', '30'],    // pool (includes 2 wrong)
    chipColors: ['#6366f1','#ec4899','#f59e0b','#22c55e','#3b82f6','#ef4444'],
    icon: <Box size={30} />
  },

  // 6. SINGLE DIGIT numpad — type the hundreds digit
  {
    id: 6, type: 'input_single_digit',
    title: '🦜 Zoo Animal Counter',
    instruction: 'The hundreds counter is broken! What is the hundreds digit of 4,925?',
    hint: '4,925 = 4000 + ?00 + 20 + 5',
    target: '9', maxLen: 1,
    icon: <Bird size={30} />
  },

  // 7. DIGIT DECODER — select a chip then click its color-coded zone  ← NEW (replaces mcq_word)
  {
    id: 7, type: 'digit_decoder',
    title: '🎨 Digit Value Decoder',
    instruction: 'Select a value chip, then drop it in the correct color zone!',
    displayNumber: '4,215',
    digits: ['4','2','1','5'],
    zones: [
      { label: 'Thousands', correct: '4000', color: '#a855f7', textColor: '#fff' },
      { label: 'Hundreds',  correct: '200',  color: '#f43f5e', textColor: '#fff' },
      { label: 'Tens',      correct: '10',   color: '#10b981', textColor: '#fff' },
      { label: 'Ones',      correct: '5',    color: '#f59e0b', textColor: '#fff' },
    ],
    chips: ['4000','200','10','5','400','20'],
    chipColors: ['#a855f7','#f43f5e','#10b981','#f59e0b','#6366f1','#ec4899'],
    icon: <Banknote size={30} />
  },

  // 8. TABLE INPUT — read table and type standard form
  {
    id: 8, type: 'input_table',
    title: '🚂 Train Compartment Assembly',
    instruction: 'Each compartment holds one digit. What number does the train make?',
    details: [
      { label: 'Thousands 🚂', value: '2' },
      { label: 'Hundreds 🚃',  value: '8' },
      { label: 'Tens 🚃',      value: '5' },
      { label: 'Ones 🚃',      value: '1' },
    ],
    target: '2851', maxLen: 4,
    icon: <TrainFront size={30} />
  },

  // 9. COLLECTOR ZERO — click only non-zero expanded parts
  {
    id: 9, type: 'collector_zero',
    title: '⭐ Zero Hero Challenge',
    instruction: 'Careful! 5,040 has a zero. Pick ONLY the correct parts — no zero bags!',
    targetText: 'Target: 5,040',
    items: [5000, 400, 40, 500, 50],
    correctItems: ['5000', '40'],
    hint: 'Zero hundreds = NO hundreds bag needed!',
    icon: <Star size={30} />
  },

  // 10. BALANCE SCALE — click the larger of two numbers shown on pans  ← NEW (replaces mcq_compare)
  {
    id: 10, type: 'number_scale',
    title: '⚖️ Number Balance Scale',
    instruction: 'Click the HEAVIER pan — it holds the BIGGER number!',
    numA: '6,782',
    numB: '6,728',
    answer: '6,782',
    hintA: '6000 + 700 + 80 + 2',
    hintB: '6000 + 700 + 20 + 8',
    icon: <Flame size={30} />
  },

  // 11. EQUATION INPUT — solve addition equation and type result
  {
    id: 11, type: 'input_equation',
    title: '🧙 Math Wizard Spell',
    instruction: 'Add all the parts and type the standard form answer!',
    equation: '9000 + 300 + 0 + 7 = ?',
    target: '9307', maxLen: 4,
    icon: <Globe size={30} />
  },

  // 12. SELECTOR EXPANDED — click the correct expanded form for a standard number
  {
    id: 12, type: 'selector_expanded',
    title: '🌿 Jungle Code Decoder',
    instruction: 'Which expanded form is the correct code for 3,815?',
    displayNumber: '3,815',
    options: [
      '3000 + 800 + 15',
      '3000 + 800 + 10 + 5',
      '300 + 800 + 10 + 5',
      '3000 + 80 + 10 + 5'
    ],
    answer: '3000 + 800 + 10 + 5',
    icon: <Leaf size={30} />
  },

  // 13. DIGIT SPOTLIGHT — see glowing digit, type its full place value  ← NEW (replaces truefalse_digit)
  {
    id: 13, type: 'digit_spotlight',
    title: '🔦 Digit Spotlight',
    instruction: 'Look at the glowing digit. Type its PLACE VALUE using the numpad!',
    numberDigits: [
      { digit: '3', place: 'Thousands', color: '#ffffff33' },
      { digit: '4', place: 'Hundreds',  color: '#fbbf24',   glow: true },  // ← spotlight on this
      { digit: '9', place: 'Tens',      color: '#ffffff33' },
      { digit: '2', place: 'Ones',      color: '#ffffff33' },
    ],
    hint: 'The golden digit 4 is in the Hundreds place.',
    target: '400', maxLen: 3,
    icon: <Package size={30} />
  },

  // 14. TENS DIGIT INPUT — type only the tens digit
  {
    id: 14, type: 'input_tens',
    title: '🗺️ Pirate Treasure Decode',
    instruction: 'The tens digit is hidden on the treasure map! What is it?',
    hint: '8,139 = 8000 + 100 + ?0 + 9',
    target: '3', maxLen: 1,
    icon: <Star size={30} />
  },

  // 15. NUMBER FUSION — click orbs from largest → smallest to build a number  ← NEW (replaces mcq_standard)
  {
    id: 15, type: 'number_fusion',
    title: '🔮 Number Fusion Machine',
    instruction: 'Click orbs from LARGEST to SMALLEST! They will fuse into a number.',
    orbs: [
      { value: '3000', label: '3 Thousands', color: '#a855f7', shadow: '#a855f740' },
      { value: '0',    label: '0 Hundreds',  color: '#3b82f6', shadow: '#3b82f640' },
      { value: '70',   label: '7 Tens',      color: '#10b981', shadow: '#10b98140' },
      { value: '2',    label: '2 Ones',      color: '#f59e0b', shadow: '#f59e0b40' },
    ],
    correctOrder: ['3000', '0', '70', '2'],
    finalNumber: '3072',
    icon: <Globe size={30} />
  },
];

/* ── audio text per scenario ── */
const getAudio = (s) => `${s.title.replace(/[^\w\s]/g, '')}. ${s.instruction}`;

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function Simulate({ onNext }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [feedback, setFeedback]         = useState(null); // null | 'correct' | 'wrong'

  // Shared interaction states (reset on round change)
  const [inputValue, setInputValue]       = useState('');
  const [collected, setCollected]         = useState([]);   // collector / expansion_puzzle / number_fusion
  const [matchState, setMatchState]       = useState({});   // match_pairs / digit_decoder zone fills
  const [selectedOption, setSelectedOption] = useState(null); // selector / number_scale / digit_decoder chip

  // Preload ALL audio once
  useEffect(() => {
    SCENARIOS.forEach(s => preloadTTS(getAudio(s)));
    preloadTTS('Awesome job!');
    preloadTTS('Oops! Try again!');
    playTTS(getAudio(SCENARIOS[0]));
  }, []);

  const round = SCENARIOS[currentRound];

  const resetRoundState = () => {
    setInputValue('');
    setCollected([]);
    setMatchState({});
    setSelectedOption(null);
    setFeedback(null);
  };

  const advanceRound = () => {
    setTimeout(() => {
      resetRoundState();
      if (currentRound < SCENARIOS.length - 1) {
        const next = currentRound + 1;
        setCurrentRound(next);
        playTTS(getAudio(SCENARIOS[next]));
      } else {
        onNext();
      }
    }, 1600);
  };

  const triggerCorrect = () => {
    setFeedback('correct');
    playTTS('Awesome job!');
    advanceRound();
  };

  const triggerWrong = () => {
    setFeedback('wrong');
    playTTS('Oops! Try again!');
    setTimeout(() => {
      setFeedback(null);
      setInputValue('');
      setCollected([]);
      setSelectedOption(null);
    }, 1500);
  };

  /* ── Numpad ── */
  const handleNumpad = (key) => {
    if (feedback) return;
    if (key === 'DEL') { setInputValue(v => v.slice(0, -1)); return; }
    const maxLen = round.maxLen || 4;
    const next = inputValue + key;
    if (next.length > maxLen) return;
    setInputValue(next);
    if (next.length === maxLen || (round.type === 'digit_spotlight' && next.length === round.target.length)) {
      setTimeout(() => { next === round.target ? triggerCorrect() : triggerWrong(); }, 100);
    }
    if (round.type === 'input_single_digit' || round.type === 'input_tens') {
      if (next.length === 1) setTimeout(() => { next === round.target ? triggerCorrect() : triggerWrong(); }, 100);
    }
  };

  /* ── Collector ── */
  const handleCollect = (item) => {
    if (feedback || collected.includes(String(item))) return;
    const newC = [...collected, String(item)];
    setCollected(newC);
    const correct = round.correctItems.map(String);
    if (newC.some(v => !correct.includes(v))) { triggerWrong(); return; }
    if (correct.every(v => newC.includes(v))) triggerCorrect();
  };

  /* ── Expansion Puzzle (ordered chips) ── */
  const handleChipClick = (chip) => {
    if (feedback) return;
    const expected = round.correctParts[collected.length];
    if (chip === expected) {
      const newC = [...collected, chip];
      setCollected(newC);
      if (newC.length === round.correctParts.length) triggerCorrect();
    } else {
      triggerWrong();
    }
  };

  /* ── Match Pairs ── */
  const handleMatchValue = (v) => { if (!matchState[v]) setSelectedOption(v); };
  const handleMatchLabel = (label) => {
    if (!selectedOption || feedback) return;
    const pair = round.pairs.find(p => p.value === selectedOption);
    if (pair && pair.label === label) {
      const ns = { ...matchState, [selectedOption]: label };
      setMatchState(ns);
      setSelectedOption(null);
      if (round.pairs.every(p => ns[p.value] === p.label)) triggerCorrect();
    } else {
      triggerWrong();
    }
  };

  /* ── Digit Decoder ── */
  const handleDecoderChip = (chip) => { if (!feedback) setSelectedOption(chip); };
  const handleDecoderZone = (zone) => {
    if (!selectedOption || feedback) return;
    if (selectedOption === zone.correct) {
      const ns = { ...matchState, [zone.label]: selectedOption };
      setMatchState(ns);
      setSelectedOption(null);
      if (round.zones.every(z => ns[z.label] === z.correct)) triggerCorrect();
    } else {
      triggerWrong();
    }
  };

  /* ── Number Fusion (ordered orb clicks) ── */
  const handleFusionOrb = (orb) => {
    if (feedback || collected.includes(orb.value)) return;
    const expected = round.correctOrder[collected.length];
    if (orb.value === expected) {
      const newC = [...collected, orb.value];
      setCollected(newC);
      if (newC.length === round.correctOrder.length) triggerCorrect();
    } else {
      triggerWrong();
    }
  };

  /* ── Generic option ── */
  const handleSelect = (opt, answer) => {
    if (feedback) return;
    setSelectedOption(opt);
    setTimeout(() => { opt === answer ? triggerCorrect() : triggerWrong(); }, 150);
  };

  /* ══════════ RENDER INTERACTION ══════════ */
  const renderInteraction = () => {
    const t = round.type;

    /* Shared Numpad component */
    const NumpadUI = () => (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '28px', justifyContent: 'center', width: '100%' }}>
        <div style={{ flex: '1', minWidth: '230px', background: 'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius: '16px', padding: '28px', fontSize: '1.35rem', lineHeight: '2.1', border: '1.5px solid #6366f155' }}>
          {round.dialogue  && <p style={{ color: '#fbbf24', fontStyle: 'italic', marginBottom: '10px', fontSize: '1.4rem' }}>{round.dialogue}</p>}
          {round.equation  && <p style={{ color: '#a5f3fc', fontWeight: 800, fontSize: '1.8rem', textAlign: 'center' }}>{round.equation}</p>}
          {round.hint      && <p style={{ color: '#6ee7b7', fontSize: '1.3rem', textAlign: 'center' }}>{round.hint}</p>}
          {round.details   && round.details.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ffffff18', paddingBottom: '10px', marginBottom: '10px' }}>
              <span style={{ color: '#e2e8f0' }}>{d.label}</span>
              <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '1.5rem' }}>{d.value}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '190px', height: '74px',
            background: '#0f0f1a',
            border: `2.5px solid ${feedback === 'correct' ? '#22c55e' : feedback === 'wrong' ? '#ef4444' : '#fbbf24'}`,
            borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.8rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '6px',
            boxShadow: `0 0 20px ${feedback === 'correct' ? '#22c55e44' : '#fbbf2444'}`
          }}>{inputValue || '—'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
            {[1,2,3,4,5,6,7,8,9,'DEL',0].map((k,i) => (
              <button key={i} onClick={() => handleNumpad(String(k))}
                style={{ padding: '16px 20px', borderRadius: '10px', fontSize: '1.5rem', fontWeight: 700,
                  background: k==='DEL' ? '#7f1d1d' : '#1e3a8a',
                  border: '1.5px solid #ffffff22', color: '#fff', cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 3px 8px #00000055' }}>{k}</button>
            ))}
          </div>
        </div>
      </div>
    );

    /* ─── 1 & 9: COLLECTOR ─── */
    if (t === 'collector' || t === 'collector_zero') return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <h3 style={{ color: '#fbbf24', fontSize: '1.7rem', marginBottom: '10px' }}>{round.targetText}</h3>
        {round.hint && <p style={{ color: '#6ee7b7', marginBottom: '14px', fontSize: '1.15rem' }}>{round.hint}</p>}
        <div style={{ minHeight: '68px', background: '#00000044', border: '2px dashed #fbbf2466', borderRadius: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', padding: '12px', marginBottom: '22px' }}>
          {collected.length === 0
            ? <span style={{ color: '#ffffff44', fontSize: '1.1rem' }}>Selected parts appear here…</span>
            : collected.map((c,i) => <div key={i} style={{ background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff', padding: '10px 22px', borderRadius: '8px', fontWeight: 800, fontSize: '1.5rem', boxShadow: '0 3px 10px #10b98155' }}>{c}</div>)}
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {round.items.map((item, i) => {
            const sel = collected.includes(String(item));
            const colors = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444'];
            return (
              <button key={i} onClick={() => handleCollect(item)} disabled={sel}
                style={{ padding: '20px 30px', borderRadius: '12px', fontSize: '1.7rem', fontWeight: 800,
                  background: sel ? '#ffffff0f' : `linear-gradient(135deg,${colors[i%6]},${colors[(i+2)%6]})`,
                  border: `2px solid ${sel ? '#ffffff18' : colors[i%6]}`,
                  color: sel ? '#ffffff33' : '#fff', cursor: sel ? 'default' : 'pointer',
                  boxShadow: sel ? 'none' : `0 4px 16px ${colors[i%6]}55`, transition: 'all 0.25s', transform: sel ? 'none' : 'translateY(-2px)' }}>{item}</button>
            );
          })}
        </div>
      </div>
    );

    /* ─── 2, 6, 8, 11, 14: NUMPAD ─── */
    if (t === 'input_numpad' || t === 'input_single_digit' || t === 'input_table' || t === 'input_equation' || t === 'input_tens') return <NumpadUI />;

    /* ─── 3: MATCH PAIRS ─── */
    if (t === 'match_pairs') return (
      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
        <div>
          <p style={{ color: '#ffffff77', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center', marginBottom: '12px' }}>Number Parts</p>
          {round.pairs.map((p, i) => {
            const matched = !!matchState[p.value];
            const zoneColors = ['#a855f7','#f43f5e','#10b981','#f59e0b'];
            return (
              <button key={i} onClick={() => handleMatchValue(p.value)} disabled={matched}
                style={{ display: 'block', width: '100%', marginBottom: '12px', padding: '18px 36px', borderRadius: '12px', fontSize: '1.8rem', fontWeight: 900,
                  background: selectedOption === p.value ? `linear-gradient(135deg,${zoneColors[i]},${zoneColors[i]}aa)` : matched ? '#22c55e22' : `linear-gradient(135deg,#1e3a8a,#2d4cb5)`,
                  border: `2px solid ${selectedOption === p.value ? zoneColors[i] : matched ? '#22c55e' : '#60a5fa'}`,
                  color: '#fff', cursor: matched ? 'default' : 'pointer', transition: 'all 0.25s',
                  boxShadow: selectedOption === p.value ? `0 0 20px ${zoneColors[i]}77` : 'none' }}>{p.value}</button>
            );
          })}
        </div>
        <div>
          <p style={{ color: '#ffffff77', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center', marginBottom: '12px' }}>Place Value</p>
          {['Thousands','Hundreds','Tens','Ones'].map((label, i) => {
            const used = Object.values(matchState).includes(label);
            const zoneColors = ['#a855f7','#f43f5e','#10b981','#f59e0b'];
            return (
              <button key={i} onClick={() => handleMatchLabel(label)} disabled={used || !selectedOption}
                style={{ display: 'block', width: '100%', marginBottom: '12px', padding: '18px 36px', borderRadius: '12px', fontSize: '1.8rem', fontWeight: 900,
                  background: used ? `linear-gradient(135deg,${zoneColors[i]}55,${zoneColors[i]}33)` : '#ffffff0f',
                  border: `2px solid ${used ? zoneColors[i] : '#ffffff2a'}`,
                  color: used ? '#fff' : '#ffffffbb', cursor: (used || !selectedOption) ? 'default' : 'pointer', transition: 'all 0.25s' }}>{label}</button>
            );
          })}
        </div>
      </div>
    );

    /* ─── 4: SELECTOR (missing part) ─── */
    if (t === 'selector') return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <h3 style={{ color: '#fbbf24', fontSize: '2rem', marginBottom: '24px' }}>{round.targetText}</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '36px', flexWrap: 'wrap' }}>
          {round.present.map((p, i) => (
            <span key={i} style={{ background: 'linear-gradient(135deg,#1e3a8a,#2d4cb5)', padding: '16px 28px', borderRadius: '12px', fontSize: '2.2rem', fontWeight: 800, color: '#fff', boxShadow: '0 4px 14px #3b82f655' }}>{p}</span>
          ))}
          <span style={{ background: '#fbbf2411', border: '2px dashed #fbbf24', padding: '16px 28px', borderRadius: '12px', fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24', animation: 'pulse 1.5s infinite' }}>?</span>
        </div>
        <div style={{ display: 'flex', gap: '18px', justifyContent: 'center' }}>
          {round.options.map((opt, i) => {
            const cols = ['#6366f1','#ec4899','#10b981'];
            return (
              <button key={i} onClick={() => handleSelect(opt, round.correctOption)}
                style={{ padding: '20px 44px', borderRadius: '12px', fontSize: '2rem', fontWeight: 800,
                  background: `linear-gradient(135deg,${cols[i]},${cols[i]}aa)`,
                  border: `2px solid ${cols[i]}`, color: '#fff', cursor: 'pointer',
                  boxShadow: `0 6px 20px ${cols[i]}55`, transition: 'all 0.25s', transform: 'translateY(-2px)' }}>{opt}</button>
            );
          })}
        </div>
      </div>
    );

    /* ─── 5: EXPANSION PUZZLE ─── */
    if (t === 'expansion_puzzle') return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        {/* Equation display */}
        <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius: '16px', padding: '20px 28px', marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', border: '1.5px solid #6366f155' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fbbf24' }}>{round.displayNumber}</span>
          <span style={{ fontSize: '2rem', color: '#ffffff88' }}>=</span>
          {round.correctParts.map((_, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                minWidth: '90px', height: '56px', background: collected[i] ? `linear-gradient(135deg,${round.chipColors[round.chips.indexOf(collected[i])]||'#10b981'},#059669)` : '#ffffff11',
                border: `2px ${collected[i] ? 'solid #22c55e' : 'dashed #ffffff44'}`,
                borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', fontWeight: 800, color: '#fff', transition: 'all 0.3s',
                boxShadow: collected[i] ? '0 0 16px #22c55e44' : 'none'
              }}>{collected[i] || '?'}</span>
              {i < round.correctParts.length - 1 && <span style={{ fontSize: '1.8rem', color: '#ffffff66' }}>+</span>}
            </span>
          ))}
        </div>
        {/* Chip buttons */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {round.chips.map((chip, i) => {
            const placed = collected.includes(chip);
            return (
              <button key={i} onClick={() => handleChipClick(chip)} disabled={placed}
                style={{ padding: '18px 30px', borderRadius: '12px', fontSize: '1.7rem', fontWeight: 800,
                  background: placed ? '#ffffff0a' : `linear-gradient(135deg,${round.chipColors[i]},${round.chipColors[i]}bb)`,
                  border: `2px solid ${placed ? '#ffffff11' : round.chipColors[i]}`,
                  color: placed ? '#ffffff22' : '#fff', cursor: placed ? 'default' : 'pointer',
                  boxShadow: placed ? 'none' : `0 6px 18px ${round.chipColors[i]}55`, transition: 'all 0.25s',
                  transform: placed ? 'none' : 'translateY(-2px)' }}>{chip}</button>
            );
          })}
        </div>
      </div>
    );

    /* ─── 7: DIGIT DECODER ─── */
    if (t === 'digit_decoder') return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        {/* Number display with colored digit boxes */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          {round.digits.map((d, i) => (
            <div key={i} style={{ width: '64px', height: '80px', background: round.zones[i].color, borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 20px ${round.zones[i].color}77`, border: '2px solid #ffffff33' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>{d}</span>
              <span style={{ fontSize: '0.7rem', color: '#ffffffbb', fontWeight: 600 }}>{round.zones[i].label.slice(0,2).toUpperCase()}</span>
            </div>
          ))}
        </div>

        {/* Chips */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          {round.chips.map((chip, i) => {
            const placed = Object.values(matchState).includes(chip);
            return (
              <button key={i} onClick={() => handleDecoderChip(chip)} disabled={placed}
                style={{ padding: '14px 26px', borderRadius: '10px', fontSize: '1.6rem', fontWeight: 800,
                  background: placed ? '#ffffff08' : selectedOption === chip ? '#fff' : `linear-gradient(135deg,${round.chipColors[i]},${round.chipColors[i]}cc)`,
                  border: `2.5px solid ${placed ? '#ffffff11' : selectedOption === chip ? '#fbbf24' : round.chipColors[i]}`,
                  color: placed ? '#ffffff1a' : selectedOption === chip ? '#1a1a2e' : '#fff', cursor: placed ? 'default' : 'pointer',
                  boxShadow: selectedOption === chip ? '0 0 20px #fbbf2477' : 'none', transition: 'all 0.25s' }}>{chip}</button>
            );
          })}
        </div>

        {/* Zone drop targets */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {round.zones.map((zone, i) => {
            const filled = matchState[zone.label];
            return (
              <button key={i} onClick={() => handleDecoderZone(zone)}
                disabled={!!filled || !selectedOption}
                style={{ minWidth: '120px', padding: '18px 16px', borderRadius: '14px', fontSize: '1.3rem', fontWeight: 800, textAlign: 'center',
                  background: filled ? `linear-gradient(135deg,${zone.color},${zone.color}aa)` : '#ffffff0a',
                  border: `2.5px solid ${filled ? zone.color : '#ffffff22'}`,
                  color: '#fff', cursor: (!!filled || !selectedOption) ? 'default' : 'pointer',
                  boxShadow: filled ? `0 0 18px ${zone.color}55` : selectedOption ? `0 0 12px ${zone.color}33` : 'none', transition: 'all 0.3s' }}>
                  <div style={{ fontSize: '1.1rem', color: filled ? '#ffffffdd' : '#ffffff88', marginBottom: '4px' }}>{zone.label}</div>
                  <div style={{ fontSize: '1.8rem' }}>{filled || '—'}</div>
              </button>
            );
          })}
        </div>
      </div>
    );

    /* ─── 10: BALANCE SCALE ─── */
    if (t === 'number_scale') return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <p style={{ color: '#a5f3fc', fontSize: '1.3rem', marginBottom: '8px' }}>Click the heavier side!</p>
        {/* Scale beam */}
        <div style={{ position: 'relative', height: '20px', background: 'linear-gradient(90deg,transparent,#fbbf24,transparent)', borderRadius: '10px', maxWidth: '500px', margin: '0 auto 8px' }} />
        {/* Pans */}
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
          {[
            { num: round.numA, hint: round.hintA },
            { num: round.numB, hint: round.hintB }
          ].map((pan, i) => {
            const chosen = selectedOption === pan.num;
            const isAnswer = pan.num === round.answer;
            const panColors = ['#6366f1','#ec4899'];
            return (
              <button key={i} onClick={() => handleSelect(pan.num, round.answer)}
                style={{ width: '200px', padding: '28px 20px', borderRadius: '20px', fontSize: '2.8rem', fontWeight: 900,
                  background: chosen ? (isAnswer ? 'linear-gradient(135deg,#14532d,#166534)' : 'linear-gradient(135deg,#7f1d1d,#991b1b)') : `linear-gradient(135deg,${panColors[i]},${panColors[i]}aa)`,
                  border: `3px solid ${chosen ? (isAnswer ? '#22c55e' : '#ef4444') : panColors[i]}`,
                  color: '#fff', cursor: 'pointer', transition: 'all 0.3s',
                  boxShadow: `0 8px 28px ${panColors[i]}55`,
                  transform: chosen ? (isAnswer ? 'translateY(10px) scale(1.05)' : 'none') : (i === 0 ? 'rotate(-3deg)' : 'rotate(3deg)') }}>
                  <div>{pan.num}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#ffffffaa', marginTop: '8px', lineHeight: '1.4' }}>{pan.hint}</div>
              </button>
            );
          })}
        </div>
      </div>
    );

    /* ─── 12: SELECTOR EXPANDED ─── */
    if (t === 'selector_expanded') return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', padding: '16px 40px', borderRadius: '16px', fontSize: '2.8rem', fontWeight: 900, color: '#fff', marginBottom: '28px', boxShadow: '0 6px 24px #a855f755' }}>
          {round.displayNumber}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          {round.options.map((opt, i) => {
            const cols = ['#6366f1','#10b981','#f59e0b','#ef4444'];
            const isSelected = selectedOption === opt;
            return (
              <button key={i} onClick={() => handleSelect(opt, round.answer)}
                style={{ width: '100%', maxWidth: '480px', padding: '18px 32px', borderRadius: '12px', fontSize: '1.4rem', fontWeight: 700,
                  background: isSelected ? `linear-gradient(135deg,${cols[i]},${cols[i]}cc)` : '#ffffff0a',
                  border: `2px solid ${isSelected ? cols[i] : '#ffffff22'}`,
                  color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.25s',
                  boxShadow: isSelected ? `0 4px 16px ${cols[i]}55` : 'none' }}>{opt}</button>
            );
          })}
        </div>
      </div>
    );

    /* ─── 13: DIGIT SPOTLIGHT ─── */
    if (t === 'digit_spotlight') return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        {/* Number with glowing digit */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
          {round.numberDigits.map((d, i) => (
            <div key={i} style={{
              width: '72px', height: '90px', background: d.glow ? 'linear-gradient(135deg,#92400e,#d97706)' : '#ffffff0f',
              borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem', fontWeight: 900, color: d.glow ? '#fff' : '#ffffff66',
              border: `3px solid ${d.glow ? '#fbbf24' : '#ffffff18'}`,
              boxShadow: d.glow ? '0 0 30px #fbbf24aa, 0 0 60px #fbbf2444' : 'none',
              animation: d.glow ? 'pulse 1.5s infinite' : 'none', transform: d.glow ? 'scale(1.12)' : 'none', transition: 'all 0.3s'
            }}>{d.digit}</div>
          ))}
        </div>
        <p style={{ color: '#6ee7b7', fontSize: '1.3rem', marginBottom: '20px', fontWeight: 600 }}>{round.hint}</p>
        <NumpadUI />
      </div>
    );

    /* ─── 15: NUMBER FUSION ─── */
    if (t === 'number_fusion') return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        {/* Building number display */}
        <div style={{ background: 'linear-gradient(135deg,#0f0f1a,#1a1a2e)', borderRadius: '20px', padding: '20px 40px', marginBottom: '28px', border: '2px solid #fbbf2444' }}>
          <p style={{ color: '#ffffff66', fontSize: '1.1rem', marginBottom: '6px' }}>Fusing into standard form…</p>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '4px', minHeight: '60px', transition: 'all 0.4s' }}>
            {collected.length > 0
              ? collected.reduce((sum, v) => sum + parseInt(v), 0).toString().padStart(4,'0').replace(/^0+/,'') || '0'
              : '_ _ _ _'}
          </div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '8px' }}>
            {['Th', 'H', 'T', 'O'].map((lbl, i) => (
              <div key={i} style={{ width: '40px', height: '6px', borderRadius: '4px', background: i < collected.length ? '#22c55e' : '#ffffff22', transition: 'all 0.3s', boxShadow: i < collected.length ? '0 0 8px #22c55e' : 'none' }} />
            ))}
          </div>
        </div>
        {/* Orbs */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {round.orbs.map((orb, i) => {
            const placed = collected.includes(orb.value);
            return (
              <button key={i} onClick={() => handleFusionOrb(orb)} disabled={placed}
                style={{ padding: '24px 32px', borderRadius: '50%', fontSize: '1.5rem', fontWeight: 900, textAlign: 'center',
                  background: placed ? '#ffffff08' : `radial-gradient(circle,${orb.color},${orb.color}bb)`,
                  border: `3px solid ${placed ? '#ffffff11' : orb.color}`,
                  color: placed ? '#ffffff22' : '#fff', cursor: placed ? 'default' : 'pointer',
                  boxShadow: placed ? 'none' : `0 0 24px ${orb.shadow}, 0 8px 20px ${orb.color}66`,
                  transition: 'all 0.4s', transform: placed ? 'scale(0.7)' : 'scale(1)',
                  minWidth: '110px' }}>
                  <div style={{ fontSize: '1.8rem' }}>{placed ? '✓' : orb.value}</div>
                  <div style={{ fontSize: '0.85rem', color: placed ? '#ffffff22' : '#ffffffcc', marginTop: '4px' }}>{orb.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    );

    return null;
  };

  /* ══════════════════════════════════════════════════════
     MAIN RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <div className="simulate-phase">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '18px', width: '100%', maxWidth: '900px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>{round.title}</h2>
        <p style={{ color: '#fbbf24', fontSize: '1.3rem', fontWeight: 600, margin: 0 }}>{round.instruction}</p>
        <div style={{ marginTop: '12px', background: '#ffffff14', borderRadius: '20px', height: '8px', maxWidth: '600px', margin: '12px auto 0' }}>
          <div style={{ height: '8px', borderRadius: '20px', background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', width: `${((currentRound+1)/SCENARIOS.length)*100}%`, transition: 'width 0.5s', boxShadow: '0 0 10px #fbbf2466' }} />
        </div>
        <p style={{ color: '#ffffff55', fontSize: '0.95rem', marginTop: '5px' }}>Scenario {currentRound+1} of {SCENARIOS.length}</p>
      </div>

      {/* Card */}
      <div className={`glass-card ${feedback === 'wrong' ? 'shake' : ''}`}
        style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '380px', padding: '32px', position: 'relative' }}>
        {renderInteraction()}
      </div>

      {/* Feedback Overlay */}
      {feedback && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#00000099', zIndex: 999, animation: 'fadeIn 0.2s' }}>
          <div style={{
            background: feedback === 'correct' ? 'linear-gradient(135deg,#14532d,#166534)' : 'linear-gradient(135deg,#7f1d1d,#991b1b)',
            border: `3px solid ${feedback === 'correct' ? '#22c55e' : '#ef4444'}`,
            borderRadius: '28px', padding: '48px 64px', textAlign: 'center', animation: 'popIn 0.3s',
            boxShadow: `0 0 60px ${feedback === 'correct' ? '#22c55e55' : '#ef444455'}`
          }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '12px' }}>{feedback === 'correct' ? '🌟' : '💡'}</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff' }}>{feedback === 'correct' ? 'Awesome job!' : 'Oops! Try Again!'}</div>
            <div style={{ fontSize: '1.3rem', color: '#ffffff99', marginTop: '8px' }}>{feedback === 'correct' ? 'Brilliant! Moving on…' : 'You can do it!'}</div>
          </div>
        </div>
      )}
    </div>
  );
}
