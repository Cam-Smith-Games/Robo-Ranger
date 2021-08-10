//play music according to stage if sound is enabled
if(sessionStorage.getItem("soundEnabled") == "true") {
	if(sessionStorage.getItem("stage") == "infested_forest") evolutius.play();
	else evolutiusTitle.play();
}
//if stage=infested_forest (coming from lake), place player on left side facing right
	if(sessionStorage.getItem("stage") == "infested_forest") {
		player.x = 100;
		player.direction = "right";
	}
//if stage=starting_forest (coming from field), place player on right side facing left
	if(sessionStorage.getItem("stage") == "starting_forest") {
		player.x = canvas.width - 150;
		player.direction = "left";
	}

function init() {
	//create level based on current stage
	createLevel(sessionStorage.getItem("stage"));
	//main game loop, runs every 1000/30 seconds (30fps)
	setInterval(function(){
		game();
	}, 1000/30);
	//every 5 seconds run viewDistanceShrinker which reduces viewDistance
	setInterval(function(){
		viewDistanceShrinker();
	}, 1000);
	
}

init();

