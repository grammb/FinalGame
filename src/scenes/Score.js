class Score extends Phaser.Scene{
    constructor(){
        super("scoreScene");
    }
    preload(){
        
        this.load.path = "./assets/";  
        this.load.image("environment", "colored_packed.png");
        this.load.tilemapTiledJSON("gameover", "credits.json");

    

    }
    create(){
        const map = this.add.tilemap("gameover");
        //adding tileset for my map/layers
        const tileset = map.addTilesetImage("colored_packed", "environment");

        const backgroundLayer = map.createLayer("Background", tileset, 0, 0);
        const funLayer = map.createLayer("Fun", tileset, 0, 0);

        //setting collision
        backgroundLayer.setCollisionByProperty({
            collides: true
        });
        
        cursors = this.input.keyboard.createCursorKeys();
        this.reload = this.input.keyboard.addKey('R');

        let menuConfigLg = {
            fontFamily: 'Aseprite Remix',
            fontSize: '24px',
            //backgroundColor: '#FC4506',
              color: '#D00606',
           align: 'right',
           padding: {
               top: 5,
               bottom: 5,
            },
            fixedWidth: 0
               }
   
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', menuConfigLg).setOrigin(0.5);  
        this.add.text(game.config.width/2, game.config.height/2 + 100, 'PRESS R to RESTART, or ↓ for MENU', menuConfigLg).setOrigin(0.5);
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