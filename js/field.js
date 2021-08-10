//initially set freshnoob to true to give them beginning tip
if(!sessionStorage.getItem("freshNoob")) {
	sessionStorage.setItem("freshNoob", "true");
}

//if there is currently no stage or player is coming back from starting_forest, set stage to starting_field
if(!sessionStorage.getItem("stage") || sessionStorage.getItem("stage" == "starting_forest"))
	sessionStorage.setItem("stage", "starting_field");
//if player coming from infested_forest, set stage to infested_field
if(sessionStorage.getItem("stage") == "infested_forest")
	sessionStorage.setItem("stage", "infested_field");

//play music according to stage if sound is enabled
if(sessionStorage.getItem("soundEnabled") == "true") {
	if(sessionStorage.getItem("stage") == "infested_field") evolutius.play();
	else evolutiusTitle.play();
}
//if player coming back from forest, make him/her spawn on left side of screen instead of center
if(sessionStorage.getItem("stage") == "infested_field") {
	player.x = 100;
	player.direction = "right";
}

function beginningTip(){
	context.font = "40px Georgia";
	context.fillStyle = "white";
	if(sessionStorage.getItem("freshNoob") == "true") {
		context.fillText("You're stranded on an unknown planet with nothing but a dying flashlight. Search around", 0, canvas.height*0.10);
		context.fillText("for batteries (if this planet has robots, it's gotta have batteries lying around).", 0, canvas.height*0.20);
		context.fillText("press ctrl to close tip", canvas.width/1.5 , canvas.height-50);
			//if player presses ctrl, set freshNoob to false to remove tip
			if(keys[17]) 
				sessionStorage.setItem("freshNoob", "false");
	}
}

function init() {
	//main game loop, runs every 1000/30 seconds (30fps)
	setInterval(function(){
		game();
	}, 1000/30);
	//every 5 seconds run viewDistanceShrinker which reduces viewDistance
	setInterval(function(){
		viewDistanceShrinker();
	}, 1000);
	createLevel(sessionStorage.getItem("stage"));
}

init();

