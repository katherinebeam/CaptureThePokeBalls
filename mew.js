goog.provide('pokemon.Mew');
goog.require('lime.Sprite');

//create a Mew object
pokemon.Mew = function() {
	goog.base(this);

	//set image to the Mew image
	this.setSize(80,58).setFill('img/mew.png');
	//not moving
	this.isMoving = false;
	//Mew will start out facing North
	this.direction = NORTH;
	this.speed = 0.3;
};

goog.inherits(pokemon.Mew,lime.Sprite);

//causes Mew to start moving in the user-specified direction
pokemon.Mew.prototype.startMovement = function(direction) {
  this.isMoving = true;
  this.direction = direction;
}; 