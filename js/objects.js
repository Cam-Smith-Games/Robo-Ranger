/* ------------------- IMAGES ------------------- */
var background = document.createElement("img");
var playerIMG = document.createElement("img");
var forestEntranceIMG = document.createElement("img");
var bulletIMG = document.createElement("img");
var bullet2IMG = document.createElement("img");
var bullet3IMG = document.createElement("img");
var enemiesIMG = document.createElement("img");
var batteryIMG = document.createElement("img");
var treeIMG = document.createElement("img");
var explosionIMG = document.createElement("img");
var ammoIMG = document.createElement("img");
var castleEntranceIMG = document.createElement("img");
var lakeEntranceIMG = document.createElement("img");
var forestExitIMG = document.createElement("img");
var bossIMG = document.createElement("img");
var bossDamagedIMG = document.createElement("img");
var courtyardIMG = document.createElement("img");
var guardIMG = document.createElement("img");
var bossRoomIMG = document.createElement("img");
var bombIMG = document.createElement("img");
var fireballIMG = document.createElement("img");
var screenFlashGradient = document.createElement("img");
var spaceIMG = document.createElement("img");
var blackgradientIMG = document.createElement("img");
var chestIMG = document.createElement("img");
var testroomIMG = document.createElement("img");
var laserIMG = document.createElement("img");
var teleporterIMG = document.createElement("img");
var dialogueIMG = document.createElement("img");
var healthBarIMG = document.createElement("img");
var healthBarFrameIMG = document.createElement("img");
var winIMG = document.createElement("img");
var castleWallIMG = document.createElement("img");

	
background.src = "img/grass.png";
playerIMG.src = "img/hero.png";
forestEntranceIMG.src = "img/forest_entrance.png";
bulletIMG.src = "img/boomerang_bullet.png";
bullet2IMG.src = "img/boomerang_bullet2.png";
bullet3IMG.src = "img/boomerang_bullet3.png";
enemiesIMG.src = "img/enemies.png";
batteryIMG.src = "img/battery.png";
treeIMG.src = "img/tree.png";
explosionIMG.src = "img/explosion.png";
ammoIMG.src = "img/ammo.png";
castleEntranceIMG.src = "img/castledoor.png";
lakeEntranceIMG.src = "img/forest_entrance.png";
forestExitIMG.src = "img/forest_exit.png";
bossIMG.src = "img/boss.png";
bossDamagedIMG.src = "img/boss_damaged.png";
courtyardIMG.src = "img/courtyard.png";
guardIMG.src = "img/knight.svg";
bossRoomIMG.src = "img/castleBG.png";
bombIMG.src = "img/bomb.png";
fireballIMG.src = "img/fireball.png";
screenFlashGradient.src = "img/gradient.png";
spaceIMG.src = "img/spaceBG.png";
blackgradientIMG.src = "img/blackgradient.png";
chestIMG.src = "img/chest.png";
testroomIMG.src = "img/testroom.png";
laserIMG.src = "img/laser.png";
teleporterIMG.src = "img/teleporter.png";
dialogueIMG.src = "img/dialogue.png";
healthBarIMG.src = "img/healthbar.png";
healthBarFrameIMG.src = "img/healthbarframe.png";
winIMG.src = "img/winBanner.png";
castleWallIMG.src = "img/castlewall.png";

/* ------------------- AUDIO ------------------- */
//songs
var evolutius = new Audio("audio/evolutius.ogg");
var evolutiusTitle = new Audio("audio/EvolutiusTitle.ogg");
var orbitalColossus = new Audio("audio/OrbitalColossus.mp3");
//sound effects
var bulletSound = new Audio("audio/laser.wav");
var reloadSound = new Audio("audio/laserReload.wav");
var leftwalk = new Audio("audio/grass_walk1.wav");
var hurtSound = new Audio("audio/hurt.wav");
var blinkSound = new Audio("audio/blink.wav");
var returnSound = new Audio("audio/return.wav");
var warpSound = new Audio("audio/warp.wav");
var laserSound = new Audio("audio/laser2.wav");
//only 1 explosion sound is playing at a time, so make 5 and put them in a list
var explode1 = new Audio("audio/explosion.wav");
var explode2 = new Audio("audio/explosion.wav");
var explode3 = new Audio("audio/explosion.wav");
var explode4 = new Audio("audio/explosion.wav");
var explode5 = new Audio("audio/explosion.wav");
var explosionSoundList = [explode1, explode2, explode3, explode4, explode5];
//initial explosionList index will be 0
sessionStorage.setItem("currentExplosion", 0);

/* ------------------- OBJECTS ------------------- */

