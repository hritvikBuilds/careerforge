import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { PersistentSpeechSession, formatSpeechText, isSpeechRecognitionSupported } from '../../services/speechEngine';

export default function VoiceInput({
  value,
  onChange,
  placeholder,
  className = '',
  type = 'text',
  label,
  id
}) {
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState('en-IN');
  const [interimText, setInterimText] = useState('');
  const [volume, setVolume] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const inputRef = useRef(null);
  const sessionRef = useRef(null);
  const cursorPrefixRef = useRef('');
  const cursorSuffixRef = useRef('');

  const isSupported = isSpeechRecognitionSupported();

  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.stop();
      }
    };
  }, []);

  const updateCursorPosition = () => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart ?? (value?.length || 0);
      const end = inputRef.current.selectionEnd ?? start;
      const currentVal = value || '';
      cursorPrefixRef.current = currentVal.substring(0, start);
      cursorSuffixRef.current = currentVal.substring(end);
    }
  };

  const startListening = async () => {
    setErrorMsg('');
    if (!isSupported) {
      setErrorMsg('Web Speech not supported in this browser.');
      return;
    }

    if (inputRef.current) {
      const start = inputRef.current.selectionStart ?? (value?.length || 0);
      const end = inputRef.current.selectionEnd ?? start;
      const currentVal = value || '';
      if (start === 0 && end === 0 && currentVal.length > 0 && document.activeElement !== inputRef.current) {
        cursorPrefixRef.current = currentVal;
        cursorSuffixRef.current = '';
      } else {
        cursorPrefixRef.current = currentVal.substring(0, start);
        cursorSuffixRef.current = currentVal.substring(end);
      }
    } else {
      cursorPrefixRef.current = value || '';
      cursorSuffixRef.current = '';
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
        const needsLeadSpace = prefix && !prefix.endsWith(' ');
        const needsTrailSpace = suffix && !suffix.startsWith(' ');
        
        const inserted = `${needsLeadSpace ? ' ' : ''}${spoken}${needsTrailSpace ? ' ' : ''}`;
        const newTotal = `${prefix}${inserted}${suffix}`;
        onChange({ target: { value: newTotal } });

        setTimeout(() => {
          if (inputRef.current) {
            const newPos = prefix.length + inserted.length;
            inputRef.current.setSelectionRange(newPos, newPos);
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
        const needsLeadSpace = prefix && !prefix.endsWith(' ');
        const needsTrailSpace = suffix && !suffix.startsWith(' ');
        
        const inserted = `${needsLeadSpace ? ' ' : ''}${polished}${needsTrailSpace ? ' ' : ''}`;
        const newTotal = `${prefix}${inserted}${suffix}`;
        onChange({ target: { value: newTotal } });

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            const newPos = prefix.length + inserted.length;
            inputRef.current.setSelectionRange(newPos, newPos);
          }
        }, 15);
      }
    }
  };

  const toggleLanguage = (e) => {
    e.preventDefault();
    const next = lang === 'en-IN' ? 'hi-IN' : 'en-IN';
    setLang(next);
    if (sessionRef.current) {
      sessionRef.current.setLanguage(next);
    }
  };

  return (
    <div className="w-full space-y-1">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="block text-xs font-semibold text-stone-700">
            {label}
          </label>
        </div>
      )}

      <div className="relative flex items-center">
        <input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onClick={updateCursorPosition}
          onKeyUp={updateCursorPosition}
          onSelect={updateCursorPosition}
          onFocus={updateCursorPosition}
          placeholder={isListening ? 'Speak... (Types at cursor)' : placeholder}
          className={`w-full bg-white border border-stone-200/90 rounded-xl px-3.5 py-2.5 pr-20 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all shadow-xs ${
            isListening ? 'border-sky-400 ring-2 ring-sky-100 bg-sky-50/20' : ''
          } ${className}`}
        />

        {/* Minimal Clean Action Pills */}
        <div className="absolute right-1.5 flex items-center space-x-1">
          <button
            type="button"
            onClick={toggleLanguage}
            title="Toggle speech language"
            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          >
            {lang === 'en-IN' ? 'EN' : 'हिं'}
          </button>

          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            title={isListening ? 'Stop listening' : 'Speak at cursor'}
            className={`p-1.5 rounded-lg text-xs transition-all flex items-center justify-center ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            {isListening ? (
              <MicOff className="w-3.5 h-3.5" />
            ) : (
              <Mic className="w-3.5 h-3.5 text-sky-600" />
            )}
          </button>
        </div>
      </div>

      {isListening && (
        <div className="flex items-center justify-between text-[10px] text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
          <span>Typing at cursor ({lang === 'en-IN' ? 'EN/Hinglish' : 'Hindi'})...</span>
          <button
            type="button"
            onClick={stopListening}
            className="font-bold underline text-sky-700"
          >
            Done
          </button>
        </div>
      )}

      {errorMsg && (
        <p className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
