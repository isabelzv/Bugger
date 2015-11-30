// Javascript file containing enemy, player, gem, BloodSplatter and Splash classes as well as gameStart function for the frogger game. 

// define variable for placement and meovement of entities.
var row = 83;
var col = 101;
var topPadding = 50;

// define score and lives and add to DOM
scoreValue = 0;
$("#score").append("Score = " + scoreValue);
lifeValue = 3;
$("#lives").append("Lives = " + lifeValue);

// code taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min (included) and max (excluded).
// For use in enemy y position and speed and gem position.
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/newenemy-bug.png';
    // starts bugs off screen
    this.x = -100;
    // gives bugs a random row between 1 and 3
    this.y = getRandomInt(1, 4) * row + topPadding;
    // gives bugs a random speed
    this.speed = 75 + (getRandomInt(1, 10) * 10); 
    // gets the width and height of the sprite for the purpose of 
    // collision detection.
    this.width = Resources.get(this.sprite).width;
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

    // if the enemies are off the screen, x is reset to -100, a new random y value is given and a new random speed.
    if (this.x > canvas.width) {
        this.x = -100;
        this.y = getRandomInt(1, 4) * row + topPadding;
        this.speed = 75 + (getRandomInt(1, 10) * 10);
    };
    
    // // TODO can I do this somewhere else, so it doesn't have to be done for each enemy???
    // // in checkCollision???
    // // Create player rectangle.
    // var playerRectangle = {x: player.x, y: player.y, width: player.width, height: player.height};
    // // Create enemy rectangle. 
    // var enemyRectangle = {x: this.x, y: this.y, width: this.width, height: this.height};

    // // compare player and enemy rectangles to detect if there has been a collision
    // // code taken from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    // if (playerRectangle.x < enemyRectangle.x + enemyRectangle.width &&
    //    playerRectangle.x + playerRectangle.width > enemyRectangle.x &&
    //    playerRectangle.y < enemyRectangle.y + enemyRectangle.height &&
    //    playerRectangle.height + playerRectangle.y > enemyRectangle.y) {
    //     // if there has been a collision, reduce lifeValue by 1. 
    //     lifeValue--;
    //     // set dying to true, so that entities stop updating and blood is updated.
    //     player.dying = true;
    //     // if lifeValue is less than 0, Game Over. 
    //     if (lifeValue < 0) {
    //         // play set to false to stop updating.
    //         play = false;
    //         // gameover set to true, so that gameOverSplash is updated.
    //         gameover = true;
    //     }
    //     else {
    //         // update lifes on the screen.
    //         $("#lives").text("Lives = " + lifeValue);
    //     };
    // };
};

