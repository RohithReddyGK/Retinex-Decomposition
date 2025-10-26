# Illumination Correction Using Retinex-Based Decomposition

![Python](https://img.shields.io/badge/Python-3.11-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.5.3-blue)
![Flask](https://img.shields.io/badge/Flask-2.3.3-lightgrey)
![Render](https://img.shields.io/badge/Deployment-Render-blue)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-blue)
[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://illumination-retinex-decomposition.vercel.app/)

---

## Table of Contents
- [Project Overview](#project-overview)
- [Algorithm Used](#algorithm-used)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
  
---

## Project Overview

This project performs **Illumination Correction** for images of textured surfaces under uneven lighting using a **Retinex-based log-domain decomposition**. It separates the observed image into:

- **Reflectance (R̂)**: The true surface texture.
- **Illumination (L̂)**: The smooth lighting component.

It works for both **grayscale and color images**, preserving color ratios in color images.

---
## Algorithm Used

**Step 1:** Convert image to floating-point RGB or grayscale
All pixel values are scaled to [0,1] for numerical stability.

**Step 2:** Why histogram equalization alone cannot recover R(x,y)
Histogram equalization redistributes pixel intensities globally. It may enhance contrast but cannot separate the lighting component from the texture. Shadows and bright spots remain entangled with the true surface texture.In simple word: It says-“Let me stretch and balance the brightness levels".But it doesn’t know: which parts are bright because of light, and which parts are bright because of surface reflectance. So, it blindly brightens or darkens everything, often ruining textures instead of fixing illumination.

**Step 3:** Log-domain decomposition
I(x,y) = R(x,y) * L(x,y) → logI = logR + logL. This linearizes the multiplicative relation into an additive one.

**Step 4:** Estimate illumination L(x,y)
Apply a large-kernel box filter via integral image on logI to compute logL, producing a smooth illumination map while ignoring high-frequency textures.

**Step 5:** Recover reflectance R(x,y)
Subtract logL from logI and exponentiate to get R̂. For color images, the same luminance logL is subtracted from each channel.

**Step 6:** Output results
Provide the original image, illumination map, and recovered reflectance, all encoded in base64 for frontend display.

### Mathematical summary:
log I(x,y) = log R(x,y) + log L(x,y)
L(x,y) ≈ box_filter(log I(x,y))
R̂(x,y) = exp(log I - log L)

---

## Features
- ✅ Supports **grayscale and color images**.  
- ✅ Separates **reflectance and illumination** effectively.  
- ✅ **Manual box filter via integral image** (no convolution libraries required).  
- ✅ **React frontend** with **Lottie animation** for processing.
- ✅ **Responsive UI** with TailwindCSS.
- ✅ **Deployed Backend** using Flask + Gunicorn on Render.
- ✅ **Deployed FrontEnd** using Vite+React + TailwindCSS on Vercel. 

---

## Demo
You can try the deployed frontend [here](https://illumination-retinex-decomposition.vercel.app/) and backend [here](https://retinex-decomposition.onrender.com/).

---

## Tech Stack
| Component       | Technology         |
|-----------------|-----------------|
| Frontend        | Vite+React, TailwindCSS, Lottie |
| Backend         | Python, Flask, Gunicorn    |
| Deployment      | Render (Backend), Vercel (Frontend) |
| Image Handling  | Numpy, PIL, imageio        |
| Visualization   | Matplotlib                |

---

## Installation

### BackEnd
```bash
# Clone repo
git clone https://github.com/RohithReddyGK/Retinex-Decomposition.git
cd Retinex-Decomposition/BackEnd

# Create virtual environment
python -m venv cnn
cnn\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run locally
python app.py
```

### FrontEnd
```bash
cd FrontEnd
npm install
npm run dev
```

---

### Usage

- Open the frontend in browser (localhost:5173 or deployed URL).
- Upload an image (grayscale or color) under uneven illumination.
- Click **Process Image**.
- View the **Original, Estimated Illumination, and Recovered Reflectance**.

---

## Deployment

### Backend
```bash
Install Gunicorn: pip install gunicorn
Add to requirements.txt

Start command in Render:
gunicorn app:app --bind 0.0.0.0$PORT
```

### Frontend
```bash
Set VITE_BACKEND_URL in Vercel environment variables.
Deploy using npm run build or Vercel’s automatic deployment.
```

---

## 🧾 PDF & Colab Integration

After successful processing:
- Click “**Download PDF Report**” to export a detailed summary
- Click “**Run in Google Colab**” to explore the notebook interactively

---

## 🙋‍♂️ Author

**Rohith Reddy.G.K**  
🔗 [GitHub Profile](https://github.com/RohithReddyGK)  
🔗 [LinkedIn Profile](https://www.linkedin.com/in/rohithreddygk)

---

### 🌟 **If you like this project, give it a ⭐ **
