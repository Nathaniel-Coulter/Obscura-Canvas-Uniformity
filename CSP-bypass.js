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

    // Only spoof values not covered by .bat
    if (spoof.deviceMemory) override(navigator, 'deviceMemory', spoof.deviceMemory);
    if (spoof.hardwareConcurrency) override(navigator, 'hardwareConcurrency', spoof.hardwareConcurrency);
    if (spoof.maxTouchPoints !== undefined) override(navigator, 'maxTouchPoints', spoof.maxTouchPoints);

    // WebGL Vendor/Renderer
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (param) {
      if (param === 37445 && spoof.gpuVendor) return spoof.gpuVendor;     // UNMASKED_VENDOR_WEBGL
      if (param === 37446 && spoof.gpuRenderer) return spoof.gpuRenderer; // UNMASKED_RENDERER_WEBGL
      return getParameter.call(this, param);
    };

    // Canvas realistic noise
    const getImageData = CanvasRenderingContext2D.prototype.getImageData;
    CanvasRenderingContext2D.prototype.getImageData = function () {
      const imageData = getImageData.apply(this, arguments);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] ^= Math.floor(Math.random() * 3);     // R
        imageData.data[i + 1] ^= Math.floor(Math.random() * 3); // G
        imageData.data[i + 2] ^= Math.floor(Math.random() * 3); // B
      }
      return imageData;
    };

    // Audio fingerprint noise
    if (spoof.spoofAudio) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        const originalGetChannelData = AC.prototype.getChannelData;
        AC.prototype.getChannelData = function () {
          const data = originalGetChannelData.apply(this, arguments);
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
