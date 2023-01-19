// Your code here
var trueOrFalseString = 'True or False: '

var questionsArr= [
    { question: trueOrFalseString + "Jump rope is a form of cardiovascular exercise.", answer: true},         
    { question: trueOrFalseString + 'Shoelaces keep your feet warm.', answer: false},
    { question: trueOrFalseString + 'The Xbox is made by Sony.', answer: false},
    { question: trueOrFalseString + 'Vodka is traditionally made with potatoes.', answer: true},
    { question: trueOrFalseString + 'Pikachu is yellow.', answer: true}
]

console.log(questionsArr)

function runQuiz() {
    var score = 0
    for(var i=0; i < questionsArr.length; i++){
        var userAnswer = confirm(questionsArr[i].question)
            if(userAnswer == questionsArr[i].answer) {
                score ++
        }
    }
    var percent = (score / questionsArr.length) * 100
    var roundedPercent = Math.round(percent)
    alert('You scored a ' + roundedPercent + " out of 100%!")
    }
