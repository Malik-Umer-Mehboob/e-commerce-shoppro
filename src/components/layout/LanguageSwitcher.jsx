import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchLanguages, setLanguage } from '../../store/localizationSlice';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  const { languages, currentLanguage, loading } = useSelector((state) => state.localization);
  const { i18n } = useTranslation();

  useEffect(() => {
    dispatch(fetchLanguages());
  }, []);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang.code);
    dispatch(setLanguage(lang));
    document.documentElement.dir = lang.direction;
    document.documentElement.lang = lang.code;
  };

  if (loading && languages.length === 0) return null;

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors duration-200 py-2">
        <Globe size={18} className="text-orange-500" />
        <span className="uppercase text-sm font-medium">{currentLanguage}</span>
      </button>
      
      <div className="absolute right-0 top-full mt-1 w-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
        <div className="py-1">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                currentLanguage === lang.code
                  ? 'bg-orange-500/10 text-orange-500 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{lang.name}</span>
                <span className="text-[10px] uppercase opacity-50">{lang.code}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
