const { LogicalException } = require("@adonisjs/generic-exceptions");

class UnsupportedMediaTypeException extends LogicalException {
  static invoke(contentType) {
    return new this(
      `The 'Content-Type' header must be '${contentType}'`,
      415,
      "UNSUPPORTED_MEDIA_TYPE_EXCEPTION"
    );
  }
}

module.exports = UnsupportedMediaTypeException;
