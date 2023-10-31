chrome.runtime.onInstalled.addListener(function() {
    console.log('Extension installed');
  });
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "getNetworkSpeed") {
      getNetworkSpeed(function(networkSpeed) {
        sendResponse({ networkSpeed: networkSpeed });
      });
      return true;
    }
  });
  function getNetworkSpeed(callback) {
    const startTime = performance.now();
    fetch('https://speed.cloudflare.com/__down?bytes=1000000')
      .then(response => response.blob())
      .then(blob => {
        const endTime = performance.now();
        const durationInMs = endTime - startTime;
        const fileSizeInBits = blob.size * 8;
        const speedBps = fileSizeInBits / (durationInMs / 1000);
        const speedMbps = (speedBps / (1024 * 1024)).toFixed(2);
        callback(`${speedMbps} Mbps`);
      })
      .catch(error => {
        console.error('Error fetching network speed:', error);
        callback('Error');
      });
  }
  