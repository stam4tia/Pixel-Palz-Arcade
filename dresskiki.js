var selectedClothes = [];
        
        // preload the start audio
        var startAudio = new Audio('DressKikiStart.mp3');
        startAudio.loop = true; // Loop the start audio

        // play the start audio when the document is loaded
        document.addEventListener('DOMContentLoaded', function() {
            startAudio.play();
        });

// play music.mp3 when clothes_select.png is displayed
function loadClothes() {
    // Stop the start audio
    startAudio.pause();
    startAudio.currentTime = 0; // Reset the audio to the beginning

    // start playing music.mp3
    var musicAudio = new Audio('dresskikimusic.mp3');
    musicAudio.loop = true; // Loop the music
    musicAudio.play();

    //show the clothes select screen
    document.getElementById('start').style.display = 'none';
    document.getElementById('clothes-select').style.display = 'block';
    document.getElementById('buttons').style.display = 'block';
}

function toggleDress(dress) {
    var avatarContainer = document.getElementById('avatarContainer');

    // check if the dress is already selected
    var existingDress = document.getElementById(dress);
    if (existingDress) {
        // if it's selected, remove it
        existingDress.remove();
        var index = selectedClothes.indexOf(dress);
        if (index !== -1) {
            selectedClothes.splice(index, 1);
        }
    } else {
        // if it's not selected, add it
        var dressImage = new Image();
        dressImage.src = dress;
        dressImage.className = 'dress';
        dressImage.id = dress;
        avatarContainer.appendChild(dressImage);
        selectedClothes.push(dress);
    }
}

        function loadStartScreen() {
            // implement the logic to load the start screen
            // hide other screens if visible
        }

           

        function loadFinishScreen() {
            document.getElementById('clothes-select').style.display = 'none';
            document.getElementById('finish').style.display = 'block';
        }

        function refreshPage() {
        location.reload(); // this reloads the current page
    }

    function downloadPageAsPNG() {
            // capture the entire body using dom-to-image
            domtoimage.toPng(document.body)
                .then(function (dataUrl) {
                    //create a temporary anchor element
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = 'Dressed_Up_Kiki.png'; // Set the filename for the downloaded image
                    link.click(); // trigger the download
                })
                .catch(function (error) {
                    console.error('Error capturing page:', error);
                });
        }



 // play start.mp3 when start.png is displayed
 var startAudio = new Audio('DressKikiStart.mp3');
        startAudio.loop = true;

        document.getElementById('start').addEventListener('load', function() {
            startAudio.play();
        });

    function toggleMenu() {
      var dropdownContent = document.getElementById("dropdownContent");
      dropdownContent.style.display === "none" ? dropdownContent.style.display = "block" : dropdownContent.style.display = "none";
    }
