
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
import os
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
from tensorflow.keras.optimizers.schedules import ExponentialDecay

app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload
model_path = 'experiment_43_fold_5_best_model.h5'

# Function to check if file extension is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Load the model (modify path as needed)
try:
    model = load_model(model_path, custom_objects={'ExponentialDecay': ExponentialDecay})
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    
# Class labels
CLASS_LABELS = ["Black Rot", "ESCA", "Healthy", "Leaf Blight"]

@app.route('/predict', methods=['POST'])
def predict():
    # Check if model is loaded
    if model is None:
        return jsonify({
            'error': 'model_not_loaded',
            'message': 'Model is not loaded properly'
        }), 500

    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({
            'error': 'no_file_part',
            'message': 'No file part in the request'
        }), 400

    file = request.files['file']

    # If the user does not select a file, the browser submits an empty file without a filename
    if file.filename == '':
        return jsonify({
            'error': 'no_selected_file',
            'message': 'No file selected for upload'
        }), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            # Preprocess the image
            img = cv2.imread(filepath)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = cv2.resize(img, (128, 128))
            img = img / 255.0  # Normalize to [0,1]
            img = np.expand_dims(img, axis=0)  # Add batch dimension

            # Make prediction
            prediction = model.predict(img)
            class_idx = np.argmax(prediction, axis=1)[0]
            confidence = float(prediction[0][class_idx])
            
            # Return prediction
            return jsonify({
                'prediction': CLASS_LABELS[class_idx],
                'confidence': confidence,
                'class_index': int(class_idx)
            })

        except Exception as e:
            return jsonify({
                'error': 'processing_error',
                'message': f'Error processing image: {str(e)}'
            }), 500

    return jsonify({
        'error': 'invalid_file',
        'message': 'Invalid file type'
    }), 400

if __name__ == '__main__':
    app.run(debug=True)
