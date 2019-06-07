const db = require("monk");
/** 
@param {Object} config
@return {Object}
*/

module.exports = function(config) {
  if (!config || !config.mongoUri) throw new Error("messed up mongo");

  let Events = db(config.mongoUri).get("events");

  let storage = {
    events: {
      get: function(id, cb) {
        Events.findOne({ id: id }, unwrapList(cb));
      },
      save: function(data, cb) {
        Events.findOneAndUpdate(
          {
            id: data.id
          },
          data,
          {
            upsert: true,
            new: true
          },
          cb
        );
      },
      find: function(data, cb) {
        Events.find(data, cb);
      }
    }
  };

  return storage;
};
