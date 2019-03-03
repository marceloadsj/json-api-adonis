"use strict";

const UnsupportedMediaTypeException = require("../exceptions/UnsupportedMediaTypeException");
const NotAcceptableException = require("../exceptions/NotAcceptableException");

const contentType = "application/vnd.api+json";

class JsonApiMiddleware {
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

    response.type(contentType);

    await next();
  }
}

module.exports = JsonApiMiddleware;
