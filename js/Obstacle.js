import { Box } from './Box.js'
import { Vec } from './Vec.js';

export class Obstacle{

    constructor(position, speed, size, spacing){
        this.position = position;
        this.speed = speed;
        this.size = size;
        this.spacing = spacing;
        this.box1 = new Box(new Vec(this.position.x, this.position.y), this.size);
        this.box2 = new Box(new Vec(this.position.x, this.position.y), this.size);
        this.isCounted = false;
    }

    update(){
        
        this.position.x -= this.speed;
        this.box1.position.x = this.position.x;
        this.box1.position.y = this.position.y - (this.size.y/2.0) - this.spacing;

        this.box2.position.x = this.position.x;
        this.box2.position.y = this.position.y + (this.size.y/2.0) + this.spacing;
    }
}