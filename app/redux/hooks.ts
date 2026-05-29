"use client";

import { useDispatch, useSelector, useStore } from "react-redux";
import { AppDispatch, RootState, AppStore } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector = <T>(selector: (state: RootState) => T): T => useSelector<RootState, T>(selector);

export const useAppStore = () => useStore<AppStore>();
