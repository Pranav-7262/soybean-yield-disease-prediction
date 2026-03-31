import React from "react";

const SelectField = ({ label, icon: Icon, name, value, onChange, options }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
      <Icon size={16} /> {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer hover:bg-white/10 hover:border-white/20"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 1rem center",
        backgroundSize: "12px",
        paddingRight: "2.5rem",
      }}
    >
      <option value="" disabled className="bg-slate-900">
        Select {label}
      </option>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-slate-900 text-white"
        >
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
