import torch
from torchvision import models

# Initialize a ResNet-18 model with rand weight
model = models.resnet18(pretrained=False)  # No pretrained weights
model.fc = torch.nn.Linear(model.fc.in_features, 3)  # Adjust the final layer for 3 classes

# Save model weight to file 
torch.save(model.state_dict(), 'model.pth')
print("Randomly initialized model saved as 'model.pth'") 


import os
print("Current working directory:", os.getcwd())