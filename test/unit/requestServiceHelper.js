const http = require("http");
const Request = require("@adonisjs/framework/src/Request");

const RequestService = require("../../src/services/RequestService");

module.exports = {
  createServer: (callback, config = {}) => {
    return http.createServer((request, response) => {
      let body = "";

      request.on("data", chunk => {
        body += chunk.toString();
      });

      request.on("end", () => {
        const requestInstance = new Request(request, response);
        requestInstance.body = JSON.parse(body);

        requestService = new RequestService({
          config,
          request: requestInstance
        });

        callback(requestService);

        response.end();
      });
    });
  }
};
