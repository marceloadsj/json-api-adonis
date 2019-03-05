"use strict";

const omit = require("omit");

class RequestService {
  constructor({ config, request }) {
    this.config = config;
    this.request = request;
  }

  _all(key) {
    if (this.config.deserializeBody) {
      if (key === "attributes") {
        if (Array.isArray(this.request.body)) {
          return this.request.body.map(data => {
            return omit(["meta", "links", "relationships"], data);
          });
        }

        return this.request.except(["meta", "links", "relationships"]);
      }

      if (Array.isArray(this.request.body)) {
        return this.request.body.map(data => data[key]);
      }

      return this.request.input(key);
    }

    const { data } = this.request.all();

    if (Array.isArray(data)) {
      return data.map(data => data[key]);
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
      if (mainKey === "attributes") {
        if (Array.isArray(this.request.body)) {
          return this.request.body.map(data => {
            let parsedData = {};

            Object.keys(data).forEach(key => {
              if (method === "only" && keys.includes(key)) {
                parsedData[key] = data[key];
              } else if (method === "except" && !keys.includes(key)) {
                parsedData[key] = data[key];
              }
            });

            return parsedData;
          });
        }
      } else {
        if (Array.isArray(this.request.body)) {
          return this.request.body.map(data => {
            let parsedData = {};

            Object.keys(data[mainKey]).forEach(key => {
              if (keys.includes(key)) {
                parsedData[key] = data[mainKey][key];
              }
            });

            return parsedData;
          });
        }

        keys = keys.map(key => `${mainKey}.${key}`);
      }

      const data = this.request[method](keys);

      if (mainKey === "attributes") return data;

      return data[mainKey];
    }

    const body = this.request.all();

    if (Array.isArray(body.data)) {
      return body.data.map(data => {
        let parsedData = {};

        Object.keys(data[mainKey]).forEach(key => {
          if (method === "only" && keys.includes(key)) {
            parsedData[key] = data[mainKey][key];
          } else if (method === "except" && !keys.includes(key)) {
            parsedData[key] = data[mainKey][key];
          }
        });

        return parsedData;
      });
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
        if (Array.isArray(this.request.body)) {
          return this.request.body.map(data => {
            return data[key] === undefined ? defaultValue : data[key];
          });
        }

        return this.request.input(key, defaultValue);
      }

      if (Array.isArray(this.request.body)) {
        return this.request.body.map(data => {
          if (data[mainKey][key] === undefined) return defaultValue;

          return data[mainKey][key];
        });
      }

      return this.request.input(`${mainKey}.${key}`, defaultValue);
    }

    const body = this.request.all();

    if (Array.isArray(body.data)) {
      return body.data.map(data => {
        if (data[mainKey][key] === undefined) return defaultValue;

        return data[mainKey][key];
      });
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
