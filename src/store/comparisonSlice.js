import { createSlice } from '@reduxjs/toolkit';

const getInitialComparison = () => {
    try {
        const saved = localStorage.getItem('shoppro_comparison');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const comparisonSlice = createSlice({
    name: 'comparison',
    initialState: {
        items: getInitialComparison(),
        loading: false,
        loaded: true,
        error: null
    },
    reducers: {
        addToComparison: (state, action) => {
            const product = action.payload;
            const exists = state.items.find(
                p => p.id === product.id
            );
            if (!exists) {
                if (state.items.length >= 4) {
                    return;
                }
                state.items.push(product);
                localStorage.setItem(
                    'shoppro_comparison',
                    JSON.stringify(state.items)
                );
            }
        },
        removeFromComparison: (state, action) => {
            state.items = state.items.filter(
                p => p.id !== action.payload
            );
            localStorage.setItem(
                'shoppro_comparison',
                JSON.stringify(state.items)
            );
        },
        clearComparison: (state) => {
            state.items = [];
            localStorage.removeItem('shoppro_comparison');
        },
    },
});

export const {
    addToComparison,
    removeFromComparison,
    clearComparison,
} = comparisonSlice.actions;

// Keep fetchComparison for compatibility if needed, but it does nothing now
export const fetchComparison = () => (dispatch) => {};

export default comparisonSlice.reducer;
