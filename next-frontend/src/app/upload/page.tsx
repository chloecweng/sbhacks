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
      console.log(file);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          setResult("error1");
          throw new Error("problem predicting image");
        }
        const data = await res.json();
        setResult(data.result);
        setImageENC(data.image_data);
      } catch (e) {
        console.error(e);
        setResult("error2");
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col space-y-4 mt-8 ml-4">
        <h1>
          <b>Animal Classifier!</b>
        </h1>
        <input
          className="flex flex-col"
          type="file"
          onChange={handleFileChange}
        />
        <div className="hover:cursor-grab" onClick={handlePredict}>
          Predict
        </div>
        {result && (
          <div>
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
