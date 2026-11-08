(function () {
  'use strict';

  const grid = document.getElementById('board-grid');
  const tray = document.getElementById('tray');
  if (!grid || !tray) return;

  const statusEl = document.getElementById('board-status');
  const statsEl = document.getElementById('board-stats');
  const clearBtn = document.getElementById('board-clear');
  const rollBtn = document.getElementById('board-roll');

  const svg = function (inner) {
    return '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">' + inner + '</svg>';
  };

  const TYPES = { monster: 'Monsters', treasure: 'Treasure', gear: 'Gear', magic: 'Magic' };

  const ICONS = [
    { id: 'sword', name: 'Sword', type: 'gear', desc: 'A trusty blade for the front line.',
      svg: svg('<g transform="rotate(45 32 32)"><path d="M32 3 L37 9 V40 H27 V9 Z" fill="#C9CEDD" stroke="#8C93B5" stroke-width="1.5" stroke-linejoin="round"/><path d="M32 9 V38" stroke="#8C93B5" stroke-width="1.5"/><rect x="17" y="40" width="30" height="5" rx="2.5" fill="#F0A93B"/><rect x="29" y="45" width="6" height="11" fill="#7A4B2A"/><circle cx="32" cy="58" r="4" fill="#F0A93B"/></g>') },
    { id: 'shield', name: 'Shield', type: 'gear', desc: 'Raise it to turn aside a blow.',
      svg: svg('<path d="M32 5 L54 13 V32 C54 46 45 55 32 60 C19 55 10 46 10 32 V13 Z" fill="#8E6BD1" stroke="#F0A93B" stroke-width="3" stroke-linejoin="round"/><path d="M32 18 L36 28 L47 29 L39 36 L41 47 L32 41 L23 47 L25 36 L17 29 L28 28 Z" fill="#F0A93B"/>') },
    { id: 'bow', name: 'Bow', type: 'gear', desc: 'Strike from the back row.',
      svg: svg('<path d="M22 6 C54 18 54 46 22 58" fill="none" stroke="#7A4B2A" stroke-width="4" stroke-linecap="round"/><path d="M22 6 V58" stroke="#EDE8DA" stroke-width="1.5"/><line x1="8" y1="32" x2="50" y2="32" stroke="#8C93B5" stroke-width="3"/><path d="M57 32 L46 26 V38 Z" fill="#C9CEDD"/><path d="M8 32 L4 27 M8 32 L4 37 M13 32 L9 27 M13 32 L9 37" stroke="#B23A48" stroke-width="2.5" stroke-linecap="round"/>') },
    { id: 'key', name: 'Iron key', type: 'gear', desc: 'Opens the one door you cannot kick down.',
      svg: svg('<g transform="rotate(-45 32 32)"><circle cx="15" cy="32" r="9" fill="none" stroke="#F0A93B" stroke-width="5"/><rect x="23" y="29.5" width="33" height="5" fill="#F0A93B"/><rect x="46" y="34" width="5" height="9" fill="#F0A93B"/><rect x="37" y="34" width="5" height="7" fill="#F0A93B"/></g>') },
    { id: 'potion', name: 'Potion', type: 'magic', desc: 'Heals wounds, or does something stranger.',
      svg: svg('<rect x="26" y="4" width="12" height="7" rx="2" fill="#7A4B2A"/><path d="M27 11 V25 L13 47 C10 53 14 59 21 59 H43 C50 59 54 53 51 47 L37 25 V11 Z" fill="#2B2F55" fill-opacity=".6"/><path d="M17 42 H47 L51 47 C54 53 50 59 43 59 H21 C14 59 10 53 13 47 Z" fill="#B23A48"/><circle cx="26" cy="51" r="3" fill="#EDE8DA" fill-opacity=".7"/><circle cx="38" cy="47" r="2" fill="#EDE8DA" fill-opacity=".7"/><path d="M27 11 V25 L13 47 C10 53 14 59 21 59 H43 C50 59 54 53 51 47 L37 25 V11 Z" fill="none" stroke="#EDE8DA" stroke-width="2.5" stroke-linejoin="round"/>') },
    { id: 'scroll', name: 'Spell scroll', type: 'magic', desc: 'One spell, read once, gone forever.',
      svg: svg('<rect x="14" y="10" width="36" height="44" fill="#EDE8DA"/><rect x="10" y="5" width="44" height="9" rx="4.5" fill="#D8CFB4" stroke="#B8A878" stroke-width="1.5"/><rect x="10" y="50" width="44" height="9" rx="4.5" fill="#D8CFB4" stroke="#B8A878" stroke-width="1.5"/><path d="M20 24 H44 M20 31 H44 M20 38 H34" stroke="#1B1F3B" stroke-width="2.5" stroke-linecap="round" opacity=".7"/><circle cx="43" cy="42" r="5" fill="#B23A48"/>') },
    { id: 'wand', name: 'Arcane staff', type: 'magic', desc: 'The orb hums when magic is near.',
      svg: svg('<line x1="12" y1="56" x2="42" y2="22" stroke="#7A4B2A" stroke-width="5" stroke-linecap="round"/><circle cx="46" cy="16" r="9" fill="#8E6BD1" stroke="#F0A93B" stroke-width="2.5"/><circle cx="43" cy="13" r="2.5" fill="#EDE8DA" fill-opacity=".8"/><path d="M57 2 L58.4 6.6 L63 8 L58.4 9.4 L57 14 L55.6 9.4 L51 8 L55.6 6.6 Z" fill="#F0A93B"/><path d="M14 14 L15.2 19 L20 20 L15.2 21.2 L14 26 L12.8 21.2 L8 20 L12.8 19 Z" fill="#F0A93B"/>') },
    { id: 'chest', name: 'Treasure chest', type: 'treasure', desc: 'Check it for traps first.',
      svg: svg('<rect x="8" y="30" width="48" height="26" rx="2" fill="#7A4B2A" stroke="#5A3519" stroke-width="2"/><path d="M8 30 V24 C8 12 56 12 56 24 V30 Z" fill="#8A5630" stroke="#5A3519" stroke-width="2"/><rect x="8" y="28" width="48" height="5" fill="#F0A93B"/><rect x="14" y="19" width="5" height="37" fill="#F0A93B"/><rect x="45" y="19" width="5" height="37" fill="#F0A93B"/><rect x="28" y="28" width="8" height="12" rx="1.5" fill="#B8832A" stroke="#1B1F3B" stroke-width="1.5"/><circle cx="32" cy="33" r="1.8" fill="#1B1F3B"/>') },
    { id: 'coins', name: 'Gold coins', type: 'treasure', desc: 'Never enough to pay for the next inn.',
      svg: svg('<ellipse cx="32" cy="50" rx="21" ry="8" fill="#B8832A"/><rect x="11" y="38" width="42" height="12" fill="#B8832A"/><ellipse cx="32" cy="38" rx="21" ry="8" fill="#F0A93B" stroke="#8F6420" stroke-width="1.5"/><ellipse cx="32" cy="38" rx="16" ry="6.5" fill="#B8832A"/><rect x="16" y="26" width="32" height="12" fill="#B8832A"/><ellipse cx="32" cy="26" rx="16" ry="6.5" fill="#F0A93B" stroke="#8F6420" stroke-width="1.5"/><ellipse cx="32" cy="26" rx="12" ry="5" fill="#B8832A"/><rect x="20" y="15" width="24" height="11" fill="#B8832A"/><ellipse cx="32" cy="15" rx="12" ry="5" fill="#F0A93B" stroke="#8F6420" stroke-width="1.5"/>') },
    { id: 'gem', name: 'Glowing gem', type: 'treasure', desc: 'Worth more than the whole village.',
      svg: svg('<path d="M20 10 H44 L58 26 L32 58 L6 26 Z" fill="#46C2B0" stroke="#8FE6D8" stroke-width="2" stroke-linejoin="round"/><path d="M20 10 L26 26 H6 Z" fill="#8FE6D8"/><path d="M6 26 H58 M20 10 L26 26 L32 58 M44 10 L38 26 L32 58" fill="none" stroke="#8FE6D8" stroke-width="1.5"/>') },
    { id: 'skull', name: 'Restless skeleton', type: 'monster', desc: 'It was not planning to stay dead.',
      svg: svg('<path d="M32 6 C18 6 10 16 10 28 C10 36 14 40 19 42 V52 H45 V42 C50 40 54 36 54 28 C54 16 46 6 32 6 Z" fill="#EDE8DA" stroke="#B9B29A" stroke-width="1.5"/><circle cx="23" cy="29" r="6" fill="#1B1F3B"/><circle cx="41" cy="29" r="6" fill="#1B1F3B"/><circle cx="23" cy="29" r="2" fill="#B23A48"/><circle cx="41" cy="29" r="2" fill="#B23A48"/><path d="M32 36 L28 44 H36 Z" fill="#1B1F3B"/><path d="M25 52 V45 M32 52 V47 M39 52 V45" stroke="#1B1F3B" stroke-width="2"/>') },
    { id: 'egg', name: 'Dragon egg', type: 'monster', desc: 'Warm to the touch. Something is moving inside.',
      svg: svg('<path d="M32 4 C46 4 54 26 54 38 C54 51 45 60 32 60 C19 60 10 51 10 38 C10 26 18 4 32 4 Z" fill="#4FA37A" stroke="#2C6E4F" stroke-width="2"/><g fill="none" stroke="#8FE0B4" stroke-width="1.6" stroke-linecap="round" opacity=".85"><path d="M24 22 q4 5 8 0 q4 5 8 0"/><path d="M16 32 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0"/><path d="M14 42 q4.5 5 9 0 q4.5 5 9 0 q4.5 5 9 0 q4.5 5 9 0"/><path d="M20 51 q4 5 8 0 q4 5 8 0 q4 5 8 0"/></g><ellipse cx="24" cy="18" rx="3" ry="6" fill="#fff" opacity=".25" transform="rotate(25 24 18)"/>') }
  ];

  const ROOMS = [
    { id: 'entrance', name: 'Entrance', hint: 'Where every party begins.' },
    { id: 'guard', name: 'Guard Hall', hint: 'Someone is always on watch.' },
    { id: 'armory', name: 'Armory', hint: 'Racks of old weapons.' },
    { id: 'library', name: 'Library', hint: 'Dusty books and hidden secrets.' },
    { id: 'trap', name: 'Trap Corridor', hint: 'Watch your step.' },
    { id: 'crypt', name: 'Crypt', hint: 'Cold air and quiet tombs.' },
    { id: 'treasury', name: 'Treasury', hint: 'The reward for the brave.' },
    { id: 'lair', name: "Dragon's Lair", hint: 'The final room.' }
  ];

  const byId = {};
  ICONS.forEach(function (icon) { byId[icon.id] = icon; });

  const SAVE_KEY = 'primer-board-v1';
  const placed = new Array(ROOMS.length).fill(null);
  let armed = null;
  let drag = null;
  let suppressClick = false;
  const tiles = ICONS.map(function (icon) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tile type-' + icon.type;
    b.dataset.id = icon.id;
    b.title = icon.name + ' — ' + icon.desc;
    b.setAttribute('aria-label', icon.name + ', ' + TYPES[icon.type] + '. Press Enter to pick up.');
    b.innerHTML = icon.svg + '<span class="tile-name">' + icon.name + '</span>';
    tray.appendChild(b);
    return b;
  });
  const frames = ROOMS.map(function (room, i) {
    const f = document.createElement('button');
    f.type = 'button';
    f.className = 'frame';
    f.dataset.index = String(i);
    f.title = room.hint;
    f.innerHTML = '<span class="frame-slot"></span><span class="frame-name">' + room.name + '</span>';
    grid.appendChild(f);
    return f;
  });
  function setStatus() {}

  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(placed)); } catch (e) {}
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return;
      data.slice(0, ROOMS.length).forEach(function (id, i) {
        placed[i] = byId[id] ? id : null;
      });
    } catch (e) {}
  }

  function renderStats() {
    const counts = { monster: 0, treasure: 0, gear: 0, magic: 0 };
    let filled = 0;
    placed.forEach(function (id) {
      if (id) { filled++; counts[byId[id].type]++; }
    });
    statsEl.innerHTML = '';
    const chips = [['Rooms filled', filled + ' / ' + ROOMS.length]];
    Object.keys(TYPES).forEach(function (t) { chips.push([TYPES[t], String(counts[t])]); });
    chips.forEach(function (c) {
      const s = document.createElement('span');
      s.className = 'stat';
      s.innerHTML = '<span class="stat-label">' + c[0] + '</span><strong>' + c[1] + '</strong>';
      statsEl.appendChild(s);
    });
  }

  function renderArmed() {
    tiles.forEach(function (t) {
      t.classList.toggle('armed', !!armed && armed.from === null && armed.id === t.dataset.id);
      t.setAttribute('aria-pressed', t.classList.contains('armed') ? 'true' : 'false');
    });
    frames.forEach(function (f, i) {
      f.classList.toggle('armed-source', !!armed && armed.from === i);
    });
    grid.classList.toggle('has-armed', !!armed);
  }

  function render() {
    frames.forEach(function (f, i) {
      const icon = placed[i] ? byId[placed[i]] : null;
      const slot = f.firstElementChild;
      slot.innerHTML = icon ? icon.svg : '<span class="slot-empty">Empty</span>';
      f.classList.toggle('filled', !!icon);
      f.setAttribute('aria-label', ROOMS[i].name + ': ' + (icon ? icon.name : 'empty') +
        (icon ? '. Press Enter to pick up, Delete to remove.' : '. Press Enter to place the picked-up icon here.'));
    });
    renderStats();
    renderArmed();
    save();
  }

  function pop(index) {
    const slot = frames[index].firstElementChild;
    slot.classList.remove('pop');
    void slot.offsetWidth;
    slot.classList.add('pop');
  }
  function place(id, index, from) {
    const icon = byId[id];
    const replaced = placed[index];
    if (from !== null && from !== index) {
      placed[from] = replaced;
      placed[index] = id;
      setStatus(replaced
        ? icon.name + ' and ' + byId[replaced].name + ' swapped places.'
        : icon.name + ' moved to ' + ROOMS[index].name + '.');
    } else {
      placed[index] = id;
      setStatus(icon.name + ' placed in ' + ROOMS[index].name + '.' +
        (replaced && replaced !== id ? ' ' + byId[replaced].name + ' was replaced.' : ''));
    }
    armed = null;
    render();
    pop(index);
    if (from !== null && from !== index) pop(from);
  }

  function removeAt(index) {
    if (!placed[index]) return;
    const name = byId[placed[index]].name;
    placed[index] = null;
    armed = null;
    render();
    setStatus(name + ' removed from ' + ROOMS[index].name + '.');
  }

  function clearBoard() {
    placed.fill(null);
    armed = null;
    render();
    setStatus('The board is clear. Time to plan a new dungeon.');
  }

  function rollDungeon() {
    for (let i = 0; i < ROOMS.length; i++) {
      placed[i] = ICONS[Math.floor(Math.random() * ICONS.length)].id;
    }
    armed = null;
    render();
    frames.forEach(function (_, i) { pop(i); });
    setStatus('You rolled a whole new dungeon. Drag things around to improve it.');
  }
  tray.addEventListener('click', function (e) {
    if (suppressClick && e.detail !== 0) return;
    const tile = e.target.closest('.tile');
    if (!tile) return;
    const id = tile.dataset.id;
    if (armed && armed.from === null && armed.id === id) {
      armed = null;
      setStatus('Put the ' + byId[id].name + ' back.');
    } else {
      armed = { id: id, from: null };
      setStatus(byId[id].name + ' picked up. Now choose a frame. Esc cancels.');
    }
    renderArmed();
  });

  grid.addEventListener('click', function (e) {
    if (suppressClick && e.detail !== 0) return;
    const frame = e.target.closest('.frame');
    if (!frame) return;
    const i = Number(frame.dataset.index);
    if (armed) {
      place(armed.id, i, armed.from);
    } else if (placed[i]) {
      armed = { id: placed[i], from: i };
      renderArmed();
      setStatus(byId[placed[i]].name + ' picked up from ' + ROOMS[i].name + '. Choose another frame, or press Delete to remove it.');
    } else {
      setStatus(ROOMS[i].name + ' is empty. Pick an icon from the chest first.');
    }
  });

  grid.addEventListener('keydown', function (e) {
    const frame = e.target.closest('.frame');
    if (frame && (e.key === 'Delete' || e.key === 'Backspace')) {
      e.preventDefault();
      removeAt(Number(frame.dataset.index));
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && (armed || drag)) {
      if (drag) { cleanupDrag(); }
      armed = null;
      renderArmed();
      setStatus('Cancelled.');
    }
  });

  clearBtn.addEventListener('click', clearBoard);
  rollBtn.addEventListener('click', rollDungeon);
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    const tile = e.target.closest('.tile');
    const frame = e.target.closest('.frame');
    let id = null, from = null, source = null;
    if (tile && tray.contains(tile)) {
      id = tile.dataset.id; source = tile;
    } else if (frame && grid.contains(frame) && placed[Number(frame.dataset.index)]) {
      from = Number(frame.dataset.index); id = placed[from]; source = frame;
    }
    if (!id) return;
    drag = { id: id, from: from, source: source, x: e.clientX, y: e.clientY, moved: false, ghost: null };
  });

  function frameAt(x, y) {
    const el = document.elementFromPoint(x, y);
    const f = el && el.closest ? el.closest('.frame') : null;
    return f && grid.contains(f) ? f : null;
  }

  function clearOver() {
    frames.forEach(function (f) { f.classList.remove('over'); });
  }

  document.addEventListener('pointermove', function (e) {
    if (!drag) return;
    if (!drag.moved) {
      if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) return;
      drag.moved = true;
      const g = document.createElement('div');
      g.className = 'drag-ghost';
      g.innerHTML = byId[drag.id].svg;
      document.body.appendChild(g);
      drag.ghost = g;
      drag.source.classList.add('dragging');
      document.body.classList.add('is-dragging');
      armed = null;
      renderArmed();
    }
    drag.ghost.style.transform = 'translate(' + (e.clientX - 36) + 'px,' + (e.clientY - 36) + 'px) rotate(-8deg) scale(1.1)';
    const over = frameAt(e.clientX, e.clientY);
    frames.forEach(function (f) { f.classList.toggle('over', f === over); });
  });

  function cleanupDrag() {
    if (!drag) return;
    if (drag.ghost) drag.ghost.remove();
    drag.source.classList.remove('dragging');
    document.body.classList.remove('is-dragging');
    clearOver();
    drag = null;
  }

  document.addEventListener('pointerup', function (e) {
    if (!drag) return;
    const d = drag;
    const moved = d.moved;
    cleanupDrag();
    if (!moved) return;
    suppressClick = true;
    setTimeout(function () { suppressClick = false; }, 0);
    const target = frameAt(e.clientX, e.clientY);
    if (target) {
      place(d.id, Number(target.dataset.index), d.from);
    } else if (d.from !== null) {
      removeAt(d.from);
    } else {
      setStatus('Dropped outside the board. Drop it on a frame.');
    }
  });

  document.addEventListener('pointercancel', cleanupDrag);
  load();
  render();
  setStatus('Drag an icon from the chest onto a room, or pick one and then choose a frame.');
})();
