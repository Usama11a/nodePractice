const MongoClient = require('mongodb').MongoClient;

function Database_connection(){
MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("myFirstDatabase");
        return dbo;
    });
}
module.exports = MongoClient.connect;
module.exports = this.uri;