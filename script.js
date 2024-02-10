// Circles Attak (Demo)

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const middleOfScreenX = canvas.offsetWidth / 2;
const middleOfScreenY = canvas.offsetHeight / 2;

function createMe() {
    ctx.beginPath();
    ctx.arc(middleOfScreenX, middleOfScreenY * 2, 50, 0, 360);
    ctx.stroke();
}
createMe();

function createRandom(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}

var enemys = [];
function createEnemy(enemys) {
    enemys.push(
        {
            x: createRandom(0, canvas.offsetWidth),
            y: createRandom(0, 400),
            radius: createRandom(5, 20),
        }
    );
}

function updateEnemyPosition(enemys) {
    var speed = 1;
    for (i = 0; i < enemys.length; i++) {
        if ((middleOfScreenY * 2 - enemys[i].y) < (middleOfScreenX - enemys[i].x)) {
            if (enemys[i].x > middleOfScreenX) {
                enemys[i].x -= speed;
                enemys[i].y += Math.abs((middleOfScreenY * 2 - enemys[i].y) / (middleOfScreenX - enemys[i].x)) * speed;
            }
            else if (enemys[i].x < middleOfScreenX) {
                enemys[i].x += speed;
                enemys[i].y += ((middleOfScreenY * 2 - enemys[i].y) / (middleOfScreenX - enemys[i].x)) * speed;
            }
        } else {
            if (enemys[i].x > middleOfScreenX) {
                enemys[i].x -= Math.abs((middleOfScreenX - enemys[i].x) / (middleOfScreenY * 2 - enemys[i].y)) * speed;
                enemys[i].y += speed;
            }
            else if (enemys[i].x < middleOfScreenX) {
                enemys[i].x += Math.abs((middleOfScreenX - enemys[i].x) / (middleOfScreenY * 2 - enemys[i].y)) * speed;
                enemys[i].y += speed;
            }
        }
        var diffX = Math.abs(middleOfScreenX - enemys[i].x);
        var diffY = Math.abs((middleOfScreenY * 2) - enemys[i].y);
        var distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2), 2);
        var radians = enemys[i].radius + 50;
        if (distance < radians) {
            gameLoss(i);
        }
    }
}


// function gameLoss(i) {
//     enemys.splice(i, 1);
// }
function gameLoss(i) {
    clearInterval(theUpdateGame);
    clearInterval(theAddShot);
    clearInterval(theCreateEnmys);
}

function updateGame() {
    ctx.clearRect(0, 0, middleOfScreenX * 2, middleOfScreenY * 2);
    createMe();
    for (i = 0; i < enemys.length; i++) {
        ctx.beginPath();
        ctx.arc(enemys[i].x, enemys[i].y, enemys[i].radius, 0, 360);
        ctx.stroke();
    }
    for (i = 0; i < myShots.length; i++) {
        ctx.beginPath();
        ctx.arc(myShots[i].x, myShots[i].y, myShots[i].radius, 0, 360);
        ctx.stroke();
    }
    updateEnemyPosition(enemys);
    updateShotPosition(myShots);
}

var theCreateEnmys = setInterval(() => {
    createEnemy(enemys);
}, 1000);


var mouseX = middleOfScreenX;
var mouseY = middleOfScreenY;
window.addEventListener('mousemove', (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
});

var myShots = [];
function addShot() {
    myShots.push(
        {
            x: middleOfScreenX,
            y: canvas.offsetHeight,
            radius: 2,
            targetX: mouseX,
            targetY: mouseY,
        }
    );
}
var Points = 0;
function killEnemy(theEnemy) {
    if (enemys[theEnemy].radius > 4) {
        enemys[theEnemy].radius -= 2;
    } else {
        enemys.splice(theEnemy, 1);
    }
    Points++;
    window.innterHtml = Points;
}

function updateShotPosition(myShots) {
    var speed = 3;
    for (i = 0; i < myShots.length; i++) {
        if (Math.abs(myShots[i].targetY - canvas.offsetHeight) > Math.abs(myShots[i].targetX - middleOfScreenX)) {
            myShots[i].x -= (myShots[i].x - myShots[i].targetX) / (myShots[i].y - myShots[i].targetY) * speed;
            myShots[i].y -= speed;
        } else {
            myShots[i].x -= (myShots[i].x - myShots[i].targetX) / (myShots[i].y - myShots[i].targetY) * speed;
            myShots[i].y -= speed;
        }
        for (j = 0; j < enemys.length; j++) {
            var diffXe = enemys[j].x - myShots[i].x;
            var diffYe = enemys[j].y - myShots[i].y;
            var distancee = Math.sqrt(Math.pow(diffXe, 2) + Math.pow(diffYe, 2), 2);
            var radianse = myShots[i].radius + enemys[j].radius;
            if (distancee < radianse) {
                killEnemy(j);
            }
        }
        if (myShots[i].x < 0 || myShots[i].y < 0 || myShots[i].y > canvas.offsetWidth) {
            myShots.splice(i, 1);
            console.log(myShots.length);
        }
    }
}


var theUpdateGame = setInterval(() => {
    updateGame();
}, 10);
var theAddShot = setInterval(() => {
    addShot();
}, 20);
