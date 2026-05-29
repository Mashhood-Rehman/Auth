import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    image: string | null;
    token: string | null;
    name: string | null;
    email: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    image:  null,
    token: null,
    email: null,
    name: null
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        login: (state, action ) => {
            state.isAuthenticated= true;
            state.image = action.payload.image;
            state.token = action.payload.token;
            state.name = action.payload.name;
            state.email = action.payload.email;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.image = null;
            state.token = null;
            state.name = null;
            state.email = null;
        }
    }
})

export const {login, logout} = authSlice.actions
export default authSlice.reducer