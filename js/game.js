//function that updates stuff
function update(){
	console.log('x: ' + player.x);
	console.log('y: ' + player.y);
	player.viewDistance = sessionStorage.getItem("viewDistance");
	player.x += player.dx;
	player.y += player.dy;

	if (Math.abs(player.dx) > 0 || Math.abs(player.dy) > 0)
		player.moving = true;
	else if (player.dx == 0 && player.dy == 0)
		player.moving = false;
	
	cheats();
	keyPresser();
	bulletMover();
	collisionChecker();
	uiUpdater();
	playerBlinker();
	enemyShooter();

	//if on bossroom stage run boss room functions
	if(sessionStorage.getItem("stage") == "bossroom") {
		//if fight has started
		if(sessionStorage.getItem("fightStarted") == "true") {
			bossDamager();
			bossShooter();
			bossMover();
			bombUpdater();
			backgroundMover();
			//go through list of boss fireballs and move each one
			for(i=0; i<fireballList.length; i++) {
				fireballList[i].y += 10;
			}
		} 
	}
	//go through list of sprites, update their current frames
	for(i=0; i<spriteList.length; i++) {
		//sprite animation was too fast at 30fps so i used tickCounter to only update 1/4th of the time
		spriteList[i].tickCounter++;
		if (spriteList[i].tickCounter % 7 == 0) {
			spriteList[i].frameIndex++;
			spriteList[i].tickCounter = 0;
		}
		//reset to first frame at the end of each animation
		if (spriteList[i].frameIndex == spriteList[i].frameCount) spriteList[i].frameIndex = 0;
	}
	//update player sprite seperately cus its slower
	playerSprite.tickCounter++;
	if(playerSprite.tickCounter % 7) {
		playerSprite.frameIndex++;
		playerSprite.tickCounter = 0;
	}
	if (playerSprite.frameIndex == playerSprite.frameCount) playerSprite.frameIndex = 0;
	//go through list of explosions, update their currentFrames and remove them when they're finished animating
	for(i=0; i<explosionList.length; i++) {
		explosionList[i].currentFrame++;
		if (explosionList[i].currentFrame == explosionSprite.frameCount)
			explosionList.splice(i, 1);
	}
	//if player hp < 0, alert and refresh page
	if(Math.floor(sessionStorage.getItem("playerHealth")) < 0) {
		alert("You died.");
		location.reload(false);
		sessionStorage.setItem("playerHealth", 1000);
	}
}

