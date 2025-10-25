from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
from Illumination import recover_reflectance_gray, recover_reflectance_color, image_to_base64
from PIL import Image

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return jsonify({"message": "Flask backend for Illumination Correction is running!"})

@app.route("/process", methods=["POST"])
def process_image():
    if "image" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["image"]
    try:
        img = Image.open(file).convert("RGB")
        img_arr = np.array(img).astype(np.float64)/255.0

        # Decide grayscale vs color
        if img_arr.ndim == 2 or img_arr.shape[2]==1:
            R_hat, L_hat = recover_reflectance_gray(img_arr)
            results = {
                "original": image_to_base64(img_arr),
                "illumination": image_to_base64(L_hat),
                "reflectance": image_to_base64(R_hat)
            }
        else:
            R_hat, L_lum = recover_reflectance_color(img_arr)
            results = {
                "original": image_to_base64(img_arr),
                "illumination": image_to_base64(L_lum),
                "reflectance": image_to_base64(R_hat)
            }
        return jsonify(results)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  
    debug = os.environ.get("FLASK_DEBUG", "True") == "True"  
    app.run(host="0.0.0.0", port=port, debug=debug)
