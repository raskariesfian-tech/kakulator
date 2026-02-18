const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');

function lastChar() {
  return display.value.slice(-1);
}

function isOperator(ch) {
  return ch === '+' || ch === '-' || ch === '×' || ch === '÷';
}

function appendOperator(op) {
  if (!display.value) {
    if (op === '-') { // allow leading negative
      display.value = '-';
    }
    return;
  }
  const last = lastChar();
  if (isOperator(last)) {
    display.value = display.value.slice(0, -1) + op; // replace operator
  } else {
    display.value += op;
  }
}

function appendDigitOrDot(ch) {
  if (ch === '.') {
    // find last operator position to get the current number
    const lastOpIndex = Math.max(
      display.value.lastIndexOf('+'),
      display.value.lastIndexOf('-'),
      display.value.lastIndexOf('×'),
      display.value.lastIndexOf('÷')
    );
    const currentNumber = display.value.slice(lastOpIndex + 1);
    if (currentNumber.includes('.')) return; // already has a dot
    if (currentNumber === '') display.value += '0.'; else display.value += '.';
    return;
  }
  display.value += ch;
}

buttons.addEventListener('click', e => {
  if (!e.target.matches('button')) return;
  const action = e.target.dataset.action;
  const text = e.target.textContent;

  if (action === 'clear') {
    display.value = '';
    return;
  }

  if (action === 'back') {
    display.value = display.value.slice(0, -1);
    return;
  }

  if (action === 'equals') {
    try {
      const expr = display.value.replace(/×/g, '*').replace(/÷/g, '/');
      const result = Function('return (' + expr + ')')();
      if (result === Infinity || Number.isNaN(result)) throw new Error('Invalid');
      display.value = String(result);
    } catch (err) {
      display.value = 'Error';
      setTimeout(() => (display.value = ''), 1200);
    }
    return;
  }

  if (action === 'add') return appendOperator('+');
  if (action === 'subtract') return appendOperator('-');
  if (action === 'multiply') return appendOperator('×');
  if (action === 'divide') return appendOperator('÷');

  // Default: numbers and dot
  appendDigitOrDot(text);
});

// Optional: keyboard support (reuses append helpers)
window.addEventListener('keydown', e => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    appendDigitOrDot(e.key);
    return;
  }
  if (e.key === 'Backspace') {
    display.value = display.value.slice(0, -1);
    return;
  }
  if (e.key === 'Enter' || e.key === '=') {
    buttons.querySelector('[data-action="equals"]').click();
    return;
  }
  if (e.key === '+') return appendOperator('+');
  if (e.key === '-') return appendOperator('-');
  if (e.key === '*') return appendOperator('×');
  if (e.key === '/') return appendOperator('÷');
});
