import { describe, it, expect, beforeEach } from 'vitest';
import { Shape } from './Shape.js';

describe('Shape', () => {
  describe('SHAPES constant', () => {
    it('should have predefined shapes', () => {
      expect(Shape.SHAPES).toBeDefined();
      expect(Object.keys(Shape.SHAPES).length).toBeGreaterThan(0);
    });

    it('should have required properties for each shape', () => {
      Object.values(Shape.SHAPES).forEach(shape => {
        expect(shape).toHaveProperty('pattern');
        expect(shape).toHaveProperty('color');
        expect(Array.isArray(shape.pattern)).toBe(true);
        expect(shape.pattern.length).toBeGreaterThan(0);
      });
    });

    it('should have valid patterns (2D arrays)', () => {
      Object.values(Shape.SHAPES).forEach(shape => {
        shape.pattern.forEach(row => {
          expect(Array.isArray(row)).toBe(true);
          row.forEach(cell => {
            expect([0, 1]).toContain(cell);
          });
        });
      });
    });

    it('should have valid color hex codes', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      Object.values(Shape.SHAPES).forEach(shape => {
        expect(hexColorRegex.test(shape.color)).toBe(true);
      });
    });
  });

  describe('constructor', () => {
    it('should create a shape with valid type', () => {
      const shape = new Shape('SQUARE_2X2');
      expect(shape.type).toBe('SQUARE_2X2');
      expect(shape.pattern).toEqual([[1, 1], [1, 1]]);
      expect(shape.color).toBe('#f39c12');
    });

    it('should initialize with null element', () => {
      const shape = new Shape('SQUARE_2X2');
      expect(shape.element).toBeNull();
    });

    it('should initialize dragging state', () => {
      const shape = new Shape('SQUARE_2X2');
      expect(shape.isDragging).toBe(false);
      expect(shape.originalParent).toBeNull();
      expect(shape.originalPosition).toBeNull();
    });
  });

  describe('createElement', () => {
    it('should create DOM element for the shape', () => {
      const shape = new Shape('SQUARE_2X2');
      const element = shape.createElement();

      expect(element).toBeDefined();
      expect(element.className).toBe('shape');
      expect(element.draggable).toBe(true);
    });

    it('should create correct number of cells', () => {
      const shape = new Shape('I_HORIZONTAL_3');
      const element = shape.createElement();

      // I_HORIZONTAL_3 is 1x3, so should have 3 children
      expect(element.children.length).toBe(3);
    });

    it('should create a 2x2 grid for SQUARE shape', () => {
      const shape = new Shape('SQUARE_2X2');
      const element = shape.createElement();

      expect(element.children.length).toBe(4); // 2x2 = 4 cells
    });

    it('should apply color to filled cells only', () => {
      const shape = new Shape('L_SHAPE_0'); // Has pattern [[1, 0], [1, 0], [1, 1]]
      const element = shape.createElement();

      const cells = Array.from(element.children);
      // Check that some cells have color and some are transparent
      const coloredCells = cells.filter(cell =>
        cell.style.backgroundColor && cell.style.backgroundColor !== 'transparent'
      );
      expect(coloredCells.length).toBe(4); // L_SHAPE_0 has 4 filled cells
    });

    it('should set element property', () => {
      const shape = new Shape('SQUARE_2X2');
      expect(shape.element).toBeNull();

      shape.createElement();
      expect(shape.element).not.toBeNull();
    });
  });

  describe('createDragPreview', () => {
    it('should create a drag preview element', () => {
      const shape = new Shape('SQUARE_2X2');
      const preview = shape.createDragPreview();

      expect(preview).toBeDefined();
      expect(preview.className).toBe('shape-preview');
      expect(preview.style.position).toBe('fixed');
      expect(preview.style.pointerEvents).toBe('none');
    });

    it('should create preview with same pattern as shape', () => {
      const shape = new Shape('I_HORIZONTAL_3');
      const preview = shape.createDragPreview();

      expect(preview.children.length).toBe(3); // I_HORIZONTAL_3 has 3 cells
    });

    it('should have opacity set', () => {
      const shape = new Shape('SQUARE_2X2');
      const preview = shape.createDragPreview();

      expect(preview.style.opacity).toBe('0.7');
    });
  });

  describe('getRandomShapeType', () => {
    it('should return a valid shape type', () => {
      const shapeType = Shape.getRandomShapeType();
      expect(Shape.SHAPES[shapeType]).toBeDefined();
    });

    it('should return different shapes over multiple calls', () => {
      const shapes = new Set();
      for (let i = 0; i < 50; i++) {
        shapes.add(Shape.getRandomShapeType());
      }
      // Should get at least a few different shapes in 50 tries
      expect(shapes.size).toBeGreaterThan(1);
    });

    it('should only return existing shape types', () => {
      const validTypes = Object.keys(Shape.SHAPES);
      for (let i = 0; i < 20; i++) {
        const type = Shape.getRandomShapeType();
        expect(validTypes).toContain(type);
      }
    });
  });

  describe('specific shapes', () => {
    it('should create I_HORIZONTAL correctly', () => {
      const shape = new Shape('I_HORIZONTAL_3');
      expect(shape.pattern).toEqual([[1, 1, 1]]);
    });

    it('should create I_VERTICAL correctly', () => {
      const shape = new Shape('I_VERTICAL_3');
      expect(shape.pattern).toEqual([[1], [1], [1]]);
    });

    it('should create SQUARE correctly', () => {
      const shape = new Shape('SQUARE_2X2');
      expect(shape.pattern).toEqual([[1, 1], [1, 1]]);
    });

    it('should create L_SHAPE correctly', () => {
      const shape = new Shape('L_SHAPE_0');
      expect(shape.pattern).toEqual([[1, 0], [1, 0], [1, 1]]);
    });

    it('should create T_SHAPE correctly', () => {
      const shape = new Shape('T_SHAPE_0');
      expect(shape.pattern).toEqual([[1, 1, 1], [0, 1, 0]]);
    });

    it('should create SINGLE correctly', () => {
      const shape = new Shape('SINGLE');
      expect(shape.pattern).toEqual([[1]]);
    });
  });
});
