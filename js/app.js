// Javascript file containing enemy and player classes for the frogger game. 
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!

var row = 80;
var col = 101;

// code taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // TODO write loc and speed variables
    this.x = -100; //start off screen???
    // this.y = 101; 
    this.y = getRandomInt(1, 4) * row;
    // this.speed = random speed
    this.speed = 75 + (getRandomInt(1, 10) * 10); 
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.y = this.y;
    this.x = this.x += this.speed * dt;
    if (this.x > canvas.width) {
        this.x = -100;
    };
    // this.x += this.speed * dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = col * 2;
    this.y = row * 4;
};
//TODO complete function
Player.prototype.update = function() {
    // this.x = this.x * dt;
    // this.y = this.y * dt;
    // if (this.x > canvas.width) {
    //     this.x = canvas.width - canvas.col;
    // };
    // if (this.x < 0) {
    //     this.x = 0;
    // };
    // if (this.y > canvas.height) {
    //     this.y = canvas.height - canvas.row;
    // };
    // if (this.y < 0) {
    //     this.y = 0;
    // }; 
};

// TODO complete function
Player.prototype.render = function() {
   ctx.drawImage(Resources.get(this.sprite), this.x, this.y); 
};

//TODO complete function
Player.prototype.handleInput = function(key) {
    
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

// Iterate through allEnemies. Remove offscreen enemies. If there are more than 3 enemies in the array push a new enemie. 
function removeEnemies() {
    var toRemove = [];
    var i = 0;
    //place all offscreen enemies in toRemove
    allEnemies.forEach(function(enemy) {  
        if (enemy.x > canvas.width) {
            toRemove.push(enemy[i]);
        }
        i++;
    });
    // remove enemies in the toRemove array from allEnemies
    toRemove.forEach(function(enemy) {
        allEnemies.slice(enemy);
    });
};

removeEnemies();

// spawns new enemies if there is less than 3 enemies on the screen
spawnEnemies = function() {
    while (allEnemies.length < 3) {
        allEnemies.push(new Enemy());
    };
};

spawnEnemies();

// Place the player object in a variable called player
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
