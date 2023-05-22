var moveController = require('./controllers/movieController')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var passedOn = {
    port: function(){
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("wadProjectDB");
    var i = 0;
    while(moveController.movies[i] != null){
        var data = moveController.movies[i]
        var myobj = { 
        id:data.id,
        title:data.title,
        genres:data.genres,
        overview:data.overview,
        poster_path:data.poster_path,
        release_date:data.release_date,
        rating: data.vote_average,
        runtime: data.runtime

    }; 
    // var movieId=[]
    // var cursor = dbo.collection('movies').find({ id: data.id });   
    // cursor.forEach(function(movie){movieId.push(movie.id)})
   dbo.collection("movies").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");});
i++
}
})
}}

module.exports = passedOn;