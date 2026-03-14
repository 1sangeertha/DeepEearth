"""
DeepEarth V2 — Production Model Architectures
Final models extracted from deepearth2.py notebook.

Models:
    - UNetV3: Static 2-year segmentation (12 channels → 11 classes)
    - ConvLSTMUNet: Temporal 4-year analysis (4×6 bands → 11 classes)
    - FocalLoss: Class-weighted focal loss for handling extreme imbalance
"""

import torch
import torch.nn as nn
import torch.nn.functional as F

 
# ── Building Blocks ──────────────────────────────────────────

class DoubleConvBN(nn.Module):
    """Double convolution block with BatchNorm, ReLU, and optional Dropout."""

    def __init__(self, in_c, out_c, dropout=0.1):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(in_c, out_c, 3, padding=1),
            nn.BatchNorm2d(out_c),
            nn.ReLU(inplace=True),
            nn.Dropout2d(dropout),
            nn.Conv2d(out_c, out_c, 3, padding=1),
            nn.BatchNorm2d(out_c),
            nn.ReLU(inplace=True),
        )

    def forward(self, x):
        return self.net(x)


# ── UNetV3 — Static Segmentation Model ──────────────────────

class UNetV3(nn.Module):
    """
    4-level U-Net with BatchNorm + Dropout for pixel-level segmentation.

    Input:  (B, 12, 32, 32)  — 6 spectral indices × 2 years (2019 + 2024)
    Output: (B, 11, 32, 32)  — 11 environmental change classes per pixel
    """

    def __init__(self, in_channels=12, num_classes=11):
        super().__init__()
        # Encoder
        self.enc1 = DoubleConvBN(in_channels, 64)
        self.enc2 = DoubleConvBN(64, 128)
        self.enc3 = DoubleConvBN(128, 256)
        self.enc4 = DoubleConvBN(256, 512)
        self.pool = nn.MaxPool2d(2)

        # Bottleneck
        self.bottleneck = DoubleConvBN(512, 1024)

        # Decoder with skip connections
        self.up1 = nn.ConvTranspose2d(1024, 512, 2, stride=2)
        self.dec1 = DoubleConvBN(1024, 512)
        self.up2 = nn.ConvTranspose2d(512, 256, 2, stride=2)
        self.dec2 = DoubleConvBN(512, 256)
        self.up3 = nn.ConvTranspose2d(256, 128, 2, stride=2)
        self.dec3 = DoubleConvBN(256, 128)
        self.up4 = nn.ConvTranspose2d(128, 64, 2, stride=2)
        self.dec4 = DoubleConvBN(128, 64)

        # Output
        self.final = nn.Conv2d(64, num_classes, 1)

    def forward(self, x):
        e1 = self.enc1(x)
        e2 = self.enc2(self.pool(e1))
        e3 = self.enc3(self.pool(e2))
        e4 = self.enc4(self.pool(e3))
        bn = self.bottleneck(self.pool(e4))
        d1 = self.dec1(torch.cat([self.up1(bn), e4], dim=1))
        d2 = self.dec2(torch.cat([self.up2(d1), e3], dim=1))
        d3 = self.dec3(torch.cat([self.up3(d2), e2], dim=1))
        d4 = self.dec4(torch.cat([self.up4(d3), e1], dim=1))
        return self.final(d4)


# ── ConvLSTM — Temporal Encoder ──────────────────────────────

class ConvLSTMCell(nn.Module):
    """
    Convolutional LSTM cell for spatial-temporal feature extraction.
    Processes one timestep at a time, maintaining hidden state.
    """

    def __init__(self, in_channels, hidden_channels, kernel_size=3):
        super().__init__()
        self.hidden_channels = hidden_channels
        pad = kernel_size // 2
        # All 4 gates (input, forget, output, cell) in one convolution
        self.gates = nn.Conv2d(
            in_channels + hidden_channels,
            4 * hidden_channels,
            kernel_size,
            padding=pad,
        )

    def forward(self, x, h, c):
        combined = torch.cat([x, h], dim=1)
        gates = self.gates(combined)
        gi, gf, go, gg = torch.chunk(gates, 4, dim=1)
        i = torch.sigmoid(gi)
        f = torch.sigmoid(gf)
        o = torch.sigmoid(go)
        g = torch.tanh(gg)
        c_new = f * c + i * g
        h_new = o * torch.tanh(c_new)
        return h_new, c_new


