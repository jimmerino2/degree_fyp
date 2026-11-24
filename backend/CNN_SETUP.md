# CNN Setup Plan

How Rootline's image model should be built, trained, checked and shipped. It covers objective O2 (root-cause triage) in [03_INTRODUCTION.md](../submission/proposal/markdown/03_INTRODUCTION.md), and it has to respect O3 (works offline) and limitations (b) and (4) (public data is a baseline only).

> **Status:** draft. The datasets in §3.1 come from a Kaggle search on 2026-11-11. Counts and licences still need checking on each page.

## 1. What the model has to do

From O2 and the capture flow (whole-plant photo plus underside of a leaf):

1. **Find plant parts** (leaf, stem, fruit) in a whole-plant photo.
2. **Classify each part** into a fine-grained label (for example `leaf_curl`, `anthracnose`, `whitefly`), then map it to the app's `Cause`: `healthy | disease | pest | nutrient | water | supply | unsure` (see `src/types/domain.ts` and `backend/app/schemas.py`).
3. **Give a calibrated confidence**, so the app can ask follow-up questions when confidence is low and refer the case to an officer after the question cap.
4. **Run on a low-end phone with no signal.** Small model, quantised, ideally under 10 MB in total.

What the CNN should **not** try to do: tell `water` and `supply` faults (clogged emitter, salt build-up, pH drift) apart from nutrient stress using the photo alone. Public datasets have no such labels, and the symptoms overlap. The CNN outputs "looks like nutrient or water stress", and the follow-up questions and the emitter cup test or EC/pH entry (O5) separate the causes. Say so plainly in the report.

## 2. Architecture: detect, then classify

```
whole-plant photo ──► [Detector] ──► crops of leaf / stem / fruit ──┐
leaf-underside photo ───────────────────────────────────────────────┼──► [Classifier] ──► label + prob ──► map to Cause ──► calibrate ──► app (follow-up / refer)
```

| Stage | Recommended | Alternatives | Why |
| --- | --- | --- | --- |
| Detector | SSD-MobileNet or RT-DETR / YOLO "nano" size, 320–416 px input | EfficientDet-Lite0 | Must be small and fast on a phone. **Check the licence:** Ultralytics YOLO is AGPL-3.0, which matters if the app is ever distributed. |
| Classifier | MobileNetV3-Large (ImageNet pretrained), 224 px | EfficientNet-Lite0/B0, MobileNetV3-Small | Matches the literature (UMN, MobileNetV3, 5.9 MB, 94.34%) so results can be compared. |
| Framework | PyTorch + `timm` for training | TensorFlow / Keras | Simple fine-tuning, and it exports cleanly to ONNX. |
| Runtime | **ONNX**, int8 quantised. `onnxruntime-web` in the React app (offline, in-browser), and `onnxruntime` in FastAPI | TF.js | **Decided: installable PWA, target platform Android (Chrome).** The PWA is set up (`vite.config.ts`): files under `public/models/` are cached on first use. The same `.onnx` runs unchanged if the app is later wrapped with Capacitor (Android) or Tauri / Electron (desktop). FastAPI runs it for testing, and as a fallback when online. Use the WASM backend (WebGPU is not reliable on low-end Android yet). |

**Build order:** the classifier comes first, because Kaggle data supports it straight away. The detector comes second, because it needs bounding-box labels that the Kaggle classification sets do not have (§4). Until the detector exists, the leaf-underside photo plus a centre crop of the whole-plant photo go straight to the classifier.

## 3. Datasets

### 3.1 Dataset list

Found by searching Kaggle on 2026-11-11. Image counts, classes and licences come from the search listings. **Open each page and confirm them before downloading** (M1). "?" means the listing did not say.

