const allCalcButtons = document.querySelectorAll(".button");
const layout = document.querySelector("#slider");

const equation = document.querySelector("#equation");
const results = document.querySelector("#result");

let a;
let b;
let equationLength;
let operationInUse = "none";
let calculationRunning = false;
let answerGiven = false;
let isSpecial = false;

layout.addEventListener("click", changeLayout);

const clear = document.querySelector("#clear");
clear.addEventListener("click", function() {
    a = b = undefined;
    operationInUse = "none";
    equation.textContent = "";
    results.textContent = "";
    answerGiven = false;
    isSpecial = false;
});

const backspace = document.querySelector("#backspace");
backspace.addEventListener("click", function() {
    let backspaced = results.textContent.slice(0, -1);
    results.textContent = `${backspaced}`;
});

const numbers = document.querySelectorAll(".number");
for (let i = 0; i < numbers.length; i++) {
    numbers[i].addEventListener("click", function() {
        if(answerGiven) {
            clear.click();
        }
        equation.textContent += numbers[i].value;
    });
}

const simpleOperations = document.querySelectorAll(".operation");
for (let i = 0; i < simpleOperations.length; i++) {
    simpleOperations[i].addEventListener("click", function() {
        operationInUse = simpleOperations[i].value;

        if (chainingOperations()) {
            equation.textContent += `${results.textContent} ${operationInUse} `;
            results.textContent = "";
            
            answerGiven = false;
            calculationRunning = true;
            equationLength = equation.textContent.length;
            return;
        }
        
        if (calculationRunning) {
            equation.textContent = equation.textContent.slice(0, -3);
        }

        calculationRunning = true;
        equation.textContent += ` ${operationInUse} `;
        equationLength = equation.textContent.length;
    });
}

const equals = document.querySelector("#equals");
equals.addEventListener("click", function() {
    // clicking = with answer showing does not increment
    if (answerGiven) {
        return;
    }

    // prevent normal = function for special operation syntax
    if (isSpecial) {
        // doSpecialOperation();
        return;
    }

    if (operationInUse === "none") {
        results.textContent = `${parseFloat(equation.textContent)}`;
        equation.textContent = "";
        answerGiven = true;
        calculationRunning = false;  
        return;
    }

    a = parseFloat(equation.textContent);
    b = parseFloat(equation.textContent.slice(equationLength));
    equation.textContent = "";
    
    let answer = isFloat(a, b) ? calculateWithFloat(a, b) : calculate(a, b);
    if (hasManyDecimals(answer)) {
        answer = Math.round(answer * 100000) / 100000;
    }

    results.textContent = `${answer}`;

    answerGiven = true;
    calculationRunning = false;
});


function chainingOperations() {
    return (equation.textContent === "" && results.textContent !== "");
}

function isFloat(a, b) {
    return (a % 1 !== 0 || b % 1 !== 0);
}

function hasManyDecimals(n) {
    return (n * 100000) % 1 !== 0;
}

function calculate(a, b) {
    return (operationInUse === "\u{000D7}") ? a * b
         : (operationInUse === "\u{000F7}") ? a / b
         : (operationInUse === "\u{0002B}") ? a + b
         : (operationInUse === "\u{02212}") ? a - b
         : parseFloat(results.textContent);
}

function calculateWithFloat(a, b) {
    const CF = 1000000;
    return (operationInUse === "\u{000D7}") ? (a * CF) * (b * CF) / (CF ** 2)
         : (operationInUse === "\u{000F7}") ? (a * CF) / (b * CF)
         : (operationInUse === "\u{0002B}") ? ((a * CF) + (b * CF)) / CF
         : (operationInUse === "\u{02212}") ? (a * CF) - (b * CF) / CF
         : parseFloat(results.textContent);
}

function changeLayout() {
    const extraButtons = document.querySelectorAll(".extra");
    extraButtons.forEach(extraButton => extraButton.classList.toggle("hidden"));

    allCalcButtons.forEach(button => {
        button.classList.toggle("basic");
        button.classList.toggle("extended");
    });

    toggleSlider();
}

function toggleSlider() {
    layout.classList.toggle("on");
    layout.firstChild.src = layout.classList.contains("on") ? "./images/ext-on.png" : "./images/ext-off.png";
}