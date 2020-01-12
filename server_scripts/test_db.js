var Word = require('../models/word');
var Language = require('../models/language');
var Word = require('../models/word');
var UserStat = require('../models/userstat');
var User = require('../models/user');
var appLogic = require('../app_logic/appLogic');
var async = require('async');

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
	
	return db.dropCollection('languages')
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
			if(next){
				next();
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

function prepareDB4UserStatTesting(emptyFirst){
	// async.series([
		// emptyCollections.bind(null,function(){callback("empty collctions done")),
		//save user
		// function(){
			// var user = new User({user_name: "test user 2", hash_password:"fake_hash_33asdf234dsf324"});
			// user.save()
			// .then(function (info){callback(info)}, logErr);
		// },
		
		// function 
	// ]
		
	// )	
	if(emptyFirst){
		emptyCollections(null).
		then(function(){console.log("then post empty");});
	}
	
}




function logError(err){
	console.log(err);
}




//test1();
//emptyCollections();
//populate2();
//emptyCollections(populate2);

//emptyCollections(poplateWords);
//appLogic.test1();

//testPrepInsertUserStat();

prepareDB4UserStatTesting(true);


