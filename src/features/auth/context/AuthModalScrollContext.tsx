import { createContext, useContext } from "react";

export const AuthModalScrollContext = createContext<(() => void) | null>(null);

export const useAuthModalScroll = () => useContext(AuthModalScrollContext);
