import ALLOWED_WORDS from "./allowedWords.js";

let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let remainingGuesses = 6;
let won = false;
let correctWord = '';

initGame();

function initGame() {
    correctWord = ALLOWED_WORDS[Math.floor(Math.random() * ALLOWED_WORDS.length)];
    initKeyboardListener();
    initButtonsListener();

    function initKeyboardListener(){
        document.addEventListener('keyup', (e) => {
            if(won || remainingGuesses === 0) return;

            const key = e.key.toUpperCase();
            if (alphabet.includes(key)) {
                writeLetter(key);
            }
            else if (key === 'ENTER') {
                enterWord();
            }
            else if (key === 'BACKSPACE') {
                removeLetter();
            }
        });
    }

    function initButtonsListener(){
        for (row of document.getElementsByClassName('keyboard-row')){
            row.addEventListener('click', function(event) {
                
                let tagName = event.target.tagName;
                if (tagName === 'svg' || tagName === 'path') removeLetter();
                if (event.target.className !== 'letter') return;

                if (event.target.textContent === 'ENTER')  enterWord();
                else if (event.target.id == 'backspace') removeLetter();
                else writeLetter(event.target.textContent);
                
            });
        };

    }
}

function writeLetter(key){
    let currentWord = document.getElementById(7 - remainingGuesses);
    let boxes = currentWord.getElementsByClassName('word-box');
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].innerHTML === '') {
            boxes[i].innerHTML = key;
            boxes[i].classList.add('filled');
            break;
        }
    }
}

function removeLetter(){
    let currentWord = document.getElementById(7 - remainingGuesses);
    let boxes = currentWord.getElementsByClassName('word-box');
    for (let i = boxes.length - 1; i >= 0; i--) {
        if (boxes[i].innerHTML !== '') {
            boxes[i].innerHTML = '';
            boxes[i].classList.remove('filled');
            break;
        }
    }
}

function enterWord(){
    let currentWord = document.getElementById(7 - remainingGuesses);
    let boxes = currentWord.getElementsByClassName('word-box');
    let word = '';
    for (let i = 0; i < boxes.length; i++) {
        word += boxes[i].innerHTML;
    }
    
    if (word.length === 5) {
        checkWord(word);
        remainingGuesses--;
    } else {
        showAlert("Not enough letters");
    }

}

function checkWord(word){
    let currentWord = document.getElementById(7 - remainingGuesses);
    currentWord.style.color = 'white'
    
    let boxes = currentWord.getElementsByClassName('word-box');
    let wrongLetters = '';

    let correct = 0;
    for (let i = 0; i < correctWord.length; i++) {
        let bgColor = '';
        if (correctWord[i] === word[i]) {
            bgColor = '#6aaa64';
            correct++;
        } else if (correctWord.includes(word[i])) {
            bgColor = '#c9b458';
        } else {
            bgColor = '#787c7e';
            wrongLetters += word[i];
        }
        boxes[i].style.backgroundColor = bgColor;
        boxes[i].style.border = '2px solid ' + bgColor;
    }

    if (correct === 5) {
        showAlert("Great")
        won = true;
    } else {
        // set wrong letters gray and disabled in the keyboard
        let letters = document.getElementsByClassName('letter');
        for (let i = 0; i < letters.length; i++) {
            if (wrongLetters.includes(letters[i].textContent)) {
                letters[i].style.backgroundColor = '#787c7e';
                letters[i].style.color = 'white';
                letters[i].disabled = true;
            }
        }
    }
}

function showAlert(message) {
    let alert = document.getElementsByClassName('alert')[0];
    let alertMessage = alert.getElementsByClassName('alert-message')[0];
    
    alertMessage.innerHTML = message;
    alert.classList.remove('hidden');
    setTimeout(() => {
        alert.classList.add('hidden');
    }, 2000);

    // add shake effect to the word
    let currentWord = document.getElementById(7 - remainingGuesses);
    currentWord.classList.add('shake');
    setTimeout(() => {
        currentWord.classList.remove('shake');
    }, 1000);
}