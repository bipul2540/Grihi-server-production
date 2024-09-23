class RateLimitError extends Error {
  constructor(message: string = "Too many requests, please try again later.") {
    super(message);
    this.name = "RateLimitError";
  }
}

export default RateLimitError;
