/*

The Game Project 7 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var treePos_y;
var trees_x;
var canyons;


var flagpole;

var health;
var lives;
var game_score;


var weaponX;

var bg;

//Sounds
var walkSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    walkSound = loadSound('assets/footstep-grass.mp3');
	walkSound.setVolume(0.1);
	walkSound.rate(0.8);
}


function setup() {
	createCanvas(1024, 576);
	floorPos_y = height * 3 / 4;
	lives = 4;
	startGame();
	
	weaponX = gameChar_world_x;
}
function startGame() {

	gameChar_x = width / 2;
	gameChar_y = floorPos_y;
	
	//Intialize game score
	game_score = 0;


	lives = 4;
	health = 100;


	// Variable to control the background scrolling.
	scrollPos = 0;


	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
	
	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
	treePos_y = floorPos_y - 80;

	//Flagpole
	flagpole = {
		x_pos: 400,
		y_pos: floorPos_y,
		isReached: false,
	}

	mario = loadImage('assets/mario.png'); //loading in my collectable image
	bg = loadImage('assets/background.jpg');
	// initiating arrays
	collectables = []

	clouds = []

	mountains = []

	canyons = []

	trees_x = [];

	enemys = [];




	//Random level Generation ==================================================

	//for loop to populate tree array
	for (var t = 0; t < 100; t++) {

		var randomTreesX = 0;

		var ran = random(50, 1500); //this code generates random x pos

		randomTreesX = randomTreesX + (ran * t);

		trees_x.push(randomTreesX); //this code pushes the random values to the array


	}
	//for loop to populate collectable array
	for (var c = 0; c < 50; c++) {
		var randomCollectableX = random(0, 20000);
		var randomCollectableY = random(300, 400);
		var randomCollectableSize = random(30, 100);

		collectables.push({
			x_pos: randomCollectableX,
			y_pos: randomCollectableY,
			size: randomCollectableSize,
			isFound: false
		}) //this code pushes the object values to the array
	}
	//for loop to populate cloud array
	for (var n = 0; n < 50; n++) {
		var randomCloudX = random(0, 20000);
		var randomCloudY = random(20, 180);
		var randomCloudSize = random(30, 70);

		clouds.push({
			x_pos: randomCloudX,
			y_pos: randomCloudY,
			size: randomCloudSize
		});
	}
	//for loop to populate mountain array
	for (var m = 0; m < 35; m++) {
		var randomMountainX = random(0, 20000);

		mountains.push({
			x_pos: randomMountainX,
			y_pos: 400
		})

	}
	//for loop to populate canyon array
	for (var d = 0; d < 40; d++) {

		var randomCanyonX = 0;

		var ran = random(300, 500); //this code generates random x pos

		randomCanyonX = randomCanyonX + d * ran;

		var randomCanyonWidth = random(60, 130);

		if ((randomCanyonX > 800 && randomCanyonX < 20000)) {
			canyons.push({
				x_pos: randomCanyonX,
				width: randomCanyonWidth
			})
		}

	}

	for (var i = 0; i < 15; i++){
		var randomEnemyX = 0;

		var ran = random(1000, 1500);

		randomEnemyX = randomEnemyX + i * ran;

		enemys.push({
			x_pos: randomEnemyX,
			y_pos: floorPos_y,
			isDead: false,
			isAgrivated: false,
		})

		
	}

}

function draw() {

	background(100, 155, 255); // fill the sky blue
	image(bg, 0, 0, 1024, 576);

	noStroke();
	fill(170, 255, 254);
	rect(0, floorPos_y, width, height / 4); // draw some green ground

	push();
	translate(scrollPos, 0);
	// Draw clouds.

	drawClouds();

	// Draw mountains.

	drawMountains();
	// Draw trees.

	drawTrees();

	// Draw canyons.
	for (var l = 0; l < canyons.length; l++) {
		drawCanyon(canyons[l]);
		checkCanyon(canyons[l]); //calling check cannyon function to determine if character is over the canyon
	}

	if (isPlummeting == true) {
		gameChar_y += 5; //if checkCanyon sets isPlummeting to true, it makes our character fall

	}


	//Draw Enemy & Check if character is in range for damage
	for (var i = 0; i < enemys.length; i++){
		drawEnemy(enemys[i]);
		checkDamage(enemys[i]);

		//Animate
		if(enemys[i].y_pos < floorPos_y){
		enemys[i].y_pos += random(-1,1);
		}else{
			enemys[i].y_pos -= 1;
		}

		if(enemys[i].isAgrivated == true){
			enemys[i].x_pos -= 2;
		} else{
		enemys[i].x_pos -= 1;}


		//Check if enemy is angry
		var distance = dist(gameChar_world_x, gameChar_y, enemys[i].x_pos, enemys[i].y_pos)
	
		if(distance < 200){
			enemys[i].isAgrivated = true;
		}else{
			enemys[i].isAgrivated = false;
		}
	}

	//Draw player weapon
	

	
	// Draw collectable items

	for (var m = 0; m < collectables.length; m++) {
		if (collectables[m].isFound == false) { //checks if collectable is found, if it isnt, it allows the code to run again
			drawCollectable(collectables[m]);
			checkCollectable(collectables[m]); //calling checkCollectable to determine if character is in range to collect it

			if (collectables[m].isFound == true) {
				game_score += round(collectables[m].size); //Checks when the colelctable is found and adds the size of the collectable to the score
			}
		}
	}

	//Render flagpole
	renderFlagpole(flagpole);

	pop();

	
	// Draw game character.
	drawGameChar();
	playerWeapon();
	//If the player dies, display a message allowing them to restart the game
	fill(255);
	stroke(0);
	if (lives == 0) {
		text("Game over. Press space to continue", 300, height / 2);
		textSize(30);
		text("Score: " + String(game_score), 500, height / 2 + 50);
		if (keyCode == 32) {
			startGame();
		}
		return;
	}

	//If player reaches flagpole display message
	if (flagpole.isReached == true) {
		text("Level Complete. Press Spce to continue", 300, height / 2);
		textSize(30);
		text("Score: " + String(game_score), 500, height / 2 + 50);
		flagpole.y_pos -= 10;

		if (gameChar_y < floorPos_y) {
			gameChar_y = floorPos_y;
		}

		if (keyCode == 32) {
			startGame();
		}
		return;

	}

	noFill();
	noStroke();


	// Logic to make the game character move or the background scroll.
	if (isPlummeting == false) {
		if (isLeft) {
			if (gameChar_x > width * 0.2) {
				gameChar_x -= 5;
			} else {
				scrollPos += 5;
			}
		}

		if (isRight) {
			if (gameChar_x < width * 0.8) {
				gameChar_x += 5;
			} else {
				scrollPos -= 5; // negative for moving against the background
			}
		}
	}
	// Logic to make the game character rise and fall.


	if (gameChar_y == floorPos_y) {
		if (isFalling == true) {
			gameChar_y -= 100;
		}
	}

	if (gameChar_y < floorPos_y) {
		gameChar_y += 2;
		isFalling = true;
		if (gameChar_y == floorPos_y) {

			isFalling = false;
		}

	}

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;


	//Draw game score
	fill(255);
	stroke(0);
	textSize(30);
	text("Score: " + String(game_score), 10, 40);
	text("Lives: ", 10, 70);
	noFill();
	noStroke();

	charHealth();
	noFill();
	noStroke();

	//Visualise lives with a bear head
	for (var i = 0; i < lives; i++) {
		fill(117, 95, 30);
		rect(110 - 12 + (45 * i), 107 - 62, 30, 25);
		fill(117, 95, 30);
		rect(110 - 15 + (45 * i), 107 - 67, 8, 10);
		rect(110 + 13 + (45 * i), 107 - 67, 8, 10);
		fill(138, 112, 36);
		rect(110 - 15 + (45 * i), 107 - 67, 4, 5);
		rect(110 + 17 + (45 * i), 107 - 67, 4, 5);
		fill(214, 155, 141);
		rect(110 - 11 + (45 * i), 107 - 62, 4, 5);
		rect(110 + 13 + (45 * i), 107 - 62, 4, 5);
		fill(0);
		rect(110 - 3 + (45 * i), 107 - 48, 4, 4);
		rect(110 + 7 + (45 * i), 107 - 48, 4, 4);
		rect(110 + 3 + (45 * i), 107 - 43, 4, 4);
		fill(117, 95, 30);
		rect(110 - 9 + (45 * i), 107 - 38, 23, 5);
	}

	//If flagpole is not reached, check until it is. If it's reached, animate the flag to fly away.
	if (flagpole.isReached == false) {
		checkFlagpole(flagpole);
	}

	//Checks if character fell out of the map. If so take a life away and reset the position of the game character
	if (gameChar_y > 1024) {
		gameChar_y = floorPos_y;
		gameChar_x -= 100;;
		isPlummeting = false;
		lives -= 1;
		health = 100;

	}

	if(gameChar_y < floorPos_y){
		walkSound.stop();
	}

}
// ---------------------
// Key control functions
// ---------------------

function keyPressed() {

	// if statements to control the animation of the character when
	// keys are pressed.

	//open up the console to see how these work

	if (keyCode == 65) {
		isLeft = true;

			walkSound.play();
			walkSound.loop();
		

	

		
	}

	if (keyCode == 68) {
		isRight = true;

			walkSound.play();
			walkSound.loop();

	}

	if (keyCode == 87) {
		isFalling = true;

	}

	if (keyCode == 32 && isPlummeting == false) { //this allows us to return to ground unless we are plummeting
		isFalling = false;
		gameChar_y = floorPos_y;
	}




}

function keyReleased() {



	// if statements to control the animation of the character when
	// keys are released.



	if (keyCode == 65) {
		isLeft = false;
		walkSound.stop();
	}

	if (keyCode == 68) {
		isRight = false;
		walkSound.stop();
	}

	if (keyCode == 87) {
		isFalling = false;
		
	}



}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar() {
	// draw game character
	noStroke();
	//the game character
	if (isLeft && isFalling) {
		//Jumping to the left



		//Add your code here ...
		//legs
		fill(138, 112, 36);
		rect(gameChar_x - 9, gameChar_y - 5, 8, 8);

		//torso
		fill(117, 95, 30);
		rect(gameChar_x - 12, gameChar_y - 30, 15, 25);

		//neck
		fill(117, 95, 30);
		rect(gameChar_x - 8, gameChar_y - 35, 7, 5);
		rect(gameChar_x - 7, gameChar_y - 39, 10, 5);

		//head
		fill(117, 95, 30);
		rect(gameChar_x - 15, gameChar_y - 60, 20, 25);

		//ear
		fill(117, 95, 30);
		rect(gameChar_x - 10, gameChar_y - 67, 5, 10);



		//face
		fill(0);
		rect(gameChar_x - 12, gameChar_y - 50, 3, 4);
		rect(gameChar_x - 17, gameChar_y - 45, 4, 4);

		//tail
		fill(220);
		rect(gameChar_x + 3, gameChar_y - 11, 4, 4);


		//==========Details

		//arm details

		//leg details
		fill(94, 77, 25);
		rect(gameChar_x - 9, gameChar_y - 5, 8, 4);

		//neck details
		fill(94, 77, 25);



		//head details
		fill(138, 112, 36);
		rect(gameChar_x - 15, gameChar_y - 55, 4, 4);
		fill(94, 77, 25);
		rect(gameChar_x, gameChar_y - 60, 5, 4);
		rect(gameChar_x + 1, gameChar_y - 37, 4, 3);
		rect(gameChar_x + 3, gameChar_y - 43, 2, 8);

		//torso details
		fill(94, 77, 25);
		rect(gameChar_x - 1, gameChar_y - 16, 4, 11);
		rect(gameChar_x - 12, gameChar_y - 9, 5, 5);
		rect(gameChar_x - 10, gameChar_y - 30, 3, 7);

		//arms
		fill(138, 112, 36);
		rect(gameChar_x - 9, gameChar_y - 50, 7, 23);

		//ear details
		fill(138, 112, 36);
		rect(gameChar_x - 10, gameChar_y - 67, 5, 5);

		fill(117, 95, 30);
		rect(gameChar_x - 9, gameChar_y - 50, 4, 16);

		fill(138, 112, 36);
		rect(gameChar_x - 9, gameChar_y - 50, 1, 16);
		rect(gameChar_x - 9, gameChar_y - 50, 5, 1);

	} else if (isRight && isFalling) {
		//Add your code here ...

		//legs
		fill(94, 77, 25);
		rect(gameChar_x - 9, gameChar_y - 5, 8, 8);

		//torso
		fill(117, 95, 30);
		rect(gameChar_x - 12, gameChar_y - 30, 15, 25);

		//neck
		fill(117, 95, 30);
		rect(gameChar_x - 8, gameChar_y - 35, 7, 5);
		rect(gameChar_x - 15, gameChar_y - 39, 10, 5);

		//head
		fill(117, 95, 30);
		rect(gameChar_x - 15, gameChar_y - 60, 20, 25);

		//ear
		fill(117, 95, 30);
		rect(gameChar_x - 4, gameChar_y - 67, 5, 10);

		//arms
		fill(138, 112, 36);
		rect(gameChar_x - 8, gameChar_y - 50, 7, 23);

		//face
		fill(0);
		rect(gameChar_x - 1, gameChar_y - 50, 3, 4);
		rect(gameChar_x + 3, gameChar_y - 45, 4, 4);

		//tail
		fill(220);
		rect(gameChar_x - 16, gameChar_y - 11, 4, 4);


		//==========Details

		//arm details
		fill(117, 95, 30);
		rect(gameChar_x - 8, gameChar_y - 50, 5, 5);
		fill(138, 112, 36);
		rect(gameChar_x - 8, gameChar_y - 50, 1, 5);
		rect(gameChar_x - 8, gameChar_y - 50, 5, 1);


		noStroke();
		//head details
		fill(138, 112, 36);
		rect(gameChar_x - 13, gameChar_y - 60, 8, 3);
		rect(gameChar_x - 11, gameChar_y - 57, 3, 3);
		rect(gameChar_x - 11, gameChar_y - 41, 3, 3);

		fill(94, 77, 25);
		rect(gameChar_x + 3, gameChar_y - 57, 2, 7);
		rect(gameChar_x - 15, gameChar_y - 41, 2, 7);


		//torso details
		fill(94, 77, 25);

		fill(138, 112, 36);
		rect(gameChar_x - 12, gameChar_y - 20, 3, 3);
		rect(gameChar_x - 10, gameChar_y - 20, 2, 6);


		//ear details
		fill(138, 112, 36);
		rect(gameChar_x - 4, gameChar_y - 67, 5, 5);
	} else if (isLeft) {
		//legs
		fill(138, 112, 36);
		rect(gameChar_x - 9, gameChar_y - 5, 8, 8);

		//torso
		fill(117, 95, 30);
		rect(gameChar_x - 12, gameChar_y - 30, 15, 25);

		//neck
		fill(117, 95, 30);
		rect(gameChar_x - 8, gameChar_y - 35, 7, 5);
		rect(gameChar_x - 7, gameChar_y - 39, 10, 5);

		//head
		fill(117, 95, 30);
		rect(gameChar_x - 15, gameChar_y - 60, 20, 25);

		//ear
		fill(117, 95, 30);
		rect(gameChar_x - 10, gameChar_y - 67, 5, 10);

		//arms
		fill(138, 112, 36);
		rect(gameChar_x - 9, gameChar_y - 30, 23, 7);

		//face
		fill(0);
		rect(gameChar_x - 11, gameChar_y - 50, 4, 4);
		rect(gameChar_x - 17, gameChar_y - 45, 4, 4);

		//tail
		fill(220);
		rect(gameChar_x + 3, gameChar_y - 11, 4, 4);


		//==========Details

		//arm details
		fill(117, 95, 30);
		rect(gameChar_x - 2, gameChar_y - 30, 16, 4);
		rect(gameChar_x + 10, gameChar_y - 27, 4, 4);

		//leg details
		fill(94, 77, 25);
		rect(gameChar_x - 9, gameChar_y - 5, 8, 4);

		//neck details
		fill(94, 77, 25);
		rect(gameChar_x - 8, gameChar_y - 33, 3, 3);


		//head details
		fill(138, 112, 36);
		rect(gameChar_x - 15, gameChar_y - 55, 4, 4);
		fill(94, 77, 25);
		rect(gameChar_x, gameChar_y - 60, 5, 4);
		rect(gameChar_x + 1, gameChar_y - 37, 4, 3);
		rect(gameChar_x + 3, gameChar_y - 43, 2, 8);

		//torso details
		fill(94, 77, 25);
		rect(gameChar_x - 1, gameChar_y - 16, 4, 11);
		rect(gameChar_x - 12, gameChar_y - 9, 5, 5);
		rect(gameChar_x - 10, gameChar_y - 30, 3, 7);

		//ear details
		fill(138, 112, 36);
		rect(gameChar_x - 10, gameChar_y - 67, 5, 5);
	} else if (isRight) {
		//legs
		fill(94, 77, 25);
		rect(gameChar_x - 9, gameChar_y - 5, 8, 8);

		//torso
		fill(117, 95, 30);
		rect(gameChar_x - 12, gameChar_y - 30, 15, 25);

		//neck
		fill(117, 95, 30);
		rect(gameChar_x - 8, gameChar_y - 35, 7, 5);
		rect(gameChar_x - 15, gameChar_y - 39, 10, 5);

		//head
		fill(117, 95, 30);
		rect(gameChar_x - 15, gameChar_y - 60, 20, 25);

		//ear
		fill(117, 95, 30);
		rect(gameChar_x - 4, gameChar_y - 67, 5, 10);

		//arms
		fill(138, 112, 36);
		rect(gameChar_x - 23, gameChar_y - 30, 23, 7);

		//face
		fill(0);
		rect(gameChar_x - 3, gameChar_y - 50, 4, 4);
		rect(gameChar_x + 3, gameChar_y - 45, 4, 4);

		//tail
		fill(220);
		rect(gameChar_x - 16, gameChar_y - 11, 4, 4);


		//==========Details

		//arm details
		fill(117, 95, 30);
		rect(gameChar_x - 23, gameChar_y - 30, 5, 5);


		//leg details
		fill(94, 77, 25);


		//neck details
		fill(94, 77, 25);
		rect(gameChar_x - 4, gameChar_y - 35, 3, 3);


		//head details
		fill(138, 112, 36);
		rect(gameChar_x - 13, gameChar_y - 60, 8, 3);
		rect(gameChar_x - 11, gameChar_y - 57, 3, 3);
		rect(gameChar_x - 11, gameChar_y - 41, 3, 3);

		fill(94, 77, 25);
		rect(gameChar_x + 3, gameChar_y - 57, 2, 7);
		rect(gameChar_x - 15, gameChar_y - 41, 2, 7);


		//torso details
		fill(94, 77, 25);

		fill(138, 112, 36);
		rect(gameChar_x - 12, gameChar_y - 20, 3, 3);
		rect(gameChar_x - 10, gameChar_y - 20, 2, 6);


		//ear details
		fill(138, 112, 36);
		rect(gameChar_x - 4, gameChar_y - 67, 5, 5);

	} else if (isFalling || isPlummeting) {
		//Add your code here ...

		//torso
		fill(117, 95, 30);
		rect(gameChar_x - 10, gameChar_y - 30, 25, 25);

		//legs
		fill(138, 112, 36);
		rect(gameChar_x - 10, gameChar_y - 5, 10, 8);
		rect(gameChar_x + 5, gameChar_y - 5, 10, 8);



		//neck
		fill(117, 95, 30);
		rect(gameChar_x - 5, gameChar_y - 35, 15, 5);
		rect(gameChar_x - 9, gameChar_y - 38, 23, 5);

		//head
		fill(117, 95, 30);
		rect(gameChar_x - 12, gameChar_y - 62, 30, 25);

		//ears
		fill(117, 95, 30);
		rect(gameChar_x - 15, gameChar_y - 67, 8, 10);
		rect(gameChar_x + 13, gameChar_y - 67, 8, 10);

		//details ears
		fill(138, 112, 36);
		rect(gameChar_x - 15, gameChar_y - 67, 4, 5);
		rect(gameChar_x + 17, gameChar_y - 67, 4, 5);

		//details ears
		fill(214, 155, 141);
		rect(gameChar_x - 11, gameChar_y - 62, 4, 5);
		rect(gameChar_x + 13, gameChar_y - 62, 4, 5);

		//face
		fill(0);
		rect(gameChar_x - 3, gameChar_y - 48, 4, 4);
		rect(gameChar_x + 7, gameChar_y - 48, 4, 4);
		rect(gameChar_x + 3, gameChar_y - 43, 4, 4);

		//=========Body details==========
		//neck details
		fill(94, 77, 25);
		rect(gameChar_x - 5, gameChar_y - 33, 5, 4);

		fill(94, 77, 25);
		rect(gameChar_x + 18, gameChar_y - 40, 4, 4);

		//torso details
		fill(138, 112, 36);
		rect(gameChar_x + 10, gameChar_y - 30, 5, 5);
		fill(94, 77, 25);
		rect(gameChar_x, gameChar_y - 9, 5, 4);
		rect(gameChar_x - 10, gameChar_y - 30, 5, 8);

		//head details
		fill(94, 77, 25);
		rect(gameChar_x - 12, gameChar_y - 46, 3, 10);
		rect(gameChar_x - 9, gameChar_y - 36, 4, 3);

		fill(138, 112, 36);
		rect(gameChar_x + 13, gameChar_y - 50, 5, 4);


		//leg details
		fill(94, 77, 25);
		rect(gameChar_x - 10, gameChar_y - 5, 5, 8); //left leg
		rect(gameChar_x - 5, gameChar_y - 1, 5, 4);

		rect(gameChar_x + 10, gameChar_y - 5, 5, 4);
		rect(gameChar_x + 5, gameChar_y - 1, 5, 4); //right leg

		//arms
		fill(138, 112, 36);
		rect(gameChar_x - 17, gameChar_y - 40, 7, 20);
		rect(gameChar_x + 15, gameChar_y - 40, 7, 20);

		//arm details
		fill(117, 95, 30);
		rect(gameChar_x - 17, gameChar_y - 40, 4, 5);
		rect(gameChar_x + 15, gameChar_y - 40, 4, 5);
		rect(gameChar_x + 18, gameChar_y - 40, 4, 16);
	} else {
		//torso
		fill(117, 95, 30);
		rect(gameChar_x - 10, gameChar_y - 30, 25, 25);

		//legs
		fill(138, 112, 36);
		rect(gameChar_x - 10, gameChar_y - 5, 10, 8);
		rect(gameChar_x + 5, gameChar_y - 5, 10, 8);

		//arms
		rect(gameChar_x - 17, gameChar_y - 30, 7, 20);
		rect(gameChar_x + 15, gameChar_y - 30, 7, 20);

		//neck
		fill(117, 95, 30);
		rect(gameChar_x - 5, gameChar_y - 35, 15, 5);
		rect(gameChar_x - 9, gameChar_y - 38, 23, 5);

		//head
		fill(117, 95, 30);
		rect(gameChar_x - 12, gameChar_y - 62, 30, 25);

		//ears
		fill(117, 95, 30);
		rect(gameChar_x - 15, gameChar_y - 67, 8, 10);
		rect(gameChar_x + 13, gameChar_y - 67, 8, 10);

		//details ears
		fill(138, 112, 36);
		rect(gameChar_x - 15, gameChar_y - 67, 4, 5);
		rect(gameChar_x + 17, gameChar_y - 67, 4, 5);

		//details ears
		fill(214, 155, 141);
		rect(gameChar_x - 11, gameChar_y - 62, 4, 5);
		rect(gameChar_x + 13, gameChar_y - 62, 4, 5);

		//face
		fill(0);
		rect(gameChar_x - 3, gameChar_y - 48, 4, 4);
		rect(gameChar_x + 7, gameChar_y - 48, 4, 4);
		rect(gameChar_x + 3, gameChar_y - 43, 4, 4);

		//=========Body details==========
		//neck details
		fill(94, 77, 25);
		rect(gameChar_x - 5, gameChar_y - 33, 5, 4);

		//arm details
		fill(117, 95, 30);
		rect(gameChar_x - 17, gameChar_y - 30, 4, 5);
		rect(gameChar_x + 15, gameChar_y - 30, 4, 5);
		rect(gameChar_x + 18, gameChar_y - 30, 4, 16);

		fill(94, 77, 25);
		rect(gameChar_x + 18, gameChar_y - 14, 4, 4);

		//torso details
		fill(138, 112, 36);
		rect(gameChar_x + 10, gameChar_y - 30, 5, 5);
		fill(94, 77, 25);
		rect(gameChar_x, gameChar_y - 9, 5, 4);
		rect(gameChar_x - 10, gameChar_y - 30, 5, 8);

		//head details
		fill(94, 77, 25);
		rect(gameChar_x - 12, gameChar_y - 46, 3, 10);
		rect(gameChar_x - 9, gameChar_y - 36, 4, 3);

		fill(138, 112, 36);
		rect(gameChar_x + 13, gameChar_y - 50, 5, 4);


		//leg details
		fill(94, 77, 25);
		rect(gameChar_x - 10, gameChar_y - 5, 5, 8); //left leg
		rect(gameChar_x - 5, gameChar_y - 1, 5, 4);

		rect(gameChar_x + 10, gameChar_y - 5, 5, 4);
		rect(gameChar_x + 5, gameChar_y - 1, 5, 4); //right leg
		//torso
		fill(117, 95, 30);
		rect(gameChar_x - 10, gameChar_y - 30, 25, 25);

		//legs
		fill(138, 112, 36);
		rect(gameChar_x - 10, gameChar_y - 5, 10, 8);
		rect(gameChar_x + 5, gameChar_y - 5, 10, 8);

		//arms
		rect(gameChar_x - 17, gameChar_y - 30, 7, 20);
		rect(gameChar_x + 15, gameChar_y - 30, 7, 20);

		//neck
		fill(117, 95, 30);
		rect(gameChar_x - 5, gameChar_y - 35, 15, 5);
		rect(gameChar_x - 9, gameChar_y - 38, 23, 5);

		//head
		fill(117, 95, 30);
		rect(gameChar_x - 12, gameChar_y - 62, 30, 25);

		//ears
		fill(117, 95, 30);
		rect(gameChar_x - 15, gameChar_y - 67, 8, 10);
		rect(gameChar_x + 13, gameChar_y - 67, 8, 10);

		//details ears
		fill(138, 112, 36);
		rect(gameChar_x - 15, gameChar_y - 67, 4, 5);
		rect(gameChar_x + 17, gameChar_y - 67, 4, 5);

		//details ears
		fill(214, 155, 141);
		rect(gameChar_x - 11, gameChar_y - 62, 4, 5);
		rect(gameChar_x + 13, gameChar_y - 62, 4, 5);

		//face
		fill(0);
		rect(gameChar_x - 3, gameChar_y - 48, 4, 4);
		rect(gameChar_x + 7, gameChar_y - 48, 4, 4);
		rect(gameChar_x + 3, gameChar_y - 43, 4, 4);

		//=========Body details==========
		//neck details
		fill(94, 77, 25);
		rect(gameChar_x - 5, gameChar_y - 33, 5, 4);

		//arm details
		fill(117, 95, 30);
		rect(gameChar_x - 17, gameChar_y - 30, 4, 5);
		rect(gameChar_x + 15, gameChar_y - 30, 4, 5);
		rect(gameChar_x + 18, gameChar_y - 30, 4, 16);

		fill(94, 77, 25);
		rect(gameChar_x + 18, gameChar_y - 14, 4, 4);

		//torso details
		fill(138, 112, 36);
		rect(gameChar_x + 10, gameChar_y - 30, 5, 5);
		fill(94, 77, 25);
		rect(gameChar_x, gameChar_y - 9, 5, 4);
		rect(gameChar_x - 10, gameChar_y - 30, 5, 8);

		//head details
		fill(94, 77, 25);
		rect(gameChar_x - 12, gameChar_y - 46, 3, 10);
		rect(gameChar_x - 9, gameChar_y - 36, 4, 3);

		fill(138, 112, 36);
		rect(gameChar_x + 13, gameChar_y - 50, 5, 4);


		//leg details
		fill(94, 77, 25);
		rect(gameChar_x - 10, gameChar_y - 5, 5, 8); //left leg
		rect(gameChar_x - 5, gameChar_y - 1, 5, 4);

		rect(gameChar_x + 10, gameChar_y - 5, 5, 4);
		rect(gameChar_x + 5, gameChar_y - 1, 5, 4); //right leg

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawClouds() {
	for (var j = 0; j < clouds.length; j++) {
		noStroke(0)
		fill(255, 255, 255);
		ellipse(clouds[j].x_pos - 45, clouds[j].y_pos - 5, clouds[j].size + 25, clouds[j].size + 25);
		ellipse(clouds[j].x_pos - 20, clouds[j].y_pos - 5, clouds[j].size + 35, clouds[j].size + 35);
		ellipse(clouds[j].x_pos, clouds[j].y_pos, clouds[j].size + 10, clouds[j].size + 10);
		ellipse(clouds[j].x_pos + 25, clouds[j].y_pos + 3, clouds[j].size - 5, clouds[j].size - 5);

		//grey clouds
		fill(222, 222, 222);
		ellipse(clouds[j].x_pos - 25, clouds[j].y_pos - 15, clouds[j].size + 10, clouds[j].size + 10);
		ellipse(clouds[j].x_pos - 10, clouds[j].y_pos - 15, clouds[j].size + 25, clouds[j].size + 25);
		ellipse(clouds[j].x_pos + 15, clouds[j].y_pos - 10, clouds[j].size, clouds[j].size);
		ellipse(clouds[j].x_pos + 25, clouds[j].y_pos - 7, clouds[j].size - 10, clouds[j].size - 10);
		ellipse(clouds[j].x_pos - 5, clouds[j].y_pos - 25, clouds[j].size + 10, clouds[j].size + 10);
		ellipse(clouds[j].x_pos, clouds[j].y_pos - 25, clouds[j].size + 25, clouds[j].size + 25);
		ellipse(clouds[j].x_pos + 25, clouds[j].y_pos - 20, clouds[j].size, clouds[j].size);
		ellipse(clouds[j].x_pos + 35, clouds[j].y_pos - 17, clouds[j].size - 10, clouds[j].size - 10);
		ellipse(clouds[j].x_pos - 65, clouds[j].y_pos - 15, clouds[j].size + 10, clouds[j].size + 10);
		ellipse(clouds[j].x_pos - 40, clouds[j].y_pos, clouds[j].size - 5, clouds[j].size - 5);


		//Extra layer of white clouds
		fill(255, 255, 255);
		ellipse(clouds[j].x_pos - 35, clouds[j].y_pos - 25, clouds[j].size + 25, clouds[j].size + 25);
		ellipse(clouds[j].x_pos - 20, clouds[j].y_pos - 25, clouds[j].size + 35, clouds[j].size + 35);
		ellipse(clouds[j].x_pos, clouds[j].y_pos - 20, clouds[j].size + 10, clouds[j].size + 10);
		ellipse(clouds[j].x_pos + 25, clouds[j].y_pos - 17, clouds[j].size - 5, clouds[j].size - 5);

		fill(255, 255, 255, 0.24)
		rect(0, 300, 1024, 244)
	}
}

// Function to draw mountains objects.

function drawMountains() {
	//mountains
	for (var k = 0; k < mountains.length; k++) {
		stroke(0);
		fill(255);
		triangle(mountains[k].x_pos + 30, mountains[k].y_pos + 25, mountains[k].x_pos + 123, mountains[k].y_pos - 135, mountains[k].x_pos + 189, mountains[k].y_pos + 25);

		fill(165, 242, 243);
		triangle(mountains[k].x_pos + 30, mountains[k].y_pos + 12, mountains[k].x_pos + 100, mountains[k].y_pos - 95, mountains[k].x_pos + 150, mountains[k].y_pos + 12);
		triangle(mountains[k].x_pos + 65, mountains[k].y_pos + 12, mountains[k].x_pos + 115, mountains[k].y_pos - 95, mountains[k].x_pos + 200, mountains[k].y_pos + 12);
		triangle(mountains[k].x_pos + 95, mountains[k].y_pos + 12, mountains[k].x_pos + 140, mountains[k].y_pos - 95, mountains[k].x_pos + 220, mountains[k].y_pos + 12);

		fill(220, 220, 220);
		triangle(mountains[k].x_pos + 15, mountains[k].y_pos + 22, mountains[k].x_pos + 75, mountains[k].y_pos - 55, mountains[k].x_pos + 100, mountains[k].y_pos + 22);
		triangle(mountains[k].x_pos + 45, mountains[k].y_pos + 22, mountains[k].x_pos + 90, mountains[k].y_pos - 55, mountains[k].x_pos + 150, mountains[k].y_pos + 22);
		triangle(mountains[k].x_pos + 75, mountains[k].y_pos + 22, mountains[k].x_pos + 115, mountains[k].y_pos - 55, mountains[k].x_pos + 200, mountains[k].y_pos + 22);
		triangle(mountains[k].x_pos + 105, mountains[k].y_pos + 22, mountains[k].x_pos + 140, mountains[k].y_pos - 55, mountains[k].x_pos + 210, mountains[k].y_pos + 22);
		triangle(mountains[k].x_pos + 125, mountains[k].y_pos + 22, mountains[k].x_pos + 170, mountains[k].y_pos - 55, mountains[k].x_pos + 235, mountains[k].y_pos + 22);

		fill(200, 200, 200)
		triangle(mountains[k].x_pos, mountains[k].y_pos + 32, mountains[k].x_pos + 48, mountains[k].y_pos - 20, mountains[k].x_pos + 100, mountains[k].y_pos + 32);
		triangle(mountains[k].x_pos + 30, mountains[k].y_pos + 32, mountains[k].x_pos + 80, mountains[k].y_pos - 20, mountains[k].x_pos + 130, mountains[k].y_pos + 32);
		triangle(mountains[k].x_pos + 60, mountains[k].y_pos + 32, mountains[k].x_pos + 110, mountains[k].y_pos - 20, mountains[k].x_pos + 160, mountains[k].y_pos + 32);
		triangle(mountains[k].x_pos + 90, mountains[k].y_pos + 32, mountains[k].x_pos + 140, mountains[k].y_pos - 20, mountains[k].x_pos + 190, mountains[k].y_pos + 32);
		triangle(mountains[k].x_pos + 120, mountains[k].y_pos + 32, mountains[k].x_pos + 170, mountains[k].y_pos - 20, mountains[k].x_pos + 220, mountains[k].y_pos + 32);
		triangle(mountains[k].x_pos + 150, mountains[k].y_pos + 32, mountains[k].x_pos + 200, mountains[k].y_pos - 20, mountains[k].x_pos + 250, mountains[k].y_pos + 32);
	}

}

// Function to draw trees objects.

function drawTrees() {
	for (var i = 0; i < trees_x.length; i++) {

		noStroke();
		fill(153, 76, 0);
		rect(trees_x[i] - 5, treePos_y + 33, 20, 50); //+15 +33

		fill(248, 248, 255);
		ellipse(trees_x[i] + 8, treePos_y + 10, 80, 80); // +25 +10
		ellipse(trees_x[i] - 27, treePos_y + 23, 50, 50); // -5 +20
		ellipse(trees_x[i] - 17, treePos_y, 50, 50);
		ellipse(trees_x[i] - 2, treePos_y - 20, 50, 50); // +15, -20
		ellipse(trees_x[i] + 38, treePos_y + 20, 50, 50); //+55 +20
		ellipse(trees_x[i] - 2, treePos_y - 40, 30, 40); //+15 -40

		fill(0);
		ellipse(trees_x[i] + 1, treePos_y + 70, 10, 10); //+21 +70

		//tree shadow

		fill(0, 0, 0, 99);
		ellipse(trees_x[i], treePos_y + 90, 65, 20); // +23 +93
		//ellipse(trees_X[i], treePos_y, 10, 10); 
	}
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon) {
	fill(0);
	rect(t_canyon.x_pos, 432, t_canyon.width, 160);
	fill(200, 200, 200);
	noStroke();
	fill(255, 140, 0)
	rect(t_canyon.x_pos, 540, t_canyon.width, 50);
}

function drawEnemy(t_enemy){



	if(t_enemy.isAgrivated == false && t_enemy.isDead == false){
	fill(255 ,255, 0)
	stroke(0);
	strokeWeight(2);
	//Body & Head
	ellipse(t_enemy.x_pos, t_enemy.y_pos - 50, 70, 50,);
	noStroke();
	
	ellipse(t_enemy.x_pos - 30, t_enemy.y_pos - 50, 40,30);

	fill(0);
	ellipse(t_enemy.x_pos - 43, t_enemy.y_pos - 52, 7, 7);

	//Stripes
	stroke(0);
	strokeWeight(4);
	beginShape(LINES);
	vertex(t_enemy.x_pos - 42, t_enemy.y_pos - 65);
	vertex(t_enemy.x_pos - 42, t_enemy.y_pos - 73);
	vertex(t_enemy.x_pos - 42, t_enemy.y_pos - 73);
	vertex(t_enemy.x_pos - 38, t_enemy.y_pos - 80);
	vertex(t_enemy.x_pos - 42, t_enemy.y_pos - 73);
	vertex(t_enemy.x_pos - 46, t_enemy.y_pos - 78);

	//Antenas
	fill(0);
	strokeWeight(7);
	vertex(t_enemy.x_pos - 25 , t_enemy.y_pos - 36);
	vertex(t_enemy.x_pos - 25 , t_enemy.y_pos - 65);

	vertex(t_enemy.x_pos - 5 , t_enemy.y_pos - 30);
	vertex(t_enemy.x_pos - 5 , t_enemy.y_pos - 71);

	vertex(t_enemy.x_pos + 15 , t_enemy.y_pos - 31);
	vertex(t_enemy.x_pos + 15 , t_enemy.y_pos - 70);
	endShape();

	strokeWeight(1);
	fill(255, 239, 213);
	ellipse(t_enemy.x_pos , t_enemy.y_pos - 70, 20 , 40);

	noFill();
	noStroke();
	} else if (t_enemy.isAgrivated == true && t_enemy.isDead == false){
		fill(255 ,255, 0)
		stroke(0);
		strokeWeight(2);
		//Body & Head
		ellipse(t_enemy.x_pos, t_enemy.y_pos - 50, 70, 50,);
		noStroke();
		
		ellipse(t_enemy.x_pos - 30, t_enemy.y_pos - 50, 40,30);
	
		fill(0);
		ellipse(t_enemy.x_pos - 43, t_enemy.y_pos - 52, 7, 2);
	
		//Stripes
		stroke(0);
		strokeWeight(4);
		beginShape(LINES);
		vertex(t_enemy.x_pos - 42, t_enemy.y_pos - 65);
		vertex(t_enemy.x_pos - 42, t_enemy.y_pos - 73);
		vertex(t_enemy.x_pos - 42, t_enemy.y_pos - 73);
		vertex(t_enemy.x_pos - 38, t_enemy.y_pos - 80);
		vertex(t_enemy.x_pos - 42, t_enemy.y_pos - 73);
		vertex(t_enemy.x_pos - 46, t_enemy.y_pos - 78);
	
		//Antenas
		fill(0);
		strokeWeight(7);
		vertex(t_enemy.x_pos - 25 , t_enemy.y_pos - 36);
		vertex(t_enemy.x_pos - 25 , t_enemy.y_pos - 65);
	
		vertex(t_enemy.x_pos - 5 , t_enemy.y_pos - 30);
		vertex(t_enemy.x_pos - 5 , t_enemy.y_pos - 71);
	
		vertex(t_enemy.x_pos + 15 , t_enemy.y_pos - 31);
		vertex(t_enemy.x_pos + 15 , t_enemy.y_pos - 70);
		endShape();
	
		strokeWeight(1);
		fill(255, 239, 213);
		ellipse(t_enemy.x_pos , t_enemy.y_pos - 70, 20 , 40);
	
		noFill();
		noStroke();
	}

}
// Function to check character is over a canyon.

function checkCanyon(t_canyon) {

	if (gameChar_world_x - 12 > t_canyon.x_pos && gameChar_world_x + 12 < t_canyon.x_pos + t_canyon.width) { //this checks if character is above a canyon
		if (gameChar_y >= floorPos_y) {
			isPlummeting = true;
			if (isPlummeting == true) {
				gameChar_x = gameChar_x + 0.6; //this gives a more natural falling animation
			}
		}
	}





}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable) {
	stroke(0);
	strokeWeight(2);
	fill(240, 240, 70);
	ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size, t_collectable.size);
	fill(245, 255, 46);
	ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size - 10, t_collectable.size - 10);
	image(mario, t_collectable.x_pos - (t_collectable.size / 4), t_collectable.y_pos - (t_collectable.size / 4), t_collectable.size - (t_collectable.size / 2), t_collectable.size - (t_collectable.size / 2)); //centers the image of mario perfectly in the middle of the coin

}

// Function to check character has collected an item.

function checkCollectable(t_collectable) {
	var distance = dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos)

	if (distance < t_collectable.size -10) {
		t_collectable.isFound = true; //sets isFound to true so it doesn't render the coin anymore

	}
}
//Draw flagpole
function renderFlagpole(t_flagpole) {

	if (t_flagpole.isReached == false) {
		fill(40, 40, 40);
		rect(t_flagpole.x_pos, t_flagpole.y_pos - 100, 5, 100);
		rect(t_flagpole.x_pos, t_flagpole.y_pos - 100, 40, 20);
	} else if (t_flagpole.isReached == true) {
		fill(40, 40, 40);
		rect(t_flagpole.x_pos, t_flagpole.y_pos - 100, 5, 100);
		rect(t_flagpole.x_pos, t_flagpole.y_pos - 100, 40, 20);

	}

}
//Check if flagpole is reached
function checkFlagpole(t_flagpole) {

	var distance = dist(gameChar_world_x, gameChar_y, t_flagpole.x_pos, t_flagpole.y_pos);

	//If the player is close enough to the flagpole it sets the flagpole reached to true.
	if (distance < 20) {
		t_flagpole.isReached = true;
	}

} 
//Animate players health
function charHealth() {

	fill(255);
	stroke(0);
	textSize(30);
	text("Health: ", 10, 100);
	fill(255, 0, 0);
	stroke(0);

	//For loop to indicate % of health on top left in a red bar
	for (var i = 0; i < health; i++) {
		rect(110, 81, health, 20);
	}

}
//Check if enemy is giving damage
function checkDamage(t_enemy){

	var distance = dist(gameChar_world_x, gameChar_y, t_enemy.x_pos, t_enemy.y_pos)

	//Check distance to the enemy, if character is close enough make the enemy damage player
	if(distance < 60){
		health -= 2;

		//If the player dies, it causes the bee to despawn and change position in order to make the player to not take damage when spawned again
		if(health <= 0){
			t_enemy.x_pos = -1000
			t_enemy.isDead = true;
			
		}
	}	

	//Make character die if it reaches 0 health + Death animation
	if(health <= 0){
		gameChar_y += 0.5;
		gameChar_x +=  random(-1,+1);
	}
}

function playerWeapon(){
	
	if(keyCode == 67){	//When key is pressed
		fill(255,255,0);
		ellipse(weaponX, gameChar_y - 20, 20, 20); // Draw ellipse
		weaponX += 10;		//set ellipse to increment x by 10
		var distance = dist( gameChar_x, gameChar_y - 20, weaponX, floorPos_y - 20); //Calculate distance between ellipse in order to return ellipse to player
		if(distance > 400){ 
		weaponX = gameChar_x; //reset ellipse pos
		weaponX += 0; //set weapon speed back to 0
		keyCode = null; //reset key code in order so the ellipse doesn't keep firing
		}
		
	} 
	
	

	
	
}



