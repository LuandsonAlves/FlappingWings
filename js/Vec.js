export class Vec{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    add(a){
        return new Vec(this.x + a.x, this.y + a.y);
    }

    mult(a){
        return new Vec(this.x * a, this.y * a);  
    }

    hip(a) {
        var x = a.x - this.x;
        var y = a.y - this.y;
        return Math.sqrt(x*x+y*y);
    }

    lenght(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
}
   