const { LogicalException } = require("@adonisjs/generic-exceptions");

class NotAcceptableException extends LogicalException {
  static invoke(contentType) {
    return new this(
      `The 'Accept' header must have at least one media type '${contentType}' without parameters`,
      406,
      "NOT_ACCEPTABLE_EXCEPTION"
    );
  }
}

module.exports = NotAcceptableException;
