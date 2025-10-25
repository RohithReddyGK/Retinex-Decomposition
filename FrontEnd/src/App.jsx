import { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import ImageDisplay from "./components/ImageDisplay";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000"

export default function App() {
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [file, setFile] = useState(null);

  const handleUpload = (selectedFile) => {
    setFile(selectedFile);
    setResults(null);
  };

  const handleProcess = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    setProcessing(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${BASE_URL}/process`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Error processing image:", err);
      alert("Error processing image. Make sure the backend is running.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      <img
        src="/Background Image.png"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 min-h-screen p-6 font-sans flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Illumination Correction using Retinex-Based Decomposition
        </h1>
        <p className="text-lg text-white/90 mb-8 max-w-5xl">
          Upload a grayscale or color image with uneven illumination to recover its texture and illumination map.
          This tool uses Retinex-inspired log-domain decomposition to separate reflectance (texture) and illumination.
        </p>

        <div className="flex flex-col items-center">
          <ImageUpload
            file={file}
            onUpload={handleUpload}
            onProcess={handleProcess}
            processing={processing}
          />

          {results && <ImageDisplay results={results} />}
        </div>
      </div>
    </div>
  );
}
