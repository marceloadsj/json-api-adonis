const { LogicalException } = require("@adonisjs/generic-exceptions");

class WrongConfigException extends LogicalException {
  static invoke(config) {
    return new this(
      `The config key '${config}' is in a wrong format`,
      500,
      "WRONG_CONFIG_EXCEPTION"
    );
  }
}

module.exports = WrongConfigException;
