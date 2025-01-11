"use client";

import React, { useState } from "react";
import Predict from "./pages/predict";

export default function Home() {
  const [k, setK] = useState(0);
  return (
    <div className="flex flex-col justify-center items-center mx-auto">
      <Predict />
      <button onClick={() => setK(k + 1)}>Click me</button>
      <div>{k}</div>
    </div>
  );
}
