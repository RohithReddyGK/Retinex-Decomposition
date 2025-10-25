# Illumination Correction Using Retinex-Based Decomposition

![Python](https://img.shields.io/badge/Python-3.11-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.5.3-blue)
![Flask](https://img.shields.io/badge/Flask-2.3.3-lightgrey)
![Render](https://img.shields.io/badge/Deployment-Render-blue)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-blue)
![Live](https://illumination-retinex-decomposition.vercel.app/)

---

## Table of Contents
- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Mathematical Model](#mathematical-model)
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

## Problem Statement
Given an image \(I(x,y)\) with uneven illumination, recover:

\[
I(x,y) = R(x,y) \cdot L(x,y)
\]

where \(R(x,y)\) is the true reflectance (texture) and \(L(x,y)\) is the smooth illumination. Histogram equalization cannot achieve this separation, as it only redistributes global intensities.

---

## Mathematical Model

Take logarithm to linearize the multiplicative model:

\[
\log I(x,y) = \log R(x,y) + \log L(x,y) 
\quad \Rightarrow \quad 
\hat{R}(x,y) = \exp(\log I - \log L)
\]

For color images, illumination is estimated from luminance:

\[
Y = 0.2989 \cdot R + 0.5870 \cdot G + 0.1140 \cdot B
\]

\(\hat{R}\) per channel is recovered using the same illumination map to preserve color ratios.

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

### Deployment

## Backend
```bash
Install Gunicorn: pip install gunicorn
Add to requirements.txt

Start command in Render:
gunicorn app:app --bind 0.0.0.0$PORT
```

## Frontend
```bash
Set VITE_BACKEND_URL in Vercel environment variables.
Deploy using npm run build or Vercel’s automatic deployment.
```

---

## 🙋‍♂️ Author

**Rohith Reddy.G.K**  
🔗 [GitHub Profile](https://github.com/RohithReddyGK)  
🔗 [LinkedIn Profile](https://www.linkedin.com/in/rohithreddygk)

---

### 🌟 **If you like my portfolio, give it a ⭐ **
