import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";

/**
 * CustomSelect — replaces native <select> with a fully styled dropdown.
 * Supports dynamic inline `style` overrides for bg/color (status selects).
 *
 * Props mirror a native <select>:
 *   value, onChange, options, placeholder, disabled, className, style
 *
 * `options` is an array of { value, label } objects.
 */
export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  disabled = false,
  className = "",
  style = {},
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    const handleKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, close]);

  const handleSelect = (optValue) => {
    // Simulate a native event for drop-in compatibility
    onChange({ target: { value: optValue } });
    close();
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-white/[0.15]"
        }`}
        style={style}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-[200] min-w-full overflow-hidden rounded-xl border border-white/[0.1] bg-neutral-900/95 shadow-2xl shadow-black/50 backdrop-blur-md">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.07] ${
                opt.value === value
                  ? "bg-white/[0.05] font-bold text-yellow-400"
                  : "font-medium text-neutral-300"
              }`}
            >
              <span>{opt.label}</span>
              {opt.value === value && (
                <span className="ml-2 h-1.5 w-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
