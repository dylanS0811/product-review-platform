import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function Dropdown({ options, selected, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-52" ref={dropdownRef}>
      <button
        type="button" // 🔐 确保不会触发表单提交
        onClick={() => setOpen(!open)}
        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-left shadow-sm text-gray-800 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        {selected} ▾
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-60 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(opt);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer text-sm text-center hover:bg-blue-100 ${
                opt === selected ? 'bg-blue-50 font-semibold text-blue-600' : ''
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
