//scenery class
function Scenery(xLoc, yLoc, width, height, imageWidth, imageHeight, spritePosition) {
	this.x = xLoc;
	this.y = yLoc;
	//different width/height and imageWidth/imageHeight to make hitbox diff size than image
	this.width = width;
	this.height = height;
	this.imageWidth = imageWidth;
	this.imageHeight = imageHeight;
	this.spritePosition = spritePosition
}
//explosion class
function Explosion(xLoc, yLoc) {
	this.x = xLoc;
	this.y = yLoc;
	this.width = 64;
	this.height = 64;
	this.currentFrame = 0;
}
//PhaserDisc bullet class
function PhaserDisc(xLoc, yLoc, direction, width, height, dx, dy, damage) {
	this.x = xLoc;
	this.y = yLoc;
	this.initx = xLoc;
	this.inity = yLoc;
	this.width = width;
	this.height = height;
	this.direction = direction;
	this.dx = dx;
	this.dy = dy;
	this.arcAngleRandomifier = Math.random()*10;
	this.damage = damage;
	this.returning = false;
	this.returned = false;
	this.dt = 0;
	this.hitUnit = false;
}
//IncendiaryDisc bullet class
function IncendiaryDisc(xLoc, yLoc, direction, width, height, dx, dy, damage) {
	this.x = xLoc;
	this.y = yLoc;
	this.initx = xLoc;
	this.inity = yLoc;
	this.width = width;
	this.height = height;
	this.direction = direction;
	this.dx = dx;
	this.dy = dy;
	this.arcAngleRandomifier = Math.random()*10;
	this.damage = damage;
	this.dt = 0;
	this.hitUnit = false;
}
//IncendiaryDisc bullet class
function ShifterDisc(xLoc, yLoc, direction, width, height, dx, dy, damage) {
	this.x = xLoc;
	this.y = yLoc;
	this.initx = xLoc;
	this.inity = yLoc;
	this.width = width;
	this.height = height;
	this.direction = direction;
	this.dx = dx;
	this.dy = dy;
	this.arcAngleRandomifier = Math.random()*10;
	this.damage = damage;
	this.exploding = false;
	this.returned = false;
	this.dt = 0;
	this.hitUnit = false;
}
//enemy bullet class
function enemyBullet(x, y, dx, dy, angle, direction) {
	this.x = x;
	this.y = y;
	this.width = 100;
	this.height = 50;
	this.dx = dx;
	this.dy = dy;
	this.damage = 10;
	this.angle = angle;
	this.direction = direction;
}
//fireball class
function Fireball(x, y) {
	this.x = x;
	this.y = y;
	this.width = 50;
	this.height = 50;
}
//bomb class
function Bomb(x, y) {
	this.x = x;
	this.y = y;
	this.width = 64;
	this.height = 64;
	this.timer = 0;
}
//battery class
function Battery(xLoc, yLoc) {
	this.x = xLoc;
	this.y = yLoc;
	this.width = 21;
	this.height = 21;
}
//enemy class
function Enemy(width, height) {
	this.x = Math.floor(Math.random()*(canvas.width-width*2));
	this.y = Math.floor(Math.random()*(canvas.height-height*2));
	this.width = width;
	this.height = height;
	this.sourceX = Math.floor((Math.random()*3))*64;
	this.sourceY = Math.floor((Math.random()*3))*64;
	this.ShootTimeRandomizer = 1000;
}
//sprite class
function Sprite (options) {
	that = {};
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
    that.frameWidth = options.frameWidth;
    that.frameHeight = options.frameHeight;
    that.frameCount = options.frameCount;
    that.frameIndex = 0;
    that.tickCounter = 0;
    return that;
}
//ammo class
function Ammo (xLoc, yLoc) {
	this.x = xLoc;
	this.y = yLoc;
	this.width = 47.5;
	this.height = 47.5;
}
//boss class
function Boss() {
	//width/height different than frame size to fix hitbox issues
	this.width = 275;
	this.height = 200;
	this.x = canvas.width/2 - this.width/2;
	this.y = 0;
	this.hp = 2500;
	this.damaged = false;
	this.image = bossIMG;
	this.tickCounter = 0;
	this.direction = "left";
}
//background class
function Background(x, y) {
	this.x = x;
	this.y = y;
	this.width = canvas.width,
	this.height= canvas.height
}


//arrays for keeping track of multiple objects in class
var bulletList = [];
var incendiaryDiscList = [];
var shifterDiscList = [];
var spriteList = [];
var enemyList = [];
var torchList = [];
var batteryList = [];
var treeList = [];
var bushList = [];
var explosionList = [];
var ammoList = [];
var bombList = [];
var fireballList = [];
var backgroundList = [];
var enemyBulletList = [];
