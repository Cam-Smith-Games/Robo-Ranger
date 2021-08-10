function createLevel(stage) {
	if (stage == "starting_field") {
		spawnBatteries(5);
		spawnTrees(16);
	}
	if (stage == "starting_forest") {
		spawnBatteries(5);
		spawnTrees(25);
	}
	if (stage == "infested_forest") {
		spawnBatteries(3);
		spawnTrees(25);
		spawnEnemies(35);
		spawnAmmo(3);
	}
	if (stage == "infested_field") {
		spawnBatteries(5);
		spawnTrees(16);
		spawnEnemies(35);
		spawnAmmo(3);
	}
	if (stage == "bossroom") {
		//spawn ammo every 10 seconds
		/*setInterval(function(){
			spawnAmmo(1);
		}, 10000);*/
	}
}

function spawnBatteries(numberToSpawn) {
		for(i=0; i<numberToSpawn; i++) {
			newBattery = new Battery(Math.random()*(canvas.width*0.80), Math.random()*(canvas.height*0.80));
			batteryList.push(newBattery);
		}	
	}
function spawnTrees(numberToSpawn) {
	
	//my attempt at spawning things randomly yet semi-uniformly
	//create square grid based on square root of number of items being spawned
	gridSize = Math.sqrt(numberToSpawn);
	gridWidth = Math.floor(canvas.width / gridSize);
	gridHeight = Math.floor(canvas.height / gridSize);
	//spawn trees in random spots on each square in grid
	for(i=0; i<numberToSpawn; i++) {
		//draw tree with random color (sprite x position between 0-3)
		var xSpritePosition = Math.floor(Math.random()*4) * treeSprite.frameWidth;
		//current grid x position + random number between 0 and gridWidth
		var xPos = ((i%gridSize)*gridWidth) + (Math.random()*gridWidth);
		//current grid y position + random number between 0 and gridHeight
		var yPos = (Math.floor(i/gridSize)*gridHeight) + (Math.random()*gridHeight);
		//xLoc, yLoc, width, height, imageWidth, imageHeight, sprite position (for color)
		newTree = new Scenery(xPos, yPos, 25, 30, 95, 117, xSpritePosition);
		//only add newTree to list if its not within distance of any entrance
		if (!(Math.sqrt(Math.pow(newTree.x-forestEntrance.x, 2) + Math.pow(newTree.y-forestEntrance.y, 2)) <= 150 ||
		Math.sqrt(Math.pow(newTree.x-teleporter.x, 2) + Math.pow(newTree.y-teleporter.y, 2)) <= 150 ||
		Math.sqrt(Math.pow(newTree.x-forestExit.x, 2) + Math.pow(newTree.y-forestExit.y, 2)) <= 150 ||
		Math.sqrt(Math.pow(newTree.x-castleEntrance.x, 2) + Math.pow(newTree.y-castleEntrance.y, 2)) <= 150))
			treeList.push(newTree);
		
	}
}
	
function spawnEnemies(numberToSpawn) {
	//only draw enemies if theyre not colliding with trees, other enemies, or player
	for(i=0; i<numberToSpawn; i++) {
		//create new enemy
		newEnemy = new Enemy(64, 64);
		enemyCollision = false;
		//go through lists of trees, if new enemy collides with tree set collision to true
		for(j=0; j<treeList.length; j++) {
			if (collision(newEnemy, treeList[j])) 
				enemyCollision = true;	
		}
		//go through list of enemies, if new enemy collides with another enemy, set collision to true
		for(k=0; k<enemyList.length; k++) {
			if (collision(newEnemy, enemyList[k]))
				enemyCollision = true;
		}
		//if enemy colliding with player, set collision to true
		if (collision(newEnemy, player))
		enemyCollision = true;
		//if no collision add enemy to list
		if(!enemyCollision)
			enemyList.push(newEnemy)
		//if collision, reset i and start over
		else i--;
	}	
}
	function spawnAmmo(numberToSpawn) {
		for(i=0; i<numberToSpawn; i++) {
			newAmmo = new Ammo(Math.random()*canvas.width*0.80, Math.random()*canvas.height*0.80);
			ammoList.push(newAmmo);
		}
	}

