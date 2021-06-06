const score1=document.querySelector('.Score1');
const score2=document.querySelector('.Score2');
const startscreen=document.querySelector('.startScreen');
const endscreen=document.querySelector('.endScreen');
const menuscreen = document.querySelector('.menu1');
const pausescreen=document.querySelector('.pauseScreen');
const gamearea=document.querySelector('.GameArea');
const leftButton = document.querySelector('.leftButton');
const rightButton = document.querySelector('.rightButton');

let player={ speed:7,score1:0, score2: 0};

let keys={ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false};

let moveLeft;
let moveRight;

pausescreen.classList.add('hide');
endscreen.classList.add('hide');
menuscreen.classList.add('hide');

document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);

leftButton.addEventListener('touchstart', leftButtonDown);
leftButton.addEventListener('touchend', leftButtonUp);

rightButton.addEventListener('touchstart', rightButtonDown);
rightButton.addEventListener('touchend', rightButtonUp);


function keyDown(ev){
    ev.preventDefault();
    keys[ev.key]=true;

}
function keyUp(ev){
    ev.preventDefault();
    keys[ev.key]=false;
}

function leftButtonDown(ev) {
    ev.preventDefault();
    moveLeft=true;
}
function leftButtonUp(ev) {
    ev.preventDefault();
    moveLeft=false;
}

function rightButtonDown(ev) {
    ev.preventDefault();
    moveRight=true;
}
function rightButtonUp(ev) {
    ev.preventDefault();
    moveRight=false;
}

// Столкновения
function isCollide(a,b){
    aRect=a.getBoundingClientRect();
    bRect=b.getBoundingClientRect();

    return !((aRect.bottom<bRect.top)||(aRect.top>bRect.bottom)||(aRect.right<bRect.left)||(aRect.left>bRect.right));
}

function collisionDetection(a, b) {
    aRect=a.getBoundingClientRect();
    bRect=b.getBoundingClientRect();

    if (!((aRect.bottom<bRect.top)||(aRect.top>bRect.bottom)||(aRect.right<bRect.left)||(aRect.left>bRect.right))){
        let roders = document.querySelectorAll('.rod');
        let rod1 = roders[0];
        rod1.style.display = "none";
        player.score1++;
        player.score2++;
    }
}

// Конец игры
function endGame(){
    player.start=false;
    player.pause = false;
    endscreen.classList.remove('hide')
    menuscreen.classList.add('hide');
}

//Перемещение и появление других машины
let road = 0;
function moveCar(car){
    let other=document.querySelectorAll('.other');
    other.forEach(function(item){
        if(isCollide(car,item)){
            endGame();
        }
        if(item.y>=750){
            item.y=-300;
            const roads = [90, 195, 300, 405];
            road = roads[Math.floor(Math.random()*roads.length)];
            item.style.left= road + 'px';
            }
        item.y+=player.speed;
        item.style.top=item.y+'px';
    })
}

function moveCar2(car) {
    let rod=document.querySelectorAll('.rod');
    rod.forEach(function(item){
        collisionDetection(car, item);
        if(item.y>=750){
            item.y=-300;
            let roders = document.querySelectorAll('.rod')
            let rod2 = roders[0];
            rod2.style.display = "";
            const roads = [90, 195, 300, 405];
            let road2 = roads[Math.floor(Math.random()*roads.length)];
            if (road2 == road) {
                road2 = -105;
            }
            item.style.left=road2+'px';
        }
        item.y+=player.speed/2;
        item.style.top=item.y+'px';
    })
}

function gamePlay(){

    let car=document.querySelector('.car');
    let road=gamearea.getBoundingClientRect();

    if(player.start){
        moveCar(car);
        moveCar2(car);

        //Контроллер
        if((keys.ArrowLeft || moveLeft) && player.x>0){
            player.x-=player.speed;
        }
        if((keys.ArrowRight || moveRight) && player.x<(road.width-80)){
            player.x+=player.speed;
        }

        car.style.top=player.y + 'px';
        car.style.left=player.x + 'px';

        window.requestAnimationFrame(gamePlay);
        if (player.score1 == 1) {
            score1.innerHTML= player.score1 + " очко";
        } else if ((player.score1 > 1) && (player.score1 <5)) {
            score1.innerHTML= player.score1 + " очка";
        } else {
            score1.innerHTML= player.score1 + " очков";
        }

        score2.innerHTML= "Очки: " + player.score2;
    }

    if(player.pause){
        window.requestAnimationFrame(gamePlay);
        score1.innerHTML= player.score1;
        score2.innerHTML= player.score2;
    }
}

function game() {
    menuscreen.classList.remove('hide');
    gamearea.innerHTML="";

    player.start=true;
    player.pause=false;

    player.score1=0;
    player.score2=0;
    window.requestAnimationFrame(gamePlay);

    let car=document.createElement('div');
    car.setAttribute('class','car');
    gamearea.appendChild(car);

    player.x=car.offsetLeft;
    player.y=car.offsetTop;


    for(x=0;x<4;x++){
        let othercar=document.createElement('div');
        othercar.setAttribute('class','other');
        othercar.y=((x+1)*350)* -1;
        othercar.style.top=othercar.y+'px';
        const roads = [90, 195, 300, 405]
        let road = roads[Math.floor(Math.random()*roads.length)];
        othercar.style.left= road + 'px';
        gamearea.appendChild(othercar);
    }

    for(r=0;r<1;r++){
        let otherrod=document.createElement('div');
        otherrod.setAttribute('class', 'rod');
        otherrod.y=((r+1)*350)* -1;
        otherrod.style.top=otherrod.y+'px';
        const roads = [90, 195, 300, 405]
        let road = roads[Math.floor(Math.random()*roads.length)];
        otherrod.style.left= road + 'px';
        gamearea.appendChild(otherrod);
    }
}

function start(){
    startscreen.classList.add('hide');
    pausescreen.classList.add('hide');
    game();
}

function pause() {
    pausescreen.classList.remove('hide');
    menuscreen.classList.add('hide');
    player.start = false;
    player.pause = true;
}

function resume() {
    pausescreen.classList.add('hide');
    menuscreen.classList.remove('hide');
    player.start = true;
    player.pause = false;
}

function restart() {
    startscreen.classList.add('hide');
    pausescreen.classList.add('hide');
    endscreen.classList.add('hide');
    game();
}
