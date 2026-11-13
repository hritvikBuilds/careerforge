/**
 * Robust Voice Speech-to-Text Engine with English, Hindi, and Hinglish recognition.
 * Features persistent keep-alive, auto-restart on silent pauses, and Hinglish cleaning.
 */

// Hinglish to professional resume English dictionary
const HINGLISH_DICTIONARY = [
  { regex: /\bmaine kaam kiya\b/gi, replacement: 'I worked' },
  { regex: /\bmaine banaya\b/gi, replacement: 'I built and developed' },
  { regex: /\bteam ko lead kiya\b/gi, replacement: 'led the cross-functional team' },
  { regex: /\bkaam karta tha\b/gi, replacement: 'worked as' },
  { regex: /\bproblem solve kiya\b/gi, replacement: 'resolved technical bottlenecks' },
  { regex: /\bperformance badhaya\b/gi, replacement: 'improved system performance' },
  { regex: /\bdatabase optimize kiya\b/gi, replacement: 'optimized database queries' },
  { regex: /\bbhot saare\b/gi, replacement: 'multiple' },
  { regex: /\baccha result mila\b/gi, replacement: 'achieved strong measurable outcomes' },
  { regex: /\blatency kam kiya\b/gi, replacement: 'reduced response latency' },
  { regex: /\bdeploy kiya\b/gi, replacement: 'deployed to production' },
  { regex: /\bmeri responsibility thi\b/gi, replacement: 'was responsible for' },
  { regex: /\bproject complete kiya\b/gi, replacement: 'successfully delivered the project' },
  { regex: /\bbugs fix kiye\b/gi, replacement: 'resolved critical production bugs' },
  { regex: /\bcode likha\b/gi, replacement: 'wrote scalable code' },
  { regex: /\bscalable banaya\b/gi, replacement: 'scaled the architecture' }
];

export function formatSpeechText(rawText, shouldTranslateHinglish = true) {
  if (!rawText) return '';
  let text = rawText.trim();

  if (shouldTranslateHinglish) {
    HINGLISH_DICTIONARY.forEach(item => {
      text = text.replace(item.regex, item.replacement);
    });
  }

  // Capitalize first character
  text = text.charAt(0).toUpperCase() + text.slice(1);

  // Capitalize after period, question mark, or exclamation mark
  text = text.replace(/([.?!]\s+)([a-z])/g, (match, sep, char) => sep + char.toUpperCase());

  // Clean double spaces
  text = text.replace(/\s{2,}/g, ' ');

  return text;
}

export function isSpeechRecognitionSupported() {
  return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Creates a resilient Speech Controller that DOES NOT close when the user pauses.
 * Uses auto-restart keep-alive when active.
 */
export class PersistentSpeechSession {
  constructor({ language = 'en-IN', onTextUpdate, onStateChange, onError }) {
    this.language = language;
    this.onTextUpdate = onTextUpdate;
    this.onStateChange = onStateChange;
    this.onError = onError;

    this.recognition = null;
    this.isActive = false;
    this.accumulatedFinalText = '';
    this.audioStream = null;
    this.audioContext = null;
    this.analyser = null;
    this.volumeCallback = null;
    this.animFrameId = null;
  }

  setLanguage(lang) {
    this.language = lang;
    if (this.recognition && this.isActive) {
      this.recognition.lang = lang;
    }
  }

  setVolumeListener(cb) {
    this.volumeCallback = cb;
  }

  async start() {
    if (!isSpeechRecognitionSupported()) {
      this.onError && this.onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    this.isActive = true;
    this.accumulatedFinalText = '';
    this.onStateChange && this.onStateChange({ isListening: true, status: 'listening' });

    // Try to acquire mic stream for audio visualizer & keep microphone hardware active
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this._setupAudioAnalyser();
      }
    } catch (e) {
      console.warn('Microphone stream access notice:', e.message);
    }

    this._startRecognition();
  }

  _setupAudioAnalyser() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass || !this.audioStream) return;

      this.audioContext = new AudioContextClass();
      const source = this.audioContext.createMediaStreamSource(this.audioStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const buffer = new Uint8Array(this.analyser.frequencyBinCount);
      const checkVolume = () => {
        if (!this.isActive || !this.analyser) return;
        this.analyser.getByteFrequencyData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) sum += buffer[i];
        const avg = sum / buffer.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        this.volumeCallback && this.volumeCallback(normalized);
        this.animFrameId = requestAnimationFrame(checkVolume);
      };
      this.animFrameId = requestAnimationFrame(checkVolume);
    } catch (err) {
      console.warn('Audio analyser setup skipped:', err);
    }
  }

  _startRecognition() {
    if (!this.isActive) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.language;
    this.recognition.maxAlternatives = 1;

    let localSessionFinal = '';

    this.recognition.onstart = () => {
      if (this.isActive) {
        this.onStateChange && this.onStateChange({ isListening: true, status: 'listening' });
      }
    };

    this.recognition.onresult = (event) => {
      if (!this.isActive) return;

      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          localSessionFinal += (localSessionFinal ? ' ' : '') + transcript;
        } else {
          interim += transcript;
        }
      }

      const totalFinal = this.accumulatedFinalText 
        ? `${this.accumulatedFinalText} ${localSessionFinal}` 
        : localSessionFinal;

      this.onTextUpdate && this.onTextUpdate({
        finalText: totalFinal,
        interimText: interim,
        currentChunk: interim || localSessionFinal
      });
    };

    this.recognition.onerror = (event) => {
      const error = event.error;
      console.log('Speech recognition event:', error);

      // 'no-speech' is a standard pause timeout from Chrome. DO NOT STOP LISTENING!
      if (error === 'no-speech') {
        // Keep active! Will auto-restart in onend
        return;
      }

      if (error === 'aborted') {
        // Normal during restart/abort
        return;
      }

      if (error === 'not-allowed' || error === 'service-not-allowed') {
        this.isActive = false;
        this.onError && this.onError('Microphone permission was denied. Please allow microphone in your browser URL bar.');
        this.stop();
        return;
      }

      // For network errors or other transient issues, notify gently but don't hard crash
      if (error === 'network') {
        console.warn('Speech recognition network glitch; reconnecting...');
      }
    };

    this.recognition.onend = () => {
      // If we are still supposed to be listening (user DID NOT click stop),
      // merge what we got and smoothly restart the recognition!
      if (localSessionFinal) {
        this.accumulatedFinalText = this.accumulatedFinalText
          ? `${this.accumulatedFinalText} ${localSessionFinal}`
          : localSessionFinal;
        localSessionFinal = '';
      }

      if (this.isActive) {
        // Small 150ms debounce before starting the next continuous cycle
        setTimeout(() => {
          if (this.isActive) {
            try {
              this._startRecognition();
            } catch (e) {
              console.warn('Recognition restart notice:', e);
            }
          }
        }, 150);
      } else {
        this.onStateChange && this.onStateChange({ isListening: false, status: 'idle' });
      }
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
    }
  }

  stop() {
    this.isActive = false;

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }

    this.onStateChange && this.onStateChange({ isListening: false, status: 'idle' });
    this.volumeCallback && this.volumeCallback(0);

    return this.accumulatedFinalText;
  }
}
