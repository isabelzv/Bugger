// Javascript file containing enemy and player classes for the frogger game. 
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!

var row = 83;
var col = 101;
var topPadding = 50;

scoreValue = 0;
$("#score").append("Score = " + scoreValue);
lifeValue = 3;
$("#lives").append("Lives = " + lifeValue);

// code taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// min inclusive. max exclusive.
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
    this.collided = false;
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
        // if there has been a collision, reduce lifeValue by 1. 
        lifeValue--;
        player.dying = true;
        // if lifeValue is less than 0, Game Over 
        if (lifeValue < 0) {
            // reset();
            // $("#play").style.display = "none";
            play = false;
            // $("#play").hide();
            $("#gameOver").text("game over");
        }
        else {
            // reset the player to the start point.
            //player.reset();
            // update lifes on the screen.
            $("#lives").text("Life = " + lifeValue);
        };
    };
};

// Reset enemies for purpose of play button.
Enemy.prototype.reset = function() {
    this.x = -100;
    this.collided = false; 
}

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
    this.dying = false;
};

Player.prototype.update = function(dt) {
    this.x * dt;
    this.y * dt;
    if (this.y <= topPadding) {
        scoreValue++;
        // update lifes on the screen.
        $("#score").text("Score = " + scoreValue);
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
    this.dying = false
};

//TODO Gems Class including render and update with collision detection.
var Gem = function() {
    var gemSprites = ['images/smallGem Blue.png', 'images/smallGem Green.png', 'images/smallGem Orange.png']
    this.sprite = gemSprites[getRandomInt(0,3)];
    this.x = getRandomInt(0, 5) * col;
    this.y = getRandomInt(1, 4) * row + topPadding;
    // this.width = Resources.get(this.sprite).width;
    // this.height = Resources.get(this.sprite).height;
    this.width = 49;
    this.height = 54;
    this.collected = false;
};

Gem.prototype.update = function() {
    // if gem has already been collected, return from the function and move onto the next gem.
    if (this.collected === true) {
        return;
    };

    // create a rectangle for the player for collision detection purposes.
    var playerRectangle = {x: player.x, y: player.y, width: player.width, height: player.height};
    console.log(playerRectangle);

    // create a rectangle around the gem for collision detection purposes.
    var gemRectangle = {x: this.x, y: this.y, width: this.width, height: this.height};
    console.log(gemRectangle);

    // check to see if the rectangles overlap.
    if (playerRectangle.x < gemRectangle.x + gemRectangle.width &&
       playerRectangle.x + playerRectangle.width > gemRectangle.x &&
       playerRectangle.y < gemRectangle.y + gemRectangle.height &&
       playerRectangle.height + playerRectangle.y > gemRectangle.y) {
        // if so, increase life by 1.
        lifeValue++;
        // flag gem as "collected", so that it won't be rendered or updated anymore.
        this.collected = true;
        console.log("lifeValue = " + lifeValue);
        // update number of lives on the screen.
        $("#lives").text("Lives = " + lifeValue);
        // add a new gem to the screen
        allGems.push(new Gem());
    };
};

Gem.prototype.render = function() {
    if (this.collected === true) {
        return;
    }
   ctx.drawImage(Resources.get(this.sprite), this.x, this.y); 
};


// Place all enemy objects in an array called allEnemies
var allEnemies = [];
var allGems = [];

// loads sprites prior to init, allowing access to sprite properties such as width and height (used in collision).
// taken from answer by NathanM https://discussions.udacity.com/t/width-and-height-yo/3531/3
function gameStart() {
  // Place all enemy objects in allEnemies
  // TODO push enemies using a loop
  allEnemies.push(new Enemy(), new Enemy(), new Enemy());
  allGems.push(new Gem(), new Gem(), new Gem());
  // Place the player object in a variable called player
  player = new Player();
  blood = new BloodSplatter();
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



// // sprite animation code taken from http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
// var bloodImage = new Image();
// bloodImage.src = "images/blood copy.png";
// // Thankyou to http://powstudios.com/

// function sprite (options) {
                
//     var that = {};
                    
//     that.context = options.context;
//     that.width = options.width;
//     that.height = options.height;
//     that.image = options.image;

//     return that;
// };

// blood = sprite({
//     context: canvas.getContext("2d"),
//     // context: ctx,
//     width: 512,
//     height: 512,
//     image: bloodImage
// });
// console.log(blood);

// function sprite (options) {

                
//     that.render = function () {

//         // Draw the animation
//         that.context.drawImage(
//            that.image,
//            0,
//            0,
//            that.width,
//            that.height,
//            player.x,
//            player.y,
//            that.width,
//            that.height);
//         ctx.drawImage(Resources.get(this.sprite), this.x, this.y); 
//     };

// };

var BloodSplatter = function() {
    this.sprite = "images/blood copy.png";
    this.x = player.x;
    this.y = player.y;
    this.width = 3072;
    this.height = 512;
    this.frameIndex = 0;
    this.tickCount = 0;
    // this.ticksPerFrame = ticksPerFrame || 0;
    this.ticksPerFrame = 4;
    this.numberOfFrames = 6;
};

BloodSplatter.prototype.update = function() {
    if (!player.dying) {
        return;
    }

    this.x = player.x;
    this.y = player.y;
    this.tickCount += 1;          
    if (this.tickCount > this.ticksPerFrame) {   
        this.tickCount = 0;
        // If the current frame index is in range
        if (this.frameIndex < this.numberOfFrames - 1) {  
            // Go to the next frame
            this.frameIndex += 1;
        } else {
            player.reset()
            this.frameIndex = 0;
            this.tickCount = 0;
        }
    };
}; 

BloodSplatter.prototype.render = function() {
    // Clear the canvas
    // ctx.clearRect(this.x, this.y, this.width / numberOfFrames, this.height);
    // draw the blood
    if (!player.dying) {
        return;
    }

    ctx.drawImage(
        Resources.get(this.sprite), 
        this.frameIndex * this.width / this.numberOfFrames, 
        0, 
        this.width / this.numberOfFrames, 
        this.height, 
        this.x, 
        this.y, 
        100, 
        100);  
};

blood = new BloodSplatter();



