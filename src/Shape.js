export class Shape {
  static SHAPES = {
    // I pieces - 2 rotations
    I_HORIZONTAL_3: {
      pattern: [[1, 1, 1]],
      color: '#e74c3c'
    },
    I_VERTICAL_3: {
      pattern: [[1], [1], [1]],
      color: '#e74c3c'
    },
    I_HORIZONTAL_4: {
      pattern: [[1, 1, 1, 1]],
      color: '#3498db'
    },
    I_VERTICAL_4: {
      pattern: [[1], [1], [1], [1]],
      color: '#3498db'
    },
    I_HORIZONTAL_5: {
      pattern: [[1, 1, 1, 1, 1]],
      color: '#e67e22'
    },
    I_VERTICAL_5: {
      pattern: [[1], [1], [1], [1], [1]],
      color: '#e67e22'
    },

    // Square - no rotation needed
    SQUARE_2X2: {
      pattern: [[1, 1], [1, 1]],
      color: '#f39c12'
    },
    SQUARE_3X3: {
      pattern: [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
      color: '#f1c40f'
    },

    // L shapes - 4 rotations each
    L_SHAPE_0: {
      pattern: [[1, 0], [1, 0], [1, 1]],
      color: '#9b59b6'
    },
    L_SHAPE_90: {
      pattern: [[1, 1, 1], [1, 0, 0]],
      color: '#9b59b6'
    },
    L_SHAPE_180: {
      pattern: [[1, 1], [0, 1], [0, 1]],
      color: '#9b59b6'
    },
    L_SHAPE_270: {
      pattern: [[0, 0, 1], [1, 1, 1]],
      color: '#9b59b6'
    },

    // Reverse L shapes - 4 rotations
    L_REVERSE_0: {
      pattern: [[0, 1], [0, 1], [1, 1]],
      color: '#1abc9c'
    },
    L_REVERSE_90: {
      pattern: [[1, 0, 0], [1, 1, 1]],
      color: '#1abc9c'
    },
    L_REVERSE_180: {
      pattern: [[1, 1], [1, 0], [1, 0]],
      color: '#1abc9c'
    },
    L_REVERSE_270: {
      pattern: [[1, 1, 1], [0, 0, 1]],
      color: '#1abc9c'
    },

    // T shapes - 4 rotations
    T_SHAPE_0: {
      pattern: [[1, 1, 1], [0, 1, 0]],
      color: '#e67e22'
    },
    T_SHAPE_90: {
      pattern: [[0, 1], [1, 1], [0, 1]],
      color: '#e67e22'
    },
    T_SHAPE_180: {
      pattern: [[0, 1, 0], [1, 1, 1]],
      color: '#e67e22'
    },
    T_SHAPE_270: {
      pattern: [[1, 0], [1, 1], [1, 0]],
      color: '#e67e22'
    },

    // Z shapes - 2 rotations
    Z_SHAPE_0: {
      pattern: [[1, 1, 0], [0, 1, 1]],
      color: '#16a085'
    },
    Z_SHAPE_90: {
      pattern: [[0, 1], [1, 1], [1, 0]],
      color: '#16a085'
    },

    // S shapes (reverse Z) - 2 rotations
    S_SHAPE_0: {
      pattern: [[0, 1, 1], [1, 1, 0]],
      color: '#27ae60'
    },
    S_SHAPE_90: {
      pattern: [[1, 0], [1, 1], [0, 1]],
      color: '#27ae60'
    },

    // Small L shapes - 4 rotations
    SMALL_L_0: {
      pattern: [[1, 0], [1, 1]],
      color: '#8e44ad'
    },
    SMALL_L_90: {
      pattern: [[1, 1], [1, 0]],
      color: '#8e44ad'
    },
    SMALL_L_180: {
      pattern: [[1, 1], [0, 1]],
      color: '#8e44ad'
    },
    SMALL_L_270: {
      pattern: [[0, 1], [1, 1]],
      color: '#8e44ad'
    },

    // Single block
    SINGLE: {
      pattern: [[1]],
      color: '#c0392b'
    },

    // 2x1 blocks
    TWO_HORIZONTAL: {
      pattern: [[1, 1]],
      color: '#d35400'
    },
    TWO_VERTICAL: {
      pattern: [[1], [1]],
      color: '#d35400'
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
