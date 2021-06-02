const path = require("path")

/**
 * Express API error handler.
 */
function errorHandler(error, request, response, next) {
  const { status = 500, message = "Something went wrong!" } = error;
  if (error.status === 404) {
    if (request.originalUrl.startsWith("/api")) {
      response.status(404).json({error: message});
    } else {
      response.sendFile(path.join(__dirname, `/../out/index.html`));
    }
  } else {
    response.status(status).json({ error: message });
  }
}

module.exports = errorHandler;
  