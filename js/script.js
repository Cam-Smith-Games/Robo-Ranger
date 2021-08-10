sessionStorage.setItem("textTimer", 1);
//initially set arrowKeyPressed to false
sessionStorage.setItem("arrowKeyPressed", false);
//initially set tutorialStep to 0
sessionStorage.setItem("tutorialStep", "0");
//initially set soundEnabled to true
if(sessionStorage.getItem("soundEnabled") == null)
	sessionStorage.setItem("soundEnabled", "true");
//intially set view distance to 300, (this will only happen when viewDistance does not exist)
if(!sessionStorage.getItem("viewDistance"))
	sessionStorage.setItem("viewDistance", 300);
//initially set player health to 1000
if(!sessionStorage.getItem("playerHealth"))
	sessionStorage.setItem("playerHealth", 1000);
//initially set current gun to none
if(!sessionStorage.getItem("currentGun"))
	sessionStorage.setItem("currentGun", "none");
//create and add canvas to body of document
var canvas = document.createElement('canvas');
canvas.id = "mainCanvas";
//set canvas to set size (so different sized screens dont effect size of objects)
//width/height will be set to 80% of screen later in CSS
canvas.width = 2000;
canvas.height = 1000;
document.body.appendChild(canvas);
//get context from canvas for drawing/fill stuff
var context = canvas.getContext("2d");
//key arrays for keypressing
var keys = [];
//bulletSpeed = number of pixels that bullet will travel per frame
var bulletSpeed = 15; 
//event listener for when player presses key
window.addEventListener("keydown", function(e){
	//if key pressed, set its keycode in keys array to true
	keys[e.keyCode] = true;
});
//event listener for when player releases key
window.addEventListener("keyup", function(e){
	//if key released, remove that keycode from keys array
	delete keys[e.keyCode];
	//if its an arrow key, set arrowKeyPressed to false (this is to prevent user from holding arrow key to shoot bullets)
	if(e.keyCode >= 37 && e.keyCode <= 40) 
		sessionStorage.setItem("arrowKeyPressed", false);
});
//function to tell whether two things are touching (returns true if colliding)
function collision(first, second) {
	return (first.x < second.x + second.width &&
			first.x + first.width > second.x &&
			first.y < second.y + second.height &&
			first.y + first.height > second.y);
}
//function for cheat command keypresses
function cheats() {
	/* ---------- CHEATS ---------- */
	//press e, disable sound, pause whatever song is playing
	if(keys[69]) {
		sessionStorage.setItem("soundEnabled", "false");
		evolutius.pause();
		evolutiusTitle.pause();
		orbitalColossus.pause();
	}
	//press r, enable sound
	if(keys[82]) {
		sessionStorage.setItem("soundEnabled", "true");
	}
	//press g, get phaser disc and 150 ammo
	if(keys[71]) {
		sessionStorage.setItem("currentGun", "PhaserDisc");
		sessionStorage.setItem("ammo", 150);
	}
	//press h, get incendiary disc and 150 ammo
	if(keys[72]) {
		sessionStorage.setItem("currentGun", "IncendiaryDisc");
		sessionStorage.setItem("ammo", 150);
	}
	//press j, get shifter disc and 150 ammo
	if(keys[74]) {
		sessionStorage.setItem("currentGun", "ShifterDisc");
		sessionStorage.setItem("ammo", 150);
	}
	//press m, clear sessionStorage
	if(keys[77])
		sessionStorage.clear();
	//press n, hurt player
	if(keys[78])
		player.hurt = true;
	//press v, spawn enemies
	if(keys[86])
		spawnEnemies(5);
	//press f, kill all enemies
	if(keys[70])
		enemyList = [];
	//press c, log # enemies
	if(keys[67])
		console.log(enemyList.length);
	//press b, increase view distance
	if(keys[66] && !keys[16])
		sessionStorage.setItem("viewDistance", Math.floor(sessionStorage.getItem("viewDistance")) + 50);
	//press shift+b, decrease view distance
	if(keys[16] && keys[66])
		sessionStorage.setItem("viewDistance", Math.floor(sessionStorage.getItem("viewDistance")) - 50);
	//press 1, go to starting_field stage
	if(keys[49]) {
		sessionStorage.setItem("stage", "starting_field")
		window.open("field.html", "_self"); }
	//press 2, starting_forest
	if(keys[50]) {
		sessionStorage.setItem("stage", "starting_forest")
		window.open("forest.html", "_self"); }
	//press 3, testroom
	if(keys[51]) {
		sessionStorage.setItem("stage", "infested_forest")
		window.open("testroom.html", "_self"); }
	//press 4, infested_forest
	if(keys[52]) {
		sessionStorage.setItem("stage", "infested_forest")
		window.open("forest.html", "_self"); }
	//press 5, infested_field
	if(keys[53]) {
		sessionStorage.setItem("stage", "infested_field")
		window.open("field.html", "_self"); }
	//press 6, courtyard
	if(keys[54]) {
		sessionStorage.setItem("stage", "courtyard")
		window.open("courtyard.html", "_self"); }
	//press 7, bossroom
	if(keys[55]) {
		sessionStorage.setItem("stage", "bossroom")
		window.open("bossroom.html", "_self"); }
}
//function for setting keyPress events
function keyPresser() {
	//w=87, a=65, s=83, d=68
	//when wasd buttons pressed, set player dx/dy values and directions
	if(keys[87]) {
		player.dy = -10;
		player.direction = "up"; 
		if(keys[65])
			player.direction = "up-left";
		if(keys[68])
			player.direction = "up-right";
	}
	if(keys[83]) {
		player.dy = 10;
		player.direction = "down"; 
		if(keys[65])
			player.direction = "down-left";
		if(keys[68])
			player.direction = "down-right";
	}
	if(keys[65]) {
		player.dx = -10;
		player.direction = "left";
		if(keys[87])
			player.direction = "up-left";
		if(keys[83])
			player.direction = "down-left"; 
	}
	if(keys[68]) {
		player.dx = 10;
		player.direction = "right"; 
		if(keys[87])
			player.direction = "up-right";
		if(keys[83])
			player.direction = "down-right";
	}

	//when keys not pressed and player isnt being shifted to a disc, set dx/dy to zero
	if((!keys[87] && !keys[83]) && !player.shifting) 
		player.dy = 0;
	if(!keys[65] && !keys[68] && !player.shifting) 
		player.dx = 0;
	


	//if player has gun and presses an arrow key, create new bullet in that direction and add it to bulletlist
	//only do this when arrowKeyPressed is false to prevent user from holding arrow key
	if(sessionStorage.getItem("arrowKeyPressed") == "false" && sessionStorage.getItem("ammo") > 0 
		&& (keys[37] || keys[38] || keys[39] || keys[40])) {
		// up=38, down=40, left=37, right=39
		if(keys[38]) player.direction = "up";
		if(keys[40]) player.direction = "down";
		if(keys[37]) player.direction = "left";
		if(keys[39]) player.direction = "right";
		if(keys[38] && keys[37]) player.direction = "up-left";
		if(keys[38] && keys[39]) player.direction = "up-right";
		if(keys[40] && keys[37]) player.direction = "down-left";
		if(keys[40] && keys[39]) player.direction = "down-right";
		//if player has phaserdisc gun
		if(sessionStorage.getItem("currentGun") == "PhaserDisc" && sessionStorage.getItem("bulletsReturning") == "false") {
			//create new bullet at player with 10 damage modifier
			var newBullet = new PhaserDisc(player.x, player.y, player.direction, 
			48, 48, 0, 100, 10);
			bulletList.push(newBullet);
			sessionStorage.setItem("ammo", Math.floor(sessionStorage.getItem("ammo"))-1);
			sessionStorage.setItem("arrowKeyPressed", true);	
			//only play sound if sound is enabled
			if(sessionStorage.getItem("soundEnabled") == "true")
			bulletSound.play();
		}	
		//if player has incendiary disc gun
		if(sessionStorage.getItem("currentGun") == "IncendiaryDisc") {
			//create new bullet at player with 10 damage modifier
			var newBullet = new IncendiaryDisc(player.x, player.y, player.direction, 
			48, 48, 0, 100, 10);
			incendiaryDiscList.push(newBullet);
			sessionStorage.setItem("ammo", Math.floor(sessionStorage.getItem("ammo"))-1);
			sessionStorage.setItem("arrowKeyPressed", true);	
			//only play sound if sound is enabled
			if(sessionStorage.getItem("soundEnabled") == "true")
				bulletSound.play();
		}
		//if player has shifterdisc gun
		if(sessionStorage.getItem("currentGun") == "ShifterDisc") {
			//create new bullet at player with 10 damage modifier
			var newBullet = new ShifterDisc(player.x, player.y, player.direction, 
			48, 48, 0, 100, 10);
			shifterDiscList.push(newBullet);
			sessionStorage.setItem("ammo", Math.floor(sessionStorage.getItem("ammo"))-1);
			sessionStorage.setItem("arrowKeyPressed", true);	
			//only play sound if sound is enabled
			if(sessionStorage.getItem("soundEnabled") == "true")
				bulletSound.play();
		}
	}
}
//function that makes enemy robos shoot randomly and aim at player
function enemyShooter() {
	//go through list of enemies, if their bulletTimer is within range, shoot at player
	for(i=0; i<enemyList.length; i++) {
		//shootTimeRandomizer initially 10, multiplying by random will give # between 0 and 10
		enemyList[i].shootTimeRandomizer *= Math.random();
		//if shootTimeRandomizer == 1 (0.1% chance for each robot to shoot)
		if (Math.floor(enemyList[i].shootTimeRandomizer) == 1)	{
			var xDiff = player.x - enemyList[i].x;
			var yDiff = player.y - enemyList[i].y;
			var angle = Math.atan(yDiff/xDiff);
			var direction;
			if(player.x < enemyList[i].x) direction = "left";
			if(player.x > enemyList[i].x) direction = "right";
			//create new bullet at enemy with x/y speed = to 20 * xDiff(or yDiff) / distance between them (distance formula)
			var newEnemyBullet = new enemyBullet(enemyList[i].x, enemyList[i].y, 
				30 * xDiff/Math.sqrt(Math.pow(player.x-enemyList[i].x, 2) + Math.pow(player.y-enemyList[i].y, 2)), 
				30 *yDiff/Math.sqrt(Math.pow(player.x-enemyList[i].x, 2) + Math.pow(player.y-enemyList[i].y, 2)), angle, direction);
			enemyBulletList.push(newEnemyBullet);
			if(sessionStorage.getItem("soundEnabled") == "true")
				laserSound.play();
		}
		//reset to 10
		enemyList[i].shootTimeRandomizer = 1000;

	}
}
//function for updating bullet movement
function bulletMover() {
	//set bullets returning back to false once there are no bullets left on the screen
	if(bulletList.length == 0) {
		sessionStorage.setItem("bulletsReturning", "false");
	}
	//go through list of bullets, check their directions and move accordingly
	for(i=0; i<bulletList.length; i++) {
		//add 1 to bullets timer
		bulletList[i].dt++;
		//subtract from forwardVelocity each frame
		bulletList[i].dy -= 15;
		//stop at 0
		if(bulletList[i].dy < 0)
			bulletList[i].dy = 0;
		//if space is pressed or
		//if player doesnt press space within 200 updates of shooting first bullet, set returning to true
		if(keys[32] || bulletList[i].dt == 200) {
			sessionStorage.setItem("bulletsReturning", "true");
			returnSound.play();
		}
		
		if(sessionStorage.getItem("bulletsReturning") == "true") {
			bulletList[i].returning = true;
			//find length/width of triangle between player and bullet
			var xDiff = player.x - bulletList[i].x;
			var yDiff = player.y - bulletList[i].y;
			//add 1/5th of width to x
			bulletList[i].x+=xDiff/5;
			//add 1/5th of height to y
			bulletList[i].y+=yDiff/5;
		}
		if (bulletList[i].direction == "up-right") {
			bulletList[i].y -= bulletList[i].dy/2;
			bulletList[i].x += bulletList[i].dy/2;
		}
		if (bulletList[i].direction == "up-left") {
			bulletList[i].y -= bulletList[i].dy/2;
			bulletList[i].x -= bulletList[i].dy/2;
		}
		if (bulletList[i].direction == "down-right") {
			bulletList[i].y += bulletList[i].dy/2;
			bulletList[i].x += bulletList[i].dy/2;
		}
		if (bulletList[i].direction == "down-left") {
			bulletList[i].y += bulletList[i].dy/2;
			bulletList[i].x -= bulletList[i].dy/2;
		}
		//if bullet going up, y - negative forwardVelocity
		if (bulletList[i].direction == "up")
			bulletList[i].y -= bulletList[i].dy;
		//if bullet going down, y + forwardVelocity
		if (bulletList[i].direction == "down") 
			bulletList[i].y += bulletList[i].dy;
		//if bullet going right, x + forwardVelocity
		if (bulletList[i].direction == "right") 
			bulletList[i].x += bulletList[i].dy;
		//if bullet going left, x - negative forwardVelocity
		if (bulletList[i].direction == "left")
			bulletList[i].x -= bulletList[i].dy;
	}

	//go through list of incendiary discs
	for(i=0; i<incendiaryDiscList.length; i++) {
		//add 1 to bullets timer
		incendiaryDiscList[i].dt++;
		//subtract from forwardVelocity each frame
		incendiaryDiscList[i].dy -= 15;
		//stop at 0
		if(incendiaryDiscList[i].dy < 0)
			incendiaryDiscList[i].dy = 0;
		//if space is pressed or
		//if player doesnt press space within 200 updates of shooting first bullet, set returning to true
		if(keys[32] || incendiaryDiscList[i].dt == 200) {
			sessionStorage.setItem("bulletsReturning", "true");
			returnSound.play();
		}
		
		if(sessionStorage.getItem("bulletsReturning") == "true") {
			newExplosion = new Explosion(incendiaryDiscList[i].x, incendiaryDiscList[i].y);
			explosionList.push(newExplosion);
			incendiaryDiscList.splice(i, 1);

		}
	}
	player.shiftTimer++;
	//go through list of shifter discs
	for(i=0; i<shifterDiscList.length; i++) {
		//add 1 to bullets timer
		shifterDiscList[i].dt++;
		//subtract from forwardVelocity each frame
		shifterDiscList[i].dy -= 15;
		//stop at 0
		if(shifterDiscList[i].dy < 0)
			shifterDiscList[i].dy = 0;
		//if bullet going up, y - forwardVelocity
		if (shifterDiscList[i].direction == "up")
			shifterDiscList[i].y -= shifterDiscList[i].dy;
		//if bullet going down, y + forwardVelocity
		if (shifterDiscList[i].direction == "down") 
			shifterDiscList[i].y += shifterDiscList[i].dy;
		//if bullet going right, x + forwardVelocity
		if (shifterDiscList[i].direction == "right") 
			shifterDiscList[i].x += shifterDiscList[i].dy;
		//if bullet going left, x - forwardVelocity
		if (shifterDiscList[i].direction == "left")
			shifterDiscList[i].x -= shifterDiscList[i].dy;
		//if space is pressed or
		//if player doesnt press space within 200 updates of shooting first bullet, set returning to true
		if((keys[32] || shifterDiscList[i].dt == 200) && player.shiftTimer > 5) {
			var xDiff = shifterDiscList[i].x - player.x;
			var yDiff = shifterDiscList[i].y - player.y;
			player.shiftTimer = 0;
			returnSound.play();
			player.shifting = true;
			player.dx = xDiff/5;
			player.dy = yDiff/5;
			if(player.x == shifterDiscList[i].x) {
				shifterDiscList.splice(i, 1);
				player.dx = 0;
				player.dy = 0;
			}
		}
	}
	//enemy bullet moving
	for(i=0; i<enemyBulletList.length; i++) {
		enemyBulletList[i].x += enemyBulletList[i].dx;
		enemyBulletList[i].y += enemyBulletList[i].dy;
	}
}
//function for making player teleport 
function playerBlinker() {
	//if shift pressed, make player blink
	if(keys[16]) {
		//if player has a blink charge and didnt just finish blinking
		if(player.blinkCharges > 0 && player.blinked == false) {
			player.blinking = true;
			if(player.direction == "right") 
				player.x += 150;
			if(player.direction == "left") 
				player.x -= 150;
			if(player.direction == "down")
				player.y += 150;
			if(player.direction == "up")
				player.y -= 150;
			//player has just finished blinking (this is to prevent user from holding spacebar)
			player.blinking = false;
			player.blinked = true;
			//reduce blink charges by 1
			player.blinkCharges--;
			//reset player recharge timer
			player.blinkRechargeTimer = 0;

			if(sessionStorage.getItem("soundEnabled") == "true")
				blinkSound.play();
		} 
	}
	//
	if(player.blinked) {
		player.blinkTimer++;
		if(player.blinkTimer == 5) {
			player.blinkTimer = 0;
			player.blinked = false;
		}
	}
	//replenish one blink charge every 30 updates while under max charges
	if(player.blinkCharges < 5)	{
		//increase blink timer
		player.blinkRechargeTimer++;
		//once blink timer reaches 10
		if(player.blinkRechargeTimer == 30) {
			//reset timer to 0
			player.blinkRechargeTimer = 0;
			//add a blink charge
			player.blinkCharges++;
		}
	}
}
//function that checks for and handles collisions
function collisionChecker() {
	//if player walking off screen, set coordinate to corresponding boundary
	if(player.x < 0) player.x=0;
	if(player.x > canvas.width-player.width) player.x=canvas.width-player.width;
	if(player.y < 0) player.y=0;
	if(player.y > canvas.height-player.height) player.y=canvas.height-player.height;



	//BULLET COLLISIONS
	for(i=0; i<bulletList.length; i++){
		//if bullet collides with player (when returning)
		if(collision(bulletList[i], player) && bulletList[i].returning) {
			//add 1 to ammo only if that bullet hit a unit
			if(bulletList[i].hitUnit)
				sessionStorage.setItem("ammo", Math.floor(sessionStorage.getItem("ammo"))+1);
			//remove from list
			bulletList.splice(i, 1);
			//only play sound if sound is enabled
			if(sessionStorage.getItem("soundEnabled") == "true")
				reloadSound.play();
		}
		//go through list of enemies and check for collision
		for(j=0; j<enemyList.length; j++) {
			//if bullet collides with enemy while its returning
			if(collision(bulletList[i], enemyList[j]) && bulletList[i].returning) {
				//set bullets hitUnit to true so it will refund ammo
				bulletList[i].hitUnit = true;
				//create explosion at enemy and add to list
				newExplosion = new Explosion(enemyList[j].x + enemyList[j].width/2, enemyList[j].y + enemyList[j].height/2);
				explosionList.push(newExplosion);
				//remove enemy
				enemyList.splice(j, 1);
				//play current explosion, then cycle to next explosion
				currentExplosion = sessionStorage.getItem("currentExplosion");
				currentExplosion++;
				//if current explosion = 4, set back to 0
 				if(currentExplosion >= 4) {
 					currentExplosion = 0;
					sessionStorage.setItem("currentExplosion", currentExplosion);
				}
				//only play sound if sound is enabled
				if(sessionStorage.getItem("soundEnabled") == "true")
					explosionSoundList[currentExplosion].play();
			}
		}
	}
	//when player collides with battery
	for(i=0; i<batteryList.length; i++)
		if(collision(player, batteryList[i])) {
			//add 50 to viewDistance, remove battery
			currentViewDistance = Math.floor(sessionStorage.getItem("viewDistance"));
			currentViewDistance += 50;
			sessionStorage.setItem("viewDistance", currentViewDistance);
			batteryList.splice(i, 1);
			if(sessionStorage.getItem("currentObjective1") == "Your flashlight is dying, find some batteries quick!") {
				sessionStorage.setItem("objective1Complete", true);
				console.log('objective complete');
			}
		}
	//when player collides with tree
	for(i=0; i<treeList.length; i++)
		if(collision(player,treeList[i])) {
			if(player.x < treeList[i].x) player.x -= 5;
			if(player.x > treeList[i].x) player.x += 5;
			if(player.y < treeList[i].y) player.y -= 5;
			if(player.y > treeList[i].y) player.y += 5;

		}
	//when player collides with ammo
	for(i=0; i<ammoList.length; i++)
		if(collision(player, ammoList[i])) {
			//round sessionStoage ammo because its treated as a string (12 + 34 = 1234)
			currentAmmo = Math.floor(sessionStorage.getItem("ammo"));
			currentAmmo += 25;
			sessionStorage.setItem("ammo", currentAmmo);
			ammoList.splice(i, 1);
		}
	//when player collides with enemy bullet
	for(i=0; i<enemyBulletList.length; i++)
		if(collision(player, enemyBulletList[i])) {
			player.hurt = true;
			sessionStorage.setItem("playerHealth", sessionStorage.getItem("playerHealth") - enemyBulletList[i].damage);
		}
	//when player collides with explosion
	for(i=0; i<explosionList.length; i++)
		if(collision(player, explosionList[i])) {
			player.hurt = true;
			sessionStorage.setItem("playerHealth", sessionStorage.getItem("playerHealth") - 1);
		}


	/* -------------------- STAGE SPECIFIC COLLISIONS -------------------- */
	//field stage collisions
	if(sessionStorage.getItem("stage") == "starting_field" || sessionStorage.getItem("stage") == "infested_field") {
		//colliding with forest entrance
		if(collision(player,forestEntrance)) {
			//clear keys array
			keys = [];
			var test = confirm("venture through tunnel?");
			//if player says yes
			if (test == true) 
				//if in starting field, send player to forest
				if(sessionStorage.getItem("stage") == "starting_field") {
					sessionStorage.setItem("stage", "starting_forest");
					alert("Welcome to Flerpy Derp Forest, BEWARE OF FLERPY DERP FUNGUS, a naturally occuring substance known to cause: constipation, tearing of the eyes, and in pretty much all cases: AIDS.");
					window.open("forest.html", "_self");
				//if in infested field, dont let them go back
				} else if (sessionStorage.getItem("stage") == "infested_field") {
					player.x += 50;
					alert("You shouldn't go back there, you need to find shelter, maybe try that castle up there.");
			//if player says no, move them back to prevent further collision
			} else player.x+= 50;
		}
		//colliding with castle entrance
		if(collision(player,castleEntrance)) {
			//clear keys array
			keys = [];
			var test = confirm("enter the castle?");
			//if player says yes
			if(test == true) {
				//if in starting field, dont let player go in, move player back to prevent further collision
				if(sessionStorage.getItem("stage") == "starting_field") {
					alert("Larry: Master told me not to let anyone in here or he'll make his robots punch me in the face. Sorry little dude maybe come back later when hes not home.");
					player.y += 50;
				}
				//if in infested field
				else if (sessionStorage.getItem("stage") == "infested_field") {
					if(enemyList.length > 0) {
						alert("Is that you again man? I can hear those robots out there, If you take care of them all I can sneak you in without master knowing.");
						player.y += 50;
					} else {
						alert("DUDE YOU DID IT. I can't believe you killed all those robots that was awesome. Now master can't make his robots punch me in the face.");
						sessionStorage.setItem("stage", "courtyard");
						window.open("courtyard.html", "_self");
					}
				}
			}
			else player.y += 50;
		}
	}
	//forest stage collisions
	if(sessionStorage.getItem("stage") == "starting_forest" || sessionStorage.getItem("stage") == "infested_forest") {
		//player colliding with forestExit (door that takes you back to field)
		if(collision(player, forestExit)) {
			//clear keys array
			keys = [];
			var test = confirm("venture back through tunnel?");
			if (test == true) {
				if (sessionStorage.getItem("stage") == "starting_forest") {
					sessionStorage.setItem("stage", "starting_field");
					alert("You find your way back to the field. This place looks familiar...");
					window.open("field.html", "_self");
				} 
				else if (sessionStorage.getItem("stage") == "infested_forest") {
					if(enemyList.length > 0) {
						alert("If you don't kill all these robo scumbags, they'll follow you through the tunnnel. Go back and kill dem mofos!");
						player.x -= 200;
					} else {
						sessionStorage.setItem("stage", "infested_field");
						alert("You find your way back to the field. Only to find it infested with even more robot criminal scum!");
						window.open("field.html", "_self");
					}
				}
			} else player.x-= 50;
		}
		//player colliding with teleporter
		if(collision(player, teleporter) && sessionStorage.getItem("currentGun") == "none") {
			warpSound.play();
			teleporter.timer++;
			teleporterSprite.frameIndex++;
			if(teleporterSprite.frameIndex > 4)
				teleporterSprite.frameIndex = 0;
			//once timer gets to 50
			if(teleporter.timer == 100) {
				//clear keys array
				keys = [];
				//ask player if they want to teleport
				var test = confirm("Do you wish to teleport to an unknown destination?");
				//if answer is yes
				if (test == true) {
					sessionStorage.setItem("stage", "testroom")
					alert("You find yourself in a mysterious white room with nothing but a chest in the center.");
					window.open("testroom.html", "_self");
				} else {
					teleporter.timer = 0;
				}
			}
		}
		//if player steps off teleporter reset timer and frameIndex to 0
		else {
			teleporter.timer = 0;
			teleporterSprite.frameIndex = 0;
		}
	}
	//testroom stage collisions
	if(sessionStorage.getItem("stage") == "testroom") {
		//keep setting chest.open to false until player collides with it
		if(!sessionStorage.getItem("tutorialStarted"))
			chest.open = false;
		//when player collides with chest, give him gun, save view distance, and set chest to open
		if(collision(player, chest)) {
			chest.open = true;
			sessionStorage.setItem("currentGun", "PhaserDisc");
			//give player 50 ammo
			sessionStorage.setItem("ammo", 50);
		}
		//if chest is open and tutorial hasnt started
		if(chest.open && !sessionStorage.getItem("tutorialStarted")) {
			//save players view distance from before tutorial is started
			sessionStorage.setItem("oldViewDistance", sessionStorage.getItem("viewDistance"));	
			
			//start tutorial and set tutorial step to 1
			sessionStorage.setItem("tutorialStarted", "true");
			sessionStorage.setItem("tutorialStep", 1);
		}
	}
	//courtyard stage collisions
	if(sessionStorage.getItem("stage") == "courtyard") {
		//if user hasnt talked to guard
		if(!sessionStorage.getItem("alreadyTalked")) {
			//if guard  within certain distance of player, alert them with dialogue
			if (Math.sqrt(Math.pow(player.x-guard.x, 2) + Math.pow(player.y-guard.y, 2)) <= 100) {
				//clear key input array
				keys = [];
				alert("Thank god you're here Robo Ranger! Listen man, King Humpy Flumps is on vacation, and yesterday this big dude came over and was all like 'give me your castle or ill release my robot army on your whole planet' and i was all like 'dude u better back off before Humpy Flumps gets back' so then he released his robot army on our planet and crashed his spaceship into our castle. Can you help man???");
				sessionStorage.setItem("alreadyTalked", true);
			}
		}
		if(collision(player,castleDoor)) {
			//clear key input array
			keys = [];
			//ask player if he/she wants to enter castle room
			var test = confirm("enter castle throne room?");
			//if answer = yes
			if(test) {
				//if user has talked to guard
				if(sessionStorage.getItem("alreadyTalked")) {
					//take player to bossroom.html
					window.open("bossroom.html", "_self");
				} else {
					//alert player he/she needs to talk to guard first
					alert("You should talk to the guard before entering.")
					//move player down to prevent further collision
					player.y+=50;
				}
			} else 
				//move player down to prevent further collision
				player.y+=50;
		}
	}
	//bossroom collisions
	if(sessionStorage.getItem("stage") == "bossroom") {
		console.log(boss.hp);
		//when bullet collides with boss
		for(i=0; i<bulletList.length; i++) {
			if(collision(bulletList[i], boss) && bulletList[i].returning) {
				//set bullets hitUnit to true so it refunds ammo
				bulletList[i].hitUnit = true;
				newExplosion = new Explosion(bulletList[i].x, bulletList[i].y);
				explosionList.push(newExplosion);
				//set boss.damaged to true so he flashes red
				boss.damaged = true;
				//subtract bulets damage from boss hp
				boss.hp -= bulletList[i].damage;
				//play current explosion sound in explosion sound list
				currentExplosion = sessionStorage.getItem("currentExplosion");
				currentExplosion++;
				if(currentExplosion >= 4) currentExplosion = 0;
					sessionStorage.setItem("currentExplosion", currentExplosion);
				//only play sound if sound is enabled
				if(sessionStorage.getItem("soundEnabled") == "true")
					explosionSoundList[currentExplosion].play();
			}
		}

		//when boss bullet collides with player
		for(i=0; i<fireballList.length; i++) {
			//if player collides with fireball and it hasnt already hit him
			if(collision(fireballList[i], player) && !fireballList[i].alreadyHit) {
				sessionStorage.setItem("playerHealth", sessionStorage.getItem("playerHealth") - 10);
				player.hurt = true;
				//remove it
				fireballList.splice(fireballList[i], 1);
				//only play sound if sound is enabled
				if(sessionStorage.getItem("soundEnabled") == "true")
					hurtSound.play();
			}
		}
	}
}

