class Jumper extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key, frame) {
        // call Phaser Physics Sprite constructor
        super(scene, x, y, key, frame);
        // setup Physics Sprite
        scene.add.existing(this);               // make it real
        scene.physics.add.existing(this);       // add physics body
        
        // set properties
        this.body.setImmovable();
        this.setOrigin(0, 1);  
        
        // add custom properties    
        this.JUMP_VELOCITY = Phaser.Math.Between(-200, -800);              
        this.jumpDelay = 2000;
        this.jumpStartTime = Phaser.Math.Between(500, 2500);    // randomize to offset jumps

        // start jumpin'
        this.initJumpTimer(scene);
    }

    initJumpTimer(scene) {
        // attach timer event to scene context
        scene.jumpTimer = scene.time.addEvent({
            delay: this.jumpDelay,
            loop: true,
            startAt: this.jumpStartTime,
            callbackScope: this,    // keep callback scoped to Jumper object
            callback: () => {
                this.body.setVelocityY(this.JUMP_VELOCITY);
            }
        });
    }

    update() {
        // call Physics Sprite update
        super.update();
    }
}