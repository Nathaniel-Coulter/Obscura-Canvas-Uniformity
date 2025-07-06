(function () {
  function runSpoofing() {
    const configEl = document.getElementById("spoof-config");
    if (!configEl) return;

    const spoof = JSON.parse(configEl.textContent || "{}");

    function override(obj, prop, val) {
      try {
        Object.defineProperty(obj, prop, { get: () => val, configurable: true });
      } catch (e) {}
    }

    // 🧠 Spoof only values not overridden by .bat launch
    if (spoof.deviceMemory) override(navigator, 'deviceMemory', spoof.deviceMemory);
    if (spoof.hardwareConcurrency) override(navigator, 'hardwareConcurrency', spoof.hardwareConcurrency);
    if (spoof.maxTouchPoints !== undefined) override(navigator, 'maxTouchPoints', spoof.maxTouchPoints);

    // 🎮 WebGL spoofing
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (param) {
      if (param === 37445 && spoof.gpuVendor) return spoof.gpuVendor;
      if (param === 37446 && spoof.gpuRenderer) return spoof.gpuRenderer;
      return getParameter.call(this, param);
    };

    // 🖼️ Canvas fingerprint noise (getImageData + toDataURL)
    const getImageData = CanvasRenderingContext2D.prototype.getImageData;
    CanvasRenderingContext2D.prototype.getImageData = function () {
      const imageData = getImageData.apply(this, arguments);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] ^= 1;       // R
        imageData.data[i + 1] ^= 1;   // G
        imageData.data[i + 2] ^= 1;   // B
      }
      return imageData;
    };

    const toDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function () {
      const ctx = this.getContext("2d");
      const imageData = ctx.getImageData(0, 0, this.width, this.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] ^= 1;
        imageData.data[i + 1] ^= 1;
        imageData.data[i + 2] ^= 1;
      }
      ctx.putImageData(imageData, 0, 0);
      return toDataURL.apply(this, arguments);
    };

    // 🔊 Optional: audio fingerprint noise
    if (spoof.spoofAudio) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        const original = AC.prototype.getChannelData;
        AC.prototype.getChannelData = function () {
          const data = original.apply(this, arguments);
          for (let i = 0; i < data.length; i += 100) {
            data[i] += 0.0001;
          }
          return data;
        };
      }
    }

    console.log("[PrivPlus] Stealth spoofing applied.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runSpoofing);
  } else {
    runSpoofing();
  }
})();
