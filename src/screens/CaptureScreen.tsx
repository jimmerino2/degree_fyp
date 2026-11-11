import { useEffect, useState } from "react";
import { Camera, FlipHorizontal2, ImageUp, Loader2, QrCode } from "lucide-react";
import { Button } from "../components/Button";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { MOCK_CHECK_DELAY_MS } from "../config";
import { copy } from "../data/copy";
import { mockFarm } from "../data/mockFarm";
import { useDevice } from "../device";
import type { ScreenProps } from "../navigation";

const PHOTOS_PER_PLANT = 2;
const SAMPLE_PHOTO = "/samples/plant.svg";
const allPlants = mockFarm.rows.flatMap((r) => r.plants);

export function CaptureScreen({ go }: ScreenProps) {
  const device = useDevice();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!checking) return;
    const t = setTimeout(() => go("capture-check"), MOCK_CHECK_DELAY_MS);
    return () => clearTimeout(t);
  }, [checking, go]);

  return (
    <Screen top={<TopBar title={copy.capture.title} onBack={() => go("home")} />}>
      {device === "desktop" ? (
        <UploadCapture checking={checking} onDone={() => setChecking(true)} />
      ) : (
        <CameraCapture checking={checking} onDone={() => setChecking(true)} />
      )}
    </Screen>
  );
}

interface CaptureProps {
  checking: boolean;
  onDone: () => void;
}

/** Mobile: plant from QR tag, photos taken with the camera. */
function CameraCapture({ checking, onDone }: CaptureProps) {
  const plant = mockFarm.rows[3].plants[2];
  const [taken, setTaken] = useState(0);

  function take() {
    if (taken + 1 >= PHOTOS_PER_PLANT) onDone();
    setTaken((n) => Math.min(n + 1, PHOTOS_PER_PLANT));
  }

  const showFlip = taken === 1;

  return (
    <>
      <div className="flex items-center gap-3 rounded-card border border-line bg-surface p-3">
        <QrCode aria-hidden size={32} className="text-brand" />
        <div>
          <p className="font-semibold">
            Row {plant.rowId.slice(1)} · Plant {plant.positionInRow}
          </p>
          <p className="text-sm text-ink-muted">{plant.qrTag}</p>
        </div>
      </div>

      <div className="relative aspect-3/4 overflow-hidden rounded-card bg-neutral-900">
        <img src={SAMPLE_PHOTO} alt="" className="size-full object-cover opacity-80" />
        <div className="absolute inset-6 rounded-card border-4 border-dashed border-white/80" />
        <p className="absolute inset-x-0 bottom-3 text-center text-sm font-semibold text-white">
          {showFlip ? copy.capture.flipHint : copy.capture.frameHint}
        </p>
      </div>

      <p className="text-center text-sm text-ink-muted">{copy.capture.photos(taken, PHOTOS_PER_PLANT)}</p>

      <Button icon={checking ? Loader2 : showFlip ? FlipHorizontal2 : Camera} onClick={take} disabled={checking}>
        {checking ? copy.capture.checking : copy.capture.take}
      </Button>
    </>
  );
}

/** Desktop: no camera, so the plant is picked from a list and photos are uploaded. */
function UploadCapture({ checking, onDone }: CaptureProps) {
  const [plantId, setPlantId] = useState("r4p3");
  const [whole, setWhole] = useState<string | null>(null);
  const [underside, setUnderside] = useState<string | null>(null);

  return (
    <>
      <label className="flex flex-col gap-1">
        <span className="text-sm text-ink-muted">{copy.capture.plant}</span>
        <select
          value={plantId}
          onChange={(e) => setPlantId(e.target.value)}
          className="min-h-12 rounded-btn border border-line bg-surface px-3"
        >
          {allPlants.map((p) => (
            <option key={p.id} value={p.id}>
              Row {p.rowId.slice(1)} · Plant {p.positionInRow} ({p.qrTag})
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <UploadSlot label={copy.capture.slotWhole} hint={copy.capture.frameHint} src={whole} onChange={setWhole} />
        <UploadSlot label={copy.capture.slotUnderside} hint={copy.capture.undersideHint} src={underside} onChange={setUnderside} />
      </div>

      <Button
        variant="ghost"
        onClick={() => {
          setWhole(SAMPLE_PHOTO);
          setUnderside(SAMPLE_PHOTO);
        }}
      >
        {copy.capture.useSample}
      </Button>

      <Button icon={checking ? Loader2 : ImageUp} onClick={onDone} disabled={checking || !whole || !underside}>
        {checking ? copy.capture.checking : copy.capture.upload}
      </Button>
    </>
  );
}

interface UploadSlotProps {
  label: string;
  hint: string;
  src: string | null;
  onChange: (url: string) => void;
}

function UploadSlot({ label, hint, src, onChange }: UploadSlotProps) {
  const [dragging, setDragging] = useState(false);

  // Release the previous object URL when the photo changes or the slot unmounts.
  useEffect(() => {
    return () => {
      if (src?.startsWith("blob:")) URL.revokeObjectURL(src);
    };
  }, [src]);

  function pick(file: File | undefined) {
    if (file?.type.startsWith("image/")) onChange(URL.createObjectURL(file));
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold">{label}</p>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files[0]);
        }}
        className={`relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-card border-2 border-dashed p-4 text-center text-sm ${
          dragging ? "border-brand bg-brand-soft" : "border-line bg-surface"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          aria-label={label}
          onChange={(e) => pick(e.target.files?.[0])}
          className="sr-only"
        />
        {src ? (
          <>
            <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-2 font-semibold text-white">
              {copy.capture.replace}
            </span>
          </>
        ) : (
          <>
            <ImageUp aria-hidden size={32} className="text-ink-muted" />
            <span className="text-ink-muted">{copy.capture.choose}</span>
          </>
        )}
      </label>
      <p className="text-sm text-ink-muted">{hint}</p>
    </div>
  );
}
