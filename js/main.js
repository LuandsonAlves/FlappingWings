import { Obstacle } from './Obstacle.js';
import {Player} from './Player.js';
import {Vec} from './Vec.js';


var canvas = document.getElementById("gameWorld");
var ctx = canvas.getContext("2d");
var canvas_screen = document.getElementById("screen");
var ctx_screen = canvas_screen.getContext("2d");

const GRAVITY = new Vec(0, 0.196);
const img_sky = new Image();
const img_mb = new Image();
const img_mf = new Image();
const img_obst = new Image();

let player;
let oneClick;
let obstacles;
let timeToSpawnObstacle;
let posMountainBack;
let posMountainFront;
let isPlaying;
let flashOpacity;
let aspctRatio;
let aspctRatioHasChange;
let fps = 0;
let rank = document.getElementById("tabelaRankDePontos");


function display(){
    var b_timer = Date.now();

    if(window.innerWidth / window.innerHeight >= 1){
        ctx.canvas.width = 800;
        ctx.canvas.height = 450;
    }else{
        ctx.canvas.width = 337;
        ctx.canvas.height = 600;
        
    }
    aspctRatio = ctx.canvas.width / ctx.canvas.height;

    player.position.x = ctx.canvas.width * 0.2 ;
    requestAnimationFrame(display);

    

    if(posMountainBack < 0){
        posMountainBack = img_mb.width;
    }

    if(posMountainFront < 0){
        posMountainFront = img_mf.width;
    }

    ctx.drawImage(img_sky, 0, 0, ctx.canvas.width, ctx.canvas.height);
   
    ctx.drawImage(img_mb, posMountainBack             , ctx.canvas.height / 2.0, img_mb.width, ctx.canvas.height / 2.0);
    ctx.drawImage(img_mb, posMountainBack-img_mb.width+1, ctx.canvas.height / 2.0, img_mb.width, ctx.canvas.height / 2.0);
    
    
    ctx.drawImage(img_mf, posMountainFront             , ctx.canvas.height / 2.0, img_mf.width, ctx.canvas.height / 2.0);
    ctx.drawImage(img_mf, posMountainFront-img_mf.width+1, ctx.canvas.height / 2.0, img_mf.width, ctx.canvas.height / 2.0);
    
    if(!isPlaying){
        drawPlayButton();

    }else{
        
        if(Date.now() - timeToSpawnObstacle >= 2000){
            var y = ctx.canvas.height * 0.2 + Math.random() * (ctx.canvas.height * 0.6);
            obstacles.splice(0,0, new Obstacle(new Vec(obstacles[0].position.x + 250, y),2,
                                               new Vec(50,50), 50));
            timeToSpawnObstacle = Date.now();
        }

        obstacles.forEach(element => {
            if(player.isAlive){
                element.update();   
            }
            
            element.box1.size.y = ctx.canvas.height;
            element.box2.size.y = ctx.canvas.height;
            if(element.position.x - player.position.x <= -25 && !element.isCounted && player.isAlive){
                player.score++;
                element.isCounted = true;
                var audio = new Audio('../sounds/pop.mp3');
                audio.play();
            }

            if(element.box1.boxColliding(player.box) || element.box2.boxColliding(player.box)){
                
                player.isAlive = false;
            }

            drawObstacle(element);
            if(element.position.x < -element.size.x){
                obstacles.pop();
            }

        });
        player.velocity = player.velocity.add(GRAVITY);
    }
    

    
    
    player.update();
    
    if(player.position.y <= player.size.y/2.5){
        player.isAlive = false;
    }

    if(player.position.y >= ctx.canvas.height-player.size.y/2.5){
        player.isAlive = false;
        player.position.y = ctx.canvas.height-player.size.y/2.5;
        player.velocity.y = 0;
    }
    
    drawPlayer(player);



    ctx.font = "bold 46px arial";
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText(player.score, ctx.canvas.width / 2.0 - (24 * player.score.toString().length / 2.0), ctx.canvas.height * 0.15);
    ctx.font = "bold 14px arial";
    ctx.fillText("Maior pontuação: "+player.highscore, 4, 14);
    ctx.fillStyle = "#000"; 

    if(player.isAlive){
        posMountainBack -= 0.3;
        posMountainFront -= 0.5; 
    }else{
        if(flashOpacity == 0xFF){
            var audio = new Audio('../sounds/death.mp3');
            audio.play();
        }
        ctx.fillStyle = "#FFFFFF"+flashOpacity.toString(16);
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#000";
        flashOpacity -= 10;
        if(flashOpacity < 0x10){
            flashOpacity = 0x10;
        }
    }

    if(aspctRatio >= 1){
        if(aspctRatioHasChange){
            player.position.y = ctx.canvas.height / 2.0;
            aspctRatioHasChange = false;
        }

        ctx_screen.canvas.width = window.innerWidth * 0.6;
        ctx_screen.canvas.height = window.innerWidth * 0.6 / aspctRatio;
    }else{
        if(!aspctRatioHasChange){
            player.position.y = ctx.canvas.height / 2.0;
            aspctRatioHasChange = true;
        }

        ctx_screen.canvas.width = window.innerHeight * 0.50;
        ctx_screen.canvas.height = window.innerHeight * 0.50 / aspctRatio;
    }
    
   

    // var deltatime = Date.now() - b_timer;
    // let fps_limit = 15 - deltatime;
    // if(fps_limit < 0){
    //     fps_limit = 0; 
    // }

    // sleep(fps_limit);
    // sleep(16);

    // deltatime = Date.now() - b_timer;
    // fps = 1000 / deltatime;
    ctx_screen.drawImage(canvas, 0, 0, canvas_screen.width, canvas_screen.height);
}

