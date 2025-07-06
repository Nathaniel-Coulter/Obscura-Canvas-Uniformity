document.getElementById("save").onclick = () => {
  const config = {
    gpuVendor: document.getElementById("gpuVendor").value,
    gpuRenderer: document.getElementById("gpuRenderer").value,
    hardwareConcurrency: parseInt(document.getElementById("hardwareConcurrency").value),
    deviceMemory: parseInt(document.getElementById("deviceMemory").value),
    maxTouchPoints: parseInt(document.getElementById("maxTouchPoints").value),
    spoofAudio: document.getElementById("spoofAudio").checked
  };

  chrome.storage.local.set({ spoofConfig: config }, () => {
    chrome.runtime.sendMessage({ updateBadge: true });
  });
};
