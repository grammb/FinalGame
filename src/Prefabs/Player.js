class Player extends Phaser.GameObjects.Sprite {

    //constructor
    constructor(scene, x, y, key, frame){
        super(scene, x , y, key, frame)
        scene.add.existing(this);
        scene.physics.add.existing(this);
       
        //right now, just using this to add in player sprite, want to add hp bar and other neat things to the class

    }

    //
    update(){


    
    }
}