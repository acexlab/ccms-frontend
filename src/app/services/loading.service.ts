import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = 0;
  private readonly loadingSignal = signal<boolean>(false);
  private timeoutId: any = null;

  readonly isLoading = this.loadingSignal.asReadonly();

  show(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.loadingSignal.set(true);
      }, 200); // 200ms debounce to prevent flicker on rapid requests
    }
  }

  hide(): void {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
    if (this.activeRequests === 0) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      this.loadingSignal.set(false);
    }
  }
}
