var mongoose = require('mongoose');
var schema = mongoose.Schema;
// Feedback, Reviews, Accounts
var accountSchema={};
var reviewSchema={};
var feedbackSchema={};
mongoose.set('debug',true);
var database = {
    connect: function() {
        mongoose.connect('mongodb://localhost:27017/wadProjectDB', function(err){
            if(err==null) {
                console.log("Connected to Mongo DB");
                //initialize values
                reviewSchema = schema({
                    movieId : Number,
                    title: String,
                    review: String,
                    user:{
                        type: schema.Types.ObjectId,
                        ref: 'account'
                    }                    
                })
                accountSchema = schema({
                    name: String,
                    username: String,
                    password: String, 
                    token: String ,
                    role: String                 
                });

                feedbackSchema = schema({
                    email:String,
                    title:String,
                    feedback:String,
                })
                
                var connection = mongoose.connection;
                reviewModel = connection.model('review', reviewSchema);
                accountModel = connection.model('account', accountSchema);
                feedbackModel = connection.model('feedback', feedbackSchema);

            } else {
                console.log("Error connecting to Mongo DB");
            }
        })
    },
    //Register
    registerUser: function (n, un, p,r, callback) {
        var newUser = new accountModel({
            name: n,
            username: un,
            password: p,
            role:r,
        });
        newUser.save(callback);
    },
    //Login
    login: function (u, p, callback) {
        accountModel.findOne({ username: u, password: p }, callback);
    },
    updateToken: function (id, token, callback) {
        accountModel.findByIdAndUpdate(id, { token: token }, callback);
    },
    checkToken: function(token,callback) {
        accountModel.findOne({token:token},callback);
    },
    removeToken: function(id,callback) {
        accountModel.findByIdAndUpdate(id, {$unset: {token: 1}},callback);
    },
    submitFeedback: function(e,t,f,callback){
        var newFeedback = new feedbackModel({
            email:e,
            title:t,
            feedback:f,
        });
        newFeedback.save(callback);
    },
    submitReview: function(mid,t,r,uid,callback){
        var newReview = new reviewModel({
            movieId:mid,
            title:t,
            review:r,
            user: uid
        });
        newReview.save(callback);
    },
    // .populate is here
    getAReview: function (id, callback) {
        //eventModel.findById(id, callback);
        console.log(id)
        reviewModel.find({movieId : id})
        .populate('user',['name']).exec(callback)
        
    },  
    getUsers: function(callback){
        accountModel.find({},callback)
    },
    getAUser: function(token,callback){
        accountModel.findOne({token:token},callback)
    },
    getFeedbacks: function(callback){
        feedbackModel.find({},callback)
    },
    
    deleteUser: function(id,callback){
        accountModel.findByIdAndDelete(id,callback)
    },
    deleteFeedback: function(id,callback){
        feedbackModel.findByIdAndDelete(id,callback)
    },
    updateUser: function(id,n,un,p,callback){
        var updatedUser = {
            name:n,
            username:un,
            password:p,
        }
        accountModel.findByIdAndUpdate(id,updatedUser,callback)
    },
    checkRole: function(token,callback){
        accountModel.findOne({token:token,role:'admin'},callback)
    }   
    
};

module.exports = database;