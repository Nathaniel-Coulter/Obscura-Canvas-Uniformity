#!/bin/bash

# === Launch Chrome with spoofed fingerprint parameters ===
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.7204.98 Safari/537.36" \
  --lang="en-US,en;q=0.9" \
  --window-size=1440,900 \
  --disable-webrtc \
  --disable-accelerated-2d-canvas \
  --disable-background-networking \
  --disable-background-timer-throttling \
  --disable-client-side-phishing-detection \
  --disable-hang-monitor \
  --disable-popup-blocking \
  --disable-default-apps \
  --no-default-browser-check \
  --no-first-run