//function that draws stuff
function render(){
	//clear all before redrawing
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	/* -------------------- STAGE SPECIFIC RENDERING -------------------- */
	//field/forest background and view distance shadow
	if(sessionStorage.getItem("stage") == "starting_field" || sessionStorage.getItem("stage") == "infested_field" ||
	sessionStorage.getItem("stage") == "starting_forest" || sessionStorage.getItem("stage") == "infested_forest") {
		//background pattern
		var BG = context.createPattern(background, "repeat");
		//fill entire canvas with black
		context.fillStyle = "black";
		context.rect(0, 0,  canvas.width, canvas.height);
		context.fill();
		//set fillstyle to background pattern
		context.fillStyle = BG;
		//draw circle for line of sight of player, then fill with background pattern
		context.beginPath();
		//radius = view distance
		context.arc(player.x+(player.width/2), player.y+(player.height/2), player.viewDistance, 0, 2*Math.PI);
		context.fill();
		//draw gradient image on player with player view distance as width
		context.drawImage(blackgradientIMG, player.x-player.viewDistance+player.width/2, player.y-player.viewDistance+player.height/2, player.viewDistance*2, player.viewDistance*2);
	}
	//field rendering
	if(sessionStorage.getItem("stage") == "starting_field" || sessionStorage.getItem("stage") == "infested_field"){
		//draw forest entrance (within view distance)
		if (Math.sqrt(Math.pow(player.x-forestEntrance.x, 2) + Math.pow(player.y-forestEntrance.y, 2)) <= player.viewDistance)
			context.drawImage(forestEntranceIMG, forestEntrance.x, forestEntrance.y, forestEntrance.width, forestEntrance.height);
		//draw castle door and walls (within view distance)
		if (Math.sqrt(Math.pow(player.x-castleEntrance.x, 2) + Math.pow(player.y-castleEntrance.y, 2)) <= player.viewDistance) {
			context.drawImage(castleEntranceIMG, castleEntrance.x, castleEntrance.y, castleEntrance.width, castleEntrance.height);
			context.drawImage(castleWallIMG, castleWall1.x, castleWall1.y, castleWall1.width, castleWall1.height);
			context.drawImage(castleWallIMG, castleWall2.x, castleWall2.y, castleWall2.width, castleWall2.height);
		}
	}
	//forest rendering
	if(sessionStorage.getItem("stage") == "starting_forest" || sessionStorage.getItem("stage") == "infested_forest") {
		/*draw lake entrance (within view distance)
		if (Math.sqrt(Math.pow(player.x-lakeEntrance.x, 2) + Math.pow(player.y-lakeEntrance.y, 2)) <= player.viewDistance)
			context.drawImage(lakeEntranceIMG, lakeEntrance.x, lakeEntrance.y, lakeEntrance.width, lakeEntrance.height);*/
		//draw teleporter (within view distance)
		if (Math.sqrt(Math.pow(player.x-teleporter.x, 2) + Math.pow(player.y-teleporter.y, 2)) <= player.viewDistance)
			context.drawImage(teleporterIMG, 0, teleporterSprite.frameHeight * teleporterSprite.frameIndex,
			teleporterSprite.frameWidth, teleporterSprite.frameHeight, teleporter.x, teleporter.y, teleporterSprite.frameWidth, teleporterSprite.frameHeight);
		//draw forest exit (within view distance)
		if (Math.sqrt(Math.pow(player.x-forestExit.x, 2) + Math.pow(player.y-forestExit.y, 2)) <= player.viewDistance)
			context.drawImage(forestExitIMG, forestExit.x, forestExit.y, forestExit.width, forestExit.height);
	}
	//testroom rendering
	if(sessionStorage.getItem("stage") == "testroom") {
		//draw testroom background
		context.drawImage(testroomIMG, 0, 0, canvas.width, canvas.height);
		//draw closed chest
		context.drawImage(chestIMG, 0, 0, chestSprite.frameWidth, chestSprite.frameHeight, chest.x, chest.y, chest.width, chest.height);
		//if chest is open, draw open chest (chest opens on collision with player)
		if(chest.open)
			context.drawImage(chestIMG, chestSprite.frameWidth, 0, chestSprite.frameWidth, chestSprite.frameHeight, chest.x, chest.y, chest.width, chest.height); 
	}
	//courtyard rendering
	if(sessionStorage.getItem("stage") == "courtyard") {
		//draw courtyard background iamge
		context.drawImage(courtyardIMG, 0, 0, canvas.width, canvas.height);
		//draw castle door
		context.drawImage(castleEntranceIMG, castleDoor.x, castleDoor.y, castleDoor.width, castleDoor.height);
		//draw guard
		context.drawImage(guardIMG, guard.x, guard.y, guard.width, guard.height);
	}
	//bossroom rendering
	if(sessionStorage.getItem("stage") == "bossroom"){
		//draw space background
		for(i=0; i<backgroundList.length; i++) {
			context.drawImage(spaceIMG, backgroundList[i].x, backgroundList[i].y, canvas.width, canvas.height);
		}
		//draw bossroom background image
		context.drawImage(bossRoomIMG, 0, 0, canvas.width, canvas.height);
		//draw bossSprite (drawing at x-60 to fix hitbox issues)
		context.drawImage(boss.image, bossSprite.frameIndex*bossSprite.frameWidth, 0, 
		bossSprite.frameWidth, bossSprite.frameHeight, boss.x-60, boss.y, bossSprite.frameWidth, bossSprite.frameHeight);
		//draw boss healthbar
		if(boss.hp >= 0) {
			context.drawImage(healthBarIMG, canvas.width/2 - boss.hp/5, canvas.height-100, boss.hp/2.5, 100);
			context.drawImage(healthBarFrameIMG, canvas.width/2 - 500, canvas.height-100, 1000, 100)
		} else {
			sessionStorage.setItem("fightStarted", "false");
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.drawImage(winIMG, winSprite.frameWidth*winSprite.frameIndex, 0, winSprite.frameWidth, winSprite.frameHeight, 0, 0, canvas.width, canvas.height);
		}
	}
	/* -------------------- END STAGE SPECIFIC RENDERING -------------------- */

	//draw all ammo in list (within view distance)
	for(i=0; i<ammoList.length; i++) {
		//distance formula
		if (Math.sqrt(Math.pow(player.x-ammoList[i].x, 2) + Math.pow(player.y-ammoList[i].y, 2)) <= player.viewDistance)
			context.drawImage(ammoIMG, ammoList[i].x, ammoList[i].y, ammoList[i].width, ammoList[i].height);	
	}
	//draw all batteries in list  (within view distance)
	for(i=0; i<batteryList.length; i++) {
		//distance formula
		if (Math.sqrt(Math.pow(player.x-batteryList[i].x, 2) + Math.pow(player.y-batteryList[i].y, 2)) <= player.viewDistance)
		context.drawImage(batteryIMG, batterySprite.frameIndex*batterySprite.frameWidth, 0,
			batterySprite.frameWidth, batterySprite.frameHeight, batteryList[i].x, batteryList[i].y, batterySprite.frameWidth, batterySprite.frameHeight);
	}
	//draw all enemies in list (within view distance)
	for(i=0; i<enemyList.length; i++) {
		//distance formula
		if (Math.sqrt(Math.pow(player.x-enemyList[i].x, 2) + Math.pow(player.y-enemyList[i].y, 2)) <= player.viewDistance)
			context.drawImage(enemiesIMG, enemyList[i].sourceX, enemyList[i].sourceY, enemyList[i].width, enemyList[i].height, 
				enemyList[i].x, enemyList[i].y, enemyList[i].width, enemyList[i].height);
	}
	//draw all explosions in list
	for(i=0; i<explosionList.length; i++){
		context.drawImage(explosionIMG, 
		explosionList[i].currentFrame%4 * explosionSprite.frameWidth,
		Math.floor(explosionList[i].currentFrame/4) * explosionSprite.frameHeight,
		explosionSprite.frameWidth, explosionSprite.frameHeight, explosionList[i].x, 
		explosionList[i].y, explosionSprite.frameWidth, explosionSprite.frameHeight);
	}
	//draw all bombs in list
	for(i=0; i<bombList.length; i++) {
		context.drawImage(bombIMG, bombSprite.frameIndex * bombSprite.frameWidth, 0, bombList[i].width, bombList[i].height, bombList[i].x, bombList[i].y, bombList[i].width, bombList[i].height);
	}
	//draw all bullets in list 
	for(i=0; i<bulletList.length; i++) {
		context.drawImage(bulletIMG, bulletSprite.frameIndex * bulletSprite.frameWidth, 0, bulletList[i].width, bulletList[i].height, bulletList[i].x, bulletList[i].y, bulletList[i].width, bulletList[i].height);
	}
	//draw all incendiary discs in list
	for(i=0; i<incendiaryDiscList.length; i++) {
		context.drawImage(bullet2IMG, incendiaryDiscSprite.frameIndex * incendiaryDiscSprite.frameWidth, 0, incendiaryDiscList[i].width, incendiaryDiscList[i].height, incendiaryDiscList[i].x, incendiaryDiscList[i].y, incendiaryDiscList[i].width, incendiaryDiscList[i].height);
	}
	//draw all shifter discs in list
	for(i=0; i<shifterDiscList.length; i++) {
		context.drawImage(bullet3IMG, bulletSprite.frameIndex * bulletSprite.frameWidth, 0, shifterDiscList[i].width, shifterDiscList[i].height, shifterDiscList[i].x, shifterDiscList[i].y, shifterDiscList[i].width, shifterDiscList[i].height);
	}
	//draw all enemy bullets in list
	for(i=0; i<enemyBulletList.length; i++) {
		//save current context coordinate system before rotating
		context.save();
		//move center of context to where bullet is
		context.translate(enemyBulletList[i].x, enemyBulletList[i].y);
		//rotate context bullets angle
		context.rotate(enemyBulletList[i].angle);
		//draw image at 0,0 because context is currently translated to bullets position
		if(enemyBulletList[i].direction == "left")
			context.drawImage(laserIMG, enemyBulletSprite.frameWidth, 0, enemyBulletSprite.frameWidth, enemyBulletSprite.frameHeight, 0, 0, enemyBulletList[i].width, enemyBulletList[i].height);
		else 
			context.drawImage(laserIMG, 0, 0, enemyBulletSprite.frameWidth, enemyBulletSprite.frameHeight, 0, 0, enemyBulletList[i].width, enemyBulletList[i].height);
		//restore contexts coordinate system
		context.restore();
	}

	//draw all fireballs in list
	for(i=0; i<fireballList.length; i++) {
		context.drawImage(fireballIMG, (fireballSprite.frameIndex%4) * fireballSprite.frameWidth, 
		Math.floor(fireballSprite.frameIndex/4)+1, fireballSprite.frameWidth, fireballSprite.frameHeight, 
		fireballList[i].x-100, fireballList[i].y-175, fireballSprite.frameWidth, fireballSprite.frameHeight);
		//if current fireball is going out of bounds, remove it from list
		if (fireballList[i].x < 0 || fireballList[i].y < 0 || fireballList[i].x > canvas.width 
			|| fireballList[i].y > canvas.height) {
			fireballList.splice(i, 1);
		}
	}
	//if player is moving, draw sprite animations for each direction and play walking sound
	if(player.moving == true) {
		//only play sound if sound is enabled
		if(sessionStorage.getItem("soundEnabled") == "true")
			leftwalk.play();
		if(player.direction == "down" || player.direction == "down-right" || player.direction == "down-left") {
			context.drawImage(playerIMG, playerSprite.frameIndex*playerSprite.frameWidth, 0, 
			playerSprite.frameWidth, playerSprite.frameHeight, player.x, player.y, playerSprite.frameWidth, playerSprite.frameHeight);
		}
		if(player.direction == "up" || player.direction == "up-right" || player.direction == "up-left") {
			context.drawImage(playerIMG, playerSprite.frameIndex*playerSprite.frameWidth, playerSprite.frameHeight, 
			playerSprite.frameWidth, playerSprite.frameHeight, player.x, player.y, playerSprite.frameWidth, playerSprite.frameHeight);
		}
		if(player.direction == "left") {
			context.drawImage(playerIMG, playerSprite.frameIndex*playerSprite.frameWidth, 2*playerSprite.frameHeight, 
			playerSprite.frameWidth, playerSprite.frameHeight, player.x, player.y, playerSprite.frameWidth, playerSprite.frameHeight);
		}
		if(player.direction == "right") {
			context.drawImage(playerIMG, playerSprite.frameIndex*playerSprite.frameWidth, 3*playerSprite.frameHeight, 
			playerSprite.frameWidth, playerSprite.frameHeight, player.x, player.y, playerSprite.frameWidth, playerSprite.frameHeight);
		}
	}
	//if player isnt moving, only draw first frame of each animation
	else if(player.moving == false) {
		if(player.direction == "down") {
			context.drawImage(playerIMG, 0, 0, 
			playerSprite.frameWidth, playerSprite.frameHeight, player.x, player.y, playerSprite.frameWidth, playerSprite.frameHeight);
		}
		if(player.direction == "up") {
			context.drawImage(playerIMG, 0, playerSprite.frameHeight, 
			playerSprite.frameWidth, playerSprite.frameHeight, player.x, player.y, playerSprite.frameWidth, playerSprite.frameHeight);
		}
		if(player.direction == "left") {
			context.drawImage(playerIMG, 0, 2*playerSprite.frameHeight, 
			playerSprite.frameWidth, playerSprite.frameHeight, player.x, player.y, playerSprite.frameWidth, playerSprite.frameHeight);
		}
		if(player.direction == "right") {
			context.drawImage(playerIMG, 0, 3*playerSprite.frameHeight, 
			playerSprite.frameWidth, playerSprite.frameHeight, player.x, player.y, playerSprite.frameWidth, playerSprite.frameHeight);
		}
	}
	//draw all trees in list (within view distance) (drawing after player so he can walk behind)
	for(i=0; i<treeList.length; i++) {
		if (Math.sqrt(Math.pow(player.x-treeList[i].x, 2) + Math.pow(player.y-treeList[i].y, 2)) <= player.viewDistance)
			//drawing at x-45 and y-75 to fix hitbox a little bit
			context.drawImage(treeIMG, treeList[i].spritePosition, 0, treeSprite.frameWidth, treeSprite.frameHeight, treeList[i].x-35, treeList[i].y-75, treeList[i].imageWidth, treeList[i].imageHeight);
	}	

	//constantly check for player being hurt, if hurt make screen flash and play sound
	//(would put this in update function but it needs to be drawn on top of everything else)
	screenFlasher();
	//if player just spawned for first time and is in starting field, show them a tip
	if(sessionStorage.getItem("stage") == "starting_field")
		beginningTip();
	//if tutorial has started, this function will go through tutorial
	if(sessionStorage.getItem("stage") == "testroom")
		tutorial();	
	//if boss dialogue has started, this function will go through boss dialogue
	if(sessionStorage.getItem("stage") == "bossroom")
		bossDialogue();
}

//main game function
function game(){
	update();
	render();
}