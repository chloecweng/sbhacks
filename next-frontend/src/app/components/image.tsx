import React from "react";
import Image from "next/image";

// Define the props type
interface InputImageProps {
  encodedString: string; // encodedString should be a string (base64 encoded)
}

const InputImage: React.FC<InputImageProps> = ({ encodedString }) => {
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

