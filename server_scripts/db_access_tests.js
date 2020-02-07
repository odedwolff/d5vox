
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

function testLoadByLanCod(){
	db_access.loadWordsByLangCode("JP", null)
	.then((results)=>{
		console.log(results);process.exit(1);}
	
	)
	.catch(()=>{console.log("in catch block")});
}

function testUserStat(){
	db_access.loadUserStats("JP", null, "avg joe")
	.then((results)=>{
		console.log(results);process.exit(1);}
	)
	.catch(()=>{console.log("in catch block")});
	
}

function testLoadWordsAndStats(){
	try{
		db_access.loadAllWordsAndTheirAvlStat("JP", "avg joe" , null, 
			(results)=>{
				console.log(results);
				process.exit(0);
			}
		);
	}catch(err){
		console.log(err);
		process.exit(0);
	}
}

//testLoadWordsByLang("JP");

//console.log(db_access.loadAllWords);


//testLoadByLanCod();

//testUserStat();

testLoadWordsAndStats();

