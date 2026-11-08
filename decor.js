(function () {
  'use strict';

  const TORCH_SVG =
    '<svg class="torch-svg" viewBox="0 0 60 150" aria-hidden="true" focusable="false">' +
      '<rect x="19" y="96" width="22" height="30" rx="3" fill="#2E3150" stroke="#4A4E78" stroke-width="1.5"/>' +
      '<circle cx="24" cy="102" r="1.8" fill="#8C93B5"/><circle cx="36" cy="102" r="1.8" fill="#8C93B5"/>' +
      '<circle cx="24" cy="120" r="1.8" fill="#8C93B5"/><circle cx="36" cy="120" r="1.8" fill="#8C93B5"/>' +
      '<path d="M25 62 H35 L34 146 H26 Z" fill="#6B4426" stroke="#4A2D17" stroke-width="1.5"/>' +
      '<rect x="22" y="108" width="16" height="5" rx="1.5" fill="#3A3D5C" stroke="#4A4E78" stroke-width="1"/>' +
      '<rect x="22" y="84" width="16" height="4" rx="1.5" fill="#3A3D5C"/>' +
      '<path d="M16 46 H44 L37 68 H23 Z" fill="#3A3D5C" stroke="#4A4E78" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<g class="flame">' +
        '<path class="f-out" d="M30 2 C40 16 47 27 43 39 C41 47 19 47 17 39 C13 27 22 18 30 2 Z" fill="#E2672A"/>' +
        '<path class="f-mid" d="M30 15 C38 26 39 33 37 41 C35 46 25 46 23 41 C21 33 25 26 30 15 Z" fill="#F0A93B"/>' +
        '<path class="f-in"  d="M30 27 C34 33 35 38 33 43 C32 45 28 45 27 43 C25 38 26 33 30 27 Z" fill="#FFF1B8"/>' +
      '</g>' +
    '</svg>';
  const SPOTS = [
    { side: 'left',  top: '14%', delay: 0 },
    { side: 'right', top: '14%', delay: -1.3 },
    { side: 'left',  top: '60%', delay: -0.7 },
    { side: 'right', top: '60%', delay: -2.1 }
  ];
  const EMBERS_PER_TORCH = 6;

  const layer = document.createElement('div');
  layer.className = 'torch-layer';
  layer.setAttribute('aria-hidden', 'true');

  SPOTS.forEach(function (spot) {
    const torch = document.createElement('div');
    torch.className = 'wall-torch ' + spot.side;
    torch.style.top = spot.top;
    torch.style.setProperty('--d', spot.delay + 's');
    torch.innerHTML = '<div class="torch-glow"></div>' + TORCH_SVG;

    const embers = document.createElement('div');
    embers.className = 'embers';
    for (let i = 0; i < EMBERS_PER_TORCH; i++) {
      const e = document.createElement('span');
      e.className = 'ember';
      e.style.setProperty('--x', (Math.random() * 16 - 8).toFixed(1) + 'px');
      e.style.setProperty('--dx', (Math.random() * 40 - 20).toFixed(1) + 'px');
      e.style.setProperty('--dur', (2.6 + Math.random() * 2.4).toFixed(2) + 's');
      e.style.setProperty('--delay', (-Math.random() * 5).toFixed(2) + 's');
      e.style.setProperty('--size', (2 + Math.random() * 2.5).toFixed(1) + 'px');
      embers.appendChild(e);
    }
    torch.appendChild(embers);
    layer.appendChild(torch);
  });

  document.body.appendChild(layer);
})();