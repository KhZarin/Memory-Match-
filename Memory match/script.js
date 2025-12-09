const gameContainer = document.getElementById("game");
const restartBtn = document.getElementById("restart");
const timeDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");

let symbols = ["A","B","C","D","E","F","G","H"];
let cards = [...symbols, ...symbols];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;

let previewTime = 5; // 10 seconds preview
let gameTime = 60;    // 1 minute game time
let timer = null;
let gameActive = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGameTimer() {
    timer = setInterval(() => {
        gameTime--;
        timeDisplay.textContent = gameTime;

        if (gameTime <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    gameActive = false;
    alert("⏳ Time Up!\n🏆 Your Score: " + score);
}

function startGame() {
    // Reset everything
    clearInterval(timer);
    timer = null;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    score = 0;
    scoreDisplay.textContent = score;

    gameTime = 60;
    previewTime = 5;
    timeDisplay.textContent = previewTime;

    gameContainer.innerHTML = "";
    shuffle(cards);

    // Create cards and show symbols
    cards.forEach(symbol => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.symbol = symbol;
        card.innerText = symbol; // Show for preview
        gameContainer.appendChild(card);
    });

    
    gameActive = false;

   
    let previewInterval = setInterval(() => {
        previewTime--;
        timeDisplay.textContent = previewTime;

        if (previewTime <= 0) {
            clearInterval(previewInterval);

            
            document.querySelectorAll(".card").forEach(card => {
                card.innerText = "";
                card.addEventListener("click", flipCard);
            });

            gameActive = true;           
            timeDisplay.textContent = gameTime;
            startGameTimer();            
        }
    }, 1000);
}

function flipCard() {
    if (!gameActive) return;
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");
    this.innerText = this.dataset.symbol;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkMatch();
}

function checkMatch() {
    let isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

    if (isMatch) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        score++;
        scoreDisplay.textContent = score;

        resetTurn();
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.innerText = "";
            secondCard.innerText = "";
            resetTurn();
        }, 600);
    }
}

function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

restartBtn.addEventListener("click", startGame);

startGame();