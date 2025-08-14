import os
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

# Video & Model
VIDEO_SOURCE = r"C:\Users\mohsi\OneDrive\Desktop\non.mp4"
# VIDEO_SOURCE = r"C:\Users\mohsi\OneDrive\Desktop\violence.mp4"
MODEL_PATH = r"C:\Users\mohsi\Downloads\best (1).pt"

# Detection/Alert Config
DETECTION_INTERVAL = 2        # run YOLO every nth frame
VIOLENCE_BUFFER_SIZE = 20
VIOLENCE_CONSECUTIVE_FRAMES = 10

def process_face(frame, box):
    x1, y1, x2, y2 = map(int, box)
    face = frame[y1:y2, x1:x2]
    if face.size == 0:
        return
    _, img_encoded = cv2.imencode(".jpg", face)
    try:
        files = {"file": (f"face_{int(time.time())}.jpg", img_encoded.tobytes(), "image/jpeg")}
        resp = requests.post(SERVER_URL + '/face_upload', files=files, data=camera_info)
        if resp.status_code == 200:
            print("✅ Face alert sent successfully!")
    except Exception as e:
        print(f"❌ Failed to send face alert: {e}")

def send_alert_to_server():
    try:
        data = {
            "camera_id": camera_info['camera_id'],
            "camera_location": camera_info['camera_location'],
            "event_type": "Violence",
        }
        resp = requests.post(SERVER_URL + '/activity_alert', json=data)
        if resp.status_code == 200:
            print("✅ Violence alert sent successfully!")
        else:
            print(f"❌ Server error {resp.status_code}")
    except Exception as e:
        print(f"❌ Failed to send alert: {e}")

def main():
    # load model & video
    model = YOLO(MODEL_PATH)
    cap = cv2.VideoCapture(VIDEO_SOURCE)
    frame_count = 0

    # prepare violence buffer
    violence_buffer = deque([0]*VIOLENCE_BUFFER_SIZE, maxlen=VIOLENCE_BUFFER_SIZE)
    activity_labels = {1: "⚠️ Violence", 2: "ℹ️ Non‑Violence"}

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        frame = cv2.flip(frame, 1)
        # convert BGR→RGB for YOLO
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # detection step
        if frame_count % DETECTION_INTERVAL == 0:
            violence_detected = False
            results = model.predict(rgb, verbose=False)
            for res in results:
                for box, conf, cls in zip(res.boxes.xyxy, res.boxes.conf, res.boxes.cls):
                    label = int(cls)
                    c = float(conf)
                    x1, y1, x2, y2 = map(int, box)

                    # draw every box
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
                    cv2.putText(frame, f"{label}:{c:.2f}", (x1, y1 - 5),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)

                    if label == 0 and c > 0.0:          # face
                        process_face(frame, (x1, y1, x2, y2))
                    elif label == 1 and c > 0.4:        # violence
                        violence_detected = True
                        print(activity_labels[label])
                    elif label == 2 and c > 0.4:        # non‑violence
                        print(activity_labels[label])

            # update buffer & send alert if threshold met
            violence_buffer.append(1 if violence_detected else 0)
            if sum(violence_buffer) >= VIOLENCE_CONSECUTIVE_FRAMES:
                send_alert_to_server()
                # reset buffer
                violence_buffer = deque([0]*VIOLENCE_BUFFER_SIZE, maxlen=VIOLENCE_BUFFER_SIZE)

        # show frame
        cv2.imshow("Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("✅ Detection complete!")

if __name__ == "__main__":
    main()
