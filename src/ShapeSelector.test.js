import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShapeSelector } from './ShapeSelector.js';
import { Shape } from './Shape.js';

describe('ShapeSelector', () => {
  let shapeSelector;

  beforeEach(() => {
    shapeSelector = new ShapeSelector();
  });

  describe('initialization', () => {
    it('should initialize with empty shapes array', () => {
      expect(shapeSelector.shapes).toEqual([]);
    });

    it('should initialize with null element', () => {
      expect(shapeSelector.element).toBeNull();
    });

    it('should initialize with empty slots array', () => {
      expect(shapeSelector.slots).toEqual([]);
    });
  });

  describe('createElement', () => {
    it('should create the selector element', () => {
      const element = shapeSelector.createElement();
      expect(element).toBeDefined();
      expect(element.className).toBe('shape-selector');
    });

    it('should create 3 slots', () => {
      shapeSelector.createElement();
      expect(shapeSelector.slots.length).toBe(3);
    });

    it('should fill all slots with shapes initially', () => {
      shapeSelector.createElement();
      expect(shapeSelector.shapes.length).toBe(3);
      shapeSelector.shapes.forEach(shape => {
        expect(shape).toBeInstanceOf(Shape);
      });
    });

    it('should append shape elements to slots', () => {
      shapeSelector.createElement();
      shapeSelector.slots.forEach(slot => {
        expect(slot.children.length).toBe(1);
        expect(slot.children[0].className).toBe('shape');
      });
    });
  });

  describe('fillSlots', () => {
    beforeEach(() => {
      shapeSelector.createElement();
    });

    it('should fill empty slots with new shapes', () => {
      shapeSelector.shapes = [null, null, null];
      shapeSelector.fillSlots();

      expect(shapeSelector.shapes.every(shape => shape !== null)).toBe(true);
    });

    it('should not replace existing shapes', () => {
      const existingShape = shapeSelector.shapes[0];
      shapeSelector.fillSlots();

      expect(shapeSelector.shapes[0]).toBe(existingShape);
    });

    it('should fill only null slots', () => {
      const shape1 = shapeSelector.shapes[0];
      const shape2 = shapeSelector.shapes[1];
      shapeSelector.shapes[2] = null;

      shapeSelector.fillSlots();

      expect(shapeSelector.shapes[0]).toBe(shape1);
      expect(shapeSelector.shapes[1]).toBe(shape2);
      expect(shapeSelector.shapes[2]).not.toBeNull();
    });

    it('should create shape elements and append to slots', () => {
      shapeSelector.shapes = [null, null, null];
      shapeSelector.fillSlots();

      shapeSelector.shapes.forEach((shape, index) => {
        expect(shape.element).toBeDefined();
        expect(shapeSelector.slots[index].contains(shape.element)).toBe(true);
      });
    });
  });

  describe('getShapeByElement', () => {
    beforeEach(() => {
      shapeSelector.createElement();
    });

    it('should return shape matching the element', () => {
      const targetShape = shapeSelector.shapes[1];
      const result = shapeSelector.getShapeByElement(targetShape.element);

      expect(result).toBe(targetShape);
    });

    it('should return undefined for non-existent element', () => {
      const fakeElement = document.createElement('div');
      const result = shapeSelector.getShapeByElement(fakeElement);

      expect(result).toBeUndefined();
    });

    it('should handle null shapes in array', () => {
      shapeSelector.shapes[1] = null;
      const targetShape = shapeSelector.shapes[0];

      const result = shapeSelector.getShapeByElement(targetShape.element);
      expect(result).toBe(targetShape);
    });
  });

  describe('removeShape', () => {
    beforeEach(() => {
      shapeSelector.createElement();
    });

    it('should set shape to null when removed', () => {
      const shapeToRemove = shapeSelector.shapes[0];
      shapeSelector.removeShape(shapeToRemove);

      expect(shapeSelector.shapes[0]).toBeNull();
    });

    it('should call checkAndRefillSlots after removal', () => {
      const spy = vi.spyOn(shapeSelector, 'checkAndRefillSlots');
      const shapeToRemove = shapeSelector.shapes[0];

      shapeSelector.removeShape(shapeToRemove);

      expect(spy).toHaveBeenCalled();
    });

    it('should handle removing non-existent shape gracefully', () => {
      const fakeShape = new Shape('SQUARE_2X2');
      expect(() => shapeSelector.removeShape(fakeShape)).not.toThrow();
    });
  });

  describe('returnShapeToSlot', () => {
    beforeEach(() => {
      shapeSelector.createElement();
    });

    it('should return shape to its original slot', () => {
      const shape = shapeSelector.shapes[1];
      const slot = shapeSelector.slots[1];

      // Remove from DOM
      shape.element.remove();

      // Return to slot
      shapeSelector.returnShapeToSlot(shape);

      expect(slot.contains(shape.element)).toBe(true);
    });

    it('should clear slot before returning shape', () => {
      const shape = shapeSelector.shapes[1];
      const slot = shapeSelector.slots[1];

      // Add extra element to slot
      const extraElement = document.createElement('div');
      slot.appendChild(extraElement);

      shapeSelector.returnShapeToSlot(shape);

      expect(slot.children.length).toBe(1);
      expect(slot.children[0]).toBe(shape.element);
    });

    it('should handle returning non-existent shape gracefully', () => {
      const fakeShape = new Shape('SQUARE_2X2');
      fakeShape.createElement();

      expect(() => shapeSelector.returnShapeToSlot(fakeShape)).not.toThrow();
    });
  });

  describe('checkAndRefillSlots', () => {
    beforeEach(() => {
      shapeSelector.createElement();
    });

    it('should refill all slots when all shapes are null', () => {
      shapeSelector.shapes = [null, null, null];
      shapeSelector.checkAndRefillSlots();

      expect(shapeSelector.shapes.length).toBe(3);
      expect(shapeSelector.shapes.every(shape => shape !== null)).toBe(true);
    });

    it('should not refill if some shapes remain', () => {
      const originalShape = shapeSelector.shapes[0];
      shapeSelector.shapes[1] = null;
      shapeSelector.shapes[2] = null;

      shapeSelector.checkAndRefillSlots();

      expect(shapeSelector.shapes[0]).toBe(originalShape);
      expect(shapeSelector.shapes[1]).toBeNull();
      expect(shapeSelector.shapes[2]).toBeNull();
    });

    it('should create new shapes when refilling', () => {
      const oldShapes = [...shapeSelector.shapes];
      shapeSelector.shapes = [null, null, null];

      shapeSelector.checkAndRefillSlots();

      shapeSelector.shapes.forEach((newShape, index) => {
        expect(newShape).not.toBe(oldShapes[index]);
        expect(newShape).toBeInstanceOf(Shape);
      });
    });
  });

  describe('hasAvailableShapes', () => {
    beforeEach(() => {
      shapeSelector.createElement();
    });

    it('should return true when shapes are available', () => {
      expect(shapeSelector.hasAvailableShapes()).toBe(true);
    });

    it('should return false when all shapes are null', () => {
      shapeSelector.shapes = [null, null, null];
      expect(shapeSelector.hasAvailableShapes()).toBe(false);
    });

    it('should return true if at least one shape exists', () => {
      shapeSelector.shapes[0] = null;
      shapeSelector.shapes[1] = null;
      // shapes[2] still has a shape

      expect(shapeSelector.hasAvailableShapes()).toBe(true);
    });
  });

  describe('getAvailableShapes', () => {
    beforeEach(() => {
      shapeSelector.createElement();
    });

    it('should return all shapes when none are null', () => {
      const available = shapeSelector.getAvailableShapes();
      expect(available.length).toBe(3);
    });

    it('should filter out null shapes', () => {
      shapeSelector.shapes[1] = null;
      const available = shapeSelector.getAvailableShapes();

      expect(available.length).toBe(2);
      expect(available.every(shape => shape !== null)).toBe(true);
    });

    it('should return empty array when all shapes are null', () => {
      shapeSelector.shapes = [null, null, null];
      const available = shapeSelector.getAvailableShapes();

      expect(available).toEqual([]);
    });

    it('should return actual shape instances', () => {
      const available = shapeSelector.getAvailableShapes();
      available.forEach(shape => {
        expect(shape).toBeInstanceOf(Shape);
      });
    });
  });
});
