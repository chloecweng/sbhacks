import React from "react";
import Image from "next/image";

const InputImage = ({ encodedString }) => {
  console.log(encodedString);
  return (
    <div>
      <Image
        src={`data:image/png;base64,${encodedString}`}
        alt="Base64 Decoded Image"
        width={300}
        height={300}
      />
    </div>
  );
};

export default InputImage;