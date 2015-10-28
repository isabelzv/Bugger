// Javascript file containing enemy and player classes for the frogger game. 

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // TODO write loc and speed variables
    this.x = 0; //start off screen???
    this.y = 101; //random row
    // this.y = random row 1,2 or 3
    // this.speed = random speed
    this.speed = 100; 
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.y = this.y;
    this.x = this.x += this.speed * dt;
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
    this.x = 100;
    this.y = 100;
};
//TODO complete function
Player.prototype.update = function(dt) {
    this.x = this.x * dt;
    this.y = this.y * dt;
    //TODO Add some functionality to stop player from moving off the screen. 
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

//add newly created enemies into the allEnemies array
allEnemies.push(new Enemy);

// Define a function to operate on each enemy
allEnemies.forEach(function() {

});
// Place the player object in a variable called player
var player = new Player;



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
