const inputTxt = document.calc.txt
const inputTxtPrev = document.querySelector(".calc__txt__prev")
const calcKeys = document.querySelectorAll(".calc__key")
const numberKeys = document.querySelectorAll(".key__number")
const operatorsKeys = document.querySelectorAll(".key__operator")
const calcPercent = document.querySelector(".key__percent")
const calcDot = document.querySelector(".key__dot")

function inputToRight() {
    const width = inputTxt.clientWidth
    const scrollwidth = inputTxt.scrollWidth
    if (scrollwidth >= width) inputTxt.scroll(scrollwidth, 0)
}

document.calc.addEventListener("reset", () => inputTxtPrev.textContent = "")

calcKeys.forEach(calcKey => {
    calcKey.addEventListener("click", e => {
        switch (e.target.textContent) {
            case "DEL":
                inputTxt.value === "Error!" ? setInputValue("") : null
                delLastStr()
                !inputTxt.value ? inputTxtPrev.textContent = "" : null
                break;
            case "=":
                if (inputTxt.value && !handleLastOperator()) {
                    try {
                        inputTxtPrev.textContent = inputTxt.value + "="
                        replaceOperators()
                        console.log(inputTxt.value)
                        setInputValue(eval(inputTxt.value))
                    } catch (err) {
                        setInputValue("Error!")
                    }
                    inputTxt.value === "Error!" ? inputTxtPrev.textContent = "" : null
                }
                break;
            default:
                inputTxt.value === "Error!" || inputTxt.value === "0" ? setInputValue("") : null
                setInputValue(e.target.textContent, "add")
        }
        inputToRight()
    })
})
function setInputValue(value, add = null) {
    add ? inputTxt.value += value : inputTxt.value = value
}

window.addEventListener("keydown", e => {
    try {
        keyPressed = document.querySelector(`[data-key="${e.key}"]`)
    } catch { return }
    if (keyPressed) {
        keyPressed.click()
        addActiveKey(keyPressed)
    }
})
window.addEventListener("keyup", RemoveActiveKey)
function addActiveKey(element = Element) {
    element.classList.add("active")
}
function RemoveActiveKey() {
    const active = document.querySelectorAll(".calc__key.active")
    active ? active.forEach(x => x.classList.remove("active")) : null
}

function delLastStr() {
    setInputValue(inputTxt.value.slice(0, -1))
}

function replaceOperators() {
    if (inputTxt.value.includes("%")) {
        replacePercentOperations()
        setInputValue(inputTxt.value.replaceAll("%", "/100"))
    }
    setInputValue(inputTxt.value.replaceAll("×", "*"))
    setInputValue(inputTxt.value.replaceAll("÷", "/"))
}
function replacePercentOperations() {
    let percents = inputTxt.value.match(/\d+%/g)
    if (inputTxt.value.includes("-") || inputTxt.value.includes("+")) {
        let indexPo = 0
        percents.forEach(percent => {
            const index = inputTxt.value.indexOf(percent, indexPo)
            let prev = inputTxt.value[index - 1]
            let prevPrev = inputTxt.value[index - 2]
            if ((prev === "+" || prev === "-") && !isNaN(Number(prevPrev))) {
                const str = inputTxt.value.slice(indexPo, index + percent.length)
                const strNumbers = str.match(/\d+\.?\d*/g)
                let number = strNumbers[strNumbers.length - 2]
                // let numberPercent = strNumbers[strNumbers.length - 1]
                let replaceTxt = `${prev}${number}*`
                setInputValue(inputTxt.value.replace(inputTxt.value[index - 1], replaceTxt))
            } /* else  console.log("NOOOOOOOOOOOU") */ //Porcentaje sin operacion "+" o "-"
            indexPo = index + 1 //Para no repetir index en el caso que hayan iguales (percent)
        })
    }
}



/* VALIDATORS */
function handleLastOperator() {
    const last = inputTxt.value.slice(-1)
    if (last === ".") return true
    for (let i = 0; i < operatorsKeys.length; i++) {
        let logic = operatorsKeys[i].textContent === last
        if (logic) return logic
    }
}

calcDot.addEventListener("click", handleDot)
function handleDot(e) {
    let { prev, current } = finPrevAndCurrent(inputTxt.value, e.target.textContent)
    if (prev === current) delLastStr()
    if (!prev) setInputValue("0" + current)
    let subValues = inputTxt.value.split(".")
    if (subValues.length > 2) {
        let count = 0;
        operatorsKeys.forEach(operator => {
            !subValues[subValues.length - 2].includes(operator.textContent) ? count += 1 : null
        })
        count >= operatorsKeys.length ? delLastStr() : null //Para solo llamar una vez
    }
}

operatorsKeys.forEach(calcKey => calcKey.addEventListener("click", handleOperator))
calcPercent.addEventListener("click", handleOperator)
function handleOperator(e) {
    const operatorKey = e.target
    let { prev, current } = finPrevAndCurrent(inputTxt.value, operatorKey.textContent)
    if (!prev && current !== "-") {
        setInputValue("0" + current)
    } else {
        if (current === prev) { //No repetir operador varias veces
            delLastStr()
        } else {
            if ((current === "×" || current === "÷") && (prev === "-" || prev === "+")) {
                prevAndCurrentOperators(prev, current)
            }
            if ((current === "×" && prev === "÷") || (current === "÷" && prev === "×")) {
                prevAndCurrentOperators(prev, current)
            }
            if ((current === "+" && prev === "-") || (current === "-" && prev === "+")) {
                prevAndCurrentOperators(prev, current)
            }
            if ((current === "%") && (prev === "×" || prev === "÷")) {
                prevAndCurrentOperators(prev, current)
            }
            if ((current === "%") && (prev === "-" || prev === "+" || prev === ".")) delLastStr()
        }
    }
    function prevAndCurrentOperators(prev, current) { // Es mas de replace
        indexPrev = inputTxt.value.indexOf(prev, inputTxt.value.length - 2) //find in last
        let inputValid = inputTxt.value.slice(0, indexPrev) + current

        const prevPrev = inputTxt.value[indexPrev - 1]
        if (((current === "×" || current === "÷") && (prevPrev === "×" || prevPrev === "÷")) || ((current === "%") && (prevPrev === "%"))) {
            inputValid = inputTxt.value.slice(0, -1)
        }
        setInputValue(inputValid)
    }
}

function finPrevAndCurrent(string = String, char = String) {
    const index = string.lastIndexOf(char)
    let current = char
    let prev = string[index - 1]
    return { current, prev }
}

numberKeys.forEach(numberKey => numberKey.addEventListener("click", handlePrevPercent))
calcDot.addEventListener("click", handlePrevPercent)
function handlePrevPercent(e) {
    if (inputTxt.value.slice(-2, -1) === "%") { //antepenultimo
        setInputValue(inputTxt.value.slice(0, -1) + "×" + e.target.textContent)
    }
}
