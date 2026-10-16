
const currentEl = document.getElementById("current");

let current = "";
let previous = null;
let operator = null;
let shouldReset = false;

function updateDisplay() {
  if (previous !== null && operator !== null && !shouldReset) {
    currentEl.textContent = previous + " " + operator + " " + current;
  } else if (previous !== null && operator !== null) {
    currentEl.textContent = previous + " " + operator;
  } else {
    currentEl.textContent = current || "";
  }
}
function inputNumber(num) {
  if (shouldReset) {
    current = num;
    shouldReset = false;
  } else {
    current = current === "" || current === "0" ? num : current + num;
  }
}

function inputDecimal() {
  if (shouldReset) {
    current = "0.";
    shouldReset = false;
    return;
  }
  if (!current.includes(".")) {
    current += ".";
  }
}

function setOperator(op) {
  if (operator !== null && !shouldReset) {
    calculate();
  }
  previous = current;
  operator = op;
  shouldReset = true;
}

function percent() {
  current = String(parseFloat(current) / 100);
}

function backspace() {
  if (shouldReset) return;
  current = current.length > 1 ? current.slice(0, -1) : "0";
}

function clearAll() {
  current = "";
  previous = null;
  operator = null;
  shouldReset = false;
}

function calculate() {
  const a = parseFloat(previous);
  const b = parseFloat(current);
  if (previous === null || operator === null || isNaN(a) || isNaN(b)) return;

  let result;
  switch (operator) {
    case "+": result = a + b; break;
    case "−": result = a - b; break;
    case "×": result = a * b; break;
    case "÷":
      if (b === 0) {
        current = "Error";
        previous = null;
        operator = null;
        shouldReset = true;
        return;
      }
      result = a / b;
      break;
  }
  current = String(Math.round(result * 1e10) / 1e10);
  previous = null;
  operator = null;
  shouldReset = true;
}

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.number) {
      inputNumber(btn.dataset.number);
    } else if (btn.dataset.operator) {
      setOperator(btn.dataset.operator);
    } else if (btn.dataset.action) {
      switch (btn.dataset.action) {
        case "decimal": inputDecimal(); break;
        case "percent": percent(); break;
        case "backspace": backspace(); break;
        case "clear": clearAll(); break;
        case "equals": calculate(); break;
      }
    }
    updateDisplay();
  });
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") inputNumber(e.key);
  else if (e.key === ".") inputDecimal();
  else if (e.key === "+") setOperator("+");
  else if (e.key === "-") setOperator("−");
  else if (e.key === "*") setOperator("×");
  else if (e.key === "/") setOperator("÷");
  else if (e.key === "Enter" || e.key === "=") calculate();
  else if (e.key === "Backspace") backspace();
  else if (e.key === "Escape") clearAll();
  else return;
  updateDisplay();
});

updateDisplay();