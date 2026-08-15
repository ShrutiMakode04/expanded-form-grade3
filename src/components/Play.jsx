import { useState, useEffect } from 'react';
import { playTTS, preloadTTS } from '../utils/elevenlabs';

// Helper to shuffle an array
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Helpers for math operations
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// World Configurations
const WORLDS = [
  { 
    id: 0, name: "Number Pizza Chef", icon: "🍕", desc: "Build the perfect number pizza", color: "#ef4444",
    names: ['Thousand Cheese', 'Hundred Olives', 'Ten Mushrooms', 'One Pepperoni'],
    item: 'Pizza'
  },
  { 
    id: 1, name: "Monster Number Builder", icon: "🍎", desc: "Feed the hungry monster", color: "#8b5cf6",
    names: ['thousand berries', 'hundred apples', 'ten bananas', 'cherries'],
    item: 'Meal'
  },
  { 
    id: 2, name: "Castle Brick Builder", icon: "🧱", desc: "Construct the strongest castle", color: "#eab308",
    names: ['giant bricks', 'medium bricks', 'small bricks', 'tiny bricks'],
    item: 'Castle'
  },
  { 
    id: 3, name: "Ultimate Challenge", icon: "🏆", desc: "Test your skills with 10 unique hard questions!", color: "#10b981",
    names: ['Thousands', 'Hundreds', 'Tens', 'Ones'],
    item: 'Challenge'
  }
];

