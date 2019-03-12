const { LogicalException } = require("@adonisjs/generic-exceptions");

class MissingConfigTypesException extends LogicalException {
  static invoke() {
    return new this(
      "The 'jsonapi.types' key is missing",
      500,
      "MISSING_CONFIG_TYPES_EXCEPTION"
    );
  }
}

module.exports = MissingConfigTypesException;
