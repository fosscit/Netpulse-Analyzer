document.addEventListener('DOMContentLoaded', function () {
  const speedDisplay = document.getElementById('speed-text');

  function updateSpeed(currentSpeed) {
      speedDisplay.textContent = `${currentSpeed} Mbps`;
      const needle = document.getElementById('needle');
      const angle = (currentSpeed / 120) * 180; // Adjust the factor as per the scale of the speedometer
      needle.style.transform = `rotate(${angle - 90}deg)`;
  }

  function getNetworkSpeed() {
      const startTime = performance.now();
      fetch('https://speed.cloudflare.com/__down?bytes=1000000')
          .then(response => response.blob())
          .then(blob => {
              const endTime = performance.now();
              const durationInMs = endTime - startTime;
              const fileSizeInBits = blob.size * 8;
              const speedBps = fileSizeInBits / (durationInMs / 1000);
              const speedMbps = (speedBps / (1024 * 1024)).toFixed(2);
              updateSpeed(speedMbps);
          })
          .catch(error => {
              console.error('Error fetching network speed:', error);
              updateSpeed('Error');
          });
  }

  // Call the function initially and then set the interval to update the speed
  getNetworkSpeed();
  setInterval(getNetworkSpeed, 1000); // Update the speed every 1 second
});