// Generator for 10 Levels of a World
const generateWorldQuestions = (world) => {
  if (world.id === 3) {
    return [
      {
        uiType: 'mcq',
        text: 'Level 1: The Great Expansion',
        instruction: 'Which shows 4,821 in expanded form?',
        number: '4,821',
        options: shuffle(['4000 + 800 + 20 + 1', '400 + 80 + 2 + 1', '4000 + 80 + 20 + 1', '40 + 800 + 20 + 1']),
        answer: '4000 + 800 + 20 + 1'
      },
      {
        uiType: 'input',
        text: 'Level 2: The Missing Link',
        instruction: 'Type the missing number to complete the expanded form.',
        number: '7,493 = 7000 + ? + 90 + 3',
        answer: '400'
      },
      {
        uiType: 'boolean',
        text: 'Level 3: True or False?',
        instruction: 'Is this statement correct?',
        number: '5000 + 60 + 2 = 5,602',
        options: ['Correct', 'Wrong'],
        answer: 'Wrong'
      },
      {
        uiType: 'collector',
        text: 'Level 4: Treasure Hunter',
        instruction: 'Click the parts that make 8,056.',
        number: 'Target: 8,056',
        correctParts: ['8000', '50', '6'],
        options: shuffle(['8000', '50', '6', '500', '800'])
      },
      {
        uiType: 'mcq',
        text: 'Level 5: Word to Number',
        instruction: 'What is "Six thousand, two hundred forty-five"?',
        number: '',
        options: shuffle(['6245', '60245', '62045', '6425']),
        answer: '6245'
      },
      {
        uiType: 'input',
        text: 'Level 6: Standard Squish',
        instruction: 'Squish these together into standard form.',
        number: '9000 + 300 + 7',
        answer: '9307'
      },
      {
        uiType: 'boolean',
        text: 'Level 7: Value Check',
        instruction: 'Does the 4 in 3,492 stand for 400?',
        number: '3,492',
        options: ['Yes', 'No'],
        answer: 'Yes'
      },
      {
        uiType: 'mcq',
        text: 'Level 8: Which is Largest?',
        instruction: 'Choose the largest number.',
        number: '',
        options: shuffle(['3000 + 900 + 90', '4000 + 10 + 1', '3999', '3000 + 800 + 90 + 9']),
        answer: '4000 + 10 + 1'
      },
      {
        uiType: 'input',
        text: 'Level 9: The Tricky Zero',
        instruction: 'Write the standard form.',
        number: '2000 + 80 + 4',
        answer: '2084'
      },
      {
        uiType: 'collector',
        text: 'Level 10: Final Boss',
        instruction: 'Click the parts that make 9,909.',
        number: 'Target: 9,909',
        correctParts: ['9000', '900', '9'],
        options: shuffle(['9000', '900', '90', '9', '90000'])
      }
    ];
  }

  const [thN, hN, tN, oN] = world.names;
  const questions = [];

  // Level 1: Build the Item (Collector)
  const l1_th = rand(1,9), l1_h = rand(1,9), l1_t = rand(1,9), l1_o = rand(1,9);
  const l1_correct = [`${l1_th} ${thN}`, `${l1_h} ${hN}`, `${l1_t} ${tN}`, `${l1_o} ${oN}`];
  const l1_distractors = [`${rand(1,9)} ${thN}`, `${rand(1,9)} ${hN}`];
  questions.push({
    uiType: 'collector',
    text: `Level 1: Build the ${world.item}`,
    instruction: `Click on ALL the correct parts that make up the target number!`,
    number: `Target: ${l1_th*1000 + l1_h*100 + l1_t*10 + l1_o}`,
    correctParts: l1_correct,
    options: shuffle([...l1_correct, ...l1_distractors])
  });

  // Level 2: Missing Item (Input Hundreds)
  const l2_th = rand(1,9), l2_h = rand(1,9), l2_t = rand(1,9), l2_o = rand(1,9);
  questions.push({
    uiType: 'input',
    text: `Level 2: Missing ${hN.split(' ')[1] || 'Hundreds'}`,
    instruction: `Type the missing hundreds digit using the number pad!`,
    number: `Target: ${l2_th},${l2_h}${l2_t}${l2_o} \n ${l2_th} ${thN} \n ? ${hN} \n ${l2_t} ${tN} \n ${l2_o} ${oN}`,
    answer: `${l2_h}`
  });

  // Level 3: Read the Recipe (Input Standard)
  const l3_th = rand(1,9), l3_h = rand(1,9), l3_t = rand(1,9), l3_o = rand(1,9);
  questions.push({
    uiType: 'input',
    text: `Level 3: Read the Recipe`,
    instruction: `Squish the parts together! Type the final standard number.`,
    number: `${l3_th} ${thN} \n ${l3_h} ${hN} \n ${l3_t} ${tN} \n ${l3_o} ${oN}`,
    answer: `${l3_th*1000 + l3_h*100 + l3_t*10 + l3_o}`
  });

  // Level 4: Mistake Check (Boolean)
  const l4_th = rand(1,9), l4_h = rand(1,9), l4_t = rand(1,9), l4_o = rand(1,9);
  const l4_isCorrect = Math.random() > 0.5;
  const l4_displayNum = l4_isCorrect ? (l4_th*1000 + l4_h*100 + l4_t*10 + l4_o) : (l4_th*1000 + rand(1,9)*100 + l4_t*10 + l4_o);
  questions.push({
    uiType: 'boolean',
    text: `Level 4: Quality Check`,
    number: `Built: \n ${l4_th} ${thN} \n ${l4_h} ${hN} \n ${l4_t} ${tN} \n ${l4_o} ${oN} \n\n Display says: ${l4_displayNum}`,
    options: ['Correct', 'Wrong'],
    answer: l4_isCorrect ? 'Correct' : 'Wrong'
  });

  // Level 5: Broken Counter (Input)
  const l5_th = rand(1,9), l5_h = rand(1,9), l5_t = rand(1,9), l5_o = rand(1,9);
  questions.push({
    uiType: 'input',
    text: `Level 5: Broken Display`,
    instruction: `Type the missing tens digit to fix the display!`,
    number: `Display: ${l5_th},${l5_h}?${l5_o} \n ${l5_th} ${thN} \n ${l5_h} ${hN} \n ${l5_t} ${tN} \n ${l5_o} ${oN}`,
    answer: `${l5_t}`
  });

  // Level 6: Bigger Race (MCQ)
  const l6_base = rand(1,9)*1000 + rand(1,9)*100;
  const l6_numA = l6_base + rand(5,9)*10 + rand(1,9);
  const l6_numB = l6_base + rand(1,4)*10 + rand(1,9);
  questions.push({
    uiType: 'mcq',
    text: `Level 6: ${world.item} Race - Choose Bigger!`,
    number: '',
    options: shuffle([`${l6_numA}`, `${l6_numB}`]),
    answer: `${l6_numA}`
  });

  // Level 7: Hidden Order (Input Hundreds)
  const l7_th = rand(1,9), l7_h = rand(1,9), l7_t = rand(1,9), l7_o = rand(1,9);
  questions.push({
    uiType: 'input',
    text: `Level 7: Secret ${world.item}`,
    instruction: `Type the hidden hundreds digit!`,
    number: `Target: ${l7_th*1000 + l7_h*100 + l7_t*10 + l7_o} \n Visible: \n ${l7_th} ${thN} \n ? ${hN} \n ${l7_t} ${tN} \n ${l7_o} ${oN}`,
    answer: `${l7_h}`
  });

  // Level 8: Zero Challenge (Collector)
  const l8_th = rand(1,9), l8_h = rand(1,9), l8_o = rand(1,9);
  const l8_correct = [`${l8_th} ${thN}`, `${l8_h} ${hN}`, `${l8_o} ${oN}`];
  const l8_distractors = [`0 ${tN}`, `${rand(1,9)} ${tN}`, `${rand(1,9)} ${hN}`];
  questions.push({
    uiType: 'collector',
    text: `Level 8: Zero Challenge`,
    instruction: `Careful! This number has a zero. Click ONLY the parts you need!`,
    number: `Target: ${l8_th*1000 + l8_h*100 + 0 + l8_o}`,
    correctParts: l8_correct,
    options: shuffle([...l8_correct, ...l8_distractors])
  });

  // Level 9: Delivery Match (MCQ)
  const l9_th = rand(1,9), l9_h = rand(1,9), l9_t = rand(1,9), l9_o = rand(1,9);
  const correctNum = l9_th*1000 + l9_h*100 + l9_t*10 + l9_o;
  questions.push({
    uiType: 'mcq',
    text: `Level 9: Delivery Match`,
    number: `Recipe: \n ${l9_th} ${thN} \n ${l9_h} ${hN} \n ${l9_t} ${tN} \n ${l9_o} ${oN}`,
    options: shuffle([`${correctNum}`, `${l9_th*1000 + l9_t*100 + l9_h*10 + l9_o}`, `${l9_h*1000 + l9_th*100 + l9_t*10 + l9_o}`]),
    answer: `${correctNum}`
  });

  // Level 10: Mega Builder (Input)
  const l10_th = rand(1,9), l10_h = rand(1,9), l10_t = rand(1,9), l10_o = rand(1,9);
  questions.push({
    uiType: 'input',
    text: `Level 10: Mega ${world.item} Challenge`,
    instruction: `Type the final standard number!`,
    number: `${l10_th*1000} + ${l10_h*100} + ${l10_t*10} + ${l10_o} = `,
    answer: `${l10_th*1000 + l10_h*100 + l10_t*10 + l10_o}`
  });

  return questions;
};


