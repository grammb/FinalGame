class Walker extends Phaser.Physics.Arcade.Sprite{
constructor(scene, x, y, key, frame){
    //calling sprite constructor
    super(scene, x, y, key, frame);
    //setup physics sprite
    scene.add.existing(this);  //making it real
    scene.physics.add.existing(this); //adding physics body

    //setting properties now


    //want to add properties for velocity/direction switch here
    this.WALK_ACCELERATION = [175, -175];
    this.walkDelay = 2000;
    this.walkStartTime = Phaser.Math.Between(500, 2500); //randomize to change walk behavior

    this.initWalkTimer(scene);
}
//now writing function for walker, want to walk in both positive and negative direction
initWalkTimer(scene){
    //attatch timer event to scene context
    scene.walkTimer = scene.time.addEvent({
        delay: this.walkDelay,
        loop: true,
        startAt: this.walkStartTime,
        callbackScope: this,  //keeping callback scope to the walker object
        callback: () => {
            this.body.setVelocityX(this.WALK_ACCELERATION[Math.floor(Math.random()* this.WALK_ACCELERATION.length)]);
        }
    });

}

update(){
    //call physics sprite update
    super.update();
}

}
