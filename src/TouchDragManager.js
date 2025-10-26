export class TouchDragManager {
  constructor(gameBoard, shapeSelector, onShapePlaced) {
    this.gameBoard = gameBoard;
    this.shapeSelector = shapeSelector;
    this.onShapePlaced = onShapePlaced;
    this.draggedShape = null;
    this.dragPreview = null;
    this.currentHighlightPos = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  initialize() {
    this.setupTouchListeners();
  }

  setupTouchListeners() {
    this.shapeSelector.element.addEventListener('touchstart', (e) => {
      const shape = e.target.closest('.shape');
      if (shape) {
        this.handleTouchStart(e, shape);
      }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (this.draggedShape) {
        this.handleTouchMove(e);
      }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
      if (this.draggedShape) {
        this.handleTouchEnd(e);
      }
    }, { passive: false });

    document.addEventListener('touchcancel', (e) => {
      if (this.draggedShape) {
        this.handleTouchEnd(e);
      }
    }, { passive: false });
  }

  handleTouchStart(e, shapeElement) {
    e.preventDefault();

    this.draggedShape = this.shapeSelector.getShapeByElement(shapeElement);
    if (!this.draggedShape) return;

    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;

    // Store original position
    this.draggedShape.originalParent = shapeElement.parentElement;
    this.draggedShape.isDragging = true;

    // Create and add drag preview
    this.dragPreview = this.draggedShape.createDragPreview();
    document.body.appendChild(this.dragPreview);

    // Calculate center offset based on shape dimensions
    const rows = this.draggedShape.pattern.length;
    const cols = this.draggedShape.pattern[0].length;
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

    const totalWidth = cols * cellSize + (cols - 1) * gap;
    const totalHeight = rows * cellSize + (rows - 1) * gap;
    this.dragOffsetX = totalWidth / 2;
    this.dragOffsetY = totalHeight / 2;

    // Position preview at touch point
    this.dragPreview.style.left = `${touch.clientX - this.dragOffsetX}px`;
    this.dragPreview.style.top = `${touch.clientY - this.dragOffsetY}px`;

    // Make original semi-transparent
    shapeElement.style.opacity = '0.3';
  }

  handleTouchMove(e) {
    e.preventDefault();

    if (!this.draggedShape || !this.dragPreview) return;

    const touch = e.touches[0];

    // Update preview position
    this.dragPreview.style.left = `${touch.clientX - this.dragOffsetX}px`;
    this.dragPreview.style.top = `${touch.clientY - this.dragOffsetY}px`;

    // Check if over board and highlight
    const cell = this.gameBoard.getCellAtPosition(touch.clientX, touch.clientY);

    if (cell) {
      // Clear previous highlight
      if (this.currentHighlightPos) {
        this.gameBoard.highlightCells(
          this.draggedShape.pattern,
          this.currentHighlightPos.row,
          this.currentHighlightPos.col,
          false
        );
      }

      // Find the best placement position where touch is over any part of the shape
      const bestPosition = this.gameBoard.findBestPlacementPosition(
        this.draggedShape.pattern,
        cell.row,
        cell.col
      );

      if (bestPosition) {
        this.gameBoard.highlightCells(this.draggedShape.pattern, bestPosition.row, bestPosition.col, true);
        this.currentHighlightPos = bestPosition;
      } else {
        this.currentHighlightPos = null;
      }
    } else {
      // Clear highlight if not over board
      if (this.currentHighlightPos) {
        this.gameBoard.highlightCells(
          this.draggedShape.pattern,
          this.currentHighlightPos.row,
          this.currentHighlightPos.col,
          false
        );
        this.currentHighlightPos = null;
      }
    }
  }

  handleTouchEnd(e) {
    e.preventDefault();

    if (!this.draggedShape) return;

    const touch = e.changedTouches[0];

    // Clear highlight first
    if (this.currentHighlightPos) {
      this.gameBoard.highlightCells(
        this.draggedShape.pattern,
        this.currentHighlightPos.row,
        this.currentHighlightPos.col,
        false
      );
    }

    const cell = this.gameBoard.getCellAtPosition(touch.clientX, touch.clientY);

    if (cell) {
      // Find the best placement position
      const bestPosition = this.gameBoard.findBestPlacementPosition(
        this.draggedShape.pattern,
        cell.row,
        cell.col
      );

      if (bestPosition) {
        // Place the shape at the best position
        this.gameBoard.placeShape(this.draggedShape.pattern, bestPosition.row, bestPosition.col, this.draggedShape.color);

        // Clean up drag preview
        if (this.dragPreview && this.dragPreview.parentElement) {
          this.dragPreview.parentElement.removeChild(this.dragPreview);
        }
        this.dragPreview = null;

        // Remove shape element from DOM
        if (this.draggedShape.element && this.draggedShape.element.parentElement) {
          this.draggedShape.element.parentElement.removeChild(this.draggedShape.element);
        }

        // Remove shape from selector
        this.shapeSelector.removeShape(this.draggedShape);

        // Clear dragged shape reference
        const shapePlaced = true;
        this.draggedShape = null;
        this.currentHighlightPos = null;

        // Notify game
        if (this.onShapePlaced && shapePlaced) {
          this.onShapePlaced();
        }
        return;
      }
    }

    // If we get here, shape couldn't be placed
    {
      // Return shape to original position
      this.shapeSelector.returnShapeToSlot(this.draggedShape);

      // Remove preview
      if (this.dragPreview && this.dragPreview.parentElement) {
        this.dragPreview.parentElement.removeChild(this.dragPreview);
      }
      this.dragPreview = null;

      // Reset opacity
      if (this.draggedShape && this.draggedShape.element) {
        this.draggedShape.element.style.opacity = '1';
      }

      this.draggedShape = null;
      this.currentHighlightPos = null;
    }
  }
}
