let answer=[];
let player=[];
let buttonColors=["green","red","blue","yellow"];
let start=false;
let level=0;

$(document).click(function(){
    if(!start){
        answer=[];
        player=[];
        console.log(level,answer);
        level=0;
        start=true;
        nextSequence();
    }
});

$(".btn").click(function(){
    if(start){
        let colour=$(this).attr("id");
        player.push(colour);
        playSound(colour);
        animatePress(colour);
        check(player.length-1);
    }
});

function check(index){
    if(answer[index]===player[index]){
        if(index==answer.length-1){
            setTimeout(function(){
                nextSequence();
            },1000);
        }
    }
    else{
        playSound("wrong");
        $("body").addClass("game-over")
        $("#level-title").text("Press A Key To Start");
        setTimeout(function(){
            $("body").removeClass("game-over");
            start=false;
        },1000);
    }
}

function nextSequence(){
    player=[];
    level++;
    $("#level-title").text("Level: "+level);
    let randomNumber=Math.floor(Math.random()*4);
    let colour=buttonColors[randomNumber];
    answer.push(colour);
    $("#"+colour).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(colour);
}

function animatePress(colour){
    $("#"+colour).addClass("pressed");
    setTimeout(function(){
        $("#"+colour).removeClass("pressed");
    },100);
}

function playSound(colour){
    audio=new Audio("sounds/"+colour+".mp3");
    audio.play();
}
