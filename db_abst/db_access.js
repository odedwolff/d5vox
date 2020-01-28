var Word = require('../models/word');
var Language = require('../models/language');
var Word = require('../models/word');
var UserStat = require('../models/userstat');
var User = require('../models/user');
var async = require("async");

//var appLogic = require('../app_logic/appLogic');


var url='mongodb+srv://shaady100:Pass1001@cluster0-69y6r.mongodb.net/d5?retryWrites=true&w=majority';
var mongoose = require('mongoose');
mongoose.connect(url, { useNewUrlParser:true,  useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//tags filtering is ignored for now 
function loadAllWords(languageTag, tags){
	return Language.findOne({languageCodeRef:languageTag}).
	then(
		function(foundLang){
			return Word.find({language:foundLang}).exec();
		}
	).catch(()=>{console.log("in catch block")});
	
}

function loadWordsByLangCode(langCode, tags){
	return Word.find({languageCodeRef:langCode}).exec();
}




function loadUserStats2(language, tage, userName){
	return User.findOne({user_name:userName}).
	then(
		function(foundUser){
			return UserStat.find({user:foundUser});
		}
	).catch(console.log);
}

function loadUserStatsOld(language, tage, userName){
	UserStat.aggregate(
	  [
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

function loadUserStats(langCode, tage, userName){
	return UserStat.find({userNameRef:userName, langCodeRef:langCode}).exec();
}



function loadAllWordsAndTheirAvlStat(langSymbol, userName, tages, handler){
	async.parallel(
		{
			foundWords:function(callback){
				UserStat.find({userNameRef:userName, langCodeRef:langSymbol}).exec()
				.then(function(results){callback(null, results)});
			},
			foundStats:function(callback){
			Word.find({languageCodeRef:langSymbol}).exec()
				.then(function(results){callback(null, results)});
			}
		},
		
		
		//callback, just deligate to argument handler 
		function(err, results){
			
			//console.log()
			var wordsMap = {};
			var key;
			//make a map of wordsIDs to their word
			for(var i = 0; i < results.foundWords.length; i++){
				key=results.foundWords[i].id;
				wordsMap[key]={word:results.foundWords[i], stat:null};
			}
			
			
			
			// for words with existing stat entry, set the "stat" field 
			for(var i = 0; i < results.foundStats.length; i++){
				key=results.foundStats[i].wordSrc;
				console.log("key=" + key);
				wordsMap[key].stat=results.foundStats[i];
			}
			
			//handler(results);
		}
			
	)
}




function dfltErrHandler(err){
	console.log(err);
}


module.exports = {
	loadAllWords:loadAllWords,
	loadUserStats:loadUserStats,
	loadWordsByLangCode:loadWordsByLangCode,
	loadAllWordsAndTheirAvlStat:loadAllWordsAndTheirAvlStat
}