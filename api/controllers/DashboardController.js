/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

  dashboard : function(req , res){
    var freq = req.param("freq") ?  req.param("freq") : 4
    var data = {temp : [] , brightness : [] , soil_moisture : [] , gas : [] , humidity : []}
    var labels = []
    var labelize = function(){}

    var group = {
      "_id" : {},
      "tempAvg" : {"$avg" : "$temp"},
      "brightnessAvg" : {"$avg" : "$brightness"},
      "soilMoistureAvg" : {"$avg" : "$soil_moisture"},
      "humidityAvg" : {"$avg" : "$humidity"},
      "gasAvg" : {"$avg" : "$gas"}
    }

    if (freq == 0 ){
      Measure.find({}).sort("createdAt DESC").limit(30).exec(function(err , values){
        if (err) {return res.negotiate(err)}
        values.reverse()
        values.forEach(function(val) {
          data.temp.push(val.temp)
          data.brightness.push(val.brightness)
          data.soil_moisture.push(val.soil_moisture)
          data.humidity.push(val.humidity)
          data.gas.push(val.gas)
          var d = new Date(val.createdAt)
          labels.push(d.getHours()+":"+d.getMinutes())
        });
        res.view("dashboard/dashboard" , {data : data , labels : labels});
      })
    }
    else {
      if (freq > 0) {
        group._id.year = {"$year": "$createdAt"}
        labelize = function (val) {
          return val._id.year
        }
        var filterDate = new Date()
        filterDate.setHours(filterDate.getMonth() - 5);
      }

      if (freq > 1) {
        group._id.month = {"$month": "$createdAt"}
        labelize = function (val) {
          return val._id.month + "/" + val._id.year
        }
        var filterDate = new Date()
        filterDate.setHours(filterDate.getMonth() - 6);
      }

      if (freq > 2) {
        group._id.day = {"$dayOfMonth": "$createdAt"}
        labelize = function (val) {
          return val._id.day + "/" + (val._id.month) + "/" + val._id.year
        }
        var filterDate = new Date()
        filterDate.setHours(filterDate.getDay() - 7);
      }

      if (freq > 3) {
        group._id.hour = {"$hour": "$createdAt"}
        labelize = function (val) {
          return val._id.day + "/" + (val._id.month) + "/" + val._id.year + " " + val._id.hour + "h"
        }
        var filterDate = new Date()
        filterDate.setHours(filterDate.getHours() - 168);
      }


      Measure.native(function (err, collection) {
        if (err) {
          return res.negotiate(err)
        }
        var aggregation = [
          {$match: {createdAt: {$gte: filterDate}}},
          {"$group": group},
          {$sort: {_id: 1}},
        ]
        var cursor = collection.aggregate(aggregation,{  cursor : {}})
        cursor.forEach(function (val) {
          data.temp.push(val.tempAvg)
          data.brightness.push(val.brightnessAvg)
          data.soil_moisture.push(val.soilMoistureAvg)
          data.humidity.push(val.humidityAvg)
          data.gas.push(val.gasAvg)
          labels.push(labelize(val))

        } , function(){
          res.view("dashboard/dashboard", {data: data, labels: labels});
        })


      })
    }
  }
};

