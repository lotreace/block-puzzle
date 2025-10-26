import { Shape } from './Shape.js';

export class ShapeSelector {
  constructor() {
    this.shapes = [];
    this.element = null;
    this.slots = [];
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'shape-selector';
    this.element.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 40px;
      padding: 30px;
      background-color: #2c3e50;
      border-radius: 8px;
      margin-top: 20px;
      min-height: 150px;
    `;

    // Create 3 slots
    for (let i = 0; i < 3; i++) {
      const slot = document.createElement('div');
      slot.className = 'shape-slot';
      slot.dataset.slotIndex = i;
      slot.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 120px;
        min-height: 120px;
        background-color: #34495e;
        border-radius: 8px;
        border: 2px dashed #7f8c8d;
      `;
      this.element.appendChild(slot);
      this.slots.push(slot);
    }

    this.fillSlots();

    return this.element;
  }

  fillSlots() {
    this.slots.forEach((slot, index) => {
      if (!this.shapes[index] || !this.shapes[index].element || !this.shapes[index].element.parentElement) {
        const shapeType = Shape.getRandomShapeType();
        const shape = new Shape(shapeType);
        const shapeElement = shape.createElement();

        slot.innerHTML = '';
        slot.appendChild(shapeElement);

        this.shapes[index] = shape;
      }
    });
  }

  getShapeByElement(element) {
    return this.shapes.find(shape => shape && shape.element === element);
  }

  removeShape(shape) {
    const index = this.shapes.indexOf(shape);
    if (index !== -1) {
      this.shapes[index] = null;
      this.checkAndRefillSlots();
    }
  }

  returnShapeToSlot(shape) {
    const index = this.shapes.indexOf(shape);
    if (index !== -1 && this.slots[index]) {
      this.slots[index].innerHTML = '';
      this.slots[index].appendChild(shape.element);
    }
  }

  checkAndRefillSlots() {
    // Check if all shapes are used
    const allUsed = this.shapes.every(shape => shape === null);

    if (allUsed) {
      this.shapes = [];
      this.fillSlots();
    }
  }

  hasAvailableShapes() {
    return this.shapes.some(shape => shape !== null);
  }

  getAvailableShapes() {
    return this.shapes.filter(shape => shape !== null);
  }
}
