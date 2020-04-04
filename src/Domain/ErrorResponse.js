class ErrorResponse {
    constructor(data, message) {
        this.data = data;
        this.message = message;
        this.success = false;
    }
}

module.exports = ErrorResponse