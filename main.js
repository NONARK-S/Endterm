const die = document.getElementById('die');
if (die) {
  const num = document.getElementById('die-num');
  const msg = document.getElementById('roll-msg');
  const log = document.getElementById('roll-log');
  const history = [];
  die.addEventListener('click', () => {
    const result = Math.floor(Math.random() * 20) + 1;
    die.classList.remove('rolling', 'nat20', 'nat1');
    void die.offsetWidth;
    die.classList.add('rolling');
    setTimeout(() => {
      num.textContent = result;
      if (result === 20) { die.classList.add('nat20'); msg.textContent = 'Natural 20! A critical hit.'; }
      else if (result === 1) { die.classList.add('nat1'); msg.textContent = 'Natural 1. Critical miss.'; }
      else { msg.textContent = 'You rolled ' + result + '.'; }
      history.unshift(result);
      log.textContent = 'Recent rolls: ' + history.slice(0, 6).join(', ');
    }, 400);
  });
}