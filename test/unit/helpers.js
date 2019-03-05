const http = require("http");
const { Config } = require("@adonisjs/sink");
const Request = require("@adonisjs/framework/src/Request");

const RequestService = require("../src/services/RequestService");

module.exports = {
  createServer: (callback, defaultConfig = {}) => {
    const config = new Config();
    config.set("jsonapi", defaultConfig);

    return http.createServer((request, response) => {
      let body = "";

      request.on("data", chunk => {
        body += chunk.toString();
      });

      request.on("end", () => {
        const requestInstance = new Request(request, response);
        requestInstance.body = JSON.parse(body);

        requestService = new RequestService({
          Config: config,
          request: requestInstance
        });

        callback(requestService);

        response.end();
      });
    });
  }
};
