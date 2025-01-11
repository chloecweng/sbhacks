"use client";

import React, { useState } from "react";

const Predict = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
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
    } catch (e) {
      console.error(e);
      setResult("error2");
    }
  };

  return (
    <div>
      <form
        className="flex flex-col items-center justify-center mx-auto"
        onSubmit={handlePredict}
      >
        <label>Input Image</label>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" className="border">
          Predict
        </button>
        {result && result}
      </form>
    </div>
  );
};

export default Predict;