class ConvLSTMUNet(nn.Module):
    """
    ConvLSTM encoder → U-Net decoder for temporal satellite analysis.

    Input:  (B, T, C, H, W) = (B, 4, 6, 32, 32)
            4 timesteps (2019, 2021, 2023, 2024) × 6 spectral bands
    Output: (B, num_classes, H, W) = (B, 11, 32, 32)
    """

    def __init__(self, in_channels=6, hidden=64, num_classes=11):
        super().__init__()
        # Temporal encoder
        self.lstm_cell = ConvLSTMCell(in_channels, hidden)

        # U-Net decoder on final hidden state
        self.enc1 = nn.Sequential(
            nn.Conv2d(hidden, 128, 3, padding=1), nn.ReLU(inplace=True),
            nn.Conv2d(128, 128, 3, padding=1), nn.ReLU(inplace=True),
        )
        self.enc2 = nn.Sequential(
            nn.Conv2d(128, 256, 3, padding=1), nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, 3, padding=1), nn.ReLU(inplace=True),
        )
        self.pool = nn.MaxPool2d(2)
        self.bottleneck = nn.Sequential(
            nn.Conv2d(256, 512, 3, padding=1), nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, 3, padding=1), nn.ReLU(inplace=True),
        )
        self.up1 = nn.ConvTranspose2d(512, 256, 2, stride=2)
        self.dec1 = nn.Sequential(
            nn.Conv2d(512, 256, 3, padding=1), nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, 3, padding=1), nn.ReLU(inplace=True),
        )
        self.up2 = nn.ConvTranspose2d(256, 128, 2, stride=2)
        self.dec2 = nn.Sequential(
            nn.Conv2d(256, 128, 3, padding=1), nn.ReLU(inplace=True),
            nn.Conv2d(128, 128, 3, padding=1), nn.ReLU(inplace=True),
        )
        self.final = nn.Conv2d(128, num_classes, 1)

    def forward(self, x):
        B, T, C, H, W = x.shape
        h = torch.zeros(B, self.lstm_cell.hidden_channels, H, W, device=x.device)
        c = torch.zeros(B, self.lstm_cell.hidden_channels, H, W, device=x.device)
        for t in range(T):
            h, c = self.lstm_cell(x[:, t], h, c)

        e1 = self.enc1(h)
        e2 = self.enc2(self.pool(e1))
        bn = self.bottleneck(self.pool(e2))
        d1 = self.dec1(torch.cat([self.up1(bn), e2], dim=1))
        d2 = self.dec2(torch.cat([self.up2(d1), e1], dim=1))
        return self.final(d2)


# ── Focal Loss ───────────────────────────────────────────────

class FocalLoss(nn.Module):
    """
    Focal Loss for handling extreme class imbalance.
    Down-weights easy (No Change) pixels, forces model to learn minority classes.
    gamma=2.0 is standard; higher = more focus on hard cases.
    """

    def __init__(self, weight=None, gamma=2.0):
        super().__init__()
        self.gamma = gamma
        self.weight = weight

    def forward(self, inputs, targets):
        ce_loss = F.cross_entropy(
            inputs, targets, weight=self.weight, reduction="none"
        )
        pt = torch.exp(-ce_loss)
        focal = ((1 - pt) ** self.gamma) * ce_loss
        return focal.mean()


# ── Quick test ───────────────────────────────────────────────

if __name__ == "__main__":
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Test UNetV3
    unet = UNetV3().to(device)
    x_static = torch.randn(2, 12, 32, 32).to(device)
    out_static = unet(x_static)
    print(f"UNetV3:      {x_static.shape} → {out_static.shape}")
    print(f"  Params:    {sum(p.numel() for p in unet.parameters()):,}")

    # Test ConvLSTMUNet
    lstm = ConvLSTMUNet().to(device)
    x_temporal = torch.randn(2, 4, 6, 32, 32).to(device)
    out_temporal = lstm(x_temporal)
    print(f"ConvLSTMUNet: {x_temporal.shape} → {out_temporal.shape}")
    print(f"  Params:    {sum(p.numel() for p in lstm.parameters()):,}")
