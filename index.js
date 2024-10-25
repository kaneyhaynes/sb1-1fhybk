const robot = require('robotjs');
const activeWindow = require('active-win');

class ChromeSync {
  constructor() {
    this.isListening = false;
    this.lastPos = { x: 0, y: 0 };
  }

  async getChromeWindows() {
    try {
      const window = await activeWindow();
      if (window && window.owner.name.includes('Chrome')) {
        console.log('Chrome window detected:', window.title);
        return [window];
      }
      return [];
    } catch (err) {
      console.error('Error getting window info:', err);
      return [];
    }
  }

  startListening() {
    if (this.isListening) return;
    this.isListening = true;

    // Monitor mouse movement
    setInterval(() => {
      const mouse = robot.getMousePos();
      if (mouse.x !== this.lastPos.x || mouse.y !== this.lastPos.y) {
        this.handleMouseMove(mouse.x, mouse.y);
        this.lastPos = mouse;
      }
    }, 16); // ~60fps

    console.log('Started monitoring Chrome windows');
  }

  async handleMouseMove(x, y) {
    const windows = await this.getChromeWindows();
    windows.forEach(window => {
      try {
        robot.moveMouse(x, y);
      } catch (err) {
        console.error('Error moving mouse:', err);
      }
    });
  }

  async handleClick(x, y, button = 'left') {
    const windows = await this.getChromeWindows();
    windows.forEach(window => {
      try {
        robot.moveMouse(x, y);
        robot.mouseClick(button);
      } catch (err) {
        console.error('Error clicking mouse:', err);
      }
    });
  }

  async handleKeyPress(key) {
    const windows = await this.getChromeWindows();
    windows.forEach(window => {
      try {
        robot.keyTap(key);
      } catch (err) {
        console.error('Error pressing key:', err);
      }
    });
  }
}

// Start the synchronization
const chromeSync = new ChromeSync();
chromeSync.startListening();

console.log('Chrome window synchronization started. Press Ctrl+C to exit.');