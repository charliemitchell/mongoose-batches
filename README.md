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

- 2nd param is the options, currenty only batchSize, select, and queryGenerator.
  - queryGenerator is a function used to modify the query in addition to the query parameter that is passed to `myModel.Find`. It allows you to use the predefined queries build onto the model.

- 3rd param is the "Batch Handler". A function that receives each batch of documents.
  - The batch handler's parameters are
     - 1 any errors returned from the find query
     - 2 (Array) the batch of documents
     - 3 the function to invoke the next batch. (explicitly passing in 'cancel' to nextBatch will stop the operation and invoke the final promise. `nextBatch('cancel')`)
     - 4 The count of docs that matched the query
     - 5 The amount of docs left to find (actual documents unprocessed by your batchHandler can be found by (documentsRemaining + docs.length) )

## Options
```
var options = {
    batchSize : 1000,
    select : {
        name : 1,
        email : 1,
        phone : 1
    },
    queryGenerator: function(query) {
      return query.where({ name: {$ne: null}})
    }
};
```
The select option is an object that gets passed directly to mongoose's select function. The above example would grab 1000 document batches with only the name, email, phone, and _id keys. (_id is always included)

## Final resolution
This is done via promise `then`. The promise will get resolved after all documents have been processed, or the cancel command is sent into the nextBatch function.


