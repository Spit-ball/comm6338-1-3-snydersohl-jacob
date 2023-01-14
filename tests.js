const head = document.querySelector('head')
const body = document.querySelector('body')

// mocha CSS link
const mochaCSSPath = "https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.2/mocha.min.css"
const mochaCSSLinkEl = document.createElement('link')
mochaCSSLinkEl.rel = 'stylesheet'
mochaCSSLinkEl.href = mochaCSSPath
head.prepend(mochaCSSLinkEl)

// custom styles for mocha runner
const mochaStyleEl = document.createElement('style')
mochaStyleEl.innerHTML =
  `#mocha {
    font-family: sans-serif;
    position: fixed;
    overflow-y: auto;
    z-index: 1000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 48px 0 96px;
    background: white;
    color: black;
    display: none;
    margin: 0;
  }
  #mocha * {
    letter-spacing: normal;
    text-align: left;
  }
  #mocha .replay {
    pointer-events: none;
  }
  #mocha-test-btn {
    position: fixed;
    bottom: 50px;
    right: 50px;
    z-index: 1001;
    background-color: #007147;
    border: #009960 2px solid;
    color: white;
    font-size: initial;
    border-radius: 4px;
    padding: 12px 24px;
    transition: 200ms;
    cursor: pointer;
  }
  #mocha-test-btn:hover:not(:disabled) {
    background-color: #009960;
  }
  #mocha-test-btn:disabled {
    background-color: grey;
    border-color: grey;
    cursor: initial;
    opacity: 0.7;
  }`
head.appendChild(mochaStyleEl)

// mocha div
const mochaDiv = document.createElement('div')
mochaDiv.id = 'mocha'
body.appendChild(mochaDiv)

// run tests button
const testBtn = document.createElement('button')
testBtn.textContent = "Loading Tests"
testBtn.id = 'mocha-test-btn'
testBtn.disabled = true
body.appendChild(testBtn)

const scriptPaths = [
  "https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.2/mocha.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/chai/4.3.4/chai.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/sinon.js/10.0.1/sinon.min.js",
  // "jsdom.js" // npx browserify _jsdom.js --standalone JSDOM -o jsdom.js
]
const scriptTags = scriptPaths.map(path => {
  const scriptTag = document.createElement('script')
  scriptTag.type = 'text/javascript'
  scriptTag.src = path
  return scriptTag
})

let loaded = 0
if (localStorage.getItem('test-run')) {
  // lazy load test dependencies
  scriptTags.forEach(tag => {
    body.appendChild(tag)
    tag.onload = function () {
      if (loaded !== scriptTags.length - 1) {
        loaded++
        return
      }
      testBtn.textContent = 'Run Tests'
      testBtn.disabled = false
      testBtn.onclick = __handleClick
      runTests()
    }
  })
} else {
  testBtn.textContent = 'Run Tests'
  testBtn.disabled = false
  testBtn.onclick = __handleClick
}

function __handleClick() {
  if (!localStorage.getItem('test-run') && this.textContent === 'Run Tests') {
    localStorage.setItem('test-run', true)
  } else {
    localStorage.removeItem('test-run')
  }
  window.location.reload()
}

function runTests() {
  testBtn.textContent = 'Running Tests'
  testBtn.disabled = true
  mochaDiv.style.display = 'block'
  body.style.overflow = 'hidden'

  mocha.setup("bdd");
  const expect = chai.expect;

  describe("Quiz Assignment", function () {
    let runQuizFn
    let alertStub
    let confirmStub
    beforeEach(() => {
      if (runQuiz)
        runQuizFn = sinon.spy(window, 'runQuiz')
      alertStub = sinon.stub(window, 'alert')
      confirmStub = sinon.stub(window, 'confirm').returns(true)
    })
    afterEach(() => {
      sinon.restore()
    })
    after(() => {
      testBtn.textContent = 'Close Tests'
      testBtn.disabled = false
    })
    describe('Setup', () => {
      it('Should have start quiz button', function () {
        const quizBtn = document.getElementById('start-quiz')
        expect(quizBtn).to.not.be.null
      })
      it('runQuiz function should be declared properly', () => {
        expect(runQuiz).to.exist
        expect(typeof runQuiz).to.eq('function')
      })
      it('Quiz button should run quiz', function () {
        const quizBtn = document.getElementById('start-quiz')
        expect(quizBtn).to.not.be.null
        quizBtn.click()
        expect(runQuizFn.called).to.be.true
      })
      it('questionsArr should be declared and be an array', () => {
        expect(questionsArr).to.exist
        expect(Array.isArray(questionsArr)).to.be.true
      })
      it('questionsArr should contain only objects', () => {
        expect(questionsArr).to.exist
        expect(Array.isArray(questionsArr)).to.be.true
        expect(questionsArr.length >= 1).to.be.true
        questionsArr.every(question => expect(typeof question).to.eq('object'))
      })
      it('question objects should have question properties that are strings', () => {
        expect(questionsArr).to.exist
        expect(Array.isArray(questionsArr)).to.be.true
        expect(questionsArr.length >= 1).to.be.true
        questionsArr.every(question => {
          expect(question).to.have.property('question')
          expect(typeof question.question).to.eq('string')
        })
      })
      it('question objects should have answer properties that are boolean', () => {
        expect(questionsArr).to.exist
        expect(Array.isArray(questionsArr)).to.be.true
        expect(questionsArr.length >= 1).to.be.true
        questionsArr.every(question => {
          expect(question).to.have.property('answer')
          expect(typeof question.answer).to.eq('boolean')
        })
      })
      it('questionsArr should have at least five question objects', () => {
        expect(questionsArr).to.exist
        expect(Array.isArray(questionsArr)).to.be.true
        expect(questionsArr.length >= 5).to.be.true
      })
    })
    describe('Quiz behavior', () => {
      it('should ask at least five questions', () => {
        document.getElementById('start-quiz').click()
        expect(confirmStub.callCount >= 5).to.be.true
      })
      it('last alert should contain score', () => {
        document.getElementById('start-quiz').click()
        expect(alertStub.called).to.be.true
        expect(/\d{2,3}%/g.test(alertStub.lastCall.args[0])).to.be.true
      })
      it('answering all questions correctly should score 100%', () => {
        sinon
        .stub(window, 'questionsArr')
        .value(new Array(5).fill({ question: "", answer: true }))
        document.getElementById('start-quiz').click()
        expect(/100%/g.test(alertStub.lastCall.args[0])).to.be.true
      })
      it('answering no questions correctly should score 0%', () => {
        sinon
          .stub(window, 'questionsArr')
          .value(new Array(5).fill({ question: "", answer: false }))
        document.getElementById('start-quiz').click()
        expect(/0%/g.test(alertStub.lastCall.args[0])).to.be.true
      })
      it('should round score percentage to whole number', () => {
        const stubbedQuestions = new Array(3).fill({ question: "", answer: true })
        stubbedQuestions[2] = {question: "", answer: false}
        sinon
          .stub(window, 'questionsArr')
          .value(stubbedQuestions)
          document.getElementById('start-quiz').click()
          console.log(alertStub.lastCall.args[0])
        expect(/6[67]%/g.test(alertStub.lastCall.args[0])).to.be.true
      })
    })
  });

  mocha.run();
}