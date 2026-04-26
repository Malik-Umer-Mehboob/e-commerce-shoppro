import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const dispatch = useDispatch();
    const { mode } = useSelector((state) => state.theme);

    return (
        <button
            onClick={() => dispatch(toggleTheme())}
            style={{ cursor: 'pointer' }}
            className="
                relative inline-flex items-center justify-center
                w-10 h-10 rounded-full
                bg-white/10 hover:bg-white/20
                transition-all duration-200
                border border-white/20
            "
            title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {mode === 'dark'
                ? <Sun size={18} className="text-yellow-400" />
                : <Moon size={18} className="text-white" />
            }
        </button>
    );
}
