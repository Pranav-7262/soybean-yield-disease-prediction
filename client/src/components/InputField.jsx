import React from "react";

const InputField = ({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  placeholder,
  unit,
}) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
      <Icon size={16} /> {label}
    </label>
    <div className="relative">
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
      />
      {unit && (
        <span className="absolute right-4 top-3.5 text-xs text-slate-500">
          {unit}
        </span>
      )}
    </div>
  </div>
);

export default InputField;