| # | Plant part | Dataset | Classes | Images | Licence | Use |
| --- | --- | --- | --- | --- | --- | --- |
| L1 | Leaf | [Chili Leaf Disease, annotated smartphone images](https://www.kaggle.com/datasets/aniruddha2022/mulberry-leaf-disease) (the URL says "mulberry", but the contents are chilli) | anthracnose, cercospora leaf spot, healthy, leaf curl | ~1,550 | ? | **Main leaf training set.** Phone photos, closest to real use |
| L2 | Leaf | [Chili Plant Disease](https://www.kaggle.com/datasets/ahmadalmahsiri/chili-plant-disease) | healthy, leaf curl, leaf spot, whitefly, yellowish | ? (has train/val/test) | Unknown | Main leaf set. `yellowish` → nutrient, `whitefly` → pest |
| L3 | Leaf + plant | [Chilli Plant Diseases Dataset](https://www.kaggle.com/datasets/ravindubandara3002/chilli-plant-diseases-dataset) | 7 classes | ~1,000 (+ augmented copy) | CC0 | Extra leaf data. **Use only the original images**, because the augmented copies leak into test splits |
| L4 | Leaf | [Dataset Chilli](https://www.kaggle.com/datasets/fakhirashafaa/dataset-chilli) | ? | ~1,743 | ? | Possible extra set. Check its classes first |
| L5 | Leaf (field) | [PlantDoc](https://www.kaggle.com/datasets/nirmalsankalana/plantdoc-dataset) | includes bell pepper leaf, bell pepper leaf spot | ~2,600 in total (all crops) | ? | **Cross-dataset test set (`test_cross`).** Field images scraped from the web, unlike PlantVillage |
| L6 | Leaf (lab) | [PlantVillage](https://www.kaggle.com/datasets/emmarex/plantdisease) | Pepper bell: bacterial spot, healthy | ~2,500 pepper images | ? | Pretraining only. Lab backgrounds (Noyan, 2022), never used as a test set |
| F1 | Fruit | [Anthracnose Disease in Chilli, mobile captured](https://www.kaggle.com/datasets/prudhvi143413s/anthracnose-disease-in-chilli-mobile-captured) | anthracnose, healthy | ? | ? | **Main fruit set.** Phone photos of fruit |
| F2 | Fruit | [Anthracnose Disease in Chili (Palnadu, AP)](https://www.kaggle.com/datasets/prudhvi143413s/anthracnose-disease-in-chili-palnadu-ap) | anthracnose, healthy | ? (has train/val/test) | ? | Extra fruit data. Same author as F1, so check for duplicates |
| F3 | Fruit | [Chili Plant Disease Detection](https://www.kaggle.com/datasets/shuvokumarbasak4004/chili-plant-disease-detection) | healthy, unhealthy | 200 | ? | Small. Useful only as an extra fruit test set |
| P1 | Pest (insect close-ups) | [Pest Dataset V2](https://www.kaggle.com/datasets/ibrahimagabardiop/pestaidatasetv2) | 16 pests, incl. thrips, whitefly, red spider mite, mites | ? | ? | For the leaf-underside photo. Not chilli-specific, since it shows the insect rather than leaf damage |
| D1 | Whole plant (boxes) | [Chili Plant Dataset HUSD BD](https://www.kaggle.com/datasets/shuvokumarbasak4004/chili-plant-dataset-husd-bd) | healthy, unhealthy, seed, dry | ? (640×640, YOLO format) | ? | Detector pretraining. **Its classes are not leaf/stem/fruit**, so it needs re-labelling |
| D2 | Leaf (boxes) | [Leaf Detection](https://www.kaggle.com/datasets/alexo98/leaf-detection) | leaf | 1,140 images, 5,346 boxes | ? | Pretraining for the leaf class of the detector. Not chilli |
| D3 | Fruit (boxes) | [LVIS Fruits and Vegetables](https://www.kaggle.com/datasets/henningheyen/lvis-fruits-and-vegetables-dataset) | 63 classes, incl. chilli | ? | LVIS: CC BY 4.0 | Pretraining for the fruit class of the detector |
| — | **Stem** | _None found_ | | | | Stem problems (blight, collar rot, damping-off) need Rootline's own field photos |
| — | **Root** | _None found_ for chilli | | | | Roots are not photographed in the app's capture flow. Root problems (rot, root-knot nematode, waterlogging) show up as wilting or yellowing above ground, so they are handled by follow-up questions, not the CNN |

### 3.2 What this means for the plan

- **The leaf classifier can be built now** from L1 + L2 (+ L3, L4), tested across datasets on L5.
- **The fruit classifier can be built now**, but only for anthracnose vs. healthy (F1, F2).
- **No public data covers stems or roots**, and **no chilli dataset has leaf / stem / fruit boxes**. The detector (M6) therefore depends on labelling your own whole-plant photos. Pretrain on D1–D3 to reduce how many you need.
- **Pests:** whitefly is in L2 as leaf damage. P1 is insect close-ups, so use it only if the leaf-underside photo turns out to show insects clearly.
- Any set with **field photos** should be weighted up and kept for testing where possible.

### 3.3 Unified label map

Different datasets name the same thing differently, so map every source class to one shared label set, then to `Cause`:

| Unified label | Cause | Notes |
| --- | --- | --- |
| `healthy` | healthy | |
| `leaf_curl` | disease | Usually viral (ChiLCV), spread by whitefly |
| `leaf_spot` / `cercospora` / `bacterial_spot` | disease | Merge if sources disagree on naming |
| `anthracnose` | disease | Fruit |
| `whitefly`, `thrips`, `mites`, `aphids` | pest | |
| `yellowish` / `nutrient_deficiency` | nutrient | The app then asks follow-up questions to separate `nutrient`, `water` and `supply` |
| _anything not in the map_ | dropped | Keep a log of what was dropped |

Keep the map in one file (`ml/labels.yaml`) so the backend and frontend read the same thing.

## 4. Data preparation

1. **Download** with the Kaggle CLI into `ml/data/raw/<dataset>/`, and gitignore it. Keep a manifest (source, licence, original class, unified label, SHA-1) as `ml/data/manifest.csv`.
2. **Deduplicate** using perceptual hashes. Kaggle sets often contain copies or augmented copies of each other, which leak into the test split and inflate accuracy.
3. **Split by source, not at random.**
   - `train` / `val`: random 80/20 per class, **grouped by near-duplicate cluster**.
   - `test_in`: a held-out 10% of the same sources.
   - `test_cross`: **one whole dataset never seen in training.** This is the honest number for the report.
   - `test_field`: Rootline's own field photos once collected (limitation b). Start a capture protocol now, even with a handful of photos.
4. **Class balance**: report counts per class, and use weighted sampling or class weights. Do not oversample by copying test-like images.
5. **Detector labels** (stage 2): label 300–500 whole-plant photos with leaf / stem / fruit boxes, using Label Studio or CVAT. Field photos from §4.3 are the best source. A few open "plant part" detection sets may help with pretraining.

## 5. Training (classifier)

- Input 224×224, ImageNet normalisation.
- **Augmentation** aimed at the background-bias problem: random resized crop (0.6–1.0), flips, rotation, colour jitter, blur, JPEG compression, and **background replacement or cutout**, so the model cannot score by learning the background.
- Two-phase fine-tuning: train the head only (about 5 epochs), then unfreeze everything at a lower learning rate (AdamW, cosine schedule, label smoothing 0.1), with early stopping on val macro-F1.
- Track runs with a simple CSV or TensorBoard. Seed everything and save the config with each checkpoint.
- **Compute:** see §5.1. The local laptop GPU is enough. Kaggle Notebooks are a free, faster option.

### 5.1 How long training will take

> **These are estimates.** The dataset list is not in the repo yet, so the image counts below are typical sizes for public chilli and pepper sets, not measured ones. Before planning around them, time one real epoch (§5.2).

**Assumed data.** From §3.1, the chilli leaf sets (L1–L4) add up to roughly 5,000–6,000 images before duplicates are removed, and PlantVillage pepper (L6) adds about 2,500 for pretraining. The fruit sets are smaller. The real leaf set will probably sit near the **5,000** row below. **10,000** stays as a safe upper planning figure.

**Assumed throughput** for MobileNetV3-Large training at 224 px, batch 64, mixed precision, **with images resized to 256 px on disk beforehand** (without this, JPEG decoding on the CPU is the bottleneck and times can double or triple):

| Machine | GPU | VRAM | Training speed (approx.) | Cost |
| --- | --- | --- | --- | --- |
| This laptop | GTX 1650 Max-Q | 4 GB | ~200 images/s | Free |
| Kaggle Notebook | T4 or P100 | 16 GB | ~400 images/s | Free, 30 GPU-hours per week |
| Colab (free) | T4 | 15 GB | ~400 images/s | Free, sessions can be cut off |

One training run is 30 epochs (5 with only the head training, then 25 with everything training), and early stopping usually ends it around epoch 20–25.

**Classifier: one run**

| Training images | Laptop (GTX 1650) | Kaggle (T4 / P100) |
| --- | --- | --- |
| 5,000 | ~15 min | ~7 min |
| **10,000 (planning figure)** | **~25–30 min** | **~12–15 min** |
| 20,000 | ~50–60 min | ~25–30 min |
| 50,000 (whole PlantVillage, for pretraining only) | ~2–2.5 h | ~1–1.2 h |

**Whole pipeline, at 10,000 images**

| Step | Laptop | Notes |
| --- | --- | --- |
| Download, resize, deduplicate, split (§4) | ~15–30 min | Mostly CPU and disk, done once |
| Baseline run (M2) | ~30 min | |
| Tuning: ~10 runs (learning rate, augmentation, image size) | ~5 h | Can run overnight, or ~2.5 h on Kaggle |
| Final run, 3 random seeds for error bars | ~1.5 h | Report mean ± spread |
| Background bias test (§6) | ~15 min | Tiny model on border pixels |
| Grad-CAM, calibration, coverage curve (§6) | ~10 min | Inference only |
| ONNX export, int8 quantisation, re-check (§7) | ~10 min | |
| **Classifier total** | **~8 h of compute** | Spread over 1–2 weeks of actual work; preparing data and reading results take longer than training |
| Detector (M6): ~500 labelled photos, 416 px, 100 epochs | ~30–60 min per run, ~3–5 h with tuning | 4 GB VRAM means batch 8–16; RT-DETR may not fit, so use a nano-size model or Kaggle |
| Labelling 500 detector photos by hand | **~8–15 h of human time** | The real bottleneck for M6, not the GPU |

**Conclusion:** compute is not the constraint. The laptop can train the full classifier in an evening, and the free Kaggle tier halves that. Plan the schedule around data collection, labelling and officer review instead.

### 5.2 Measure before trusting the estimate

1. Run `train.py` for one epoch on the real merged set and note the images/s it reports.
2. Time for one run ≈ `train images × 25 epochs ÷ images/s`.
3. If the GPU sits below ~80% use (`nvidia-smi`), data loading is the bottleneck: pre-resize the images, raise `num_workers` (on Windows, keep it ≤ 4 and run the script, not a notebook), or move to Kaggle.
4. Update the tables above with the measured figure.

## 6. Checks before trusting the model

These map to "evaluated against capture bias, heatmap validity and calibration" in §1.5 of the introduction.

| Check | How | Pass mark (proposed) |
| --- | --- | --- |
| Per-class precision / recall, macro-F1 | `test_in` and `test_cross` | Report both. A large gap between them means overfitting to the dataset |
| **Background bias test** | Repeat Noyan (2022): train a tiny model on border pixels only, or test on images with the leaf masked out | Accuracy close to chance on masked images |
| **Heatmap validity** | Grad-CAM on a sample per class, checked by hand: does the heat sit on the lesion? | ≥ 80% of sampled heatmaps on the leaf or lesion |
| **Calibration** | Temperature scaling on `val`. Report ECE and reliability diagrams before and after | ECE < 0.05 on `test_in` |
| Unsure threshold | Choose the confidence below which the app asks follow-up questions, using a coverage vs. accuracy curve | Pick the point that keeps ≥ 90% accuracy on answered cases |
| On-device speed | Time the int8 ONNX model in `onnxruntime-web` on a low-end Android phone | < 1 s per photo, < 10 MB in total |

## 7. Export and integration

1. Export with `torch.onnx.export` (opset 17), then apply int8 dynamic or static quantisation with `onnxruntime.quantization`. Re-run §6 on the quantised model; accuracy can drop.
2. Ship `classifier.onnx`, `labels.yaml` and `calibration.json` (temperature and thresholds) together as a versioned bundle (`model_v0.1/`).
3. **Backend:** load the bundle at startup in `backend/app/`, replace the mock in `POST /api/diagnose`, and set `model_loaded: true` in `/api/health`. Add `onnxruntime`, `numpy` and `pillow` to the backend dependencies at that point.
4. **Frontend:** load the same `.onnx` with `onnxruntime-web` and cache it (service worker) so it works offline. Use the backend only for testing and for syncing results.

## 8. Proposed repo layout

```
ml/                     # separate uv project; heavy deps (torch) stay out of backend/
  pyproject.toml
  labels.yaml
  data/                 # gitignored, except manifest.csv
  src/
    prepare.py          # download, dedupe, map labels, split
    train.py
    evaluate.py         # metrics, bias test, Grad-CAM, calibration
    export.py           # ONNX + quantise + bundle
  notebooks/            # exploration only
backend/                # FastAPI (already set up)
documentation/
```

## 9. Milestones

| # | Deliverable | Done when |
| --- | --- | --- |
| M1 | Dataset audit | §3.1 table filled in, label map agreed, manifest built, duplicates removed |
| M2 | Baseline classifier | MobileNetV3 trained. `test_in` and `test_cross` numbers reported |
| M3 | Bias, heatmap and calibration report | All §6 checks run, unsure threshold chosen |
| M4 | ONNX bundle in the backend | `/api/diagnose` returns real predictions. Backend tests updated |
| M5 | In-browser inference | Works in airplane mode in the React app (O3) |
| M6 | Detector | Part detector trained on labelled whole-plant photos. Detector recall reported on field photos |
| M7 | Field evaluation | `test_field` results, ideally checked against an officer's walk-through (O2) |

## 10. Open questions

- Confirm the licence, image count and classes on each §3.1 page. Several listings show the licence as "Unknown", which is usually fine for coursework but must be stated in the report.
- Are the labels in those datasets trusted? Root-cause labels should be confirmed by DOA or MARDI officers (limitation a). Plan to have an officer review a sample.
- ~~Web app or native Android?~~ Decided: web app as a PWA, with optional Capacitor (Android) or Tauri (desktop) wrappers later. No React Native.
- Detector licence: is AGPL acceptable? If not, use SSD-MobileNet or RT-DETR.
- Who labels detector boxes and field photos, and when can field capture start?
