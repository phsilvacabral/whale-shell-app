import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full glass-morphism flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-yellow-300" />
      ) : (
        <Moon size={20} className="text-indigo-600" />
      )}
    </button>
  );
}
