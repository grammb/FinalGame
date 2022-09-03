class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
        this.ACCELERATION = 500;
        this.MAX_X_VEL = 200;
        this.MAX_Y_VEL = 2000;
        this.DRAG = 600;    
        this.JUMP_VELOCITY = -650;
    }

    preload(){
        //load audio portions from Kenney sheet 

        //loading in the assets for character animations, can be reached from anywhere so can load here
        this.load.path = "./assets/";
        this.load.image("menusheet", "colored_packed.png");
        this.load.image("credits", "bg_castle.png");
        this.load.spritesheet("map_sheet", "colored_transparent_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.tilemapTiledJSON("menumap", "menumap.json");
    }

    create() {
        //can create tilesprite from image preloaded
        const map = this.add.tilemap("menumap"); //can add in more enemy spawn locations as needed
        //adding tileset(s) to map
        
        const tileset = map.addTilesetImage("colored_packed", "menusheet"); //check here
        
        //adding map layers and scroll factors for parallax scrolling
        const backgroundLayer = map.createLayer("Background",tileset, 0, 0);
        const platformLayer = map.createLayer("Platforms", tileset, 0, 0);


        this.physics.world.gravity.y = 2000;
        this.physics.world.bounds.setTo(0,0,map.widthInPixels, map.heightInPixels);

        //set map collision
        platformLayer.setCollisionByProperty({
            collides: true
        });

        //want to setup player spawn
        const p1Spawn = map.findObject("collectibles", obj=> obj.name === "p1Spawn");
        this.P1 = this.physics.add.sprite(p1Spawn.x, p1Spawn.y, "map_sheet", 402);

        this.P1.body.setSize(this.P1.width/2);
        this.P1.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.P1.body.setCollideWorldBounds(true);
        
        //want to create the  animations for character loading in here, usable in any scene
        this.anims.create({
            key: 'walk',
            defaultTextureKey: 'map_sheet',
            frames: [
                {frame: 402},
                {frame: 403},
                {frame: 404}
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: 'map_sheet',
            frames: [
                {frame: 405},
            ],
            repeat: -1
        });

        this.anims.create({
            key:'ouch',
            defaultTextureKey: 'map_sheet',
            frames: [
                {frame: 407},
            ],
            repeat: -1
        });

        this.anims.create({
            key:'idle',
            defaultTextureKey: 'map_sheet',
            frames: [
                {frame: 402},
            ]
        });
        
        this.anims.create({
            key: 'win',
            defaultTextureKey: 'map_sheet',
            frames:[
                {frame: 404},
                {frame: 405},
                {frame: 406},
            ],
            repeat: -1
        });

    
        //add init animation
        this.P1.anims.play('idle');

        //adding collider for ground and player
        this.physics.add.collider(this.P1, platformLayer);

                // menu text configuration
         let menuConfig = {
             fontFamily: 'Aseprite Remix',
             fontSize: '12px',
             //backgroundColor: '#FC4506',
               color: '#050505',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
             },
             fixedWidth: 0
                }

                let menuConfigLg = {
                    fontFamily: 'Aseprite Remix',
                    fontSize: '24px',
                    //backgroundColor: '#FC4506',
                      color: '#050505',
                   align: 'right',
                   padding: {
                       top: 5,
                       bottom: 5,
                    },
                    fixedWidth: 0
                       }

        this.add.text(game.config.width/2, game.config.height/2, 'Platform Jumpa', menuConfigLg).setOrigin(0.5);  
        this.add.text(game.config.width/2, game.config.height/2 + 25, 'Follow the Gems, collect all 3 Crowns!', menuConfig).setOrigin(0.5); 
        this.add.text(game.config.width/2, game.config.height/2 + 50, 'Press R to start!', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 -200, game.config.height/2 + 80, 'Use the Arrow Keys to move!',menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2+20, game.config.height/2 + 150, '↓ Avoid The Baddies! ↓',menuConfig).setOrigin(0.5);
        //here we define keys for input and scene change
        cursors = this.input.keyboard.createCursorKeys();
        this.reload = this.input.keyboard.addKey('R');
       // keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        //ADD MORE CONTROLS/CHANGE TO SPACEBAR TO START        
    }

    update() {
        //ask if can include physics rules in a blanket game.settings call for play scene?
        if(cursors.left.isDown) {
            this.P1.body.setAccelerationX(-this.ACCELERATION);
            this.P1.play('walk', true);
            this.P1.setFlip(true, false);
        } else if(cursors.right.isDown) {
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
        if(!this.P1.body.blocked.down) {
            this.P1.anims.play('jump');
        }
        if(this.P1.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.P1.body.setVelocityY(this.JUMP_VELOCITY);
        }

        if(Phaser.Input.Keyboard.JustDown(this.reload)) {
            this.scene.start("playScene");
        }
    }





}