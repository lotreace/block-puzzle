import { describe, it, expect, beforeEach } from 'vitest';
import { GameBoard } from './GameBoard.js';

describe('GameBoard', () => {
  let gameBoard;

  beforeEach(() => {
    gameBoard = new GameBoard(9);
  });

  describe('initialization', () => {
    it('should create a board with the correct size', () => {
      expect(gameBoard.size).toBe(9);
      expect(gameBoard.grid.length).toBe(9);
      expect(gameBoard.grid[0].length).toBe(9);
    });

    it('should initialize all cells as empty (false)', () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          expect(gameBoard.grid[row][col]).toBe(false);
        }
      }
    });

    it('should create DOM elements when createBoard is called', () => {
      const element = gameBoard.createBoard();
      expect(element).toBeDefined();
      expect(element.className).toBe('game-board');
      expect(gameBoard.cellElements.length).toBe(9);
    });
  });

  describe('canPlaceShape', () => {
    it('should allow placing a shape in empty space', () => {
      const pattern = [[1, 1], [1, 1]];
      expect(gameBoard.canPlaceShape(pattern, 0, 0)).toBe(true);
    });

    it('should not allow placing a shape out of bounds', () => {
      const pattern = [[1, 1], [1, 1]];
      expect(gameBoard.canPlaceShape(pattern, 8, 8)).toBe(false);
      expect(gameBoard.canPlaceShape(pattern, -1, 0)).toBe(false);
      expect(gameBoard.canPlaceShape(pattern, 0, -1)).toBe(false);
    });

    it('should not allow placing a shape on occupied cells', () => {
      const pattern = [[1, 1]];
      gameBoard.grid[0][0] = true;
      expect(gameBoard.canPlaceShape(pattern, 0, 0)).toBe(false);
    });

    it('should handle complex shapes correctly', () => {
      const lShape = [[1, 0], [1, 0], [1, 1]];
      expect(gameBoard.canPlaceShape(lShape, 0, 0)).toBe(true);
      expect(gameBoard.canPlaceShape(lShape, 7, 8)).toBe(false); // out of bounds
    });
  });

  describe('placeShape', () => {
    beforeEach(() => {
      gameBoard.createBoard();
    });

    it('should place a shape on the board', () => {
      const pattern = [[1, 1], [1, 1]];
      gameBoard.placeShape(pattern, 0, 0, '#ff0000');

      expect(gameBoard.grid[0][0]).toBe(true);
      expect(gameBoard.grid[0][1]).toBe(true);
      expect(gameBoard.grid[1][0]).toBe(true);
      expect(gameBoard.grid[1][1]).toBe(true);
    });

    it('should not place cells where pattern is 0', () => {
      const pattern = [[1, 0], [0, 1]];
      gameBoard.placeShape(pattern, 0, 0, '#ff0000');

      expect(gameBoard.grid[0][0]).toBe(true);
      expect(gameBoard.grid[0][1]).toBe(false);
      expect(gameBoard.grid[1][0]).toBe(false);
      expect(gameBoard.grid[1][1]).toBe(true);
    });
  });

  describe('checkAndClearLines', () => {
    beforeEach(() => {
      gameBoard.createBoard();
    });

    it('should clear a completed row', () => {
      // Fill entire first row
      for (let col = 0; col < 9; col++) {
        gameBoard.grid[0][col] = true;
      }

      const linesCleared = gameBoard.checkAndClearLines();
      expect(linesCleared).toBe(1);

      // Check that row is now empty
      for (let col = 0; col < 9; col++) {
        expect(gameBoard.grid[0][col]).toBe(false);
      }
    });

    it('should clear a completed column', () => {
      // Fill entire first column
      for (let row = 0; row < 9; row++) {
        gameBoard.grid[row][0] = true;
      }

      const linesCleared = gameBoard.checkAndClearLines();
      expect(linesCleared).toBe(1);

      // Check that column is now empty
      for (let row = 0; row < 9; row++) {
        expect(gameBoard.grid[row][0]).toBe(false);
      }
    });

    it('should clear multiple rows and columns simultaneously', () => {
      // Fill first row
      for (let col = 0; col < 9; col++) {
        gameBoard.grid[0][col] = true;
      }

      // Fill first column
      for (let row = 0; row < 9; row++) {
        gameBoard.grid[row][0] = true;
      }

      const linesCleared = gameBoard.checkAndClearLines();
      expect(linesCleared).toBe(2);
    });

    it('should return 0 when no lines are complete', () => {
      gameBoard.grid[0][0] = true;
      gameBoard.grid[1][1] = true;

      const linesCleared = gameBoard.checkAndClearLines();
      expect(linesCleared).toBe(0);
    });
  });

  describe('getCellAtPosition', () => {
    beforeEach(() => {
      gameBoard.createBoard();
      document.body.appendChild(gameBoard.element);
    });

    it('should return null for positions outside the board', () => {
      const result = gameBoard.getCellAtPosition(-100, -100);
      expect(result).toBeNull();
    });

    it('should return valid cell coordinates for positions on the board', () => {
      const rect = gameBoard.element.getBoundingClientRect();
      const x = rect.left + 15; // within first cell
      const y = rect.top + 15;

      const result = gameBoard.getCellAtPosition(x, y);
      expect(result).not.toBeNull();
      expect(result.row).toBeGreaterThanOrEqual(0);
      expect(result.col).toBeGreaterThanOrEqual(0);
    });
  });

  describe('highlightCells', () => {
    beforeEach(() => {
      gameBoard.createBoard();
    });

    it('should highlight valid cells', () => {
      const pattern = [[1, 1]];
      const originalColor = gameBoard.cellElements[0][0].style.backgroundColor;

      gameBoard.highlightCells(pattern, 0, 0, true);

      expect(gameBoard.cellElements[0][0].style.backgroundColor).not.toBe(originalColor);
      expect(gameBoard.cellElements[0][1].style.backgroundColor).not.toBe(originalColor);
    });

    it('should remove highlight when highlight is false', () => {
      const pattern = [[1, 1]];
      const emptyColor = 'rgb(52, 73, 94)'; // #34495e converted to rgb

      gameBoard.highlightCells(pattern, 0, 0, true);
      gameBoard.highlightCells(pattern, 0, 0, false);

      expect(gameBoard.cellElements[0][0].style.backgroundColor).toBe(emptyColor);
    });

    it('should not highlight occupied cells', () => {
      const pattern = [[1, 1]];
      gameBoard.grid[0][0] = true;
      const occupiedColor = gameBoard.cellElements[0][0].style.backgroundColor;

      gameBoard.highlightCells(pattern, 0, 0, true);

      // Occupied cell should not change color
      expect(gameBoard.cellElements[0][0].style.backgroundColor).toBe(occupiedColor);
    });
  });
});
