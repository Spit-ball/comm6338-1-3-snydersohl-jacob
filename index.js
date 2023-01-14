// Your code here
var trueOrFalseString = 'True or False: '
var userAnswer = 0
var score = 0

var questionsArr= [
    { question: trueOrFalseString + "Jump rope is a form of cardiovascular exercise.", answer: true},         
    { question: trueOrFalseString + 'Shoelaces keep your feet warm.', answer: false},
    { question: trueOrFalseString + 'The Xbox is made by Sony.', answer: false},
    { question: trueOrFalseString + 'Vodka is traditionally made with potatoes.', answer: true},
    { question: trueOrFalseString + 'Pikachu is yellow.', answer: true}
]

console.log(questionsArr)

function runQuiz() {
    for(var i=0; i < questionsArr.length; i++){

        userAnswer = confirm(questionsArr[i].question)
            if(userAnswer == questionsArr[i].answer) {
                score += 20
            } else {
                score -+ 20
            }
        }
        alert('You scored a ' + (score / 100) * 100 + " out of 100!")
        location.reload(true)
    }