function drawPlayer(player){
    player.angle = player.velocity.y * 6;

    ctx.fillText(player.nickname,player.position.x-player.nickname.length-10, player.position.y-25);
    
    ctx.translate(player.position.x, player.position.y);
    ctx.rotate( player.angle * (Math.PI / 180.0));

    ctx.drawImage(player.spritesAnimation.getImageAnimation(), - player.size.x * 0.7, - player.size.y * 0.7, player.size.x * 1.4, player.size.y * 1.4);

    ctx.rotate(-player.angle * (Math.PI / 180.0));
    ctx.translate(-player.position.x, -player.position.y);
    
}

function drawObstacle(o){
    ctx.fillRect(o.position.x - o.box1.size.x/2.0, o.box1.position.y - o.box1.size.y/2.0, o.box1.size.x, o.box1.size.y);
    ctx.fillRect(o.position.x - o.box2.size.x/2.0, o.box2.position.y - o.box2.size.y/2.0, o.box2.size.x, o.box2.size.y);
    
    
    for(let i = 0; i < ctx.canvas.height; i += o.box1.size.x-1){
        if(o.position.y - o.box1.size.x * 2.0 - i < -o.box1.size.x){
            i = ctx.canvas.height;
        }
        ctx.drawImage(img_obst, o.position.x - o.box1.size.x/2.0, o.position.y - o.spacing - o.box1.size.x - i,
                                o.box1.size.x, o.box1.size.x);

    }

    for(let i = 0; i < ctx.canvas.height; i += o.box1.size.x){
        if(o.position.y + o.box2.size.x + i >= ctx.canvas.height){
            i = ctx.canvas.height;
        }
        ctx.drawImage(img_obst, o.position.x - o.box1.size.x/2.0, o.position.y + o.spacing + i,
                                o.box1.size.x, o.box1.size.x);
    }
    
}

function drawPlayButton(){
    let half_screen_w = ctx.canvas.width / 2.0;
    let half_screen_h = ctx.canvas.height / 2.0;

    ctx.fillStyle = "#252525AA";
    ctx.beginPath();
        ctx.arc(half_screen_w, half_screen_h, ((ctx.canvas.width + ctx.canvas.height)/18.0), 0, 2 * Math.PI);
        ctx.globalCompositeOperation = 'destination-out'
        ctx.arc(half_screen_w, half_screen_h, ((ctx.canvas.width + ctx.canvas.height)/21.0), 0, Math.PI*2, true);
        ctx.globalCompositeOperation = 'source-over'
        ctx.fill();
    ctx.closePath();

    ctx.beginPath();
        ctx.lineTo(ctx.canvas.width * 0.48, ctx.canvas.height * 0.45);
        ctx.lineTo(ctx.canvas.width * 0.53, ctx.canvas.height * 0.5);
        ctx.lineTo(ctx.canvas.width * 0.48, ctx.canvas.height * 0.55);
        ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "#000";    
}

