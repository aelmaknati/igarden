/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  dashboard : function(req , res){
    var data = {temp : [] , brightness : [] , soil_moisture : [] , gas : [] , humidity : []}
    var labels = []
    var filterDate = new Date()
    filterDate.setHours(filterDate.getHours() - 168);
    Measure.native(function(err, collection) {
      var aggregation = [
        { $match: { createdAt: { $gte : filterDate }} },
        {"$group": {
          "_id": {
            "day" : {
              "$dayOfMonth" :"$createdAt"
            },
            "hour": {
              "$hour": "$createdAt"
            },
            "month": {
              "$month": "$createdAt"
            },
            "year": {
              "$year": "$createdAt"
            }
          },
          "tempAvg" : {"$avg" : "$temp"},
          "brightnessAvg" : {"$avg" : "$brightness"},
          "soilMoistureAvg" : {"$avg" : "$soil_moisture"},
          "humidityAvg" : {"$avg" : "$humidity"},
          "gasAvg" : {"$avg" : "$gas"}
        }
      }, {$sort: {_id: 1}}
      ]
      collection.aggregate(aggregation, function (err, values) {
        values.forEach(function(val) {
          data.temp.push(val.tempAvg)
          data.brightness.push(val.brightnessAvg)
          data.soil_moisture.push(val.soilMoistureAvg)
          data.humidity.push(val.humidityAvg)
          data.gas.push(val.gasAvg)
          labels.push(val._id.day+"/"+(val._id.month)+"/"+val._id.year+" "+val._id.hour+"h")
        });
        res.view("dashboard/dashboard" , {data : data , labels : labels});
      })
    });
  },
  data : function(req , res){
    var page = req.param("page") ? req.param("page") : 1
    var sort = req.param("sort") ? req.param("sort") : "createdAt"
    var order = req.param("order") ? req.param("order") : "DESC"
    var filterz = {}

    var request = Measure.find(filterz).paginate({page: page, limit: 100})
    if (sort) {
      request.sort(sort + " " + order)
    }
    request.exec(function (err, data) {
      if (err) {return res.negotiate(err)}
      Measure.count().where(filterz).exec(function (err, count) {
        if (err) {return res.negotiate(err)}
        var nbPages = Math.ceil(count / 100)
        res.view("data", {data: data, pagination: {nbPages: nbPages, currentPage: page , totalCount : count}, sort: {field: sort, order: order }, filterz : filterz})
      })
    });

  }

};

