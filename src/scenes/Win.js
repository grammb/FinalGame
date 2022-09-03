class Win extends Phaser.Scene{
    constructor(){
        super("winScene");
    }

    preload(){

        this.load.path = "./assets/";
        this.load.image("environment", "colored_packed.png");  
        this.load.tilemapTiledJSON("win", "winScreen.json");    

    }

    create(){

        const map = this.add.tilemap("win");
        //adding tileset for my map/layers
        const tileset = map.addTilesetImage("colored_packed", "environment");

        const backgroundLayer = map.createLayer("Background", tileset, 0, 0);
        const funLayer = map.createLayer("Ground", tileset, 0, 0);

        backgroundLayer.setCollisionByProperty({
            collides: true
        });

        let menuConfigLg = {
            fontFamily: 'Aseprite Remix',
            fontSize: '36px',
            //backgroundColor: '#FC4506',
              color: '#050505',
           align: 'right',
           padding: {
               top: 5,
               bottom: 5,
            },
            fixedWidth: 0
               }


 
        this.add.text(game.config.width/2, game.config.height/2, '!THANKS FOR PLAYING!', menuConfigLg).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 150, 'PRESS R to RESTART, or ↓ for MENU', menuConfigLg).setOrigin(0.5);

        cursors = this.input.keyboard.createCursorKeys();
        this.reload = this.input.keyboard.addKey('R');
    }

    
    update(){

        if(Phaser.Input.Keyboard.JustDown(this.reload)) {
            this.scene.start("playScene");
        }
        if(Phaser.Input.Keyboard.JustDown(cursors.down)){
            this.scene.start("menuScene");
        }
        
    }





}