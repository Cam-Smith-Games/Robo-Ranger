//set stage
sessionStorage.setItem("stage", "testroom");

//play music according if sound enabled
if(sessionStorage.getItem("soundEnabled") == "true") 
	evolutiusTitle.play();

//set player x/y
player.x = canvas.width - player.width;
player.y = canvas.height/2;

//function that handles tutorial steps and timing
function tutorial() {
	context.font = "50px Georgia";
	context.fillStyle = "red";
	//tutorial text 
	if(sessionStorage.getItem("tutorialStarted") == "true") {
		//set players view distance to 1049 during tutorial
		sessionStorage.setItem("viewDistance", 10049);
		//increase textTimer by 1 until it reaches 20
		if(Math.floor(sessionStorage.getItem("textTimer"))<40)
			sessionStorage.setItem("textTimer", Math.floor(sessionStorage.getItem("textTimer"))+1);
		//when timer == 20
		if(Math.floor(sessionStorage.getItem("textTimer"))==40) {
			//let user know he can continue now
			context.fillText("press ctrl to continue", canvas.width/1.5 , canvas.height-50);
			//if player presses ctrl, advance 1 tutorial step and reset timer to 1
			if(keys[17]) {
				sessionStorage.setItem("tutorialStep", Math.floor(sessionStorage.getItem("tutorialStep"))+1)
				sessionStorage.setItem("textTimer", 1);
			}
		}
		//if 
		if(sessionStorage.getItem("tutorialStep") == 1) 
			context.fillText("Robo Ranger Training Simulator Commencing", 0, canvas.height*0.10);
		//if 
		if(sessionStorage.getItem("tutorialStep") == 2) {
			context.fillText("Press an arrow key to shoot a laser disc.", 0, canvas.height*0.10);
			context.fillText("You will notice there is a large delay before they return", 0, canvas.height*0.20);
		}
		//if 
		if(sessionStorage.getItem("tutorialStep") == 3) {
			context.fillText("Now press space to return all discs at any time", 0, canvas.height*0.10);
			context.fillText("When a disc returns, it only refunds ammo if it kills a unit.", 0, canvas.height*0.20);
			context.fillText("Killing a unit with 500 discs only refunds 1 ammo.", 0, canvas.height*0.30);
			context.fillText("But for now, don't worry about wasting your ammo.", 0, canvas.height*0.40);
		}
		if(sessionStorage.getItem("tutorialStep") == 4) {
			context.fillText("Press Shift to blink a short distance.", 0, canvas.height*0.10);
			context.fillText("You have 5 blink charges as you can see on the bottom right.", 0, canvas.height*0.20);
			context.fillText("Blinking costs 1 blink charge, and blink charges recharge over time.", 0, canvas.height*0.30);
		}
		//
		if(sessionStorage.getItem("tutorialStep") == 5) {
			context.fillText("Now I'm sure you can imagine some of the crazy combos you can pull off", 0, canvas.height*0.10);
			context.fillText("Let's spawn some passive target dummies for you to kill", 0, canvas.height*0.20);
			context.fillText("Good luck Robo Ranger!", 0, canvas.height*0.30);

		}
		//
		if(sessionStorage.getItem("tutorialStep") == 6 && !sessionStorage.getItem("tutorialEnemiesSpawned")) {
			spawnEnemies(15);
			sessionStorage.setItem("tutorialEnemiesSpawned", "true");
		}
		//if step = 7 and all enemies killed
		if(sessionStorage.getItem("tutorialStep") == 7 && enemyList.length == 0) {
			context.fillText("Robo Ranger Training Simulator complete", 0, canvas.height/4);
		}
		//if step = 8, return to infested forest
		if(sessionStorage.getItem("tutorialStep") == 8) {
			sessionStorage.setItem("tutorialStarted", "false");
			sessionStorage.setItem("viewDistance", sessionStorage.getItem("oldViewDistance"));
			sessionStorage.setItem("stage", "infested_forest");
			window.open("forest.html", "_self");
		}

		
	}	
}

function init() {
	//create level based on current stage
	createLevel(sessionStorage.getItem("stage"));
	//main game loop, runs every 1000/30 seconds (30fps)
	setInterval(function(){
		game();
	}, 1000/30);
}

init();

