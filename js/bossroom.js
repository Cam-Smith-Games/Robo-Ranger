sessionStorage.setItem("stage", "bossroom");
if(!sessionStorage.getItem("bossDialogueStarted")) {
	sessionStorage.setItem("bossDialogueStarted", "true");
	sessionStorage.setItem("bossDialogueStep", 1)
}
sessionStorage.setItem("viewDistance", canvas.width);
alert("You take a pit stop at the restroom and get lost. You finally find the guy Larry was talking about approximately 30 minutes later.");


player.x = canvas.width/2-player.width/2;
player.y = canvas.height - player.height;
player.direction = "up";

//create initial background
var newBackground = new Background(0,0);
backgroundList.push(newBackground);

var boss = new Boss();
var bossBulletList = [];

function bossDamager() {
	//if boss damaged and tick counter is less than 5
	if (boss.damaged && boss.tickCounter<5) {
		//change image, play sound, add to tick counter
		boss.image = bossDamagedIMG;
		hurtSound.play();
		boss.tickCounter++;
	} 
	//once tickCounter gets to 5
	if (boss.tickCounter == 5) {
		//reset image, set damaged to false, and reset tickCounter
		boss.image = bossIMG;
		boss.damaged = false;
		boss.tickCounter = 0;
	}
}

function bossShooter() {
	//toshootornottoshoot gets random # 0-100
	var ToShootOrNotToShoot = Math.floor(Math.random()*100)+1; 
	if (ToShootOrNotToShoot < 5) {
		//var newBullet = new Bullet(boss.x+boss.width/2, boss.y+boss.height, "down", 16, 16);
		//bossBulletList.push(newBullet);
		var newFireball = new Fireball(boss.x+boss.width/2-25, boss.y+boss.height/2)
		fireballList.push(newFireball);
	}
	if (ToShootOrNotToShoot < 3) {
		var newBomb = new Bomb(Math.abs((Math.random()*canvas.width)-64), (Math.random()*canvas.height/2)+canvas.height/2 - 64)
		bombList.push(newBomb);
	}
}

function bossMover() {
	//make boss move left/right
	if (boss.direction == "left")
		boss.x -= 10;
	if (boss.direction == "right")
		boss.x += 10;
	if(boss.x < boss.width/6)
		boss.direction = "right";
	if(boss.x > canvas.width-boss.width)
		boss.direction = "left";
}

function bombUpdater() {
	for(i=0; i<bombList.length; i++) {
		//wait 50 updates to explode bomb
		if(bombList[i].timer < 50) {
			bombList[i].timer++;
		} else {
			for(j=-32; j<canvas.width; j+=32) {
				newExplosionX = new Explosion(j, bombList[i].y);
				newExplosionY = new Explosion(bombList[i].x, j);
				explosionList.push(newExplosionX);
				explosionList.push(newExplosionY);

				currentExplosion = sessionStorage.getItem("currentExplosion");
				explosionSoundList[currentExplosion].play();
				currentExplosion++;
				if(currentExplosion >= 4) currentExplosion = 0;
					sessionStorage.setItem("currentExplosion", currentExplosion);
			}
			bombList.splice(i, 1);
		}
	}
}

function backgroundMover() {
	//go through list of backgrounds
	for(i=0; i<backgroundList.length; i++) {
		//make background go up 2 pixels per frame
		backgroundList[i].y-=2;
		//if current backgrounds y<0 and there is currently only 1 background on the screen
		if(backgroundList[i].y < 0 && backgroundList.length<2) {
			//create new background and it to list
			newBackground = new Background(0, canvas.height);
			backgroundList.push(newBackground);
		}
		//if backgrounds y is less than negative height (the background has compeletely left the screen)
		if(backgroundList[i].y < -1*backgroundList[i].height)
			//remove it from list
			backgroundList.splice(i, 1);
	}
}

function bossDialogue() {
	console.log(sessionStorage.getItem("bossDialogueStarted"));
	context.font = "200% Comic Sans MS";
	context.fillStyle = "red";
	if(sessionStorage.getItem("bossDialogueStarted") == "true") {
		//draw dialogue box
		context.drawImage(dialogueIMG, dialogue.x, dialogue.y, dialogue.width, dialogue.height);
		//increase textTimer by 1 until it reaches 20
		if(Math.floor(sessionStorage.getItem("textTimer"))<40)
			sessionStorage.setItem("textTimer", Math.floor(sessionStorage.getItem("textTimer"))+1);
		//when timer == 20
		if(Math.floor(sessionStorage.getItem("textTimer"))==40) {
			//let user know they can continue now
			context.fillText("press ctrl to continue", canvas.width/1.5 , canvas.height-50);
			//if player presses ctrl, advance to next dialogue
			if(keys[17]) {
				sessionStorage.setItem("bossDialogueStep", Math.floor(sessionStorage.getItem("bossDialogueStep"))+1)
				sessionStorage.setItem("textTimer", 1);
			}
		}
		//dialogue 1
		if(sessionStorage.getItem("bossDialogueStep") == 1) {
			context.fillText("Lord Zarthelon: \x22GOD DANG IT LARRY YOU BETTER HAVE MY FROSTED FLAKES... Oh it's just you,", dialogue.x+50, dialogue.y+80);
			context.fillText("puny human. I'm not sure what you're doing here, but you're just in time for lift off, I'm taking this", dialogue.x+50, dialogue.y+120);
			context.fillText(" castle with me to my home planet ZorplFlorp. And in the mean time, I'm gonna kill yo lil' stupid", dialogue.x+50, dialogue.y+160);
			context.fillText("human face just cuz I feel like it. ANY LAST WORDS??\x22", dialogue.x+100, dialogue.y+200);
		}
		//dialogue 2
		if(sessionStorage.getItem("bossDialogueStep") == 2) {
			context.fillText("Larry: \x22I'm sorry it took so long Mister Zarthelon. But...uhhh...your robots...they ", dialogue.x+50, dialogue.y+80);
			context.fillText('kinda destroyed the grocery store sir... so I made some home-made Larry-O-s!\x22', dialogue.x+50, dialogue.y+120);
		}
		//dialogue 3
		if(sessionStorage.getItem("bossDialogueStep") == 3) {
			context.fillText("Lord Zarthelon: \x22LARRY I DONT NEED YOUR STUPID LARRY-O-S, IM BUSY.\x22", dialogue.x+50, dialogue.y+80);
			context.fillText("*Larry dies a horrible death*", dialogue.x+50, dialogue.y+120);
			context.fillText("\x22Now where were we? OH THAT'S RIGHT! It's time for me to take you to pound town\x22", dialogue.x+50, dialogue.y+160);
		}
		//once dialoguestep = 4, start fight and stop dialogue
		if(sessionStorage.getItem("bossDialogueStep") == 4) {
			sessionStorage.setItem("fightStarted", "true");
			sessionStorage.setItem("bossDialogueStarted", "false");
			//play boss music if sound is enabled
			if(sessionStorage.getItem("soundEnabled") == "true")
				orbitalColossus.play();
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

