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
  <div className="flex w-full min-w-0 flex-col gap-2">
    <label
      htmlFor={name}
      className="flex items-center gap-2 text-base font-medium text-slate-200"
    >
      {Icon ? (
        <Icon size={18} className="text-emerald-300" aria-hidden="true" />
      ) : null}
      {label}
    </label>
    <div className="relative">
      <input
        id={name}
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min={0}
        step="any"
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-slate-950/45 py-4 pl-4 pr-16 text-lg text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300/60 focus:ring-4 focus:ring-emerald-400/10"
      />
      {unit && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
          {unit}
        </span>
      )}
    </div>
  </div>
);

export default InputField;
