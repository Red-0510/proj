// loading audio

let audio={
    "w":"sounds/tom-1.mp3",
    "a":"sounds/tom-2.mp3",
    "s":"sounds/tom-3.mp3",
    "d":"sounds/tom-4.mp3",
    "j":"sounds/snare.mp3",
    "k":"sounds/crash.mp3",
    "l":"sounds/kick-bass.mp3",
}

// for(let i in audio){
//     audio[i]=new Audio(audio[i]);
// }

// adding event listeners to buttons
let buttons=document.querySelectorAll(".drum");
buttons.forEach(button => {
    button.addEventListener("click",function(){
        let el=this;
        playDrum(el.classList[0]);
        el.classList.add("pressed");
        setTimeout(function(){
            el.classList.remove("pressed");
        },100);
    });
});

//Handling ketEvent

document.addEventListener("keydown",function(event){
    playDrum(event.key);
});
let prev_audio=null;
function playDrum(key){
    if(key in audio) {
        new Audio(audio[key]).play();
        let el=document.querySelector("."+key)
        el.classList.add("pressed");
        setTimeout(function(){
            el.classList.remove("pressed");
        },100);
    }
    return true;
}