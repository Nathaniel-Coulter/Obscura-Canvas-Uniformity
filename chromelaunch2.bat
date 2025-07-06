@echo off
REM === Launch Chrome with spoofed fingerprint parameters ===
start chrome.exe ^
  --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.113 Safari/537.36" ^
  --lang="en-US,en;q=0.9" ^
  --window-size=1440,900 ^
  --disable-webrtc ^
  --disable-accelerated-2d-canvas ^
  --disable-background-networking ^
  --disable-background-timer-throttling ^
  --disable-client-side-phishing-detection ^
  --disable-hang-monitor ^
  --disable-popup-blocking ^
  --disable-default-apps ^
  --no-default-browser-check ^
  --no-first-run
