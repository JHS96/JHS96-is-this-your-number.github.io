const question = document.getElementById('question');
const playerWinsEl = document.getElementById('player-win-count');
const computerWinsEl = document.getElementById('computer-win-count');
const guessOutputEl = document.getElementById('guess-output');
const remainingGuessesEl = document.getElementById('number-of-guesses');
const guessesUsedEl = document.getElementById('guesses-used');
const btnHigherEl = document.getElementById('btn-higher');
const btnLowerEl = document.getElementById('btn-lower');
const btnCorrectEl = document.getElementById('btn-correct');
const btnResetEl = document.getElementById('btn-reset');
const btnRulesEl = document.getElementById('btn-rules');
const backdropEl = document.getElementById('backdrop');
const modalEl = document.getElementById('modal');
const modalHeaderEl = document.getElementById('modal-header');
const modalMessageEl = document.getElementById('modal-msg');
const modalBtnEl = document.getElementById('btn-hide-modal');

const initMin = 1;
const initMax = 10000;
const initGuessesRemaining = 14;
const initGuesesUsed = 1;
let min;
let max;
let guess;
let guessesRemaining;
let guessesUsed;
let guessedNumbers = [];
let isModalVisible = false;
let rulesVisible = false;
let gameOver = true;
let areYouSure = false;
let playerScore = 0;
let computerScore = 0;

// Initialize game + 1st guess
initialize();

function calculateGuess(low, high) {
	// return Math.floor((low + high) / 2); // This way of calculating guesses is too predictable
	return Math.floor(Math.random() * (high - low + 1) + low); // Returns random int between current min and max
}

function higherHandler() {
	cheatCheck(min, max);
	min = guess;
	let newGuess = calculateGuess(min, max);
	guess = guess === newGuess && guess > max ? (guess = guess + 1) : newGuess;
	checkIfNumUsed(guessedNumbers, guess);
	guessedNumbers.push(guess);
	if (!gameOver) {
		guessesRemaining--;
		guessesUsed++;
	}
	checkWin();
	updateDisplay();
}

function lowerHandler() {
	cheatCheck(min, max);
	max = guess;
	let newGuess = calculateGuess(min, max);
	guess = guess === newGuess && guess < min ? (guess = guess - 1) : newGuess;
	checkIfNumUsed(guessedNumbers, guess);
	guessedNumbers.push(guess);
	if (!gameOver) {
		guessesRemaining--;
		guessesUsed++;
	}
	checkWin();
	updateDisplay();
}

function cheatCheck(low, high) {
	if (low === high && low === guess && high === guess) {
		gameOver = true;
		modalMessageEl.classList.add('exclamation');
		modalHeaderEl.innerText = 'Cheaty McCheaterson!!!';
		modalMessageEl.innerHTML = "<p>You're Cheating!</p><p>No Fair!!!</p>";
		modalBtnEl.innerText = 'Cheat Again?';
		computerScore++;
		toggleModalVisibility();
	}
}

function correctHandler() {
	gameOver = true;
	modalHeaderEl.innerText = 'Whoop! Whoop! Whoop!';
	modalMessageEl.classList.add('exclamation');
	modalMessageEl.innerHTML = "<p>That's Right!</p><p>I Win!!!</p>";
	modalBtnEl.innerText = 'Play Again?';
	computerScore++;
	toggleModalVisibility();
}

function checkWin() {
	// If computer is unable to guess the user's number before the counter hits 0, the user wins.
	if (guessesRemaining <= 0) {
		modalHeaderEl.innerText = 'Yeah... All Right!';
		modalMessageEl.classList.add('exclamation');
		modalMessageEl.innerHTML = '<p>You Win!!!</p>';
		modalBtnEl.innerText = 'Play Again?';
		playerScore++;
		toggleModalVisibility();
	}
}

function resetGame() {
	playerScore = 0;
	computerScore = 0;
	initialize();
}

