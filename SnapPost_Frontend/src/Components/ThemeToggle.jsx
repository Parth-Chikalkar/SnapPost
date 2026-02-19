import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../Context/ThemeContext";

const ThemeToggle = () => {
  const { dark, setDark } = useTheme();

  return (
    <button
      onClick={() => setDark(!dark)}
      className={`
        relative flex items-center justify-center
        w-10 h-10 rounded-xl
        transition-all duration-500 ease-in-out
        ${dark 
          ? "bg-zinc-900 text-yellow-400 hover:bg-zinc-800 ring-1 ring-zinc-700" 
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 ring-1 ring-zinc-200"}
        group overflow-hidden
      `}
      aria-label="Toggle theme"
    >
      {/* Icon Container with subtle rotation effect */}
      <div className={`
        transform transition-transform duration-500
        ${dark ? "rotate-[360deg]" : "rotate-0"}
      `}>
        {dark ? (
          <FiSun size={18} className="drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
        ) : (
          <FiMoon size={18} />
        )}
      </div>

      {dark && (
        <span className="absolute inset-0 rounded-xl bg-yellow-400/5 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
};

export default ThemeToggle;