var canvas, gameContainer, scoreContainer, ctx, audioWin, audioLoose;
//CANVAS properties
const canvasSize = 400
const canvasBorder = "2px solid red"
const canvasBackgroundColor = "#1d1d1d"
const canvasOpacity = 0.8

//SCORE properties
var score = 0
const scoreColor = "white"
const scoreFontSize = "35px";
const scoreBackgroundColor = "rgba(0, 0, 0, 0.5)";

//SNACK properties
const snackColor = "orange"
const snackSize = 20
var blockUnit = canvasSize / snackSize //nbr de fois se déplacer
var snackX = Math.trunc(Math.random()*blockUnit)*snackSize
var snackY = Math.trunc(Math.random()*blockUnit)*snackSize  //trunc=partie entière du nbr
var snackBody = []
var snackBodySize = 1
//FOOD properties
var rayonFood = snackSize/2
var foodX = Math.trunc(Math.random()*blockUnit)*snackSize + rayonFood
var foodY = Math.trunc(Math.random()*blockUnit)*snackSize + rayonFood

//STEP properties
var stepX = "0"
var stepY = "0"


export const SnackGame = {
    start : () => {
        SnackGame.createCanvas()
        SnackGame.createSnack()
        SnackGame.initMoveSnack()
        setInterval(SnackGame.updateSnackPosition, 100)
    },
    createCanvas: () =>{
        // console.log("createCanvas");  ->pour voir si dans la console ça se voit ->! associer avec le main.js et index
        gameContainer = document.createElement("div")
        scoreContainer = document.createElement("div")

        scoreContainer.id = "score";
        scoreContainer.innerHTML = score;  
        scoreContainer.style.color = scoreColor;
        scoreContainer.style.zIndex = 1000;
        scoreContainer.style.position = "absolute";
       
        scoreContainer.style.fontSize = scoreFontSize;
        scoreContainer.style.fontWeight = "bold";
        scoreContainer.style.opacity = canvasOpacity;
        scoreContainer.style.backgroundColor = scoreBackgroundColor;
        scoreContainer.style.padding = "10px";
        scoreContainer.style.border = "2px solid red"; 
        scoreContainer.style.transform = "translate(-50%, -50%)"

        gameContainer.id = "game-container";
        canvas = document.createElement("canvas");
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        canvas.style.border = canvasBorder;
        canvas.style.opacity = canvasOpacity;
        canvas.style.backgroundColor = canvasBackgroundColor;

        // canvas.style.display = "block"
        // canvas.style.marginLeft = "auto"
        // canvas.style.marginRight = "auto"
        //gameContainer.style.flexDirection = "column"
        gameContainer.style.display = "flex";
        gameContainer.style.justifyContent = "center";
        gameContainer.style.alignItems = "center";
        gameContainer.appendChild(canvas);

        scoreContainer.style.left = "50%";
        scoreContainer.style.top = "50%";

        ctx = canvas.getContext("2d")

        document.body.appendChild(gameContainer);
        document.body.appendChild(scoreContainer); 
        console.log("scoreContainer");

    },
    setWinMedia: () =>{
        let audioWin = document.createElement("audio")
        audioWin.src = "/assets/media/pomme.mp3"
        audioWin.play()
    },
    setLooseMedia: () =>{
        let audioLoose = document.createElement("audio")
        audioLoose.src = "/assets/media/loose.mp3"
        audioLoose.play()
    },
    createSnack: () =>{
        ctx.fillStyle = snackColor
        ctx.clearRect(0, 0, canvasSize, canvasSize)

        if (stepX !== 0 || stepY !== 0 || snackBody.length === 0){
        snackBody.push({snackX, snackY})
        if(snackBody.length > snackBodySize){
            snackBody.shift()
        }
         }

        snackBody.forEach(body => {
            ctx.fillRect(body.snackX - 1, body.snackY - 1, snackSize - 1, snackSize - 1)
            
        });
        SnackGame.createFood()
    },
    createFood: () =>{
        ctx.beginPath();
        ctx.arc(foodX, foodY, rayonFood, 0, 2 * Math.PI);
        ctx.fillStyle = snackColor
        ctx.fill()
        ctx.closePath()
    },
    updateSnackPosition: () =>{
        snackX += stepX*snackSize
        snackY += stepY*snackSize
        SnackGame.createSnack()
        SnackGame.checkClash()
    },
    initMoveSnack: () =>{
        document.addEventListener("keydown", (event)=>{
            //console.log(event.key);
            switch (event.key) {
                case "ArrowUp":
                    stepY = -1
                    stepX = 0
                    //SnackGame.updateSnackPosition()
                    break;

                case "ArrowDown":
                    stepY = 1
                    stepX = 0
                    //SnackGame.updateSnackPosition()
                    break;
                
                case "ArrowLeft":
                        stepY = 0
                        stepX = -1
                        //SnackGame.updateSnackPosition()
                        break;
    
                case "ArrowRight":
                        stepY = 0
                        stepX = 1
                        //SnackGame.updateSnackPosition()
                        break;

                case "p":
                        stepY = 0
                        stepX = 0
                        break;
                case "P":
                        stepY = 0
                        stepX = 0
                        break;
                case " ":
                    stepY = 0
                    stepX = 0
                    break;
            
                default:
                    break;
            }
        })
    },
    setWin: () =>{
        SnackGame.setWinMedia()
        SnackGame.updateScore(score +10)
        snackBodySize += 3
        foodX = Math.trunc(Math.random()*blockUnit)*snackSize + rayonFood
        foodY = Math.trunc(Math.random()*blockUnit)*snackSize + rayonFood
    },
    setLoose: () =>{
        SnackGame.setLooseMedia()
        SnackGame.updateScore(score - 20)
        stepX = 0
        stepY = 0
        snackBody = []
        snackX = Math.trunc(Math.random()*blockUnit)*snackSize
        snackY = Math.trunc(Math.random()*blockUnit)*snackSize
    },
    checkClash: () => {
        if ((snackX < 0 || snackX > (canvasSize - snackSize )) || (snackY < 0 || snackY > (canvasSize - snackSize))) {
            //error
            SnackGame.setLoose()
        }else if(((foodX - rayonFood) === snackX) && ((foodY - rayonFood) === snackY)){
            //win
            SnackGame.setWin()
        }
        //pour le snack se mord
        for (let index = 0; index < snackBody.length - 1; index++) {
            const body = snackBody[index];
            const snackHead = snackBody[snackBody.length-1];
            if(body.snackX == snackHead.snackX && body.snackY == snackHead.snackY){
                SnackGame.setLoose()
                break
            }                
        }
    },
    updateScore: (newScore) => {
        if(newScore !== score){
            scoreContainer.innerHTML = newScore
            score = newScore
        }

    }
}