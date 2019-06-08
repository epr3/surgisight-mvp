const { DateTime } = require('luxon');
const {
  fetchSessions,
  fetchSession,
  updateSession,
  deleteSession,
  saveSession
} = require('../services/session');

module.exports = {
  async getSessions(req, res, next) {
    try {
      const sessions = await fetchSessions(req.query);
      res.status(200).send(sessions);
    } catch (e) {
      next(e);
    }
  },
  async getSession(req, res, next) {
    try {
      const session = await fetchSession(req.params.id, req.query);
      res.status(200).send(session);
    } catch (e) {
      next(e);
    }
  },
  async postSession(req, res, next) {
    try {
      const session = await saveSession({
        ...req.body,
        status: 'open',
        createdAt: DateTime.local().toISO()
      });
      res.status(200).send(session);
    } catch (e) {
      next(e);
    }
  },
  async removeSession(req, res, next) {
    try {
      await deleteSession(req.params.id);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  },
  async putSession(req, res, next) {
    try {
      const session = await updateSession({ ...req.body });
      res.status(200).send(session);
    } catch (e) {
      next(e);
    }
  }
};
