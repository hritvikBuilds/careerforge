import React, { useState } from 'react';
import { X, Key, Shield, Sliders, Check, ExternalLink, Cpu } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, config, onSaveConfig }) {
  const [apiKey, setApiKey] = useState(config.geminiApiKey || '');
  const [targetScore, setTargetScore] = useState(config.targetScore || 85);
  const [antiAiStrictness, setAntiAiStrictness] = useState(config.antiAiStrictness || 'strict');
  const [engineMode, setEngineMode] = useState(config.engineMode || 'local');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      geminiApiKey: apiKey.trim(),
      targetScore: Number(targetScore),
      antiAiStrictness,
      engineMode: apiKey.trim() ? engineMode : 'local'
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-stone-900">Engine & Filter Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Engine Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Processing Engine
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEngineMode('local')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  engineMode === 'local'
                    ? 'bg-sky-50 border-sky-300 text-sky-900 ring-1 ring-sky-200'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-xs">
                  <Cpu className="w-4 h-4 text-sky-600" />
                  <span>Local Smart Engine</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  100% Offline, instant, zero latency, no API key needed.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setEngineMode('gemini')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  engineMode === 'gemini'
                    ? 'bg-sky-50 border-sky-300 text-sky-900 ring-1 ring-sky-200'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-bold text-xs">
                  <Key className="w-4 h-4 text-indigo-600" />
                  <span>Google Gemini API</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Cloud LLM generation (requires user API key).
                </p>
              </button>
            </div>
          </div>

          {/* Optional Gemini API Key */}
          {engineMode === 'gemini' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700">
                  Gemini API Key
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-sky-600 hover:underline flex items-center space-x-1"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <p className="text-[11px] text-stone-500">
                Your key is stored only in your local browser localStorage and never transmitted to our backend.
              </p>
            </div>
          )}

          {/* Target ATS Threshold Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Target ATS Match Threshold
              </label>
              <span className="text-xs font-mono font-bold text-emerald-700">
                {targetScore}%
              </span>
            </div>
            <input
              type="range"
              min={75}
              max={98}
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              className="w-full accent-sky-600"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Screening algorithms require &gt;85% to schedule an automatic human recruiter screen.
            </p>
          </div>

          {/* Anti-AI Filtration Strictness */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Anti-AI Bot Bypass Strictness
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAntiAiStrictness('strict')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  antiAiStrictness === 'strict'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                Strict (Zero AI Traces)
              </button>
              <button
                type="button"
                onClick={() => setAntiAiStrictness('balanced')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  antiAiStrictness === 'balanced'
                    ? 'bg-sky-50 border-sky-300 text-sky-800 font-semibold'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                Balanced
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white shadow-xs flex items-center space-x-1.5"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
