/**
 * Created by EL MAKNATI on 11/02/2018.
 */

const users = require("../../config/users.json")

module.exports = {
  login : function (req, res) {
    var username = req.param("username")
    var password = req.param("password")
    if (users[username] && users[username].password == password){
      req.session.user = users[username]
      req.session.authenticated = true
      res.redirect("/")
    }else{
      res.redirect("/login")
    }
  }
}
