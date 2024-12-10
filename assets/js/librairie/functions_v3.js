const canvasSize = 400;

let score = 0;

const snackColor = "orange";
const snackSize = 25;
const blockUnit = canvasSize / snackSize;
let snackX = Math.trunc(Math.random() * blockUnit) * snackSize;
let snackY = Math.trunc(Math.random() * blockUnit) * snackSize;
let snackBody = [];
let snackBodySize = 2;


const rayonFood = snackSize / 2;
let foodX = Math.trunc(Math.random() * blockUnit) * snackSize + rayonFood;
let foodY = Math.trunc(Math.random() * blockUnit) * snackSize + rayonFood;

//Images
const foodImage = new Image();
foodImage.src = '/assets/images/appel.png';
const headImage = new Image();
headImage.src = '/assets/images/tete.png';
const bodyImage = new Image();
bodyImage.src = '/assets/images/corpsb.png';
const tailImage = new Image();
tailImage.src = '/assets/images/queu.png';

const headSize = 30;
const bodySize = 25; // Corps légèrement plus petit
const tailSize = 20; // Queue encore plus petite

let currentDirection = 'right';
let isPaused = false;

// Créer l'élément de message de pause
const pauseMessage = document.createElement("div");
pauseMessage.id = "pause-message";
pauseMessage.textContent = "Pause";
document.body.appendChild(pauseMessage);

let stepX = 0;
let stepY = 0;
let gameInterval;

let updateInterval = 600; // Augmenté à 800 millisecondes pour ralentir le serpent initialement
const minUpdateInterval = 100; // Minimum intervalle de mise à jour pour ne pas aller trop vite
const intervalDecrement = 50; // Diminuer l'intervalle de 50ms chaque fois qu'il mange