function get(url){
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();
    return request.response;
}

function init(){
    oneClick = true;
    obstacles = [];
    timeToSpawnObstacle = Date.now();
    posMountainBack = 50;
    posMountainFront = 100;
    isPlaying = false;
    aspctRatioHasChange = false;
    flashOpacity = 0xFF;
    fps = 0;
    player = new Player(player.id, new Vec(150, ctx.canvas.height/2.0), player.nickname, new Vec(30,30), player.highscore, player.timesPlayed);
    var y = ctx.canvas.height * 0.2 + Math.random() * (ctx.canvas.height * 0.6);
    obstacles.splice(0,0, new Obstacle(new Vec(ctx.canvas.width + 25, y),2, new Vec(50,50), 50));
}

function main(){
    init();

    var playersData = JSON.parse(get('http://52.2.64.114:5045/players'));

    let i = 0;
    playersData.forEach(element => {
        if(i < 10){
            var row = rank.insertRow(rank.length);
            row.insertCell(0).innerHTML = element.nickname;
            row.insertCell(1).innerHTML = element.score;
            row.insertCell(2).innerHTML = element.timesPlayed;
            i++;
        }
    });


    canvas.style.display = "none";
    

    img_sky.src = "./sprites/background/sky.png";
    img_mb.src = "./sprites/scenery/mountain-back.png";
    img_mf.src = "./sprites/scenery/mountain-front.png";
    img_obst.src = "./sprites/obstacle/wood.png";

    console.log("System online");
    display();
}

function sleep(ms) {
    var time = Date.now();
    while(Date.now() - time < ms);
}

function changeTableValues(nickname, score, timesPlayed){
    for(let i=1; i < rank.rows.length; i++){
        var row = rank.rows.item(i).innerHTML;
        row = row.replaceAll("<td>", "");
        row = row.replaceAll("</td>", " ");
        row = row.split(" ");
        if(row[0] === nickname){
            rank.rows.item(i).innerHTML = "<td>"+nickname+"</td><td>"+score+"</td><td>"+timesPlayed+"</td>";   
        }
    }
            
}

document.getElementsByTagName('body')[0].onclick = function(e) { // executa quando há 'click' na tela
    if(player.isAlive){  // se o player está vivo
        if(!isPlaying){  // verificação para atualizar o valor da quantidade de jogadas
            player.timesPlayed++;

            var body = {
                "id": player.id,
                "timesPlayed": player.timesPlayed
            }

            let request = new XMLHttpRequest(); // faz o POST na API para atualizar o valor
            request.open("POST", 'http://52.2.64.114:5045/timesPlayed', true);
            request.setRequestHeader("Content-type", "application/json");
            request.send(JSON.stringify(body));

        }

        isPlaying = true; // muda o estado do jogo para "Jogando"
        player.jump();    // pula;
    }else{
        var playerData = JSON.parse(get('http://52.2.64.114:5045/players/id/'+player.id)); // recebe os dados do jogador da api
        if(player.score > playerData.score){ // verifica se os pontos atua são maiores que o do banco de dados
            player.highscore = player.score; // atualiza a pontuação maxima

            var body = {
                "id": player.id,
                "score": player.score
            }
    
            let request = new XMLHttpRequest(); // atualiza a pontuaçao maxima no bando de dados
            request.open("POST", 'http://52.2.64.114:5045/score', true);
            request.setRequestHeader("Content-type", "application/json");
            request.send(JSON.stringify(body));
        }

        changeTableValues(player.nickname, player.highscore, player.timesPlayed);
        init(); // novo jogo;
    }
    
    
}
window.addEventListener('load', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')

    if(id == null){
        window.location.assign("index.html");

    }else if(localStorage.getItem("id="+id+" is logged") == undefined){
        window.location.assign("index.html");
    }

    var playerData = JSON.parse(get('http://52.2.64.114:5045/players/id/'+id));

    player = new Player(playerData.id, new Vec(150, ctx.canvas.height/2.0), playerData.nickname, new Vec(30,30), playerData.score, playerData.timesPlayed);

    main();
});
