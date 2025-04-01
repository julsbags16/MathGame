let username = "";
let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let difficulty = "";
let questionsEasy = [
    { question: "Sarah has 58 apples and buys 24 more. How many does she have?", answers: ["82", "78", "84", "80"], correct: 0, image: 'Assets/apple.jpg' },
    { question: "John was reading a book with 120 pages. He has read 37. How many pages left?", answers: ["83", "80", "75", "79"], correct: 0, image: 'Assets/book.jpg'  },
    { question: "Convert 7/10 into a decimal.", answers: ["0.7", "0.07", "7.1", "0.77"], correct: 0, image: 'Assets/decimal.png'  },
    { question: "Lisa scored 85 out of 100. What percentage is that?", answers: ["85%", "80%", "75%", "90%"], correct: 0, image: 'Assets/percent.jpg'  },
    { question: "A recipe calls for 3/4 cup of sugar. How many times will you fill a 1/4 cup?", answers: ["3", "2", "4", "3.5"], correct: 0, image: 'Assets/cup.jpg'  },
    { question: "In a game of basketball, your team scores 87 points, and the opposing team scores 65 points. What is the point difference?", answers: ["22", "15", "25", "20"], correct: 0, image: 'Assets/ball.jpg'  },
    { question: "The price of a mango is ₱15. How much would 6 mangoes cost?", answers: ["₱90", "₱100", "₱85", "₱95"], correct: 0, image: 'Assets/mango.jpg'  },
    { question: "A jeepney carries 20 passengers. If 5 jeepneys are full, how many passengers are there in total?", answers: ["100", "95", "110", "105"], correct: 0, image: 'Assets/Jeep.jpg'  },
    { question: "If a barangay has 500 families and 200 families have children, what percentage of families have children?", answers: ["40%", "30%", "50%", "60%"], correct: 0, image: 'Assets/children.jpg'  },
    { question: "A rice field measures 100 square meters. If a farmer plants rice in 4 such fields, what is the total area planted?", answers: ["400 square meters", "350 square meters", "450 square meters", "500 square meters"], correct: 0, image: 'Assets/rice.jpg'  },
];

let questionsHard = [
    { question: "If 3/4 of a chocolate bar weighs 100 grams, how much does the whole bar weigh?", answers: ["133.33 grams", "125 grams", "120 grams", "150 grams"], correct: 0, image: 'https://via.placeholder.com/300x200?text=Chocolate+Image' },
    { question: "If a tree grows 2.5 meters every year, how many meters will it grow in 8 years?", answers: ["20 meters", "18 meters", "22 meters", "16 meters"], correct: 0, image: 'https://via.placeholder.com/300x200?text=Tree+Image' },
    // More questions...
];

function selectDifficulty() {
    username = document.getElementById("username").value;
    if (!username) {
        alert("Please enter your username.");
        return;
    }
    document.getElementById('username-entry').classList.add('hidden');
    document.getElementById('difficulty-selection').classList.remove('hidden');
}

let timeLimit;

function startQuiz(level) {
    difficulty = level;
    // Set time limit based on the difficulty level
    if (difficulty === "easy") {
        timeLimit = 51; // 30 seconds for easy
    } else if (difficulty === "hard") {
        timeLimit = 31; // 20 seconds for hard
    }

    document.getElementById('difficulty-selection').classList.add('hidden');
    document.getElementById('quiz').classList.remove('hidden');
    currentQuestion = 0;
    score = 0;
    timeLeft = timeLimit;  // Use the dynamic time limit
    document.getElementById("score").innerText = "Score: 0";
    document.getElementById("question-number").innerText = currentQuestion + 1;
    loadQuestion();
    startTimer();  // Start the timer with the dynamic time limit
}


function loadQuestion() {
    let questionData = (difficulty === "easy") ? questionsEasy : questionsHard;
    let question = questionData[currentQuestion];
    document.getElementById('question-text').innerText = question.question;
    let options = shuffleArray([...question.answers]);
    let optionsHTML = options.map((opt, index) => ` 
        <button onclick="checkAnswer(${index})" class="bg-blue-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition transform hover:scale-105">${opt}</button>
    `).join('');
    document.getElementById('options').innerHTML = optionsHTML;
    document.getElementById('question-image').src = question.image;  // Set the image dynamically
}

function checkAnswer(selected) {
    let questionData = (difficulty === "easy") ? questionsEasy : questionsHard;
    let correctIndex = questionData[currentQuestion].correct;
    if (selected === correctIndex) {
        score++;
    }
    currentQuestion++;
    if (currentQuestion < 10) {
        document.getElementById("question-number").innerText = currentQuestion + 1;
        loadQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    clearInterval(timerInterval);  // Clear the existing timer
    document.getElementById("quiz").classList.add('hidden');
    document.getElementById("results").classList.remove('hidden');
    document.getElementById("score").innerText = `Your score is ${score} out of 10!`;
    saveScore();
}


function saveScore() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ username, score, difficulty });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function viewLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    let easyLeaderboard = leaderboard.filter(entry => entry.difficulty === 'easy');
    let hardLeaderboard = leaderboard.filter(entry => entry.difficulty === 'hard');
    let easyHTML = easyLeaderboard.map(entry => `<li class="text-lg">${entry.username} - ${entry.score}</li>`).join('');
    let hardHTML = hardLeaderboard.map(entry => `<li class="text-lg">${entry.username} - ${entry.score}</li>`).join('');
    document.getElementById('easy-leaderboard').innerHTML = easyHTML;
    document.getElementById('hard-leaderboard').innerHTML = hardHTML;
    document.getElementById("results").classList.add('hidden');
    document.getElementById("leaderboard").classList.remove('hidden');
}

function goBackToResults() {
    document.getElementById("leaderboard").classList.add('hidden');
    document.getElementById("results").classList.remove('hidden');
}

function restartQuiz() {
    clearInterval(timerInterval);  // Clear the existing timer
    
    // Reset timeLeft based on the current difficulty
    if (difficulty === "easy") {
        timeLeft = 51; // 30 seconds for easy
    } else if (difficulty === "hard") {
        timeLeft = 31; // 20 seconds for hard
    }

    document.getElementById("results").classList.add('hidden');
    document.getElementById("quiz").classList.remove('hidden');
    currentQuestion = 0;
    score = 0;
    document.getElementById("score").innerText = "Score: 0";
    document.getElementById("question-number").innerText = currentQuestion + 1;
    loadQuestion();  // Load the first question
    startTimer();    // Start the timer again with the correct time limit
}



function pauseGame() {
    gamePaused = true;
    clearInterval(timerInterval);
    document.getElementById("pause-screen").classList.remove('hidden');
}

function resumeGame() {
    gamePaused = false;
    document.getElementById("pause-screen").classList.add('hidden');
    startTimer();
}

function exitGame() {
    clearInterval(timerInterval);
    document.getElementById("pause-screen").classList.add('hidden'); // Hide pause screen on exit
    document.getElementById("quiz").classList.add('hidden');
    document.getElementById("results").classList.add('hidden');
    document.getElementById("leaderboard").classList.add('hidden');
    document.getElementById('username-entry').classList.remove('hidden'); // Show username entry screen
    document.getElementById("username").value = '';
    gamePaused = false;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;
        if (timeLeft === 0) {
            endQuiz();
        }
    }, 1000);
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
