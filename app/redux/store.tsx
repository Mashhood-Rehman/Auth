import { configureStore } from "@reduxjs/toolkit"
import type { UnknownAction, Dispatch } from "@reduxjs/toolkit"
import { apiSlice } from "./slice/apiSlice"
import authReducer from "./slice/authSlice"

export const makeStore = () => {
    return configureStore({
        reducer: {
            [apiSlice.reducerPath]: apiSlice.reducer,
            auth: authReducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(apiSlice.middleware)
    })
}

export type     AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = Dispatch<UnknownAction>