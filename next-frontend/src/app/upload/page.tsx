"use client";

import React, { useState } from "react";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handlePredict = async () => {
    if (!file) {
      setPrediction("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data.result);
      } else {
        setPrediction(data.error || "Error predicting the image.");
      }
    } catch (error) {
      console.error("Error:", error);
      setPrediction("Error connecting to the server.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      <h1 className="font-bold text-2xl">Upload an Image for Prediction</h1>

      {/* File Input */}
      <input
        type="file"
        onChange={handleFileChange}
        className="border p-2 rounded"
      />

      {/* Image Preview */}
      {imagePreview && (
        <div>
          <img
            src={imagePreview}
            alt="Image Preview"
            className="mt-4 w-64 h-64 object-cover"
          />
        </div>
      )}

      {/* Predict Button */}
      <button
        onClick={handlePredict}
        className="bg-green-500 text-white rounded p-2 mt-4"
      >
        Predict
      </button>

      {/* Prediction Result */}
      {prediction && (
        <div className="mt-4">
          <p>
            <strong>Prediction:</strong> {prediction}
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
