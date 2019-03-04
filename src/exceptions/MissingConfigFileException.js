const { LogicalException } = require("@adonisjs/generic-exceptions");

class MissingConfigFileException extends LogicalException {
  static invoke() {
    return new this(
      "The 'config/jsonapi.js' file is missing",
      500,
      "MISSING_CONFIG_FILE_EXCEPTION"
    );
  }
}

module.exports = MissingConfigFileException;
