export class Shape {
  static SHAPES = {
    I_HORIZONTAL: {
      pattern: [[1, 1, 1]],
      color: '#e74c3c'
    },
    I_VERTICAL: {
      pattern: [[1], [1], [1]],
      color: '#3498db'
    },
    SQUARE: {
      pattern: [[1, 1], [1, 1]],
      color: '#f39c12'
    },
    L_SHAPE: {
      pattern: [[1, 0], [1, 0], [1, 1]],
      color: '#9b59b6'
    },
    L_REVERSE: {
      pattern: [[0, 1], [0, 1], [1, 1]],
      color: '#1abc9c'
    },
    T_SHAPE: {
      pattern: [[1, 1, 1], [0, 1, 0]],
      color: '#e67e22'
    },
    Z_SHAPE: {
      pattern: [[1, 1, 0], [0, 1, 1]],
      color: '#16a085'
    },
    SINGLE: {
      pattern: [[1]],
      color: '#c0392b'
    },
    SMALL_L: {
      pattern: [[1, 0], [1, 1]],
      color: '#8e44ad'
    }
  };

  constructor(shapeType) {
    const shapeData = Shape.SHAPES[shapeType];
    this.pattern = shapeData.pattern;
    this.color = shapeData.color;
    this.type = shapeType;
    this.element = null;
    this.isDragging = false;
    this.originalParent = null;
    this.originalPosition = null;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'shape';
    this.element.draggable = true;

    const rows = this.pattern.length;
    const cols = this.pattern[0].length;

    // Responsive cell size
    const viewportWidth = window.innerWidth;
    let cellSize = 30;
    let gap = 2;

    if (viewportWidth < 400) {
      cellSize = 22;
      gap = 1;
    } else if (viewportWidth < 768) {
      cellSize = 25;
      gap = 2;
    }

    this.cellSize = cellSize; // Store for use in drag manager

    this.element.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${cols}, ${cellSize}px);
      grid-template-rows: repeat(${rows}, ${cellSize}px);
      gap: ${gap}px;
      cursor: grab;
      user-select: none;
      padding: 5px;
    `;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = document.createElement('div');
        if (this.pattern[row][col]) {
          cell.style.cssText = `
            width: ${cellSize}px;
            height: ${cellSize}px;
            background-color: ${this.color};
            border-top: 4px solid rgba(255, 255, 255, 0.6);
            border-left: 4px solid rgba(255, 255, 255, 0.6);
            border-right: 4px solid rgba(0, 0, 0, 0.4);
            border-bottom: 4px solid rgba(0, 0, 0, 0.4);
            box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.4), inset -2px -2px 4px rgba(0, 0, 0, 0.3);
          `;
        } else {
          cell.style.cssText = `
            width: ${cellSize}px;
            height: ${cellSize}px;
            background-color: transparent;
          `;
        }
        this.element.appendChild(cell);
      }
    }

    return this.element;
  }

  createDragPreview() {
    const preview = document.createElement('div');
    preview.className = 'shape-preview';

    const rows = this.pattern.length;
    const cols = this.pattern[0].length;

    // Responsive cell size (same as createElement)
    const viewportWidth = window.innerWidth;
    let cellSize = 30;
    let gap = 2;

    if (viewportWidth < 400) {
      cellSize = 22;
      gap = 1;
    } else if (viewportWidth < 768) {
      cellSize = 25;
      gap = 2;
    }

    preview.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${cols}, ${cellSize}px);
      grid-template-rows: repeat(${rows}, ${cellSize}px);
      gap: ${gap}px;
      pointer-events: none;
      position: fixed;
      z-index: 1000;
      opacity: 0.7;
    `;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = document.createElement('div');
        if (this.pattern[row][col]) {
          cell.style.cssText = `
            width: ${cellSize}px;
            height: ${cellSize}px;
            background-color: ${this.color};
            border-top: 4px solid rgba(255, 255, 255, 0.6);
            border-left: 4px solid rgba(255, 255, 255, 0.6);
            border-right: 4px solid rgba(0, 0, 0, 0.4);
            border-bottom: 4px solid rgba(0, 0, 0, 0.4);
            box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.4), inset -2px -2px 4px rgba(0, 0, 0, 0.3);
          `;
        } else {
          cell.style.cssText = `
            width: ${cellSize}px;
            height: ${cellSize}px;
            background-color: transparent;
          `;
        }
        preview.appendChild(cell);
      }
    }

    return preview;
  }

  static getRandomShapeType() {
    const shapeTypes = Object.keys(Shape.SHAPES);
    return shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
  }
}
