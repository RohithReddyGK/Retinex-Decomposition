import { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import ImageDisplay from "./components/ImageDisplay";

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
      const res = await fetch("http://localhost:5000/process", {
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
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-4xl font-bold text-center mb-4 text-blue-700">
        Illumination Correction using Retinex-Based Decomposition
      </h1>
      <p className="text-center text-lg text-gray-700 mb-8">
        Upload a grayscale or color image with uneven illumination to recover its texture and illumination map. 
        This tool uses Retinex-inspired log-domain decomposition to separate reflectance (texture) and illumination.
      </p>

      <ImageUpload 
        file={file} 
        onUpload={handleUpload} 
        onProcess={handleProcess} 
        processing={processing} 
      />

      {results && <ImageDisplay results={results} />}
    </div>
  );
}
