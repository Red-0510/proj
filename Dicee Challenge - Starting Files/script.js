addEventListener("load",(event)=>{
    let player1;
    let player2;

    // random dice rolls
    player1=randomGen(6);
    player2=randomGen(6);


    // images object
    let images={
        1:"images/dice1.png",
        2:"images/dice2.png",
        3:"images/dice3.png",
        4:"images/dice4.png",
        5:"images/dice5.png",
        6:"images/dice6.png"
    }


    //img elements
    let img1=document.querySelector(".img1");
    let img2=document.querySelector(".img2");
    
    // updating the img in the img src
    img1.src=images[player1];
    img2.src=images[player2];

    // updating the result or h1
    let message="";
    if(player1==player2) message="Draw";
    else if(player1>player2) message="🚩 Player1 WON!";
    else message="Player2 WON! 🚩";

    document.querySelector(".container h1").innerText=message;
});

function randomGen(n){
    return Math.floor(Math.random()*n) + 1;
}