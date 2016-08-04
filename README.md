# Mongoose Find In Batches


### Docs are written in ES5, feel free to implement in ES6 etc...

 **setup: myModel.js**

```
var findInBatches = require('mongoose-batches'); 

var myModel = new Schema({
  //... Your Schema Here
});

myModel.plugin(findInBatches);

//... etc
``` 

**usage: someFile.js**

```
var query = {foo : true};
var options = {batchSize : 1000};

myModel.findInBatches(query, options, function (err, docs, next) {
 //.. Do stuff
 next();
}).then(function () {
  // All done
});

```

## About the parameters
- 1st param is the query to send to `myModel.Find`

- 2nd param is the options, currenty only batchSize. This translates to a limit/offset query

- 3rd param is the "Batch Handler". A function that receives each batch of documents.
  - The batch handler's parameters are 
     - 1 any errors returned from the find query 
     - 2 (Array) the batch of documents
     - 3 the function to invoke the next batch. (explicitly passing in 'cancel' to nextBatch will stop the operation and invoke the final promise. `nextBatch('cancel')`)
     - 4 The count of docs that matched the query
     - 5 The amount of docs left to find (actual documents unprocessed by your batchHandler can be found by (documentsRemaining + docs.length) ) 

## Final resolution
This is done via promise `then`. The promise will get resolved after all documents have been processed, or the cancel command is sent into the nextBatch function.
