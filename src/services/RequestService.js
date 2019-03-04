"use strict";

class RequestService {
  constructor({ Config, request }) {
    this.config = Config.get("jsonapi");
    this.request = request;
  }

  allMeta() {
    if (this.config.deserializeBody === false) {
      return this.request.input("data.meta");
    }

    return this.request.input("meta");
  }

  _onlyOrExcept(keys, method) {
    if (this.config.deserializeBody === false) {
      keys = keys.map(key => `data.meta.${key}`);

      const {
        data: { meta }
      } = this.request[method](keys);

      return meta;
    }

    keys = keys.map(key => `meta.${key}`);

    const { meta } = this.request[method](keys);

    return meta;
  }

  onlyMeta(keys) {
    this._onlyOrExcept(keys, "only");
  }

  exceptMeta(keys) {
    this._onlyOrExcept(keys, "except");
  }

  inputMeta(key, defaultValue) {
    let value;
    if (this.config.deserializeBody === false) {
      value = this.request.input(`data.meta.${key}`);
    } else {
      value = this.request.input(`meta.${keys}`);
    }

    if (value === undefined) value = defaultValue;

    return value;
  }
}

module.exports = RequestService;
