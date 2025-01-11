from flask import Flask, request, render_template, jsonify
import os
from werkzeug.utils import secure_filename
from PIL import Image  # Fixed import
import torch
from torchvision import transforms, models
from torchvision.models import ResNet18_Weights

app = Flask(__name__)

# Set up a folder to store uploaded images
UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Pretrained model setup
# Use pretrained ResNet-18 with ImageNet weights
model = models.resnet18(weights=ResNet18_Weights.DEFAULT)
model.eval()  # Set to evaluation mode

# Load filtered animal-related class labels
try:
    with open('animal_classes.txt') as f:  # Use the filtered animal classes
        animal_classes = [line.strip() for line in f.readlines()]
except FileNotFoundError:
    print("Error: 'animal_classes.txt' file not found. Ensure the file exists in the same directory.")
    animal_classes = None

# Load full ImageNet class labels
try:
    with open('imagenet_classes.txt') as f:
        full_class_labels = [line.strip() for line in f.readlines()]
except FileNotFoundError:
    print("Error: 'imagenet_classes.txt' file not found. Ensure the file exists in the same directory.")
    full_class_labels = None

# Preprocess image
def preprocess_image(image_path):
    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    image = Image.open(image_path).convert('RGB')  # Convert to RGB
    return preprocess(image).unsqueeze(0)  # Add batch dimension

@app.route('/')
def index():
    return render_template('index.html')  # Ensure this file exists in `templates/`

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'result': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'result': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            # Preprocess and predict
            input_tensor = preprocess_image(filepath)
            with torch.no_grad():
                outputs = model(input_tensor)
                _, predicted_class_idx = torch.max(outputs, 1)
            
            # Get the full class label from ImageNet
            full_prediction = full_class_labels[predicted_class_idx.item()] if full_class_labels else "Unknown"

            # Check if the prediction is an animal class
            if animal_classes and full_prediction in animal_classes:
                prediction = full_prediction
            else:
                prediction = "Unknown"

            # Delete the uploaded file
            os.remove(filepath)
            return jsonify({'result': prediction})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'result': 'Invalid file format'}), 400

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)