import numpy as np
from PIL import Image
import io
import base64

def integral_image(img):
    """Compute integral image."""
    h, w = img.shape
    S = np.zeros((h+1, w+1), dtype=np.float64)
    S[1:, 1:] = np.cumsum(np.cumsum(img, axis=0), axis=1)
    return S

def box_filter_via_integral(img, kh, kw):
    """Apply box filter using integral image."""
    h, w = img.shape
    S = integral_image(img)
    ys = np.arange(h)
    xs = np.arange(w)
    Y, X = np.meshgrid(ys, xs, indexing='ij')

    y1 = (Y - kh//2).clip(0, h)
    x1 = (X - kw//2).clip(0, w)
    y2 = (Y + kh//2 + 1).clip(0, h)
    x2 = (X + kw//2 + 1).clip(0, w)

    s = S[y2, x2] - S[y1, x2] - S[y2, x1] + S[y1, x1]
    area = (y2 - y1) * (x2 - x1)
    area = np.where(area == 0, 1, area)
    return s / area

def recover_reflectance_gray(I, kh=101, kw=101, eps=1e-6):
    """Recover reflectance and illumination for grayscale."""
    I = np.clip(I, eps, 1.0)
    i = np.log(I + eps)
    l = box_filter_via_integral(i, kh, kw)
    r = i - l
    R_hat = np.exp(r)
    L_hat = np.exp(l)

    # Normalize to [0,1] for consistent display
    R_hat /= R_hat.max()
    L_hat /= L_hat.max()
    return R_hat, L_hat

def recover_reflectance_color(I_color, kh=101, kw=101, eps=1e-6):
    """Recover reflectance and illumination for color image, preserving ratios."""
    R, G, B = I_color[...,0], I_color[...,1], I_color[...,2]
    # Compute luminance
    lum = 0.2989*R + 0.5870*G + 0.1140*B
    lum = np.clip(lum, eps, 1.0)
    iY = np.log(lum + eps)
    lY = box_filter_via_integral(iY, kh, kw)
    L_lum = np.exp(lY)

    # Recover reflectance per channel, preserving ratios
    R_hat_channels = []
    for c in range(3):
        Ic = np.clip(I_color[...,c], eps, 1.0)
        i_c = np.log(Ic + eps)
        r_c = i_c - lY
        R_hat_c = np.exp(r_c)
        R_hat_channels.append(R_hat_c)
    R_hat = np.stack(R_hat_channels, axis=-1)

    # Normalize to [0,1] while preserving ratios
    max_val = R_hat.max()
    if max_val > 0:
        R_hat /= max_val
    L_lum /= L_lum.max()

    return R_hat, L_lum

def image_to_base64(img_array):
    """Convert image array to base64 for UI."""
    img_array = np.clip(img_array,0,1)
    img_array = (img_array*255).astype(np.uint8)
    if img_array.ndim == 2:
        pil_img = Image.fromarray(img_array, mode='L')
    else:
        pil_img = Image.fromarray(img_array)
    buffered = io.BytesIO()
    pil_img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()
