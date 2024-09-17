// audioControl.js

let isMuted = true;

function toggleMute() {
  const muteButton = document.getElementById('muteButton');

  if (isMuted) {
    // Unmute audio
    if (typeof backgroundSound !== 'undefined') {
      backgroundSound.setVolume(0.3); // Adjust volume as needed
      backgroundSound.loop();
    }
    if (typeof splatSound !== 'undefined') {
      splatSound.setVolume(0.2); // Adjust volume as needed
    }
    muteButton.textContent = 'Mute';
  } else {
    // Mute audio
    if (typeof backgroundSound !== 'undefined') {
      backgroundSound.setVolume(0);
      backgroundSound.stop();
    }
    if (typeof splatSound !== 'undefined') {
      splatSound.setVolume(0);
    }
    muteButton.textContent = 'Unmute';
  }

  isMuted = !isMuted;
}

// Initialize the button state and mute audio on page load
document.addEventListener('DOMContentLoaded', () => {
  const muteButton = document.getElementById('muteButton');
  muteButton.textContent = isMuted ? 'Unmute' : 'Mute';

  // Ensure the audio is muted initially
  if (typeof backgroundSound !== 'undefined') {
    backgroundSound.setVolume(0); // Start with audio muted
  }
  if (typeof splatSound !== 'undefined') {
    splatSound.setVolume(0); // Start with audio muted
  }
});
