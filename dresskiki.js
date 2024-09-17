let startAudio = new Audio('/DressUpKiki/DressKikiStart.mp3');
let musicAudio;
let isMuted = true; // start with audio muted

startAudio.loop = true;
startAudio.volume = 0; // initially muted


// function to toggle mute/unmute
function toggleMute() {
    if (isMuted) {
        startAudio.volume = 1; // unmute start audio
        if (musicAudio) musicAudio.volume = 1; // unmute music if it's playing
        document.getElementById('mute-toggle').textContent = 'Mute'; // update button text
    } else {
        startAudio.volume = 0; // mute start audio
        if (musicAudio) musicAudio.volume = 0; // mute music if it's playing
        document.getElementById('mute-toggle').textContent = 'Unmute'; // update button text
    }
    isMuted = !isMuted; // toggle mute state
}


// wait for user interaction to play audio
document.addEventListener('DOMContentLoaded', function() {
    // ensure mute button exists and bind click event to mute function
    const muteToggleButton = document.getElementById('mute-toggle');
    
    if (muteToggleButton) {
        muteToggleButton.addEventListener('click', function() {
            if (startAudio.paused) {
                startAudio.play(); // start audio on user interaction (unmute)
            }
            toggleMute();
        });
    }
});



// play music.mp3 when clothes_select.png is displayed
function loadClothes() {
    startAudio.pause();
    startAudio.currentTime = 0; // reset the audio to the beginning

    musicAudio = new Audio('/DressUpKiki/dresskikimusic.mp3');
    musicAudio.loop = true; // loop the music
    musicAudio.volume = isMuted ? 0 : 1; // set initial volume based on mute state
    musicAudio.play(); // play the music

    // show the clothes select screen
    document.getElementById('start').style.display = 'none';
    document.getElementById('clothes-select').style.display = 'block';
    document.getElementById('buttons').style.display = 'block';
}

// toggle dress function remains the same
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
            // create a temporary anchor element
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'Dressed_Up_Kiki.png'; // set the filename for the downloaded image
            link.click(); // trigger the download
        })
        .catch(function (error) {
            console.error('Error capturing page:', error);
        });
}

// play start.mp3 when start.png is displayed
startAudio = new Audio('/DressUpKiki/DressKikiStart.mp3');
startAudio.loop = true;

document.getElementById('start').addEventListener('load', function() {
    startAudio.play();
});

function toggleMenu() {
    var dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.style.display === "none" ? dropdownContent.style.display = "block" : dropdownContent.style.display = "none";
}
