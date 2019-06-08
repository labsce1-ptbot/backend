const monk = require("monk");
var MongoClient = require("mongodb").MongoClient;
/** 
// @param {Object} config
// @return {Object}
*/

module.exports = function(config) {
  if (!config || !config.mongoUri) throw new Error("messed up mongo");
  console.log(config.mongoUri);
  // let Events = db(config.mongoUri).get("events");

  const db = monk(config.mongoUri, config.mongoOptions);

  db.catch(err => {
    throw new Error(err);
  });

  const storage = {};

  let tables = ["events", "users"];
  // console.log(config.tables);
  // if config.tables, add to the default tables
  // if (config.tables) {
  //   config.tables.forEach(function(table) {
  //     if (typeof table === "string") {
  //       tables.push(table);
  //     }
  //   });
  // }
  tables.forEach(zone => {
    storage[zone] = getStorage(db, zone);
  });

  return storage;
};
const unwrapList = function(cb) {
  return function(err, data) {
    if (err) return cb(err);
    cb(null, data);
  };
};

function getStorage(db, zone) {
  let table = db.get(zone);

  return {
    get: function(id, cb) {
      return table.findOne({ id: id }, cb);
    },
    save: function(data, cb) {
      return table.findOneAndUpdate(
        {
          id: data.id
        },
        data,
        {
          upsert: true,
          returnNewDocument: true
        },
        cb
      );
    },
    all: cb => table.find({}, cb),

    find: function(data, cb) {
      return table.find(data, cb);
    },
    delete: function(id, cb) {
      return table.findOneAndDelete({ id: id }, cb);
    }
  };
}
