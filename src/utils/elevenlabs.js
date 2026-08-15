import md5 from 'md5';

let audioCache = {};
let preloadedAudio = {};

const getFileName = (text) => {
  return `${md5(text)}.mp3`;
};

export const preloadTTS = (text) => {
  if (!text) return;
  const fileName = getFileName(text);
  if (!preloadedAudio[fileName]) {
    const audio = new Audio(`/audio/${fileName}`);
    audio.preload = 'auto';
    preloadedAudio[fileName] = audio;
  }
};

let isMuted = false;
let currentPlayingFile = null;

export const setMuted = (muted) => {
  isMuted = muted;
  if (muted) {
    stopTTS();
  } else if (currentPlayingFile) {
    // If unmuted and we remember what was playing (e.g. current page), play it again
    playTTS(currentPlayingFile, null, true);
  }
};

export const getMuted = () => isMuted;

export const playTTS = (text, onComplete = null, isReplay = false) => {
  if (!text) return;
  
  if (!isReplay) {
    currentPlayingFile = text; // Store the text/file to replay if unmuted
  }

  if (isMuted) return;

  const fileName = getFileName(text);
  
  Object.values(audioCache).forEach(a => {
    a.pause();
    a.currentTime = 0;
  });

  let audio = preloadedAudio[fileName] || new Audio(`/audio/${fileName}`);
  audioCache[fileName] = audio;
  
  audio.play().catch(e => {
    console.warn("TTS Playback failed (likely due to missing file or autoplay policy):", e);
  });

  if (onComplete) {
    audio.onended = onComplete;
  }
};

export const stopTTS = () => {
  Object.values(audioCache).forEach(a => {
    a.pause();
    a.currentTime = 0;
  });
  Object.values(preloadedAudio).forEach(a => {
    a.pause();
    a.currentTime = 0;
  });
};
