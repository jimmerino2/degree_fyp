import { createContext, useContext } from "react";

/** Desktop does everything mobile does, except photos are uploaded instead of taken. */
export type Device = "mobile" | "desktop";

export const DeviceContext = createContext<Device>("mobile");

export const useDevice = () => useContext(DeviceContext);