//function that updates ui (ammo, hp, battery, blinks)
function uiUpdater() {
	document.getElementById("ammo").innerHTML = "ammo: " + sessionStorage.getItem("ammo");
	document.getElementById("health").innerHTML = "health: " + sessionStorage.getItem("playerHealth");
	//viewDistance-50 because 50 is the minimum viewDistance gets
	document.getElementById("batteryLife").innerHTML = "battery life: " + (sessionStorage.getItem("viewDistance")-50);
	document.getElementById("blinkCharges").innerHTML = "Blink Charges: " + player.blinkCharges;
	//document.getElementById("enemiesLeft").innerHTML = "enemies left: " + (enemyList.length);
}
//function that shrinks view distance over time (battery life decay)
function viewDistanceShrinker(){
	currentViewDistance = Math.floor(sessionStorage.getItem("viewDistance"));
	if(currentViewDistance > 50)
		currentViewDistance-=2;
	sessionStorage.setItem("viewDistance", currentViewDistance);
}
//function that makes screen flash and play sound when player is hurt
function screenFlasher() {
	//if player is hurt
	if(player.hurt) {
		//draw red gradient image around edge of screen
		context.drawImage(screenFlashGradient, 0, 0, canvas.width, canvas.height);
		//player hurt sound
		player.hurt = false;
		//only play sound if sound is enabled
		if(sessionStorage.getItem("soundEnabled") == "true")
			hurtSound.play();
	} 
}


