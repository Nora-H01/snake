const words = ["javascript", "programme", "ordinateur", "developpeur", "internet"];
        const word = words[Math.floor(Math.random() * words.length)];
        let guessedLetters = [];
        let remainingGuesses = 6;

        function displayWord() {
            let display = word.split('').map(letter => (guessedLetters.includes(letter) ? letter : "_")).join(' ');
            document.getElementById('game').innerText = `Mot: ${display}\nGuesses restantes: ${remainingGuesses}\nLettres devinées: ${guessedLetters.join(", ")}`;
        }

        function guessLetter(letter) {
            if (!guessedLetters.includes(letter)) {
                guessedLetters.push(letter);
                if (!word.includes(letter)) {
                    remainingGuesses--;
                }
            }
            checkGameOver();
            displayWord();
        }

        function checkGameOver() {
            if (remainingGuesses <= 0) {
                alert(`Perdu! Le mot était: ${word}`);
                resetGame();
            } else if (word.split('').every(letter => guessedLetters.includes(letter))) {
                alert("Gagné! Félicitations!");
                resetGame();
            }
        }

        function resetGame() {
            guessedLetters = [];
            remainingGuesses = 6;
            displayWord();
        }

        document.addEventListener('keydown', (event) => {
            if (event.key.match(/^[a-z]$/i)) {
                guessLetter(event.key.toLowerCase());
            }
        });

        displayWord();