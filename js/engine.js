/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */


var Engine = (function (global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;
        // variable to define updating of entities.
        play = false;
        // variable to display gameover splash.
        gameover = false;

    canvas.width = 505;
    canvas.height = 606;

    // use jQuery to add the canvas to the DOM
    $("#play").append(canvas);

    // made canvas a global in order to access in app.js
    global.canvas = canvas;


    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        // use a button click to reset score, lives, player and enemies after
        // gameover and to toggle play on and off, which in turn determines
        // whether or not update is called.
        document.getElementById('playButton').onclick = function() {
            if (play === false) {
                // set score to 0.
                scoreValue = 0;
                // write score into DOM
                $("#score").text("Score = " + scoreValue);
                // set lives to 3.
                lifeValue = 3;
                // write score into DOM
                $("#lives").text("Lives = " + lifeValue);
                player.reset();
                allEnemies.forEach(function(enemy) {
                    enemy.reset();
                });
                play = true;
                gameover = false;
            } else {
                play = false;
            }
        };
        if (play === true) {
            update(dt);
        }
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        // add gameStart function in order to load sprites and get properties.
        gameStart();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        // if not in play mode do not update.
        if (play !== true) {
            return;
        }

        // call update on the various different enities.
        updateEntities(dt);
        // checks for collisions between enemies and player
        checkCollisions();
    }

    /* This is called by the update function. If player is not dying, function
     * loops through all of the objects within allEnemies array and allGems
     * array and updates player as defined in app.js. Updates blood animation and
     * successSplash, if they have been called.
     */
    function updateEntities(dt) {
        if (player.dying !== true) {
            allEnemies.forEach(function(enemy) {
                enemy.update(dt);
            });
            allGems.forEach(function(gem) {
                gem.update();
            });
            player.update();
        }

        blood.update();
        successSplash.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }


        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and allGems
         * array as well as player, blood, gameOverSplash and successSplash objects
         * and call the render functions on them.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        allGems.forEach(function(gem) {
            gem.render();
        });

        player.render();
        blood.render();
        gameOverSplash.render();
        successSplash.render();
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    // cropped player and enemy sprite in order to use width property for collision detection.
    // Renamed as new.... Resized gems, renamed as small....
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/newenemy-bug.png',
        'images/newchar-boy.png',
        'images/smallGem Blue.png',
        'images/smallGem Green.png',
        'images/smallGem Orange.png',
        'images/blood copy.png',
        'images/gameover.png',
        'images/success.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);

