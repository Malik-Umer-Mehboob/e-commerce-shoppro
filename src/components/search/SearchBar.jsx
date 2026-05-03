import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight, Tag } from 'lucide-react';
import { getAutocomplete, clearSuggestions, setQuery } from '../../store/searchSlice';
import AutocompleteOverlay from './AutocompleteOverlay';

const SearchBar = ({ compact = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { suggestions, suggestionsLoading } = useSelector((state) => state.search);
    const [localQuery, setLocalQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const debounceRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                inputRef.current && !inputRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setLocalQuery(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (value.length >= 2) {
            debounceRef.current = setTimeout(() => {
                dispatch(getAutocomplete(value));
                setShowDropdown(true);
            }, 300);
        } else {
            dispatch(clearSuggestions());
            setShowDropdown(false);
        }
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (localQuery.trim()) {
            setShowDropdown(false);
            navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
        }
    };

    const handleSuggestionClick = (product) => {
        setShowDropdown(false);
        setLocalQuery('');
        dispatch(clearSuggestions());
        navigate(`/products/${product.id}`);
    };

    const handleCategoryClick = (category) => {
        setShowDropdown(false);
        setLocalQuery('');
        dispatch(clearSuggestions());
        navigate(`/search?category=${category.id}`);
    };

    const clearInput = () => {
        setLocalQuery('');
        dispatch(clearSuggestions());
        setShowDropdown(false);
        inputRef.current?.focus();
    };

    const highlightMatch = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part) ? <mark key={i} className="bg-orange-200 text-orange-900 rounded-sm px-0.5">{part}</mark> : part
        );
    };

    const hasSuggestions = suggestions.products?.length > 0 || suggestions.categories?.length > 0;

    return (
        <div className={`relative ${compact ? 'w-full' : 'w-full max-w-xl'}`}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/30 transition-all">
                    <Search className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={localQuery}
                        onChange={handleInputChange}
                        onFocus={() => hasSuggestions && setShowDropdown(true)}
                        placeholder="Search products, brands, categories..."
                        className="w-full bg-transparent text-white placeholder-gray-400 px-3 py-2.5 text-sm focus:outline-none"
                        autoComplete="off"
                        id="search-bar-input"
                    />
                    {localQuery && (
                        <button type="button" onClick={clearInput} className="p-2 text-gray-400 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        type="submit"
                        className="bg-[#F97316] hover:bg-[#ea580c] text-white px-4 py-2.5 transition-colors flex-shrink-0"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>
            </form>

            {showDropdown && localQuery.length >= 2 && (
                <div ref={dropdownRef}>
                    <AutocompleteOverlay 
                        results={suggestions} 
                        query={localQuery} 
                        onSelect={(q) => {
                            setLocalQuery(q);
                            dispatch(setQuery(q));
                            dispatch(clearSuggestions());
                            setShowDropdown(false);
                            navigate(`/search?q=${encodeURIComponent(q)}`);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default SearchBar;
