import { Box } from "./Box.js";
import { SpritesAnimation } from "./SpritesAnimation.js";
import { Vec } from "./Vec.js";

 export class Player{
        
        constructor(id, position, nickname, size, highscore, timesPlayed){
            this.id = id;
            this.position = position;
            this.velocity = new Vec(0,0);
            this.nickname = nickname;
            this.size = size;
            this.box = new Box(position, this.size);
            this.score = 0;
            this.delay = 100;
            this.isJumping = false;
            this.isAlive = true;
            this.currentTime = 0;
            this.angle = 0;
            this.spritesAnimation = new SpritesAnimation("./sprites/player/", "tile00", ".png", 8, 60);
            this.highscore = highscore;
            this.timesPlayed = timesPlayed;
        }

        update(){
            this.spritesAnimation.isStopped = !this.isAlive;
            if(this.velocity.y >= 10){
                this.velocity.y = 10;  
            }
            this.position = this.position.add(this.velocity);
            this.box.position = this.position;
        }

        jump(){
            if(this.isAlive){
                if(Date.now() - this.currentTime >= 100){
                    this.isJumping = false;
                }
                if(!this.isJumping){
                    this.isJumping = true;
                    this.currentTime = Date.now();
                    this.velocity.y = 0;
                    this.velocity.y -= 4;
                    var audio = new Audio('../sounds/jump.mp3');
                    audio.play();
                }      
            }
        }
    }
