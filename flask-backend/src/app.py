from flask import Flask, request, render_template, jsonify
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Set up a folder to store uploaded images (change path as needed)
UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Set allowed file extensions for uploaded images
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Function to check allowed file types
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route to serve the HTML page
@app.route('/')
def index():
    return render_template('index.html')  # This will load your HTML file

# Route to handle image upload and prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'result': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'result': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        # Securely save the file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Here, you'll use your plant classifier to make a prediction
        # For example, using a pre-trained model like TensorFlow, PyTorch, etc.
        # For simplicity, let's just return a mock prediction
        prediction = "Rose"  # Replace with actual model prediction logic
        
        return jsonify({'result': prediction})
    return jsonify({'result': 'Invalid file format'}), 400

if __name__ == '__main__':
    app.run(debug=True)