# Rootline (prototype)

Frontend-only phone prototype for a chilli plant health app for Malaysian smallholders. All data is mock data and all "AI" results are hard-coded. See [DESIGN.md](DESIGN.md) for the full spec.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build to dist/
npm run test       # smoke tests (every screen renders)
```

## Using the prototype

- The **left panel** is the reviewer switcher. Click any of the 12 screens to show it in the phone frame.
- The **Mobile / Desktop** toggle at the top switches views. Desktop shows a browser window with a side menu instead of the bottom bar. It can do everything mobile can, except taking photos: on Capture you pick the plant from a list and upload two photos (whole plant and underside of a leaf), or click "Use sample photos".
- **Cili**, the chilli mascot, opens a chat from the face at the top right of any screen (or the card on Home). Tap a task or type a request such as "it rained today" or "start my check". Cili shows each step as it runs, then opens the right screen or makes the change (for example, logging rain on every row). Matching uses simple keyword rules in `src/data/workflows.ts`; there is no real AI. Add a workflow there to teach Cili a new task.
- **Mock result** sets what the Result and Follow-up screens show (healthy, disease, nutrient, water, supply, unsure). Pick "Unsure" and answer all three follow-up questions to reach the officer referral screen.
- Buttons inside the phone also move between screens, for example Home → Start check → Capture → Capture check → Result.
- On Capture check, the link at the top right switches between the pass and fail cases.
- Nothing is saved. Switching screens or reloading resets all state.

On a narrow window the phone frame is removed and the app fills the screen, with the switcher below it.

## Where things live

| Path | Contents |
| --- | --- |
| `src/screens/` | One file per screen, plus `index.ts` listing them in order |
| `src/components/` | Shared UI: phone frame, switcher, buttons, cards, tiles, badges |
| `src/data/` | Mock farm, checks, flags, events, placeholder products, and `copy.ts` (all UI strings) |
| `src/types/domain.ts` | Shared types |
| `src/styles/index.css` | Tailwind setup and colour tokens |
| `src/config.ts` | App name and mock settings |

Products in `mockProducts.ts` are placeholders. Replace them with the verified DOA / MARDI list.
