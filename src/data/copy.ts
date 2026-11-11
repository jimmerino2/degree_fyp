import type { Cause, EventType, MockResult } from "../types/domain";

// All UI strings live here so Bahasa Malaysia can be added later.
export const copy = {
  nav: { home: "Home", log: "Log", rows: "Rows", farm: "Farm" },
  common: { back: "Back", today: "Today", lastCheck: "Last check" },

  home: {
    title: "Today",
    checkTitle: "Daily check-up",
    checkBody: "Photograph your 6 sample plants. It takes about 5 minutes.",
    checkBodyDesktop: "Upload photos of your 6 sample plants.",
    startCheck: "Start check",
    reportProblem: "Report a problem",
    rowsDue: "Rows due",
    openWarning: "Open warning",
    viewWarning: "View warning",
  },
  capture: {
    title: "Check-up",
    frameHint: "Fit the whole plant inside the frame",
    flipHint: "Now flip one leaf and take a photo of the underside",
    take: "Take photo",
    checking: "Checking photo…",
    photos: (n: number, total: number) => `Photo ${n} of ${total}`,
    // Desktop: photos are uploaded instead of taken
    plant: "Plant",
    slotWhole: "Whole plant",
    slotUnderside: "Underside of one leaf",
    undersideHint: "Flip one leaf over so the underside shows",
    choose: "Click or drop a photo here",
    replace: "Click to replace",
    useSample: "Use sample photos",
    upload: "Check photos",
  },
  picker: {
    title: "Where is the problem?",
    hint: "Tap the part that looks wrong",
    next: "Next",
    parts: { leaf: "Leaves", fruit: "Fruit", stem: "Stem", whole: "Whole plant wilting", row: "Whole row" },
  },
  captureCheck: {
    title: "Photo check",
    pass: "Photo looks good",
    passBody: "The plant is clear and well lit.",
    fail: "Please retake",
    failBody: "The photo is blurry. Hold the phone still and try again.",
    failBodyDesktop: "The photo is blurry. Choose a sharper photo of the plant.",
    retake: "Retake photo",
    reupload: "Upload a new photo",
    continue: "Continue",
    showPass: "Show pass",
    showFail: "Show fail",
  },
  result: {
    title: "Result",
    likelyCause: "Likely cause",
    firstCheck: "First check to do",
    products: "Registered products",
    phi: (d: number) => `Wait ${d} days before harvest`,
    resistant: "Bacterial wilt has no spray. Ask about resistant varieties for your next planting.",
    askQuestions: "Answer a few questions",
    done: "Done",
  },
  followUp: {
    title: "One question",
    progress: (n: number, total: number) => `Question ${n} of up to ${total}`,
  },
  referral: {
    title: "Ask an officer",
    heading: "We could not decide the cause",
    body: "Your photos and answers are saved. An agriculture officer can look at this case.",
    summary: "Case summary",
    contact: "Contact officer",
  },
  rowHistory: { title: "Row history", flags: "Flags", checks: "Checks" },
  eventLog: {
    title: "Log an event",
    amount: "Amount (optional)",
    amountPlaceholder: "e.g. 2 L per plant",
    date: "Date",
    save: "Save",
    recent: "Recent entries",
  },
  pattern: {
    title: "Pattern warning",
    evidence: "What we noticed",
    suggested: "Suggested check",
    confirm: "I see it too",
    dismiss: "Dismiss",
    confirmed: "Marked as confirmed. It stays in row history.",
    dismissed: "Dismissed. It stays in row history.",
  },
  farmSetup: {
    title: "Farm setup",
    name: "Farm name",
    variety: "Chilli variety",
    spacing: "Plant spacing (cm)",
    medium: "Growing in",
    soil: "Soil",
    polybag: "Polybag",
    rows: "Number of rows",
    tags: "QR tags needed",
    save: "Save farm",
  },
  sync: {
    title: "Sync",
    pending: "Items waiting to sync",
    lastSync: "Last sync",
    wifiOnly: "Upload photos on Wi-Fi only",
    consent: "Share photos to help improve the app",
    syncNow: "Sync now",
  },
};

/** "2026-10-28" -> "28 Oct" */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

export const mascotCopy = {
  open: (name: string) => `Chat with ${name}`,
  close: "Close chat",
  role: "Your farm helper",
  homeGreeting: "Need a hand? I can start your check, log rain, or explain a warning.",
  greeting: (name: string) => `Hi, I'm ${name}. I can run common tasks for you. Tap one below or type what you need.`,
  fallback: "Sorry, I can't do that yet. Here is what I can help with:",
  placeholder: "Type a message",
  send: "Send",
  yes: "Yes",
  no: "No",
  cancelled: "Okay, I didn't change anything.",
  running: (task: string) => `Working on it: ${task.toLowerCase()}`,
};

export const causeLabel: Record<Cause, string> = {
  healthy: "Healthy",
  disease: "Disease",
  pest: "Pest damage",
  nutrient: "Nutrient stress",
  water: "Water stress",
  supply: "Supply fault",
  unsure: "Unsure",
};

export const eventLabel: Record<EventType, string> = {
  watered: "Watered",
  fed: "Fed",
  sprayed: "Sprayed",
  rain: "Rain",
};

/** Hard-coded "AI" results. Confidence is words only. */
export const mockResults: Record<
  MockResult,
  { confidence: "Likely" | "Possible" | "Unsure"; summary: string; firstCheck: string }
> = {
  healthy: {
    confidence: "Likely",
    summary: "This plant looks healthy.",
    firstCheck: "No action needed. Keep your normal routine.",
  },
  disease: {
    confidence: "Likely",
    summary: "Spots on the leaves look like a leaf disease.",
    firstCheck: "Remove the worst leaves and check nearby plants for the same spots.",
  },
  nutrient: {
    confidence: "Possible",
    summary: "Yellowing between the veins can mean the plant needs more feed.",
    firstCheck: "Check when you last fed this row and the mix you used.",
  },
  water: {
    confidence: "Possible",
    summary: "Drooping leaves can mean too little or too much water.",
    firstCheck: "Push a finger into the soil. Check if it is dry or soggy.",
  },
  supply: {
    confidence: "Possible",
    summary: "Only plants on one line look affected. The water or feed supply may be the cause.",
    firstCheck: "Check the drip line for this row for blocked or leaking emitters.",
  },
  unsure: {
    confidence: "Unsure",
    summary: "We cannot tell the cause from this photo yet.",
    firstCheck: "Answer a few questions so we can narrow it down.",
  },
};

export type AnswerIcon = "old" | "new" | "both" | "yes-rain" | "no-sun" | "unknown" | "yes-rows" | "no-single";

export const followUpQuestions: { text: string; answers: { label: string; icon: AnswerIcon }[] }[] = [
  {
    text: "Are the spots on the old leaves or the new leaves?",
    answers: [
      { label: "Old leaves", icon: "old" },
      { label: "New leaves", icon: "new" },
      { label: "Both", icon: "both" },
    ],
  },
  {
    text: "Did it rain or did you water heavily in the last 3 days?",
    answers: [
      { label: "Yes", icon: "yes-rain" },
      { label: "No", icon: "no-sun" },
      { label: "Not sure", icon: "unknown" },
    ],
  },
  {
    text: "Are plants next to it showing the same signs?",
    answers: [
      { label: "Yes", icon: "yes-rows" },
      { label: "No", icon: "no-single" },
      { label: "Not sure", icon: "unknown" },
    ],
  },
];
