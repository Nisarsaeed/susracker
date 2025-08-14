# CLPM — Camera Level Processing Module (Edge Inference)

[![Python](https://img.shields.io/badge/Python-3.11.9-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![YOLOv11](https://img.shields.io/badge/YOLOv11-v1.0-lightgrey?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&logo=github)](../LICENSE)

---

This folder contains the **Camera Level Processing Module (CLPM)** — a lightweight, pure-Python implementation that mimics an edge device (e.g., NVIDIA Jetson) to perform real-time inference on camera feeds using a fine-tuned YOLOv11 model. For development and testing we used a laptop to emulate the edge environment.

The CLPM's core responsibilities (kept intentionally minimal here — full details are on the module page) are:

- run YOLOv11 inference on camera frames (face & violence detection),
- apply short-term temporal aggregation to reduce false positives,
- send confirmed detection events (face crops / violence events) to the central server together with camera metadata.

> **Note:** CLPM never reads from the central database — it only sends events to the server.

---

## Quick Overview

- **Language:** Python (tested with **Python 3.11.9**)  
- **Framework:** None — plain Python scripts (uses `ultralytics`, `opencv`, `requests`, etc.)  
- **Model:** YOLOv11 fine-tuned on open-source criminal activity datasets (weapon, fighting) — trained on Kaggle.  
- **Temporal aggregation rule:** violence confirmed when **≥ 10 positive frames out of a sliding window of 20**.  
- **Communication:** HTTP POST (or WebSocket if configured) to central server endpoint (e.g. `POST /api/detections`).

---

## Model Training

The YOLOv11 model was fine-tuned using PyTorch (Ultralytics training utilities) on a curated dataset of ~**17,000** labeled images containing weapon and fighting examples. Training ran for **60 epochs** (transfer learning/fine-tuning from pre-trained weights). The resulting weights (`best.pt`) are used by the CLPM for inference. (Full training scripts, augmentation details, and dataset manifests are kept in the training notebook/repo used during model development — see `/training` or ask for a training README if you want reproductions.)

#### Confusion Matrix
<img src="/imgs/confusion-matrix.jpg" alt="Confusion Matrix" />

---

## Example: minimal CLPM config & constants

Below is the minimal header/config snippet used in the CLPM script (this is representative — actual script includes reading args/config and full loop):

```python
import cv2
import requests
import time
from collections import deque
from ultralytics import YOLO

# Server Configuration
SERVER_URL = "http://192.168.1.21:5000"
camera_info = {
    'camera_id': "001",
    'camera_location': "Hitec"
}
# VIDEO_SOURCE = r"C:\Users\mohsi\OneDrive\Desktop\violence.mp4"
MODEL_PATH = r"C:\Users\mohsi\Downloads\best (1).pt"

# Detection/Alert Config
DETECTION_INTERVAL = 2        # run YOLO every nth frame
VIOLENCE_BUFFER_SIZE = 20
VIOLENCE_CONSECUTIVE_FRAMES = 10
```

### Typical POST from CLPM to Central Server

```json
{
  "camera_id": "001",
  "camera_location": "Hitec",
  "event_type": "violence",
  "timestamp": "2025-08-14T12:30:45Z",
  "image": "<base64-encoded-image>"
}
```
## Detection and Temporal Logic

- Frame Sampling: Runs YOLO detection every n frames to optimize performance.

- Temporal Aggregation: Violence detection is confirmed if at least 10 out of 20 consecutive frames show violent activity.

- Face Matching Trigger: If a face is detected, an image is sent to the server for comparison against the wanted criminals database.

## Acknowledgements

- YOLOv11 by Ultralytics for object detection.

- Open-source criminal activity datasets for training.

- PyTorch for fine-tuning the model.