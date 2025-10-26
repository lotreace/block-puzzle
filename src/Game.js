import { GameBoard } from './GameBoard.js';
import { ShapeSelector } from './ShapeSelector.js';
import { ScoreManager } from './ScoreManager.js';
import { DragDropManager } from './DragDropManager.js';
import { TouchDragManager } from './TouchDragManager.js';

export class Game {
  constructor(container) {
    this.container = container;
    this.gameBoard = new GameBoard(8);
    this.shapeSelector = new ShapeSelector();
    this.scoreManager = new ScoreManager();
    this.dragDropManager = null;
    this.touchDragManager = null;
  }

  initialize() {
    this.setupUI();

    // Initialize both mouse and touch drag managers
    this.dragDropManager = new DragDropManager(
      this.gameBoard,
      this.shapeSelector,
      () => this.handleShapePlaced()
    );
    this.dragDropManager.initialize();

    this.touchDragManager = new TouchDragManager(
      this.gameBoard,
      this.shapeSelector,
      () => this.handleShapePlaced()
    );
    this.touchDragManager.initialize();
  }

  setupUI() {
    this.container.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;

    // Title
    const title = document.createElement('h1');
    title.textContent = 'Block Puzzle';
    title.style.cssText = `
      color: #ecf0f1;
      margin-bottom: 10px;
      font-size: clamp(24px, 8vw, 48px);
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    `;
    this.container.appendChild(title);

    // Score display
    this.container.appendChild(this.scoreManager.createElement());

    // Game board
    this.container.appendChild(this.gameBoard.createBoard());

    // Shape selector
    this.container.appendChild(this.shapeSelector.createElement());

    // Instructions
    const instructions = document.createElement('div');
    instructions.style.cssText = `
      color: #ecf0f1;
      margin-top: 10px;
      text-align: center;
      max-width: 90%;
      line-height: 1.4;
      font-size: clamp(12px, 3.5vw, 16px);
      padding: 0 10px;
    `;
    instructions.innerHTML = `
      <p><strong>How to Play:</strong></p>
      <p>Drag and drop shapes onto the board. Complete rows or columns to clear them!</p>
      <p>Each cleared line = 100 points</p>
    `;
    this.container.appendChild(instructions);
  }

  handleShapePlaced() {
    // Check and clear completed lines
    const linesCleared = this.gameBoard.checkAndClearLines();

    // Update score
    if (linesCleared > 0) {
      this.scoreManager.addScore(linesCleared);
    }

    // Check if we need to refill shapes
    this.shapeSelector.checkAndRefillSlots();

    // Check for game over
    this.checkGameOver();
  }

  checkGameOver() {
    const availableShapes = this.shapeSelector.getAvailableShapes();

    if (availableShapes.length === 0) {
      return; // All shapes used, waiting for refill
    }

    // Check if any available shape can be placed anywhere on the board
    let canPlaceAnyShape = false;

    for (const shape of availableShapes) {
      for (let row = 0; row < this.gameBoard.size; row++) {
        for (let col = 0; col < this.gameBoard.size; col++) {
          if (this.gameBoard.canPlaceShape(shape.pattern, row, col)) {
            canPlaceAnyShape = true;
            break;
          }
        }
        if (canPlaceAnyShape) break;
      }
      if (canPlaceAnyShape) break;
    }

    if (!canPlaceAnyShape) {
      setTimeout(() => {
        alert(`Game Over! Your score: ${this.scoreManager.score}`);
        this.resetGame();
      }, 300);
    }
  }

  resetGame() {
    // Clear the board
    for (let row = 0; row < this.gameBoard.size; row++) {
      for (let col = 0; col < this.gameBoard.size; col++) {
        this.gameBoard.grid[row][col] = false;
        const cell = this.gameBoard.cellElements[row][col];
        cell.style.backgroundColor = '#34495e';
        cell.style.border = '1px solid #2c3e50';
        cell.style.boxShadow = 'none';
      }
    }

    // Reset score
    this.scoreManager.reset();

    // Reset shapes
    this.shapeSelector.shapes = [];
    this.shapeSelector.fillSlots();
  }
}
