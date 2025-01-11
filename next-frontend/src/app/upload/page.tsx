"use client";

import React, { useState } from "react";
import InputImage from "../components/image";
import Link from "next/link";

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
    <div className="flex flex-col items-center justify-center mx-auto">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Upload Your Image Below
        </h1>
        <input
          className="w-full py-3 px-4 border border-gray-300 rounded-lg mb-4 cursor-pointer"
          type="file"
          onChange={handleFileChange}
        />
        <div
          onClick={handlePredict}
          className="w-full py-3 text-center bg-custom-blue text-white font-semibold rounded-lg cursor-pointer mb-4 hover:bg-blue-500"
        >
          Click Here to Identify
        </div>
        {result && (
          <div className="mt-4 text-lg font-semibold text-gray-600">
            <span>Prediction: </span>
            {result}
          </div>
        )}
        {imageENC && (
          <div className="mt-6">
            <div className="text-xl font-semibold text-gray-700">
              Your inputted image:
            </div>
            <div className="flex items-center justify-center mx-auto">
              <InputImage encodedString={imageENC} />
            </div>
          </div>
        )}
      </div>
      <Link className="mt-4 text-2xl border-2 p-2 rounded-2xl" href="/">
        Home
      </Link>
    </div>
  );
};

export default Predict;
