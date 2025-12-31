/**
 * Loading screen component
 */

export class LoadingScreen {
  private element: HTMLElement;
  private messageElement: HTMLElement;

  constructor() {
    this.element = document.getElementById('load_sc') as HTMLElement;
    this.messageElement = document.getElementById('load_message') as HTMLElement;
  }

  setMessage(message: string): void {
    if (this.messageElement) {
      this.messageElement.textContent = message;
    }
  }

  async hide(): Promise<void> {
    if (!this.element) {
      return;
    }

    return new Promise(resolve => {
      this.element.style.opacity = '1';
      this.element.style.transition = 'opacity 0.5s ease';
      
      requestAnimationFrame(() => {
        this.element.style.opacity = '0';
        
        setTimeout(() => {
          this.element.style.display = 'none';
          resolve();
        }, 500);
      });
    });
  }

  show(): void {
    if (this.element) {
      this.element.style.display = 'flex';
      this.element.style.opacity = '1';
    }
  }
}
