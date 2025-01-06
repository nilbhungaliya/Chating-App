import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-4 right-4 p-2 rounded-lg bg-white/10 backdrop-blur-sm 
        hover:bg-white/20 transition-all"
            aria-label="Toggle theme"
        >
            {theme === "light" ? (
                <Moon className="w-5 h-5 text-neutral-800" />
            ) : (
                <Sun className="w-5 h-5 text-white" />
            )}
        </button>
    );
};
