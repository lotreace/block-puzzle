export class DragDropManager {
  constructor(gameBoard, shapeSelector, onShapePlaced) {
    this.gameBoard = gameBoard;
    this.shapeSelector = shapeSelector;
    this.onShapePlaced = onShapePlaced;
    this.draggedShape = null;
    this.dragPreview = null;
    this.currentHighlightPos = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
  }

  initialize() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Use event delegation for shapes
    this.shapeSelector.element.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('shape')) {
        this.handleDragStart(e);
      }
    });

    this.shapeSelector.element.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('shape')) {
        this.handleDragEnd(e);
      }
    });

    // Board events
    this.gameBoard.element.addEventListener('dragover', (e) => {
      this.handleDragOver(e);
    });

    this.gameBoard.element.addEventListener('drop', (e) => {
      this.handleDrop(e);
    });

    this.gameBoard.element.addEventListener('dragleave', (e) => {
      this.handleDragLeave(e);
    });

    // Document-level drag events for preview
    document.addEventListener('drag', (e) => {
      this.updateDragPreview(e);
    });
  }

  handleDragStart(e) {
    this.draggedShape = this.shapeSelector.getShapeByElement(e.target);

    if (!this.draggedShape) return;

    // Store original position
    this.draggedShape.originalParent = e.target.parentElement;
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

    // Make original semi-transparent
    e.target.style.opacity = '0.3';

    // Set drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);

    // Hide default drag ghost
    const emptyImage = new Image();
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
  }

  handleDragEnd(e) {
    // Remove preview
    if (this.dragPreview && this.dragPreview.parentElement) {
      this.dragPreview.parentElement.removeChild(this.dragPreview);
    }
    this.dragPreview = null;

    // Clear highlights
    if (this.currentHighlightPos) {
      this.gameBoard.highlightCells(
        this.draggedShape.pattern,
        this.currentHighlightPos.row,
        this.currentHighlightPos.col,
        false
      );
      this.currentHighlightPos = null;
    }

    // Reset opacity
    if (this.draggedShape && this.draggedShape.element) {
      this.draggedShape.element.style.opacity = '1';
      this.draggedShape.isDragging = false;
    }

    this.draggedShape = null;
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (!this.draggedShape) return;

    const cell = this.gameBoard.getCellAtPosition(e.clientX, e.clientY);

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

      // Check if shape can be placed
      if (this.gameBoard.canPlaceShape(this.draggedShape.pattern, cell.row, cell.col)) {
        this.gameBoard.highlightCells(this.draggedShape.pattern, cell.row, cell.col, true);
        this.currentHighlightPos = cell;
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

  handleDrop(e) {
    e.preventDefault();

    if (!this.draggedShape) return;

    // Clear highlight first
    if (this.currentHighlightPos) {
      this.gameBoard.highlightCells(
        this.draggedShape.pattern,
        this.currentHighlightPos.row,
        this.currentHighlightPos.col,
        false
      );
      this.currentHighlightPos = null;
    }

    const cell = this.gameBoard.getCellAtPosition(e.clientX, e.clientY);

    if (cell && this.gameBoard.canPlaceShape(this.draggedShape.pattern, cell.row, cell.col)) {
      // Place the shape
      this.gameBoard.placeShape(this.draggedShape.pattern, cell.row, cell.col, this.draggedShape.color);

      // Clean up drag preview immediately
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
      this.draggedShape = null;

      // Notify game
      if (this.onShapePlaced) {
        this.onShapePlaced();
      }
    } else {
      // Return shape to original position
      this.shapeSelector.returnShapeToSlot(this.draggedShape);
    }
  }

  handleDragLeave(e) {
    // Only handle leave if we're leaving the board entirely
    if (e.target === this.gameBoard.element) {
      if (this.currentHighlightPos && this.draggedShape) {
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

  updateDragPreview(e) {
    if (this.dragPreview && e.clientX && e.clientY) {
      this.dragPreview.style.left = `${e.clientX - this.dragOffsetX}px`;
      this.dragPreview.style.top = `${e.clientY - this.dragOffsetY}px`;
    }
  }
}
