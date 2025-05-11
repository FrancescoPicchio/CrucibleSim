const board = document.getElementById('board');
const size = 11;
let pieces = [
  { id: 'p1', x: 5, y: 0 },
  { id: 'p2', x: 5, y: 10 }
];

// Create board
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const square = document.createElement('div');
    square.classList.add('square');
    if ((x + y) % 2 === 1) square.classList.add('dark');
    square.dataset.x = x;
    square.dataset.y = y;

    // Allow drop
    square.addEventListener('dragover', (e) => {
      e.preventDefault(); // Necessary to allow dropping
    });

    square.addEventListener('drop', (e) => {
      e.preventDefault();

      const id = e.dataTransfer.getData('text/plain');
      const piece = pieces.find(p => p.id === id);

      const newX = parseInt(square.dataset.x);
      const newY = parseInt(square.dataset.y);

      

      // Move the piece and re-render
      piece.x = newX;
      piece.y = newY;
      renderPieces();
    });

    board.appendChild(square);
  }
}

// Render pieces
function renderPieces() {
  document.querySelectorAll('.piece').forEach(p => p.remove());

  pieces.forEach(piece => {
    const square = document.querySelector(`.square[data-x="${piece.x}"][data-y="${piece.y}"]`);
    const el = document.createElement('div');
    el.classList.add('piece');
    if (piece.id === 'p2') el.classList.add('player2');
    el.dataset.id = piece.id;

    // Add event listeners for drag
    makeDraggable(el, piece);

    square.appendChild(el);
  });
}

function makeDraggable(el, piece) {
  let ghost = null;
  let isDragging = false;

  const startDrag = (e) => {
    e.preventDefault();
    isDragging = true;

    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;

    // Create ghost
    ghost = el.cloneNode(true);
    ghost.style.position = 'fixed';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '1000';
    ghost.style.opacity = '0.7';
    ghost.style.transform = 'translate(-50%, -50%) scale(1.2)';
    document.body.appendChild(ghost);

    moveAt(clientX, clientY);
  };

  const moveAt = (x, y) => {
    if (ghost) {
      ghost.style.left = x + 'px';
      ghost.style.top = y + 'px';
    }
  };

  const onMove = (e) => {
    if (!isDragging || !ghost) return;
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    moveAt(clientX, clientY);
  };

  const endDrag = (e) => {
    if (!isDragging || !ghost) return;

    const clientX = e.type.startsWith('touch') ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.changedTouches[0].clientY : e.clientY;

    const target = document.elementFromPoint(clientX, clientY);
    const square = target?.closest('.square');

    if (square) {
      const newX = parseInt(square.dataset.x);
      const newY = parseInt(square.dataset.y);
      const playerId = square.dataset.id;

      const isSameSpot = piece.x === newX && piece.y === newY;
      const occupied = pieces.some(p => p.x === newX && p.y === newY && p.id !== piece.id);

      if (!occupied) {
        piece.x = newX;
        piece.y = newY;
      } else if (!isSameSpot) {
        alert('That square is already occupied!');
      }
    }

    ghost.remove();
    ghost = null;
    isDragging = false;
    renderPieces();
  };

  el.addEventListener('mousedown', startDrag);
  el.addEventListener('touchstart', startDrag, { passive: false });

  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, { passive: false });

  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);
}

renderPieces();