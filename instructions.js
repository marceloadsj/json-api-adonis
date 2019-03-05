const path = require("path");

async function makeConfigFile(cli) {
  try {
    await cli.makeConfig(
      "jsonapi.js",
      path.join(__dirname, "./templates/jsonapi.mustache")
    );

    cli.command.completed("create", "config/jsonapi.js");
  } catch (error) {
    // ignore error
  }
}

module.exports = async cli => {
  await makeConfigFile(cli);
};
