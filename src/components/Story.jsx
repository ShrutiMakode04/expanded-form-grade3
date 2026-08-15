import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { playTTS, preloadTTS } from '../utils/elevenlabs';

const STORY_SLIDES = [
  {
    image: '/assets/story_slide_1.png',
    title: "The Magic of Numbers",
    text: "Welcome to the Magic Number Classroom! Today we'll discover how big numbers are built.",
    highlight: "Let's explore 4,523!"
  },
  {
    image: '/assets/story_slide_2.png',
    title: "Thousands Block",
    text: "Look at the number 4,523. It starts with 4 THOUSANDS! These are the biggest, heaviest blocks.",
    highlight: "4000"
  },
  {
    image: '/assets/story_slide_3.png',
    title: "Hundreds Squares",
    text: "Next, we have 5 HUNDREDS! These are flat, shiny squares stacked together.",
    highlight: "500"
  },
  {
    image: '/assets/story_slide_4.png',
    title: "Tens and Ones",
    text: "Then come 2 TENS and 3 ONES. Even the smallest pieces are very important!",
    highlight: "20 and 3"
  },
  {
    image: '/assets/story_slide_5.png',
    title: "Expanded Form",
    text: "When we stretch the number out to see all its parts, we call it EXPANDED FORM!",
    highlight: "4000 + 500 + 20 + 3"
  },
  {
    image: '/assets/story_slide_6.png',
    title: "Standard Form",
    text: "And when we squish all the parts back together into one number, it's STANDARD FORM!",
    highlight: "4,523"
  }
];

export default function Story({ onNext }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);

  // Preload ALL images and ALL audio on mount so nothing lags later
  useEffect(() => {
    let loaded = 0;
    const total = STORY_SLIDES.length;

    STORY_SLIDES.forEach((slide) => {
      // Preload audio for every slide upfront
      preloadTTS(slide.text);

      // Preload images
      const img = new Image();
      img.src = slide.image;
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === total) setImagesReady(true);
      };
    });

    // Play first slide right away
    playTTS(STORY_SLIDES[0].text);
  }, []);

  useEffect(() => {
    setRevealed(false);
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < STORY_SLIDES.length - 1) {
      const nextIdx = currentSlide + 1;
      setCurrentSlide(nextIdx);
      playTTS(STORY_SLIDES[nextIdx].text);
    } else {
      onNext();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      const prevIdx = currentSlide - 1;
      setCurrentSlide(prevIdx);
      playTTS(STORY_SLIDES[prevIdx].text);
    }
  };

  return (
    <div className="story-phase" style={{ padding: '40px' }}>
      <div className="story-progress" style={{ maxWidth: '900px' }}>
        <div className="story-progress-label" style={{ fontSize: '1.2rem' }}>Part {currentSlide + 1} of {STORY_SLIDES.length}</div>
        <div className="story-progress-bar" style={{ height: '12px' }}>
          <div className="story-progress-fill" style={{ width: `${((currentSlide + 1) / STORY_SLIDES.length) * 100}%` }}></div>
        </div>
      </div>

      <div className="story-card" style={{ maxWidth: '1000px', display: 'flex', flexDirection: 'row', minHeight: '450px' }}>
        <div className="story-image-section" style={{ flex: '1', minHeight: '450px', borderRight: '1px solid #ffffff1a', position: 'relative', overflow: 'hidden' }}>
          {!imagesReady && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff8', fontSize: '1.2rem' }}>
              Loading...
            </div>
          )}
          <img
            src={STORY_SLIDES[currentSlide].image}
            alt="Story visual"
            className="story-image"
            style={{ objectFit: 'cover', opacity: imagesReady ? 1 : 0, transition: 'opacity 0.4s' }}
          />
          <div className="story-image-overlay" style={{ height: '120px' }}></div>
        </div>

        <div className="story-text-section" style={{ flex: '1.2', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 40px' }}>
          <h2 className="story-title" style={{ fontSize: '2.2rem', marginBottom: '16px' }}>{STORY_SLIDES[currentSlide].title}</h2>

          <div className="story-mascot" style={{ marginBottom: '24px', alignItems: 'flex-start' }}>
            <div className="mascot happy" style={{ width: '60px', height: '60px', fontSize: '2rem', boxShadow: 'none', marginRight: '16px', flexShrink: 0 }}>🦉</div>
            <p className={`story-text ${revealed ? 'revealed' : ''}`} style={{ flex: 1, margin: 0, fontSize: '1.5rem', lineHeight: '1.7' }}>
              {STORY_SLIDES[currentSlide].text}
            </p>
          </div>

          <div className={`story-highlight ${revealed ? 'visible' : ''}`} style={{ alignSelf: 'flex-start', padding: '14px 24px' }}>
            <span className="story-highlight-text" style={{ fontSize: '1.7rem' }}>✨ {STORY_SLIDES[currentSlide].highlight} ✨</span>
          </div>
        </div>
      </div>

      <div className="story-nav" style={{ marginTop: '24px', maxWidth: '1000px' }}>
        <button
          className="btn btn-outline btn-lg"
          onClick={prevSlide}
          style={{ visibility: currentSlide === 0 ? 'hidden' : 'visible' }}
        >
          <ArrowLeft size={22} /> Back
        </button>

        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (
            <div key={i} className={`story-dot ${i === currentSlide ? 'active' : ''} ${i < currentSlide ? 'completed' : ''}`} style={{ width: '14px', height: '14px' }}></div>
          ))}
        </div>

        <button className="btn btn-primary btn-lg" onClick={nextSlide}>
          {currentSlide === STORY_SLIDES.length - 1 ? "Let's Practice!" : 'Next'} <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
}
