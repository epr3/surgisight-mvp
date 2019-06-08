const { Session } = require('../models');

module.exports = {
  async fetchSessions(query = null) {
    let object = [];
    try {
      if (query) {
        object = await Session.forge()
          .where({ ...query })
          .fetchAll();
      } else {
        object = await Session.forge().fetchAll();
      }
      return object.toJSON();
    } catch (e) {
      throw e;
    }
  },
  async fetchSession(id, query = null) {
    let object = null;
    try {
      if (query) {
        object = await Session.forge()
          .where({ ...query, id })
          .fetch({ require: true });
      } else {
        object = await Session.forge()
          .where({ id })
          .fetch({ require: true });
      }
      return object.toJSON();
    } catch (e) {
      throw e;
    }
  },
  async updateSession(data) {
    let object = null;
    try {
      object = await Session.forge()
        .where({ id: data.id })
        .fetch({ require: true });
      delete data.id;
      const updatedObject = await object.save({ ...data });
      return updatedObject.toJSON();
    } catch (e) {
      throw e;
    }
  },
  async saveSession(data) {
    let object = null;
    try {
      object = await Session.forge({ ...data }).save();
      return object.toJSON();
    } catch (e) {
      throw e;
    }
  },
  async deleteSession(id) {
    let object = null;
    try {
      object = await Session.forge()
        .where({ id: data.id })
        .fetch({ require: true });
      await object.destroy();
    } catch (e) {
      throw e;
    }
  }
};
