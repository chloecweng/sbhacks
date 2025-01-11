from flask import Flask, request, render_template, jsonify
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)

# Set up a folder to store uploaded images (change path as needed)
UPLOAD_FOLDER = 'src/uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Set allowed file extensions for uploaded images
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Function to check allowed file types
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route to handle image upload and prediction
@app.route('/predict', methods=['POST'])
def predict():
    if not request.files:
        return jsonify({'result': 'No file part'}), 400
    file = request.files['file']
    if file and allowed_file(file.filename):
        # Securely save the file
        # Ensure the upload directory exists
        upload_folder = app.config['UPLOAD_FOLDER']
        filename = secure_filename(file.filename)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

        with open(filepath, 'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        
        # Here, you'll use your plant classifier to make a prediction
        # For example, using a pre-trained model like TensorFlow, PyTorch, etc.
        # For simplicity, let's just return a mock prediction
        prediction = "Rose"  # Replace with actual model prediction logic
        
        return jsonify({'result': prediction, 'image_data': encoded_string}), 200
    return jsonify({'result': 'Invalid file format'}), 400

if __name__ == '__main__':
    app.run(debug=True)