export class SpritesAnimation{

    constructor(spriteFolderPath, fileName, fileExtension, frameAmount, delay){
        this.img = new Image();
        this.spriteFolderPath = spriteFolderPath;
        this.fileName = fileName;
        this.fileExtension = fileExtension;
        this.frameAmount = frameAmount;
        this.delay = delay;
        this.cont = 0;
        this.time = Date.now();
        this.isStopped = false;
    }

    getImageAnimation(){
        if(!this.isStopped){
            if(this.cont >= this.frameAmount){
                this.cont = 0;
            }
            
            this.img.src = this.spriteFolderPath + this.fileName + this.cont + this.fileExtension;

            if(Date.now() - this.time >= this.delay){
                this.cont++;
                this.time = Date.now();
            }
        }
        return this.img;
    }
}