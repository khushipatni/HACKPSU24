// Play Audio
// @input Component.AudioComponent audio


function playAudio() {
    if (script.audio) {
        script.audio.play(1);
    } else {
        print("AudioComponent is not set.");
    }
}

// Add a tap event to trigger the audio
var tapEvent = script.createEvent("TapEvent");
tapEvent.bind(playAudio);