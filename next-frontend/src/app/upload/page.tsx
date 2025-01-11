"use client";

import React, { useState } from "react";
import InputImage from "../components/image";

const Predict = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [imageENC, setImageENC] = useState();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!file) {
      setResult("No file selected");
    } else {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          setResult("There was an error...");
          throw new Error("problem predicting image");
        }
        const data = await res.json();
        setResult(data.result);
        setImageENC(data.image_data);
      } catch (e) {
        console.error(e);
        setResult("There was an error...");
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center mx-autospace-y-4 mt-8 ml-4 space-y-6">
        <h1>
          <b className="text-6xl">Animal Classifier!</b>
        </h1>
        <input type="file" onChange={handleFileChange} />
        <button
          className="hover:cursor-grab border rounded p-2"
          onClick={handlePredict}
        >
          Predict
        </button>
        {result && (
          <div className="text-2xl text-green-200">
            <span>Prediction: </span>
            {result}
          </div>
        )}
        {imageENC && (
          <div>
            <div>Your inputted image:</div>
            <InputImage encodedString={imageENC} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Predict;
