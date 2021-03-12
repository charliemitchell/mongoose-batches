/**
* Written By Charlie Mitchell
* Authored in 2016
* http://github.com/charliemitchell
**/

var promise = require('bluebird');

module.exports = function (schema) {

  var defaultOptions = { batchSize: 1000 };

  var options = function (opts) {
    var key;
    for (key in opts) {
      if (opts.hasOwnProperty(key)) {
        defaultOptions[key] = opts[key];
      }
    }
    return defaultOptions;
  };


  schema.statics.findInBatches = schema.statics.findInBatches || function (find, opts, batchHandler) {

    find = (typeof find === 'object' && find) || {};

    opts = options(opts || {});

    return new promise.Promise(function (resolve, reject) {

      var query = this.find(find);
      var countQuery = this.find(find);

      if (opts.queryGenerator) {
        query = opts.queryGenerator(query);
        countQuery = opts.queryGenerator(countQuery);
      }

      countQuery.countDocuments().exec(function (err, count) {

        var documentsRemaining = count;

        var processBatch = function (cancel) {

          if (cancel === 'cancel') {
            return resolve();
          }

          if (documentsRemaining > 0) {
            query.skip(count - documentsRemaining).limit(opts.batchSize).select(opts.select || '').exec(function (err, docs) {
              documentsRemaining += -1 * ((docs && docs.length) || opts.batchSize);
              batchHandler(err, docs, processBatch, count, documentsRemaining);
            });
          } else {
            resolve();
          }
        };
        processBatch();
      });
    }.bind(this));
  };
};
