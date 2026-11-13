import React from 'react';

export default function CleanTextarea({
  value,
  onChange,
  placeholder,
  rows = 10,
  className = '',
  title,
  subtitle,
  badgeText,
  badgeColor = 'bg-stone-100 text-stone-600 border-stone-200',
  actions
}) {
  const wordCount = value ? value.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="flex flex-col bg-white border border-stone-200/80 rounded-2xl p-3 sm:p-4 shadow-xs transition-all">
      {/* Header */}
      {(title || badgeText || actions) && (
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

          <div className="flex items-center space-x-2 flex-shrink-0">
            {actions}
            <span className="text-[10px] font-mono text-stone-400">
              {wordCount} words
            </span>
          </div>
        </div>
      )}

      {subtitle && (
        <p className="text-[11px] text-stone-500 mb-2">
          {subtitle}
        </p>
      )}

      {/* Main Textarea */}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full flex-1 bg-stone-50/40 hover:bg-white focus:bg-white border border-stone-200/80 rounded-xl p-3 text-xs font-mono text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all resize-y leading-relaxed ${className}`}
      />
    </div>
  );
}
