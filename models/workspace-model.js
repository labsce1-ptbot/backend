const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workspaceSchema = Schema(
  {
    access_token: {
      type: String,
      required: false,
      unique: false
    },

    scope: {
      type: String,
      required: false,
      unique: false
    },
    user_id: {
      type: String,
      required: false,
      unique: false
    },
    team_name: {
      type: String,
      required: false,
      unique: false
    },
    team_id: {
      type: String,
      required: false,
      unique: false
    },
    enterprise_id: {
      type: String,
      required: false,
      unique: false
    },
    bot_user_id: {
      type: String,
      required: false,
      unique: false
    },
    bot_access_token: {
      type: String,
      required: false,
      unique: false
    }
  },
  { strict: false }
);

Slack = module.exports = mongoose.model("Workspace", workspaceSchema);