export default function Play({ onNext }) {
  const [view, setView] = useState('map'); // map, play, complete
  const [unlockedLevel, setUnlockedLevel] = useState(() => {
    const saved = localStorage.getItem('playUnlockedLevel');
    return saved !== null ? parseInt(saved, 10) : 0; // Starts at 0 (Card 1)
  });
  const [currentLevel, setCurrentLevel] = useState(null);
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  
  // Specific UI States
  const [inputValue, setInputValue] = useState('');
  const [collectedParts, setCollectedParts] = useState([]);
  const [QUESTIONS, setQUESTIONS] = useState([]);

  useEffect(() => {
    // Preload only first two worlds to save bandwidth/loading time
    preloadTTS(`Welcome to ${WORLDS[0].name}!`);
    if (WORLDS.length > 1) {
      preloadTTS(`Welcome to ${WORLDS[1].name}!`);
    }
  }, []);

  const question = QUESTIONS[currentQIndex];

  useEffect(() => {
    if (view === 'map') {
      playTTS("Welcome to the Play Phase! Choose a level to begin.");
    }
  }, [view]);

  const startLevel = (world) => {
    setCurrentLevel(world.id);
    setQUESTIONS(generateWorldQuestions(world));
    setCurrentQIndex(0);
    setScore(0);
    setIsCorrect(null);
    setSelectedAnswer(null);
    setInputValue('');
    setCollectedParts([]);
    setView('play');
    
    // Play intro voice dynamically based on the world
    playTTS(`Welcome to ${world.name}!`);
  };

  useEffect(() => {
    // Reset specific states when question changes
    setInputValue('');
    setCollectedParts([]);
  }, [currentQIndex, question]);

  // Handle Collector Logic
  useEffect(() => {
    if (question && question.uiType === 'collector') {
      const allCorrectFound = question.correctParts.every(p => collectedParts.includes(p));
      const hasWrong = collectedParts.some(p => !question.correctParts.includes(p));
      
      if (allCorrectFound && !hasWrong) {
        setIsCorrect(true);
        setScore(s => s + 1);
        playTTS("Awesome job!");
        setTimeout(handleNextQuestion, 1500);
      } else if (hasWrong) {
        setIsCorrect(false);
        playTTS("Oops! Try again!");
        setTimeout(() => {
          setCollectedParts([]);
          setIsCorrect(null);
        }, 1000);
      }
    }
  }, [collectedParts]);


  const handleBasicSelect = (option) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(option);
    if (option === question.answer) {
      setIsCorrect(true);
      setScore(s => s + 1);
      playTTS("Awesome job!");
      setTimeout(handleNextQuestion, 1500);
    } else {
      setIsCorrect(false);
      playTTS("Nice try!");
      setTimeout(handleNextQuestion, 2000);
    }
  };

  const handleInputSubmit = () => {
    if (isCorrect !== null) return;
    
    if (inputValue === question.answer) {
      setIsCorrect(true);
      setScore(s => s + 1);
      playTTS("Awesome job!");
      setTimeout(handleNextQuestion, 1500);
    } else {
      setIsCorrect(false);
      playTTS("Nice try!");
      setTimeout(handleNextQuestion, 2000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setInputValue('');
      setCollectedParts([]);
    } else {
      setView('complete');
      playTTS("Level Complete! You earned three stars!");
      if (currentLevel >= unlockedLevel) {
        const newLevel = currentLevel + 1;
        setUnlockedLevel(newLevel);
        localStorage.setItem('playUnlockedLevel', newLevel);
      }
    }
  };

  if (view === 'map') {
    return (
      <div className="play-phase" style={{ overflowY: 'auto' }}>
        <div className="play-header" style={{ marginBottom: '16px' }}>
          <h2 className="play-title">Choose a World</h2>
          <p className="play-subtitle">Complete worlds to unlock new challenges!</p>
        </div>
        <div className="world-map" style={{ paddingBottom: '40px' }}>
          {WORLDS.map(world => {
            const isLocked = world.id > unlockedLevel;
            return (
              <div 
                key={world.id} 
                className={`world-card ${isLocked ? 'locked' : 'unlocked'}`}
                style={{ '--world-color': world.color, flexDirection: 'row', justifyContent: 'flex-start' }}
                onClick={() => !isLocked && startLevel(world)}
              >
                {isLocked && <div className="world-lock">🔒</div>}
                <div className="world-icon" style={{ fontSize: '3rem', marginRight: '16px' }}>{world.icon}</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div className="world-name">{world.name}</div>
                  <div className="world-desc">{world.desc}</div>
                  {!isLocked && (
                    <div style={{ marginTop: '8px', fontSize: '0.85rem', color: world.color, fontWeight: 'bold' }}>Play 10 Levels →</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {unlockedLevel >= WORLDS.length && (
          <button className="btn btn-green" onClick={onNext} style={{ marginTop: '24px' }}>
            Finish Play Phase
          </button>
        )}
      </div>
    );
  }

  if (view === 'complete') {
    return (
      <div className="play-phase">
        <div className="world-complete-card">
          <div className="world-complete-icon">🌟</div>
          <h2 className="world-complete-title">{WORLDS[currentLevel].name} Complete!</h2>
          <div className="world-complete-score">{score} / {QUESTIONS.length} Correct</div>
          <div className="world-complete-stars">
            <span className="world-star earned">⭐</span>
            <span className="world-star earned">⭐</span>
            <span className="world-star earned">⭐</span>
          </div>
          <button className="btn btn-primary" onClick={() => setView('map')} style={{ marginTop: '20px' }}>
            Back to Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="play-phase" style={{ overflowY: 'auto' }}>
      <div className="play-header" style={{ marginBottom: '16px' }}>
        <div className="play-world-badge" style={{ background: WORLDS[currentLevel].color, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span>{WORLDS[currentLevel].icon}</span> {WORLDS[currentLevel].name}
        </div>
        <h2 className="play-title" style={{ marginTop: '8px' }}>Level {currentQIndex + 1} of {QUESTIONS.length}</h2>
      </div>

      <div className="question-card" style={{ maxWidth: '700px', marginBottom: '16px', padding: '24px' }}>
        <h3 className="question-text" style={{ whiteSpace: 'pre-line', lineHeight: '1.3', marginBottom: '12px' }}>
          <span style={{ color: 'var(--gold)' }}>{question?.text}</span>
          {question?.instruction && (
            <>
              <br/>
              <span style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#fff' }}>{question.instruction}</span>
            </>
          )}
          {question?.number && (
            <>
              <br/>
              <span style={{ fontSize: '1.2rem' }}>{question.number}</span>
            </>
          )}
        </h3>

        {/* 1. MCQ & Boolean Pattern */}
        {(question?.uiType === 'mcq' || question?.uiType === 'boolean') && (
          <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {(question.options || ['True', 'False']).map((option, idx) => {
              let btnClass = "option-btn";
              if (selectedAnswer === option) {
                btnClass += isCorrect ? " correct" : " wrong";
              } else if (selectedAnswer !== null && option === question.answer) {
                btnClass += " correct";
              } else if (selectedAnswer !== null) {
                btnClass += " disabled";
              }
              return (
                <button key={idx} className={btnClass} onClick={() => handleBasicSelect(option)} style={{ padding: '12px' }}>
                  {option}
                </button>
              )
            })}
          </div>
        )}

        {/* 2. Input Pattern */}
        {question?.uiType === 'input' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="sentence-row" style={{ justifyContent: 'center', margin: '8px 0 16px' }}>
              <div className={`blank-input ${inputValue ? 'filled' : ''} ${isCorrect ? 'correct' : ''}`} style={{ width: 'auto', minWidth: '80px', padding: '0 16px', height: '45px', fontSize: '1.5rem' }}>
                {inputValue}
              </div>
            </div>
            <div className="number-pad" style={{ gridTemplateColumns: 'repeat(6, 1fr)', maxWidth: '400px', margin: '0 auto', gap: '8px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'DEL', 0, 'GO'].map((btn) => (
                <button
                  key={btn}
                  className={`num-pad-btn ${btn === 'GO' ? 'btn-primary' : ''}`}
                  style={{ border: btn === 'GO' ? 'none' : '' }}
                  onClick={() => {
                    if (isCorrect !== null) return;
                    if (btn === 'DEL') setInputValue(prev => prev.slice(0, -1));
                    else if (btn === 'GO') handleInputSubmit();
                    else if (inputValue.length < 5) setInputValue(prev => prev + btn);
                  }}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Collector Pattern */}
        {question?.uiType === 'collector' && (
          <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {question.options.map((part, idx) => {
              const isSelected = collectedParts.includes(part);
              const isWrong = isSelected && !question.correctParts.includes(part);
              const isCorrectClick = isSelected && question.correctParts.includes(part);
              return (
                <button
                  key={idx}
                  className={`option-btn ${isSelected ? 'selected' : ''} ${isWrong ? 'wrong' : ''} ${isCorrectClick ? 'correct' : ''}`}
                  style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => {
                    if (isCorrect !== null) return;
                    if (!isSelected) setCollectedParts(prev => [...prev, part]);
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{WORLDS[currentLevel].icon}</span> {part}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {isCorrect !== null && question?.uiType !== 'collector' && (
        <div className="feedback-overlay">
          <div className={`feedback-content ${isCorrect ? 'correct' : 'wrong'}`}>
            <div className="feedback-emoji">{isCorrect ? '🌟' : '💡'}</div>
            <div className="feedback-message">{isCorrect ? 'Awesome job!' : 'Nice try!'}</div>
            <div className="feedback-sub">{isCorrect ? '+10 XP' : `The correct answer was ${question.answer}`}</div>
          </div>
        </div>
      )}
      
      {isCorrect === true && question?.uiType === 'collector' && (
        <div className="feedback-overlay">
          <div className="feedback-content correct">
            <div className="feedback-emoji">🌟</div>
            <div className="feedback-message">Perfect Collection!</div>
            <div className="feedback-sub">+10 XP</div>
          </div>
        </div>
      )}
    </div>
  );
}
