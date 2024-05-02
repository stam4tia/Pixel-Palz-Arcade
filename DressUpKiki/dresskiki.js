var selectedClothes = [];
        
        // Preload the start audio
        var startAudio = new Audio('DressKikiStart.mp3');
        startAudio.loop = true; // Loop the start audio

        // Play the start audio when the document is loaded
        document.addEventListener('DOMContentLoaded', function() {
            startAudio.play();
        });

// Play music.mp3 when clothes_select.png is displayed
function loadClothes() {
    // Stop the start audio
    startAudio.pause();
    startAudio.currentTime = 0; // Reset the audio to the beginning

    // Start playing music.mp3
    var musicAudio = new Audio('dresskikimusic.mp3');
    musicAudio.loop = true; // Loop the music
    musicAudio.play();

    // Show the clothes select screen
    document.getElementById('start').style.display = 'none';
    document.getElementById('clothes-select').style.display = 'block';
    document.getElementById('buttons').style.display = 'block';
}

function toggleDress(dress) {
    var avatarContainer = document.getElementById('avatarContainer');

    // Check if the dress is already selected
    var existingDress = document.getElementById(dress);
    if (existingDress) {
        // If it's selected, remove it
        existingDress.remove();
        var index = selectedClothes.indexOf(dress);
        if (index !== -1) {
            selectedClothes.splice(index, 1);
        }
    } else {
        // If it's not selected, add it
        var dressImage = new Image();
        dressImage.src = dress;
        dressImage.className = 'dress';
        dressImage.id = dress;
        avatarContainer.appendChild(dressImage);
        selectedClothes.push(dress);
    }
}

        function loadStartScreen() {
            // Implement the logic to load the start screen
            // Hide other screens if visible
        }

           

        function loadFinishScreen() {
            document.getElementById('clothes-select').style.display = 'none';
            document.getElementById('finish').style.display = 'block';
        }

        function refreshPage() {
        location.reload(); // This reloads the current page
    }

    function downloadPageAsPNG() {
            // Capture the entire body using dom-to-image
            domtoimage.toPng(document.body)
                .then(function (dataUrl) {
                    // Create a temporary anchor element
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = 'Dressed_Up_Kiki.png'; // Set the filename for the downloaded image
                    link.click(); // Trigger the download
                })
                .catch(function (error) {
                    console.error('Error capturing page:', error);
                });
        }



 // Play start.mp3 when start.png is displayed
 var startAudio = new Audio('DressKikiStart.mp3');
        startAudio.loop = true;

        document.getElementById('start').addEventListener('load', function() {
            startAudio.play();
        });

    function toggleMenu() {
      var dropdownContent = document.getElementById("dropdownContent");
      dropdownContent.style.display === "none" ? dropdownContent.style.display = "block" : dropdownContent.style.display = "none";
    }
