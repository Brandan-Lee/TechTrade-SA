import { createContext, useContext } from "react";

export const AuthModalScrollContext = createContext(null);

export const useAuthModalScroll = () => useContext(AuthModalScrollContext);
