var Word = require('../models/word');
var Language = require('../models/language');
var Word = require('../models/word');
var UserStat = require('../models/userstat');
var User = require('../models/user');
var appLogic = require('../app_logic/appLogic');
var async = require('async');

var url='mongodb+srv://shaady100:Pass1001@cluster0-69y6r.mongodb.net/d5?retryWrites=true&w=majority';

//var url='fakeURL';

var mongoose = require('mongoose');

mongoose.connect(url, { useNewUrlParser:true,  useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



function emptyCollections(next, keepUser){
	function leave(next){
		if(next==null){
			process.exit(0)
		}else{
			next();
		};
	}
	
	return db.dropCollection('languages')
	.then(
		function(){
			console.log("languages colleciton deleted");
			if(!keepUser){
				return db.dropCollection('users');
			}else{
				return new Promise((res,err)=>{res()});
			}
			
		},
		function(err){
			console.log("error at deleting launguages colleciton: " + err);
			return db.dropCollection('users');
		}
	).then(
		function(){
			console.log("users colleciton deleted or kept(depends on options)");
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
			if(next){
				leave(next);
			}else{
					return new Promise(function (res,rej){
						res();
					}
				)	
			}
		},
		function(err){
			console.log("error at deleting userstats colleciton: " + err);
			if(next){
				leave(next);
			}else{
				//"errors" at this stage is also attempting to delete empty, 
				//which is not an error AFAIAC
				return new Promise(function (res,rej){
						res();
				});
			}
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
		correctCount:7,
		userName:user.user_name,
		language:word.language.speechEngingCode
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
	const nmWords = 20;
	
	
	//first saved then referred language 
	var lang1 = new Language({dislpayName:"Hindi",speechEngingCode: "HI"});
	lang1.save()
	.then(
		function(dat){
			console.log("language saved");
			var words = [];
			for(var i=0;i<nmWords;i++)
			{
				word = new Word({
						word: "word" + i,
						language: lang1, 
						tags: 'tag1;tag2;tag3',
						weight:Math.random(),
						transTextByLang:{
								// IT:```word2 in italian
									// another translation of words2 in italian
								// ```,
								IT:'word' + i + 'in italian \n word' + i + ' in italian another translation',
								FR:'word' + i + ' in french'
						}
					
				});
				words.push(word);
			}
			return Word.collection.insert(words);
		},
		function(err){
			console.log("error saving language" + err);
			process.exit(1);
		}
	).then(
		function(){
			console.log("words batch saved");
			process.exit(0);
			
		},
		function(err){
			console.log("error saving words batch " + err);
			process.exit(1);
		}
	)

	
	
}





function testPrepInsertUserStat(userName, lngSymbol, nullProb){
	var loadedLang;
	async.series(
		[
			
			// function(){
				// Language.findOne({speechEngingCode:lngSymbol}).then(
			// (found)=>{loadedLang=found;}
					// ,logError
				// )
			// },
			
			//create referred user and language 
			// function(){
				// async.parallel(){
					
				// }
			// },
			
			//find relevant words 
			function(){
				async.parallel(
					{
						findUser:function(){
							User.find({user_name:userName}, callback(foundUsers));
						},
						findWord: function(){
							//Word.find({language.speechEngingCode:lngSymbol}, callback(foundWords));
							db.Word.aggregate(
							  {$unwind: "$languages"},
							  {$lookup: {
								from:"languages",
								localField: "language",
								foreignField: "_id",
								as: "language"

							   }},
							   {$match: {
								"language.speechEngingCode": "HI"
							   }},
							   function(){
								   callback(foundWords);
							   }
							  )
						}
					
					},
					function(err, results){
						if(err){
							console.log(err);
							process.exit(0);
						}
						console.log(results);
						process.exit(0);
					}
				);
				
			}
		
		],
		(err, results)=>{
			if(err){
				console.log("error at loading lang " + err);
				process.exit(0);
			}
		}
	
	);

}

function logErr(msg){
	console.log("Error" + msg);
}


//user name is needed even if skipUser=true, because it is being referred to by user name by the user stat 
function prepareDB4UserStatTesting(emptyFirst, userName, skipUser){
		const numWords=20;
		const probForStatExist = 0.3;
		
		var attemptsRange = 20;
		var langCode = "JP";
		//var userName = "userName1";
		
	
		var promise;
		if(emptyFirst) {promise = emptyCollections(null, true);}
		else {promise = new Promise();}
		promise
		.then(
			function(){
				if(skipUser){
					return new Promise((res,err)=>{res()});
				}else{
					console.log("saving user");
					var user = new User({user_name: userName, hash_password:"fake_hash_33asdf234dsf324"});
					return user.save()
				}
			}
			,logError)
		.then(
			function(){
				console.log("user saved or skipped, now saving language");
				var language = new Language({code:langCode, dislpayName:"Japanease",speechEngingCode: langCode});
				return language.save()
			},
			logErr)
		.then(
			function(){
				console.log("language saved, now saving some words");
				wordsToSave = [];
				var wordToSave;
				for(var i = 0;i < numWords; i++){
					wordToSave = new Word(
						{word: "word" + i, 
						languageCodeRef: langCode, 
						tags: "tag1:tag2:tag3",
						weight: Math.random(),
						transTextByLang:{
							IT:'word' + i + 'in italian \n word' + i + ' in italian another translation',
							FR:'word' + i + ' in french'
							}
						}
					);
					wordsToSave.push(wordToSave);
				}
				//return Word.collection.insert(wordsToSave)
				return Word.collection.insertMany(wordsToSave)
			},
			logErr)
		.then(
			function(){
				console.log("saved words");
				var userStats = [];
				var rndFlag;
				var usrSttEntry;
				var atmptVal;
				var succVal;
				//console.log("language =" + language);
				for(i in wordsToSave){
					//console.log("word =" + word);
					rndFlag = Math.random() > probForStatExist;
					atmptVal=Math.floor(Math.random() * attemptsRange) + 4;
					//make success rate uniformly disributed
					succVal=Math.floor(Math.random() * atmptVal) + 2;
					if(rndFlag){
						usrSttEntry= new UserStat(
						{
							userNameRef:userName,
							langCodeRef:langCode,
							srcWord:wordsToSave[i], 
							attemptsCount:atmptVal,
							correctCount:succVal	
						});
						userStats.push(usrSttEntry);
					}
				}
				return UserStat.collection.insertMany(userStats);
			},
			logError
		).then(
			function(){
				console.log("saved user stats");
				process.exit(0);
			},
			function(err){
				console.log("err:" + err);
				process.exit(0);
			}
		).catch((err)=>{
			console.log("caught error" + err);
		});
	
	
}


//updaet user name for all user stat entires of a give user
function updateUserStat_userName(newUserName){
	console.log("updateUserStat_userName()");
	function callback3(err, numAffected){
		console.log("in callback");
		console.log(err + ":" + numAffected);
		process.exit(0);
	}
	var
	//conditions = { userNameRef: 'user1' }
	conditions = { }
	, update = {$set: {userNameRef:newUserName}}
	, options = { multi: true };
	UserStat.update(conditions, update, options, callback3);
}







function findTest(){
  UserStat.findOne({ userNameRef: 'user1' }, function (err, doc){
  doc.userNameRef='new name';
  doc.save();
	});
}




function logError(err){
	console.log(err);
}

/**
typically we don't want to create or delete users with this script, we do it indepentently. we still need to 
provide a user name for the created UserStat entries to refer 
**/

prepareDB4UserStatTesting(true, "user1", true);


//updateUserStat_userName("user1");