//player object
var player = {
	x: canvas.width/2 - 24,
	y: canvas.height/2 - 32,
	width: 48,
	height: 64,
	direction: "left",
	moving: false,
	viewDistance: sessionStorage.getItem("viewDistance"),
	dx: 0,
	dy: 0,
	hurt: false,
	hp: sessionStorage.getItem("playerHealth"),
	blinking: false,
	blinked: false,
	blinkTimer: 0,
	blinkRechargeTimer: 0,
	blinkCharges: 5,
	currentGun: sessionStorage.getItem("currentGun"),
	shiftTimer: 0,
	shifting: false
}
//dialogue ui object
var dialogue = {
	x: canvas.width/2 - 820,
	y: canvas.height - 280,
	width: 1640,
	height: 280
}
//teleporter object
var teleporter = {
	x: canvas.width/5,
	y: canvas.height*0.80,
	width: 256,
	height: 128,
	timer: 0
}
//forest exit object
var forestExit = {
	x: canvas.width - 50,
	y: canvas.height*0.40,
	width: 50,
	height: 100
}
//forest entrance object
var forestEntrance = {
	x: 0, 
	y: canvas.height*0.50,
	width : 50,
	height: 100
}
//castle entrance object
var castleEntrance = {
	x: canvas.width/2,
	y: -25,
	width: 100,
	height: 100
}
//castle wall objects
var castleWall1 = {
	x: canvas.width/2-419,
	y: -25,
	width: 419,
	height: 92
}
var castleWall2 = {
	x: canvas.width/2 + 100,
	y: -25,
	width: 419,
	height: 92
}
//castle door object
var castleDoor = {
	x: canvas.width/2-canvas.width/10,
	y: -canvas.width/20,
	width: canvas.width/5,
	height: canvas.width/5
}
//guard object 
var guard = {
	x: canvas.width/2+100,
	y: canvas.height/3,
	width: 84,
	height: 128
}

//chest object
var chest = {
	x: canvas.width/2 - 16,
	y: canvas.height/2 - 16,
	width: 32,
	height: 32,
	open: false
}

/* ------------------- SPRITES ------------------- */
//teleporter sprite
var teleporterSprite = Sprite({
	width: 256,
	height: 640,
	image: teleporterIMG,
	frameWidth: 256,
	frameHeight: 128,
	frameCount: 5
})
//chest sprite
var chestSprite = Sprite({
	width: 64,
	height: 32,
	image: chestIMG,
	frameWidth: 32,
	frameHeight: 32,
	frameCount: 2
})
//battery sprite
var batterySprite = Sprite({
	width: 233,
	height: 61,
	image: batteryIMG,
	frameWidth: 46.6,
	frameHeight: 61,
	frameCount: 5
})
//player sprite
var playerSprite = Sprite({
	width: 380,
	height: 256,
	image: playerIMG,
	frameWidth: 48,
	frameHeight: 64,
	frameCount: 8
})
//enemy sprite
var enemySprite = Sprite({
	width: 192,
	height: 192,
	image: enemiesIMG,
	frameWidth: 64,
	frameHeight: 64,
	frameCount: 9
})
//explosion sprite
var explosionSprite = Sprite({
	width: 1024,
	height: 1024,
	image: explosionIMG,
	frameWidth: 64,
	frameHeight: 64,
	frameCount: 16
})
//boss sprite
var bossSprite = Sprite({
	width: 1152,
	height: 307,
	image: bossIMG,
	frameWidth: 384,
	frameHeight: 307,
	frameCount: 3,
	tickCounter: 0
})
//bomb sprite
var bombSprite = Sprite({
	width: 128,
	height: 64,
	image: bombIMG,
	frameWidth: 64,
	frameHeight: 64,
	frameCount: 2,
	tickCounter: 0
})
//fireball sprite
var fireballSprite = Sprite({
	width: 1280,
	height: 256,
	image: fireballIMG,
	frameWidth: 256,
	frameHeight: 256,
	frameCount: 10
})
//tree sprite for diff color trees
var treeSprite = Sprite({
	width: 380,
	height: 117,
	image: treeIMG,
	frameWidth: 95,
	frameHeight: 117,
	frameCount: 4
})
//laser disc bullet sprite
var bulletSprite = Sprite({
	width: 384,
	height: 48,
	image: bulletIMG,
	frameWidth: 48,
	frameHeight: 48,
	frameCount: 8
})
//incendiary disc bullet sprite
var incendiaryDiscSprite = Sprite({
	width: 384,
	height: 48,
	image: bullet2IMG,
	frameWidth: 48,
	frameHeight: 48,
	frameCount: 8
})
//shifter disc bullet sprite
var shifterDiscSprite = Sprite({
	width: 384,
	height: 48,
	image: bullet3IMG,
	frameWidth: 48,
	frameHeight: 48,
	frameCount: 8
})
//enemy bullet sprite (for left/right lasers)
var enemyBulletSprite = Sprite({
	width: 200,
	height: 50,
	image: laserIMG,
	frameWidth: 100,
	frameHeight: 50,
	frameCount: 2
})
//sprite thats shown when you win
var winSprite = Sprite({
	width: 1000,
	height: 258,
	image: winIMG,
	frameWidth: 500,
	frameHeight: 258,
	frameCount: 2
})

//add sprites to spriteList to cycle animations at same time
spriteList.push(batterySprite);
//spriteList.push(playerSprite);
spriteList.push(explosionSprite);
spriteList.push(bossSprite);
spriteList.push(bombSprite);
spriteList.push(fireballSprite);
spriteList.push(bulletSprite);
spriteList.push(incendiaryDiscSprite);
spriteList.push(shifterDiscSprite);
spriteList.push(chestSprite);
spriteList.push(winSprite);

