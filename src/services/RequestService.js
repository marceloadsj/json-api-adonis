"use strict";

const MissingConfigFileException = require("../exceptions/MissingConfigFileException");

class RequestService {
  constructor({ Config, request }) {
    this.config = Config.get("jsonapi");

    if (!this.config) {
      throw MissingConfigFileException.invoke();
    }

    this.request = request;
  }

  _all(key) {
    if (this.config.deserializeBody) {
      if (key === "attributes") {
        return this.request.except(["meta", "links", "relationships"]);
      }

      return this.request.input(key);
    }

    return this.request.input(`data.${key}`);
  }

  allAttributes() {
    return this._all("attributes");
  }

  allMeta() {
    return this._all("meta");
  }

  _onlyOrExcept(keys, method, mainKey) {
    if (this.config.deserializeBody) {
      if (mainKey !== "attributes") {
        keys = keys.map(key => `${mainKey}.${key}`);
      }

      const data = this.request[method](keys);

      if (mainKey === "attributes") return data;

      return data[mainKey];
    }

    keys = keys.map(key => `data.${mainKey}.${key}`);

    const { data } = this.request[method](keys);

    return data[mainKey];
  }

  onlyAttributes(keys) {
    return this._onlyOrExcept(keys, "only", "attributes");
  }

  onlyMeta(keys) {
    return this._onlyOrExcept(keys, "only", "meta");
  }

  exceptAttributes(keys) {
    return this._onlyOrExcept(keys, "except", "attributes");
  }

  exceptMeta(keys) {
    return this._onlyOrExcept(keys, "except", "meta");
  }

  _input(key, defaultValue, mainKey) {
    if (this.config.deserializeBody) {
      if (mainKey === "attributes") {
        return this.request.input(key, defaultValue);
      }

      return this.request.input(`${mainKey}.${key}`, defaultValue);
    }

    return this.request.input(`data.${mainKey}.${key}`, defaultValue);
  }

  inputAttribute(key, defaultValue) {
    return this._input(key, defaultValue, "attributes");
  }

  inputMeta(key, defaultValue) {
    return this._input(key, defaultValue, "meta");
  }
}

module.exports = RequestService;
