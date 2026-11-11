import { useMemo, useState } from "react";
import { DesktopFrame } from "./components/DesktopFrame";
import { MascotChat } from "./components/MascotChat";
import { PhoneFrame } from "./components/PhoneFrame";
import { ScreenSwitcher } from "./components/ScreenSwitcher";
import { SideNav } from "./components/SideNav";
import { DeviceContext, type Device } from "./device";
import { MascotContext } from "./mascot";
import type { ScreenId } from "./navigation";
import { screens } from "./screens";
import type { MockResult } from "./types/domain";

export default function App() {
  const [current, setCurrent] = useState<ScreenId>("home");
  const [mockResult, setMockResult] = useState<MockResult>("disease");
  const [device, setDevice] = useState<Device>("mobile");
  const [chatOpen, setChatOpen] = useState(false);
  const mascot = useMemo(() => ({ openChat: () => setChatOpen(true) }), []);
  const { Component } = screens.find((s) => s.id === current)!;

  // key resets screen state when switching screen or view, so each visit starts fresh
  const screen = <Component key={`${device}-${current}`} go={setCurrent} mockResult={mockResult} />;
  const chat = <MascotChat open={chatOpen} onClose={() => setChatOpen(false)} go={setCurrent} />;

  return (
    <DeviceContext.Provider value={device}>
      <MascotContext.Provider value={mascot}>
        <div className="flex min-h-full flex-col-reverse items-center justify-center gap-6 sm:flex-row sm:items-start sm:p-8">
          <ScreenSwitcher
            current={current}
            onSelect={setCurrent}
            mockResult={mockResult}
            onMockResult={setMockResult}
            device={device}
            onDevice={setDevice}
          />
          {device === "desktop" ? (
            <DesktopFrame>
              <SideNav active={current} go={setCurrent} />
              <div className="min-w-0 flex-1">{screen}</div>
              {chat}
            </DesktopFrame>
          ) : (
            <div className="h-dvh w-full sm:h-auto sm:w-auto">
              <PhoneFrame>
                {screen}
                {chat}
              </PhoneFrame>
            </div>
          )}
        </div>
      </MascotContext.Provider>
    </DeviceContext.Provider>
  );
}
