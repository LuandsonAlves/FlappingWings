export class SpritesAnimation{

    constructor(spriteFolderPath, fileName, fileExtension, frameAmount, delay){
        this.img = new Array(frameAmount);
        this.img_buffer = new Image();

        this.spriteFolderPath = spriteFolderPath;
        this.fileName = fileName;
        this.fileExtension = fileExtension;
        this.frameAmount = frameAmount;
        this.delay = delay;
        this.cont = 0;
        this.time = Date.now();
        this.isStopped = false;

        for(let i=0;i<frameAmount;i++){
            this.img[i] = new Image();
            this.img[i].src =  this.spriteFolderPath + this.fileName + i + this.fileExtension;
        }
    }

    getImageAnimation(){
        if(!this.isStopped){
            if(this.cont >= this.frameAmount){
                this.cont = 0;
            }
            
            this.img_buffer = this.img[this.cont]; 

            if(Date.now() - this.time >= this.delay){
                this.cont++;
                this.time = Date.now();
            }
        }
        return this.img_buffer;
    }
}