const { LogicalException } = require("@adonisjs/generic-exceptions");

class TypeNotFoundException extends LogicalException {
  static invoke(model) {
    return new this(
      `The type with model '${model}' was not found in json api config file`,
      500,
      "TYPE_NOT_FOUND_EXCEPTION"
    );
  }
}

module.exports = TypeNotFoundException;
