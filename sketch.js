//create global variable
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground, groundImage;
var invisibleGround;

var monkey , monkey_running;

var banana ,bananaImage, bananaGroup;

var obstacle, obstacleImage, obstacleGroup;

var restart, restartImage;

var collectSound, clickSound, dieSound;

var score;
var energy;

function preload(){
 
  //load image for ground
  groundImage = loadImage("257c9b7d-354d-47e5-be5a-06f9eb5e043b.png");
  
  //load animation for running monkey
  monkey_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  
  //load image of banana and the obstacles
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
 
  
  //load restart image
  restartImage = loadImage("restart.png");
  
  //load collecting sound
  collectSound = loadSound("Collecting-Money-Coins-B-www.fesliyanstudios.com.mp3");
  
  //load die sound
  dieSound = loadSound("Drum-Sticks-Hit-G-www.fesliyanstudios.com.mp3");
  
  //load click sound
  clickSound = loadSound("Mouse_Click_4-fesliyanstudios.com.mp3");
  
  //make obstacle and banana groups
  obstacleGroup = new Group();
  bananaGroup = new Group();
}



function setup() {
  createCanvas(400,400);

  //create ground sprite and add image to it
  ground = createSprite(200,340);
  ground.addImage(groundImage);

  //create invisible ground and give it's properties
  invisibleGround = createSprite(200,355);
  invisibleGround.addImage(groundImage);
  invisibleGround.visible = false;

  //create monkey sprite and it's properties
  monkey = createSprite(30,340);
  monkey.addAnimation("Running", monkey_running);
  monkey.scale = 0.1;
  
  //create restart button and give it's properties
  restart = createSprite(200,230);
  restart.addImage(restartImage);
  restart.scale = 0.8;
  restart.visible = false;
  
  //determine the value for score and energy
  score = 0;
  energy = 5;
  
}


function draw() {
  //give background colour
background("white");
  
  //if else if condition
  if (gameState === PLAY) {
    
    //give ground a velocity
     ground.velocityX = -(3 + 3*score/200);
    
    //make ground reset it's position to the centre if it's x position is less than 0
          if (ground.x < 0) {
      ground.x = ground.width/2;
      }
    
    //jump when the space button is pressed
if (keyDown("space") && monkey.y > 160) {
  monkey.velocityY = -10;
}

    //give gravity to the monkey
    monkey.velocityY = monkey.velocityY + 0.7;
    
    //if banana grp touches monkey, increase the energy by 2, destroy the banana and play collect sound
    if (bananaGroup.isTouching(monkey)) {
        bananaGroup.destroyEach();
      energy = energy + 2;
      collectSound.play();
        }
    
    //call spawnBananas function
  spawnBananas();
  
  //call Obs function
  Obs();
  
  //call scoring function
  scoring();
  
    //if monkey touches obstacle grp, gamestate should become END and die sound should be played
  if (obstacleGroup.isTouching(monkey)) {
  gameState = END;
    dieSound.play();
      }
    
  } else if (gameState === END) {
     
    //make restart sprite visible
    restart.visible = true;
    
    //display gameover text
     fill("black");
  textSize(40);
  textFont("Times New Roman" + BOLD);
  text(" G A M E  O V E R ",20,180);
    
    //make monkey's y velocity 0 so that it does not jump once it touches any of the obstacle
     monkey.velocityY = 0;
    
    //make ground's velocity 0 so that it looks like if the monkey has stopped walking
    ground.velocityX = 0;
    
    //make velocity x of banana and obstacle grp to 0 
    bananaGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    
    //destroy banana grp
    bananaGroup.destroyEach();
    
    //set lifetime of banana and obstacle grp to -1 to never make them dissapeare
    bananaGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
    
      //reset the game and play click sound when the mouse press over restart button 
     if (mousePressedOver(restart)) {
        reset();
       clickSound.play();
        }
                 }
  
  //make monkey to collide with invisible ground
    monkey.collide(invisibleGround);

  drawSprites();

  //display survival time 
  fill("black");
  textSize(20);
  textFont("Times New Roman");
  text("Survival Time : " + score,50,30);
  
  //display energy
       fill("black");
  textSize(15);
  textFont("Times New Roman");
  text("Energy : " + energy ,300,30);
}

function spawnBananas(){
  
  //display bananas after every 80 frames
  if (frameCount % 80 === 0) {
    //create banana and give it it's properties
      banana = createSprite(400,200,20,20);
    banana.y = Math.round(random(120,200));
    banana.addImage(bananaImage);
    banana.velocityX = -(4+ 3*score/200);
    banana.scale = 0.08;
    
    //give lifetime to banana to avoid memory leak
    banana.lifetime = 105;
    
    //add banana into banana grp
    bananaGroup.add(banana);
  
}
}

function Obs(){
  
  //spawn obs after every 300 frames
  if (frameCount % 300 === 0){
    
    //create obstacle sprite and give it's properties
    obstacle = createSprite(400,320);
    obstacle.addImage(obstacleImage);
    obstacle.velocityX = -(5 + 3*score/200);
 
    //switch and break block
    var size = Math.round(random(1,2));
    switch(size) {
      case 1: obstacle.scale = 0.1;
        break;
        case 2: obstacle.scale = 0.2;
      break;
      default: break;
    }
    
      //if obstacle's scale is 0.1, make the collider different and if obstacle's scale is 0.2, make the collider different
    if (obstacle.scale === 0.1) {
        obstacle.setCollider("circle",0,0,120);
        } else if (obstacle.scale === 0.2) {
        obstacle.setCollider("circle",5,0,190);
                   }
    
    //add obstacle to obstacle grp
    obstacleGroup.add(obstacle);


  }

}

function scoring() {
  //scoring system
  score = score + Math.round(getFrameRate()/60);
}

//create the reset function
function reset() {
    gameState = PLAY;
  obstacleGroup.destroyEach();
  restart.visible = false;
  score = 0;
  energy = 5;
}