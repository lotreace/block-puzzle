export class ScoreManager {
  constructor() {
    this.score = 0;
    this.element = null;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'score-display';
    this.element.style.cssText = `
      background-color: #2c3e50;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      text-align: center;
    `;

    const label = document.createElement('div');
    label.textContent = 'Score';
    label.style.cssText = `
      font-size: 18px;
      color: #95a5a6;
      margin-bottom: 5px;
    `;

    const scoreValue = document.createElement('div');
    scoreValue.className = 'score-value';
    scoreValue.textContent = '0';
    scoreValue.style.cssText = `
      font-size: 48px;
      color: #ecf0f1;
      font-weight: bold;
    `;

    this.element.appendChild(label);
    this.element.appendChild(scoreValue);

    return this.element;
  }

  addScore(linesCleared) {
    if (linesCleared > 0) {
      this.score += linesCleared * 100;
      this.updateDisplay();
    }
  }

  updateDisplay() {
    const scoreValue = this.element.querySelector('.score-value');
    if (scoreValue) {
      scoreValue.textContent = this.score.toString();
    }
  }

  reset() {
    this.score = 0;
    this.updateDisplay();
  }
}
