const GENERIC_ERROR = 'Something went wrong. Please try again.';

function sendError(res, status, message) {
  return res.status(status).json({ error: message || GENERIC_ERROR });
}

function sendServerError(res, err, logLabel) {
  if (logLabel) console.error(logLabel, err?.message || err);
  if (err?.name === 'CastError') {
    return sendError(res, 400, 'That record could not be found.');
  }
  return sendError(res, 500, GENERIC_ERROR);
}

module.exports = { GENERIC_ERROR, sendError, sendServerError };
