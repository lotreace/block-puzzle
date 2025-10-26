export class GameBoard {
  constructor(size = 8) {
    this.size = size;
    this.grid = Array(size).fill(null).map(() => Array(size).fill(false));
    this.element = null;
    this.cellElements = [];
  }

  createBoard() {
    // Calculate responsive cell size
    const viewportWidth = window.innerWidth;
    let cellSize = 50;
    let gap = 2;
    let padding = 10;

    if (viewportWidth < 400) {
      cellSize = 35;
      gap = 1;
      padding = 5;
    } else if (viewportWidth < 768) {
      cellSize = 40;
      gap = 2;
      padding = 8;
    }

    this.cellSize = cellSize;

    this.element = document.createElement('div');
    this.element.className = 'game-board';
    this.element.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${this.size}, ${cellSize}px);
      grid-template-rows: repeat(${this.size}, ${cellSize}px);
      gap: ${gap}px;
      background-color: #2c3e50;
      padding: ${padding}px;
      border-radius: 8px;
    `;

    for (let row = 0; row < this.size; row++) {
      this.cellElements[row] = [];
      for (let col = 0; col < this.size; col++) {
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.style.cssText = `
          width: ${cellSize}px;
          height: ${cellSize}px;
          background-color: #34495e;
          border: 1px solid #2c3e50;
          transition: background-color 0.2s;
        `;
        this.element.appendChild(cell);
        this.cellElements[row][col] = cell;
      }
    }

    return this.element;
  }

  canPlaceShape(shapePattern, startRow, startCol) {
    for (let row = 0; row < shapePattern.length; row++) {
      for (let col = 0; col < shapePattern[row].length; col++) {
        if (shapePattern[row][col]) {
          const boardRow = startRow + row;
          const boardCol = startCol + col;

          if (boardRow < 0 || boardRow >= this.size ||
              boardCol < 0 || boardCol >= this.size ||
              this.grid[boardRow][boardCol]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  placeShape(shapePattern, startRow, startCol, color) {
    for (let row = 0; row < shapePattern.length; row++) {
      for (let col = 0; col < shapePattern[row].length; col++) {
        if (shapePattern[row][col]) {
          const boardRow = startRow + row;
          const boardCol = startCol + col;
          this.grid[boardRow][boardCol] = true;
          const cell = this.cellElements[boardRow][boardCol];
          cell.style.backgroundColor = color;
          cell.style.borderTop = '4px solid rgba(255, 255, 255, 0.6)';
          cell.style.borderLeft = '4px solid rgba(255, 255, 255, 0.6)';
          cell.style.borderRight = '4px solid rgba(0, 0, 0, 0.4)';
          cell.style.borderBottom = '4px solid rgba(0, 0, 0, 0.4)';
          cell.style.borderRadius = '0';
          cell.style.boxShadow = 'inset 2px 2px 4px rgba(255, 255, 255, 0.4), inset -2px -2px 4px rgba(0, 0, 0, 0.3)';
        }
      }
    }
  }

  checkAndClearLines() {
    const rowsToClear = [];
    const colsToClear = [];

    // Check rows
    for (let row = 0; row < this.size; row++) {
      if (this.grid[row].every(cell => cell)) {
        rowsToClear.push(row);
      }
    }

    // Check columns
    for (let col = 0; col < this.size; col++) {
      let colFilled = true;
      for (let row = 0; row < this.size; row++) {
        if (!this.grid[row][col]) {
          colFilled = false;
          break;
        }
      }
      if (colFilled) {
        colsToClear.push(col);
      }
    }

    // Clear rows
    rowsToClear.forEach(row => {
      for (let col = 0; col < this.size; col++) {
        this.grid[row][col] = false;
        const cell = this.cellElements[row][col];
        cell.style.backgroundColor = '#34495e';
        cell.style.border = '1px solid #2c3e50';
        cell.style.boxShadow = 'none';
      }
    });

    // Clear columns
    colsToClear.forEach(col => {
      for (let row = 0; row < this.size; row++) {
        this.grid[row][col] = false;
        const cell = this.cellElements[row][col];
        cell.style.backgroundColor = '#34495e';
        cell.style.border = '1px solid #2c3e50';
        cell.style.boxShadow = 'none';
      }
    });

    return rowsToClear.length + colsToClear.length;
  }

  highlightCells(shapePattern, startRow, startCol, highlight) {
    for (let row = 0; row < shapePattern.length; row++) {
      for (let col = 0; col < shapePattern[row].length; col++) {
        if (shapePattern[row][col]) {
          const boardRow = startRow + row;
          const boardCol = startCol + col;

          if (boardRow >= 0 && boardRow < this.size &&
              boardCol >= 0 && boardCol < this.size &&
              !this.grid[boardRow][boardCol]) {
            if (highlight) {
              this.cellElements[boardRow][boardCol].style.backgroundColor = '#95a5a6';
            } else {
              this.cellElements[boardRow][boardCol].style.backgroundColor = '#34495e';
            }
          }
        }
      }
    }
  }

  getCellAtPosition(x, y) {
    const rect = this.element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Match padding from createBoard
    let padding = 10;
    if (viewportWidth < 400) {
      padding = 5;
    } else if (viewportWidth < 768) {
      padding = 8;
    }

    const relativeX = x - rect.left - padding;
    const relativeY = y - rect.top - padding;

    // Calculate cell size with gap
    const gap = viewportWidth < 400 ? 1 : 2;
    const totalCellSize = this.cellSize + gap;
    const col = Math.floor(relativeX / totalCellSize);
    const row = Math.floor(relativeY / totalCellSize);

    if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
      return { row, col };
    }
    return null;
  }
}