var checkCollisions = function() {
    if (player.dying) {
        return;
    }
    // TODO can I do this somewhere else, so it doesn't have to be done for each enemy???
    // in checkCollision???
    // Create player rectangle.
    var playerRectangle = {x: player.x, y: player.y, width: player.width, height: player.height};
    // For each enemy in allEnemies
    allEnemies.forEach(function(enemy) {
        // Create enemy rectangle.
        var enemyRectangle = {x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height};

        // compare player and enemy rectangles to detect if there has been a collision
        // code taken from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
        if (playerRectangle.x < enemyRectangle.x + enemyRectangle.width &&
           playerRectangle.x + playerRectangle.width > enemyRectangle.x &&
           playerRectangle.y < enemyRectangle.y + enemyRectangle.height &&
           playerRectangle.height + playerRectangle.y > enemyRectangle.y) {
            // if there has been a collision, reduce lifeValue by 1. 
            lifeValue--;
            // set dying to true, so that entities stop updating and blood is updated.
            player.dying = true;
          };
    });
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

// Player class. Initializes position and size. Sets dying and crossed to false.
var Player = function() {
    this.sprite = 'images/newchar-boy.png';
    this.width = Resources.get(this.sprite).width;
    this.height = Resources.get(this.sprite).height;
    this.x = col * 2.5 - (this.width / 2);
    this.y = row * 4 + topPadding;
    this.dying = false;
    this.crossed = false;
};

// update function to keep player moving and to keep track of whether 
// player has crossed or not.
Player.prototype.update = function(dt) {
    this.x * dt;
    this.y * dt;
    if (this.y <= topPadding) {
        // set crossed to true, so that successSplash gets updated.
        this.crossed = true;
    };
};

// draw the player using the given sprite and x and y pos.
Player.prototype.render = function() {
   ctx.drawImage(Resources.get(this.sprite), this.x, this.y); 
};

// use the key inputs to move the player's x and y pos.
Player.prototype.handleInput = function(key) {
    // if not in play mode, don't do anything with the input.
    if (play !== true) {
        return;
    };
    if (key === 'left' && this.x > 0) {
       this.x -= col;
       } else if (key === 'right' && this.x < canvas.width - col) {
       this.x += col;
       } else if (key === 'up' && this.y > 0) {
       this.y -= row;
       } else if (key === 'down' && this.y < canvas.height - 100 - topPadding) {
       this.y += row;
    };
};

// reset the player, called when playButton is clicked after gameover
Player.prototype.reset = function() {
    if (lifeValue < 0) {
        // play set to false to stop updating.
        play = false;
        // gameover set to true, so that gameOverSplash is updated.
        gameover = true;
    }
    else {
        // update lifes on the screen.
        $("#lives").text("Lives = " + lifeValue);
    };

    this.x = col * 2;
    this.y = row * 4 + topPadding;
    this.dying = false;
    this.crossed = false;
};

// Gem Class initializes x and y position, width and height and collected boolean.
var Gem = function() {
    var gemSprites = ['images/smallGem Blue.png', 'images/smallGem Green.png', 'images/smallGem Orange.png']
    // initializes sprite to 1 of three options.
    this.sprite = gemSprites[getRandomInt(0,3)];
    this.x = getRandomInt(0, 5) * col;
    this.y = getRandomInt(1, 4) * row + topPadding;
    this.width = Resources.get(this.sprite).width;
    this.height = Resources.get(this.sprite).height;
    // collected initialized to false, so it can be updated and rendered
    this.collected = false;
};

// Update function for Gem class. Checks for collision with player.  
Gem.prototype.update = function() {
    // if gem has already been collected, return from the function and move onto the next gem.
    if (this.collected === true) {
        return;
    };

    // create a rectangle for the player for collision detection purposes.
    var playerRectangle = {x: player.x, y: player.y, width: player.width, height: player.height};

    // create a rectangle around the gem for collision detection purposes.
    var gemRectangle = {x: this.x, y: this.y, width: this.width, height: this.height};

    // check to see if the rectangles overlap.
    if (playerRectangle.x < gemRectangle.x + gemRectangle.width &&
       playerRectangle.x + playerRectangle.width > gemRectangle.x &&
       playerRectangle.y < gemRectangle.y + gemRectangle.height &&
       playerRectangle.height + playerRectangle.y > gemRectangle.y) {
        // if so, increase life by 1.
        lifeValue++;
        // flag gem as "collected", so that it won't be rendered or updated anymore.
        this.collected = true;
        // update number of lives on the screen.
        $("#lives").text("Lives = " + lifeValue);
        // add a new gem to the screen
        allGems.push(new Gem());
    };
};

// Draws each gem.
Gem.prototype.render = function() {
    // if gem has already been collected return from the function.
    if (this.collected === true) {
        return;
    };
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y); 
};

// BloodSplatter class constructed witht the help of http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
// Thankyou to http://powstudios.com/ for the sprites
var BloodSplatter = function() {
    this.sprite = "images/blood copy.png";
    // Initialiaze blood pos to be where ever player is at the time blood is updated. 
    this.x = player.x;
    this.y = player.y;
    // width is the width of the whole sprite strip.
    this.width = 3072;
    this.height = 512;
    // frame index refers to which sprite within the strip we're on.
    this.frameIndex = 0;
    // tickCount updates with each updat, used to keep track of how long that frame within the strip has been shown for. 
    this.tickCount = 0;
    // ticks per frame will determine how long each frame will play for.
    this.ticksPerFrame = 4;
    // number of images within the spritestrip.
    this.numberOfFrames = 6;
};

