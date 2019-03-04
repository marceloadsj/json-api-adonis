const { LogicalException } = require("@adonisjs/generic-exceptions");

class TypeNotFoundException extends LogicalException {
  static invoke(type) {
    return new this(
      `The type '${type}' was not found in config file`,
      500,
      "TYPE_NOT_FOUND_EXCEPTION"
    );
  }
}

module.exports = TypeNotFoundException;
