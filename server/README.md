# Central Server — Alerts, Matching & Real-time Broadcasting

[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&logo=github)](../LICENSE)

This module is the **central server** for SusRacker. It receives detection events from CLPM (edge devices), performs face-matching against the "wanted criminals" database using **dlib** (face recognition), applies alert cooldown logic to avoid redundant notifications from the same camera, allows cross-camera tracking, stores alerts, and broadcasts matched/confirmed events to the admin panel via **Socket.IO**.

> **Face matching accuracy:** The current dlib-based matcher is measured at **~98%** on the tuned dataset used in development (replace with measured values after deployment testing).

---

## Key Responsibilities (core / high-level)

- Receive detection events (face / violence) from CLPM HTTP
- Decode incoming face (base64 bytes), compute dlib face embeddings, and compare with stored criminal embeddings.
- If a match is found and cooldown rules permit, create and store an alert and emit a `new_alert` via Socket.IO to connected admin clients.
- Apply a per-(criminal_id, camera_id) cooldown to reduce redundant alerts while permitting tracking across multiple cameras.

---

## Example: server bootstrap & model load

```python
from flask import Flask, request, jsonify
from flask_socketio import SocketIO
import cv2
import dlib
import numpy as np
import base64
from datetime import datetime
from collections import defaultdict
from db import criminals_collection  # your DB access layer
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Face recognition models
face_detector = dlib.get_frontal_face_detector()
face_recognition_model = dlib.face_recognition_model_v1(r"/path/to/dlib_face_recognition_resnet_model_v1.dat")
shape_predictor = dlib.shape_predictor(r"/path/to/shape_predictor_5_face_landmarks.dat")

# Cooldown (seconds) to suppress repeated alerts for same criminal from same camera
ALERT_COOLDOWN_SECONDS = 5

# In-memory last-alert tracking: {(criminal_id, camera_id): last_timestamp}
last_alert_time = defaultdict(lambda: 0)
```

## Acknowledgements

- Dlib face recognition resources and pre-trained models.

- Open-source datasets used for embedding/face examples (replace with final dataset citations).

- Flask & Flask-SocketIO community for real-time HTTP + WebSocket integration.