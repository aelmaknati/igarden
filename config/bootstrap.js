/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

const SerialPort = require('serialport');

module.exports.bootstrap = function(cb) {

  var port = new SerialPort('COM6', function (err) {
    if (err) {
      return console.log('Error: ', err.message);
    }

    port.on('data', function (data) {
      var values = data.toString("utf8");
      values = values.replace(/\r/g , "")
      values = values.split("\n");
      var data = {
        soil_moisture : parseInt(values[0]),
        humidity : parseFloat(values[1]),
        temp : parseFloat(values[2])
      }
      Measure.create(data , function(err){})
    });

  });

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