function initialize() {
	guessedNumbers = [];
	if (areYouSure) {
		question.classList.remove('exclamation');
		areYouSure = false;
	}
	question.innerText = 'Is this your secret number?';
	playerWinsEl.innerText = playerScore;
	computerWinsEl.innerText = computerScore;
	modalBtnEl.innerText = "Let's Go Already!";
	startFakeLoadingEff(); // Start FAKE loading effect.
	const initTimer = setTimeout(() => {
		endFakeLoading(); // End FAKE loading effect
		clearTimeout(initTimer);
		gameOver = false;
		min = initMin;
		max = initMax;
		guess = calculateGuess(min, max);
		guessedNumbers.push(guess);
		guessesRemaining = initGuessesRemaining;
		guessesUsed = initGuesesUsed;
		updateDisplay();
	}, 500);
}

function startFakeLoadingEff() {
	guessOutputEl.innerText = 'Loading...';
	btnHigherEl.setAttribute('disabled', 'disabled');
	btnLowerEl.setAttribute('disabled', 'disabled');
	btnCorrectEl.setAttribute('disabled', 'disabled');
	btnResetEl.setAttribute('disabled', 'disabled');
	btnRulesEl.setAttribute('disabled', 'disabled');
}

function endFakeLoading() {
	btnHigherEl.removeAttribute('disabled');
	btnLowerEl.removeAttribute('disabled');
	btnCorrectEl.removeAttribute('disabled');
	btnResetEl.removeAttribute('disabled');
	btnRulesEl.removeAttribute('disabled');
}

function checkIfNumUsed(usedNumbers, guess) {
	const isNumUsed = usedNumbers.findIndex(number => number === guess);
	// If the computer guesses a number that has already been used, ask "Are you sure...". This
	// makes it seem more human than a straight up computer algorithm.
	if (isNumUsed >= 0) {
		question.classList.add('exclamation');
		question.innerText = "Are you sure it isn't?";
		areYouSure = true;
	} else {
		if (areYouSure) {
			question.classList.remove('exclamation');
			areYouSure = false;
			question.innerText = 'Is this your secret number?';
		}
	}
}

function updateDisplay() {
	guessOutputEl.innerText = guess;
	remainingGuessesEl.innerText = guessesRemaining;
	guessesUsedEl.innerText = guessesUsed;
}

function displayRulesInModal() {
	modalHeaderEl.innerText = 'How To Play:';
	modalMessageEl.innerHTML = `
		<section id="rules">
      <div id="rules-list">
        <ul>
          <li>Think of any number between ${initMin} and ${initMax}. (Keep it to yourself).</li>
          <li>I will try to guess your number in ${
						initGuessesRemaining + 1
					} guesses or less.</li>
          <li>You win if I can't figure out your number within ${
						initGuessesRemaining + 1
					} guesses.</li>
          <li>If your number is higher than my guess, click the "Higher" button.</li>
          <li>If your number is lower than my guess, click the "Lower" button.</li>
          <li>If my guess is correct, click the "Correct" button.</li>
          <li>Be honest!</li>
        </ul>
			</div>
	`;
	toggleModalVisibility();
	rulesVisible = true;
}

function dismissRules() {
	const rules = document.getElementById('rules');
	rulesVisible = false;
	rules.remove();
}

function toggleModalVisibility() {
	if (!isModalVisible) {
		modalEl.classList.add('modal-enter');
		modalEl.classList.remove('modal-exit');
		backdropEl.classList.add('backdrop-enter');
		backdropEl.classList.remove('backdrop-exit');
		isModalVisible = true;
		if (rulesVisible) {
			dismissRules();
		}
	} else {
		modalEl.classList.add('modal-exit');
		modalEl.classList.remove('modal-enter');
		backdropEl.classList.add('backdrop-exit');
		backdropEl.classList.remove('backdrop-enter');
		modalMessageEl.classList.remove('exclamation');
		isModalVisible = false;
		if (rulesVisible) {
			dismissRules();
		}
		initialize(); // Re-initialize the game when modal is dismissed.
	}
}

btnHigherEl.addEventListener('click', higherHandler);
btnLowerEl.addEventListener('click', lowerHandler);
btnCorrectEl.addEventListener('click', correctHandler);
btnResetEl.addEventListener('click', resetGame);
btnRulesEl.addEventListener('click', displayRulesInModal);
backdropEl.addEventListener('click', toggleModalVisibility);
modalBtnEl.addEventListener('click', toggleModalVisibility);
