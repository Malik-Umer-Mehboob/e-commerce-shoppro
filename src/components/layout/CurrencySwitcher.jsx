import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency } from '../../store/localizationSlice';
import { Banknote } from 'lucide-react';

const CurrencySwitcher = () => {
  const dispatch = useDispatch();
  const { languages, currentCurrency, currencySymbol } = useSelector((state) => state.localization);

  // Extract unique currencies from active languages
  const currencies = Array.from(new Set(languages.map(l => l.currency_code))).map(code => {
    const lang = languages.find(l => l.currency_code === code);
    return {
      code: code,
      symbol: lang.currency_symbol,
      rate: lang.exchange_rate
    };
  });

  const handleCurrencyChange = (curr) => {
    dispatch(setCurrency(curr));
  };

  if (currencies.length <= 1) return null;

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors duration-200 py-2">
        <Banknote size={18} className="text-orange-500" />
        <span className="text-sm font-medium">{currentCurrency} ({currencySymbol})</span>
      </button>
      
      <div className="absolute right-0 top-full mt-1 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
        <div className="py-1">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => handleCurrencyChange(curr)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                currentCurrency === curr.code
                  ? 'bg-orange-500/10 text-orange-500 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{curr.code}</span>
                <span className="text-xs opacity-50">{curr.symbol}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencySwitcher;
