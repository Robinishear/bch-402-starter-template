class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack = "") {
    super(message); // Error("My Error Message")
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;



//`AppError`: These are used to create custom 
// errors so that whenever an error occurs anywhere in the server,
// a specific HTTP status code and error message can be returned.