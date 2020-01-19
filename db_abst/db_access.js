var Word = require('../models/word');
var Language = require('../models/language');
var Word = require('../models/word');
var UserStat = require('../models/userstat');
var User = require('../models/user');
//var appLogic = require('../app_logic/appLogic');


var url='mongodb+srv://shaady100:Pass1001@cluster0-69y6r.mongodb.net/d5?retryWrites=true&w=majority';
var mongoose = require('mongoose');
mongoose.connect(url, { useNewUrlParser:true,  useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//tags filtering is ignored for now 
function loadAllWords(languageTag, tags){
	return Language.findOne({speechEngingCode:languageTag}).
	then(
		function(foundLang){
			return Word.find({language:foundLang}).exec();
		}
	).catch(()=>{console.log("in catch block")});
	
}

function loadUserStats2(language, tage, userName){
	return User.findOne({user_name:userName}).
	then(
		function(foundUser){
			return UserStat.find({user:foundUser});
		}
	).catch(console.log);
}

function loadUserStats(language, tage, userName){
	UserStat.aggregate(
	  [
	  //{$lookup: {
		// from:"users",
		// localField: "user",
		// foreignField: "_id",
		// as: "user"

	  // }},
	  // {$match: {
		// "user.user_name": userName
	  // }}
	   // ,
	   {$lookup: {
		from:"languages",
		localField: "language",
		foreignField: "_id",
		as: "language"

	   }},
	   {$match: {
		"language.speechEngingCode": language
	   }}
	   ]
	).then(
		function(results){
			console.log(results);
			process.exit(0);
		}
		
	).catch(console.log);
}





function dfltErrHandler(err){
	console.log(err);
}


module.exports = {
	loadAllWords:loadAllWords,
	loadUserStats:loadUserStats
}