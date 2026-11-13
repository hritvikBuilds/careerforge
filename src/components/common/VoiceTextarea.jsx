import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Globe, Sparkles, Check, ChevronDown } from 'lucide-react';
import { PersistentSpeechSession, formatSpeechText, isSpeechRecognitionSupported } from '../../services/speechEngine';

export default function VoiceTextarea({
  value,
  onChange,
  placeholder,
  rows = 10,
  className = '',
  title,
  subtitle,
  badgeText,
  badgeColor = 'bg-stone-100 text-stone-600 border-stone-200'
}) {
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState('en-IN'); // en-IN (English/Hinglish) or hi-IN (Hindi)
  const [interimText, setInterimText] = useState('');
  const [volume, setVolume] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [cleanedNotification, setCleanedNotification] = useState(false);

  const textareaRef = useRef(null);
  const sessionRef = useRef(null);
  
  // Cursor position tracking for precise in-place typing
  const cursorPrefixRef = useRef('');
  const cursorSuffixRef = useRef('');
  const insertionStartRef = useRef(0);

  const isSupported = isSpeechRecognitionSupported();

  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.stop();
      }
    };
  }, []);

  // Update cursor position whenever user clicks or keys in the textarea
  const updateCursorPosition = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart ?? (value?.length || 0);
      const end = textareaRef.current.selectionEnd ?? start;
      const currentVal = value || '';
      cursorPrefixRef.current = currentVal.substring(0, start);
      cursorSuffixRef.current = currentVal.substring(end);
      insertionStartRef.current = start;
    }
  };

  const startListening = async () => {
    setErrorMsg('');
    if (!isSupported) {
      setErrorMsg('Web Speech not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Capture exact cursor position right when user starts dictating
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart ?? (value?.length || 0);
      const end = textareaRef.current.selectionEnd ?? start;
      const currentVal = value || '';
      
      // If user hasn't focused or is at 0 in non-empty text, default to appending at end
      if (start === 0 && end === 0 && currentVal.length > 0 && document.activeElement !== textareaRef.current) {
        cursorPrefixRef.current = currentVal;
        cursorSuffixRef.current = '';
        insertionStartRef.current = currentVal.length;
      } else {
        cursorPrefixRef.current = currentVal.substring(0, start);
        cursorSuffixRef.current = currentVal.substring(end);
        insertionStartRef.current = start;
      }
    } else {
      cursorPrefixRef.current = value || '';
      cursorSuffixRef.current = '';
      insertionStartRef.current = (value || '').length;
    }

    const session = new PersistentSpeechSession({
      language: lang,
      onStateChange: ({ isListening: listening }) => {
        setIsListening(listening);
      },
      onTextUpdate: ({ finalText, interimText: interim }) => {
        setInterimText(interim);
        
        const spoken = `${finalText}${interim ? (finalText ? ' ' : '') + interim : ''}`;
        if (!spoken) return;

        const prefix = cursorPrefixRef.current;
        const suffix = cursorSuffixRef.current;
        
        // Add natural spacing around cursor insertion
        const needsLeadSpace = prefix && !prefix.endsWith(' ') && !prefix.endsWith('\n');
        const needsTrailSpace = suffix && !suffix.startsWith(' ') && !suffix.startsWith('\n');
        
        const inserted = `${needsLeadSpace ? ' ' : ''}${spoken}${needsTrailSpace ? ' ' : ''}`;
        const newTotal = `${prefix}${inserted}${suffix}`;
        
        onChange({ target: { value: newTotal } });

        // Keep cursor positioned right after inserted spoken text
        setTimeout(() => {
          if (textareaRef.current) {
            const newPos = prefix.length + inserted.length;
            textareaRef.current.setSelectionRange(newPos, newPos);
          }
        }, 10);
      },
      onError: (err) => {
        setErrorMsg(err);
      }
    });

    session.setVolumeListener((vol) => {
      setVolume(vol);
    });

    sessionRef.current = session;
    await session.start();
  };

  const stopListening = () => {
    if (sessionRef.current) {
      const finalText = sessionRef.current.stop();
      setIsListening(false);
      setInterimText('');
      setVolume(0);

      if (finalText) {
        const polished = formatSpeechText(finalText, true);
        const prefix = cursorPrefixRef.current;
        const suffix = cursorSuffixRef.current;
        const needsLeadSpace = prefix && !prefix.endsWith(' ') && !prefix.endsWith('\n');
        const needsTrailSpace = suffix && !suffix.startsWith(' ') && !suffix.startsWith('\n');
        
        const inserted = `${needsLeadSpace ? ' ' : ''}${polished}${needsTrailSpace ? ' ' : ''}`;
        const newTotal = `${prefix}${inserted}${suffix}`;
        onChange({ target: { value: newTotal } });

        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            const newPos = prefix.length + inserted.length;
            textareaRef.current.setSelectionRange(newPos, newPos);
          }
        }, 15);
      }
    }
  };

  const toggleLanguage = () => {
    const next = lang === 'en-IN' ? 'hi-IN' : 'en-IN';
    setLang(next);
    if (sessionRef.current) {
      sessionRef.current.setLanguage(next);
    }
  };

  const handleCleanAndFormat = () => {
    if (!value) return;
    const formatted = formatSpeechText(value, true);
    onChange({ target: { value: formatted } });
    setCleanedNotification(true);
    setTimeout(() => setCleanedNotification(false), 2000);
  };

  const wordCount = value ? value.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className={`flex flex-col bg-white border rounded-2xl p-3 sm:p-4 shadow-xs transition-all ${
      isListening ? 'border-sky-400 ring-2 ring-sky-100/80 bg-sky-50/15' : 'border-stone-200/80'
    }`}>
      {/* Sleek De-Cluttered Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 gap-2">
        <div className="flex items-center space-x-2 min-w-0">
          {title && (
            <h3 className="font-semibold text-xs text-stone-800 truncate">
              {title}
            </h3>
          )}
          {badgeText && (
            <span className={`text-[10px] font-medium px-2 py-0.2 rounded-full border ${badgeColor} hidden sm:inline-block`}>
              {badgeText}
            </span>
          )}
        </div>

        {/* Minimalist Controls */}
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <span className="text-[10px] font-mono text-stone-400 hidden md:inline">
            {wordCount}w
          </span>

          {/* Language Toggle Pill */}
          <button
            type="button"
            onClick={toggleLanguage}
            title="Switch speech language (English/Hinglish vs Hindi)"
            className="px-2 py-1 rounded-lg text-[10px] font-medium bg-stone-100/90 hover:bg-stone-200/80 text-stone-600 transition-colors"
          >
            {lang === 'en-IN' ? 'EN / Hinglish' : 'हिंदी'}
          </button>

          {/* Quick Polish button (subtle) */}
          {value && (
            <button
              type="button"
              onClick={handleCleanAndFormat}
              title="Polish grammar & Hinglish phrases"
              className="p-1 sm:px-2 sm:py-1 rounded-lg text-[10px] font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors flex items-center space-x-1"
            >
              {cleanedNotification ? (
                <span className="text-emerald-600 font-semibold">Polished!</span>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-stone-400" />
                  <span className="hidden sm:inline">Polish</span>
                </>
              )}
            </button>
          )}

          {/* Minimal Dictate Button */}
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            title={isListening ? 'Click to stop listening' : 'Place cursor anywhere in text and click to speak'}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shadow-xs ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-sky-600 hover:bg-sky-500 text-white'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3 h-3" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-3 h-3" />
                <span>Speak</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subtle Active Banner */}
      {isListening && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-sky-50/90 border border-sky-200 text-xs text-sky-900 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-[11px] font-medium text-stone-700 truncate">
              Typing at cursor ({lang === 'en-IN' ? 'EN/Hinglish' : 'Hindi'}). Speak freely...
            </span>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Minimal soundwave */}
            <div className="flex items-center space-x-0.5 h-3 px-1.5 py-0.5 bg-white rounded border border-sky-200">
              <span className="w-0.5 bg-emerald-500 rounded-full transition-all duration-75" style={{ height: `${Math.max(3, volume * 0.25)}px` }}></span>
              <span className="w-0.5 bg-emerald-500 rounded-full transition-all duration-75" style={{ height: `${Math.max(3, volume * 0.5)}px` }}></span>
              <span className="w-0.5 bg-emerald-500 rounded-full transition-all duration-75" style={{ height: `${Math.max(3, volume * 0.35)}px` }}></span>
            </div>
            <button
              type="button"
              onClick={stopListening}
              className="text-[10px] font-bold text-sky-700 hover:underline"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Textarea with live cursor tracking */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onClick={updateCursorPosition}
        onKeyUp={updateCursorPosition}
        onSelect={updateCursorPosition}
        onFocus={updateCursorPosition}
        placeholder={placeholder}
        rows={rows}
        className={`w-full flex-1 bg-stone-50/40 hover:bg-white focus:bg-white border border-stone-200/80 rounded-xl p-3 text-xs font-mono text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all resize-y leading-relaxed ${className}`}
      />
    </div>
  );
}
