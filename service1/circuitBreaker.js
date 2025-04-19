class CircuitBreaker {
    constructor(options = {}) {
      this.failureThreshold = options.failureThreshold || 5;
      this.recoveryTimeout = options.recoveryTimeout || 5000;
      this.state = 'CLOSED';
      this.failureCount = 0;
      this.nextTry = 0;
    }
  
    // async callService(url) {
    //   if (this.state === 'OPEN') {
    //     if (Date.now() < this.nextTry) {
    //       console.warn('Circuit Breaker đang mở.');
    //       throw new Error('Service 2 tạm thời không khả dụng.');
    //     }
    //     this.state = 'HALF_OPEN';
    //   }
  
    //   try {
    //     const { default: fetch } = await import('node-fetch');
    //     const response = await fetch(url);
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     const data = await response.json();
    //     this.reset();
    //     return data;
    //   } catch (error) {
    //     this.failureCount++;
    //     console.error(`Lỗi khi gọi service: ${error.message} (Lỗi lần ${this.failureCount})`);
    //     if (this.failureCount >= this.failureThreshold) {
    //       this.open();
    //     }
    //     throw error;
    //   }
    // }

    async callService(url, retries = 3, delay = 500) {
      if (this.state === 'OPEN') {
        if (Date.now() < this.nextTry) {
          console.warn('Circuit Breaker đang mở.');
          throw new Error('Service 2 tạm thời không khả dụng.');
        }
        this.state = 'HALF_OPEN';
      }
    
      for (let i = 0; i < retries; i++) {
        try {
          const { default: fetch } = await import('node-fetch');
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          this.reset();
          return data;
        } catch (error) {
          console.error(`Lỗi lần thử ${i + 1}: ${error.message}`);
          if (i === retries - 1) {
            this.failureCount++;
            if (this.failureCount >= this.failureThreshold) {
              this.open();
            }
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    
  
    open() {
      this.state = 'OPEN';
      this.nextTry = Date.now() + this.recoveryTimeout;
      console.log(`Circuit Breaker đã mở. Thử lại sau ${this.recoveryTimeout}ms.`);
    }
  
    reset() {
      this.state = 'CLOSED';
      this.failureCount = 0;
      console.log('Circuit Breaker đã đóng.');
    }
  }
  
  module.exports = CircuitBreaker;