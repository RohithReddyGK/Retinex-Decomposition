import { useState } from "react";
import Lottie from "lottie-react";
import LoadingAnimation from "../assets/Loading.json";

export default function ImageUpload({ file, onUpload, onProcess, processing }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Upload Image</h2>
      <p className="text-gray-600 mb-4 text-center">
        Please upload a grayscale or color image of a textured surface under uneven illumination (e.g., paper under shadow, wall with non-uniform light).
      </p>

      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onUpload(e.target.files[0])}
          className="border p-2 rounded-md w-full"
        />

        <button
          onClick={onProcess}
          disabled={processing || !file}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {processing ? "Processing..." : "Process Image"}
        </button>
      </div>

      {processing && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <Lottie animationData={LoadingAnimation} loop={true} className="w-64 h-64" />
        </div>
      )}
    </div>
  );
}
