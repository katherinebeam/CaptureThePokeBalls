//set main namespace
goog.provide('pokemon');


//get requirements
goog.require('lime.Director'); //director controls what objects are shown, where they go, etc.
goog.require('lime.Scene');
goog.require('lime.Sprite');
goog.require('pokemon.Mew');


// constants for directions
var NORTH = 1;
var EAST  = 2;
var SOUTH = 3;
var WEST  = 4;


// entrypoint - main bulk of the game
pokemon.start = function(){
    this.lime = lime;

    //DIRECTOR
	this.director = new this.lime.Director(document.body,1600,780);
    //allow game to work on mobile
    this.director.makeMobileWebAppCapable();
    //don't show frames per second
    this.director.setDisplayFPS(false);

    //SCENE(S)
    this.gameScene = new this.lime.Scene();
    //renderer can either be DOM or canvas
    //this.gameScene.setRenderer(this.lime.Renderer.CANVAS);

    //SPRITES | GAME OBJECTS
    //set main game objects
    var gameBackground = new this.lime.Sprite()
                    .setSize(1080, 780)     //set size method
                    .setPosition(0,0)       //set position method
                    .setFill("#EEEEEE")     //set fill color method
                    .setAnchorPoint(0,0);   //set anchor point (point of top-left corner) method
    this.mew = new pokemon.Mew();
    this.walls = [];
    this.pokeballs = [];
    this.createWalls();
    this.createPokeballs();
    this.positionPokeBallsAndMew();
    this.pokeballsEarned = 0;


    //create game buttons
    var analogStick = new this.lime.Sprite().setSize(360,372).setPosition(1150,400).setFill('img/analogStick.png').setAnchorPoint(0,0);
    var buttonUp = new this.lime.Sprite().setSize(120,120).setPosition(1265,400).setAnchorPoint(0,0);
    var buttonRight = new this.lime.Sprite().setSize(115,114).setPosition(1384,518).setAnchorPoint(0,0);
    var buttonDown = new this.lime.Sprite().setSize(120,120).setPosition(1265,631).setAnchorPoint(0,0);
    var buttonLeft = new this.lime.Sprite().setSize(115,114).setPosition(1151,518).setAnchorPoint(0,0);

    // add events to four buttons
    // if buttonUp Sprite is pressed, move North
      goog.events.listen(buttonUp,["mousedown","touchstart"],function(e) {
        this.startMovement(NORTH);
      }, null, this.mew);
    // if buttonRight Sprite is pressed, move East
      goog.events.listen(buttonRight,["mousedown","touchstart"],function(e) {
        this.startMovement(EAST);
      }, null, this.mew);
    // if buttonDown Sprite is pressed, move South
      goog.events.listen(buttonDown,["mousedown","touchstart"],function(e) {
        this.startMovement(SOUTH);
      }, null, this.mew);
    // if buttonLeft Sprite is pressed, move West
      goog.events.listen(buttonLeft,["mousedown","touchstart"],function(e) {
        this.startMovement(WEST);
      }, null, this.mew);

  // add one task to the schedule manager: check if Mew is moving (dt == delta time: determines how much time has elapsed since the last time this method was called)
      this.lime.scheduleManager.schedule(function(dt) {
          this.checkVictory();
          this.checkMovement(dt);
      }, pokemon);


    //add objects to the main game scene
    this.gameScene.appendChild(gameBackground);
    //loop through the array of walls and append them to the scene
    for (var i = 0;i<this.walls.length;i++) {
        this.gameScene.appendChild(this.walls[i]);
    }
    //loop through the array of pokeballs and append them to the scene
    for (i=0;i<this.pokeballs.length;i++) {
        this.gameScene.appendChild(this.pokeballs[i]);
    }
    this.gameScene.appendChild(this.mew);
    this.gameScene.appendChild(analogStick);
    this.gameScene.appendChild(buttonUp);
    this.gameScene.appendChild(buttonRight);
    this.gameScene.appendChild(buttonDown);
    this.gameScene.appendChild(buttonLeft);

    //loads up the pre-created game scene --must be the last thing you do (ADD ALL OBJECTS, ETC. FIRST)
    this.director.replaceScene(this.gameScene);

};

