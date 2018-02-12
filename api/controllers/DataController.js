/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/
module.exports = {

  list : function(req , res){
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
  },
  post : function (req, res) {
    var data = req.body
    Measure.create(data).exec(function(err , measure){
      res.json(measure)
    })
  },
  last : function(req , res){
    Measure.find({}).sort("createdAt DESC").limit(1).exec(function(err , measure){
      if(err){return res.negotiate(err)}
      res.json(measure[0])
    });
  },
}
