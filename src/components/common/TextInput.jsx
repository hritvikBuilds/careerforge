import React from 'react';

export default function TextInput({
  value,
  onChange,
  placeholder,
  className = '',
  type = 'text',
  label,
  id
}) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-stone-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white border border-stone-200/90 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 transition-all shadow-xs ${className}`}
      />
    </div>
  );
}
