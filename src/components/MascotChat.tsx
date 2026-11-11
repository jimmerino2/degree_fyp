import { useEffect, useRef, useState, type ButtonHTMLAttributes, type FormEvent } from "react";
import { CircleCheck, Loader2, SendHorizontal, X } from "lucide-react";
import { MASCOT_NAME, MOCK_STEP_DELAY_MS } from "../config";
import { mascotCopy } from "../data/copy";
import { matchWorkflow, workflows, type Workflow } from "../data/workflows";
import { useDevice } from "../device";
import type { ScreenId } from "../navigation";
import { Mascot } from "./Mascot";

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
  steps?: { label: string; done: boolean }[];
  /** Show the workflow chips under this message. */
  chips?: boolean;
  /** Pending yes/no question for this workflow. */
  confirmFor?: Workflow;
  action?: { label: string; screen: ScreenId };
}

interface MascotChatProps {
  open: boolean;
  onClose: () => void;
  go: (screen: ScreenId) => void;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Mascot chat that runs mock workflows. Stays mounted while closed so the conversation is kept. */
export function MascotChat({ open, onClose, go }: MascotChatProps) {
  const desktop = useDevice() === "desktop";
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "bot", text: mascotCopy.greeting(MASCOT_NAME), chips: true },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const nextId = useRef(1);
  const alive = useRef(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "end" });
  }, [messages]);

  function push(message: Omit<Message, "id">): number {
    const id = nextId.current++;
    setMessages((ms) => [...ms, { ...message, id }]);
    return id;
  }

  function update(id: number, change: (m: Message) => Message) {
    setMessages((ms) => ms.map((m) => (m.id === id ? change(m) : m)));
  }

  // On mobile the chat covers the screen, so close it when moving to another screen.
  function openScreen(screen: ScreenId) {
    go(screen);
    if (!desktop) onClose();
  }

  function send(text: string) {
    if (!text.trim() || busy) return;
    push({ from: "user", text });
    const workflow = matchWorkflow(text);
    if (!workflow) push({ from: "bot", text: mascotCopy.fallback, chips: true });
    else if (workflow.confirm) push({ from: "bot", text: workflow.confirm, confirmFor: workflow });
    else void run(workflow);
  }

  function answer(messageId: number, workflow: Workflow, yes: boolean) {
    update(messageId, (m) => ({ ...m, confirmFor: undefined }));
    push({ from: "user", text: yes ? mascotCopy.yes : mascotCopy.no });
    if (yes) void run(workflow);
    else push({ from: "bot", text: mascotCopy.cancelled });
  }

  async function run(workflow: Workflow) {
    setBusy(true);
    const id = push({
      from: "bot",
      text: mascotCopy.running(workflow.label),
      steps: workflow.steps.map((label) => ({ label, done: false })),
    });
    for (let i = 0; i < workflow.steps.length; i++) {
      await sleep(MOCK_STEP_DELAY_MS);
      if (!alive.current) return;
      update(id, (m) => ({ ...m, steps: m.steps!.map((s, j) => (j <= i ? { ...s, done: true } : s)) }));
    }
    workflow.run?.();
    const { open: target } = workflow;
    push({
      from: "bot",
      text: workflow.done,
      action: target && !target.autoOpen ? { label: target.label, screen: target.screen } : undefined,
    });
    setBusy(false);
    if (target?.autoOpen) openScreen(target.screen);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    send(input);
    setInput("");
  }

  const shell = desktop
    ? "w-96 shrink-0 border-l border-line"
    : "absolute inset-0 z-10 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]";

  return (
    <aside aria-label={mascotCopy.open(MASCOT_NAME)} className={`fade-in flex-col bg-canvas ${shell} ${open ? "flex" : "hidden"}`}>
      <header className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3">
        <Mascot size={40} />
        <div className="flex-1">
          <p className="font-semibold">{MASCOT_NAME}</p>
          <p className="text-sm text-ink-muted">{mascotCopy.role}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={mascotCopy.close}
          className="flex size-12 items-center justify-center rounded-btn text-ink-muted hover:bg-line/50"
        >
          <X aria-hidden size={24} />
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
        {messages.map((m) =>
          m.from === "user" ? (
            <p key={m.id} className="max-w-[85%] self-end rounded-card rounded-br-sm bg-brand px-4 py-2 text-white">
              {m.text}
            </p>
          ) : (
            <div key={m.id} className="flex max-w-[90%] gap-2 self-start">
              <Mascot size={28} />
              <div className="flex flex-col gap-2 rounded-card rounded-tl-sm border border-line bg-surface px-4 py-3">
                <p>{m.text}</p>

                {m.steps && (
                  <ol className="flex flex-col gap-1">
                    {m.steps.map((s) => (
                      <li key={s.label} className={`flex items-center gap-2 text-sm ${s.done ? "text-ink" : "text-ink-muted"}`}>
                        {s.done ? (
                          <CircleCheck aria-hidden size={16} className="text-healthy" />
                        ) : (
                          <Loader2 aria-hidden size={16} className="motion-safe:animate-spin" />
                        )}
                        {s.label}
                      </li>
                    ))}
                  </ol>
                )}

                {m.confirmFor && (
                  <div className="flex gap-2">
                    <ChatButton primary onClick={() => answer(m.id, m.confirmFor!, true)}>
                      {mascotCopy.yes}
                    </ChatButton>
                    <ChatButton onClick={() => answer(m.id, m.confirmFor!, false)}>{mascotCopy.no}</ChatButton>
                  </div>
                )}

                {m.action && (
                  <ChatButton primary onClick={() => openScreen(m.action!.screen)}>
                    {m.action.label}
                  </ChatButton>
                )}

                {m.chips && (
                  <div className="flex flex-wrap gap-2">
                    {workflows.map((w) => (
                      <ChatButton key={w.id} disabled={busy} onClick={() => send(w.label)}>
                        {w.label}
                      </ChatButton>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ),
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="flex gap-2 border-t border-line bg-surface p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mascotCopy.placeholder}
          aria-label={mascotCopy.placeholder}
          disabled={busy}
          className="min-h-12 flex-1 rounded-btn border border-line bg-canvas px-3"
        />
        <button
          type="submit"
          aria-label={mascotCopy.send}
          disabled={busy || !input.trim()}
          className="flex size-12 items-center justify-center rounded-btn bg-brand text-white disabled:opacity-50"
        >
          <SendHorizontal aria-hidden size={20} />
        </button>
      </form>
    </aside>
  );
}

function ChatButton({
  primary = false,
  ...rest
}: { primary?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`min-h-12 rounded-full border px-4 text-sm font-semibold disabled:opacity-50 ${
        primary ? "border-brand bg-brand text-white" : "border-brand bg-surface text-brand hover:bg-brand-soft"
      }`}
      {...rest}
    />
  );
}
