# Optional: Generate a depth map for the hero image using MiDaS
# Usage (set up venv and install torch, opencv-python, timm):
# python3 -m venv .venv && source .venv/bin/activate
# pip install torch torchvision opencv-python timm
# python scripts/make-depthmap.py input.jpg output.png

import sys
import cv2
import torch
import numpy as np

def main(inp, out):
    # Lightweight MiDaS via torch.hub
    model_type = "DPT_Large"
    midas = torch.hub.load("intel-isl/MiDaS", model_type)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    midas.to(device)
    midas.eval()

    transform = torch.hub.load("intel-isl/MiDaS", "transforms").dpt_transform

    img = cv2.imread(inp)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    input_batch = transform(img_rgb).to(device)

    with torch.no_grad():
        prediction = midas(input_batch)
        prediction = torch.nn.functional.interpolate(
            prediction.unsqueeze(1),
            size=img.shape[:2],
            mode="bicubic",
            align_corners=False,
        ).squeeze()

    depth = prediction.cpu().numpy()
    depth = (depth - depth.min()) / (depth.max() - depth.min() + 1e-9)
    depth_img = (depth * 255).astype(np.uint8)
    cv2.imwrite(out, depth_img)
    print(f"Saved depth map → {out}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: make-depthmap.py input.jpg output.png")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])

