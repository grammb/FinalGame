class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
        //can set rules here for velocity and movement?
        this.ACCELERATION = 500;
        this.MAX_X_VEL = 200;
        this.MAX_Y_VEL = 2000;
        this.DRAG = 600;    
        this.JUMP_VELOCITY = -650;
        this.ENEMY_SPAWNS = 4; //how many spawn locations will populate
        this.ENEMY_FRAMES = [26, 27, 28, 29, 31, 126, 125, 121, 122];
        this.WALK_ACCELERATION = [175, -175];
        this.walkDelay = 2000;
        this.walkStartTime = Phaser.Math.Between(500, 2500);
        
    }

    //preload images and whatever else will be needed for scene 
    preload(){
        this.load.path = "./assets/";
        //loading the image for the tilemap below
        this.load.image("environment", "colored_packed.png");
        //porting in the JSON map file
        this.load.tilemapTiledJSON("map", "RunnerFINAL.json"); 
       
        //see if anything else needs to be loaded in here
    }


    create(){

        //adding tile map
        const map = this.add.tilemap("map"); //can add in more enemy spawn locations as needed
        //adding tileset(s) to map
        const tileset = map.addTilesetImage("runner_tileset", "environment"); //check here
        //adding map layers and scroll factors for parallax scrolling
        const backgroundLayer = map.createLayer("Background",tileset, 0, 0);
        const groundLayer = map.createLayer("Gound", tileset, 0, 0);
        const pillarsLayer = map.createLayer("Pillars", tileset, 0, 0);
        const lightsLayer = map.createLayer("Lights", tileset, 0, 0);
        const platformLayer = map.createLayer("Platforms", tileset, 0, 0);
        const barrierLayer = map.createLayer("EnemyBounds", tileset, 0, 0);

        //making barrier layer for enemy behavior invisible
        barrierLayer.setVisible(false);
        
        //important variables here, tracks hp value and win condition, reset in create for restart
        this.heartsRemain = 3;
        this.winCon = 0;

        //set map collision per layer
        groundLayer.setCollisionByProperty({
            collides: true
        });

        platformLayer.setCollisionByProperty({
            collides: true
        });
        
        barrierLayer.setCollisionByProperty({
            collides: true
        });


        //want to setup player spawn
        const p1Spawn = map.findObject("Collectibles", obj=> obj.name === "p1spawn");
        this.P1 = new Player(this, p1Spawn.x, p1Spawn.y, "map_sheet", 402);

        //setting a few details for player size and speed
        this.P1.body.setSize(this.P1.width/2);
        this.P1.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.P1.body.setCollideWorldBounds(true);

        //add init animation
        this.P1.anims.play('idle');

        //making my group for walking enemies
        this.walkGroup = this.add.group();
        //getting the enemy object array from tilemap layer, named EnemiesWalking
        this.enemyObjects = map.filterObjects("EnemiesWalking", obj => obj.name === "enemy");
        //for each item in the array, add it as a sprite to the game and to my enemies group, using a prefab for enemy behavior
        this.enemyObjects.map((enemy) => {
             enemy = new Walker(this, enemy.x, enemy.y, "map_sheet",this.ENEMY_FRAMES[Math.floor(Math.random() * this.ENEMY_FRAMES.length)]);
            this.walkGroup.add(enemy);
        });

        //making group for jumping enemies
        this.jumpGroup = this.add.group();
        //get enemy objs from tiled map, as an array
        this.enemyJObjects = map.filterObjects("EnemiesJumpVert", obj => obj.name === "enemyJ");
        //using different prefab, from section example, with some small tweaks (Thank you Prof. Altice :) )
        this.enemyJObjects.map((enemy) => {
            enemy = new Jumper(this, enemy.x, enemy.y, "map_sheet",this.ENEMY_FRAMES[Math.floor(Math.random() * this.ENEMY_FRAMES.length)]);
            this.jumpGroup.add(enemy);
        });

        //making group for my collectible rupees
        this.rupeeGroup = this.add.group();
        //creating array of objects from tiled map
        this.rupees = map. createFromObjects("Collectibles", {
            name: "rupee",
            key:"map_sheet",
            frame: 215
        });

        //making group for crowns!
        this.crownGroup = this.add.group();
        //fetch the array of objects from tiled
        this.crowns = map.createFromObjects("Collectibles", {
            name: "Crown",
            key: "map_sheet",
            frame: 140
        });

        //creating group for my hearts for player
        this.hpGroup = this.add.group();

            //kinda unyieldy, but a guaranteed solution :>
            this.heart1 = this.physics.add.sprite((this.P1.x - 16), this.P1.y - 20, "map_sheet", 522);
            this.heart2 = this.physics.add.sprite((this.P1.x), this.P1.y - 20, "map_sheet", 522);
            this.heart3 =this.physics.add.sprite((this.P1.x + 16), this.P1.y - 20, "map_sheet", 522);
            this.heart1.body.setAllowGravity(false);
            this.heart2.body.setAllowGravity(false);
            this.heart3.body.setAllowGravity(false);
            this.hpGroup.add(this.heart1);
            this.hpGroup.add(this.heart2);
            this.hpGroup.add(this.heart3);


        //adding in physics for my rupees and crowns
        this.physics.world.enable(this.rupees, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.crowns, Phaser.Physics.Arcade.STATIC_BODY);

        //adding rupees to the group defined above, same thing w/ crowns
        this.rupeeGroup = this.add.group(this.rupees);
        this.crownGroup = this.add.group(this.crowns);

        //adding juice phaser effects! particle effect manager here
        this.rupeeGroupVfxManager = this.add.particles("map_sheet", 878);
        this.crownGroupVfxManager = this.add.particles("map_sheet", 512);

        //particle effects here
        this.rupeeVfxEffect = this.rupeeGroupVfxManager.createEmitter({
            follow: this.P1,
            quantity: 25,
            scale: {start: 0.75, end: 0.0},
            speed:{min: 50, max: 100},
            lifespan: 800,
            on: false //IMPORTANT, want this off until collision!
        });
        
        this.crownVfxEffect = this.crownGroupVfxManager.createEmitter({
            follow: this.P1,
            quantity: 45,
            scale: {start: 0.75, end: 0.0},
            speed:{min: 50, max: 100},
            lifespan: 800,
            on: false //IMPORTANT, want this off until collision!
        });

        //set gravity and physics world bounds so that test for collide works
        this.physics.world.gravity.y = 2000;
        this.physics.world.bounds.setTo(0,0,map.widthInPixels, map.heightInPixels);
       
        //add physics colliders

        //for player and world
        this.physics.add.collider(this.P1, groundLayer);
        this.physics.add.collider(this.P1, platformLayer);
        //for walker enemies
        this.physics.add.collider(this.walkGroup, groundLayer);
        this.physics.add.collider(this.walkGroup, platformLayer);
        this.physics.add.collider(this.walkGroup, barrierLayer);
        //for jumper enemies
        this.physics.add.collider(this.jumpGroup, groundLayer);
        this.physics.add.collider(this.jumpGroup, platformLayer);

        //add collider behavior for walking enemies and jumping enemies
        this.physics.add.overlap(this.P1, this.walkGroup, (player, enemy) => {
            if(!player.immune){
                this.gameTime -= 2000;
                this.heartsRemain-=1;
                player.immune = true;
                player.alpha = 0.4;
                if (player.body.position.x < enemy.body.position.x) {
                    player.body.velocity.x = -300;
                } else {
                    player.body.velocity.x = 300;
                }
                //enemy.destroy();
                this.time.addEvent({
                    delay: 2000,
                    loop: false,
                    callback: () => {
                        player.immune = false;
                        player.alpha = 1;
                    },
                    callbackScope: this
                });
            }
        });

        //same behavior as above, but for jumper enemies
        this.physics.add.overlap(this.P1, this.jumpGroup, (player, enemy) => {
            if(!player.immune){
                this.gameTime -= 2000;
                this.heartsRemain-=1;
                player.immune = true;
                player.alpha = 0.4;
                if (player.body.position.x < enemy.body.position.x) {
                    player.body.velocity.x = -300;
                } else {
                    player.body.velocity.x = 300;
                }
                //enemy.destroy();
                this.time.addEvent({
                    delay: 2000,
                    loop: false,
                    callback: () => {
                        player.immune = false;
                        player.alpha = 1;
                    },
                    callbackScope: this
                });
            }
        });

        //adding collider for rupees!
        this.physics.add.overlap(this.P1, this.rupeeGroup, (obj1, obj2) => {
            this.rupeeVfxEffect.explode();
            obj2.destroy();
        });

        //adding collider for crowns!
        this.physics.add.overlap(this.P1, this.crownGroup, (obj1, obj2) => {
            this.crownVfxEffect.explode();
            this.winCon +=1;
            obj2.destroy();
        });

        //set up camera
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.P1, true, 0.25, 0.25);

        //set up phaser cursor key input (arrows)
        cursors = this.input.keyboard.createCursorKeys();
        //adding in reload button (R)
        this.reload = this.input.keyboard.addKey('R');
        

        this.gameOver = false;
        this.gameWon = false;
    } //end of create
   
    


    update(time, delta){
        //heart movement with player, want to avoid a UI bar, looks yucky
        this.heart1.setX((this.P1.x) - 16);
        this.heart1.setY((this.P1.y - 20));
        this.heart2.setX(this.P1.x);
        this.heart2.setY((this.P1.y - 20));
        this.heart3.setX((this.P1.x) + 16);
        this.heart3.setY((this.P1.y - 20));
        //setting heart destruction here
        if(this.heartsRemain == 2){
            this.heart3.destroy();
        }
        if(this.heartsRemain == 1){
            this.heart2.destroy();
        }
        if(this.heartsRemain == 0){
            this.heart1.destroy();
            this.gameOver = true;
        }
        
        if(this.winCon == 3){
            this.gameWon = true;
        }

        if(cursors.left.isDown && this.gameOver == false) {
            this.P1.body.setAccelerationX(-this.ACCELERATION);
            this.P1.play('walk', true);
            this.P1.setFlip(true, false);
        } else if(cursors.right.isDown && this.gameOver == false) {
            this.P1.body.setAccelerationX(this.ACCELERATION);
            this.P1.play('walk', true);
            this.P1.resetFlip();
        } else {
            // set acceleration to 0 so DRAG will take over
            this.P1.play('idle');
            this.P1.body.setAccelerationX(0);
            this.P1.body.setDragX(this.DRAG);
        }
        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!this.P1.body.blocked.down && this.gameOver == false) {
            this.P1.anims.play('jump');
        }
        if(this.P1.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up) && this.gameOver == false) {
            this.P1.body.setVelocityY(this.JUMP_VELOCITY);
        }
        if(Phaser.Input.Keyboard.JustDown(this.reload)) {
            this.scene.restart();
        }

        if(this.gameOver == true){
            this.P1.body.setAccelerationX(0);
            this.P1.anims.play('ouch');
            this.time.addEvent({
                delay: 3000,
                loop: false,
                callback: () =>{
                    this.scene.start("scoreScene");
                },
            });
        }
  
        if(this.gameWon == true){
            this.P1.body.setAccelerationX(0);
            this.P1.anims.play('jump');
            this.time.addEvent({
                delay: 3000,
                loop: false,
                callback: () =>{
                    this.scene.start("winScene");
                },
            });
        }        


    } 

}