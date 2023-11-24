import './style.css';
import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT, PIECES, PieceShape, difficultyLevels } from './const';

let score = 0
let currentLevel = 1 // Inicialmente, el jugador comienza en el nivel 1
let currentFallSpeed = difficultyLevels[currentLevel - 1].fallSpeed;
console.log(`currentFallSpeed: ${currentFallSpeed}`);


// 1. Inicializar canvas
const canvas: HTMLCanvasElement | null = document.querySelector('canvas');
const context: CanvasRenderingContext2D | null | undefined = canvas?.getContext('2d');

if (canvas && context) {
  canvas.width = BLOCK_SIZE * BOARD_WIDTH
  canvas.height = BLOCK_SIZE * BOARD_HEIGHT

  context.scale(BLOCK_SIZE, BLOCK_SIZE)
}

// 3. Board
function createBoard(width: number, height: number): number[][] {
  return Array(height).fill(0).map(() => Array(width).fill(0))
}
const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)

// 4. Pieces player
const piece: {
  id: PieceShape;
  position: { x: number; y: number }
  shape: number[][]
} = {
  id: 'square',
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1],
  ],
};

// Game loop
let dropCounter = 0
let lastTime = 0
function update(time = 0) {
  
  const deltaTime = time - lastTime
  lastTime = time
  dropCounter += deltaTime * currentFallSpeed;

  // Actualizar el puntaje en la interfaz
  updateScoreDisplay();

  if (dropCounter > 1000) {
    piece.position.y++
    dropCounter = 0

    if (checkCollision()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  draw()
  window.requestAnimationFrame(update)
}

function draw() {
  
  if (context) {
    context.fillStyle = '#000'
    context.fillRect(0, 0, canvas?.width || 0, canvas?.height || 0)

    board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          context.fillStyle = 'gray'
          context.fillRect(x, y, 1, 1)
        }
      })
    })

    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const pieceColor = PIECES.find(p => p.id === piece.id)
          const color = pieceColor ? pieceColor.color : 'black'
          context.fillStyle = color
          context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)

        }   
      })
    })
  }
}

// Movimiento de pieza
document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    piece.position.x--
    if (checkCollision()) {
      piece.position.x++
    }
  }

  if (event.key === 'ArrowRight') {
    piece.position.x++
    if (checkCollision()) {
      piece.position.x--
    }
  }

  if (event.key === 'ArrowDown') {
    piece.position.y++
    if (checkCollision()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  // Rotar piezas
  if (event.key === 'ArrowUp') {
    const rotated: number[][] = []
    for (let i = 0; i < piece.shape[0].length; i++) {
      const row: number[] = []
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i])
      }
      rotated.push(row)
    }
    const previousShape: number[][] = piece.shape
    piece.shape = rotated

    if (checkCollision()) {
      piece.shape = previousShape
    }
  }
})

// Colisiones
function checkCollision(): boolean {
  return !!piece.shape.find((row, y) =>
    row.find((value, x) =>
      value !== 0 && board[y + piece.position.y]?.[x + piece.position.x] !== 0
    )
  )
}

// Solidificar piezas
function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })

  // Reiniciar posición
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2)
  piece.position.y = 0

  // Obtener forma aleatoria
const randomPiece = PIECES[Math.floor(Math.random() * PIECES.length)]
piece.id = randomPiece.id // Update the ID of the piece
piece.shape = randomPiece.shape

  // Game over
  if (checkCollision()) {
    alert('¡Game over! I sorry.')
    board.forEach((row) => row.fill(0))
    // Reiniciar el puntaje en caso de Game Over y el nivel
    score = 0
    currentLevel = 1
    currentFallSpeed = difficultyLevels[currentLevel - 1].fallSpeed
  }
}

// Remover filas
function removeRows() {
  const rowsToRemove: number[] = []
  board.forEach((row, y) => {
    if (row.every(value => value === 1)) {
      rowsToRemove.push(y)
    }
  })
  if (rowsToRemove.length > 0) {
    // Incrementa el puntaje por cada línea eliminada
    score += rowsToRemove.length * 10;
    updateScoreDisplay();
  }

  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow: number[] = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
  })
}
function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('score-display');

  if (scoreDisplay) {
    scoreDisplay.textContent = score.toString();
  }
 
  if (currentLevel < difficultyLevels.length && score >= difficultyLevels[currentLevel].scoreThreshold) {
    currentLevel++;
    currentFallSpeed = difficultyLevels[currentLevel - 1].fallSpeed;
  }
}
update()
