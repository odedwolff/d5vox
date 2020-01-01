var Word = require('../models/word');
var Language = require('../models/language');
var Word = require('../models/word');
var UserStat = require('../models/userstat');
var User = require('../models/user');

var url='mongodb+srv://shaady100:Pass1001@cluster0-69y6r.mongodb.net/d5?retryWrites=true&w=majority';

var mongoose = require('mongoose');


mongoose.connect(url, { useNewUrlParser:true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



function emptyCollections(next){
	function leave(next){
		if(next==null){
			process.exit(0)
		}else{
			next();
		};
	}
	
	db.dropCollection('languages')
	.then(
		function(){
			console.log("languages colleciton deleted");
			return db.dropCollection('users');
		},
		function(err){
			console.log("error at deleting launguages colleciton: " + err);
			return db.dropCollection('users');
		}
	).then(
		function(){
			console.log("users colleciton deleted");
			return db.dropCollection('words');
		},
		function(err){
			console.log("error at deleting users colleciton: " + err);
			return db.dropCollection('words');
		}
	).then(function(){
			console.log("words colleciton deleted");
			return db.dropCollection('userstats');
		},
		function(err){
			console.log("error at deleting words colleciton: " + err);
			return db.dropCollection('userstats');
		}
	).then(function(){
			console.log("userstats colleciton deleted");
			leave(next);
		},
		function(err){
			console.log("error at deleting userstats colleciton: " + err);
			leave(next);
		}
	)
}



function populate1(){
	var language = new Language({dislpayName:"Hindi",speechEngingCode: "HI"});
	language.save().then(
		function(arg){console.log("language saved")},
		logError
	)
	var user = new User({user_name: "test user 2", hash_password:"fake_hash_33asdf234dsf324"});
	user.save().then(
		function(arg){console.log("user saved")},
		logError
	)
	var word = new Word({word: "word2", language: language, tags: ['tag1','tag2','tag3']});
	word.save().then(
		function(arg){console.log("word saved")},
		logError
	)
	var userstat = new UserStat({
		user: user,
		word:  word,
		attemptsCount: 8, 
		correctCount:7
	});
	userstat.save().then(
		function(arg){console.log("user stat saved")},
		logError
	);
}





function populate2(){
	var user;
	var word;
	var language; 
	
	var saveLanguage = ()=>{
		language = new Language({dislpayName:"Hindi",speechEngingCode: "HI"});
		return language.save();
	}
	var saveUser = ()=>{
		user = new User({user_name: "test user 2", hash_password:"fake_hash_33asdf234dsf324"});
		return user.save(); 
	}
	var saveWord = ()=>{
		word = new Word({
			word: "word2", 
			language: language, 
			tags: 'tag1;tag2;tag3',
			weight:0.45, 
			transTextByLang:{
					// IT:```word2 in italian
						// another translation of words2 in italian
					// ```,
					IT:'word2 in italian \n word2 in italian another translation',
					FR:'word2 in french'
			}
		
		});
		
		return word.save();
	}
	var saveUserStat= ()=>{
		var userstat = new UserStat({
		user: user,
		word:  word,
		attemptsCount: 8, 
		correctCount:7
		});
		return userstat.save();
	}
	
	saveLanguage().
	then(
		(dat)=>{
			console.log("language saved");
			return saveUser();
		},
		(err)=>{
			console.log("error saving language " + err);
			return saveUser();
		}).
	then(
		(dat)=>{
			console.log("user saved");
			return saveWord();
		},
		(err)=>{
			console.log("error saving user " + err);
			return saveWord();
		}).
	then(
		(dat)=>{
			console.log("word saved");
			return saveUserStat();
		},
		(err)=>{
			console.log("error saving word " + err);
			return saveUserStat();
		}).
	then(
		(dat)=>{
			console.log("user stat saved");
			process.exit(0);
		},
		(err)=>{
			console.log("error saving userstat " + err);
			process.exit(0);
		})
}


function poplateWords(){
	
}


function logError(err){
	console.log(err);
}


//test1();
//emptyCollections();
//populate2();

emptyCollections(populate2);

