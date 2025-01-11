from flask import Flask, request, render_template, jsonify
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
import base64
from PIL import Image  # Fixed import
import torch
from torchvision import transforms, models
from torchvision.models import ResNet18_Weights

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

# Pretrained model setup
# Use pretrained ResNet-18 with ImageNet weights
model = models.resnet18(weights=ResNet18_Weights.DEFAULT)
model.eval()  # Set to evaluation mode

# Load ImageNet class labels
try:
    with open('src/imagenet_classes.txt') as f:
        class_labels = [line.strip() for line in f.readlines()]
except FileNotFoundError:
    print("Error: 'imagenet_classes.txt' file not found. Ensure the file exists in the same directory.")
    class_labels = None

# Preprocess image
def preprocess_image(image_path):
    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    image = Image.open(image_path).convert('RGB')  # Convert to RGB
    return preprocess(image).unsqueeze(0)  # Add batch dimension

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
        
        input_tensor = preprocess_image(filepath)
        with torch.no_grad():
            outputs = model(input_tensor)
            _, predicted_class = torch.max(outputs, 1)
        prediction = class_labels[predicted_class.item()] if class_labels else "Unknown"
        
        return jsonify({'result': prediction, 'image_data': encoded_string}), 200
    return jsonify({'result': 'Invalid file format'}), 400

if __name__ == '__main__':
    app.run(debug=True)