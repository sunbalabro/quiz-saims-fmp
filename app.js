// Firebase Configuration
var firebaseConfig = {
    apiKey: "AIzaSyCsPsSuGDqSz05Kew_nqK2t62F8LWQJgDQ",
    authDomain: "quiz-app-saims.firebaseapp.com",
    databaseURL: "https://quiz-app-saims-default-rtdb.firebaseio.com",
    projectId: "quiz-app-saims",
    storageBucket: "quiz-app-saims.appspot.com",
    messagingSenderId: "1093840549758",
    appId: "1:1093840549758:web:12e80356c79f072a02652f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Functional Constructor For Quiz Object
function Quiz(questions, startTime) {
    var userName = prompt("Please Enter You Name");
    this.score = 0;
    this.questions = questions;
    this.questionIndex = 0;
    this.qindex = 1;
    this.startTime = startTime;
    this.userName = userName;
}
// Prototype for Getting Question Index
Quiz.prototype.getQuestionIndex = function () {
    return this.questions[this.questionIndex]
}
// Prototype To Check The Quiz is Ended Or Not
Quiz.prototype.isEnded = function () {
    return this.questions.length === this.qindex - 1;
}
// Prototype To Check The Answer and Increment the Score
Quiz.prototype.guess = function (answer) {
    console.log(this.questionIndex)
    if (this.getQuestionIndex().correctAnswer(answer)) {
        this.score++;
    }
    this.questionIndex++;
    this.qindex++;
}
// Functional Constructor For A Single Question Object
function Question(text, choices, answer) {
    this.text = text;
    this.choices = choices;
    this.answer = answer;
}
// Prototype To Check The Correct Answer
Question.prototype.correctAnswer = function (choices) {
    return choices === this.answer;
}
// Function to Start the Game
function populate() {
    if (quiz.isEnded()) {
        var finishTime = new Date().toISOString();
        showScore(finishTime);
        storeScore(finishTime);
    }
    else {
        // show question
        var element = document.getElementById("question");
        element.innerHTML = quiz.getQuestionIndex().text;
        // show choices 
        var choices = quiz.getQuestionIndex().choices;
        for (var i = 0; i < choices.length; i++) {
            var element = document.getElementById("choice" + i);
            element.innerHTML = choices[i];
            guess("btn" + i, choices[i]);
        }
        showProgress();
    }
};
// Function for the Quz Option Buttom to Guess Answer
function guess(id, guess) {
    var button = document.getElementById(id);
    button.onclick = function () {
        quiz.guess(guess);
        populate();
    }
};
// Funciton To show Progress Of the Quiz
function showProgress() {
    console.log(quiz)
    var currentQuestionNumber = quiz.qindex;
    var element = document.getElementById("progress");
    element.innerHTML = "Question" + currentQuestionNumber + "of " + quiz.questions.length;
};
// Funciton To show Score Of the Quiz
function showScore(finishTime) {
    var gameOverHTML = "<h1>Result</h1>"
    gameOverHTML += "<h2 id ='score'>" + quiz.userName + ", Your scores : " + quiz.score + "</h2><h3>Quiz Started At : " + new Date(quiz.startTime).toString() + " <br /> Ended At " +  new Date(finishTime).toString() + "</h3>";
    var element = document.getElementById("quiz");
    element.innerHTML = gameOverHTML;
};
// Function To Store the Quiz Result or Score
function storeScore(finishTime) {
    firebase.database().ref("/app/quiz/results").push({
        username: quiz.userName ? quiz.userName : "unknown",
        score: quiz.score,
        startTime: quiz.startTime,
        endTime: finishTime
    }).then(() => {
        console.log("Successfully Saved Score");
    }).catch((err) => {
        console.log(err);
        console.log("Something Went Wrong At Saving Score");
    })
}
// Questions Object
var questions = [
    new Question("Which one is not an object oriented programming language?", ["Java", "C#", "C++", "C"], "C"),
    new Question("Which language is used for styling web pages?", ["HTML", "JQuery", "CSS", "XML"], "CSS"),
    new Question("There are _________ main components  of  object oriented programming?", ["1", "6", "2", "4"], "4"),
    new Question("Which language is used for web apps?", ["PHP", "Python", "Javascript", "All"], "All"),
    new Question("MVC is a _________ ?", ["Language", "Library", "Framework", "All"], "Framework"),

];
var currentTime = new Date().toISOString();
var quiz = new Quiz(questions, currentTime);

populate();