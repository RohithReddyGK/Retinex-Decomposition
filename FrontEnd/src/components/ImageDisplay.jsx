import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ImageDisplay({ results }) {
  if (!results) return null;

  const images = [
    {
      key: "original",
      title: "Original Image",
      desc: "The uploaded image shows the texture under uneven illumination. Non-uniform lighting creates shadows or bright spots, making it difficult to analyze the true texture."
    },
    {
      key: "illumination",
      title: "Estimated Illumination",
      desc: "This smooth illumination map L̂(x,y) is extracted by applying a low-pass filter in the log domain. It captures lighting variations while ignoring fine texture details."
    },
    {
      key: "reflectance",
      title: "Recovered Reflectance",
      desc: "The reflectance image R̂(x,y) represents the true surface texture. By subtracting the illumination map in the log domain and exponentiating, we remove lighting effects while preserving fine details."
    }
  ];

  const handleDownloadPDF = async () => {
    const element = document.getElementById("results-section");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("Illumination_Correction_Results.pdf");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-5xl mx-auto mt-8 space-y-6" id="results-section">
      <h2 className="text-2xl font-semibold text-center mb-4">Processing Overview</h2>
      <div className="text-gray-700 mb-6">
        <p>
          <strong>Step 1: Convert image to floating-point RGB or grayscale</strong>
          <br />
          All pixel values are scaled to [0,1] for numerical stability.
        </p>
        <p className="mt-2">
          <strong>Step 2: Why histogram equalization alone cannot recover R(x,y)</strong>
          <br />
          Histogram equalization redistributes pixel intensities globally. It may enhance contrast but cannot separate the lighting component from the texture. Shadows and bright spots remain entangled with the true surface texture.
          <strong>In simple word:</strong> It says-“Let me stretch and balance the brightness levels".But it doesn’t know: <strong>which parts are bright because of light,</strong> and <strong>which parts are bright because of surface reflectance.</strong> So, it blindly brightens or darkens everything, often ruining textures instead of fixing illumination.
        </p>
        <p className="mt-2">
          <strong>Step 3: Log-domain decomposition</strong>
          <br />
          I(x,y) = R(x,y) * L(x,y) → logI = logR + logL.
          This linearizes the multiplicative relation into an additive one.
        </p>
        <p className="mt-2">
          <strong>Step 4: Estimate illumination L(x,y)</strong>
          <br />
          Apply a large-kernel box filter via integral image on logI to compute logL, producing a smooth illumination map while ignoring high-frequency textures.
        </p>
        <p className="mt-2">
          <strong>Step 5: Recover reflectance R(x,y)</strong>
          <br />
          Subtract logL from logI and exponentiate to get R̂. For color images, the same luminance logL is subtracted from each channel.
        </p>
        <p className="mt-2">
          <strong>Step 6: Output results</strong>
          <br />
          Provide the original image, illumination map, and recovered reflectance, all encoded in base64 for frontend display.
        </p>
        <p className="mt-2">
          <strong>Mathematical summary:</strong>
          <br />
          <em>log I(x,y) = log R(x,y) + log L(x,y)</em>
          <br />
          <em>L(x,y) ≈ box_filter(log I(x,y))</em>
          <br />
          <em>R̂(x,y) = exp(log I - log L)</em>
        </p>
      </div>

      {images.map((img) => (
        <div key={img.key} className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <img
            src={`data:image/png;base64,${results[img.key]}`}
            alt={img.title}
            className="w-full md:w-1/2 rounded border"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-xl mb-2">{img.title}</h3>
            <p className="text-gray-700 mb-2">{img.desc}</p>
            <p className="text-gray-500 text-sm">
              Algorithm Info: <br />
              {img.key === "original" && "Histogram equalization alone cannot separate illumination from texture. Shadows and highlights remain entangled with the true surface pattern, making accurate recovery impossible without log-domain decomposition and smoothing."}
              {img.key === "illumination" && "Smooth lighting pattern extracted via integral-image based box filter. Captures global lighting variations."}
              {img.key === "reflectance" && "Reflectance obtained by subtracting illumination in log domain and exponentiating. Preserves texture details and removes shadows/highlights."}
            </p>
          </div>
        </div>
      ))}

      <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Download Results as PDF
        </button>

        <a
          href="https://colab.research.google.com/drive/1EnH47kRc33qdMht74zdh7E6ZR2iClisy?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Run in Google Colab
        </a>
      </div>
    </div>
  );
}
