import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Settings, RefreshCw, ChevronDown } from 'lucide-react';

export default function Header({ 
  onSelectSample, 
  onReset, 
  onOpenSettings, 
  activePresetId,
  atsScore = 0
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-stone-200/70 bg-white/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-400 p-[1px] shadow-xs flex-shrink-0">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-sky-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-stone-900">
                CareerForge<span className="text-sky-600">.ai</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                ATS {atsScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Clean Controls (Desktop & Mobile) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Quick Demo Presets */}
          <div className="hidden sm:flex items-center space-x-1 bg-stone-100/80 rounded-xl p-0.5 border border-stone-200/80 text-xs">
            <button
              onClick={() => onSelectSample('swe-fullstack')}
              className={`px-2.5 py-1 rounded-lg transition-all text-xs ${
                activePresetId === 'swe-fullstack'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              SWE (Stripe)
            </button>
            <button
              onClick={() => onSelectSample('product-manager')}
              className={`px-2.5 py-1 rounded-lg transition-all text-xs ${
                activePresetId === 'product-manager'
                  ? 'bg-white text-stone-900 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              PM (Notion)
            </button>
          </div>

          {/* Mobile Sample Dropdown */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="px-2 py-1 rounded-lg text-xs font-medium bg-stone-100 border border-stone-200 text-stone-700 flex items-center space-x-1"
            >
              <span>Sample</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {mobileMenuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-stone-200 rounded-xl shadow-lg py-1 z-50 text-xs">
                <button
                  onClick={() => { onSelectSample('swe-fullstack'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-stone-50 font-medium text-stone-800"
                >
                  SWE (Stripe)
                </button>
                <button
                  onClick={() => { onSelectSample('product-manager'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-stone-50 font-medium text-stone-800"
                >
                  PM (Notion)
                </button>
              </div>
            )}
          </div>

          {/* Reset */}
          <button
            onClick={onReset}
            title="Reset to blank inputs"
            className="p-1.5 sm:p-2 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70 border border-stone-200/80 rounded-xl transition-colors flex items-center space-x-1"
          >
            <Settings className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
