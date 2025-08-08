import { useEffect } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Typed hooks for Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Utility to log authentication state
export const debugAuthState = (authState: any, userState: any) => {
  console.group("🔍 Authentication Debug");
  console.log("Auth State:", authState);
  console.log("User State:", userState);
  console.log("Is Authenticated:", authState?.isAuthenticated);
  console.log("User ID:", authState?.user?.id || userState?.id);
  console.log("User Name:", authState?.user?.name || userState?.name);
  console.log("User Email:", authState?.user?.email || userState?.email);
  console.log("Token in localStorage:", localStorage.getItem("token"));
  console.groupEnd();
};

// Hook to use in components to debug auth state
export const useAuthDebug = () => {
  const authState = useAppSelector((state) => state.auth);
  const userState = useAppSelector((state) => state.user);

  useEffect(() => {
    debugAuthState(authState, userState);
  }, [authState, userState]);

  return { authState, userState };
};