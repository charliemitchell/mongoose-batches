/**
* Written By Charlie Mitchell
* Authored in 2016
* http://github.com/charliemitchell
**/

var promise = require('bluebird');

var defaultOptions = {
    batchSize: 1000
};

module.exports = function (schema) {

    schema.statics.findInBatches = schema.statics.findInBatches || function (find, opts, batchHandler) {
        find = (typeof find === 'object' && find) || {};
        opts = opts || defaultOptions;

        return new promise.Promise(function (resolve, reject) {

          var query = this.find(find);

          this.find(find).count().exec(function (err, count) {
            
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