BloodSplatter.prototype.update = function() {
    // if the player isn't in dying mode no need for blood, so return from the function.
    if (!player.dying) {
        return;
    }

    // position the blood where ever the player is.
    this.x = player.x;
    this.y = player.y;
    // update the tick counter by 1.
    this.tickCount += 1;          
    // If tickCount is more than the set number of ticks per frame then reset the tickCount and move on to the next frame.
    if (this.tickCount > this.ticksPerFrame) {   
        this.tickCount = 0;
        // If the current frame index is in range
        if (this.frameIndex < this.numberOfFrames - 1) {  
            // Go to the next frame
            this.frameIndex += 1;
        } else {
            // reset the player's pos
            player.reset()
            // set the frame index back to 0, so it will play from the beginning again.
            this.frameIndex = 0;
            this.tickCount = 0;
        }
    };
}; 

// Draws the blood.
BloodSplatter.prototype.render = function() {
    // If the player isn't dying, return from the function.
    if (!player.dying) {
        return;
    }

    ctx.drawImage(
        // draw the blood sprite strip.
        Resources.get(this.sprite), 
        // start drawing the strip at pos x from whatever frame index we're on.
        this.frameIndex * this.width / this.numberOfFrames, 
        // pos y, start from the top of the strip.
        0, 
        // draw only the width of one frame (not the whole strip).
        this.width / this.numberOfFrames, 
        // draw the whole height of the strip.
        this.height, 
        // draw at pos x and y (set in update).
        this.x, 
        this.y, 
        // draw image 100px wide and 100px high.
        100, 
        100);  
};

// GameOverSplash class. 
var GameOverSplash = function() {
    this.sprite = "images/gameover.png";
    // sets postion to center of canvas.
    this.x = canvas.width / 2 - 75;
    this.y = canvas.height / 2 - 75; 
};

// Draws splash.
GameOverSplash.prototype.render = function() {
    if (gameover) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y); 
    };
};

// SuccessSplash Class.
var SuccessSplash = function() {
    this.sprite = "images/success.png";
    // sets position to center of canvas.
    this.x = canvas.width / 2 - 150;
    this.y = canvas.height / 2 - 100; 
    // initializes tick count to 0.
    this.tickCount = 0;
};

SuccessSplash.prototype.update = function() {
    // Unless the player has crossed the road, return from the function.
    if (!player.crossed) {
        return;
    }

    // update score on the first update only.
    if (this.tickCount === 0) {
        scoreValue++;
        // update score on the screen.
        $("#score").text("Score = " + scoreValue);
    }

    // update the tickCount to keep track of how long the splash has been showing for.
    this.tickCount += 1;
    // If tickCount has reached 40
    if (this.tickCount > 40) {   
        // reset the player's position and variables.
        player.reset()
        // reset the tickcount.
        this.tickCount = 0;
    };
}; 

// Draw the successSplash.
SuccessSplash.prototype.render = function() {
    if (player.crossed === true) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y); 
    };
};

// Initialize empty arrays for enemies and gems
var allEnemies = [];
var allGems = [];

// loads sprites prior to init, allowing access to sprite properties such as width and height (used in collision).
// taken from answer by NathanM https://discussions.udacity.com/t/width-and-height-yo/3531/3
function gameStart() {
  // Place all enemy objects in allEnemies.
  // TODO push enemies using a loop
  allEnemies.push(new Enemy(), new Enemy(), new Enemy(), new Enemy());
  // Place all gem objects in allGems.
  allGems.push(new Gem(), new Gem(), new Gem());
  // Place the player object in a variable called player.
  player = new Player();
  // Place BloodSplatter object in variable called blood to be updated and rendered when neccessary.
  blood = new BloodSplatter();
  // Place GameOverSplash object in variable called gameOverSplash to be updated and rendered when neccessary.
  gameOverSplash = new GameOverSplash();
  // Place SuccessSplash object in variable called successSplash to be updated and rendered when neccessary.
  successSplash = new SuccessSplash();
};


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



