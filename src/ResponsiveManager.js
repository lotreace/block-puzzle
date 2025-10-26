export class ResponsiveManager {
  constructor() {
    this.boardCellSize = 50;
    this.shapeCellSize = 30;
    this.gap = 2;
    this.updateSizes();
  }

  updateSizes() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // iPhone 13 Mini: 375x812, iPad: 768x1024
    if (viewportWidth < 400) {
      // iPhone 13 Mini and similar small phones
      this.boardCellSize = 35;
      this.shapeCellSize = 22;
      this.gap = 1;
    } else if (viewportWidth < 768) {
      // Larger phones
      this.boardCellSize = 40;
      this.shapeCellSize = 25;
      this.gap = 2;
    } else if (viewportWidth < 1024) {
      // Tablets in portrait
      this.boardCellSize = 50;
      this.shapeCellSize = 30;
      this.gap = 2;
    } else {
      // Desktop
      this.boardCellSize = 50;
      this.shapeCellSize = 30;
      this.gap = 2;
    }
  }

  getSizes() {
    return {
      boardCellSize: this.boardCellSize,
      shapeCellSize: this.shapeCellSize,
      gap: this.gap
    };
  }

  setupResizeListener(callback) {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.updateSizes();
        if (callback) callback();
      }, 250);
    });
  }
}
