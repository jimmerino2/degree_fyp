# Plant-Part Detector: Training Setup

Scope: **stage 1 only** of [CNN_SETUP.md](../backend/CNN_SETUP.md) §2, the detector that finds `leaf`, `stem` and `fruit` in a whole-plant photo. The classifier, Cause mapping and calibration are out of scope here. They will plug in later through the output contract in §6.

> Status: design, 2026-11-11. No code yet. Next step: download the datasets in §1, then build stages S1–S3.

## 1. Datasets to download

Put everything under `ml/data/raw/<folder>/`, one folder per source and unchanged from the download. Nothing under `ml/data/` is committed except `manifest.csv`.

| Priority | Folder (`ml/data/raw/…`) | Source | What we take from it | Why |
| --- | --- | --- | --- | --- |
| **Required** | `plantorgans/` | Hugging Face [`farmaieu/plantorgans`](https://huggingface.co/datasets/farmaieu/plantorgans): 5.75k train + 1.44k val, masks for fruit / leaf / flower / stem, CDLA-Permissive-2.0 | leaf, **stem**, fruit (flower dropped) | **The only public source with stem labels.** Masks are turned into boxes in S2. General plants, **not chilli-specific** (no species column), so it teaches "what a leaf/stem/fruit looks like", not chilli. Parquet is ~11.6 GB in full (the 35 GB on the page also counts raw copies); we take a ~3.4 GB subset (see below) |
| **Required** | `leaf_detection/` | Kaggle [`alexo98/leaf-detection`](https://www.kaggle.com/datasets/alexo98/leaf-detection): 1,140 images, 5,346 boxes | leaf | Real leaf boxes, so no mask-to-box conversion error |
| **Required** | `lvis_fruits_veg/` | Kaggle [`henningheyen/lvis-fruits-and-vegetables-dataset`](https://www.kaggle.com/datasets/henningheyen/lvis-fruits-and-vegetables-dataset), CC BY 4.0 | chilli / bell pepper boxes only → fruit | Chilli fruit boxes in natural scenes |
| **Required** | `chili_husd_bd/` | Kaggle [`shuvokumarbasak4004/chili-plant-dataset-husd-bd`](https://www.kaggle.com/datasets/shuvokumarbasak4004/chili-plant-dataset-husd-bd), 640×640, YOLO format | **images only** at first | The only whole-plant **chilli** photos. Its classes (healthy / unhealthy / seed / dry) are not parts, so it is the pool for pseudo-labelling plus manual correction (S7) and the chilli test set |
| Optional | `rf_chilli_umpsa/` | Roboflow [Chilli detection (UMPSA)](https://universe.roboflow.com/universiti-malaysia-pahang-alsultan-abdullah/chilli-detection-wd4wx), exported as **COCO JSON** | stem, chilli → fruit | Malaysian chilli with a `Stem` class. I could not open the page (403), so check its classes and licence before using it |
| Later | `rootline_field/` | Your own whole-plant photos, labelled in Label Studio / CVAT | leaf, stem, fruit | `test_field`. The only honest measure of the detector (limitation b) |
| Skip | — | Barth Capsicum annuum (4TU) | — | 27.7 GB, one zip, mostly synthetic greenhouse bell pepper. Not worth it for now |

**Download commands** (run from the repo root; the Kaggle token goes in `%USERPROFILE%\.kaggle\kaggle.json`, which does not exist on this machine yet):

```powershell
kaggle datasets download alexo98/leaf-detection -p ml/data/raw/leaf_detection --unzip
kaggle datasets download henningheyen/lvis-fruits-and-vegetables-dataset -p ml/data/raw/lvis_fruits_veg --unzip
kaggle datasets download shuvokumarbasak4004/chili-plant-dataset-husd-bd -p ml/data/raw/chili_husd_bd --unzip
```

**PlantOrgans: download about 2,100 images (~3.4 GB), not the full 35 GB.** The data is split into parquet shards of ~300 images (~490 MB) each, and every shard holds both the image and its mask. Install the CLI once with `uv tool install huggingface_hub`. If `hf` is not found afterwards, use `uv tool install "huggingface_hub[cli]"`. Then:

```powershell
hf download farmaieu/plantorgans --repo-type dataset --local-dir ml/data/raw/plantorgans `
  --include "data/train-0000[0-5]-of-00019.parquet" `
  --include "data/validation-00000-of-00005.parquet" `
  --include "id2label.json" --include "README.md" --include "LICENSE"
```

This fetches train shards 0–5 (≈1,810 images) and validation shard 0 (≈290 images), about 2,100 in total, and skips `labels_raw.tar.gz` and the `semantic_masks/` folder. Need more later? Widen the range (`[0-9]` for 10 shards) and re-run; files already downloaded are skipped. S3 shrinks images to 640 px, so the rest of the pipeline is not affected by the smaller subset. S0 should count how many stem pixels the subset contains. If the shards turn out to be ordered by source, swap in shards from other parts of the range.

## 2. Class definitions

| Class | Box covers | Notes |
| --- | --- | --- |
| `leaf` | One leaf blade (with petiole if visible) | Clusters where leaves cannot be separated get one box marked `iscrowd` |
| `stem` | A **stem segment**, at most about 2× as long as it is wide | A whole diagonal stem as one box would cover half the image and be useless as a crop. Long stem masks are split into segments in S2. The **collar region** (stem at soil level) matters most for collar rot and damping-off |
| `fruit` | One fruit, including the calyx | Flowers are dropped for now |

Kept in `ml/configs/parts.yaml`, together with each source's class → part map. Unmapped classes are dropped and logged.

## 3. The partial-label problem (main design risk)

Each source labels only some parts: `leaf_detection` has no fruit boxes, and LVIS has no leaf boxes even though leaves are visible. Merged naively, the detector learns that unlabelled leaves in LVIS images are background.

Handled in three ways, chosen per run in config:

1. Each record stores `annotated_classes`. The trainer **ignores background loss for classes a source did not annotate** (needs a custom loss, so it depends on the model adapter).
2. **Pseudo-labelling (S7):** a teacher trained on the merged data fills in the missing classes at high confidence. The student is then trained on the filled-in data.
3. Fallback: train on PlantOrgans alone (it has all three classes) and use the other sources only to fine-tune.

## 4. Pipeline: separate stages

Each stage is its own module and CLI command. It reads only the previous stage's output folder, writes only its own, and can be re-run on its own. The interface between stages is files on disk, not imports.

```
raw/ ─S1─► interim/<src>.jsonl ─S2─► harmonised/ ─S3─► clean/ ─S4─► splits/ ─S5─► datasets/coco/
                                                                                     │
                                       exports/ ◄─S9─ runs/<id>/ ◄─S8─ eval ◄─S6─ train
                                                         ▲
                                                         └──S7 pseudo-label (optional loop back to S2)
```

| Stage | Module | Input → output | Job |
| --- | --- | --- | --- |
| S0 | `inventory` | `raw/` → `manifest.csv` | Check every expected folder exists. Record file count, SHA-1, licence and source URL |
| S1 | `ingest` | `raw/<src>` → `interim/<src>.jsonl` | **One adapter per source** (`sources/plantorgans.py`, …), each turning that source's format into the common record (§5). Adding a dataset means adding one adapter file |
| S2 | `harmonise` | `interim/` → `harmonised/` | Apply `parts.yaml`: map classes, mask → box (connected components, minimum area, stem splitting), drop and log the rest |
| S3 | `clean` | `harmonised/` → `clean/` | Resize to 640 px on the long side (boxes rescaled), perceptual-hash dedupe across sources, drop boxes under 8 px, keep EXIF orientation right |
| S4 | `split` | `clean/` → `splits/*.txt` | `train` / `val` grouped by duplicate cluster. `test_cross` = held-out chilli images (`chili_husd_bd` after manual labelling). `test_field` = `rootline_field` |
| S5 | `build` | `splits/` → `datasets/coco/` | Write COCO JSON per split. The only stage that knows the trainer's format |
| S6 | `train` | `datasets/` + `configs/detector/*.yaml` → `runs/<id>/` | Config-driven, uses a model adapter (§7). Saves the config, seed, git hash and per-epoch metrics CSV with each checkpoint |
| S7 | `pseudolabel` | `runs/<id>` + images → `interim/pseudo_<src>.jsonl` | Teacher predictions above a threshold, flagged `pseudo: true`. Also writes pre-labels for Label Studio, so your manual labelling is correction, not drawing from scratch |
| S8 | `evaluate` | `runs/<id>` + split → `runs/<id>/eval/` | mAP@0.5, mAP@0.5:0.95, **per-class recall at the deployment threshold**, broken down by source. Missed parts are worse than extra boxes, because a missed part is never classified |
| S9 | `export` | `runs/<id>` → `exports/detector_v0.x/` | ONNX (opset 17), int8 quantisation, parity check against PyTorch on `val`, timing at 320 and 416 px |

## 5. Common record (S1 output, every stage after reads it)

```json
{"id": "plantorgans/000123", "source": "plantorgans", "image": "raw/plantorgans/…/000123.jpg",
 "width": 3024, "height": 4032,
 "annotated_classes": ["leaf", "stem", "fruit"],
 "objects": [{"src_class": "Stem", "part": null, "bbox_xyxy": [..], "mask": "…png#4", "iscrowd": false}],
 "pseudo": false}
```

`part` is filled in by S2. `mask` is kept only for mask sources and removed after S2.

## 6. Output contract for the later classifier

What the detector hands to stage 2. Fixed now so the classifier can be built against it without touching detector code:

```json
{"image_id": "...", "detector_version": "detector_v0.1",
 "parts": [{"part": "leaf", "score": 0.91, "bbox_xyxy": [x1, y1, x2, y2], "crop_pad": 0.1}]}
```

If no part scores above the threshold, the app falls back to a centre crop, as in CNN_SETUP §2.

## 7. Model: behind an adapter

`models/` has one adapter per architecture with the same interface (`build(cfg)`, `train_step`, `predict`, `to_onnx`). The architecture is a config value, so you can swap it without changing any stage.

| Adapter | Licence | Fits 4 GB GTX 1650? | Role |
| --- | --- | --- | --- |
| `ssdlite_mbv3` (torchvision SSDLite320-MobileNetV3) | BSD-3 | Yes, batch 32 | **Default baseline.** Licence-safe, easy ONNX export, ~3.4M parameters |
| `yolox_nano` | Apache-2.0 | Yes, batch 16 at 416 | Expected to be more accurate on small parts |
| `yolo_ultralytics_n` | **AGPL-3.0** | Yes | Only if you accept AGPL (open question in CNN_SETUP §10) |
| `rtdetr_r18` | Apache-2.0 | Tight, use Kaggle | Upper bound for comparison, probably too heavy for the phone |

## 8. Proposed layout

```
ml/
  pyproject.toml                # uv project: torch, torchvision, pycocotools, imagehash, pyyaml, onnx, onnxruntime
  DETECTOR_SETUP.md
  configs/
    parts.yaml                  # classes + per-source class map
    sources.yaml                # folder, URL, licence, adapter name per source
    detector/ssdlite_baseline.yaml
  src/rootline_ml/
    common/                     # records, io, hashing, seeding, config loading
    detector/
      sources/                  # S1 adapters, one file per dataset
      models/                   # §7 adapters
      inventory.py ingest.py harmonise.py clean.py split.py build.py
      train.py pseudolabel.py evaluate.py export.py
      cli.py                    # `uv run rootline-ml detector <stage>`
  tests/                        # tiny fixtures per adapter and stage
  data/{raw,interim,harmonised,clean,splits,datasets}/   # gitignored
  runs/  exports/                                        # gitignored
```

## 9. Order of work

1. Download §1 (you). Add a Kaggle token.
2. S0–S3, then look at a sample of boxes per source (a visual check script) **before** any training.
3. S4–S6 baseline: `ssdlite_mbv3` on PlantOrgans only (fallback 3 in §3).
4. Add the other sources with ignore-loss, and compare.
5. S7 on `chili_husd_bd`, then correct about 200 images by hand in Label Studio. These become `test_cross`, plus some for fine-tuning.
6. S8 and S9. Detector recall reported per part.

## 10. Open decisions

- AGPL for Ultralytics: yes or no? (Only changes which adapters are allowed.)
- ~~PlantOrgans: all 35 GB, or a subset?~~ Decided: ~2,100-image subset (§1).
- Is stem worth detecting from the whole-plant photo, or should the app ask for a separate **collar close-up** photo (like the leaf-underside photo)? The second is easier to get right, and stem diseases show up most at the collar.
