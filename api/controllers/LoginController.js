/**
 * Created by EL MAKNATI on 11/02/2018.
 */

const users = require("../../config/users.json")

module.exports = {
  login : function (req, res) {
    console.log(users);
  }
}
