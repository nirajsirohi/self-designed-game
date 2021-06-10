var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;
var life = 3;
var invisibleGround;
var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;
var checkpointGroup;
var check_num=0;

var coinGroup, coinImage;
var obstaclesGroup, obstacle2, obstacle1,obstacle3;
var score=0;
var checkPoint1,checkPoint2,checkPoint3; // create 3 sprites. Place it. Add images. - setup function 
var checkPointCrossed = 0;
var checkpoint1,checkpoint2,checkpoint3;

var gameOver, restart;

localStorage["HighestScore"] = 0; 

function preload(){
  mario_running = loadAnimation("Capture1.png","Capture3.png","Capture4.png");
  mario_collided = loadAnimation("mariodead.png");
  groundImage = loadImage("backg.jpg");
  
  coinImage = loadImage("coin.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle3 = loadImage("obstacle3.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  checkPoint1 = loadImage("flag1.png");
  checkPoint2 = loadImage("30927.png");
  checkPoint3 = loadImage("9316.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  mario = createSprite(50,180,20,50);
  mario.addAnimation("running", mario_running);
  mario.scale = 0.75;
  
  //checkPoint1 = createSprite(300,180,20,50);
  // checkPoint2 = createSprite();
  // checkPoint3 = createSprite();


  ground = createSprite(windowWidth*3,windowHeight/2);
  ground.addImage(groundImage);
  ground.scale = 1.2;
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
invisibleGround = createSprite(windowWidth/2,windowHeight-60,windowWidth,10);
invisibleGround.visible=false





  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  coinGroup = new Group();
  checkpointGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background("blue");
  textSize(50);
  fill("White");
  console.log(score);
  text("Score: "+ score, windowWidth/2,windowHeight/2);
  text("life: "+ life , 500,60);
  drawSprites();
  if (gameState===PLAY){
 //  score = score + Math.round(getFrameRate()/60);
    if(score >= 0){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
  
    if(keyDown("space") && mario.y >= 139) {
      mario.velocityY = -12;
    }
  
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 400){
      ground.x = ground.width/2;
    }
  if(coinGroup.isTouching(mario)){
    score = score+10;
    coinGroup[0].destroy();
  }
    mario.collide(invisibleGround);
    
    spawnCoin();
    spawnObstacles();
    spawnCheckpoint();


   //if mario touches checkpoint1 , assign  checkPointCrossed =1; Similarly do for all the 3 checkpoints.
  
   if(obstaclesGroup.isTouching(mario)){
        gameState = END;
        life=life-1
   // check the value of checkPointCrossed. Accordingly assign marios position back to the checkpoint.
   // eg if checkPointCrossed = 2, mario.x = checkPoint2.x+50;
   } 

   
  }
  
  
  
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    mario.addAnimation("collided", mario_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    //change the trex animation
    mario.changeAnimation("collided",mario_collided);
    mario.scale =0.35;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    

    if(mousePressedOver(restart)) {
      if(life>0){
         reset();      
      }
     
    
    
    
    }
  }
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 30 === 0) {
   
    //var coinHeight = random(100,700);
    
    var coin = createSprite(100,200,40,10);
    coin.x = Math.round(random(250,900));
    coin.y = Math.round(random(350,450));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 1000;
    
    //adjust the depth
    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(windowWidth/2,windowHeight-100,20,40);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  mario.scale =0.5;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  score = 0;
  
}

function spawnCheckpoint(){
  
  if(frameCount % 400 === 0) {
    
    check_num+=1;
    if(check_num===1){
      checkpoint1 = createSprite(windowWidth,windowHeight-100,20,80);  
      checkpoint1.addImage(checkPoint1);
      checkpoint1.velocityX = -5;
      checkpoint1.scale = 0.3;
    }  
    else if(check_num===2){
      checkpoint2 = createSprite(windowWidth,windowHeight-150,20,80);  
      checkpoint2.addImage(checkPoint2);
      checkpoint2.scale = 0.2;
      checkpoint2.velocityX = -5;
    }
    else if(check_num===3){
      checkpoint3 = createSprite(windowWidth,windowHeight-100,20,80);  
      checkpoint3.addImage(checkPoint3);
      checkpoint3.velocityX = -5;
      checkpoint3.scale = 0.3;
      
    }

    // if(mario.isTouching(checkpoint3)){
    //   gameState = WIN;
    //   ground.velocityX=0;
    //   obstaclesGroup.setVelocityXEach(0);
    // }
    //generate random obstacles
    // var rand = Math.round(random(1,3));
    // switch(rand) {
    //   case 1: obstacle.addImage(obstacle2);
    //           break;
    //   case 2: obstacle.addImage(obstacle1);
    //           break;
    //   case 3: obstacle.addImage(obstacle3);
    //           break;
    // }
        
      }
}