import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
    try {
        const token = localStorage.getItem('shoppro_token');
        const userStr = localStorage.getItem('shoppro_user');
        const user = userStr ? JSON.parse(userStr) : null;

        if (token && user && user.role) {
            return {
                user,
                token,
                role: user.role,
                isAuthenticated: true,
            };
        }
    } catch {
        // corrupted data
    }

    localStorage.removeItem('shoppro_token');
    localStorage.removeItem('shoppro_user');
    return {
        user: null,
        token: null,
        role: null,
        isAuthenticated: false,
    };
};

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;

            if (!user || !token) {
                
                return;
            }

            state.user = user;
            state.token = token;
            state.role = user.role;
            state.isAuthenticated = true;

            // Save to localStorage with clear keys
            try {
                localStorage.setItem('shoppro_token', token);
                localStorage.setItem('shoppro_user', JSON.stringify(user));
            } catch (err) {
                
            }
        },

        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.isAuthenticated = false;

            localStorage.removeItem('shoppro_token');
            localStorage.removeItem('shoppro_user');
        },

        updateUser: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                try {
                    localStorage.setItem(
                        'shoppro_user',
                        JSON.stringify(state.user)
                    );
                } catch {}
            }
        },
    },
});

export const { setCredentials, logoutUser, updateUser } = authSlice.actions;
export default authSlice.reducer;
