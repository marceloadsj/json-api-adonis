"use strict";

const UnsupportedMediaTypeException = require("../exceptions/UnsupportedMediaTypeException");
const NotAcceptableException = require("../exceptions/NotAcceptableException");

const JsonApiService = use("JsonApiService");

const contentType = "application/vnd.api+json";

class JsonApiMiddleware {
  constructor({ Config }) {
    this.config = Config.get("jsonapi");
  }

  async handle({ request, response }, next) {
    const requestContentType = request.header("Content-Type").trim();

    if (requestContentType !== contentType) {
      throw UnsupportedMediaTypeException.invoke(contentType);
    }

    const accept = request.header("Accept");

    if (accept && accept.includes(`${contentType}`)) {
      const parsedAccept = accept.split(",").map(accept => accept.trim());

      const isAcceptValid = parsedAccept.some(accept => {
        if (accept === contentType) return true;
        return false;
      });

      if (!isAcceptValid) {
        throw NotAcceptableException.invoke(contentType);
      }
    }

    if (request.hasBody() && this.config.deserializeBody !== false) {
      const data = request.input("data");

      if (data) {
        request.body = JsonApiService.deserialize(data.type, request.body);
      }
    }

    response.type(contentType);

    await next();
  }
}

module.exports = JsonApiMiddleware;
