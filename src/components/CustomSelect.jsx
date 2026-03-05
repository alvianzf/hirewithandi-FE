import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

/**
 * CustomSelect — replaces native <select> with a fully styled dropdown.
 * Supports dynamic inline `style` overrides for bg/color (status selects).
 * Uses React Portal to prevent cutoff in overflow: hidden containers (like TableView).
 *
 * Props mirror a native <select>:
 *   value, onChange, options, placeholder, disabled, className, style
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
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, isFlipped: false });

  const selected = options.find((o) => o.value === value);

  const close = useCallback(() => setOpen(false), []);

  const updateCoords = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // Flip up if less than 220px below and more space above
      const flipUp = spaceBelow < 220 && spaceAbove > spaceBelow;

      setCoords({
        top: flipUp ? undefined : rect.bottom + window.scrollY + 6,
        bottom: flipUp ? (window.innerHeight - rect.top - window.scrollY + 6) : undefined,
        left: rect.left + window.scrollX,
        width: rect.width,
        isFlipped: flipUp,
      });
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    updateCoords();

    const handleClick = (e) => {
      // Close if clicking outside both trigger and dropdown
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        close();
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") close();
    };

    // Use capture to catch scroll events on any scrollable parent
    window.addEventListener("scroll", updateCoords, true);
    window.addEventListener("resize", updateCoords);
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, close, updateCoords]);

  const handleSelect = (e, optValue) => {
    e.stopPropagation();
    onChange({ 
      target: { value: optValue },
      stopPropagation: () => e.stopPropagation(),
      preventDefault: () => e.preventDefault(),
    });
    close();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) {
            if (!open) updateCoords();
            setOpen((o) => !o);
          }
        }}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/50 ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-white/[0.15]"
        }`}
        style={style}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 ${open ? (coords.isFlipped ? "" : "rotate-180") : ""}`}
        />
      </button>

      {/* Portal Dropdown */}
      {open && createPortal(
        <div
          ref={dropdownRef}
          className="absolute z-[9999] overflow-hidden rounded-xl border border-white/[0.1] bg-neutral-900/95 shadow-2xl shadow-black/50 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150"
          style={{
            position: 'absolute',
            top: coords.top !== undefined ? `${coords.top}px` : 'auto',
            bottom: coords.bottom !== undefined ? `${coords.bottom}px` : 'auto',
            left: `${coords.left}px`,
            width: `${coords.width}px`,
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={(e) => handleSelect(e, opt.value)}
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
        </div>,
        document.body
      )}
    </div>
  );
}