export const SnackGame = {
    start: () => {
        SnackGame.createCanvas();
        SnackGame.createSnack();
        SnackGame.initMoveSnack();
        gameInterval = setInterval(SnackGame.updateSnackPosition, updateInterval);
    },
    createCanvas: () => {
        const gameContainer = document.createElement("div");
        const scoreContainer = document.createElement("div");

        scoreContainer.id = "score";
        scoreContainer.innerHTML = score;

        gameContainer.id = "game-container";

        const canvasContainer = document.createElement("div");
        canvasContainer.id = "canvas-container";

        const canvas = document.createElement("canvas");
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        const borderTop = document.createElement("div");
        borderTop.id = "border-top";
        borderTop.classList.add("border");

        const borderBottom = document.createElement("div");
        borderBottom.id = "border-bottom";
        borderBottom.classList.add("border");

        const borderLeft = document.createElement("div");
        borderLeft.id = "border-left";
        borderLeft.classList.add("border");

        const borderRight = document.createElement("div");
        borderRight.id = "border-right";
        borderRight.classList.add("border");

        canvasContainer.appendChild(canvas);
        canvasContainer.appendChild(borderTop);
        canvasContainer.appendChild(borderBottom);
        canvasContainer.appendChild(borderLeft);
        canvasContainer.appendChild(borderRight);

        gameContainer.appendChild(canvasContainer);

        document.body.appendChild(gameContainer);
        document.body.appendChild(scoreContainer);
    },
    
    setWinMedia: () => {
        const audioWin = new Audio("/assets/media/pomme.mp3");
        audioWin.play();
    },
    setLooseMedia: () => {
        const audioLoose = new Audio("/assets/media/loose.mp3");
        audioLoose.play();
    },
    createSnack: () => {
        const ctx = document.querySelector("canvas").getContext("2d");
        ctx.fillStyle = snackColor;
        ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Mettre à jour la position du serpent
    if (stepX !== 0 || stepY !== 0 || snackBody.length === 0) {
        snackBody.push({ snackX, snackY, direction: currentDirection });
        if (snackBody.length > snackBodySize) {
            snackBody.shift();
        }
    }

   // Dessiner le serpent
   snackBody.forEach((part, index) => {
    if (index === 0) {
        // Queue
        let tailDirection = snackBody.length > 1 ? snackBody[1].direction : currentDirection;
        drawImage(ctx, tailImage, part.snackX, part.snackY, tailDirection, tailSize);
    } else if (index === snackBody.length - 1) {
        // Tête
        drawImage(ctx, headImage, part.snackX, part.snackY, part.direction, headSize);
    } else {
        // Corps
        drawImage(ctx, bodyImage, part.snackX, part.snackY, part.direction, bodySize);
    }
});
        SnackGame.createFood();
    },
    createFood: () => {
        const ctx = document.querySelector("canvas").getContext("2d");
        ctx.beginPath();
        ctx.arc(foodX, foodY, rayonFood, 0, 2 * Math.PI);
        ctx.closePath();

        if (foodImage.complete) {
            ctx.drawImage(foodImage, foodX - rayonFood, foodY - rayonFood, snackSize, snackSize);
        } else {
            foodImage.onload = () => {
                ctx.drawImage(foodImage, foodX - rayonFood, foodY - rayonFood, snackSize, snackSize);
            };
        }
    },
    updateSnackPosition: () => {
        if (isPaused) return;
        snackX += stepX * snackSize;
        snackY += stepY * snackSize;
        SnackGame.createSnack();
        SnackGame.checkClash();
    },
    initMoveSnack: () => {
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowUp":
                    if (isPaused || stepY === 1) return;
                    stepY = -1;
                    stepX = 0;
                    currentDirection = 'up';
                    break;
                case "ArrowDown":
                    if (isPaused || stepY === -1) return;
                    stepY = 1;
                    stepX = 0;
                    currentDirection = 'down';
                    break;
                case "ArrowLeft":
                    if (isPaused || stepX === 1) return;
                    stepY = 0;
                    stepX = -1;
                    currentDirection = 'left';
                    break;
                case "ArrowRight":
                    if (isPaused || stepX === -1) return;
                    stepY = 0;
                    stepX = 1;
                    currentDirection = 'right';
                    break;
                case " ":
                    isPaused = !isPaused;
                    stepY = 0;
                    stepX = 0;
                    document.getElementById('pause-message').style.display = isPaused ? 'block' : 'none';
                    break;
                default:
                    break;
            }
        });
    },
    setWin: () => {
        SnackGame.setWinMedia();
        SnackGame.updateScore(score + 10);
        snackBodySize += 2;
        foodX = Math.trunc(Math.random() * blockUnit) * snackSize + rayonFood;
        foodY = Math.trunc(Math.random() * blockUnit) * snackSize + rayonFood;

        // Augmenter la vitesse
        if (updateInterval > minUpdateInterval) {
            updateInterval -= intervalDecrement;
            clearInterval(gameInterval);
            gameInterval = setInterval(SnackGame.updateSnackPosition, updateInterval);
        }
    },
    setLoose: () => {
        SnackGame.setLooseMedia();
        SnackGame.updateScore(score - 20);
        stepX = 0;
        stepY = 0;
        snackBody = [];
        snackX = Math.trunc(Math.random() * blockUnit) * snackSize;
        snackY = Math.trunc(Math.random() * blockUnit) * snackSize;

        // Réduire la vitesse (réinitialiser)
        updateInterval = 600; // Remettre à l'intervalle initial
        clearInterval(gameInterval);
        gameInterval = setInterval(SnackGame.updateSnackPosition, updateInterval);
    },
    checkClash: () => {
         // Vérifiez les collisions avec les bordures
         if (snackX < 0 || snackX > (canvasSize - snackSize) || snackY < 0 || snackY > (canvasSize - snackSize)) {
            SnackGame.setLoose();
        } else if ((foodX - rayonFood === snackX) && (foodY - rayonFood === snackY)) {
            SnackGame.setWin();
        }
        for (let index = 0; index < snackBody.length - 1; index++) {
            const body = snackBody[index];
            const snackHead = snackBody[snackBody.length - 1];
            if (body.snackX === snackHead.snackX && body.snackY === snackHead.snackY) {
                SnackGame.setLoose();
                break;
            }
        }
    },
    updateScore: (newScore) => {
        if (newScore !== score) {
            const scoreContainer = document.getElementById("score");
            scoreContainer.innerHTML = newScore;
            score = newScore;
        }
    }
};

const drawImage = (ctx, img, x, y, direction) => {
    ctx.save();
    ctx.translate(x + snackSize / 2, y + snackSize / 2);
    switch (direction) {
        case 'left':
            ctx.rotate(-Math.PI / 2);
            break;
        case 'right':
            ctx.rotate(Math.PI / 2);
            break;
        case 'down':
            ctx.rotate(Math.PI);
            break;
        case 'up':
            // Pas de rotation nécessaire pour la droite
            break;
    }
    ctx.drawImage(img, -snackSize / 2, -snackSize / 2, snackSize, snackSize);
    ctx.restore();
}