import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Game } from './Game.js';
import { GameBoard } from './GameBoard.js';
import { ShapeSelector } from './ShapeSelector.js';
import { ScoreManager } from './ScoreManager.js';

describe('Game', () => {
  let container;
  let game;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    game = new Game(container);
  });

  describe('initialization', () => {
    it('should create all required components', () => {
      expect(game.gameBoard).toBeInstanceOf(GameBoard);
      expect(game.shapeSelector).toBeInstanceOf(ShapeSelector);
      expect(game.scoreManager).toBeInstanceOf(ScoreManager);
    });

    it('should store container reference', () => {
      expect(game.container).toBe(container);
    });

    it('should have null dragDropManager initially', () => {
      expect(game.dragDropManager).toBeNull();
    });
  });

  describe('initialize', () => {
    it('should call setupUI', () => {
      const spy = vi.spyOn(game, 'setupUI');
      game.initialize();
      expect(spy).toHaveBeenCalled();
    });

    it('should create dragDropManager', () => {
      game.initialize();
      expect(game.dragDropManager).not.toBeNull();
    });

    it('should render all components to container', () => {
      game.initialize();

      const title = container.querySelector('h1');
      expect(title).not.toBeNull();
      expect(title.textContent).toBe('Block Puzzle');

      expect(container.querySelector('.score-display')).not.toBeNull();
      expect(container.querySelector('.game-board')).not.toBeNull();
      expect(container.querySelector('.shape-selector')).not.toBeNull();
    });
  });

  describe('handleShapePlaced', () => {
    beforeEach(() => {
      game.initialize();
    });

    it('should check and clear lines after shape placement', () => {
      const spy = vi.spyOn(game.gameBoard, 'checkAndClearLines');
      game.handleShapePlaced();
      expect(spy).toHaveBeenCalled();
    });

    it('should update score when lines are cleared', () => {
      // Fill a row
      for (let col = 0; col < 9; col++) {
        game.gameBoard.grid[0][col] = true;
      }

      const initialScore = game.scoreManager.score;
      game.handleShapePlaced();

      expect(game.scoreManager.score).toBeGreaterThan(initialScore);
    });

    it('should not update score when no lines are cleared', () => {
      game.gameBoard.grid[0][0] = true;
      game.gameBoard.grid[1][1] = true;

      const initialScore = game.scoreManager.score;
      game.handleShapePlaced();

      expect(game.scoreManager.score).toBe(initialScore);
    });

    it('should call checkAndRefillSlots', () => {
      const spy = vi.spyOn(game.shapeSelector, 'checkAndRefillSlots');
      game.handleShapePlaced();
      expect(spy).toHaveBeenCalled();
    });

    it('should check for game over', () => {
      const spy = vi.spyOn(game, 'checkGameOver');
      game.handleShapePlaced();
      expect(spy).toHaveBeenCalled();
    });

    it('should award correct points for multiple lines', () => {
      // Fill first row and first column
      for (let col = 0; col < 9; col++) {
        game.gameBoard.grid[0][col] = true;
      }
      for (let row = 0; row < 9; row++) {
        game.gameBoard.grid[row][0] = true;
      }

      game.handleShapePlaced();

      // 2 lines cleared = 200 points
      expect(game.scoreManager.score).toBe(200);
    });
  });

  describe('checkGameOver', () => {
    beforeEach(() => {
      game.initialize();
    });

    it('should not trigger game over when shapes can be placed', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      game.checkGameOver();

      expect(alertSpy).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('should not check game over when no shapes available', () => {
      game.shapeSelector.shapes = [null, null, null];

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      game.checkGameOver();

      expect(alertSpy).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('should trigger game over when board is full', () => {
      // Fill entire board
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          game.gameBoard.grid[row][col] = true;
        }
      }

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const resetSpy = vi.spyOn(game, 'resetGame');

      // Need to wait for setTimeout
      vi.useFakeTimers();
      game.checkGameOver();
      vi.runAllTimers();

      expect(alertSpy).toHaveBeenCalled();
      expect(resetSpy).toHaveBeenCalled();

      vi.useRealTimers();
      alertSpy.mockRestore();
    });
  });

  describe('resetGame', () => {
    beforeEach(() => {
      game.initialize();
    });

    it('should clear the board', () => {
      // Fill some cells
      game.gameBoard.grid[0][0] = true;
      game.gameBoard.grid[1][1] = true;

      game.resetGame();

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          expect(game.gameBoard.grid[row][col]).toBe(false);
        }
      }
    });

    it('should reset score to 0', () => {
      game.scoreManager.score = 500;
      game.scoreManager.updateDisplay();

      game.resetGame();

      expect(game.scoreManager.score).toBe(0);
    });

    it('should reset shapes', () => {
      const oldShapes = [...game.shapeSelector.shapes];

      game.resetGame();

      // Should have new shapes
      expect(game.shapeSelector.shapes.length).toBe(3);
      game.shapeSelector.shapes.forEach((newShape, index) => {
        expect(newShape).not.toBe(oldShapes[index]);
      });
    });

    it('should reset cell colors', () => {
      const emptyColor = 'rgb(52, 73, 94)'; // #34495e

      // Color some cells
      game.gameBoard.cellElements[0][0].style.backgroundColor = '#ff0000';

      game.resetGame();

      expect(game.gameBoard.cellElements[0][0].style.backgroundColor).toBe(emptyColor);
    });
  });

  describe('scoring integration', () => {
    beforeEach(() => {
      game.initialize();
    });

    it('should award 100 points per line cleared', () => {
      // Fill one row
      for (let col = 0; col < 9; col++) {
        game.gameBoard.grid[0][col] = true;
      }

      game.handleShapePlaced();
      expect(game.scoreManager.score).toBe(100);
    });

    it('should accumulate score across multiple clears', () => {
      // Clear first line
      for (let col = 0; col < 9; col++) {
        game.gameBoard.grid[0][col] = true;
      }
      game.handleShapePlaced();

      // Clear second line
      for (let col = 0; col < 9; col++) {
        game.gameBoard.grid[1][col] = true;
      }
      game.handleShapePlaced();

      expect(game.scoreManager.score).toBe(200);
    });
  });

  describe('shape placement integration', () => {
    beforeEach(() => {
      game.initialize();
    });

    it('should place shape on board correctly', () => {
      const pattern = [[1, 1], [1, 1]];
      const canPlace = game.gameBoard.canPlaceShape(pattern, 0, 0);
      expect(canPlace).toBe(true);

      game.gameBoard.placeShape(pattern, 0, 0, '#ff0000');

      expect(game.gameBoard.grid[0][0]).toBe(true);
      expect(game.gameBoard.grid[0][1]).toBe(true);
      expect(game.gameBoard.grid[1][0]).toBe(true);
      expect(game.gameBoard.grid[1][1]).toBe(true);
    });

    it('should prevent placing overlapping shapes', () => {
      const pattern = [[1, 1], [1, 1]];

      game.gameBoard.placeShape(pattern, 0, 0, '#ff0000');
      const canPlaceOverlap = game.gameBoard.canPlaceShape(pattern, 0, 0);

      expect(canPlaceOverlap).toBe(false);
    });
  });

  describe('UI components', () => {
    beforeEach(() => {
      game.initialize();
    });

    it('should display score value', () => {
      const scoreValue = container.querySelector('.score-value');
      expect(scoreValue).not.toBeNull();
      expect(scoreValue.textContent).toBe('0');
    });

    it('should update score display when score changes', () => {
      game.scoreManager.addScore(3); // 3 lines = 300 points

      const scoreValue = container.querySelector('.score-value');
      expect(scoreValue.textContent).toBe('300');
    });

    it('should create 9x9 grid of cells', () => {
      const cells = container.querySelectorAll('.board-cell');
      expect(cells.length).toBe(81); // 9 * 9
    });

    it('should create 3 shape slots', () => {
      const slots = container.querySelectorAll('.shape-slot');
      expect(slots.length).toBe(3);
    });

    it('should populate slots with shapes initially', () => {
      const shapes = container.querySelectorAll('.shape');
      expect(shapes.length).toBe(3);
    });
  });
});
