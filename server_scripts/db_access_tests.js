var db_access= require('../db_abst/db_access');


function testLoadWordsByLang(langTag){
	db_access.loadAllWords(langTag,null)
	.then(
		function(results){
			console.log(results);
			process.exit(0);
		},
		dfltErrHandler
	);
}


function dfltErrHandler(err){
	console.log(err);
}

//test user 2
function testLoadUserStats(){
	db_access.loadUserStats("HI", null, "test user 2");
}

//testLoadWordsByLang("HI");

//console.log(db_access.loadAllWords);


testLoadUserStats();