pokemon.createWalls = function() {
    t = 30; //setting this variable makes it easier to scale the thickness of the walls
    var walls = [];
    var wallCoordinates = [
        [0,0,35*t,t],    //x-coordinate, y-coordinate, height, width
        [0,0,t,26*t],
        [35*t,0,36*t,26*t],
        [0,25*t,36*t,35*t],
        [0,25*t,36*t,35*t],
        [0,10*t,5*t,11*t],
        [5*t,5*t,16*t,6*t],
        [15*t,5*t,16*t,11*t],
        [15*t,5*t,16*t,11*t],
        [15*t,10*t,21*t,11*t],
        [20*t,10*t,21*t,16*t],
        [5*t,15*t,21*t,16*t],
        [10*t,10*t,11*t,16*t],
        [5*t,20*t,11*t,21*t],
        [5*t,20*t,6*t,26*t],
        [15*t,15*t,16*t,26*t],
        [20*t,0*t,21*t,6*t],
        [25*t,5*t,36*t,6*t],
        [25*t,5*t,26*t,11*t],
        [30*t,10*t,36*t,11*t],
        [30*t,10*t,31*t,16*t],
        [25*t,15*t,30*t,16*t],
        [25*t,15*t,26*t,20*t],
        [20*t,20*t,26*t,21*t],
        [30*t,20*t,31*t,26*t]
    ];
    
    for (var i=0;i<wallCoordinates.length;i++) {
        var current = wallCoordinates[i];
        var wall = new this.lime.Sprite().setAnchorPoint(0,0).setPosition(current[0],current[1]).setSize(current[2]-current[0],current[3]-current[1]).setFill('#222222');
        this.walls.push(wall);
    }
};

pokemon.createPokeballs = function() {
    var pokeballs = [];
    var pokeballNames = [
        ["one"],
        ["two"],
        ["three"]
    ];
    var i;
    for (i=0;i<pokeballNames.length;i++) {
        var current = pokeballNames[i];
        var pokeball = new this.lime.Sprite().setSize(80,87).setFill('img/pokeball-' + current[0] + '.png');
        this.pokeballs.push(pokeball);
    }
};

pokemon.positionPokeBallsAndMew = function() {
  var pokeballCoordinates = [
        [390,390],
        [840,240],
        [990,390]
  ];
  for (var i=0;i<this.pokeballs.length;i++) {
        this.pokeballs[i].setPosition(pokeballCoordinates[i][0],pokeballCoordinates[i][1]);
  }
  this.mew.setPosition(90,690);
};

pokemon.checkMovement = function(dt) {

  if (this.mew.isMoving) {

    // determine future position
    var futureX = this.mew.getPosition().x;
    var futureY = this.mew.getPosition().y;
    switch (this.mew.direction) {
      case NORTH:
        futureY = futureY - this.mew.speed*dt;
        break;
      case EAST:
        futureX = futureX + this.mew.speed*dt;
        break;
      case SOUTH:
        futureY = futureY + this.mew.speed*dt;
        break;
      case WEST:
        futureX = futureX - this.mew.speed*dt;
        break;
    }

    // check if future position hits an obstacle
    // stop movement and return false if so
    futureTopY = futureY - (this.mew.getSize().height/2);
    futureBottomY = futureTopY + this.mew.getSize().height;
    futureLeftX = futureX - (this.mew.getSize().width/2);
    futureRightX = futureLeftX + this.mew.getSize().width;
    var i;
    for(i in this.walls) {
      wall = this.walls[i];
      wallTopY = wall.getPosition().y;
      wallBottomY = wallTopY+wall.getSize().height;
      wallLeftX = wall.getPosition().x;
      wallRightX = wallLeftX+wall.getSize().width;
      if (futureRightX > wallLeftX && futureLeftX < wallRightX && futureBottomY > wallTopY && futureTopY < wallBottomY) {
         this.mew.isMoving = false;
         return false;
      }
    }

    // if no obstacles are hit, move Mew
    this.mew.setPosition(futureX,futureY);

    // check if new position hits a pokeball
    for(i in this.pokeballs) {
      pokeball = this.pokeballs[i];
      pokeballTopY = pokeball.getPosition().y-(pokeball.getSize().height/2);
      pokeballBottomY = pokeballTopY+pokeball.getSize().height;
      pokeballLeftX = pokeball.getPosition().x-(pokeball.getSize().width/2);
      pokeballRightX = pokeballLeftX+pokeball.getSize().width;
      if (futureRightX > pokeballLeftX && futureLeftX < pokeballRightX && futureBottomY > pokeballTopY && futureTopY < pokeballBottomY) {
        this.pokeballsEarned++;
        this.pokeballs[i].setPosition(1200+50*this.pokeballsEarned,100);
      }
    }
  }
};

pokemon.checkVictory = function() {
  if (this.pokeballsEarned == this.pokeballs.length) {
    alert('Hooray!');
    this.pokeballsEarned = 0;
    this.mew.isMoving = false;
    this.positionPokeBallsAndMew();
  }
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('pokemon.start', pokemon.start);
