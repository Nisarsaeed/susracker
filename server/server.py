from flask import Flask, request, jsonify
from flask_socketio import SocketIO
import cv2
import dlib
import numpy as np
import base64
from datetime import datetime
from collections import defaultdict
from db import criminals_collection
import time
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Face recognition models
face_detector = dlib.get_frontal_face_detector()
face_recognition_model = dlib.face_recognition_model_v1(r"D:\FYP\dependencies\dlib_face_recognition_resnet_model_v1.dat")
shape_predictor = dlib.shape_predictor(r"D:\FYP\dependencies\shape_predictor_5_face_landmarks.dat")

Alert_Cooldown_time = 5

class CriminalDatabase:
    def __init__(self):
        self.encodings = {}
        self.names = {}
        self.images = {}
        
    def load(self, db_collection):
        criminals = db_collection.find({}, {"_id": 1, "name": 1, "image": 1})
        for criminal in criminals:
            try:
                criminal_id = str(criminal["_id"])
                image_data = base64.b64decode(criminal["image"].split(",")[1].strip())
                nparr = np.frombuffer(image_data, np.uint8)
                image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                
                if image is not None:
                    encoding = self._get_face_encoding(image)
                    if encoding is not None:
                        self.encodings[criminal_id] = encoding
                        self.names[criminal_id] = criminal["name"]
                        self.images[criminal_id] = criminal["image"]
                        print(f"Loaded criminal {criminal['name']} with ID {criminal_id}")
            except Exception as e:
                print(f"Error loading criminal {criminal.get('name', 'Unknown')}: {str(e)}")

    def _get_face_encoding(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_detector(gray)
        if len(faces) == 0:
            return None
        shape = shape_predictor(gray, faces[0])
        return np.array(face_recognition_model.compute_face_descriptor(image, shape))

class AlertCooldown:
    def __init__(self):
        self.cooldown = Alert_Cooldown_time
        self.last_alerts = defaultdict(dict)  # {camera_id: {criminal_id: timestamp}}
        
    def should_alert(self, camera_id, criminal_id):
        last_time = self.last_alerts[camera_id].get(criminal_id, 0)
        if (datetime.now().timestamp() - last_time) < self.cooldown:
            print(f"Alert suppressed for camera {camera_id} and criminal {criminal_id}.")
            return False
        self.last_alerts[camera_id][criminal_id] = datetime.now().timestamp()
        return True

# Initialize components
criminal_db = CriminalDatabase()
alert_cooldown = AlertCooldown()  # 30 seconds cooldown

@app.route("/face_upload", methods=["POST"])
def upload_image():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
        
    camera_id = request.form.get("camera_id", "unknown_camera")
    print(camera_id)
    file = request.files["file"]
    
    try:
        image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        if image is None:
            return jsonify({"error": "Invalid image"}), 400

        face_encoding = criminal_db._get_face_encoding(image)
        if face_encoding is None:
            return jsonify({"message": "No face detected"}), 200

        # Find ALL matches first
        matches = []
        for criminal_id, db_encoding in criminal_db.encodings.items():
            distance = np.linalg.norm(db_encoding - face_encoding)
            if distance < 0.6:  # Match threshold
                matches.append((criminal_id, distance))

        if matches:
            # Sort by distance (best match first)
            matches.sort(key=lambda x: x[1])
            best_match_id, best_distance = matches[0]
            
            if alert_cooldown.should_alert(camera_id, best_match_id):
                # Encode detected face
                _, img_encoded = cv2.imencode('.jpg', image)
                detected_face = base64.b64encode(img_encoded).decode('utf-8')

                match_data = {
                    "criminal_id": best_match_id,
                    "name": criminal_db.names[best_match_id],
                    "confidence": f"{100 - (best_distance*100):.2f}%",
                    "timestamp": datetime.now().isoformat(),
                    "camera_id": camera_id,
                    "camera_location": request.form.get("camera_location", "unknown_location"),
                    "detected_face": detected_face,
                    "criminal_image": criminal_db.images[best_match_id],
                    "alert_type": 1
                }
                socketio.emit('alert', match_data)
                return jsonify({"message": "Match found", "match": match_data}), 200
            else:
                return jsonify({"message": "Match found but in cooldown"}), 200
                
        return jsonify({"message": "No match found"}), 200

    except Exception as e:
        print(f"Server error: {str(e)}")  # Log the actual error
        return jsonify({"error": "Internal server error"}), 500

@app.route("/activity_alert", methods=["POST"])
def activity_alert():
    try:
        data = request.json
        data.update({
            "alert_type": 2,
            "timestamp": datetime.now().isoformat(),
            "camera_id": data.get("camera_id", "unknown_camera")
        })
        socketio.emit('alert', data)
        return jsonify({"message": "Alert sent"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Load criminal database from your MongoDB collection
    criminal_db.load(criminals_collection)
    
    socketio.run(app, host="0.0.0.0", port=5000)