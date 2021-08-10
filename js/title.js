//create and add canvas to body of document
var canvas = document.createElement('canvas');
canvas.id = "mainCanvas";
canvas.width = window.innerWidth*0.75;
canvas.height = window.innerWidth*0.45;
document.body.appendChild(canvas);
//not 100% sure what context is but its needed to draw/fill things to canvas
var context = canvas.getContext("2d");
//setting images
var background = document.createElement("img");
	background.src = "img/titlescreen.png";
	background.width = canvas.width;
	background.height = canvas.height;
var pressSpaceIMG = document.createElement("img");
pressSpaceIMG.src = "img/pressspace.png";

var titlemusic = new Audio("audio/EvolutiusTitle.ogg")
titlemusic.play();


var pressSpace = {
	width: 431,
	height: 19,
	x: canvas.width/2 - 215,
	y: canvas.height/3
}
//create sprite for pressSpace
var pressSpaceSprite = new Sprite({
	width: 431,
	height: 152,
	image: pressSpaceIMG,
	frameWidth: 431,
	frameHeight: 19,
	frameCount: 8
})

var keys = []; 

window.addEventListener("keydown", function(e){
	//if key pressed, set its keycode in keys array to true
	keys[e.keyCode] = true;
});



function update() {
	//if player presses space, continue
	if(keys[32])
		//take user to field.html
		window.open("field.html", "_self");

	pressSpaceSprite.frameIndex++;	
	if (pressSpaceSprite.frameIndex == pressSpaceSprite.frameCount) pressSpaceSprite.frameIndex = 0;
}

function render() {
	console.log(pressSpace.y);
	//clear all before redrawing
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(background, 0, 0, background.width, background.height);


	context.drawImage(pressSpaceIMG, 0, pressSpaceSprite.frameHeight * pressSpaceSprite.frameIndex,
	pressSpaceSprite.frameWidth, pressSpaceSprite.frameHeight, pressSpace.x, pressSpace.y, 
	pressSpaceSprite.frameWidth, pressSpaceSprite.frameHeight);
	
}


setInterval(function(){
	update();
	render();
}, 1000/5)
