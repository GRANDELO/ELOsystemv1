// sessionStore.js
const sessionContexts = {};

exports.getSession = (sessionId) => {
  return sessionContexts[sessionId] || null;
};

exports.setSession = (sessionId, context) => {
  sessionContexts[sessionId] = context;
};

exports.clearSession = (sessionId) => {
  delete sessionContexts[sessionId];
};
