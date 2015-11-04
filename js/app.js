// Javascript file containing enemy and player classes for the frogger game. 
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!

var row = 83;
var col = 101;
var topPadding = 50;

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
    this.sprite = 'images/newenemy-bug.png';
    // starts bugs off screen
    this.x = -100;
    // gives bugs a random row between 1 and 3
    this.y = getRandomInt(1, 4) * row + topPadding;
    // gives bugs a random speed
    this.speed = 75 + (getRandomInt(1, 10) * 10); 
    this.width = Resources.get(this.sprite).width;
    console.log("enemy width = " + this.width);
    this.height = Resources.get(this.sprite).height;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.y = this.y;
    this.x = this.x += this.speed * dt;
    // if the enemies are off the screen x is reset to -100, a new random y value is given and a new random speed.
    if (this.x > canvas.width) {
        this.x = -100;
        this.y = getRandomInt(1, 4) * row + topPadding;
        this.speed = 75 + (getRandomInt(1, 10) * 10);
    };
    
    // Create player rectangle TODO can I do this somewhere else, so it doesn't have to be done for each enemy???
    var playerRectangle = {x: player.x, y: player.y, width: player.width, height: player.height};
    console.log(playerRectangle);
    // Create enemy rectangle 
    var enemyRectangle = {x: this.x, y: this.y, width: this.width, height: this.height};
    console.log(enemyRectangle);

    // compare player and enemy rectangles to detect if there has been a collision
    // code taken from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    if (playerRectangle.x < enemyRectangle.x + enemyRectangle.width &&
       playerRectangle.x + playerRectangle.width > enemyRectangle.x &&
       playerRectangle.y < enemyRectangle.y + enemyRectangle.height &&
       playerRectangle.height + playerRectangle.y > enemyRectangle.y) {
        // if there has been a collision, reset the player to start position.
        player.reset();
        console.log("Game Over");
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Create rectangle for collision detection
// var collisionDetection = function() {
//     for(var i=0; i < allEnemies.length; i++) {
//         if (allEnemies[i].x < (player.y + player.width) ||
//             (allEnemies[i].x + allEnemies[i].width) > player.x ||
//             allEnemies[i].y < (player.y + player.height) || 
//             (allEnemies[i].y + allEnemies[i].height) > player.y) {
//             player.reset();
//         };
//     };    
// };

// collisionDetection();

// Rectangle constructor function
// var Rectangle = function (left, top, width, height) {
//     this.left = left;
//     this.top = top;
//     this.right = this.left + width;
//     this.bottom = this.top + height;
//     this.width = width;
//     this.height = height;
// };

// var playerRectangle = new Rectangle(player.x, player.y, player.width, player.height);

// var enemyRectangle = new Rectangle()

// Check to see if the rectangles overlap
// function checkCollision(r1, r2) {
//     return !(r1.left > r2.right || r1.right < r2.left || r1.top > r2.bottom || r1.bottom < r2.top);
// };

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/newchar-boy.png';
    //TODO either hard code x and y pos or find a nicer working way to do it.
    this.x = col * 2;
    this.y = row * 4 + topPadding;
    this.width = Resources.get(this.sprite).width;
    console.log(this.width);
    this.height = Resources.get(this.sprite).height;
};

Player.prototype.update = function(dt) {
    this.x * dt;
    this.y * dt;
    if (this.y <= topPadding) {
        player.reset();
    };
};

Player.prototype.render = function() {
   ctx.drawImage(Resources.get(this.sprite), this.x, this.y); 
};

Player.prototype.handleInput = function(key) {
    if (key === 'left' && this.x > 0) {
        this.x -= row;
    } else if (key === 'right' && this.x < canvas.width - 100) {
        this.x += row;
    } else if (key === 'up' && this.y > 0) {
        this.y -= row;
    } else if (key === 'down' && this.y < canvas.height - 100) {
        this.y += row;
    };
};

Player.prototype.reset = function() {
    this.x = col * 2;
    this.y = row * 4 + topPadding;
};

// Place all enemy objects in an array called allEnemies
var allEnemies = [];

// loads sprites prior to init, allowing access to sprite properties such as width and height (used in collision).
// taken from answer by NathanM https://discussions.udacity.com/t/width-and-height-yo/3531/3
function gameStart() {
  // Place all enemy objects in allEnemies
  allEnemies.push(new Enemy(), new Enemy(), new Enemy());
  // Place the player object in a variable called player
  player = new Player();
};




// Iterate through allEnemies. Remove offscreen enemies. If there are more than 3 enemies in the array push a new enemie. 
// function removeEnemies() {
//     var toRemove = [];
//     var i = 0;
//     //place all offscreen enemies in toRemove
//     allEnemies.forEach(function(enemy) {  
//         if (enemy.x > canvas.width) {
//             toRemove.push(enemy[i]);
//         }
//         i++;
//     });
//     // remove enemies in the toRemove array from allEnemies
//     toRemove.forEach(function(enemy) {
//         allEnemies.slice(enemy);
//     });
// };

// removeEnemies();

// spawns new enemies if there is less than 3 enemies on the screen
// spawnEnemies = function() {
//     while (allEnemies.length < 3) {
//         allEnemies.push(new Enemy());
//     };
// };

// spawnEnemies();

// Place the player object in a variable called player
// var player = new Player();


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
