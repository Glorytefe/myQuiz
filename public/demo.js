const startBtn = document.querySelector(".start");
const circleInd = document.querySelector(".cc");
const question = document.querySelector(".que");
const options = document.querySelector(".questionsopt");
const innerMe = document.querySelector(".inner");
const circChil = document.querySelector(".circle");
const questbox = document.querySelector(".quest-box");
const resultBox = document.querySelector(".res");
const resultss = document.querySelector(".result");
const btns = document.querySelector(".btns");

const instructBox = document.querySelector(".instruction-box");
let quizcount = 0;
let correctAnswer = 0;
let attempt = 0;
let indCounter = 0;
let index = 0;
let currentQue;
let data;
let liDOM;
let availOpt = [];
class getQuestion {
  async getMe() {
    try {
      let apiQuest = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
      let questionres = await apiQuest.json();
      data = questionres.results;
      data = data.map((ques) => {
        let qtn = ques.question;
        let qtnType = ques.type;
        let answers = ques.correct_answer;
        let incorrect = ques.incorrect_answers;
        return { qtn, qtnType, answers, incorrect };
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
class displayQuestion {
  static displayQtn(data) {
    length = data.length;
    currentQue = data[index];
    innerMe.innerHTML = `<div>
          <h1 class="qq">Question ${index + 1} of ${length}</h1>
            <p class="que">${currentQue.qtn}</p>
        </div>`;
    index++;
    quizcount++;
    this.displayOption(data);
  }
  static displayOption(data) {
    let opts = [...currentQue.incorrect, currentQue.answers];
    let length = opts.length;

    let content = "";
    for (let i = 0; i < length; i++) {
      availOpt.push(i);
    }
    opts.forEach(() => {
      let randomOpt = availOpt[Math.floor(Math.random() * availOpt.length)];
      content += `<li class= "options" onclick="getResult(this)">${opts[randomOpt]}</li>`;
      let index1 = availOpt.indexOf(randomOpt);
      availOpt.splice(index1, 1);
    });
    options.innerHTML = content;
    let dela = 800;
    setTimeout(function () {
      btns.innerHTML = `<button class="btn start next" onclick="next()">Next</button>`;
    }, dela);
  }
}
function getResult(e) {
  let childrenOptns = [...options.children];
  liDOM = childrenOptns;
  let answe = currentQue.answers;
  if (e.innerText === answe) {
    e.classList.add("correct");
    updateind("correct");
    correctAnswer++;
  } else {
    e.classList.add("wrong");
    updateind("wrong");
    childrenOptns.forEach((childs) => {
      if (childs.textContent === answe) {
        childs.classList.add("correct");
        console.log(answe);
      }
    });
  }
  attempt++;
  unclick();
}
function unclick() {
  liDOM.forEach((li) => {
    li.classList.add("answered");
  });
}
function answerInd(data) {
  circleInd.innerHTML = "";
  let lens = data.length;
  for (let i = 0; i < lens; i++) {
    let divs = document.createElement("div");
    divs.className = "circle";
    circleInd.appendChild(divs);
  }
}
function updateind(indicator) {
  let lens = data.length;
  for (let i = 0; i < lens; i++) {
    circleInd.children[indCounter].classList.add(indicator);
  }
}
function next() {
  length = data.length;
  if (length === quizcount) {
    console.log("quiz over");
    displayResults(data);
    questbox.classList.add("hide");
    resultss.classList.remove("hide");
  } else {
    indCounter++;
    displayQuestion.displayQtn(data);
  }
}

function displayResults(data) {
  resultBox.innerHTML = "";
  let length = data.length;
  let wrongNo = attempt - correctAnswer;
  let scores = Math.floor((correctAnswer / length) * 100);
  let innerRes = "";
  innerRes += `<tr>
                <td>Total Question</td>
                <td><span class="tableque">${length}</span></td>
              </tr>
              <tr>
                <td>Attempt</td>
                <td><span class="tableatt">${attempt}</span></td>
              </tr>
              <tr>
                <td>Correct</td>
                <td><span class="tablecor">${correctAnswer}</span></td>
              </tr>
              <tr>
                <td>Wrong</td>
                <td><span class="tablewro">${wrongNo}</span></td>
              </tr>
              <tr>
                <td>Percentage</td>
                <td><span class="tableper">${scores}%</span></td>
              </tr>
              <tr>
                <td>Your Total Score</td>
                <td><span class="tableyou">${correctAnswer}/${length}</span></td>
              </tr>`;
  resultBox.innerHTML = innerRes;
}
function resetQuiz() {
  quizcount = 0;
  correctAnswer = 0;
  attempt = 0;
  indCounter = 0;
  index = 0;
}
function gohome() {
  resetQuiz();
  questbox.classList.add("hide");
  instructBox.classList.remove("hide");
  resultss.classList.add("hide");
}
function tryAgain() {
  questbox.classList.remove("hide");
  instructBox.classList.add("hide");
  resultss.classList.add("hide");
  resetQuiz();
  start();
}
function start() {
  const questionget = new getQuestion();
  questbox.classList.remove("hide");
  instructBox.classList.add("hide");
  questionget.getMe().then((data) => {
    displayQuestion.displayQtn(data);
    answerInd(data);
  });
}
