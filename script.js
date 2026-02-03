(() => {
  console.log('Calculator script loaded');
  const displayEl = document.getElementById('display');
  const keys = Array.from(document.querySelectorAll('.key'));
  let expression = '';

  function updateDisplay() {
    displayEl.textContent = expression || '0';
  }

  function clearAll() {
    expression = '';
    updateDisplay();
  }

  function del() {
    expression = expression.slice(0, -1);
    updateDisplay();
  }

  function append(v) {
    // prevent multiple leading zeros
    if (v === '.' && expression.slice(-1) === '.') return;
    expression += v;
    updateDisplay();
  }

  function evaluate() {
    if (!expression) return;
    try {
      // convert percent usages like 50% -> (50/100)
      const sanitized = expression.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
      // evaluate safely using Function
      // allow only 0-9 operators and parentheses and dot
      const safe = sanitized.replace(/[^0-9+\-*/().% ]/g, '');
      const result = Function('return ' + safe)();
      expression = String(result);
      updateDisplay();
    } catch (e) {
      expression = '';
      displayEl.textContent = 'Error';
    }
  }

  keys.forEach(k => {
    k.addEventListener('click', () => {
      const v = k.dataset.value;
      const action = k.dataset.action;
      if (action === 'clear') return clearAll();
      if (action === 'del') return del();
      if (action === 'equals') return evaluate();
      if (v != null) return append(v);
    });
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); return evaluate(); }
    if (e.key === 'Backspace') { e.preventDefault(); return del(); }
    if (e.key === 'Escape') { e.preventDefault(); return clearAll(); }
    if (/^[0-9]$/.test(e.key)) { append(e.key); return; }
    if (['+','-','*','/','.','%','(',')'].includes(e.key)) { append(e.key); return; }
  });

  // initial
  updateDisplay();
})();
