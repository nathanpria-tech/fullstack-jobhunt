// Helper class untuk format respon JSON yang rapi dan konsisten

class SuccessResponse {
  constructor(message = "Success", data = null) {
    this.success = true;
    this.message = message;
    if (data !== null && data !== undefined) {
      this.data = data;
    }
  }
}

class ErrorResponse {
  constructor(message = "Internal server error", errors = null) {
    this.success = false;
    this.message = message;
    if (errors !== null && errors !== undefined) {
      this.errors = errors;
    }
  }
}

module.exports = {
  SuccessResponse,
  ErrorResponse
};
