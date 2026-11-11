import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App";
import { matchWorkflow } from "../data/workflows";
import { DeviceContext, type Device } from "../device";
import type { MockResult } from "../types/domain";
import { screens } from "./index";

const results: MockResult[] = ["healthy", "disease", "nutrient", "water", "supply", "unsure"];
const devices: Device[] = ["mobile", "desktop"];

describe.each(devices)("screens render without errors (%s)", (device) => {
  it.each(screens)("$label", ({ Component }) => {
    const { container } = render(
      <DeviceContext.Provider value={device}>
        <Component go={() => {}} mockResult="disease" />
      </DeviceContext.Provider>,
    );
    expect(container.querySelector("h1")).toBeInTheDocument();
  });
});

describe("Result screen", () => {
  it.each(results)("mock result %s", (r) => {
    const Result = screens.find((s) => s.id === "result")!.Component;
    render(<Result go={() => {}} mockResult={r} />);
    expect(screen.getByText("First check to do")).toBeInTheDocument();
  });
});

describe("Capture", () => {
  const Capture = screens.find((s) => s.id === "capture")!.Component;

  it("takes photos on mobile", () => {
    render(<Capture go={() => {}} mockResult="disease" />);
    expect(screen.getByRole("button", { name: "Take photo" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Whole plant")).not.toBeInTheDocument();
  });

  it("uploads photos on desktop", () => {
    render(
      <DeviceContext.Provider value="desktop">
        <Capture go={() => {}} mockResult="disease" />
      </DeviceContext.Provider>,
    );
    expect(screen.queryByRole("button", { name: "Take photo" })).not.toBeInTheDocument();
    const submit = screen.getByRole("button", { name: "Check photos" });
    expect(submit).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Use sample photos" }));
    expect(submit).toBeEnabled();
  });
});

describe("matchWorkflow", () => {
  it.each([
    ["start my check", "start-check"],
    ["check sync", "sync-status"],
    ["it rained today", "log-rain"],
    ["why is my plant sick", "report-problem"],
    ["Why is Row 4 flagged?", "explain-warning"],
  ])("%s -> %s", (text, id) => {
    expect(matchWorkflow(text)?.id).toBe(id);
  });

  it("returns nothing for unknown requests", () => {
    expect(matchWorkflow("what's the price of chilli")).toBeUndefined();
  });
});

describe("Mascot chat", () => {
  it("logs rain after confirming and shows it in the event log", async () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: "Chat with Cili" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Log rain today" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));
    await screen.findByText("Done. Rain is logged for all 4 rows.", undefined, { timeout: 3000 });
    fireEvent.click(screen.getByRole("button", { name: "View log" }));
    expect(screen.getByRole("heading", { name: "Log an event" })).toBeInTheDocument();
    expect(screen.getAllByText(/Row 1/).length).toBeGreaterThan(0);
  });

  it("offers the task list when it does not understand", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: "Chat with Cili" })[0]);
    fireEvent.change(screen.getByLabelText("Type a message"), { target: { value: "hello there" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(screen.getByText(/Sorry, I can't do that yet/)).toBeInTheDocument();
  });
});

describe("App", () => {
  it("opens on Home in mobile view", () => {
    render(<App />);
    expect(screen.getByText("Daily check-up")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Mobile" })).toBeChecked();
  });

  it("switches to desktop view with a side nav", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("radio", { name: "Desktop" }));
    expect(screen.getByRole("button", { name: "Sync" })).toBeInTheDocument();
    expect(screen.getByText("Upload photos of your 6 sample plants.")).toBeInTheDocument();
  });
});
