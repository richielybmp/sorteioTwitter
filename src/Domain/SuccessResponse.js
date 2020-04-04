class SuccessResponse {
    constructor(data, message) {
        this.data = data;
        this.message = message;
        this.success = false;
    }
}

module.exports = SuccessResponse