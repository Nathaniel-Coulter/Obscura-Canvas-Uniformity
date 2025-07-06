console.log("[PrivPlus] inject.js running...");

chrome.storage.local.get("spoofConfig", ({ spoofConfig }) => {
  const configScript = document.createElement("script");
  configScript.type = "application/json";
  configScript.id = "spoof-config";
  configScript.textContent = JSON.stringify(spoofConfig || {});
  document.documentElement.appendChild(configScript);

  const payload = document.createElement("script");
  payload.src = chrome.runtime.getURL("CSP-bypass.js");
  document.documentElement.appendChild(payload);

  console.log("[PrivPlus] Injected spoof config and loaded CSP-bypass.js");
});
