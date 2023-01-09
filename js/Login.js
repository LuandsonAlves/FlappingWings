
function play(){
    const url = "http://3.82.160.1:5045/login";
    let nickname = document.getElementById("nickname").value;
    let password = document.getElementById("password").value;
    let label = document.getElementById("mensagem_de_erro");
    label.innerHTML = "";

    if(nickname.length == 0 || password.length == 0){
        label.innerHTML = "Preencha todos os campos vazios!";

    }else{

        body = {
            "nickname": nickname,
            "password": password
        }

        let request = new XMLHttpRequest();
        
        request.open("POST", url, true);
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(body));

        request.onload = function(){
            if(JSON.parse(this.responseText).message == "Nickname not find"){
                label.innerHTML = "Nickname não foi encontrado!";

            }else if(JSON.parse(this.responseText).message == "Wrong nickname or password"){
                label.innerHTML = "Nickname ou senha incorreto!";

            }else{
                join(nickname);
            }
        }
    }
}

function register(){
    const url = "http://3.82.160.1:5045/register";
    let nickname = document.getElementById("nickname").value;
    let password = document.getElementById("password").value;
    let label = document.getElementById("mensagem_de_erro");
    label.innerHTML = "";

    if(nickname.length == 0 || password.length == 0){
        label.innerHTML = "Preencha todos os campos vazios!";

    }else if(password.length > 30){
        label.innerHTML = "Senha muito grande!";

    }else{

        body = {
            "nickname": nickname,
            "password": password
        }

        let request = new XMLHttpRequest();
        
        request.open("POST", url, true);
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(body));

        request.onload = function(){
            if(JSON.parse(this.responseText).message == "Nickname exists"){
                label.innerHTML = "Nickname já existe!";

            }else{
                join(nickname);
            }
        }
    }
}

function join(nickname){
    var playerData = JSON.parse(get('http://3.82.160.1:5045/players/nickname/'+nickname));
    localStorage.setItem("id="+playerData.id+" is logged", true);
    window.location.assign("display.html?id="+playerData.id);
}

function get(url){
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();
    return request.response;
}
