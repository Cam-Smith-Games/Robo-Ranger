//stages will be
//starting_field -> starting_forest -> infested_forest -> infested_field -> courtyard -> bossroom
//intially set view distance to 100, (with this if statement this will only happen when viewDistance does not exist, therefore not resetting every time)

sessionStorage.setItem("stage", "courtyard");

player.x = canvas.width/2-player.width/2;
player.y = canvas.height - player.height;
player.direction = "up";

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

