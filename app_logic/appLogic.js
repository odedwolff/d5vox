var Language = require('../models/language');
var Word = require('../models/word');



//send a request for retieving all words that match language pair. return a promise 
function loadAllCandidatingWords(srcLanguage, trgLanguage, tags){
	console.log("entering loadAllCandidatingWords, srcLanguage" + srcLanguage);
	return Word.find({language:srcLanguage});
}

//send a request for retieving all stats that match language pair, user, tag. return a promise 
function loadUserStats(user, srcLanguage, trgLanguage, tags){
	
}




function testLoadWrods(){
	var lang = Language.findOne({speechEngingCode:"HI"}).
	then(
	(foundLang)=>{
		//console.log(results + "\n\n" + typeof(results));
		return loadAllCandidatingWords(foundLang, null, null);
	}, 
	stdErr
	).then(
		(foundWords)=>{
			console.log(foundWords);
		}
		, 
		stdErr
	)
	//process.exit(0);
}


function stdErr(err){
	console.log(err);
}

module.exports.test1 = testLoadWrods;