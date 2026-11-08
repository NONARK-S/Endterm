(function () {
  'use strict';

  const mapEl = document.getElementById('battle-map');
  if (!mapEl) return;

  const COLS = 12;
  const ROWS = 8;

  /* ------------------------------------------------------------
     TOKENS - change "src" to swap an image.
     Example: src: 'img/my-knight.png'
     col / row start at 0 (top-left square is col 0, row 0).
     ------------------------------------------------------------ */
  const TOKENS = [
    { name: 'Knight',   src: 'https://m.media-amazon.com/images/I/71mTnYN0NXL._AC_UF350,350_QL80_.jpg',   col: 2,  row: 3 },
    { name: 'Wizard',   src: 'https://img.magnific.com/free-photo/wizard-cartoon-illustration_23-2151626941.jpg?semt=ais_hybrid&w=740&q=80',   col: 1,  row: 4 },
    { name: 'Assasin',    src: 'https://as1.ftcdn.net/v2/jpg/05/51/36/10/1000_F_551361003_UFWS9oQ24KH12zqkgbUD4UcaLyeKTGIr.jpg',    col: 2,  row: 5 },
    { name: 'Archer',   src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqVF9xkh3X2P_M9HBbrqRLublNw5eJLF1Hfz7tt7DVf8iGVG-sCom__jWE&s=10',   col: 1,  row: 2 },
    { name: 'Orc',      src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs1nVk5aue6phmpqw6tC25l_M1ICea-WiXCgSuEYYYhg&s=10',      col: 9,  row: 3 },
    { name: 'Goblin',   src: 'https://www.celebrity-cutouts.com/wp-content/uploads/2023/09/goblin-shirt-buddy.jpg',   col: 10, row: 5 },
    { name: 'Goblin',   src: 'https://www.celebrity-cutouts.com/wp-content/uploads/2023/09/goblin-shirt-buddy.jpg',   col: 9,  row: 6 },
    { name: 'Skeleton', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_QUv7GUSN3gHHqK0t-w1G6a1RJOPPrPXP30ZLJB97qlo_Ivg6XC9PRP3E&s=10', col: 10, row: 2 }
  ];

  const pieces = [];
  let drag = null;

  function place(p) {
    p.el.style.left = (p.col * 100 / COLS) + '%';
    p.el.style.top = (p.row * 100 / ROWS) + '%';
  }

  function pieceAt(col, row, except) {
    return pieces.find(function (p) { return p !== except && p.col === col && p.row === row; }) || null;
  }

  function cellFromPoint(x, y) {
    const r = mapEl.getBoundingClientRect();
    if (x < r.left || x >= r.right || y < r.top || y >= r.bottom) return null;
    return {
      col: Math.min(COLS - 1, Math.floor((x - r.left) / r.width * COLS)),
      row: Math.min(ROWS - 1, Math.floor((y - r.top) / r.height * ROWS))
    };
  }

  function moveTo(p, col, row) {
    const other = pieceAt(col, row, p);
    if (other) { other.col = p.col; other.row = p.row; place(other); }
    p.col = col;
    p.row = row;
    place(p);
  }

  TOKENS.forEach(function (t) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'token';
    el.setAttribute('aria-label', t.name + '. Arrow keys move it.');

    const img = document.createElement('img');
    img.src = t.src;
    img.alt = '';
    img.draggable = false;
    el.appendChild(img);

    const p = { el: el, col: t.col, row: t.row };
    pieces.push(p);
    mapEl.appendChild(el);
    place(p);

    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      el.focus({ preventScroll: true });
      drag = { p: p, x: e.clientX, y: e.clientY };
      el.classList.add('dragging');
    });

    el.addEventListener('pointermove', function (e) {
      if (!drag || drag.p !== p) return;
      el.style.transform = 'translate(' + (e.clientX - drag.x) + 'px,' + (e.clientY - drag.y) + 'px)';
    });

    function drop(e) {
      if (!drag || drag.p !== p) return;
      drag = null;
      el.classList.remove('dragging');
      el.style.transform = '';
      const cell = cellFromPoint(e.clientX, e.clientY);
      if (cell && e.type === 'pointerup') moveTo(p, cell.col, cell.row);
    }
    el.addEventListener('pointerup', drop);
    el.addEventListener('pointercancel', drop);

    el.addEventListener('keydown', function (e) {
      const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (!d) return;
      e.preventDefault();
      const c = p.col + d[0], r = p.row + d[1];
      if (c >= 0 && c < COLS && r >= 0 && r < ROWS) moveTo(p, c, r);
    });
  });
})();
