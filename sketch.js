/*

The Game Project

1 - Background Scenery

Use p5 drawing functions such as rect, ellipse, line, triangle and point to draw the scenery as set out in the code comments. The items should appear next to the text titles.

Each bit of scenery is worth three marks:

0 marks = not a reasonable attempt
1 mark = attempted but it's messy or lacks detail
2 marks = You've used lots of shape functions to create the scenery
3 marks = You went a bit further with your graphics

I've given titles and chosen some base colours, but feel free to imaginatively modify these and interpret the scenery titles loosely to match your game theme.

When you have completed your game scenery upload here as a zip file.


*/

function setup() {
	createCanvas(1024, 576);

}



function draw() {

	background(0, 42, 255); //fill the sky blue

	
	
	
	
	//stars
	fill(238, 255, 0);
	

	var i;
	var x = Math.floor(Math.random() * 1024);
	var y = Math.floor(Math.random() * 500);

	for (i = 0; i < 10; i++)
	{
	ellipse(x, y, 5 ,5);
	break;
	}






	
	
	








	noStroke();
	fill(0, 155, 0);
	rect(0, 432, 1024, 144); //draw some green ground

	//1. a cloud in the sky
	//... add your code here
	fill(255, 255, 255);
	ellipse(130, 100, 65, 65);
	ellipse(150, 100, 75, 75);
	ellipse(175, 105, 50, 50);
	ellipse(200, 108, 35, 35);

	//grey clouds
	fill(222, 222, 222);
	ellipse(150, 90, 50, 50);
	ellipse(165, 90, 65, 65);
	ellipse(190, 95, 40, 40);
	ellipse(200, 98, 30, 30);
	ellipse(170, 80, 50, 50);
	ellipse(175, 80, 65, 65);
	ellipse(200, 85, 40, 40);
	ellipse(210, 88, 30, 30);
	ellipse(110, 90, 50, 50);
	ellipse(135, 105, 35, 35);

	//lighting
	fill(238, 255, 0);
	rect(135, 100, 15, 30);
	rect(140, 120, 11, 30);
	rect(144, 140, 11, 20);
	rect(148, 155, 11, 10);
	triangle(148, 165, 159, 165, 152, 180)

	//Extra layer of white clouds
	fill(255, 255, 255);
	ellipse(130, 80, 65, 65);
	ellipse(150, 80, 75, 75);
	ellipse(175, 85, 50, 50);
	ellipse(200, 88, 35, 35);


	fill(255, 255, 255, 0.24)
	rect(0, 300, 1024, 244)






	noStroke();
	fill(0);
	text("cloud", 200, 100);

	//2. a mountain in the distance
	//... add your code here


	fill(255);
	triangle(430, 425, 523, 265, 589, 425);

	fill(165, 242, 243);
	triangle(430, 412, 500, 305, 550, 412);
	triangle(465, 412, 515, 305, 600, 412);
	triangle(495, 412, 540, 305, 620, 412);

	fill(220, 220, 220);
	triangle(415, 422, 475, 345, 500, 422);
	triangle(445, 422, 490, 345, 550, 422);
	triangle(475, 422, 515, 345, 600, 422);
	triangle(505, 422, 540, 345, 610, 422);
	triangle(525, 422, 570, 345, 635, 422);

	fill(200, 200, 200)
	triangle(400, 432, 448, 380, 500, 432);
	triangle(430, 432, 480, 380, 530, 432);
	triangle(460, 432, 510, 380, 560, 432);
	triangle(490, 432, 540, 380, 590, 432);
	triangle(520, 432, 570, 380, 620, 432);
	triangle(550, 432, 600, 380, 650, 432);



	noStroke();
	fill(255);
	text("mountain", 500, 256);

	//3. a tree
	//... add your code here

	noStroke();
	fill(255);
	text("tree", 800, 346);

	//4. a canyon
	//NB. the canyon should go from ground-level to the bottom of the screen

	//... add your code here

	noStroke();
	fill(255);
	text("canyon", 100, 480);

	//5. a collectable token - eg. a jewel, fruit, coins
	//... add your code here

	noStroke();
	fill(255);
	text("collectable item", 400, 400);


}