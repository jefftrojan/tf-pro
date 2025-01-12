export class ErrorResponse extends Error {
    statusCode: number;
    data?: any;
  
    constructor(message: string, statusCode: number, data?: any) {
      super(message);
      this.statusCode = statusCode;
      this.data = data;
  
      Object.setPrototypeOf(this, ErrorResponse.prototype);
  
      // Capture stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  
    // Method to create a formatted error response
    toJSON() {
      return {
        success: false,
        error: this.message,
        statusCode: this.statusCode,
        data: this.data,
        stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
      };
    }
  }