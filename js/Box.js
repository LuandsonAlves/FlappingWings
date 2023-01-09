import {Vec} from './Vec.js'

export class Box{
    constructor(position, size){
        this.position = position;
        this.size = size;
    }

    getMin(){
        return new Vec(this.position.x - (this.size.x/2.0), this.position.y - (this.size.y/2.0));
    }
    getMax(){
        return new Vec(this.position.x + (this.size.x/2.0), this.position.y + (this.size.y/2.0));
    }

    boxColliding(b){
        if(b.getMax().x >= this.getMin().x && b.getMin().x <= this.getMax().x &&
           b.getMax().y >= this.getMin().y && b.getMin().y <= this.getMax().y){
            return true;
        }
        return false;
    }
}