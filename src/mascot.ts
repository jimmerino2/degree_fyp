import { createContext, useContext } from "react";

/** Lets any screen open the mascot chat. */
export const MascotContext = createContext<{ openChat: () => void }>({ openChat: () => {} });

export const useMascot = () => useContext(MascotContext);
